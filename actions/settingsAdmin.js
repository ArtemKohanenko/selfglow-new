import { Composer, InlineKeyboard } from 'grammy'
import { User } from './../models/User.js'
import { Pagination } from './../libs/pagination.js'
import 'dotenv/config'

const composer = new Composer()

composer.callbackQuery('settingsAdmin', async ctx => {
	try {
		console.log('sadas')
		if (Number(ctx.from.id) === Number(process.env.ADMIN_TG_ID)) {
			const inline = new InlineKeyboard()
				.text('🔨 Выдать админку', 'addAdmin')
				.row()
				.text('⚒ Забрать админку', 'deleteAdmin')
				.row()
				.text('✍️ Список админов', 'adminList')
				.row()
				.text('🔙 Назад', 'banBack')
				.row()
			const admins = await User.findAll({ where: { isAdmin: true } })
			await ctx.reply(
				`<b>Меню Блокировки пользователей</b>

Админов: ${admins.length}`,
				{ reply_markup: inline }
			)
		} else {
			await ctx.answerCallbackQuery('Вы не создатель бота.')
		}
	} catch (e) {
		console.log(e)
	}
})

composer.callbackQuery('addAdmin', async ctx => {
	try {
		await ctx.conversation.enter('addAdminConversation')
	} catch (e) {
		console.log(e)
	}
})

composer.callbackQuery('adminList', async ctx => {
	const admins = await User.findAll({ where: { isAdmin: true } })
	const data = []
	admins.forEach(user => {
		data.push(`Ник: ${user.username}, Телеграм ID: ${user.tgId}`)
	})
	let pagination = new Pagination({ data })
	let text = await pagination.text()
	let keyboard = await pagination.keyboard()
	if (admins.length < 1) {
		await ctx.reply('Список пуст.')
	} else {
		await ctx.reply(text, keyboard)
	}

	pagination.handleActions(composer)
})

composer.callbackQuery('deleteAdmin', async ctx => {
	try {
		await ctx.conversation.enter('deleteAdminConversation')
	} catch (e) {
		console.log(e)
	}
})

composer.callbackQuery('banBack', async ctx => {
	try {
		await ctx.conversation.exit()
		const inline = new InlineKeyboard()
			.text('👥 Подписчики', 'settingsSubs')
			.text('📰 Лендинг', 'settingsLanding')
			.row()
			.text('🔗 Админ панель', 'settingsAdminPanel')
			.text('✉️ Ответы от бота', 'settingsAnswers')
			.row()
			.text('🗂 Кнопки', 'settingsButtons')
			.text('🎁 Промокоды', 'settingsPromo')
			.row()
			.text('📊 Статистика', 'settingsStats')
			.text('👥 Реферальная система', 'settingsRefs')
			.row()
			.text('🔨 Блокировка пользователей', 'settingsBan')
			.row()
			.text('✏️ Администраторы', 'settingsAdmin')
			.row()
			.text('💬 Сбор контактов', 'settingsContacts')
			.row()
			.text('⏸ Остановить оплаты', 'settingsPayments')
			.row()
		await ctx.reply(
			`<b>Настройки вашего бота</b>

Подписчики - вся информация о подписчиках и пользователях бота.
Рефералы - партнерская программа для вашего бота
Ответы бота - настройка ответов от бота
Меню в боте - создание кнопок с информацией

Для того, чтобы вернуться обратно в Главное меню, Вы можете отправить команду /start`,
			{ reply_markup: inline }
		)
	} catch (e) {
		console.log(e)
	}
})

export default composer
