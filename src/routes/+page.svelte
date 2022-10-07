<script lang="ts">
	import { type Id } from '$lib/types';
	import type { UserData } from '$lib/types';
	import { onMount } from 'svelte';
	import { dataSource, user } from '$lib/stores';
	import SideNav from '$lib/SideNav.svelte';

	let newUsername = '';

	const initSource = async () => {
		await $dataSource.init();
		$dataSource.initialized = $dataSource.initialized;
		$dataSource.subscribe((data) => {
			$user = data;
		});

		console.log($user);
	};

	onMount(async () => {
		await initSource();
	});

	const createNewUser = async () => {
		const newUser: UserData = {
			id: 'local',
			name: newUsername,
			pfp: null,
			lists: [
				{
					id: '123',
					name: 'a list',
					items: [],
					days: []
				}
			]
		};
		await $dataSource.write(newUser);
		console.log('wrote new user');
		const readResult = await $dataSource.read();
		if (readResult) $user = readResult;
	};

	const deleteUser = async () => {
		await $dataSource.delete();
		$user = null;
	};
</script>

{#if !$dataSource.initialized}
	<p>Loading...</p>
{:else if $user}
	<SideNav user={$user} />

	<main>
		<button on:click={deleteUser}>Delete {$user.name}</button>
	</main>
{:else}
	<!-- TODO: add login form -->
	<form
		on:submit={(e) => {
			e.preventDefault();
			createNewUser();
		}}
	>
		<h2>Hi whats your name?</h2>
		<input type="text" bind:value={newUsername} />
		<button type="submit">Submit</button>
	</form>
{/if}
