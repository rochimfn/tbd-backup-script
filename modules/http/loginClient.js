import http from 'http';

const loginClient = (hostname, port, path, data) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname,
            port,
            path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        }

        const req = http.request(options, (res) => {
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
            })
        });

        req.on('error', (e) => {
            reject(e.message);
        });
        req.write(data);
        req.end();
    })
}

export default loginClient;