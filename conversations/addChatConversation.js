import { sendAdminMenu } from '../functions/sendAdminMenu.js'
import { Resource } from '../models/Resource.js'
import { InlineKeyboard } from 'grammy'

export const addChatConversation = async (conversation, ctx) => {
	try {
		const botInfo = await ctx.api.getMe()
		const botUsername = botInfo.username
		const inline = new InlineKeyboard().text('Назад', 'backToResources')
		await ctx.reply(
			`<b>Добавление нового канала</b>

1. Сделайте вашего бота @${botUsername} админом в канале, дайте ему права:
<b>— Добавление участников
— Пригласительные ссылки
— Блокировка участников
— Изменение профиля группы</b>

2. Группа добавится автоматически.`,
			{
				reply_markup: inline,
			}
		)
		// 		const channelIdVar = channelId.message.forward_origin
		// 			? channelId.message.forward_origin.chat.id
		// 			: channelId.message.text
		// 		let channel
		// 		try {
		// 			channel = await ctx.api.getChatAdministrators(channelIdVar)
		// 		} catch (e) {
		// 			return await ctx.reply(
		// 				'Ошибка при добавлении бота. У бота или нету прав администратора, или вы переслали не то сообщение.'
		// 			)
		// 		}
		// 		if (channel[0].user) {
		// 			const isExistChannel = await Resource.findOne({
		// 				where: { resourceId: channelIdVar },
		// 			})
		// 			if (isExistChannel) {
		// 				return await ctx.reply(`Ресурс с таким id уже существует`)
		// 			} else {
		// 				let title
		// 				try {
		// 					title = await ctx.api.getChat(channelIdVar)
		// 				} catch (e) {
		// 					return await ctx.reply(
		// 						'Ошибка при добавлении бота. У бота или нету прав администратора, или вы переслали не то сообщение.'
		// 					)
		// 				}
		// 				const resource = await Resource.create({
		// 					resourceId: channelIdVar,
		// 					tgId: ctx.from.id,
		// 					resourceName: title.title,
		// 					resourceType: 0,
		// 				})
		// 				return await ctx.replyWithHTML(
		// 					`<b>Канал ${title.title} успешно добавлен!</b>

		// Теперь, он может быть использован для тестирования.`
		// 				)
		// 			}
		// 		}
	} catch (e) {
		console.log(e)
	}
}
