<script lang="ts">
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Button, Select } from 'flowbite-svelte'
	import { Textarea } from 'flowbite-svelte'
	import { translateSDWUIToInvoke } from '../scripts/stable_diffusion_lang'
	import { Section, HeroHeader } from 'flowbite-svelte-blocks'
	import { Icon } from 'flowbite-svelte-icons'
	import { Footer, FooterBrand, FooterLinkGroup, FooterLink, FooterCopyright, FooterIcon } from 'flowbite-svelte'
	import { DarkMode } from 'flowbite-svelte'

	const availableLanguages = [
		{ value: 'automatic1111', name: 'A1111 Web UI' },
		{ value: 'invokeai', name: 'InvokeAI' }
	]

	let selectedLanguage1 = availableLanguages[0].value
	let selectedLanguage2 = availableLanguages[1].value

	function onFormSubmit() {
		// Get form data
		const formElement = document.getElementById('form') as HTMLFormElement

		if (!formElement) {
			throw new Error('Form element not found')
		}

		const formData = new FormData(formElement)

		// Get textarea data
		const textarea1 = formData.get('textarea-1')
		const textarea2 = formData.get('textarea-2')

		if (textarea1 == null || textarea2 == null) {
			throw new Error('Textarea not found')
		}

		// Translate
		const translated = translateSDWUIToInvoke(textarea1.toString())

		document.getElementById('textarea-2').value = translated
	}

	function copyToClipboard() {
		const textarea2 = document.getElementById('textarea-2') as HTMLTextAreaElement

		if (!textarea2) {
			throw new Error('Textarea not found')
		}

		textarea2.select()
		textarea2.setSelectionRange(0, 99999)

		document.execCommand('copy')
	}
</script>

<svelte:head>
	<title>PolyPrompter &mdash; Stable Diffusion prompt translator</title>
	<meta
		name="description"
		content="Translate prompts from AUTOMATIC1111/stable-diffusion-webui to invoke-ai/InvokeAI, and vice-versa."
	/>
</svelte:head>

<Section name="heroDefault">
	<Navbar
		class="mb-8 md:mb-16"
		let:hidden
		let:toggle
	>
		<NavBrand href="/">
			<img
				src="https://flowbite.com/docs/images/logo.svg"
				class="mr-3 h-6 sm:h-9"
				alt="PolyPrompter Logo"
			/>
			<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">PolyPrompter</span>
		</NavBrand>
		<NavHamburger on:click={toggle} />
		<NavUl {hidden}>
			<NavLi href="/">Home</NavLi>
			<NavLi>
				<DarkMode />
			</NavLi>
		</NavUl>
	</Navbar>

	<HeroHeader>
		<svelte:fragment slot="h1">Write your prompt once, use anywhere</svelte:fragment>

		<svelte:fragment slot="paragraph">
			Translate prompts from AUTOMATIC1111/stable-diffusion-webui to invoke-ai/InvokeAI, and vice-versa. WIP.
		</svelte:fragment>
	</HeroHeader>

	<main class="mt-16 md:mt-24 mb-32 md:mb-64">
		<form id="form">
			<!-- Header -->
			<div class="flex justify-between items-center gap-4 mb-4 md:mb-8">
				<Select
					disabled
					underline
					items={availableLanguages}
					bind:value={selectedLanguage1}
				/>

				<Button
					color="light"
					disabled
				>
					<Icon name="arrows-repeat-solid" />
				</Button>

				<Select
					disabled
					underline
					items={availableLanguages}
					bind:value={selectedLanguage2}
				/>
			</div>

			<!-- Body -->
			<div class="flex md:flex-row gap-4 flex-col w-full justify-center">
				<div class="flex-1">
					<Textarea
						on:input={onFormSubmit}
						id="textarea-1"
						rows="8"
						name="textarea-1"
					/>
				</div>
				<div class="flex-1 relative">
					<Textarea
						id="textarea-2"
						rows="8"
						name="textarea-2"
					/>

					<Button
						size="sm"
						on:click={copyToClipboard}
						color="light"
						class="absolute bottom-3.5 right-2"
					>
						<Icon
							size="sm"
							name="clipboard-solid"
						/>
					</Button>
				</div>
			</div>
		</form>

		<p class="mt-4 text-gray-500 dark:text-gray-400 text-sm">
			Beware: LoRA and other specific bits can't be translated, as they are options that have to be set in the
			interface.
		</p>
	</main>

	<Footer footerType="socialmedia">
		<div class="mx-auto max-w-screen-xl text-center">
			<FooterBrand
				href="/"
				name="PolyPrompter"
				aClass="flex justify-center items-center text-2xl font-semibold text-gray-900 dark:text-white"
			/>

			<p class="my-6 text-gray-500 dark:text-gray-400">
				Transform Stable Diffusion prompts. Privacy friendly, everything runs in your browser.
			</p>

			<FooterLinkGroup ulClass="flex flex-wrap gap-y-2 justify-center items-center mb-6 text-gray-900 dark:text-white">
				<FooterLink
					target="_blank"
					aClass="hover:underline"
					href="mailto:contact@polyprompter.com">Feedback?</FooterLink
				>
				<FooterLink
					target="_blank"
					aClass="hover:underline"
					href="https://github.com/AlejandroAkbal/PolyPrompter">Source code</FooterLink
				>
				<FooterLink
					target="_blank"
					aClass="hover:underline"
					href="https://akbal.dev">Created by Alejandro Akbal</FooterLink
				>
			</FooterLinkGroup>
		</div>
	</Footer>
</Section>
