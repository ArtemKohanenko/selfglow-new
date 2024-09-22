import { User } from '../../models/User.js'
import settingsSubsFunction from '../../functions/settingsSubsFunction.js'
import { InlineKeyboard } from 'grammy'
import { getAllTarifsForManuallySubscriber } from '../../functions/getAllTarifsForManuallySubscriber.js'
import { Tarif } from '../../models/Tarif.js'
import { Resource } from '../../models/Resource.js'
import { Subscriber } from '../../models/Subscriber.js'

export const giveSubscriptionConversation = async (conversation, ctx) => {
	try {
		const inline = new InlineKeyboard().text('🔙 Назад', 'settingsSubs').row()
		await ctx.reply(
			'Введите @username или ID пользователя, которому вы хотите выдать админку',
			{
		 		reply_markup: inline,
			}
		)
		const user = await conversation.waitFor(['message:text', 'callback_query'])
		if(
			user.update.callback_query &&
			user.update.callback_query.data &&
			user.update.callback_query.data === 'settingsSubs'
		) {
			return settingsSubsFunction(ctx)
		}

		let newSubscriptionUser
		if (user.message.text.includes('@')) {
			newSubscriptionUser = await User.findOne(
				{ where: { username: user.message.text } }
			)
		} else {
			newSubscriptionUser = await User.findOne(
				{ where: { tgId: user.message.text } }
			)
		}
		if (!newSubscriptionUser) {
			return ctx.reply('Пользователь не найден.', { reply_markup: inline })
		}

		await getAllTarifsForManuallySubscriber(ctx);
		const tarifInput = await conversation.waitFor(['callback_query'])
		if(
			tarifInput.update.callback_query.data &&
			tarifInput.update.callback_query.data.split(' ')[0] === 'selectTarifManually'
		) {
			const tarifId = tarifInput.update.callback_query.data.split(' ')[1]
			const tarif = await Tarif.findByPk(tarifId)
			const days = Math.floor(tarif.time / 1440)

			await Subscriber.create({
				userId: newSubscriptionUser.id,
				tarifId: tarifId,
				remaining: days,
			})
			const resource = await Resource.findByPk(tarif.resourceId)
			const invite = await ctx.api.createChatInviteLink(resource.resourceId, {
				member_limit: 1,
			})
			await bot.api.sendMessage(
				newSubscriptionUser.id,
				`Ссылка на ресурс - ${invite.invite_link}`
			)
			await ctx.reply('Подписка успешно выдана.', { reply_markup: inline })

			return settingsSubsFunction(ctx)
		}
		return 
	} catch (e) {
		console.log(e)
		return
	}
}
