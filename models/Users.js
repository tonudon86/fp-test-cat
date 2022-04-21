const Sequelize = require('sequelize');

class Users extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init({
            user_id: {
                type: DataTypes.STRING(50),
                // primaryKey: true,
            },
            
            cat_ids: DataTypes.STRING(50),
            sub_cat_ids: DataTypes.STRING(50),
            wallets_ids: DataTypes.STRING(50),         
            is_active: DataTypes.INTEGER(1),
    
        },
            {
                sequelize, freezeTableName: true, tableName: 'mst_users',
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

module.exports = Users;
