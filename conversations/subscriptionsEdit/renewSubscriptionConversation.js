import { User } from '../../models/User.js'
import settingsSubsFunction from '../../functions/settingsSubsFunction.js'
import { InlineKeyboard } from 'grammy'
import { Subscriber } from '../../models/Subscriber.js'
import { renewUserTarifs } from '../../functions/renewUserTarifs.js'

export const renewSubscriptionConversation = async (conversation, ctx) => {
	try {
		const inline = new InlineKeyboard().text('🔙 Назад', 'settingsSubs').row()
		await ctx.reply(
			'Введите @username или ID пользователя, которому вы хотите обновить подписку.',
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

		await renewUserTarifs(ctx, canceledUser.id)
		const renewTarifInput = await conversation.waitFor(['callback_query'])

		if(
			renewTarifInput.update.callback_query.data &&
			renewTarifInput.update.callback_query.data === 'settingsSubs'
		) {
			return settingsSubsFunction(ctx)
		} else if(
			renewTarifInput.update.callback_query.data &&
			renewTarifInput.update.callback_query.data.split(' ')[0] === 'renewTarif'
		) {
			const subscribeId = renewTarifInput.update.callback_query.data.split(' ')[1]
			const subscriber = await Subscriber.findByPk(subscribeId)

			await ctx.reply('Введите кол-во дней, на которое хотите продлить этот тариф.');
			const daysInput = await conversation.waitFor(['message:text'])
			const days = Number(daysInput.message.text)

			if (days > 0) {
				subscriber.remaining += days;
				await subscriber.save();
				await ctx.reply(`Подписка продлена на ${days} дней.`)
			}
			
			return await settingsSubsFunction(ctx)
		}
	} catch (e) {
		console.log(e)
	}
}
