export declare class SchemaUpgraderError extends Error {
    constructor(message: string, name?: string);
    toJSON(): {
        'name': string;
        'message': string;
        'displayMessage': string;
    };
    prettify(): string;
}
