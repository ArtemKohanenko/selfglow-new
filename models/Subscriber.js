import { sequelize } from '../config/sequelize.js'
import { DataTypes, Model } from 'sequelize'
import { Tarif } from './Tarif.js'
import { User } from './User.js'

export class Subscriber extends Model {}
Subscriber.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		tarifId: {
			// Foreign key to Tarif model
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'tarifs',
				key: 'id',
			},
		},
		userId: {
			// Foreign key to User model
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'users',
				key: 'id', // Using id field in User model
			},
		},
		remaining: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: 'subscribers',
	}
)
