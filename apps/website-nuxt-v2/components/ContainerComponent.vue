<template>
  <main class="container">
    <img id="food-pot" src="/food-plate.png" alt="Plate of food" />
    <section>
      <HeaderComponent />
      <section class="content-area">
        <slot name="content"></slot>
      </section>
    </section>
    <MainSidebar>
      <slot name="sidebar"></slot>
    </MainSidebar>
    <slot />
  </main>
</template>
<script lang="ts">
import Vue from 'vue'
import MainSidebar from './MainSidebar.vue'
import HeaderComponent from './HeaderComponent.vue'

export default Vue.extend({
  name: 'ContainerComponent',
  components: { MainSidebar, HeaderComponent },
})
</script>
