import { sendPromoMenu } from '../actions/settingsPromo.js'
import { Promocode } from '../models/Promocode.js'
import { InlineKeyboard } from 'grammy'
import { PromoGroup } from '../models/PromoGroup.js'

const inline = new InlineKeyboard().text('❌ Отмена', 'settingsPromo')

export const createPromoConversation = async (conversation, ctx) => {
	try {
		const promoGroups = await PromoGroup.findAll()
		const keyboardGroups = promoGroups.map(group => [{
			text: group.name,
			callback_data: `selectPromoGroupToAddNew ${group.id}`
		}])
		keyboardGroups.push([{
			text: '❌ Отмена',
			callback_data: 'settingsPromo'
		}])
		await ctx.reply(
			`Выберите группу, в которую хотите добавить новый промокод.`,
			{
				reply_markup: {
					inline_keyboard: keyboardGroups
				}
			}
		)
		const promoGroupInput = await conversation.waitFor(['message:text', 'callback_query'])
		if (
			promoGroupInput.update.callback_query &&
			promoGroupInput.update.callback_query.data &&
			promoGroupInput.update.callback_query.data === 'settingsPromo'
		) {
			return sendPromoMenu(ctx)
		}
		const promoGroupId = Number(promoGroupInput.update.callback_query.data.split(' ')[1])
		const promoGroup = await PromoGroup.findByPk(promoGroupId)

		await ctx.reply(
			`Выбрано "${promoGroup.name}". Отправьте боту новый промокод (например: discount30, PROMO20).`,
			{ reply_markup: inline }
		)
		const name = await conversation.waitFor(['message:text', 'callback_query'])
		if (
			name.update.callback_query &&
			name.update.callback_query.data &&
			name.update.callback_query.data === 'settingsPromo'
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
			percent.update.callback_query.data === 'settingsPromo'
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
			count.update.callback_query.data === 'settingsPromo'
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
			promoGroupId: promoGroupId
		})
		await ctx.reply(`Промокод ${name.message.text} успешно создан`)
		return await sendPromoMenu(ctx)
	} catch (e) {
		console.log(e)
	}
}
