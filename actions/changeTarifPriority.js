import { Composer } from 'grammy'
import { adminMiddleware } from '../middlewares/adminMiddleware.js'
import { Tarif } from '../models/Tarif.js'
import { Config } from '../models/Config.js'

const composer = new Composer()

composer.callbackQuery('changeTarifPriority', adminMiddleware, async ctx => {
	// Fetch all tariffs
	const tarifs = await Tarif.findAll()

	// Sort tariffs by priority
	tarifs.sort((a, b) => a.priority - b.priority)

	// Fetch configuration
	const config = await Config.findByPk(1)

	// Create pairs array
	const pairs = []
	tarifs.forEach(e => {
		const currency = e.currency.split(' ')[1]
		pairs.push([`${e.name} - ${e.price} ${currency}`, String(e.id)])
	})

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
				callback_data: `selectTarifForPriorityChange ${pair[1]}`,
			})
		}

		keyboard.push(row)
	})

	// Send the message with the keyboard
	const message = await ctx.reply(
		'Выберите тариф, приоритет которого вы хотите изменить',
		{
			reply_markup: {
				inline_keyboard: keyboard,
			},
		}
	)

	// Store the message ID in session
	ctx.session.inlineTarifMessage = message.message_id
})

composer.on('callback_query', async (ctx, next) => {
	if (ctx.callbackQuery.data.includes('selectTarifForPriorityChange')) {
		const tarifId = ctx.callbackQuery.data.split(' ')[1]
		ctx.session.changingPriorityTarifId = tarifId
		await ctx.conversation.enter('changeTarifPriorityConversation')
	} else await next()
})

export default composer
