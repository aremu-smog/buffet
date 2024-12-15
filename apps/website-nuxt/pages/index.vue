<template>
	<section data-visible="true" id="payment">
		<Vue3Lottie
			animationLink="https://lottie.host/eb8f0bfa-19d6-4ff4-8df8-8b5105dedebe/HYkzZi9AGo.json"
			background="transparent"
			:speed="1"
			:auto-play="true"
			height="100%"
			width="100%"
			id="confetti"
			:loop="true"
			v-show="isPaymentSuccessful"
		/>

		<Header />
		<form v-on:submit.prevent="makePayment" id="bank-info-form">
			<div class="form-group">
				<label class="form-group__label" for="bank-list">Bank Name</label>
				<select
					class="form-group__input"
					v-model="bankName"
					id="bank-list"
					required
				>
					<option value="">Kindly select your bank</option>
					<option value="999992">OPay Digital Services Limited (OPay)</option>
					<option value="999991">PalmPay</option>
					<option value="044">Access Bank</option>
					<option value="50211">Kuda Bank</option>
					<option value="058">Guaranty Trust Bank</option>
					<option value="057">Zenith Bank</option>
					<option value="033">United Bank For Africa</option>
					<option value="032">Union Bank of Nigeria</option>
					<option value="076">Polaris Bank</option>
					<option value="101">Providus Bank</option>
					<option value="232">Sterling Bank</option>
				</select>
			</div>
			<div class="form-group">
				<label class="form-group__label" for="account-number"
					>Account Number</label
				>
				<input
					v-model="accountNumber"
					class="form-group__input"
					type="text"
					required
					ref="account-number"
					id="account-number"
					maxlength="10"
					:disabled="isAccountNumberFieldDisabled"
					:placeholder="
						isAccountNumberFieldDisabled
							? 'Please select your bank'
							: 'Kindly enter your account number'
					"
					pattern="^\d{10}$"
				/>
				<p class="form-group__message" v-html="accountInformationMessage"></p>
			</div>
			<div class="form-group">
				<label class="form-group__label" for="account-number"
					>Email Address</label
				>
				<input
					ref="email-input"
					v-model="emailAddress"
					class="form-group__input"
					type="email"
					required
					id="email-address"
					placeholder="e.g buffet@aremusmog.com"
				/>
			</div>

			<button
				ref="pay-button"
				id="proceed-to-pay"
				:disabled="isPaymentDisabled"
				v-html="buttonText"
			></button>
		</form>

		<div id="banner" v-show="!hasSlots || isPaymentSuccessful">
			<p>{{ bannerText }}</p>
		</div>
	</section>
	<Sidebar>
		<span
			><span id="remaining-slots">{{ formattedRemainingSlots }}</span>
			Slots</span
		><br />
		<span>&nbsp;&nbsp;&nbsp;&nbsp;5,000NGN</span>
	</Sidebar>
	<Preloader :hasLoaded="hasGottenInformation" />
</template>

<script setup lang="ts">
import { Vue3Lottie } from "vue3-lottie"

import Sidebar from "~/components/Sidebar.vue"
import { api } from "~/libs/api"

const bankName = ref("")
const accountNumber = ref("")
const emailAddress = ref("")
const accountNumberInput = useTemplateRef("account-number")
const emailAddressInput = useTemplateRef("email-input")
const payButton = useTemplateRef("pay-button")

const remainingSlots = ref(10)

const accountInformationMessage = ref("")
const buttonText = ref("Proceed")

const isAccountNumberFieldDisabled = ref(true)
const hasGottenInformation = ref(false)
const hasSlots = ref(false)
const isPaymentSuccessful = ref(false)
const isMakingPayment = ref(false)

const formattedRemainingSlots = computed(() => {
	return remainingSlots.value < 10
		? `0${remainingSlots.value}`
		: remainingSlots.value
})
watch(bankName, (newValue, oldValue) => {
	if (newValue) {
		isAccountNumberFieldDisabled.value = false
		setTimeout(() => {
			accountNumberInput.value?.focus()
		}, 100)
	} else {
		isAccountNumberFieldDisabled.value = true
	}
})

const isPaymentDisabled = computed(() => {
	return (
		isAccountNumberFieldDisabled.value ||
		!hasSlots.value ||
		isMakingPayment.value
	)
})
const resetAllFormValues = () => {
	bankName.value = ""
	accountNumber.value = ""
	emailAddress.value = ""
}
const bannerText = computed(() => {
	if (isPaymentSuccessful.value) {
		return "Payment will be processed within 24hrs"
	}
	return "All slots for this month taken"
})
watch(accountNumber, async (newValue, oldValue) => {
	accountInformationMessage.value = ""
	if (newValue.length === 10) {
		accountInformationMessage.value = `<span id="hourglass">⏳</span> Fetching Account Details`
		const { account_name = "" } = await api.get("/validate_account_number", {
			account_number: accountNumber.value,
			bank_code: bankName.value,
		})
		if (!account_name) {
			accountInformationMessage.value = `<span>❌</span> Account not found. Kindly check account number`
			return
		}
		accountInformationMessage.value = `<span>✅</span> Account Name: ${account_name}`
		payButton.value?.removeAttribute("disabled")
		emailAddressInput.value?.focus()
	}
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

const makePayment = async () => {
	isMakingPayment.value = true
	const { status } = await api.post<
		{
			account_number: string
			bank_code: string
			email: string
		},
		{ status: number }
	>("/pay", {
		account_number: accountNumber.value,
		bank_code: bankName.value,
		email: emailAddress.value,
	})

	if (status === 200 || status == 419) {
		isPaymentSuccessful.value = true
		accountInformationMessage.value = ""

		buttonText.value = `<span>🥳</span> Successful`
		setTimeout(() => {
			resetAllFormValues()
			buttonText.value = "Proceed"
			isMakingPayment.value = false
		}, 2_000)
	} else {
		buttonText.value = `<span>😔</span> Payment Failed. Try again`
		setTimeout(() => {
			buttonText.value = `Proceed`
			payButton.value?.removeAttribute("disabled")
			isMakingPayment.value = false
		}, 3_000)
	}
}
</script>
