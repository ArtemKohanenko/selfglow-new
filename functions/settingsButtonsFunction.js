import { Config } from '../models/Config.js'
import { MenuPage } from '../models/MenuPage.js'


export default async ctx => {
	try {
		const config = await Config.findByPk(1)
		const pages = await MenuPage.findAll()
		const keyboard = pages.map(page => [{
			text: page.buttonText,
			callback_data: `settingsButton ${page.id}`
		}])
		keyboard.push([{
			text: `🔔 ${ config.feedbackAvailable ? 'Откл.' : 'Вкл.'} обратую связь`,
			callback_data: 'switchFeedbackSetting'
		}])
		keyboard.push([{
			text: `🔔 ${ config.vipCommandAvailable ? 'Откл.' : 'Вкл.'} команду /vip`,
			callback_data: 'switchVipCommandSetting'
		}])
		keyboard.push([{
			text: '➕ Меню',
			callback_data: 'addMenuPage'
		}])
		keyboard.push([{
			text: '🔙 Назад',
			callback_data: 'banBack'
		}])

		await ctx.reply(`Создайте новое меню в боте или выберите существующее:`,
		{
			reply_markup: {
				inline_keyboard: keyboard,
			},
		})
	} catch (e) {
		console.log(e)
	}
}
