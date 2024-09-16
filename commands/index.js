import { Composer } from 'grammy'
import start from './start.js'

const composer = new Composer()

composer.use(start)

export default composer
