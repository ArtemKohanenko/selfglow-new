import { User } from '../models/User.js'

export async function banMiddleware(ctx, next) {
	// const user = await User.findOne({ where: { tgId: ctx.from.id } })
	// if (user && user.isBanned) {
	// 	return console.log('banned')
	// } else await next()
	await next()
}
