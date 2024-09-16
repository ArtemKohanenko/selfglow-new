import { InlineKeyboard } from 'grammy'
import { Tarif } from '../../models/Tarif.js'
import { sendCurrentEditingTarif } from '../../functions/sendCurrentEditingTarif.js'

export const tarifCurrencyConversation = async (conversation, ctx) => {
	const currencyInline = new InlineKeyboard()
		.text('🇷🇺 RUB', '🇷🇺 RUB')
		.text('💵 USD', '💵 USD')
		.text('💶 EUR', '💶 EUR')
		.text('💷 GBP', '💷 GBP')
		.row()
		.text('Отмена', 'tarifEditingBack')
	await ctx.reply(`Выберите новую валюту для тарифа`, {
		reply_markup: currencyInline,
	})
	const currency = await conversation.waitForCallbackQuery(
		['🇷🇺 RUB', '💵 USD', '💶 EUR', '💷 GBP', 'tarifEditingBack'],
		{
			otherwise: async ctx => {
				await ctx.reply('Используй клавиатуру!', {
					reply_markup: currencyInline,
				})
			},
		}
	)
	if (currency.match === 'cancel') {
		return sendCurrentEditingTarif(ctx)
	} else {
		await Tarif.update(
			{ currency: currency.match },
			{ where: { id: ctx.session.editingTarifId } }
		)
		return sendCurrentEditingTarif(ctx)
	}
}
