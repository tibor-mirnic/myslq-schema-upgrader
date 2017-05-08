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

    let current = await upgrader.upgrade();
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
  catch(error) {
    const e: SchemaUpgraderError = error;
    console.log(e.prettify());
    process.exit();
  };
}

a();