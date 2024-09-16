import { sequelize } from '../config/sequelize.js'
import { DataTypes, Model } from 'sequelize'
import { Subscriber } from './Subscriber.js'

export class Tarif extends Model {}
Tarif.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		name: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		price: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		currency: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		time: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		// category
		// dayStart
		// checkName
		receiptName: {
			type: DataTypes.TEXT,
			allowNull: true,
			defaultValue: 'Доступ в телеграмм ресурс',
		},
		successText: {
			type: DataTypes.TEXT,
			allowNull: true,
			defaultValue: '✅ Оплата прошла успешно. Спасибо за покупку!',
		},
		priority: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		payment: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		resourceId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'resources', // Name of the Resource table
				key: 'id',
			},
		},
		// allowedUsers
	},
	{
		sequelize,
		modelName: 'tarif',
	}
)
