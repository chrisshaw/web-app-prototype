const config = {
    dbHostPort: "http://" + process.env.DB_HOST + ':' + process.env.DB_PORT,
    dbUser: process.env.DB_UN,
    dbPwd: process.env.DB_PW,
    dbName: process.env.DB_NAME,
};

Object.keys(config).forEach(key => console.log(key, ':', config[key]));

module.exports = config;