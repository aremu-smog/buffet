<template>
	<p class="form-group__message">{{ message }}</p>
</template>
<script lang="ts" setup>
defineProps({
	message: {
		type: String,
		required: true,
	},
})
</script>
