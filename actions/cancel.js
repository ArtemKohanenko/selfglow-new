import { Composer } from 'grammy'
import mainMenuFunction from '../functions/mainMenuFunction.js'

const composer = new Composer()

composer.callbackQuery('cancel', async ctx => {
	await ctx.conversation.exit()
	await mainMenuFunction(ctx)
})

export default composer
