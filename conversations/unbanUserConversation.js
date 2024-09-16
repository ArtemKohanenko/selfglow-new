import { User } from '../models/User.js'
import { Op } from 'sequelize'
import { InlineKeyboard } from 'grammy'
import settingsMenuFunction from '../functions/settingsMenuFunction.js'

export const unbanUserConversation = async (conversation, ctx) => {
	try {
		const inline = new InlineKeyboard().text('🔙 Назад', 'banBack').row()
		await ctx.reply(
			'Введите @username или ID пользователя, которого вы хотите разбанить:',
			{
				reply_markup: inline,
			}
		)
		const user = await conversation.waitFor(['message:text', 'callback_query'])
		if (
			user.update.callback_query &&
			user.update.callback_query.data &&
			user.update.callback_query.data === 'banBack'
		) {
			return settingsMenuFunction(ctx)
		}
		let bannedUser
		if (user.message.text.includes('@')) {
			bannedUser = await User.update(
				{ isBanned: 0 },
				{ where: { username: user.message.text } }
			)
		} else {
			bannedUser = await User.update(
				{ isBanned: 0 },
				{ where: { tgId: user.message.text } }
			)
		}
		if (!bannedUser[0]) {
			return ctx.reply('Пользователь не найден.', { reply_markup: inline })
		}
		return ctx.reply('Пользователь успешно разбанен', { reply_markup: inline })
	} catch (e) {
		console.log(e)
	}
}
