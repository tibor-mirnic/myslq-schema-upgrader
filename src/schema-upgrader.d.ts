import { ISchemaUpgrader } from './interfaces/schema-upgrader';
export declare class SchemaUpgrader {
    private schemaUpgraderConfig;
    private upgradeScripts;
    private knex;
    private currentVersion;
    private backupFilePath;
    constructor(options: ISchemaUpgrader);
    createConnection(): void;
    testConnection(): Promise<boolean>;
    validateConfig(): void;
    loadScripts(): void;
    backup(): void;
    restore(): void;
    upgrade(): Promise<string>;
}
