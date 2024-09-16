import { Composer } from 'grammy'

const composer = new Composer()

composer.hears('Политика обработки персональных данных', async ctx => {
	await ctx.reply('https://disk.yandex.ru/i/PYyrpIQmKf8WGg')
})
composer.hears('Согласие на обработку персональных данных', async ctx => {
	await ctx.reply('https://disk.yandex.ru/i/jsTjpf764ToMsg')
})
composer.hears('Публичная оферта', async ctx => {
	await ctx.reply(`https://disk.yandex.ru/i/zcJEkdDq7xqlNQ

https://disk.yandex.ru/i/aanHngFoI7goDg`)
})
composer.hears(
	'Согласие на информационную и рекламную рассылку.',
	async ctx => {
		await ctx.reply(`https://disk.yandex.ru/i/ClWBBju5V39aZg

https://disk.yandex.ru/i/NVT05UdIxGDwWA`)
	}
)

export default composer
