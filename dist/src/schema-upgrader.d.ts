import { ISchemaUpgrader } from './interfaces/schema-upgrader';
export declare class SchemaUpgrader {
    private schemaUpgraderConfig;
    private upgradeScripts;
    private knex;
    constructor(options: ISchemaUpgrader);
    init(): void;
    createConnection(): void;
    validateSchemaConfig(): void;
    loadScripts(): void;
    upgrade(): void;
}
