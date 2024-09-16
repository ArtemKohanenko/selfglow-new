import { adminMenuKeyboard } from './../keyboards/adminMenuKeyboard.js'

export async function sendAdminMenu(ctx) {
	await ctx.reply('Админ меню', {
		reply_markup: adminMenuKeyboard,
	})
}
