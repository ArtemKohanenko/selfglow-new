import { Keyboard } from 'grammy'

export const adminMenuKeyboard = new Keyboard()
	.text('💰 Тарифы')
	.text('📈 Каналы / Группы')
	.row()
	.text('⚙️ Настройки')
	.text('📢 Рассылка')
	.row()
	.text('🔙 Главное меню')
	.resized()
