import { Config } from '../models/Config.js'
import { MenuPage } from '../models/MenuPage.js'

const addFeedbackToKeyboard = async function (keyboard) {
	const newKeyboard = keyboard.clone()
	const config = await Config.findByPk(1)
	if (config.feedbackAvailable) {
		newKeyboard.row('📨 Обратная связь')
	}
	
	return newKeyboard
}

export default addFeedbackToKeyboard;