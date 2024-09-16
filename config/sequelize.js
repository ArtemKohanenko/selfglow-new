import { Sequelize } from 'sequelize'

export const sequelize = new Sequelize({
	dialect: 'mysql',
	host: process.env.MYSQL_HOST,
	// port: 3306,
	username: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASS,
	database: process.env.MYSQL_DB,
	timezone: '+03:00',
})
