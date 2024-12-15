<template>
	<section data-visible="true" id="payment">
		<dotlottie-player
			id="confetti"
			src="https://lottie.host/eb8f0bfa-19d6-4ff4-8df8-8b5105dedebe/HYkzZi9AGo.json"
			background="transparent"
			speed="1"
			style="width: 100%; height: 100%"
			loop
			autoplay
		></dotlottie-player>

		<Header />
		<section class="content-area">
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
		</section>
	</section>

	<Sidebar>
		<span
			>how to<br />
			<span>&nbsp;&nbsp;&nbsp;&nbsp;contribute</span>
		</span>
	</Sidebar>
	<Preloader />
</template>
