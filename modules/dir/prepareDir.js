import fs from 'fs';

const prepareDir = (platform) => {
    let dir = '';
    if (platform === 'win32') {
        dir = 'C:\\rc_backup\\';
    } else if (platform === 'linux') {
        dir = '/var/opt/mssql/data/rc_backup/';
    }

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
}

export default prepareDir;