import { Composer, InlineKeyboard } from 'grammy'
import { Tarif } from './../models/Tarif.js'
import { Payment } from './../models/Payment.js'
import { User } from '../models/User.js'
import { sendMessageToAllAdmins } from '../functions/sendMessageToAllAdmins.js'
import 'dotenv/config'

const composer = new Composer()

const productIds = [12, 13, 14]
const serviceIds = [11, 15, 16]

composer.callbackQuery(/showPublicOffer/, async ctx => {
	const user = await User.findOne({ where: { tgId: ctx.from.id } })
	const tarifId = ctx.callbackQuery.data.split(' ')[1]
	const tarif = await Tarif.findByPk(tarifId)
	const payment = await Payment.create({
		tarifId: tarif.id,
		tgId: ctx.from.id,
	})
	console.log("New payment:", payment)
	const currencyForLink = tarif.currency.split(' ')[1].toLowerCase()

	let link
	if (tarif.payment === 2) {
		link = `https://sonyakononova.payform.ru/?order_id=${payment.id}&products[0][price]=${tarif.price}&products[0][quantity]=1&products[0][name]=${tarif.name}&do=pay&paid_content=Оплата тарифа&urlNotification=${encodeURIComponent(process.env.WEBHOOK_URL)}&currency=${currencyForLink}`
	} else if (tarif.payment === 1) {
		link = `https://sk-academy.payform.ru/?order_id=${payment.id}&products[0][price]=${tarif.price}&products[0][quantity]=1&products[0][name]=${tarif.name}&do=pay&paid_content=Оплата тарифа&urlNotification=${encodeURIComponent(process.env.WEBHOOK_URL)}&currency=${currencyForLink}`
	}
	console.log('Link:', link)
	const inline = new InlineKeyboard().url('Согласен', link)

	let offerMessage
	if (productIds.includes(tarif.id)) {
		offerMessage = `Оплачивая выбранный товар вы соглашаетесь с условиями Публичной оферты.
https://disk.yandex.ru/i/aanHngFoI7goDg
		
Предоставляя персональные данные вы даете согласие на их обработку в соответствии с политикой обработки персональных данных.
https://disk.yandex.ru/i/PYyrpIQmKf8WGg`
	}
	else {
		offerMessage = `Оплачивая выбранную услугу вы соглашаетесь с условиями Публичной оферты.
https://disk.yandex.ru/i/zcJEkdDq7xqlNQ
		
Предоставляя персональные данные вы даете согласие на их обработку в соответствии с политикой обработки персональных данных.
https://disk.yandex.ru/i/PYyrpIQmKf8WGg`
	}

	await ctx.reply(offerMessage, {
			reply_markup: inline,
			disable_web_page_preview: true
		})

	const messageToAdmins = `Пользователь: ${user.fullName ? `<a href="https://t.me/${user.username.replace('@', '')}">${user.fullName}</a>` : user.username} вызвал оплату тарифа ${tarif.name}
Сумма: ${tarif.price} ${tarif.currency}
`
	await sendMessageToAllAdmins(ctx, messageToAdmins)
})

export default composer
