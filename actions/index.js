import { Composer } from 'grammy'
import addTarif from './addTarif.js'
import cancel from './cancel.js'
import answerToUserAsk from './answerToUserAsk.js'
import settingsBan from './settingsBan.js'
import settingsAdmin from './settingsAdmin.js'
import selectTarifForAdmin from './selectTarifForAdmin.js'
import showPriceAtTarif from './showPriceAtTarif.js'
import tarifEdit from './tarifEdit.js'
import changeTarifPriority from './changeTarifPriority.js'
import selectTarif from './selectTarif.js'
import continueSubscription from './continiueSubscription.js'
import resources from './resources.js'
import settingsStats from './settingsStats.js'
import listings from './listings.js'
import settingsPromo from './settingsPromo.js'

const composer = new Composer()

composer.use(
	addTarif,
	cancel,
	answerToUserAsk,
	settingsBan,
	settingsAdmin,
	selectTarifForAdmin,
	showPriceAtTarif,
	tarifEdit,
	changeTarifPriority,
	selectTarif,
	continueSubscription,
	resources,
	settingsStats,
	listings,
	settingsPromo
)

export default composer
