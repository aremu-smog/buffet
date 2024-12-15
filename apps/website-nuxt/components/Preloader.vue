<template>
	<div
		class="preloader"
		:class="shouldHidePreloader && 'preloader--hide'"
		id="preloader"
	>
		<p>👨🏽‍🍳 Cooking...</p>
	</div>
</template>
<script lang="ts" setup>
const isLoaded = ref(false)
const props = defineProps({
	hasLoaded: {
		type: Boolean,
		required: false,
		default: true,
	},
})
onMounted(() => {
	setTimeout(() => {
		isLoaded.value = true
	}, 1000)
})

const shouldHidePreloader = computed(() => {
	return isLoaded.value && props.hasLoaded
})
</script>
