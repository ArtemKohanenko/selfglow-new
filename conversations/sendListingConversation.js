import { InlineKeyboard } from 'grammy'
import sendListings from '../functions/sendListings.js'
import { User } from '../models/User.js'
import sendListingFunction from '../functions/sendListingFunction.js'

export const sendListingConversation = async (conversation, ctx) => {
	const inline = new InlineKeyboard().text(
		'🔙 Назад',
		'backListingConversation'
	)
	await ctx.reply(
		`Отправьте боту то, что хотите отправить. Это может быть текст, картинка, видео, гифка или стикер. (медиагруппа не поддерживается)

* В рассылке Вы можете использовать команды:
— <code>{full_name}</code> — Имя и Фамилия пользователя
— <code>{first_name}</code> — Имя пользователя
— <code>{last_name}</code> — Фамилия пользователя (Если есть)
— <code>{username}</code> — username пользователя (Например: vipsub_support)
— <code>{user_id}</code> — ID пользователя в telegram
— <code>{promo50}</code> — где 50 - размер скидки, на который бот сгенерирует одноразовый индивидуальный промокод)`,
		{
			reply_markup: inline,
		}
	)
	const text = await conversation.waitFor(['message:text', 'callback_query'])
	if (
		text.update.callback_query &&
		text.update.callback_query.data &&
		text.update.callback_query.data === 'backListingConversation'
	) {
		return sendListings(ctx)
	} else {
		return sendListingFunction(ctx, text, ctx.listingType)
	}
}
