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
					v-model="form.bankName"
					id="bank-list"
					required
				>
					<option value="">Kindly select your bank</option>
					<option v-for="bank in banks" :value="bank.value">
						{{ bank.name }}
					</option>
				</select>
			</div>
			<div class="form-group">
				<label class="form-group__label" for="account-number"
					>Account Number</label
				>
				<input
					v-model="form.accountNumber"
					class="form-group__input"
					type="text"
					required
					ref="account-number"
					id="account-number"
					maxlength="10"
					:disabled="isAccountFieldDisabled"
					:placeholder="
						isAccountFieldDisabled
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
					v-model="form.emailAddress"
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
import { banks } from "~/data"

import Sidebar from "~/components/Sidebar.vue"
import { api } from "~/libs/api"

const form = reactive({
	bankName: "",
	accountNumber: "",
	emailAddress: "",
})

const { formattedRemainingSlots, hasGottenInformation, hasSlots } =
	useDonationInfo()

const accountInformationMessage = ref("")
const buttonText = ref("Proceed")

const isPaymentSuccessful = ref(false)
const isMakingPayment = ref(false)

const accountNumberInput = useTemplateRef("account-number")
const emailAddressInput = useTemplateRef("email-input")
const payButton = useTemplateRef("pay-button")

watch(
	() => form.bankName,
	bankName => {
		if (bankName) {
			setTimeout(() => {
				accountNumberInput.value?.focus()
			}, 100)
		}
	}
)
watch(
	() => form.accountNumber,
	async accountNumber => {
		if (accountNumber.length === 10) {
			accountInformationMessage.value = `<span id="hourglass">⏳</span> Fetching Account Details`
			const { account_name = "" } = await api.get("/validate_account_number", {
				account_number: form.accountNumber,
				bank_code: form.bankName,
			})
			if (!account_name) {
				accountInformationMessage.value = `<span>❌</span> Account not found. Kindly check account number`
				return
			}
			accountInformationMessage.value = `<span>✅</span> Account Name: ${account_name}`
			payButton.value?.removeAttribute("disabled")
			emailAddressInput.value?.focus()
		}
	}
)

const isAccountFieldDisabled = computed(() => !form.bankName)

const isPaymentDisabled = computed(() => {
	return [isAccountFieldDisabled, !hasSlots.value, isMakingPayment.value].some(
		Boolean
	)
})
const resetAllFormValues = () => {
	form.accountNumber = ""
	form.bankName = ""
	form.emailAddress = ""
}
const bannerText = computed(() => {
	if (isPaymentSuccessful.value) {
		return "Payment will be processed within 24hrs"
	}
	return "All slots for this month taken"
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
		account_number: form.accountNumber,
		bank_code: form.bankName,
		email: form.emailAddress,
	})

	if (status === 200 || status == 419) {
		isPaymentSuccessful.value = true
		accountInformationMessage.value = ""

		buttonText.value = `<span>🥳</span> Successful`
		setTimeout(() => {
			resetAllFormValues()
			buttonText.value = "Proceed"
			isMakingPayment.value = false
		}, 5_000)
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
