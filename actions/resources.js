import { Composer } from 'grammy'
import { sendResources } from '../functions/sendResources.js'

const composer = new Composer()

composer.callbackQuery('addChannel', async ctx => {
	await ctx.conversation.enter('addChannelConversation')
})

composer.callbackQuery('addChat', async ctx => {
	await ctx.conversation.enter('addChatConversation')
})

composer.callbackQuery('backToResources', async ctx => {
	await sendResources(ctx)
})

export default composer
