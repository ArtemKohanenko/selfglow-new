import { Tarif } from '../models/Tarif.js'
import { Config } from '../models/Config.js'

export async function getAllTarifsForAdmin(ctx) {
	// Fetch all tariffs
	const tarifs = await Tarif.findAll()
	const config = await Config.findByPk(1)

	// Sort tariffs by priority
	tarifs.sort((a, b) => a.priority - b.priority)

	// Create pairs array
	const pairs = []
	tarifs.forEach(e => {
		const currency = e.currency.split(' ')[1]
		pairs.push([`${e.name} - ${e.price} ${currency}`, String(e.id)])
	})

	// Add config options to pairs
	if (config.showPriceAtTarif) {
		pairs.push(['✅ Отображать цену в названии тарифа', 'showPriceAtTarif'])
	} else {
		pairs.push(['❌ Отображать цену в названии тарифа', 'showPriceAtTarif'])
	}

	pairs.push(['➕ Тариф', 'addTarif'])
	pairs.push(['⬆️ Изменить порядок ⬇️', 'changeTarifPriority'])

	// Create inline keyboard
	let keyboard = []
	pairs.forEach((pair, i) => {
		let buttonText = i >= pairs.length - 2 ? pair[0] : `${pair[0]}`
		let row = []

		if (
			pair[1] === 'addTarif' ||
			pair[1] === 'showPriceAtTarif' ||
			pair[1] === 'changeTarifPriority'
		) {
			row.push({
				text: buttonText,
				callback_data: `${pair[1]}`,
			})
		} else {
			row.push({
				text: buttonText,
				callback_data: `selectTarifForAdmin ${pair[1]}`,
			})
		}

		keyboard.push(row)
	})

	// Send the message with the keyboard
	const message = await ctx.reply('Список ваших категорий и тарифов', {
		reply_markup: {
			inline_keyboard: keyboard,
		},
	})

	// Store the message ID in session
	ctx.session.inlineTarifMessage = message.message_id
}
