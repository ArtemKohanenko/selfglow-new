import { createConversation } from '@grammyjs/conversations'
import { Composer } from 'grammy'
import { tarifNameConversation } from './tarifNameConversation.js'
import { tarifPriceConversation } from './tarifPriceConversation.js'
import { tarifDescriptionConversation } from './tarifDescriptionConversation.js'
import { tarifReceiptNameConversation } from './tarifReceiptNameConversation.js'
import { tarifSuccessConversation } from './tarifSuccessConversation.js'
import { tarifCurrencyConversation } from './tarifCurrencyConversation.js'
import { tarifTimeConversation } from './tarifTimeConversation.js'

const composer = new Composer()

composer.use(createConversation(tarifNameConversation))
composer.use(createConversation(tarifPriceConversation))
composer.use(createConversation(tarifDescriptionConversation))
composer.use(createConversation(tarifReceiptNameConversation))
composer.use(createConversation(tarifSuccessConversation))
composer.use(createConversation(tarifCurrencyConversation))
composer.use(createConversation(tarifTimeConversation))

export default composer
