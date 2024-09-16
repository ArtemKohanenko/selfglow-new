import { Composer } from 'grammy'
import sendListings from '../functions/sendListings.js'

const composer = new Composer()

composer.hears('📢 Рассылка', async ctx => {
	await sendListings(ctx)
})

export default composer
