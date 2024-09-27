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
		vipCommandAvailable: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
			field: 'vip_command_available',
		},
		feedbackAvailable: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
			field: 'feedback_available',
		},
	},
	{
		sequelize,
		modelName: 'config',
	}
)
