import { User } from '../models/User.js'

export async function sendMessageToAllAdmins(ctx, message) {
    const admins = await User.findAll({
        where: {
            isAdmin: true
        }
    });
    
    for (const admin of admins) {
        await ctx.api.sendMessage(admin.tgId, message, { parse_mode: 'HTML' });
    }
}


// bot.js ( оплата прошла )
// mainMenuFunction новый пользователь
// selectTarif нажал оплатить