const createBackup = async (connection, dbList, dir, mongo) => {
    const isDone = await Promise.all(dbList.map(async (db) => {
        try {
            const date = new Date();
            const stamp = date.toLocaleString().replace(/\//g, '').split(', ')[0];
            const fileName = `${db}_${stamp}.bak`;
            const stmt = `BACKUP DATABASE [${db}] TO DISK = N'${dir}${fileName}'`;
            const result = await connection.query(stmt);
            if (result) {
                console.log(`Backup ${db} done!`);
                await mongo.writeOne('backup_logs', { database: db, directory: dir, fileName, type: 'backup', uploaded: [] })
            }
        } catch (error) {
            console.error(error);
        }
    }));

    if (isDone) {
        return true;
    }
}

export default createBackup;