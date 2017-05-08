"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SchemaUpgraderError extends Error {
    constructor(message, name) {
        message = message || 'Schema Upgrader Error Message';
        name = name || 'Schema Upgrader Error';
        super(message);
        this.name = name;
        this.message = message;
    }
    toJSON() {
        return {
            'name': this.name,
            'message': this.message,
            'displayMessage': `${this.name}: ${this.message}`
        };
    }
    prettify() {
        return `${this.name}: ${this.message}.`;
    }
}
exports.SchemaUpgraderError = SchemaUpgraderError;
//# sourceMappingURL=schema-upgrader-error.js.map