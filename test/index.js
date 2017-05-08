"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_upgrader_1 = require("./../src/schema-upgrader");
const path = require("path");
new schema_upgrader_1.SchemaUpgrader({
    connectionOptions: {
        host: '127.0.0.1',
        user: 'test',
        password: 'test',
        database: 'test'
    },
    upgradeScriptsPath: path.join(__dirname, 'scripts'),
    backupPath: path.join(__dirname, 'backupff')
})
    .upgrade()
    .then((current) => {
    console.log(current);
    process.exit();
})
    .catch((error) => {
    console.log(error.prettify());
    process.exit();
});
//# sourceMappingURL=index.js.map