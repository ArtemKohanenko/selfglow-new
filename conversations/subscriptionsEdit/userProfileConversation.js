import { User } from '../../models/User.js'
import settingsSubsFunction from '../../functions/settingsSubsFunction.js'
import { getUserProfileForAdmin } from '../../functions/getUserProfileForAdmin.js'
import { InlineKeyboard } from 'grammy'

export const userProfileConversation = async (conversation, ctx) => {
	try {
		const inline = new InlineKeyboard().text('🔙 Назад', 'settingsSubs').row()
		await ctx.reply(
			'Введите @username или ID пользователя, профиль которого хотите открыть.',
			{
		 		reply_markup: inline,
			}
		)
		const userInput = await conversation.waitFor(['message:text', 'callback_query'])
		if(
			userInput.update.callback_query &&
			userInput.update.callback_query.data &&
			userInput.update.callback_query.data === 'settingsSubs'
		) {
			return settingsSubsFunction(ctx)
		}

		let user
		if (userInput.message.text.includes('@')) {
			user = await User.findOne(
				{ where: { username: userInput.message.text } }
			)
		} else {
			user = await User.findOne(
				{ where: { tgId: userInput.message.text } }
			)
		}
		if (!user) {
			return ctx.reply('Пользователь не найден.', { reply_markup: inline })
		}
		return await getUserProfileForAdmin(ctx, user.id)
	} catch (e) {
		console.log(e)
	}
}
