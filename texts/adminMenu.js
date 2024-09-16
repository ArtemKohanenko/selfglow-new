import { Composer, InlineKeyboard } from 'grammy'
import { adminMenuKeyboard } from '../keyboards/adminMenuKeyboard.js'
import settingsMenuFunction from './../functions/settingsMenuFunction.js'
import { adminMiddleware } from '../middlewares/adminMiddleware.js'
import { Resource } from '../models/Resource.js'
import { sendResources } from '../functions/sendResources.js'

const composer = new Composer()

composer.hears('⚙️ Админ меню', adminMiddleware, async ctx => {
	await ctx.reply('Админ меню', {
		reply_markup: adminMenuKeyboard,
	})
})

composer.hears(`⚙️ Настройки`, adminMiddleware, async ctx => {
	try {
		await settingsMenuFunction(ctx)
	} catch (e) {
		console.log(e)
	}
})

composer.hears('📈 Каналы / Группы', adminMiddleware, async ctx => {
	await sendResources(ctx)
})

export default composer
