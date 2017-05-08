import { ISchemaUpgrader } from './interfaces/schema-upgrader';
import { ISqlScript } from './interfaces/sql-script';
import { SchemaUpgraderError } from './schema-upgrader-error';

import * as fs from 'fs-extra';
import * as path from 'path';
import * as client from 'knex';
import * as child_process from 'child_process';
import * as moment from 'moment';

export class SchemaUpgrader {
  private schemaUpgraderConfig: ISchemaUpgrader;

  private upgradeScripts: ISqlScript[];
  private knex: client;

  private currentVersion: string;
  private backupFilePath: string;

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
      connection: {
        host: this.schemaUpgraderConfig.host,
        user: this.schemaUpgraderConfig.user,
        password: this.schemaUpgraderConfig.password,
        database: this.schemaUpgraderConfig.database
      }
    };
    
    this.knex = client(config);
  }

  async testConnection() {
    try {
      await this.knex.raw('SELECT 1 AS RESULT');
      return true;    
    }
    catch(error) {      
      throw new SchemaUpgraderError((error || '').toString(), 'Testing Connection Error');
    }
  }

  validateConfig() {
    if(!this.schemaUpgraderConfig.host || !this.schemaUpgraderConfig.user || !this.schemaUpgraderConfig.password || !this.schemaUpgraderConfig.database) {
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

  backup() {
    let backupDate = moment(new Date()).format('YYYY-MM-DD-HH-mm-ss');
    let fileName = `${this.schemaUpgraderConfig.database}-${this.currentVersion}-migration-${backupDate}.sql`;
    this.backupFilePath = path.join(this.schemaUpgraderConfig.backupPath, fileName);
    
    let command = `mysqldump --databases ${this.schemaUpgraderConfig.database} --add-drop-database --triggers --routines --events --single-transaction --user=${this.schemaUpgraderConfig.user} --password=${this.schemaUpgraderConfig.password} > ${this.backupFilePath}`;
    child_process.execSync(command, { stdio:[0,1,2] });
  }

  restore() {
    let command = `mysql -u ${this.schemaUpgraderConfig.user} -p${this.schemaUpgraderConfig.password} < ${this.backupFilePath}`;
    child_process.execSync(command, { stdio:[0,1,2] });
  }

  // doUpgrade() {
  //   let promiseArray = [];
  //   return new Promise((resolve, reject) => {
  //     try {
  //       let current = parseInt(this.currentVersion);
  //       for(let i = current; i < this.upgradeScripts.length; i++) {
          
  //       }
  //     }
  //     catch(error) {
  //       reject(new SchemaUpgraderError((error || '').toString()));
  //     }
  //   });
  // }

  async upgrade() {
    try {
      this.validateConfig();
      this.loadScripts();
      this.createConnection();

      await this.testConnection();
      let response = await this.knex.raw(this.schemaUpgraderConfig.getVersionQuery || '');
      this.currentVersion = response[0][0]['current'];

      if(this.schemaUpgraderConfig.backupAndRestoreOnError) {
        this.backup();
      }
      
      return this.currentVersion;      
    }
    catch(error) {
      throw error;
    }    
  }
}