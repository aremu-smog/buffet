import {
	accountNumberInput,
	accountNumberInputMessage,
	bankInfoForm,
} from "../ui"

import { disableAllFormFields } from "../utils"

export const clearAccountNumberInput = () => {
	accountNumberInput.value = ""
	accountNumberInputMessage.innerHTML = ""
}

export const disablePaymentFormFields = () => {
	disableAllFormFields(bankInfoForm)
}
