import { User } from '../../models/User.js'
import settingsSubsFunction from '../../functions/settingsSubsFunction.js'
import { InlineKeyboard } from 'grammy'
import { getAllTarifsForManuallySubscriber } from '../../functions/getAllTarifsForManuallySubscriber.js'
import { Tarif } from '../../models/Tarif.js'
import { Resource } from '../../models/Resource.js'
import { Subscriber } from '../../models/Subscriber.js'
import { cancelUserTarifs } from '../../functions/cancelUserTarifs.js'

export const cancelSubscriptionConversation = async (conversation, ctx) => {
	try {
		const inline = new InlineKeyboard().text('🔙 Назад', 'settingsSubs').row()
		await ctx.reply(
			'Введите @username или ID пользователя, которому вы хотите обнулить подписку',
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

		let canceledUser
		if (user.message.text.includes('@')) {
			canceledUser = await User.findOne(
				{ where: { username: user.message.text } }
			)
		} else {
			canceledUser = await User.findOne(
				{ where: { tgId: user.message.text } }
			)
		}
		if (!canceledUser) {
			return ctx.reply('Пользователь не найден.', { reply_markup: inline })
		}

		await cancelUserTarifs(ctx, canceledUser.id)
		const cancelledTarifInput = await conversation.waitFor(['callback_query'])

		if(
			cancelledTarifInput.update.callback_query.data &&
			cancelledTarifInput.update.callback_query.data === 'settingsSubs'
		) {
			return settingsSubsFunction(ctx)
		} else if(
			cancelledTarifInput.update.callback_query.data &&
			cancelledTarifInput.update.callback_query.data.split(' ')[0] === 'cancelTarif'
		) {
			const subscribeId = cancelledTarifInput.update.callback_query.data.split(' ')[1]
			const subscriber = await Subscriber.findByPk(subscribeId)

			await subscriber.update({ remaining: 0 })
			try {
				await bot.api.kickChatMember(resource.resourceId, user.tgId)
				console.log('KICKED')
			}
			catch(e) {
				console.log('Пользователя нет в чате, либо произошла ошибка.')
			}
			
			return await ctx.reply('Подписка отменена.', { reply_markup: inline })
		}
	} catch (e) {
		console.log(e)
	}
}
