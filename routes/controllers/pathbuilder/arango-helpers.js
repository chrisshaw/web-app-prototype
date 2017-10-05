const adb = require('arangojs')
const fs = require('fs')

const DB_MODE = process.env.DB_MODE;
const config = require('../../dbconfig.js')[DB_MODE];
console.log(
    `arango-helpers starting up as well with ${DB_MODE}`,'\n',
    'name: ' + config.dbName, '\n',
    'user: ' + config.dbUser, '\n',
    'pw: ' + config.dbPwd, '\n',
    'port: ' + config.dbHostPort
);
const aql = adb.aql
const db = adb(config.dbHostPort)
db.useDatabase(config.dbName);
db.useBasicAuth(config.dbUser, config.dbPwd);

exports.storeInCollection = async (arrDoc, strCollection, isEdge) => {
    // check of the collection exists
    let collection = await getCollection(strCollection, isEdge);
    
    // console.log("Connected to: " + collection.name);
    return collection.import(arrDoc, {onDuplicate: 'update', details: true, complete: true});
};

exports.storeDocInCollection = async (doc, strCollection, isEdge) => {
    try {
        let collection = await getCollection(strCollection, isEdge)
        const result = await collection.save(doc)
        return result
    } catch (err) {
        console.log(JSON.stringify(err, null, 4))
    }
}

exports.getAll = async strCollection => {
    try {
        let collection = await getCollection(strCollection);
        let cursor = await collection.all();
        let docs = await cursor.all();
        return docs.map(doc => doc._key);     
    } catch (err) {
        console.log(err.toString());
    }
};

exports.aql = async aqlQuery => {
    // const db = db;
    // const db = getDb();
    try {
        const cursor = await db.query(aqlQuery);
        const result = await cursor.all();
        return result;
    } catch (err) {
        console.log(err.toString());
    }    
};

exports.testQuery = async aqlTagFunction => {
    const results = await db.query(aqlTagFunction)
    fs.writeFileSync(process.cwd() + '/results.json', JSON.stringify(await results.all(), null, 4))
}

exports.buildId = (collectionName, documentKey) => {
    return collectionName + '/' + documentKey;
};

exports.buildConnection = (fromId, toId, creatorId) => {
    return {
        _from: fromId,
        _to: toId,
        creator: creatorId
    };
};

const getCollection = async (collectionName, isEdge) => {
    // const db = getDb();
    // const db = db;
    let collection;
    if (isEdge) {
        collection = await db.edgeCollection(collectionName);
    } else {
        collection = await db.collection(collectionName);
    }

    try {
        await collection.get();
    } catch (err) {
        console.log(err.toString());
        await collection.create();
    } finally {
        return collection;
    }
};

exports.getCollection = getCollection

exports.cleanUpCollection = async (collectionName, isEdge) => {
    const collection = await getCollection(collectionName, isEdge)
    await collection.drop()
}

const getDb = () => {
    const db = arangojs(config.dbHostPort);
    db.useDatabase(config.dbName);
    db.useBasicAuth(config.dbUser, config.dbPwd); 
    return db;   
}