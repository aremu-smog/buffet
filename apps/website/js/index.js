import { api } from "./api"
import {
	getFromLocalStroage,
	currentMonthAndYear,
	loadMonthAndYear,
} from "./utils"
import { STORAGE_KEYS } from "./constants"
import { disablePaymentFormFields } from "./home/utils"
import { noMoreSlotBanner, remainingSlotSpan } from "./ui"

window.addEventListener("load", async () => {
	loadMonthAndYear()

	const currentMonth = await getFromLocalStroage(STORAGE_KEYS.CURRENT_MONTH)

	if (currentMonth === currentMonthAndYear()) {
		await disablePaymentFormFields()
		noMoreSlotBanner.style.display = "block"
	}

	const { remaining_slots = "", has_slots } = await api.get("/donation_info")
	remainingSlotSpan.innerHTML =
		remaining_slots < 10 ? `0${remaining_slots}` : remaining_slots
	if (!has_slots) {
		await disablePaymentFormFields()
		remainingSlotSpan.innerHTML = 10
		noMoreSlotBanner.style.display = "block"
	}
})
