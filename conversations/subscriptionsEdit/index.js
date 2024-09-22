import { createConversation } from '@grammyjs/conversations'
import { Composer } from 'grammy'
import  { giveSubscriptionConversation } from './giveSubscriptionConversation.js'
import  { cancelSubscriptionConversation } from './cancelSubscriptionConversation.js'
import  { renewSubscriptionConversation } from './renewSubscriptionConversation.js'
import  { userProfileConversation } from './userProfileConversation.js'

const composer = new Composer()

composer.use(createConversation(giveSubscriptionConversation))
composer.use(createConversation(cancelSubscriptionConversation))
composer.use(createConversation(renewSubscriptionConversation))
composer.use(createConversation(userProfileConversation))

export default composer
