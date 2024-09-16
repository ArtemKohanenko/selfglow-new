import { sequelize } from '../config/sequelize.js'
import { DataTypes, Model } from 'sequelize'

export class User extends Model {}
User.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		tgId: {
			type: DataTypes.BIGINT(100),
			unique: true,
			allowNull: false,
			field: 'tg_id',
		},
		username: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		fullName: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		firstName: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		lastName: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		isBanned: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
			field: 'is_banned',
		},
		isAdmin: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
			field: 'is_admin',
		},
	},
	{
		sequelize,
		modelName: 'user',
	}
)
