export interface ISchemaUpgrader {
    connectionOptions: any;
    upgradeScriptsPath: string;
    backupLocation: string;
    backupAndRestoreOnError: boolean;
    deleteOnUpgrade: boolean;
    getVersionQuery: string;
    setVersionQuery: string;
}
