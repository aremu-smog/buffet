<template>
  <nav class="main-navigation container" id="main-navigation">
    <ul class="main-navigation__list">
      <li
        v-for="page in pages"
        :key="page.url"
        class="main-navigation__list__item"
      >
        <NuxtLink
          :to="page.url"
          exact-active-class="main-navigation__list__item--active"
          >{{ page.name }}</NuxtLink
        >
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'MainNav',

  data() {
    const pages: { url: string; name: string }[] = [
      {
        url: '/',
        name: 'Home',
      },
      {
        url: '/about',
        name: 'About',
      },
      {
        url: 'contribute',
        name: 'Contribute',
      },
    ]

    return { pages }
  },
})
</script>
