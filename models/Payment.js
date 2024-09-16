import { sequelize } from '../config/sequelize.js'
import { DataTypes, Model } from 'sequelize'

export class Payment extends Model {}
Payment.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		tarifId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		tgId: {
			type: DataTypes.BIGINT(100),
			allowNull: false,
			field: 'tg_id',
		},
		status: {
			allowNull: true,
			type: DataTypes.TEXT(),
			defaultValue: 'CREATED',
		},
	},
	{
		sequelize,
		modelName: 'payments',
	}
)
