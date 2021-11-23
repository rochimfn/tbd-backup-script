import checkRecovery from "./checkRecovery.js";

const createLog = async (connection, dbList, dir, mongo) => {
    if (!(await checkRecovery(connection, dbList))) {
        console.error('Check failed, exiting process');
        process.exit(1);
    }

    const isDone = await Promise.all(dbList.map(async (db) => {
        try {
            const today = new Date().toLocaleString().replace(/\//g, '').split(', ');
            const date = today[0];
            const time = today[1].replace(/:/g, '').replace(' ', '');
            const stamp = `${date}_${time}`;
            const fileName = `${db}_${stamp}.log`;
            const stmt = `BACKUP LOG [${db}] TO DISK = N'${dir}${fileName}'`;
            const result = await connection.query(stmt);
            if (result) {
                console.log(`Backup ${db} log done!`);
                await mongo.writeOne('backup_logs', { database: db, directory: dir, fileName, type: 'log', uploaded: [] })
            }
        } catch (error) {
            console.error(error);
        }
    }));

    if (isDone) {
        return true;
    }
}

export default createLog;