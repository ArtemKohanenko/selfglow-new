import { getAllTarifsForAdmin } from '../functions/getAllTarifsForAdmin.js'
import { Tarif } from '../models/Tarif.js'
import { InlineKeyboard } from 'grammy'
import { Sequelize } from 'sequelize'

export const changeTarifPriorityConversation = async (conversation, ctx) => {
	try {
		const tarifId = ctx.session.changingPriorityTarifId
		const allTarifs = await Tarif.findAll()
		const inline = new InlineKeyboard().text('❌ Отмена', 'tarifPriorityBack')
		await ctx.reply(`Введите новый приоритет тарифа (1-${allTarifs.length})`, {
			reply_markup: inline,
		})
		const tarifPriority = await conversation.waitFor([
			'message:text',
			'callback_query',
		])
		if (
			tarifPriority.update.callback_query &&
			tarifPriority.update.callback_query.data &&
			tarifPriority.update.callback_query.data === 'tarifPriorityBack'
		) {
			return getAllTarifsForAdmin(ctx)
		} else {
			if (
				!/^\d+$/.test(tarifPriority.message?.text) &&
				!tarifPriority.update?.callback_query
			) {
				await ctx.reply('Вы должны ввести цифру.')
				return getAllTarifsForAdmin(ctx)
			} else if (tarifPriority.message.text > allTarifs.length) {
				await ctx.reply(
					`Вы не можете поставить приоритет больше чем ${allTarifs.length}`
				)
				return getAllTarifsForAdmin(ctx)
			} else {
				const newPriority = parseInt(tarifPriority.message.text)

				// Fetch the current tariff being updated
				const currentTarif = await Tarif.findByPk(tarifId)
				const currentPriority = currentTarif.priority

				// Update priorities of other tariffs
				if (newPriority < currentPriority) {
					await Tarif.update(
						{ priority: Sequelize.literal('priority + 1') },
						{
							where: {
								priority: {
									[Sequelize.Op.gte]: newPriority,
									[Sequelize.Op.lt]: currentPriority,
								},
							},
						}
					)
				} else if (newPriority > currentPriority) {
					await Tarif.update(
						{ priority: Sequelize.literal('priority - 1') },
						{
							where: {
								priority: {
									[Sequelize.Op.lte]: newPriority,
									[Sequelize.Op.gt]: currentPriority,
								},
							},
						}
					)
				}

				// Update the priority of the selected tariff
				await currentTarif.update({ priority: newPriority })

				await ctx.reply('Приоритет тарифа успешно изменен.')
				return getAllTarifsForAdmin(ctx)
			}
		}
	} catch (e) {
		console.log(e)
	}
}
