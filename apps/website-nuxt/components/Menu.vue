<template>
	<nav class="main-navigation container" id="main-navigation">
		<ul class="main-navigation__list">
			<li class="main-navigation__list__item" v-for="page in pages">
				<NuxtLink :to="page.url">{{ page.name }}</NuxtLink>
			</li>
		</ul>
	</nav>
</template>
<script lang="ts" setup>
const pages: Ref<{ url: string; name: string }[]> = ref([
	{
		url: "/",
		name: "Home",
	},
	{
		url: "/about",
		name: "About",
	},
	{
		url: "contribute",
		name: "Contribute",
	},
])
</script>
