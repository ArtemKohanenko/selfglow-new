import { Composer } from 'grammy'
import { Subscriber } from '../models/Subscriber.js'
import { Tarif } from './../models/Tarif.js'

const composer = new Composer()

composer.callbackQuery(/continueSubscription/, async ctx => {
	const subscriberId = ctx.callbackQuery.data.split(' ')[1]
	const subscriber = await Subscriber.findByPk(subscriberId)
	const tarif = await Tarif.findByPk(subscriber.tarifId)
	const tarifTime = tarif.time / 1440
	const updatedSubscriptionTime = subscriber.remaining + tarifTime
	await subscriber.update({ remaining: updatedSubscriptionTime })

	// Отправляем подтверждение пользователю
	await ctx.reply('Ваше время подписки было успешно продлено.')
})

export default composer
