import { Promocode } from '../models/Promocode.js'
import { InlineKeyboard } from 'grammy'

export default async function (ctx) {
	const promoId = ctx.session.selectedPromoId
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
}
