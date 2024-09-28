import { sendPromoMenu } from '../actions/settingsPromo.js'
import { Promocode } from '../models/Promocode.js'
import { InlineKeyboard, Keyboard } from 'grammy'
import { PromoGroup } from '../models/PromoGroup.js'
import { getAllTarifs } from '../functions/getAllTarifs.js'
import { User } from '../models/User.js'

export const enterPromoConversation = async (conversation, ctx) => {
	try {
		const tarifId = ctx.selectedTarifId
		const inline = new InlineKeyboard().text('🔙 Назад', 'cancel')

		await ctx.reply(
			`Введите промокод.`,
			{
				reply_markup: inline
			}
		)
		const promoInput = await conversation.waitFor(['message:text', 'callback_query'])
		if (
			promoInput.update.callback_query &&
			promoInput.update.callback_query.data &&
			promoInput.update.callback_query.data === 'cancel'
		) {
			return await getAllTarifs(ctx)
		}
		const promoName = promoInput.update.message.text
		const promo = await Promocode.findOne({where: {name: promoName}})

		if (!promo) {
			return await ctx.reply(`Промокод "${promoName}" не найден.`, {
				reply_markup: inline
			})
		}

		if (promo.duration != 0) {
			const expireAt = new Date(promo.createdAt.getTime());
			expireAt.setDate(promo.createdAt.getDate() + promo.duration)
			if (expireAt < new Date()) {
				return await ctx.reply(`Промокод ${promoName} истек.`, {
					reply_markup: inline
				})
			}
		}

		const user = await User.findOne({ where: { tgId: ctx.from.id } })
		const activatedUsers = JSON.parse(promo.activatedUsers)
		const userActivations = activatedUsers.filter((el) => el == user.id)
		if (promo.activationCount && activatedUsers.length >= promo.activationCount) {
			return await ctx.reply(`Промокод ${promoName} уже активирован максимальное кол-во раз.`, {
				reply_markup: inline
			})
		}
		if (promo.activationCountPerUser && userActivations.length >= promo.activationCountPerUser) {
			return await ctx.reply(`Вы больше не можете активировать промокод ${promoName}.`, {
				reply_markup: inline
			})
		}

		const payInline = new InlineKeyboard()
		.text('Оплатить', `showPublicOffer ${tarifId} ${promo.id}`).row()
		.text('🔙 Назад', 'cancel')
		return await ctx.reply(`Вы ввели промокод ${promo.name} (скидка ${promo.percent}%).`, {
			reply_markup: payInline
		})
	} catch (e) {
		console.log(e)
	}
}
