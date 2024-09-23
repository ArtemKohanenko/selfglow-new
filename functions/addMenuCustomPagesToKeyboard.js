import { MenuPage } from '../models/MenuPage.js'

//🔹🔸
const addMenuCustomPagesToKeyboard = async function (keyboard) {
	const newKeyboard = keyboard.clone()
	const pages = await MenuPage.findAll()
	pages.forEach((page, i) => {
		newKeyboard.text(page.buttonText)
		if (i % 2 != 0) {
			newKeyboard.row()
		}
	})
	if (pages.length % 2 != 0) {
		newKeyboard.row()
	}
	
	return newKeyboard
}

export default addMenuCustomPagesToKeyboard;