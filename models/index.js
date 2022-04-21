const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
// const env = require("../core/config/env");
const { dbConfig } = require('../config')

const sequelizeCon = new Sequelize(dbConfig);

const finalRefs = {};
// Initialising connections to tables
fs.readdirSync(__dirname)
  .forEach((file) => {
    if (!file.endsWith(".js") || file.startsWith('index')) return;
    let model = require(path.resolve(__dirname, file));
    finalRefs[model.name] = model.init(sequelizeCon, Sequelize);
  });

// Making table connection associations
for (let modelName in finalRefs) {
  if (finalRefs[modelName].associate) finalRefs[modelName].associate(finalRefs);
}

module.exports = { sequelizeCon, ...finalRefs };
