import { User } from '../models/User.js'

export async function sendMessageToAllAdmins(ctx, message) {
    const admins = await User.findAll({
        where: {
            isAdmin: true
        }
    });
    console.log("Admins:", admins.map(admin => admin.tgId))
    
    for (const admin of admins) {
        await ctx.api.sendMessage(admin.tgId, message, { parse_mode: 'HTML' });
    }
    console.log("Message sended to all admins")
}


// bot.js ( оплата прошла )
// mainMenuFunction новый пользователь
// selectTarif нажал оплатить