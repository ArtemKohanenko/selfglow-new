import { Resource } from '../models/Resource.js'
import { InlineKeyboard } from 'grammy'

export async function sendResources(ctx) {
	const resources = await Resource.findAll()

	const buttons = resources.map(resource => ({
		text: resource.resourceName,
		callback_data: `selectResource ${resource.id}`,
	}))

	const inlineKeyboard = new InlineKeyboard()

	buttons.forEach(button => {
		inlineKeyboard.text(button.text, button.callback_data).row() // Каждая кнопка на новой строке
	})

	inlineKeyboard.text('➕ Канал', 'addChannel').text('➕ Группа', 'addChat')

	await ctx.reply('Список ваших ресурсов:', {
		reply_markup: inlineKeyboard,
	})
}
