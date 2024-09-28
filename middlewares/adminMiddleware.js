import { User } from '../models/User.js'

export async function adminMiddleware(ctx, next) {
	const user = await User.findOne({ where: { tgId: ctx.from.id } })
	if (user && user.isAdmin) {
		console.log('admin', ctx.from.id)
		await next()
	} else {
		return console.log('not admin', ctx.from.id)
	}
	await next()
}
