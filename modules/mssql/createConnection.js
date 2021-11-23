import mssql from 'mssql';

const createConnection = async (config) => {
    const sqlConfig = {
        user: config.username,
        password: config.password,
        server: config.host,
        port: config.port,
        trustServerCertificate: true,
    };

    await mssql.connect(sqlConfig);

    return mssql;
};

export default createConnection;