import { User } from '../models/User.js'

export async function sendMessageToAllAdmins(ctx, message) {
    const admins = await User.findAll({
        where: {
            isAdmin: true
        }
    });
    
    console.log("Admins:", admins.map(admin => admin.tgId))
    
    for (const admin of admins) {
        try {
            await ctx.api.sendMessage(admin.tgId, message, { parse_mode: 'HTML' });
        }
        catch {
            console.log(`Failed to send message to admin ${admin.tgId}`)
        }
    }
    console.log("Message sended to all admins")
}


// bot.js ( оплата прошла )
// mainMenuFunction новый пользователь
// selectTarif нажал оплатить