import { InlineKeyboard } from 'grammy'
import 'dotenv/config'

export const answerToUserConversation = async (conversation, ctx) => {
	try {
		await ctx.reply('Введите ответ')
		const answer = await conversation.wait()
		await ctx.api.sendMessage(
			ctx.session.askingUserId,
			`<b>Тех.поддержка ответила на ваш вопрос:\n\n</b>${answer.message.text}`
		)
		return ctx.reply(`✅ Ответ успешно выслан.`)
	} catch (e) {
		console.log(e)
	}
}
