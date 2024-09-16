import { Composer } from 'grammy'
import mainMenuFunction from '../functions/mainMenuFunction.js'

const composer = new Composer()

composer.callbackQuery(/^\answerToUserAsk\b/, async ctx => {
	const userId = ctx.callbackQuery.data.split(' ')[1]
	ctx.session.askingUserId = userId
	await ctx.conversation.enter('answerToUserConversation')
})

export default composer
