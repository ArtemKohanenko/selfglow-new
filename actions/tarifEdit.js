import { Composer } from 'grammy'
import { Tarif } from './../models/Tarif.js'
import { Config } from './../models/Config.js'
import { InlineKeyboard } from 'grammy'
import { adminMiddleware } from '../middlewares/adminMiddleware.js'
import { getAllTarifsForAdmin } from '../functions/getAllTarifsForAdmin.js'

const composer = new Composer()

composer.callbackQuery('tarifName', adminMiddleware, async ctx => {
	await ctx.conversation.enter('tarifNameConversation')
})

composer.callbackQuery('tarifPrice', adminMiddleware, async ctx => {
	await ctx.conversation.enter('tarifPriceConversation')
})

composer.callbackQuery('tarifDescription', adminMiddleware, async ctx => {
	await ctx.conversation.enter('tarifDescriptionConversation')
})

composer.callbackQuery('tarifReceiptName', adminMiddleware, async ctx => {
	await ctx.conversation.enter('tarifReceiptNameConversation')
})

composer.callbackQuery('tarifSuccess', adminMiddleware, async ctx => {
	await ctx.conversation.enter('tarifSuccessConversation')
})

composer.callbackQuery('tarifCurrency', adminMiddleware, async ctx => {
	await ctx.conversation.enter('tarifCurrencyConversation')
})

composer.callbackQuery('tarifTime', adminMiddleware, async ctx => {
	await ctx.conversation.enter('tarifTimeConversation')
})

composer.callbackQuery('tarifBack', adminMiddleware, async ctx => {
	await getAllTarifsForAdmin(ctx)
})

composer.callbackQuery('tarifDelete', adminMiddleware, async ctx => {
	await Tarif.destroy({ where: { id: ctx.session.editingTarifId } })
	const inline = new InlineKeyboard().text('Назад', 'tarifBack')
	await ctx.reply('Вы успешно удалили тариф.', {
		reply_markup: inline,
	})
})

export default composer
