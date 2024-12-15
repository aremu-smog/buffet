<template>
	<main class="container">
		<img id="food-pot" src="/food-plate.png" alt="Plate of food" />
		<slot />
	</main>

	<Menu />
	<footer class="main-footer container">
		<p>
			Designed & Built by
			<a href="https://twitter.com/aremu_smog" target="_blank">Aremu Smog</a>
			in Ibadan
		</p>
	</footer>
</template>
