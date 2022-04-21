require('dotenv').config()
//NODE_ENV=dev_icontrol pm2 restart icontrol.js --update-env
const configValue = {
    dbConfig: {
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        dialect: 'mysql',
        operatorsAliases: 0,
        define: {
            freezeTableName: true,
        },
        logQueryParameters: true, // log bind parameters
        logging: true,
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        // timezone: "+05:30"
    },
    RAZOR_ID: process.env.RAZOR_ID,
    RAZOR_SECRET: process.env.RAZOR_SECRET,
    RAZOR_REQ_SECRET: process.env.RAZOR_REQ_SECRET,
    PORT: process.env.PORT,
    DOMAIN: process.env.DOMAIN,
};



module.exports = configValue;
