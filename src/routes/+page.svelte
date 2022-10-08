<script lang="ts">
	import type { List } from '$lib/types';
	import type { UserData } from '$lib/types';
	import { onMount } from 'svelte';
	import { dataSource, user } from '$lib/stores';
	import SideNav from '$lib/SideNav.svelte';
	import Main from '$lib/Main.svelte';

	let newUsername = '';

	const initSource = async () => {
		await $dataSource.init();
		$dataSource.initialized = $dataSource.initialized;
		$dataSource.subscribe((data) => {
			$user = data;
			console.log(data);
		});
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
					name: 'My list',
					items: [],
					days: [{ date: new Date(2022, 9, 3), completed: {} }]
				}
			]
		};
		await $dataSource.write(newUser);
		console.log('wrote new user');
		const readResult = await $dataSource.read();
		if (readResult) $user = readResult;
	};

	let currentList: List | null;

	const selectList = (list: CustomEvent<List>) => {
		currentList = list.detail;
	};
</script>

{#if !$dataSource.initialized}
	<p>Loading...</p>
{:else if $user}
	<div class="view" class:viewing-list={currentList != null}>
		<SideNav user={$user} on:selectlist={selectList} selected={currentList?.id} />

		<Main user={$user} list={currentList} on:back={() => (currentList = null)} />
	</div>
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

<style>
	.view {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 100%;
	}
</style>
