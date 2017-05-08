"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_upgrader_1 = require("./../src/schema-upgrader");
const path = require("path");
let a = () => __awaiter(this, void 0, void 0, function* () {
    try {
        let upgrader = new schema_upgrader_1.SchemaUpgrader({
            host: '127.0.0.1',
            user: 'test',
            password: 'test',
            database: 'test',
            upgradeScriptsPath: path.join(__dirname, 'scripts'),
            backupPath: path.join(__dirname, 'backup')
        });
        let current = yield upgrader.upgrade();
        console.log(current);
        process.exit();
        // .upgrade()
        // .then((current: any) => {
        //   console.log(current);
        //   process.exit();
        // })
        // .catch((error: SchemaUpgraderError) => {
        //   console.log(error.prettify());
        //   process.exit();
        // });
    }
    catch (error) {
        const e = error;
        console.log(e.prettify());
        process.exit();
    }
    ;
});
a();
//# sourceMappingURL=index.js.map