"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_upgrader_error_1 = require("./schema-upgrader-error");
const fs = require("fs-extra");
const path = require("path");
const client = require("knex");
const child_process = require("child_process");
const moment = require("moment");
class SchemaUpgrader {
    constructor(options) {
        this.schemaUpgraderConfig = {
            backupAndRestoreOnError: true,
            deleteOnUpgrade: false,
            getVersionQuery: 'SELECT current FROM version',
            setVersionQuery: 'UPDATE version SET current=:version'
        };
        this.upgradeScripts = [];
        // Apply the configuration  
        Object.assign(this.schemaUpgraderConfig, options);
    }
    createConnection() {
        let config = {
            debug: this.schemaUpgraderConfig.debug,
            client: 'mysql',
            pool: {
                min: 2,
                max: 10
            },
            connection: {
                host: this.schemaUpgraderConfig.host,
                user: this.schemaUpgraderConfig.user,
                password: this.schemaUpgraderConfig.password,
                database: this.schemaUpgraderConfig.database
            }
        };
        this.knex = client(config);
    }
    testConnection() {
        return new Promise((resolve, reject) => {
            this.knex.raw('SELECT 1 AS RESULT')
                .then(() => {
                resolve(true);
            })
                .catch((error) => {
                reject(new schema_upgrader_error_1.SchemaUpgraderError((error || '').toString(), 'Testing Connection Error'));
            });
        });
    }
    validateConfig() {
        if (!this.schemaUpgraderConfig.host || !this.schemaUpgraderConfig.user || !this.schemaUpgraderConfig.password || !this.schemaUpgraderConfig.database) {
            throw new schema_upgrader_error_1.SchemaUpgraderError('Please define connection config');
        }
        if (!fs.pathExistsSync(this.schemaUpgraderConfig.upgradeScriptsPath)) {
            throw new schema_upgrader_error_1.SchemaUpgraderError('Please define scripts upgrade folder path');
        }
        if (!fs.pathExistsSync(this.schemaUpgraderConfig.backupPath)) {
            throw new schema_upgrader_error_1.SchemaUpgraderError('Please define database backup location path');
        }
    }
    loadScripts() {
        fs.readdirSync(this.schemaUpgraderConfig.upgradeScriptsPath)
            .forEach(fileName => {
            /*
              Sql script naminm convection is xxxx - Description text.sql, where
              xxxx is number from 0000 to 9999
            */
            let scriptNumber = parseInt(fileName.substring(0, 4));
            let filePath = path.join(this.schemaUpgraderConfig.upgradeScriptsPath, fileName);
            let fileContent = fs.readFileSync(filePath, 'UTF8');
            this.upgradeScripts.push({
                path: filePath,
                name: fileName,
                number: scriptNumber,
                sql: fileContent
            });
        });
        // Sort the array ascending
        this.upgradeScripts.sort((a, b) => {
            return a.number - b.number;
        });
    }
    backup() {
        let backupDate = moment(new Date()).format('YYYY-MM-DD-HH-mm-ss');
        let fileName = `${this.schemaUpgraderConfig.database}-${this.currentVersion}-migration-${backupDate}.sql`;
        this.backupFilePath = path.join(this.schemaUpgraderConfig.backupPath, fileName);
        let command = `mysqldump --databases ${this.schemaUpgraderConfig.database} --add-drop-database --triggers --routines --events --single-transaction --user=${this.schemaUpgraderConfig.user} --password=${this.schemaUpgraderConfig.password} > ${this.backupFilePath}`;
        child_process.execSync(command, { stdio: [0, 1, 2] });
    }
    restore() {
        let command = `mysql -u ${this.schemaUpgraderConfig.user} -p${this.schemaUpgraderConfig.password} < ${this.backupFilePath}`;
        child_process.execSync(command, { stdio: [0, 1, 2] });
    }
    upgrade() {
        return new Promise((resolve, reject) => {
            try {
                this.validateConfig();
                this.loadScripts();
                this.createConnection();
                this.testConnection()
                    .then(() => {
                    this.knex.raw(this.schemaUpgraderConfig.getVersionQuery || '')
                        .then(response => {
                        try {
                            this.currentVersion = response[0][0]['current'];
                            if (this.schemaUpgraderConfig.backupAndRestoreOnError) {
                                this.backup();
                            }
                            resolve(this.currentVersion);
                        }
                        catch (error) {
                            reject(new schema_upgrader_error_1.SchemaUpgraderError((error || '').toString()));
                        }
                    })
                        .catch(error => {
                        reject(new schema_upgrader_error_1.SchemaUpgraderError((error || '').toString()));
                    });
                })
                    .catch((error) => {
                    reject(error);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
}
exports.SchemaUpgrader = SchemaUpgrader;
//# sourceMappingURL=schema-upgrader.js.map