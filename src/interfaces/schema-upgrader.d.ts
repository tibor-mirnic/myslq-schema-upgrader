export interface ISchemaUpgrader {
    connectionOptions: any;
    upgradeScriptsPath: string;
    backupPath: string;
    debug?: boolean;
    backupAndRestoreOnError?: boolean;
    deleteOnUpgrade?: boolean;
    getVersionQuery?: string;
    setVersionQuery?: string;
}
