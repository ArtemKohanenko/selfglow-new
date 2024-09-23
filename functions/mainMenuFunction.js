import { User } from '../models/User.js'
import { sendMessageToAllAdmins } from '../functions/sendMessageToAllAdmins.js'
import {
	adminStartKeyboard,
	startKeyboard,
} from '../keyboards/startKeyboard.js'
import 'dotenv/config'
import addMenuCustomPagesToKeyboard from './addMenuCustomPagesToKeyboard.js'


export default async ctx => {
	const user = await User.findOne({ where: { tgId: ctx.from.id } })
	console.log(ctx.from)
	if (!user) {
		let fullname
		if (!ctx.from.last_name) {
			fullname = ctx.from.first_name
		} else if (!ctx.from.first_name) {
			fullname = null
		}
		const user = await User.create({
			tgId: ctx.from.id,
			username:
				ctx.from.username !== undefined ? `@${ctx.from.username}` : null,
			firstName: ctx.from.first_name !== undefined ? ctx.from.first_name : null,
			lastName: ctx.from.last_name !== undefined ? ctx.from.last_name : null,
			fullName: fullname,
		})
		const message_to_admin = `🆕Новый пользователь: <a href="https://t.me/${ctx.from.username}">${fullname}</a>
			🆔UserID: <code>${ctx.from.id}</code>`
		await sendMessageToAllAdmins(ctx, message_to_admin)
		const startKeyboardWithCustomPages = await addMenuCustomPagesToKeyboard(startKeyboard)
		await ctx.reply(
			`Привет, красотка! 💕
Рада приветствовать тебя в своем боте, который поможет тебе разобраться во всех интересующих вопросах:

- здесь ты сможешь вступить в мой закрытый проект Self Glow (нажми на тариф, чтобы узнать подробнее о том, как происходит психологическая работа, забота и помощь внутри этого уникального психологического проекта)

- приобрести авторский терапевтический ежедневник  Luckiest Girl, который бережно создан для того, чтобы стать твоим "карманным психологом" (нажми на на кликабельную кнопку, чтобы узнать подробнее)

- приобрести авторский ежедневник для ведения дел Empire, который бережно создан для того, чтобы все твои цели на день/неделю/месяц успешно достигались и были структурированы (нажми на кликабельную кнопку, чтобы узнать подробнее)

- приобрести ассоциативные карты Pink Mood, которые станут верным помощником в ответах на внутренние вопросы и задатут правильный настрой на целый день (нажми на кликабельную кнопку, чтобы узнать подробнее)

- а также:

- записаться ко мне на личную консультацию  (нажми на кликабельную кнопку, чтобы узнать подробнее)

- записаться ко мне на коуч - сессию  (нажми на кликабельную кнопку, чтобы узнать подробнее)

Желаю удачи!

И до встречи в моих проектах!

С любовью и заботой о тебе, Софья Кононова, психолог и основатель Self Kindness Academy

Чтобы выбрать необходимую услугу, нажмите кнопку тарифы 👇🏻

Оплачивая подписку вы соглашаетесь с договором оферты и даете согласие на обработку персональных данных.`,
			{
				reply_markup: startKeyboardWithCustomPages,
			}
		)
	} else {
		const startKeyboardWithCustomPages = await addMenuCustomPagesToKeyboard(startKeyboard)
		const adminStartKeyboardWithCustomPages = await addMenuCustomPagesToKeyboard(adminStartKeyboard)
		await ctx.reply(
			`Привет, красотка! 💕
Рада приветствовать тебя в своем боте, который поможет тебе разобраться во всех интересующих вопросах:

- здесь ты сможешь вступить в мой закрытый проект Self Glow (нажми на тариф, чтобы узнать подробнее о том, как происходит психологическая работа, забота и помощь внутри этого уникального психологического проекта)

- приобрести авторский терапевтический ежедневник  Luckiest Girl, который бережно создан для того, чтобы стать твоим "карманным психологом" (нажми на на кликабельную кнопку, чтобы узнать подробнее)

- приобрести авторский ежедневник для ведения дел Empire, который бережно создан для того, чтобы все твои цели на день/неделю/месяц успешно достигались и были структурированы (нажми на кликабельную кнопку, чтобы узнать подробнее)

- приобрести ассоциативные карты Pink Mood, которые станут верным помощником в ответах на внутренние вопросы и задатут правильный настрой на целый день (нажми на кликабельную кнопку, чтобы узнать подробнее)

- а также:

- записаться ко мне на личную консультацию  (нажми на кликабельную кнопку, чтобы узнать подробнее)

- записаться ко мне на коуч - сессию  (нажми на кликабельную кнопку, чтобы узнать подробнее)

Желаю удачи!

И до встречи в моих проектах!

С любовью и заботой о тебе, Софья Кононова, психолог и основатель Self Kindness Academy

Чтобы выбрать необходимую услугу, нажмите кнопку тарифы 👇🏻

Оплачивая подписку вы соглашаетесь с договором оферты и даете согласие на обработку персональных данных.`,
			{
				reply_markup: user.isAdmin ? adminStartKeyboardWithCustomPages : startKeyboardWithCustomPages,
			}
		)
	}
}
