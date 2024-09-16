import { Bot, InlineKeyboard, session } from 'grammy'
import { run } from '@grammyjs/runner'
import 'dotenv/config'
import { hydrateReply, parseMode } from '@grammyjs/parse-mode'
import { sequelize } from './config/sequelize.js'
import { FileAdapter } from '@grammyjs/storage-file'
import { conversations } from '@grammyjs/conversations'
import Commands from './commands/index.js'
import Texts from './texts/index.js'
import Actions from './actions/index.js'
import Conversation from './conversations/index.js'
import { limit } from '@grammyjs/ratelimiter'
import { banMiddleware } from './middlewares/banMiddleware.js'
import { Subscriber } from './models/Subscriber.js'
import { Tarif } from './models/Tarif.js'
import './models/relationships.js'
import cron from 'node-cron'
import { User } from './models/User.js'
import express from 'express'
import bodyParser from 'body-parser'
import { sendMessageToAllAdmins } from './functions/sendMessageToAllAdmins.js'

const bot = new Bot(process.env.TOKEN)

bot.use(hydrateReply)
bot.use(
	limit({
		timeFrame: 2000,
		limit: 3,
		onLimitExceeded: async ctx => {
			await ctx.reply('Не спамьте!')
		},

		keyGenerator: ctx => {
			return ctx.from?.id.toString()
		},
	})
)
bot.use(
	session({
		initial() {
			return {}
		},
		storage: new FileAdapter({
			dirName: 'sessions',
		}),
	})
)
bot.use(conversations())

bot.api.config.use(parseMode('HTML'))

sequelize.sync()

bot.on('callback_query', async (ctx, next) => {
	await ctx.answerCallbackQuery()
	await next()
})

bot.use(banMiddleware, Conversation, Commands, Texts, Actions)

import moment from 'moment-timezone'
import { Resource } from './models/Resource.js'
import { Payment } from './models/Payment.js'

async function decrementRemaining(ctx) {
	try {
		const subscribers = await Subscriber.findAll()

		const now = moment().tz('Europe/Moscow')
		console.log(`NOW: ${now.format('HH mm')}`)

		for (const subscriber of subscribers) {
			const createdAt = moment(subscriber.createdAt).tz('Europe/Moscow')
			const user = await User.findByPk(subscriber.userId)
			const tarif = await Tarif.findByPk(subscriber.tarifId)
			const resource = await Resource.findByPk(tarif.resourceId)

			if (
				now.hours() === createdAt.hours() &&
				now.minutes() === createdAt.minutes()
			) {
				console.log(`${subscriber.id} ${subscriber.remaining}`)
				if (subscriber.remaining === 1) {
					await bot.api.kickChatMember(resource.resourceId, user.tgId)
					console.log('KICKED')
				} else if (subscriber.remaining > 0) {
					subscriber.remaining -= 1
					await subscriber.save()
					if (subscriber.remaining === 1) {
						const inline = new InlineKeyboard().text(
							'Продлить подписку',
							`continueSubscription ${subscriber.id}`
						)
						await bot.api.sendMessage(
							user.tgId,
							`До конца подписки остался один день`,
							{
								reply_markup: inline,
							}
						)
					}
				}
			}
		}
	} catch (e) {
		console.log(e)
	}
}

bot.on('my_chat_member', async ctx => {
	// ctx.myChatMember.new_chat_member.status === 'left'
	try {
		console.log(ctx.myChatMember.chat)
		console.log(ctx.myChatMember.new_chat_member)
		if (ctx.myChatMember.new_chat_member.status === 'administrator') {
			const chatType = ctx.myChatMember.chat.type === 'channel' ? 0 : 1
			await Resource.create({
				resourceId: ctx.myChatMember.chat.id,
				resourceType: chatType,
				resourceName: ctx.myChatMember.chat.title,
			})
		} else if (
			ctx.myChatMember.new_chat_member.status === 'left' ||
			ctx.myChatMember.new_chat_member.status === 'kicked' ||
			ctx.myChatMember.new_chat_member.status === 'restricted'
		) {
			const resource = await Resource.findOne({
				where: { resourceId: ctx.myChatMember.chat.id },
			})
			if (resource)
				await Resource.destroy({
					where: { resourceId: ctx.myChatMember.chat.id },
				})
		}
	} catch (e) {
		console.log(e)
	}
})

cron.schedule('* * * * *', () => {
	decrementRemaining()
})

const app = express()

// Define a port number
const PORT = process.env.PORT || 5234

// Use body-parser middleware to parse JSON and URL-encoded bodies
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Define a route for GET requests to the root URL
app.get('/', (req, res) => {
	res.send('Hello, World!')
})

// Define a route for POST requests to /submit
app.post('/webhook', async (req, res) => {
	const data = req.body
	console.log("Webhook body:", data)
	if (data.payment_status && data.payment_status === 'success') {
		try {
			const orderId = data.order_num
			const payment = await Payment.findByPk(orderId)
			await Payment.update({ status: 'PAID' }, { where: { id: orderId } })
			const userId = payment.tgId
			const user = await User.findOne({ where: { tgId: userId } })
			const tarifId = payment.tarifId
			const tarif = await Tarif.findByPk(tarifId)
			const currencyForLink = tarif.currency.split(' ')[1].toLowerCase()
			const resource = await Resource.findByPk(tarif.resourceId)
			const days = Math.floor(tarif.time / 1440)

			const orderSum = data.sum.split('.')[0]
			console.log(
				`DATA CURRENCY: ${data.currency}, CURRENCYFORLINK: ${currencyForLink} orderSum: ${orderSum} tarifPrice ${tarif.price}`
			)

			if (data.currency == currencyForLink && orderSum == tarif.price) {
				const invite = await bot.api.createChatInviteLink(resource.resourceId, {
					member_limit: 1,
				})

				const messageToAdmins = `Пользователь: <a href="https://t.me/${user.username.replace('@', '')}">${user.fullName}</a>
				купил подписку на ${resource.resourceName}
				🆔UserID: <code>${user.tgId}</code>`
				await sendMessageToAllAdmins(bot, messageToAdmins)
				
				await bot.api.sendMessage(userId, `Вы успешно оплатили тариф. Номер заказа: ${orderId}.`)
				await bot.api.sendMessage(
					userId,
					`Ссылка на ресурс - ${invite.invite_link}`
				)
				await Subscriber.create({
					userId: user.id,
					tarifId: tarifId,
					remaining: days,
				})
				return res.sendStatus(200)
			}
		} catch (e) {
			console.log(e)
		}
	}
})

// Start the server and listen on the specified port
app.listen(PORT, () => {
	console.log(`Server is running on ${PORT}`)
})

run(bot)
