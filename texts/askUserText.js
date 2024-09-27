import { Composer } from 'grammy'
import { adminMenuKeyboard } from '../keyboards/adminMenuKeyboard.js'

const composer = new Composer()

composer.hears('📨 Обратная связь', async ctx => {
	const config = await Config.findByPk(1)
	if (config.feedbackAvailable) {
		await ctx.conversation.enter('askUserConversation')
	}
})

export default composer
