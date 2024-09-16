import { Composer } from 'grammy'
import { User } from '../models/User.js'
import { Op } from 'sequelize'
import { Payment } from './../models/Payment.js'
import { Subscriber } from './../models/Subscriber.js'
import { Tarif } from '../models/Tarif.js'
import CurrencyConverter from 'currency-converter-lt'

const composer = new Composer()

composer.callbackQuery('settingsStats', async ctx => {
	const users = await User.findAll()
	const payments = await Payment.findAll({ where: { status: 'PAID' } })
	const thirtyDaysAgo = new Date()
	thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
	const thirtyDaysUsers = await User.findAll({
		where: {
			createdAt: {
				[Op.gt]: thirtyDaysAgo,
			},
		},
	})
	const thirtyDaysPayments = await Payment.findAll({
		where: {
			createdAt: {
				[Op.gt]: thirtyDaysAgo,
			},
			status: 'PAID',
		},
	})
	const currentDate = new Date()
	const startOfMonth = new Date(
		currentDate.getFullYear(),
		currentDate.getMonth(),
		1
	)
	const endOfMonth = new Date(
		currentDate.getFullYear(),
		currentDate.getMonth() + 1,
		0,
		23,
		59,
		59,
		999
	)
	const currentMonthPayments = await Payment.findAll({
		where: {
			createdAt: {
				[Op.gte]: startOfMonth, // Дата больше или равна началу месяца
				[Op.lte]: endOfMonth, // Дата меньше или равна концу месяца
			},
			status: 'PAID',
		},
	})

	// Вычисляем дату и время 24 часа назад от текущего момента
	const past24Hours = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000)

	// Запрос к базе данных
	const sutkaPayments = await Payment.findAll({
		where: {
			createdAt: {
				[Op.gte]: past24Hours, // Дата больше или равна дате 24 часа назад
			},
			status: 'PAID',
		},
	})
	const startOfDay = new Date(
		currentDate.getFullYear(),
		currentDate.getMonth(),
		currentDate.getDate()
	)
	const endOfDay = new Date(
		currentDate.getFullYear(),
		currentDate.getMonth(),
		currentDate.getDate(),
		23,
		59,
		59,
		999
	)

	// Запрос к базе данных
	const dayPayments = await Payment.findAll({
		where: {
			createdAt: {
				[Op.gte]: startOfDay, // Дата больше или равна началу дня
				[Op.lte]: endOfDay, // Дата меньше или равна концу дня
			},
			status: 'PAID',
		},
	})
	const subscribers = await Subscriber.findAll()
	const notBuyedSubscribe = users.length - subscribers.length
	const paymentsForStats = await Payment.findAll({
		where: {
			status: 'PAID',
		},
		include: [
			{
				model: Tarif,
				as: 'tarif', // используем alias, заданный в ассоциации
				attributes: ['price', 'currency'],
			},
		],
	})

	const revenueByCurrency = {}

	paymentsForStats.forEach(payment => {
		const tarif = payment.tarif
		if (tarif) {
			const { price, currency } = tarif
			const currencyCode = currency.split(' ')[1] // Извлекаем код валюты

			if (!revenueByCurrency[currencyCode]) {
				revenueByCurrency[currencyCode] = 0
			}
			revenueByCurrency[currencyCode] += price
		}
	})

	const currencyConverter = new CurrencyConverter()

	const totalRevenueInTargetCurrency = {}
	let targetCurrency = 'RUB'

	for (const [currencyCode, amount] of Object.entries(revenueByCurrency)) {
		const convertedAmount = await currencyConverter
			.from(currencyCode)
			.to(targetCurrency)
			.amount(amount)
			.convert()
		if (!totalRevenueInTargetCurrency[targetCurrency]) {
			totalRevenueInTargetCurrency[targetCurrency] = 0
		}
		totalRevenueInTargetCurrency[targetCurrency] += convertedAmount
	}

	const recentPayments = await Payment.findAll({
		where: {
			status: 'PAID',
			createdAt: {
				[Op.gte]: thirtyDaysAgo,
			},
		},
		include: [
			{
				model: Tarif,
				as: 'tarif', // используем alias, заданный в ассоциации
				attributes: ['price', 'currency'],
			},
		],
	})

	const incomeByCurrency = {}

	recentPayments.forEach(paymentRecord => {
		const paymentTarif = paymentRecord.tarif
		if (paymentTarif) {
			const { price, currency } = paymentTarif
			const currencyCode = currency.split(' ')[1] // Извлекаем код валюты

			if (!incomeByCurrency[currencyCode]) {
				incomeByCurrency[currencyCode] = 0
			}
			incomeByCurrency[currencyCode] += price
		}
	})

	const currencyConverterInstance = new CurrencyConverter()

	const totalIncomeInTargetCurrency = {}

	for (const [currencyCode, totalAmount] of Object.entries(incomeByCurrency)) {
		const convertedAmount = await currencyConverterInstance
			.from(currencyCode)
			.to(targetCurrency)
			.amount(totalAmount)
			.convert()
		if (!totalIncomeInTargetCurrency[targetCurrency]) {
			totalIncomeInTargetCurrency[targetCurrency] = 0
		}
		totalIncomeInTargetCurrency[targetCurrency] += convertedAmount
	}

	const today = new Date()
	const startOfMonth2 = new Date(today.getFullYear(), today.getMonth(), 1)

	const paymentsForCurrentMonth = await Payment.findAll({
		where: {
			status: 'PAID',
			createdAt: {
				[Op.gte]: startOfMonth2,
				[Op.lte]: today,
			},
		},
		include: [
			{
				model: Tarif,
				as: 'tarif', // Используем alias, заданный в ассоциации
				attributes: ['price', 'currency'],
			},
		],
	})

	const revenueGroupedByCurrency = {}

	paymentsForCurrentMonth.forEach(paymentInstance => {
		const relatedTarif = paymentInstance.tarif
		if (relatedTarif) {
			const { price, currency } = relatedTarif
			const currencyCode = currency.split(' ')[1] // Извлекаем код валюты

			if (!revenueGroupedByCurrency[currencyCode]) {
				revenueGroupedByCurrency[currencyCode] = 0
			}
			revenueGroupedByCurrency[currencyCode] += price
		}
	})

	const currencyConverterService = new CurrencyConverter()

	const totalRevenueConverted = {}

	for (const [currencyCode, amount] of Object.entries(
		revenueGroupedByCurrency
	)) {
		const convertedAmount = await currencyConverterService
			.from(currencyCode)
			.to(targetCurrency)
			.amount(amount)
			.convert()
		if (!totalRevenueConverted[targetCurrency]) {
			totalRevenueConverted[targetCurrency] = 0
		}
		totalRevenueConverted[targetCurrency] += convertedAmount
	}
	const currentDay = new Date()
	const previousDay = new Date(currentDay)
	previousDay.setDate(currentDay.getDate() - 1)

	const startOfPreviousDay = new Date(previousDay.setHours(0, 0, 0, 0))
	const endOfPreviousDay = new Date(previousDay.setHours(23, 59, 59, 999))

	const yesterdayPayments = await Payment.findAll({
		where: {
			status: 'PAID',
			createdAt: {
				[Op.gte]: startOfPreviousDay,
				[Op.lte]: endOfPreviousDay,
			},
		},
		include: [
			{
				model: Tarif,
				as: 'tarif', // Используем alias, заданный в ассоциации
				attributes: ['price', 'currency'],
			},
		],
	})

	const currencyGroupedRevenue = {}

	yesterdayPayments.forEach(payment => {
		const tarifInfo = payment.tarif
		if (tarifInfo) {
			const { price, currency } = tarifInfo
			const currencyCode = currency.split(' ')[1] // Извлекаем код валюты

			if (!currencyGroupedRevenue[currencyCode]) {
				currencyGroupedRevenue[currencyCode] = 0
			}
			currencyGroupedRevenue[currencyCode] += price
		}
	})

	const convertedRevenue = {}

	for (const [currencyCode, amount] of Object.entries(currencyGroupedRevenue)) {
		const convertedAmount = await currencyConverter
			.from(currencyCode)
			.to(targetCurrency)
			.amount(amount)
			.convert()
		if (!convertedRevenue[targetCurrency]) {
			convertedRevenue[targetCurrency] = 0
		}
		convertedRevenue[targetCurrency] += convertedAmount
	}

	const todayPaidPayments = await Payment.findAll({
		where: {
			status: 'PAID',
			createdAt: {
				[Op.gte]: startOfDay,
				[Op.lte]: endOfDay,
			},
		},
		include: [
			{
				model: Tarif,
				as: 'tarif', // Используем alias, заданный в ассоциации
				attributes: ['price', 'currency'],
			},
		],
	})

	const revenueByCurrencyToday = {}

	todayPaidPayments.forEach(paymentEntry => {
		const tarifDetails = paymentEntry.tarif
		if (tarifDetails) {
			const { price, currency } = tarifDetails
			const currencyCode = currency.split(' ')[1] // Извлекаем код валюты

			if (!revenueByCurrencyToday[currencyCode]) {
				revenueByCurrencyToday[currencyCode] = 0
			}
			revenueByCurrencyToday[currencyCode] += price
		}
	})

	const totalRevenueInTargetCurrencyToday = {}

	for (const [currencyCode, totalAmount] of Object.entries(
		revenueByCurrencyToday
	)) {
		const convertedAmount = await currencyConverter
			.from(currencyCode)
			.to(targetCurrency)
			.amount(totalAmount)
			.convert()
		if (!totalRevenueInTargetCurrencyToday[targetCurrency]) {
			totalRevenueInTargetCurrencyToday[targetCurrency] = 0
		}
		totalRevenueInTargetCurrencyToday[targetCurrency] += convertedAmount
	}

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
	const paidPayments = await Payment.findAll({
		where: {
			status: 'PAID',
		},
		include: [
			{
				model: Tarif,
				as: 'tarif', // Используем alias, заданный в ассоциации
				attributes: ['price', 'currency'],
			},
		],
	})

	let totalAmountInTargetCurrency = 0
	let paymentCount = 0

	for (const paymentRecord of paidPayments) {
		const tarifData = paymentRecord.tarif
		if (tarifData) {
			const { price, currency } = tarifData
			const currencyCode = currency.split(' ')[1] // Извлекаем код валюты

			const convertedAmount = await currencyConverter
				.from(currencyCode)
				.to(targetCurrency)
				.amount(price)
				.convert()

			totalAmountInTargetCurrency += convertedAmount
			paymentCount += 1
		}
	}

	const averagePayment =
		paymentCount > 0 ? totalAmountInTargetCurrency / paymentCount : 0

	console.log(averagePayment)

	await ctx.reply(`📊Статистика вашего бота

Всего переходов в бота: ${users.length} чел.
Переходов в бота за последние 30 дней: ${thirtyDaysUsers.length} чел.
Заблокировали бота: 244 чел. (не сделано пока что)

👥Количество подписчиков:
🔸Купили подписку за всё время: ${payments.length} раз.
🔸Купили подписку за текущий месяц: ${currentMonthPayments.length} раз.
🔸Купили подписку за 30 дней: ${thirtyDaysPayments.length} раз.
🔸Купили подписку за 24 часа: ${sutkaPayments.length} раз.
🔸Купили подписку за сегодня: ${dayPayments.length} раз.

🔸активных подписок: ${subscribers.length}
🔸ни разу не купивших: ${usersWithoutSubscriber.length} чел.

💰 Доход проекта за:
🔹сегодня - ${
		totalRevenueInTargetCurrencyToday.RUB === undefined
			? '0'
			: totalRevenueInTargetCurrencyToday.RUB
	}₽.
🔹вчера - ${convertedRevenue.RUB === undefined ? '0' : convertedRevenue.RUB}₽.
🔹текущий месяц - ${
		totalRevenueConverted.RUB === undefined ? '0' : totalRevenueConverted.RUB
	}₽.
🔹за последние 30 дней - ${
		totalIncomeInTargetCurrency.RUB === undefined
			? '0'
			: totalIncomeInTargetCurrency.RUB
	}₽.
🔹за всё время - ${
		totalRevenueInTargetCurrency.RUB === undefined
			? '0'
			: totalRevenueInTargetCurrency.RUB
	}₽.
🔹средний чек - ${averagePayment === undefined ? '0' : averagePayment}₽.`)
})

export default composer
