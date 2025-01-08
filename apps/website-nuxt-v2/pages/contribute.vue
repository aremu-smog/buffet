<template>
  <ContainerComponent>
    <template #content>
      <p>
        Thank you for your interest in contributing to our buffet. Please kindly
        send a mail to
        <a href="mailto:buffet@aremusmog.com">buffet@aremusmog.com</a> with the
        amount you would like to contribute the buffet. The minimum you can
        contribute is 5,000NGN.
      </p>

      <p>
        Kindly also share your name and a social media handle you will like
        linked to you that would be featured on our donors page.
      </p>
      <p>
        We(I) understand some people may want to make anonymous donations, it’s
        alright to leave your name and social media handle if that’s the case.
      </p>

      <p>Cheers! ❤️</p>
    </template>
    <template #sidebar>
      <span
        >how to<br />
        <span>&nbsp;&nbsp;&nbsp;&nbsp;contribute</span>
      </span>
    </template>
  </ContainerComponent>
</template>
<script lang="ts">
import Vue from 'vue'
import ContainerComponent from '~/components/ContainerComponent.vue'

export default Vue.extend({
  name: 'ContributePage',
  components: {
    ContainerComponent,
  },
})
</script>
