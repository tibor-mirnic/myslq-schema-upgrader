import { ISchemaUpgrader } from './interfaces/schema-upgrader';
import { ISqlScript } from './interfaces/sql-script';
import { SchemaUpgraderError } from './schema-upgrader-error';

import * as fs from 'fs-extra';
import * as path from 'path';
import * as client from 'knex';

export class SchemaUpgrader {
  private schemaUpgraderConfig: ISchemaUpgrader;

  private upgradeScripts: ISqlScript[];
  private knex: client;

  constructor(options: ISchemaUpgrader) {
    this.schemaUpgraderConfig = <ISchemaUpgrader>{
      backupAndRestoreOnError: true,
      deleteOnUpgrade: false,
      getVersionQuery: 'SELECT current FROM version',
      setVersionQuery: 'UPDATE version SET current=:version'
    };

    this.upgradeScripts = [];    

    // Apply the configuration  
    Object.assign(this.schemaUpgraderConfig, options);    
  }

  createConnection() {
    let config = {
      debug: this.schemaUpgraderConfig.debug,
      client: 'mysql',
      pool: {
        min: 2,
        max: 10
      },
      connection: Object.assign({}, this.schemaUpgraderConfig.connectionOptions)
    };
    
    this.knex = client(config);
  }

  testConnection() {
    return new Promise((resolve, reject) => {
      this.knex.raw('SELECT 1 AS RESULT')
      .then(() => {
        resolve(true);
      })
      .catch((error) => {          
        reject(new SchemaUpgraderError((error || '').toString(), 'Testing Connection Error'));
      });
    });
  }

  validateConfig() {
    if(!this.schemaUpgraderConfig.connectionOptions) {
      throw new SchemaUpgraderError('Please define connection config');
    }

    if(!fs.pathExistsSync(this.schemaUpgraderConfig.upgradeScriptsPath)) {
      throw new SchemaUpgraderError('Please define scripts upgrade folder path');
    }

    if(!fs.pathExistsSync(this.schemaUpgraderConfig.backupPath)) {
      throw new SchemaUpgraderError('Please define database backup location path');
    }
  }  

  loadScripts() {
    fs.readdirSync(this.schemaUpgraderConfig.upgradeScriptsPath)
    .forEach(fileName => {      
      /*
        Sql script naminm convection is xxxx - Description text.sql, where
        xxxx is number from 0000 to 9999
      */
      let scriptNumber = parseInt(fileName.substring(0, 4));
      let filePath = path.join(this.schemaUpgraderConfig.upgradeScriptsPath, fileName);
      let fileContent = fs.readFileSync(filePath, 'UTF8');

      this.upgradeScripts.push(<ISqlScript>{
        path: filePath,
        name: fileName,
        number: scriptNumber,
        sql: fileContent
      });            
    });

    // Sort the array ascending
    this.upgradeScripts.sort((a, b) => {
      return a.number - b.number;
    });
  }

  upgrade() {
    return new Promise((resolve, reject) => {
      try {
        this.validateConfig();
        this.loadScripts();
        this.createConnection();
        this.testConnection()
        .then(() => {     
          this.knex.raw(this.schemaUpgraderConfig.getVersionQuery || '')            
          .then(response => {
            resolve(response[0][0]);
          })
          .catch(error => {              
            reject(new SchemaUpgraderError((error || '').toString()));
          });          
        })
        .catch((error) => {
          reject(error);
        });
      }
      catch(error) {
        reject(error);
      }
    });    
  }
}