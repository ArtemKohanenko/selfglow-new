import { Composer, InlineKeyboard } from 'grammy'
import { Tarif } from '../models/Tarif.js'
import { Config } from '../models/Config.js'
import { adminMiddleware } from '../middlewares/adminMiddleware.js'
import { getAllTarifsForAdmin } from '../functions/getAllTarifsForAdmin.js'
import { getAllTarifs } from '../functions/getAllTarifs.js'

const composer = new Composer()

composer.hears('💰 Тарифы', adminMiddleware, async ctx => {
	await getAllTarifsForAdmin(ctx)
})

composer.command('vip', async ctx => {
	await getAllTarifs(ctx)
})

export default composer
