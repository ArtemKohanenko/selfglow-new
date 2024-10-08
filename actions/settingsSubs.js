import { Composer } from 'grammy'
import { User } from '../models/User.js'
import { Subscriber } from './../models/Subscriber.js'
import { Tarif } from '../models/Tarif.js'
import { Pagination } from '../libs/pagination.js'
import { Op } from 'sequelize'
import settingsSubsFunction from '../functions/settingsSubsFunction.js'

const composer = new Composer()

composer.callbackQuery('settingsSubs', async ctx => {
	settingsSubsFunction(ctx);
})


composer.callbackQuery('subscribersList', async ctx => {
	const usersWithSubscribers = await User.findAll({
		include: [
			{
				model: Subscriber,
				as: 'subscriber',
				include: {
					model: Tarif,
					as: 'tarif'
				},
			},
		],
	})
	const subscribedUsers = usersWithSubscribers.filter((user) => user.subscriber.filter((sub) => sub.remaining > 0).length > 0)

	const data = []
	subscribedUsers.forEach(user => {
		data.push(`Ник: ${user.username}, Телеграм ID: ${user.tgId}, Тарифы: ${user.subscriber
			.map(sub => sub.remaining>0 ? `${sub.tarif.name} (Осталось ${sub.remaining} дней)`:null)
			.filter(el => el !== null).join(', ')}`)
	})
	let pagination = new Pagination({ data })
	let text = await pagination.text()
	let keyboard = await pagination.keyboard()
	if (subscribedUsers.length < 1) {
		await ctx.reply('Список пуст.')
	} else {
		await ctx.reply(text, keyboard)
	}

	pagination.handleActions(composer)
})


composer.callbackQuery('notRenewList', async ctx => {
	const notRenewSubscribers = await Subscriber.findAll({
		where: {remaining: {[Op.lt]: 1}},
		include: [
			{
				model: User,
				as: 'user'
			},
			{
				model: Tarif,
				as: 'tarif', // Используем alias, заданный в ассоциации
			},
		],
	})
	const data = []
	notRenewSubscribers.forEach(subscriber => {
		data.push(`Ник: ${subscriber.user.username}, Телеграм ID: ${subscriber.user.tgId}, Тариф: ${subscriber.tarif.name}`)
	})
	let pagination = new Pagination({ data })
	let text = await pagination.text()
	let keyboard = await pagination.keyboard()
	if (notRenewSubscribers.length < 1) {
		await ctx.reply('Список пуст.')
	} else {
		await ctx.reply(text, keyboard)
	}

	pagination.handleActions(composer)
})


composer.callbackQuery('usersList', async ctx => {
	const users = await User.findAll()
	const data = []
	users.forEach(user => {
		data.push(`Ник: ${user.username}, Имя: ${user.firstName} ${user.lastName ?? ''}, Телеграм ID: ${user.tgId}`)
	})
	let pagination = new Pagination({ data })
	let text = await pagination.text()
	let keyboard = await pagination.keyboard()
	if (users.length < 1) {
		await ctx.reply('Список пуст.')
	} else {
		await ctx.reply(text, keyboard)
	}

	pagination.handleActions(composer)
})


composer.callbackQuery('notRenewList', async ctx => {
	const notRenewSubscribers = await Subscriber.findAll({
		where: {remaining: {[Op.lt]: 1}},
		include: [
			{
				model: User,
				as: 'user'
			},
			{
				model: Tarif,
				as: 'tarif', // Используем alias, заданный в ассоциации
			},
		],
	})
	const data = []
	notRenewSubscribers.forEach(subscriber => {
		data.push(`Ник: ${subscriber.user.username}, Телеграм ID: ${subscriber.user.tgId}, Тариф: ${subscriber.tarif.name}`)
	})
	let pagination = new Pagination({ data })
	let text = await pagination.text()
	let keyboard = await pagination.keyboard()
	if (notRenewSubscribers.length < 1) {
		await ctx.reply('Список пуст.')
	} else {
		await ctx.reply(text, keyboard)
	}

	pagination.handleActions(composer)
})


composer.callbackQuery('giveSubscription', async ctx => {
	await ctx.conversation.enter('giveSubscriptionConversation');
})

composer.callbackQuery('cancelSubscription', async ctx => {
	await ctx.conversation.enter('cancelSubscriptionConversation');
})

composer.callbackQuery('renewSubscription', async ctx => {
	await ctx.conversation.enter('renewSubscriptionConversation');
})


export default composer
