import { createConversation } from '@grammyjs/conversations'
import { Composer } from 'grammy'
import { addTarifConversation } from './addTarifConversation.js'
import { askUserConversation } from './askUserConversation.js'
import { answerToUserConversation } from './answerToUserConversation.js'
import { banUserConversation } from './banUserConversation.js'
import { unbanUserConversation } from './unbanUserConversation.js'
import { addAdminConversation } from './addAdminConversation.js'
import { deleteAdminConversation } from './deleteAdminConversation.js'
import { changeTarifPriorityConversation } from './changeTarifPriorityConversation.js'
import { addChannelConversation } from './addChannelConversation.js'
import tarifEdit from './tarifEdit/index.js'
import { addChatConversation } from './addChatConversation.js'
import { sendListingConversation } from './sendListingConversation.js'
import { createPromoConversation } from './createPromoConversation.js'
import promoEdit from './promoEdit/index.js'

const composer = new Composer()

composer.use(createConversation(addTarifConversation))
composer.use(createConversation(askUserConversation))
composer.use(createConversation(answerToUserConversation))
composer.use(createConversation(banUserConversation))
composer.use(createConversation(unbanUserConversation))
composer.use(createConversation(addAdminConversation))
composer.use(createConversation(deleteAdminConversation))
composer.use(createConversation(changeTarifPriorityConversation))
composer.use(createConversation(addChannelConversation))
composer.use(createConversation(addChatConversation))
composer.use(createConversation(sendListingConversation))
composer.use(createConversation(createPromoConversation))

composer.use(tarifEdit, promoEdit)

export default composer
