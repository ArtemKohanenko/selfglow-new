import { sendCurrentEditingTarif } from '../../functions/sendCurrentEditingTarif.js'
import { Tarif } from '../../models/Tarif.js'
import { InlineKeyboard } from 'grammy'

export const tarifTimeConversation = async (conversation, ctx) => {
	const inline = new InlineKeyboard().text('Отмена', 'tarifEditingBack')
	await ctx.reply(`Введите новую продолжительность тарифа(в днях)`, {
		reply_markup: inline,
	})
	let update = await conversation.waitFor(['message:text', 'callback_query'])

	if (update.update.callback_query) {
		if (update.update.callback_query.data === 'tarifEditingBack') {
			await sendCurrentEditingTarif(ctx)
			return
		}
	} else if (update.update.message) {
		if (!/^\d+$/.test(update.message.text)) {
			do {
				await ctx.reply('Вы должны ввести кол-во в цифрах.')
				update = await conversation.waitFor(['message:text', 'callback_query'])
			} while (!/^\d+$/.test(update.message.text))
		}
		await Tarif.update(
			{ time: update.update.message.text * 24 * 60 },
			{ where: { id: ctx.session.editingTarifId } }
		)
		return sendCurrentEditingTarif(ctx)
	}
}
