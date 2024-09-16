import { sequelize } from '../config/sequelize.js'
import { DataTypes, Model } from 'sequelize'

export class Promocode extends Model {}
Promocode.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		name: {
			allowNull: false,
			type: DataTypes.STRING,
		},
		percent: {
			allowNull: false,
			type: DataTypes.INTEGER,
		},
		activationCount: {
			allowNull: false,
			type: DataTypes.INTEGER,
		},
		activationCountPerUser: {
			defaultValue: 1,
			type: DataTypes.INTEGER,
		},
		duration: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		activatedUsers: {
			type: DataTypes.TEXT,
			defaultValue: '[]',
		},
		type: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		}
	},
	{
		sequelize,
		modelName: 'promocodes',
	}
)
