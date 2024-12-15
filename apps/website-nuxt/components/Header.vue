<template>
	<header class="main-header">
		<h1>Serve yourself</h1>
		<p id="month-and-year">{{ currentMonthAndYear }}</p>
	</header>
</template>

<script lang="ts" setup>
defineProps({
	title: {
		type: String,
	},
})
const currentDate = new Date()
const currentMonthAndYear: Ref<string> = ref(
	currentDate.toLocaleString("en", {
		month: "long",
		year: "numeric",
	})
)
</script>
