import mongoConnection from './modules/mongo/mongoConnection.js';
import createBackup from './modules/mssql/createBackup.js';
import createMssqlConnection from './modules/mssql/createConnection.js';
import createLog from './modules/mssql/createLog.js';
import prepareDir from './modules/dir/prepareDir.js';
import getConfig from './config.js';
import getToken from './modules/http/getToken.js';
import transportLog from './modules/http/transportLog.js';
import getRestoreLogs from './modules/http/getRestoreLogs.js';

const main = async () => {
  try {
    if (process.argv.length !== 3 || !(['backup', 'log'].includes(process.argv[2]))) {
      console.error('Please specify an argument [backup|log]');
      process.exit(1);
    }

    const mongo = new mongoConnection(getConfig());
    const primaryNode = await mongo.getOne('primary_node');

    const mssqlConnection = await createMssqlConnection(primaryNode);
    const dir = prepareDir(process.platform);

    const mode = process.argv[2];
    const action = {
      'backup': createBackup,
      'log': createLog
    }
    if (await action[mode](mssqlConnection, primaryNode.database, dir, mongo)) {
      mssqlConnection.close();
    }


    const secondaryNode = await mongo.getMany('secondary_node');
    const secondaryCredential = await getToken(secondaryNode);
    if (secondaryCredential) {
      const nodeLogs = await getRestoreLogs(secondaryCredential);
      if (nodeLogs) {
        const isDrop = await mongo.dropCollection('node_monitor');
        if (isDrop) {
          await mongo.writeMany('node_monitor', nodeLogs);
        }
      }
    }
    transportLog(secondaryCredential, mongo);
  } catch (e) {
    console.error(e);
  }
};

main();