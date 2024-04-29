const MongoClient = require('mongodb').MongoClient;
const { library } = require('./params');

async function getMongoConnections(url, db) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
            if (err) {
                console.error(err)
                return resolve(false);
            }
            else {
                    return resolve(client.db(db));
            }
        })
    });
}

module.exports.connect = async function () {
    let dbs = {};
    dbs.library = await getMongoConnections(`${library}`, 'LibraryManagement');
    return dbs;
};