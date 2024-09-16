import { sequelize } from '../config/sequelize.js'
import { DataTypes, Model } from 'sequelize'

export class Config extends Model {}
Config.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		showPriceAtTarif: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
			field: 'show_price_at_tarif',
		},
	},
	{
		sequelize,
		modelName: 'config',
	}
)
