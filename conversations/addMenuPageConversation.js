import { InlineKeyboard } from 'grammy'
import { MenuPage } from '../models/MenuPage.js'
import settingsButtonsFunction from '../functions/settingsButtonsFunction.js'


export const addMenuPageConversation = async (conversation, ctx) => {
	try {
		const inline = new InlineKeyboard().text('🔙 Назад', 'settingsButtons').row()
		await ctx.reply(
			'Введите текст новой кнопки.',
			{
		 		reply_markup: inline,
			}
		)
		const buttomNameInput = await conversation.waitFor(['message:text', 'callback_query'])
		if(
			buttomNameInput.update.callback_query &&
			buttomNameInput.update.callback_query.data &&
			buttomNameInput.update.callback_query.data === 'settingsButtons'
		) {
			return settingsButtonsFunction(ctx)
		}
		const buttomName = buttomNameInput.message.text

		await ctx.reply(
			'Введите текст новой страницы.',
			{
		 		reply_markup: inline,
			}
		)
		const pageInput = await conversation.waitFor(['message:text', 'callback_query'])
		if(
			pageInput.update.callback_query &&
			pageInput.update.callback_query.data &&
			pageInput.update.callback_query.data === 'settingsButtons'
		) {
			return settingsButtonsFunction(ctx)
		}
		const pageText = pageInput.message.text
		const newPage = await MenuPage.create({buttonText: buttomName, pageText: pageText})
		await ctx.reply(`Страница "${newPage.buttonText}" создана.`, { reply_markup: inline })

		return settingsButtonsFunction(ctx)
	} catch (e) {
		console.log(e)
	}
}
