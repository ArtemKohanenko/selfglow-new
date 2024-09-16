import { Composer } from 'grammy'
import mainMenuFunction from '../functions/mainMenuFunction.js'
import { getAllTarifs } from '../functions/getAllTarifs.js'
import { adminMiddleware } from '../middlewares/adminMiddleware.js'

const composer = new Composer()

composer.hears('🔙 Главное меню', async ctx => {
	await mainMenuFunction(ctx)
})

composer.hears('🛒 Тарифы', async ctx => {
	await getAllTarifs(ctx)
})

export default composer
