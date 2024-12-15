import { api } from "~/libs/api"

export function useDonationInfo() {
	const remainingSlots = ref(10)
	const hasSlots = ref(false)
	const hasGottenInformation = ref(false)

	const formattedRemainingSlots = computed(() => {
		return remainingSlots.value < 10
			? `0${remainingSlots.value}`
			: remainingSlots.value
	})

	onMounted(async () => {
		const { remaining_slots, has_slots } = await api.get<{
			remaining_slots: number
			has_slots: boolean
			amount_per_recipient: number
		}>("/donation_info")
		hasGottenInformation.value = true
		remainingSlots.value = has_slots ? remaining_slots : 10
		hasSlots.value = has_slots
	})

	return {
		remainingSlots,
		hasSlots,
		hasGottenInformation,
		formattedRemainingSlots,
	}
}
