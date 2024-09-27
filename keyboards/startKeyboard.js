import { Keyboard } from 'grammy'

const startKeyboard = new Keyboard()
	.text('🛒 Тарифы')
	.text('📊 Подписки')
	.row()
	.text('Политика обработки персональных данных')
	.text('Согласие на обработку персональных данных')
	.row()
	.text('Публичная оферта')
	.text('Согласие на информационную и рекламную рассылку.').row()



const adminStartKeyboard = new Keyboard()
	.text('🛒 Тарифы')
	.text('📊 Подписки')
	.row()
	.text('Политика обработки персональных данных')
	.text('Согласие на обработку персональных данных')
	.row()
	.text('Публичная оферта')
	.text('Согласие на информационную и рекламную рассылку.')
	.row()
	.text('⚙️ Админ меню').row()
	
export { startKeyboard, adminStartKeyboard }