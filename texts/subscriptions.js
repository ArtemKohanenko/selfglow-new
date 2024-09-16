import { Composer, InlineKeyboard } from 'grammy'
import { User } from '../models/User.js'
import { Subscriber } from '../models/Subscriber.js'
import { Tarif } from '../models/Tarif.js'
import { Resource } from '../models/Resource.js'

const composer = new Composer()

composer.hears('📊 Подписки', async ctx => {
	try {
		const user = await User.findOne({ where: { tgId: ctx.from.id } })
		const activeSubscriptions = await Subscriber.findAll({
			where: { userId: user.id },
		})
		let tarifsList = []
		for (const e of activeSubscriptions) {
			const tarif = await Tarif.findByPk(e.tarifId)
			const createdAt = new Date(e.createdAt)
			const formattedDate = new Intl.DateTimeFormat('ru-RU', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
			}).format(createdAt)

			// Add remaining days to createdAt date
			const endDate = new Date(createdAt)
			endDate.setDate(endDate.getDate() + e.remaining)
			const formattedEndDate = new Intl.DateTimeFormat('ru-RU', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
			}).format(endDate)

			tarifsList.push({
				tarifName: tarif.name,
				id: e.id,
				createdAt: formattedDate,
				endDate: formattedEndDate,
			})
		}
		if (tarifsList.length >= 1) {
			for (const e of tarifsList) {
				const inline = new InlineKeyboard().text(
					'🔗 Ссылка для доступа',
					`generateLink ${e.id}`
				)
				await ctx.reply(
					`📊 Информация о купленных подписках:

📈 ${e.tarifName}
— ${e.createdAt} - ${e.endDate}`,
					{ reply_markup: inline }
				)
			}
		}
	} catch (e) {
		console.log(e)
	}
})

composer.command('subscription', async ctx => {
	try {
		const user = await User.findOne({ where: { tgId: ctx.from.id } })
		const activeSubscriptions = await Subscriber.findAll({
			where: { userId: user.id },
		})
		let tarifsList = []
		for (const e of activeSubscriptions) {
			const tarif = await Tarif.findByPk(e.tarifId)
			const createdAt = new Date(e.createdAt)
			const formattedDate = new Intl.DateTimeFormat('ru-RU', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
			}).format(createdAt)

			// Add remaining days to createdAt date
			const endDate = new Date(createdAt)
			endDate.setDate(endDate.getDate() + e.remaining)
			const formattedEndDate = new Intl.DateTimeFormat('ru-RU', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
			}).format(endDate)

			tarifsList.push({
				tarifName: tarif.name,
				id: e.id,
				createdAt: formattedDate,
				endDate: formattedEndDate,
			})
		}
		if (tarifsList.length >= 1) {
			for (const e of tarifsList) {
				const inline = new InlineKeyboard().text(
					'🔗 Ссылка для доступа',
					`generateLink ${e.id}`
				)
				await ctx.reply(
					`📊 Информация о купленных подписках:

📈 ${e.tarifName}
— ${e.createdAt} - ${e.endDate}`,
					{ reply_markup: inline }
				)
			}
		}
	} catch (e) {
		console.log(e)
	}
})

composer.callbackQuery(/generateLink/, async ctx => {
	try {
		const subscribeId = ctx.callbackQuery.data.split(' ')[1]
		const subscribe = await Subscriber.findByPk(subscribeId)
		const tarif = await Tarif.findByPk(subscribe.tarifId)
		const resource = await Resource.findByPk(tarif.resourceId)
		const invite = await ctx.api.createChatInviteLink(resource.resourceId, {
			member_limit: 1,
		})
		await ctx.reply(`Ссылка на ресурс - ${invite.invite_link}`)
	} catch (e) {
		console.log(e)
	}
})

export default composer
