import { MongoClient } from 'mongodb';

class mongoConnection {
    constructor({ host, port, username, password, database }) {
        this.uri = `mongodb://${username}:${password}@${host}:${port}/?maxPoolSize=20&w=majority`;
        this.client = new MongoClient(this.uri);
        this.database = database;
    }

    setDatabse(database) {
        this.database = database;
        return this.database;
    }

    async getOne(collection) {
        let data = null;
        try {
            await this.client.connect();
            const database = this.client.db(this.database);
            const primaryNode = database.collection(collection)
            data = await primaryNode.findOne();
        } finally {
            this.client.close();
        }
        return data;
    }

    async getMany(collection, query = {}) {
        let data = null;
        try {
            await this.client.connect();
            const database = this.client.db(this.database);
            const target = database.collection(collection)
            data = await target.find(query).toArray();
        } finally {
            this.client.close();
        }
        return data;
    }

    async writeOne(collection, doc) {
        try {
            await this.client.connect();
            const database = this.client.db(this.database);
            const target = database.collection(collection)
            const result = await target.insertOne(doc);
            console.log(
                `Note has been taken with _id: ${result.insertedId}`,
            );
        } finally {
            this.client.close();
        }
        return true;
    }

    async writeMany(collection, docs) {
        try {
            await this.client.connect();
            const database = this.client.db(this.database);
            const target = database.collection(collection)
            await target.insertMany(docs);
        } finally {
            this.client.close();
        }
        return true;
    }

    async updateMany(collection, filter, updateDoc) {
        try {
            await this.client.connect();
            const database = this.client.db(this.database);
            const target = database.collection(collection)
            await target.updateMany(filter, updateDoc);
            console.log('Update success');
        } finally {
            this.client.close();
        }
        return true;
    }

    async dropCollection(collection) {
        try {
            console.log(collection)
            await this.client.connect();
            const database = this.client.db(this.database);
            const target = database.collection(collection)
            await target.remove({});
            console.log('Drop success');
        } finally {
            this.client.close();
        }
        return true;
    }

}

export default mongoConnection;