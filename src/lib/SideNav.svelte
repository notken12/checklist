<script lang="ts">
	import type { Id, List, UserData } from './types';
	import { dataSource } from '$lib/stores';

	import ListItem from '$lib/ui/ListItem.svelte';
	import { createEventDispatcher } from 'svelte';

	export let user: UserData;

	const deleteUser = async () => {
		await $dataSource.delete();
	};

	const dispatch = createEventDispatcher<{ selectlist: List }>();

	export let selected: Id | null = null;
</script>

<nav class="side-nav">
	{#each user.lists as list (list.id)}
		<h1>
			Hi {user.name}
		</h1>

		<ListItem on:click={() => dispatch('selectlist', list)} selected={list.id === selected}
			>{list.name}</ListItem
		>
	{/each}
	<button on:click={deleteUser}>Delete {user.name}</button>
</nav>

<style>
	nav {
		background: var(--base01);
		background: var(--darker-black);
		padding: 32px 16px;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 16px;
		min-width: 256px;
		border-right: var(--base03) solid 1px;
	}
</style>
