import { User } from '../models/User.js'

export async function sendMessageToAllAdmins(ctx, message) {
    // const admins = await User.findAll({
    //     where: {
    //         isAdmin: true
    //     }
    // });
    // TODO: верни как было
    const admins = [
        {
            tgId: 1780484769
        }
    ]
    
    for (const admin of admins) {
        await ctx.api.sendMessage(admin.tgId, message, { parse_mode: 'HTML' });
    }
}


// bot.js ( оплата прошла )
// mainMenuFunction новый пользователь
// selectTarif нажал оплатить