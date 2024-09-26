import { sendPromoMenu } from '../actions/settingsPromo.js'
import { Promocode } from '../models/Promocode.js'
import { InlineKeyboard } from 'grammy'
import { PromoGroup } from '../models/PromoGroup.js'

export const createPromoGroupConversation = async (conversation, ctx) => {
	try {
		const inline = new InlineKeyboard().text('❌ Отмена', 'settingsPromo')

		await ctx.reply(
			`Введите название новой группы промокодов.`,
			{
				reply_markup: inline
			}
		)
		const groupNameInput = await conversation.waitFor(['message:text', 'callback_query'])
		if (
			groupNameInput.update.callback_query &&
			groupNameInput.update.callback_query.data &&
			groupNameInput.update.callback_query.data === 'settingsPromo'
		) {
			return sendPromoMenu(ctx)
		}
		const groupName = groupNameInput.update.message.text

		const promoGroup = await PromoGroup.create({
			name: groupName
		})
		if (promoGroup) {
			await ctx.reply(`Группа промокодов "${promoGroup.name}" создана.`)
		} else {
			await ctx.reply(
				'Не удалось создать новую группу промокодов.'
			)
		}

		return await sendPromoMenu(ctx)
	} catch (e) {
		console.log(e)
	}
}
