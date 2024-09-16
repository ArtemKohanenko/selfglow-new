import { User } from '../models/User.js'
import { toHTML } from '@telegraf/entity'
import { Subscriber } from './../models/Subscriber.js'

async function markupMessage(ctx, tgId, text, user) {
	try {
		let messageText = text.message.text
		let entities = text.message.entities || []

		function replacePlaceholders(placeholder, replacement) {
			if (!replacement) replacement = ''

			const regex = new RegExp(`\\{${placeholder}\\}`, 'g')
			let match
			while ((match = regex.exec(messageText)) !== null) {
				const index = match.index
				const matchLength = match[0].length
				const replacementLength = replacement.length
				const changeInLength = replacementLength - matchLength

				// Replace the placeholder in the message text
				messageText =
					messageText.slice(0, index) +
					replacement +
					messageText.slice(index + matchLength)

				// Update entities
				entities = entities.map(entity => {
					if (entity.offset >= index + matchLength) {
						return {
							...entity,
							offset: entity.offset + changeInLength,
						}
					}
					if (entity.offset >= index && entity.offset < index + matchLength) {
						return {
							...entity,
							length: entity.length + changeInLength,
						}
					}
					return entity
				})

				// Adjust regex lastIndex for next search iteration
				regex.lastIndex = index + replacementLength
			}
		}

		if (user.fullName) {
			replacePlaceholders('full_name', user.fullName)
		} else {
			replacePlaceholders('full_name', '')
		}
		if (user.firstName) {
			replacePlaceholders('first_name', user.firstName)
		} else {
			replacePlaceholders('first_name', '')
		}
		if (user.lastName) {
			replacePlaceholders('last_name', user.lastName)
		} else {
			replacePlaceholders('last_name', '')
		}
		if (user.username) {
			replacePlaceholders('username', user.username)
		} else {
			replacePlaceholders('username', '')
		}
		if (user.tgId) {
			replacePlaceholders('user_id', user.tgId)
		} else {
			replacePlaceholders('user_id', '')
		}

		console.log(messageText)
		console.log(entities)

		const message = toHTML({
			text: messageText,
			entities: entities,
		})

		console.log(message)

		await ctx.api.sendMessage(tgId, message, { parse_mode: 'HTML' })
	} catch (e) {
		console.log(e)
	}
}

export default async function (ctx, textObject, type) {
	try {
		if (type === 1) {
			const users = await User.findAll()
			for (const e of users) {
				await markupMessage(ctx, e.tgId, textObject, e)
			}
		} else if (type === 2) {
			const subscribers = await Subscriber.findAll()
			for (const e of subscribers) {
				const userTgId = await User.findByPk(e.userId)
				await markupMessage(ctx, userTgId.tgId, textObject, userTgId)
			}
		} else if (type === 3) {
			const usersWithoutSubscription = await User.findAll({
				// Переключение на левое соединение с моделью Subscriber
				include: [
					{
						model: Subscriber,
						as: 'subscriber', // Указание алиаса
						required: false, // Левое соединение
					},
				],
				where: {
					'$subscriber.id$': null, // Фильтр по отсутствию подписки
				},
			})
			for (const e of usersWithoutSubscription) {
				await markupMessage(ctx, e.tgId, textObject, e)
			}
		}
	} catch (e) {
		console.log(e)
	}
}
