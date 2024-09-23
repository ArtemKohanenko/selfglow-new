import { sequelize } from '../config/sequelize.js'
import { DataTypes, Model } from 'sequelize'

export class MenuPage extends Model {}
MenuPage.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		buttonText: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		pageText: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: 'menu_pages',
	}
)
