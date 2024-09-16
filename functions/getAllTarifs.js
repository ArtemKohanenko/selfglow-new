import { Tarif } from '../models/Tarif.js'
import { Config } from './../models/Config.js'

export async function getAllTarifs(ctx) {
	// Fetch all tariffs
	const tarifs = await Tarif.findAll()

	// Sort tariffs by priority
	tarifs.sort((a, b) => a.priority - b.priority)

	// Fetch configuration
	const value = await Config.findByPk(1)

	// Create pairs array
	const pairs = []
	tarifs.forEach(e => {
		const currency = e.currency.split(' ')[1]
		if (value.showPriceAtTarif) {
			pairs.push([`${e.name} - ${e.price} ${currency}`, String(e.id)])
		} else {
			pairs.push([`${e.name}`, String(e.id)])
		}
	})

	// Create inline keyboard
	let keyboard = []
	pairs.forEach((pair, i) => {
		let buttonText = i >= pairs.length - 2 ? pair[0] : `${pair[0]}`
		let row = []
		row.push({
			text: buttonText,
			callback_data: `selectTarif ${pair[1]}`,
		})
		keyboard.push(row)
	})

	// Send the message with the keyboard
	await ctx.reply('<b>Выберите желаемый для вас тарифный план:</b>', {
		reply_markup: {
			inline_keyboard: keyboard,
		},
	})
}
