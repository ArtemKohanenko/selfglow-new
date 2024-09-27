import { InlineKeyboard } from 'grammy'
import { User } from '../models/User.js'
import { Payment } from '../models/Payment.js'
import { Subscriber } from './../models/Subscriber.js'
import { Op } from 'sequelize'
import Sequelize from 'sequelize'

export default async ctx => {
	try {
		const users = await User.findAll()
		const payments = await Payment.findAll({ where: { status: 'PAID' } })
		const uniquePayers = await Payment.findAll({
			attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('tg_id')), 'uniqueTgId']],
            raw: true
		})
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
		const subscribedUsers = usersWithSubscribes.filter((user) => user.subscriber.filter((sub) => sub.remaining > 0).length > 0)
		const notRenewUsers = usersWithSubscribes.filter((user) => user.subscriber.filter((sub) => sub.remaining <= 0).length > 0)

		const notRenewSubscribers = await Subscriber.findAll({where: {remaining: {[Op.lt]: 1}}})

		const inline = new InlineKeyboard()
			.text('Список подписчиков', 'subscribersList').row()
			.text('Список не продленных подписок', 'notRenewList').row()
			.text('Таблица пользователей', 'usersList').row()
			.text('Выдать подписку', 'giveSubscription').row()
			.text('Продлить подписку', 'renewSubscription').row()
			.text('Обнулить подписку', 'cancelSubscription').row()
			.text(`🔙 Назад`, `banBack`)

		await ctx.reply(`Всего переходов в бота: ${users.length} чел.
👥Количество подписчиков:
🔸активных подписчиков: ${subscribedUsers.length} чел.
🔸активных подписок: ${subscribers.length}
🔸не продлили подписку: ${notRenewUsers.length} чел.
🔸не продленных подписок: ${notRenewSubscribers.length}
🔸купили подписку: ${uniquePayers.length} чел.
🔸куплено подписок: ${payments.length}
🔸ни разу не купивших: ${usersWithoutSubscriber.length} чел.

В этом меню вы можете добавлять и удалять подписчиков.`,
		{
			reply_markup: inline
		})
	} catch (e) {
		console.log(e)
	}
}
