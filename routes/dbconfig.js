const config = {
    PROD: {
        dbHostPort: "http://" + process.env.DB_HOST_PORT,
        dbUser: process.env.DB_USER,
        dbPwd: process.env.DB_PWD,
        dbName: process.env.DB_NAME
    },
    DEV: {
        dbHostPort: "http://" + process.env.DEV_DB_HOST_PORT,
        dbUser: process.env.DEV_DB_USER,
        dbPwd: process.env.DEV_DB_PWD,
        dbName: process.env.DEV_DB_NAME        
    },
    TEST: {
        dbHostPort: "http://" + process.env.TEST_DB_HOST_PORT,
        dbUser: process.env.TEST_DB_USER,
        dbPwd: process.env.TEST_DB_PWD,
        dbName: process.env.TEST_DB_NAME
    },
    LOCAL: {
        dbHostPort: "http://" + process.env.LOCAL_DB_HOST_PORT,
        dbUser: process.env.LOCAL_DB_USER,
        dbPwd: process.env.LOCAL_DB_PWD,
        dbName: process.env.LOCAL_DB_NAME
    }
};

console.log(
    'Starting up with ' + process.env.DB_MODE + ' environment.',
    '\n'
);
Object.keys(config[process.env.DB_MODE]).forEach(key => console.log(key, ':', config[process.env.DB_MODE][key]));

module.exports = config;