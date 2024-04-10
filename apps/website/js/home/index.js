import { bankListInput } from "../ui"
import { makePayment, verifyAccountDetails } from "./api"
import { clearAccountNumberInput } from "./utils"

bankListInput.addEventListener("change", e => {
	const selectedBank = e.target.value

	if (!selectedBank) {
		accountNumberInput.setAttribute("disabled", "disabled")
	} else {
		if (!!accountNumberInput.value) {
			clearAccountNumberInput()
		}
		accountNumberInput.removeAttribute("disabled")
		accountNumberInput.setAttribute("placeholder", "9010761375")
		accountNumberInput.focus()
	}
})

accountNumberInput.addEventListener("keyup", async e => {
	const accountNumber = e.target.value

	const lengthOfAccountNumber = accountNumber.length

	if (lengthOfAccountNumber === ACCOUNT_NUMBER_LENGTH) {
		accountNumberInputMessage.innerHTML = `<span id="hourglass">⏳</span> Fetching Account Details`
		await verifyAccountDetails(accountNumber, bankListInput.value)
	}
})

bankInfoForm.addEventListener("submit", async e => {
	e.preventDefault()

	proceedToPayButton.innerHTML = `<span id="hourglass">⏳</span> Processing`
	proceedToPayButton.setAttribute("disabled", "disabled")

	await makePayment()
})
