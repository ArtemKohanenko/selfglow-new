import { Composer } from 'grammy'

const composer = new Composer()

composer.callbackQuery('listingAll', async ctx => {
	ctx.listingType = 1
	await ctx.conversation.enter('sendListingConversation')
})

composer.callbackQuery('listingSubscribers', async ctx => {
	ctx.listingType = 2
	await ctx.conversation.enter('sendListingConversation')
})

composer.callbackQuery('listingNotSubscribers', async ctx => {
	ctx.listingType = 3
	await ctx.conversation.enter('sendListingConversation')
})

export default composer
