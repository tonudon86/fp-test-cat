const Sequelize = require('sequelize');

class Wallets extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init({
            wallet_id: {
                type: DataTypes.STRING(50),
                primaryKey: true,
            },
            
            wallet_name: DataTypes.STRING(50),         
            is_active: DataTypes.INTEGER(1),
    
        },
            {
                sequelize, freezeTableName: true, tableName: 'mst_wallet',
                defaultScope: {
                    attributes: {
                        exclude: [
                            "createdAt",
                            "updatedAt",
                          
                        ],
                    },
                },
            }
        )
    }

    static associate(models) {
    }
}

module.exports = Wallets;
