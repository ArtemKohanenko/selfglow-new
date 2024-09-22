import { InlineKeyboard } from 'grammy'
import { Tarif } from '../models/Tarif.js'
import { Subscriber } from '../models/Subscriber.js'
import { User } from '../models/User.js'
import { Op } from 'sequelize'

export async function getUserProfileForAdmin(ctx, userId) {
	const inline = new InlineKeyboard().text('🔙 Назад', 'settingsSubs').row()
	const user = await User.findByPk(userId)
	const activeSubscribes = await Subscriber.findAll({
		where: {remaining: {[Op.gt]: 0}, userId: userId},
		include: [
			{
				model: Tarif,
				as: 'tarif'
			},
		],
	})
	const notRenewSubscribes = await Subscriber.findAll({
		where: {remaining: {[Op.lt]: 1}, userId: userId},
		include: [
			{
				model: Tarif,
				as: 'tarif'
			},
		],
	})

	await ctx.reply(
`Подписки пользователя ${user.firstName} ${user.lastName ?? ''} (${user.username}):

Активные:
${activeSubscribes.map(sub => `${sub.tarif.name}, Осталось: ${sub.remaining} дней`).join('\n')}

Не продленные:
${notRenewSubscribes.map(sub => `${sub.tarif.name}`).join('\n')}`,
		{
			 reply_markup: inline,
		}
	)
}
