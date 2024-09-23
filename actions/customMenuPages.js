import { Composer, InlineKeyboard, Keyboard } from 'grammy'
import { MenuPage } from '../models/MenuPage.js'

const composer = new Composer()
const pages = await MenuPage.findAll()

pages.forEach(page => {
	composer.hears(page.buttonText, async ctx => {
		await ctx.reply(page.pageText)
	})
})

export default composer
