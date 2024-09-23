import { sequelize } from './config/sequelize.js'
import 'dotenv/config'
import './models/relationships.js'


sequelize.sync()
