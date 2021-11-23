import checkHealth from './checkHealth.js';
import loginClient from './loginClient.js';


const generateData = ({ email, password }) => {
    return JSON.stringify({
        email,
        password
    });
}

const getToken = async (nodes) => {
    return await Promise.all(nodes.map(async node => {
        const status = { name: node.name, host: node.host, port: node.port, token: null }

        try {
            const data = generateData(node);
            const health = await checkHealth(node.host, node.port);

            if (health === undefined || health.message.toLowerCase() !== 'ok') {
                throw Error('Node is not healthy!')
            }

            const response = await loginClient(node.host, node.port, '/login', data);
            if (response.message.toLowerCase() !== 'login success') {
                throw Error('Login failed!')
            } else {
                status.token = response.data.token;
            }
        } catch (e) {
            console.error(e);
        }

        return status;
    }));
}

export default getToken