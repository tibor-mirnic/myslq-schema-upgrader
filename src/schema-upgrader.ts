import { ISchemaUpgrader } from './interfaces/schema-upgrader';
import { ISqlScript } from './interfaces/sql-script';

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
      getVersionQuery: 'SELECT Current FROM Version',
      setVersionQuery: 'UPDATE Version SET Current=:version'
    };

    this.upgradeScripts = [];    

    // Apply the configuration
    Object.assign(this.schemaUpgraderConfig, options);    

    this.init();
  }

  init() {
    this.validateSchemaConfig();
    this.createConnection();    
    this.loadScripts();
  }

  createConnection() {
    this.knex = client(Object.assign({
      debug: true,
      client: 'mysql'
    }, this.schemaUpgraderConfig.connectionOptions));
  }

  validateSchemaConfig() {
    if(!this.schemaUpgraderConfig.connectionOptions) {
      throw 'Please define connection config!';
    }

    if(!this.schemaUpgraderConfig.upgradeScriptsPath) {
      throw 'Please define sql scripts upgrade folder path!';
    }
  }  

  loadScripts() {
    if(!fs.pathExistsSync(this.schemaUpgraderConfig.upgradeScriptsPath)) {
      throw 'Unknow scripts path!';
    }

    // read script from folder and save them to an array
    fs.readdirSync(this.schemaUpgraderConfig.upgradeScriptsPath)
    .forEach(sqlScriptPath => {
      let pathParts = sqlScriptPath.split(path.sep);
      let script = pathParts[pathParts.length - 1];      

      this.upgradeScripts.push(<ISqlScript>{
        path: sqlScriptPath,
        name: script.substring(6),
        number: parseInt(script.substring(0, 3)),
        sql: fs.readFileSync(sqlScriptPath, 'UTF8')
      });
    });

    // Sort the array ascending
    this.upgradeScripts.sort((a, b) => {
      return a.number - b.number;
    });
  }

  upgrade() {
    this.knex.transaction(trx => {
      return trx.raw(this.schemaUpgraderConfig.getVersionQuery)
      .then()
    });
  }
}