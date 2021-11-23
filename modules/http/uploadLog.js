import FormData from 'form-data';
import fs from 'fs';

const uploadLog = (files, metaData, host, port, path, headers) => {
    const cleanMetaData = metaData.map(data => {
        return {
            database: data.database
            , type: data.type
            , filename: data.fileName
        }
    });
    return new Promise((resolve, reject) => {
        try {
            const form = new FormData();
            form.append('metadata', JSON.stringify(cleanMetaData));
            files.forEach(file => {
                form.append('logs',
                    fs.createReadStream(file)
                );
            });
            return form.submit({
                host, port, path, headers
            }, (err, res) => {
                if (err) throw err;
                if (res.statusCode === 201) {
                    console.log('Done');
                    return resolve('success');
                } else {
                    throw new Error('statusCode=' + res.statusCode);
                }
            });
        } catch (e) {
            reject(e);
        }
    })

}

export default uploadLog;