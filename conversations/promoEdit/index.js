import { createConversation } from '@grammyjs/conversations'
import { Composer } from 'grammy'
import { editPromoActivationCountConversation } from './editPromoActivationCountConversation.js'
import { editPromoActivationCountPerUserConversation } from './editPromoActivationCountPerUserConversation.js'
import { editPromoDurationConversation } from './editPromoDurationConversation.js'

const composer = new Composer()

composer.use(createConversation(editPromoActivationCountConversation))
composer.use(createConversation(editPromoActivationCountPerUserConversation))
composer.use(createConversation(editPromoDurationConversation))

export default composer
