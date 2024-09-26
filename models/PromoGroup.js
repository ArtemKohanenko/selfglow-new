import { sequelize } from '../config/sequelize.js'
import { DataTypes, Model } from 'sequelize'

export class PromoGroup extends Model {}
PromoGroup.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		}
	},
	{
		sequelize,
		modelName: 'promo_groups',
	}
)
