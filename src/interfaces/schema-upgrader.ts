export interface ISchemaUpgrader {
  /*
    Connection options. We are using knex for database manipulation, multiple databases are supported.
  */
  connectionOptions: any;
  
  /*
    Path to sql upgrade scripts folder.
  */
  upgradeScriptsPath: string;
  
  /*
    Location of database backup files. It takes default location.
  */
  backupLocation: string;
  
  /*
    Create a database backup on upgrade and restore database if upgrade fails. Defaults to "true".
  */
  backupAndRestoreOnError: boolean;

  /*
    Delete backup file after successfull database upgrade. Defaults to "false".
  */
  deleteOnUpgrade: boolean;

  /*
    Query to get current database version. Default is 'SELECT Current FROM Version'.
  */
  getVersionQuery: string;

  /*
    Query to set current database version. Default is 'UPDATE Version SET Current=:version'.
  */
  setVersionQuery: string;
}