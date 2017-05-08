import { SchemaUpgrader } from './../src/schema-upgrader';
import { SchemaUpgraderError } from './../src/schema-upgrader-error';

import * as path from 'path';

new SchemaUpgrader({  
  host: '127.0.0.1',
  user: 'test',
  password: 'test',
  database: 'test',
  upgradeScriptsPath: path.join(__dirname, 'scripts'),
  backupPath: path.join(__dirname, 'backup')
})
.upgrade()
.then((current: any) => {
  console.log(current);
  process.exit();
})
.catch((error: SchemaUpgraderError) => {
  console.log(error.prettify());
  process.exit();
});