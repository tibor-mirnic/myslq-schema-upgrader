import { SchemaUpgrader } from './../src/schema-upgrader';
import { SchemaUpgraderError } from './../src/schema-upgrader-error';

import * as path from 'path';

let a = async () => {
  try {
    let upgrader = new SchemaUpgrader({  
      host: '127.0.0.1',
      user: 'test',
      password: 'test',
      database: 'test',
      upgradeScriptsPath: path.join(__dirname, 'scripts'),
      backupPath: path.join(__dirname, 'backup')
    });

    let msg = await upgrader.upgrade();
    console.log(msg);
    process.exit();
  }
  catch(error) {
    const e: SchemaUpgraderError = error;
    console.log(e.prettify());
    process.exit();
  };
}

a();