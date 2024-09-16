import { InlineKeyboard } from 'grammy'
//🔹🔸
export default async function (ctx) {
	const inline = new InlineKeyboard()
		.text('🔹 Отправить всем пользователям', 'listingAll')
		.row()
		.text('🔸 Отправить только подписчикам', 'listingSubscribers')
		.row()
		.text('🔹 Отправить только людям без подписки', 'listingNotSubscribers')
	await ctx.reply(`Выберите группу пользователей для рассылки`, {
		reply_markup: inline,
	})
}
