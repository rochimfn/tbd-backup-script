import uploadLog from "./uploadLog.js";

const transportLog = async (nodeList, mongoConnection) => {
    return await Promise.all(nodeList.map(async node => {
        try {
            if (node.token === null) {
                return;
            }
            const query = { uploaded: { $nin: [node.name] } };
            const backupLogs = await mongoConnection.getMany('backup_logs', query);
            if (backupLogs.length !== 0) {
                const files = backupLogs.map(doc => `${doc.directory}${doc.fileName}`);
                const headers = { 'Authorization': `Bearer ${node.token}` };
                const host = node.host;
                const port = node.port;
                const path = '/upload';
                const success = await uploadLog(files, backupLogs, host, port, path, headers);
                if (success === 'success') {
                    const ids = backupLogs.map(doc => doc._id.valueOf());
                    const filter = { _id: { $in: ids } };
                    const updateDoc = { $push: { uploaded: node.name } };
                    mongoConnection.updateMany('backup_logs', filter, updateDoc);
                }
            }
        } catch (e) {
            console.error(e);
        }
        return true;
    }));
}

export default transportLog;