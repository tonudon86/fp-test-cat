const Sequelize = require('sequelize');

class Cat extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init({
            cat_id: {
                type: DataTypes.STRING(50),
                primaryKey: true,
            },
            
            cat_name: DataTypes.STRING(50),
            cat_disp_order: DataTypes.INTEGER(5),
            cat_img: DataTypes.STRING(300),
            
            is_active: DataTypes.INTEGER(1),
    
        },
            {
                sequelize, freezeTableName: true, tableName: 'mst_cat',
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

module.exports = Cat;
