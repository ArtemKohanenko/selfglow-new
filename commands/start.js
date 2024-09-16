import { Composer } from 'grammy'
import mainMenuFunction from '../functions/mainMenuFunction.js'
import { getAllTarifs } from '../functions/getAllTarifs.js'

const composer = new Composer()

function extractNumber(str) {
	const match = str.match(/\d+/) // Ищет одну или более цифр в строке
	return match ? parseInt(match[0], 10) : null // Преобразует найденную строку в число
}

composer.command('start', async ctx => {
	await mainMenuFunction(ctx)
	await getAllTarifs(ctx)
	const args = ctx.message.text.split(' ')

	if (args.length > 1) {
		const refCode = args[1]
		console.log(extractNumber(refCode))
	}
})

export default composer
