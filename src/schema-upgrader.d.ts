import { ISchemaUpgrader } from './interfaces/schema-upgrader';
export declare class SchemaUpgrader {
    private schemaUpgraderConfig;
    private upgradeScripts;
    private knex;
    constructor(options: ISchemaUpgrader);
    createConnection(): void;
    testConnection(): Promise<{}>;
    validateConfig(): void;
    loadScripts(): void;
    upgrade(): Promise<{}>;
}
