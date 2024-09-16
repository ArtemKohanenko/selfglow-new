import { InlineKeyboard } from 'grammy'
import { Promocode } from '../../models/Promocode.js'
import sendCurrentEditingPromo from '../../functions/sendCurrentEditingPromo.js'

export const editPromoDurationConversation = async (conversation, ctx) => {
	try {
		const inline = new InlineKeyboard().text('Отмена', 'promoEditingBack')
		await ctx.reply(
			`Введите новый срок действия тарифа (0 - если неограниченое)`,
			{
				reply_markup: inline,
			}
		)
		let update = await conversation.waitFor(['message:text', 'callback_query'])

		if (update.update.callback_query) {
			if (update.update.callback_query.data === 'promoEditingBack') {
				await sendCurrentEditingPromo(ctx)
				return
			}
		} else if (update.update.message) {
			if (!/^\d+$/.test(update.message.text)) {
				do {
					await ctx.reply('Вы должны ввести кол-во в цифрах.')
					update = await conversation.waitFor([
						'message:text',
						'callback_query',
					])
				} while (!/^\d+$/.test(update.message.text))
			}
			await Promocode.update(
				{ duration: update.update.message.text },
				{ where: { id: ctx.session.selectedPromoId } }
			)
			return sendCurrentEditingPromo(ctx)
		}
	} catch (e) {
		console.log(e)
	}
}
