import tailwindColors from 'tailwindcss/colors'

const config = {
	content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'],

	plugins: [require('flowbite/plugin')],

	darkMode: 'class',

	theme: {
		extend: {
			colors: {
				primary: tailwindColors.cyan
			}
		}
	}
}

module.exports = config
