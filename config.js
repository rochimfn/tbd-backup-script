import dotenv from 'dotenv';

const getConfig = () => {
    dotenv.config()
    const host = process.env.MONGO_HOST || '127.0.0.1';
    const username = process.env.MONGO_USERNAME || 'admin';
    const password = process.env.MONGO_PASSWORD || 'password';
    const port = process.env.MONGO_PORT || '27017';
    const database = process.env.MONGO_DATABASE || 'log_shipping';

    return { host, port, username, password, database }
}

export default getConfig