import { Tarif } from './Tarif.js'
import { User } from './User.js'
import { Subscriber } from './Subscriber.js'
import { Resource } from './Resource.js'
import { Payment } from './Payment.js'

// Tarif.hasOne(Subscriber, { foreignKey: 'tarifId', as: 'subscriber' })
// Tarif.hasOne(Payment, { foreignKey: 'tarifId', as: 'payment' })
Payment.belongsTo(Tarif, { foreignKey: 'tarifId', as: 'tarif' })
User.hasMany(Subscriber, { foreignKey: 'userId', as: 'subscriber' })
Subscriber.belongsTo(Tarif, { foreignKey: 'tarifId', as: 'tarif' })
Subscriber.belongsTo(User, { foreignKey: 'userId', as: 'user' })
// Tarif.belongsTo(Resource, { foreignKey: 'resourceId' })
Resource.hasOne(Tarif, { foreignKey: 'resourceId' })

Tarif.associate = function () {
	Tarif.hasOne(Payment, { foreignKey: 'tarifId', as: 'paymentDetail' })
	Tarif.hasOne(Subscriber, {
		foreignKey: 'tarifId',
		as: 'subscriberDetail',
	})
	Tarif.belongsTo(Resource, { foreignKey: 'resourceId' })
}
