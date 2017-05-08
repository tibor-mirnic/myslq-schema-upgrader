export interface ISchemaUpgrader {
    host: string;
    user: string;
    password: string;
    database: string;
    upgradeScriptsPath: string;
    backupPath: string;
    debug?: boolean;
    backupAndRestoreOnError?: boolean;
    deleteOnUpgrade?: boolean;
    getVersionQuery?: string;
    setVersionQuery?: string;
}
