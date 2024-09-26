import { InlineKeyboard } from 'grammy'
import { User } from '../models/User.js'
import { Subscriber } from './../models/Subscriber.js'
import { Op } from 'sequelize'


export default async ctx => {
	try {
		const users = await User.findAll()
		const allTimeSubscribers = await Subscriber.findAll()
		const subscribers = await Subscriber.findAll({where: {remaining: {[Op.gt]: 0}}})

		const usersWithSubscribes = await User.findAll({
			include: [
				{
					model: Subscriber,
					as: 'subscriber', // Используем alias, заданный в ассоциации
				},
			],
		})
		const usersWithoutSubscriber = usersWithSubscribes.filter(
			e => e.subscriber.length == 0
		)

		const notRenewSubscribers = await Subscriber.findAll({where: {remaining: {[Op.lt]: 1}}})

		const inline = new InlineKeyboard()
			.text('Список подписок', 'subscribersList').row()
			.text('Список не продленных подписок', 'notRenewList').row()
			.text('Таблица пользователей', 'usersList').row()
			.text('Выдать подписку', 'giveSubscription').row()
			.text('Продлить подписку', 'renewSubscription').row()
			.text('Обнулить подписку', 'cancelSubscription').row()
			.text(`🔙 Назад`, `banBack`)

		await ctx.reply(`Всего переходов в бота: ${users.length} чел.
👥Количество подписчиков:
🔸активных подписок: ${subscribers.length}
🔸не продленных подписок: ${notRenewSubscribers.length}
🔸куплено подписок: ${allTimeSubscribers.length}
🔸ни разу не купивших: ${usersWithoutSubscriber.length} чел.

В этом меню вы можете добавлять и удалять подписчиков.`,
		{
			reply_markup: inline
		})
	} catch (e) {
		console.log(e)
	}
}
