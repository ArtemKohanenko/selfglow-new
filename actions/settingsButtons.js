import { Composer, InlineKeyboard } from 'grammy'
import settingsButtonsFunction from '../functions/settingsButtonsFunction.js'
import { MenuPage } from '../models/MenuPage.js'
import { Config } from '../models/Config.js'

const composer = new Composer()
const pages = await MenuPage.findAll()

composer.callbackQuery('settingsButtons', async ctx => {
	settingsButtonsFunction(ctx);
})

composer.callbackQuery('switchFeedbackSetting', async ctx => {
	const config = await Config.findByPk(1)
	if (config.feedbackAvailable) {
		await ctx.reply('Обратная связь отключена.')
	}
	else {
		await ctx.reply('Обратная связь включена.')
	}
	await Config.update({ feedbackAvailable: !config.feedbackAvailable }, { where: { id: 1 } })

	return settingsButtonsFunction(ctx);
})

composer.callbackQuery('switchVipCommandSetting', async ctx => {
	const config = await Config.findByPk(1)
	if (config.vipCommandAvailable) {
		await ctx.reply('Команда /vip отключена.')
	}
	else {
		await ctx.reply('Команда /vip включена.')
	}
	await Config.update({ vipCommandAvailable: !config.vipCommandAvailable }, { where: { id: 1 } })

	return settingsButtonsFunction(ctx);
})


composer.callbackQuery('addMenuPage', async ctx => {
	await ctx.conversation.enter('addMenuPageConversation');
})

composer.callbackQuery(/settingsButton/, async ctx => {
	const pageId = ctx.callbackQuery.data.split(' ')[1]
	const page = await MenuPage.findByPk(pageId)

	const inline = new InlineKeyboard()
	.text('Удалить страницу', `deleteButton ${page.id}`)
	.row()
	.text('🔙 Назад', 'settingsButtons')
	.row()

	await ctx.reply(page.pageText, {
		reply_markup: inline
	})
})

composer.callbackQuery(/deleteButton/, async ctx => {
	const inline = new InlineKeyboard()
	.text('🔙 Назад', 'settingsButtons')
	.row()

	const pageId = Number(ctx.callbackQuery.data.split(' ')[1])
	const page = await MenuPage.findByPk(pageId)
	const deletedCount = await MenuPage.destroy({where: {id: pageId}})

	if (deletedCount > 0) {
		await ctx.reply(`Кнопка "${page.buttonText}" удалена.`, {
			reply_markup: inline
		})
	}
	else {
		await ctx.reply(`Удалить кнопку "${page.buttonText}" не удалось.`, {
			reply_markup: inline
		})
	}
})


export default composer
