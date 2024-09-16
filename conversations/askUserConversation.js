import { InlineKeyboard } from 'grammy'
import 'dotenv/config'
import mainMenuFunction from '../functions/mainMenuFunction.js'

function getMaxFileSizeObject(array) {
	if (!Array.isArray(array) || array.length === 0) {
		return null // возвращаем null, если массив пустой или не является массивом
	}

	let maxFileSizeObject = array.reduce((max, current) => {
		return max.file_size > current.file_size ? max : current
	})

	return maxFileSizeObject
}

export const askUserConversation = async (conversation, ctx) => {
	try {
		const inline = new InlineKeyboard().text('❌ Отмена', 'cancel')
		await ctx.reply(
			'Задайте ваш вопрос текстом, фотографией, или любым другим медиавложением:',
			{
				reply_markup: inline,
			}
		)
		const question = await conversation.waitFor([
			'message:text',
			'callback_query',
			'message:media',
			'message:animation',
		])
		console.log(question.message.photo)
		if (
			question.update.callback_query &&
			question.update.callback_query.data &&
			question.update.callback_query.data === 'cancel'
		) {
			return mainMenuFunction(ctx)
		} else {
			const inlineAnswer = new InlineKeyboard().text(
				'📝 Ответить',
				`answerToUserAsk ${question.from.id}`
			)
			await ctx.reply('Ваш вопрос успешно отправлен.')
			let media = 0
			let fileId
			if (question.message.photo) {
				fileId = getMaxFileSizeObject(question.message.photo).file_id
				media = 1
			} else if (question.message.video) {
				fileId = getMaxFileSizeObject(question.message.video).file_id
				media = 2
			} else if (question.message.animation) {
				fileId = getMaxFileSizeObject(question.message.video).file_id
				media = 3
			}
			if (question.chat.username) {
				await ctx.api.sendMessage(
					process.env.ADMIN_TG_ID,
					`<b>Пришло новое обращение в поддержку от @${question.chat.username}</b>\n\n${question.message.text}`,
					{
						reply_markup: inlineAnswer,
					}
				)
			} else {
				await ctx.api.sendMessage(
					process.env.ADMIN_TG_ID,
					`<b>Пришло новое обращение в поддержку (аккаунт закрытый)</b>\n\n${question.message.text}`,
					{
						reply_markup: inlineAnswer,
					}
				)
			}
		}
	} catch (e) {
		console.log(e)
	}
}
