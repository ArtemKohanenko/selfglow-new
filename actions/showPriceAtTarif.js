import { Composer } from 'grammy'
import { Config } from '../models/Config.js'
import { Tarif } from '../models/Tarif.js'
import { adminMiddleware } from '../middlewares/adminMiddleware.js'

const composer = new Composer()

composer.callbackQuery('showPriceAtTarif', adminMiddleware, async ctx => {
	// Fetch all tariffs
	const tarifs = await Tarif.findAll()

	// Sort tariffs by priority
	tarifs.sort((a, b) => a.priority - b.priority)

	// Fetch configuration
	const config = await Config.findByPk(1)

	// Update showPriceAtTarif setting
	if (config.showPriceAtTarif) {
		await Config.update({ showPriceAtTarif: false }, { where: { id: 1 } })
	} else {
		await Config.update({ showPriceAtTarif: true }, { where: { id: 1 } })
	}

	// Fetch updated configuration
	const updatedValue = await Config.findByPk(1)

	// Create pairs array
	const pairs = []
	tarifs.forEach(e => {
		const currency = e.currency.split(' ')[1]
		pairs.push([`${e.name} - ${e.price} ${currency}`, String(e.id)])
	})

	// Add config options to pairs
	if (updatedValue.showPriceAtTarif) {
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

	// Edit the message reply markup
	await ctx.editMessageReplyMarkup({
		reply_markup: { inline_keyboard: keyboard },
	})
})

export default composer
