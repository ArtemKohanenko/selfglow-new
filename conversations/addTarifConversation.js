import { InlineKeyboard } from 'grammy'
import mainMenuFunction from './../functions/mainMenuFunction.js'
import { Tarif } from '../models/Tarif.js'
import { Resource } from '../models/Resource.js'

export const addTarifConversation = async (conversation, ctx) => {
	try {
		const inline = new InlineKeyboard().text('❌ Отмена', 'cancel')
		await ctx.reply(
			'<b>Добавление нового тарифа</b>\n\nОтправьте боту название тарифа',
			{
				reply_markup: inline,
			}
		)
		const name = await conversation.waitFor(['message:text', 'callback_query'])
		if (
			name.update.callback_query &&
			name.update.callback_query.data &&
			name.update.callback_query.data === 'cancel'
		) {
			return mainMenuFunction(ctx)
		}
		const currencyInline = new InlineKeyboard()
			.text('🇷🇺 RUB', '🇷🇺 RUB')
			.text('💵 USD', '💵 USD')
			.text('💶 EUR', '💶 EUR')
			.text('🇰🇿 KZT', '🇰🇿 KZT')
			.row()
			.text('❌ Отмена', 'cancel')
		await ctx.reply(
			`Название тарифа - ${name.message.text}\n\nВыберите валюту для тарифа, или сделайте тариф бесплатным`,
			{ reply_markup: currencyInline }
		)
		const currency = await conversation.waitForCallbackQuery(
			['🇷🇺 RUB', '💵 USD', '💶 EUR', '🇰🇿 KZT', 'cancel'],
			{
				otherwise: async ctx => {
					await ctx.reply('Используй клавиатуру!', {
						reply_markup: currencyInline,
					})
				},
			}
		)
		if (currency.match === 'cancel') {
			return mainMenuFunction(ctx)
		}
		await ctx.reply(
			`Название тарифа - ${name.message.text}\nВалюта: ${currency.match}\n\nОтправьте боту цену для тарифа(от 1 ед.):`,
			{ reply_markup: inline }
		)
		const price = await conversation.form.number()
		const daysInline = new InlineKeyboard().text('❌ Отмена', 'cancel')
		await ctx.reply(
			`Название тарифа - ${name.message.text}\n\nВведите новый срок действия тарифа в днях 👇`,
			{ reply_markup: daysInline }
		)
		let days = await conversation.waitFor(['message:text', 'callback_query'])
		if (
			days.update.callback_query &&
			days.update.callback_query.data &&
			days.update.callback_query.data === 'cancel'
		) {
			return mainMenuFunction(ctx)
		}
		if (!/^\d+$/.test(days.message.text)) {
			do {
				await ctx.reply('Вы должны ввести кол-во в цифрах.')
				days = await conversation.waitFor(['message:text', 'callback_query'])
			} while (!/^\d+$/.test(days.message.text))
		}
		const nextInline = new InlineKeyboard()
			.text('➡️ Перейти к настройке ресурсов', 'next')
			.row()
			.text('❌ Отмена', 'cancel')
		await ctx.reply(
			`Название тарифа - ${name.message.text}\nВалюта: ${currency.match}\nСрок действия: ${days.message.text} дней\n\nЧтобы перейти к добавлению каналов/групп к тарифу, нажмите на кнопку ниже 👇`,
			{
				reply_markup: nextInline,
			}
		)
		const next = await conversation.waitForCallbackQuery(['next', 'cancel'], {
			otherwise: async ctx =>
				await ctx.reply('Используй клавиатуру!', {
					reply_markup: nextInline,
				}),
		})
		if (next.match === 'cancel') {
			return mainMenuFunction(ctx)
		}
		const resources = await Resource.findAll()

		const buttons = resources.map(resource => ({
			text: resource.resourceName,
			callback_data: `tarifResource ${resource.id}`,
		}))

		const resourceInline = new InlineKeyboard()

		buttons.forEach(button => {
			resourceInline.text(button.text, button.callback_data).row() // Каждая кнопка на новой строке
		})

		resourceInline.text('❌ Отмена', 'cancel')

		await ctx.reply(
			`Название тарифа - ${name.message.text}
Срок действия: ${days.message.text} дней
Валюта: ${currency.match}
Цена: ${price}

Выберите ресурсы на которые нужно выдать доступ после успешной покупки 👇`,
			{
				reply_markup: resourceInline,
			}
		)

		const resource = await conversation.waitFor('callback_query')
		console.log(resource.update.callback_query.data)
		if (resource.update.callback_query.data === 'cancel') {
			return mainMenuFunction(ctx)
		} else if (resource.update.callback_query.data.includes('tarifResource')) {
			const inline = new InlineKeyboard()
				.text('Sk Academy', '1')
				.text('Sonya Konova', '2')
				.row()
				.text('❌ Отмена', 'cancel')
			await ctx.reply('Выберите платежную систему', {
				reply_markup: inline,
			})
			const payment = await conversation.waitForCallbackQuery(
				['1', '2', 'cancel'],
				{
					otherwise: async ctx =>
						await ctx.reply('Используй клавиатуру!', {
							reply_markup: nextInline,
						}),
				}
			)
			if (payment.match === 'cancel') {
				return mainMenuFunction(ctx)
			}
			const allTarifs = await Tarif.findAll()
			const resourceId = resource.update.callback_query.data.split(' ')[1]
			const tarif = await Tarif.create({
				name: name.message.text,
				currency: currency.match,
				price: price,
				time: days.message.text * 24 * 60,
				priority: allTarifs.length + 1,
				resourceId: resourceId,
				payment: payment.match,
			})
			await ctx.reply('Тариф успешно добавлен')
			return mainMenuFunction(ctx)
		}
	} catch (e) {
		console.log(e)
	}
}
