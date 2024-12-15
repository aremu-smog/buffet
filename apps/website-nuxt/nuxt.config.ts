// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2024-11-01",
	devtools: { enabled: process.env.NODE_ENV === "development" },
	css: ["~/assets/css/main.css"],
	app: {
		head: {
			title: "Aremu's Buffet",
			meta: [
				{
					name: "description",
					content: "Serve yourself if 5,000 NGN is not too small for you",
				},
				{
					name: "keywords",
					content:
						"Aremu's Buffet, buffet, self-serve, 5000 NGN, dining, restaurant",
				},
				{ name: "author", content: "Aremu Oluwagbamila (SMOG)" },
				{ name: "og:title", content: "Aremu's Buffet" },
				{
					name: "og:description",
					content: "Serve yourself if 5,000 NGN is not too small for you",
				},
				{
					name: "og:image",
					content:
						"https://res.cloudinary.com/aremusmog/image/upload/v1712782713/smog%20buffet/Serve_yourself_q8q2nb.jpg",
				},
			],
		},
	},
})
