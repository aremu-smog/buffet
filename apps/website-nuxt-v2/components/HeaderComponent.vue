<template>
  <header class="main-header">
    <h1>Serve yourself</h1>
    <p id="month-and-year">{{ currentMonthAndYear }}</p>
  </header>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'HeaderComponent',

  data() {
    const currentDate = new Date()
    const currentMonthAndYear = currentDate.toLocaleString('en', {
      month: 'long',
      year: 'numeric',
    })

    return {
      currentMonthAndYear,
    }
  },
})
</script>
