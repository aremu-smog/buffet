import { APPLICATION_NAME } from "./constants"

/**
 *
 * @param {string} storage_key
 * @returns string
 */
export const getFromLocalStroage = async storage_key => {
	const value = await window.localStorage.getItem(getStorageKey(storage_key))
	return JSON.parse(value)
}

/**
 *
 * @param {string} storage_key
 * @param {any} value
 */

export const addToLocalStorage = async (storage_key, value) => {
	await window.localStorage.setItem(
		getStorageKey(storage_key),
		JSON.stringify(value)
	)
}

/**
 *
 * @param {string} storage_key
 * @returns string
 */
export const getStorageKey = storage_key => {
	return `${APPLICATION_NAME}-${storage_key}`
}

/**
 *
 * @param {Object} object
 * @returns boolean
 */

export const isObjectEmpty = (object = {}) => {
	Object.keys(object).length == 0
}

/**
 * @example
 * April 2024
 * @returns string
 */
export const currentMonthAndYear = () => {
	const today = new Date()
	const monthAndYear = today.toLocaleString("en", {
		month: "long",
		year: "numeric",
	})

	return monthAndYear
}

export const disableAllFormFields = async form => {
	const allFormFields = form.querySelectorAll("input, select")

	allFormFields.forEach(formField => {
		formField.setAttribute("disabled", "disabled")
	})
}

export const loadMonthAndYear = () => {
	const monthAndYearParagraph = document.querySelector("#month-and-year")
	monthAndYearParagraph.innerText = currentMonthAndYear()
}
