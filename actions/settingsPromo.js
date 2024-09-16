import { Composer, InlineKeyboard } from 'grammy'
import { Promocode } from '../models/Promocode.js'
import { User } from '../models/User.js'
import { Pagination } from './../libs/pagination.js'
import { sendAdminMenu } from '../functions/sendAdminMenu.js'

const composer = new Composer()

export async function sendPromoMenu(ctx) {
	try {
		const inline = new InlineKeyboard()
			.text('Общие промокоды', 'promo')
			.row()
			.text('Промокоды из рассылок', 'promoListings')
			.row()
			.text('🔙 Назад', 'backPromo')
		await ctx.reply(
			`<b>Настройки промокодов</b>

Выберите нужный раздел промокодов ниже или создайте новый`,
			{ reply_markup: inline }
		)
	} catch (e) {
		console.log(e)
	}
}

composer.callbackQuery('settingsPromo', async ctx => {
	await sendPromoMenu(ctx)
})

composer.callbackQuery('promo', async ctx => {
	try {
		const promos = await Promocode.findAll()

		const buttons = promos.map(promo => ({
			text: `Промокод ${promo.name}`,
			callback_data: `selectPromo ${promo.id}`,
		}))

		const inlineKeyboard = new InlineKeyboard()

		buttons.forEach(button => {
			inlineKeyboard.text(button.text, button.callback_data).row() // Каждая кнопка на новой строке
		})

		inlineKeyboard
			.text('➕ Создать промокод', 'createPromo')
			.row()
			.text('🔙 Назад', 'backPromoMain')
		await ctx.reply(
			`<b>Настройка промокодов</b>

Выберите промокод ниже для настройки или создайте новый`,
			{ reply_markup: inlineKeyboard }
		)
	} catch (e) {
		console.log(e)
	}
})

composer.callbackQuery('createPromo', async ctx => {
	await ctx.conversation.enter('createPromoConversation')
})

composer.callbackQuery(/selectPromo/, async ctx => {
	const promoId = ctx.callbackQuery.data.split(' ')[1]
	ctx.session.selectedPromoId = promoId
	const promo = await Promocode.findByPk(promoId)
	const promoActivatedPeople = JSON.parse(promo.activatedUsers)
	const inline = new InlineKeyboard()
		.text('✏️ Изменить кол-во активаций', 'editPromoActivationCount')
		.row()
		.text(
			'✏️ Изменить кол-во активаций на человека',
			'editPromoActivationCountPerUser'
		)
		.row()
		.text('✏️ Изменить срок действия промокода', 'editPromoDuration')
		.row()
		.text('Список активаций', 'promoActivationList')
		.row()
		.text('Удалить', 'deletePromo')
		.row()
		.text('Назад', 'backEditingPromo')
	await ctx.reply(
		`Название: Промокод ${promo.name}
Промокод: ${promo.name}
Процент скидки: ${promo.percent}%
Активаций промокода: ${promoActivatedPeople.length} раз
Максимум активаций: ${promo.activationCount}.
Максимум активаций одним человеком: ${promo.activationCountPerUser}.
Срок действия: ${
			promo.duration === 0 ? 'Не ограничен' : `${promo.duration} дней`
		}.`,
		{
			reply_markup: inline,
		}
	)
})

composer.callbackQuery('editPromoActivationCount', async ctx => {
	if (ctx.session.selectedPromoId)
		await ctx.conversation.enter('editPromoActivationCountConversation')
})

composer.callbackQuery('editPromoActivationCountPerUser', async ctx => {
	if (ctx.session.selectedPromoId)
		await ctx.conversation.enter('editPromoActivationCountPerUserConversation')
})
composer.callbackQuery('editPromoDuration', async ctx => {
	if (ctx.session.selectedPromoId)
		await ctx.conversation.enter('editPromoDurationConversation')
})

composer.callbackQuery('promoActivationList', async ctx => {
	if (ctx.session.selectedPromoId) {
		const promoId = ctx.session.selectedPromoId
		const promo = await Promocode.findByPk(promoId)
		let data = []
		const promoActivatedPeople = JSON.parse(promo.activatedUsers)
		if (promoActivatedPeople.length === 0) await ctx.reply(`Список пуст.`)
		else {
			for (const e of promoActivatedPeople) {
				const user = await User.findByPk(e)
				data.push(`@${user.username}, Телеграм ID: ${user.tgId}`)
			}
			let pagination = new Pagination({ data })
			let text = await pagination.text()
			let keyboard = await pagination.keyboard()
			await ctx.reply(text, keyboard)

			pagination.handleActions(composer)
		}
	}
})

composer.callbackQuery('deletePromo', async ctx => {
	if (ctx.session.selectedPromoId) {
		const promoId = ctx.session.selectedPromoId
		const promo = await Promocode.findByPk(promoId)
		await promo.destroy()
		await ctx.reply(`Промокод успешно удален.`)
		ctx.session.selectedPromoId = null
	}
})

composer.callbackQuery('backPromo', async ctx => await sendAdminMenu(ctx))
composer.callbackQuery('backPromoMain', async ctx => await sendPromoMenu(ctx))
composer.callbackQuery(
	'backEditingPromo',
	async ctx => await sendPromoMenu(ctx)
)

export default composer
