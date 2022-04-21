const Sequelize = require('sequelize');

class SubCat extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init({
            sub_cat_id: {
                type: DataTypes.STRING(50),
                primaryKey: true,
            },
            cat_id:DataTypes.STRING(50),
            sub_cat_name: DataTypes.STRING(50),
            sub_cat_disp_order: DataTypes.INTEGER(5),
            sub_cat_img: DataTypes.STRING(300),
            
            is_active: DataTypes.INTEGER(1),
    
        },
            {
                sequelize, freezeTableName: true, tableName: 'mst_subcat',
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

module.exports = SubCat;
