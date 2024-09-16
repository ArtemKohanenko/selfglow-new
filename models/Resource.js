import { sequelize } from '../config/sequelize.js'
import { DataTypes, Model } from 'sequelize'

export class Resource extends Model {}
Resource.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false,
		},
		resourceId: {
			allowNull: false,
			type: DataTypes.TEXT(),
			field: 'resource_id',
		},
		resourceName: {
			allowNull: false,
			type: DataTypes.TEXT(),
			field: 'resource_name',
		},
		resourceType: {
			allowNull: false,
			type: DataTypes.INTEGER,
			field: 'resource_type',
		},
	},
	{
		sequelize,
		modelName: 'resources',
	}
)
