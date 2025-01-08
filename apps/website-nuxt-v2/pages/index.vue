<template>
  <ContainerComponent>
    <template #content>
      <form v-on:submit.prevent="makePayment">
        <div class="form-group">
          <label for="" class="form-group__label">Bank Name</label>
          <select
            id="bank-list"
            v-model="form.bankName"
            class="form-group__input"
            required
          >
            <option value="">Kindly select your bank</option>
            <option
              v-for="bank in banks"
              v-bind:key="bank.value"
              :value="bank.value"
            >
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
    </template>
    <template #sidebar>
      <span
        ><span id="remaining-slots">{{ '' }}</span> Slots</span
      ><br />
      <span>&nbsp;&nbsp;&nbsp;&nbsp;5,000NGN</span>
    </template>
  </ContainerComponent>
</template>

<script lang="ts">
import Vue from 'vue'
import ContainerComponent from '~/components/ContainerComponent.vue'
import { banks } from '~/data'

export default Vue.extend({
  name: 'IndexPage',
  components: {
    ContainerComponent,
  },
  data() {
    return {
      banks,
      buttonText: 'Make Payment',
      accountInformationMessage: '',
      isAccountFieldDisabled: false,
      form: {
        bankName: '',
        accountNumber: '',
        emailAddress: '',
      },
    }
  },
  computed: {
    isPaymentDisabled() {
      return [this.isAccountFieldDisabled].some(Boolean)
    },
  },
  watch: {
    'form.bankName'(newValue) {
      this.isAccountFieldDisabled = false
      if (newValue) {
        const accountNumberInput = this.$refs[
          'account-number'
        ] as HTMLInputElement
        this.isAccountFieldDisabled = true
        if (accountNumberInput) {
          accountNumberInput.focus()
        }
      }
    },
    'form.accountNumber'(newValue) {
      if (newValue.length === 10) {
        const emailInput = this.$refs['email-input'] as HTMLInputElement
        if (emailInput) {
          emailInput.focus()
        }
      }
    },
  },
  methods: {
    makePayment() {
      console.log('Now is the time to make this payment')
    },
    resetAllFormValues() {
      const formFields = Object.keys(this.form) as (keyof typeof this.form)[]
      for (const formField of formFields) {
        this.form[formField] = ''
      }
    },
  },
})
</script>
