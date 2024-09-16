import { sendPromoMenu } from '../actions/settingsPromo.js'
import { Promocode } from '../models/Promocode.js'
import { InlineKeyboard } from 'grammy'

export const createPromoConversation = async (conversation, ctx) => {
	try {
		const inline = new InlineKeyboard().text('❌ Отмена', 'cancel')
		await ctx.reply(
			`Отправьте боту новый промокод (например: discount30, PROMO20).`,
			{ reply_markup: inline }
		)
		const name = await conversation.waitFor(['message:text', 'callback_query'])
		if (
			name.update.callback_query &&
			name.update.callback_query.data &&
			name.update.callback_query.data === 'cancel'
		) {
			return sendPromoMenu(ctx)
		}
		const promo = await Promocode.findOne({
			where: { name: name.message.text },
		})
		if (promo) {
			return await ctx.reply(`Промокод с таким названием уже существует.`)
		} else {
			await ctx.reply(
				`Промокод - <b>${name.message.text}</b>

Отправьте боту процент скидки на покупку тарифов (1-100).`,
				{
					reply_markup: inline,
				}
			)
		}
		let percent = await conversation.waitFor(['message:text', 'callback_query'])
		if (
			percent.update.callback_query &&
			percent.update.callback_query.data &&
			percent.update.callback_query.data === 'cancel'
		) {
			return sendPromoMenu(ctx)
		}
		if (!/^\d+$/.test(percent.message.text)) {
			do {
				await ctx.reply('Вы должны ввести кол-во в цифрах.')
				percent = await conversation.waitFor(['message:text', 'callback_query'])
			} while (!/^\d+$/.test(percent.message.text))
		}
		await ctx.reply(
			`Создание промокода

Промокод - <b>${name.message.text}</b>
Процент скидки - <b>${percent.message.text}%</b>
Отправьте боту нужное количество раз активаций либо отправьте 0 для его безлимитного числа активаций.`,
			{
				reply_markup: inline,
			}
		)
		let count = await conversation.waitFor(['message:text', 'callback_query'])
		if (
			count.update.callback_query &&
			count.update.callback_query.data &&
			count.update.callback_query.data === 'cancel'
		) {
			return sendPromoMenu(ctx)
		}
		if (!/^\d+$/.test(count.message.text)) {
			do {
				await ctx.reply('Вы должны ввести кол-во в цифрах.')
				count = await conversation.waitFor(['message:text', 'callback_query'])
			} while (!/^\d+$/.test(count.message.text))
		}
		await Promocode.create({
			name: name.message.text,
			percent: percent.message.text,
			activationCount: count.message.text,
		})
		await ctx.reply(`Промокод ${name.message.text} успешно создан`)
		return await sendPromoMenu(ctx)
	} catch (e) {
		console.log(e)
	}
}
