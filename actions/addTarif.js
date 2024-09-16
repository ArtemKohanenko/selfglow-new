import { Composer } from 'grammy'

const composer = new Composer()

composer.callbackQuery('addTarif', async ctx => {
	console.log('asdasd')
	await ctx.conversation.enter('addTarifConversation')
})

export default composer
