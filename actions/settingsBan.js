import { Composer, InlineKeyboard } from 'grammy'
import { User } from './../models/User.js'
import { Pagination } from './../libs/pagination.js'
import { adminMiddleware } from '../middlewares/adminMiddleware.js'

const composer = new Composer()
composer.use(adminMiddleware)

composer.callbackQuery('settingsBan', async ctx => {
	try {
		const inline = new InlineKeyboard()
			.text('🔨 Забанить пользователя', 'ban')
			.row()
			.text('⚒ Разбанить пользователя', 'unban')
			.row()
			.text('✍️ Таблица заблокированных', 'bannedList')
			.row()
			.text('🔙 Назад', 'banBack')
			.row()
		const blockedUsers = await User.findAll({ where: { isBanned: true } })
		await ctx.reply(
			`<b>Меню Блокировки пользователей</b>

Заблокировано пользователей: ${blockedUsers.length}`,
			{ reply_markup: inline }
		)
	} catch (e) {
		console.log(e)
	}
})

composer.callbackQuery('ban', async ctx => {
	try {
		await ctx.conversation.enter('banUserConversation')
	} catch (e) {
		console.log(e)
	}
})

composer.callbackQuery('bannedList', async ctx => {
	const bannedUsers = await User.findAll({ where: { isBanned: true } })
	const data = []
	bannedUsers.forEach(user => {
		data.push(`Ник: ${user.username}, Телеграм ID: ${user.tgId}`)
	})
	let pagination = new Pagination({ data })
	let text = await pagination.text()
	let keyboard = await pagination.keyboard()
	if (bannedUsers.length < 1) {
		await ctx.reply('Список пуст.')
	} else {
		await ctx.reply(text, keyboard)
	}

	pagination.handleActions(composer)
})

composer.callbackQuery('unban', async ctx => {
	try {
		await ctx.conversation.enter('unbanUserConversation')
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
