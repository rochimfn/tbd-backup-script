import http from 'http';

const getRestoreLog = (node, path) => {
    return new Promise((resolve, reject) => {
        const options = {
            host: node.host,
            port: node.port,
            path: path,
            headers: { 'Authorization': `Bearer ${node.token}` }
        };

        const req = http.get(options, (res) => {
            if (res.statusCode < 200 || res.statusCode >= 300) {
                return reject(new Error('statusCode=' + res.statusCode));
            }
            let body = [];
            res.on('data', (chunk) => {
                body.push(chunk);
            });
            res.on('end', () => {
                try {
                    body = JSON.parse(Buffer.concat(body).toString());
                } catch (e) {
                    reject(e);
                }
                resolve(body);
            });
        });
        req.on('error', (e) => {
            reject(e.message);
        });
        req.end();
    });
}

const getRestoreLogs = async (nodes) => {
    return await Promise.all(nodes.map(async node => {
        const data = { name: node.name, host: node.host, port: node.port, logs: null }

        try {
            const monitorData = await getRestoreLog(node);

            if (monitorData === undefined || monitorData.message.toLowerCase() !== 'ok') {
                throw Error('Node is not healthy!')
            }

            const response = await getRestoreLog(node, '/monitor');
            if (response.message.toLowerCase() !== 'ok') {
                throw Error('Request failed!')
            } else {
                data.logs = response.data;
            }
        } catch (e) {
            console.error(e);
        }

        return data;
    }));
}

export default getRestoreLogs;