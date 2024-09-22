import { Tarif } from '../models/Tarif.js'
import { Config } from './../models/Config.js'
import { Subscriber } from '../models/Subscriber.js'
import { Op } from 'sequelize'

export async function cancelUserTarifs(ctx, userId) {
	const usersSubscribes = await Subscriber.findAll({
		where: {remaining: {[Op.gt]: 0}, userId: userId},
		include: [
			{
				model: Tarif,
				as: 'tarif'
			},
		],
	})
	const tarifs = usersSubscribes.map(sub => sub.tarif);

	// Sort tariffs by priority
	tarifs.sort((a, b) => a.priority - b.priority)

	// Fetch configuration
	const value = await Config.findByPk(1)

	// Create pairs array
	const pairs = []
	usersSubscribes.forEach(e => {
		if (value.showPriceAtTarif) {
			pairs.push([`${e.tarif.name}`, String(e.id)])
		} else {
			pairs.push([`${e.tarif.name}`, String(e.id)])
		}
	})

	// Create inline keyboard
	let keyboard = []
	pairs.forEach((pair, i) => {
		let buttonText = i >= pairs.length - 2 ? pair[0] : `${pair[0]}`
		let row = []
		row.push({
			text: buttonText,
			callback_data: `cancelTarif ${pair[1]}`,
		})
		keyboard.push(row)
	})
	keyboard.push([{
		text: '🔙 Назад',
		callback_data: 'settingsSubs'
	}])

	// Send the message with the keyboard
	await ctx.reply('<b>Выберите тариф пользователя, который хотите обнулить:</b>', {
		reply_markup: {
			inline_keyboard: keyboard,
		},
	})
}
