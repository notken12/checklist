<script lang="ts">
	import type { UserData } from './types';

	import List from '$lib/List.svelte';
	import ListItem from '$lib/ui/ListItem.svelte';

	export let user: UserData;
</script>

<nav>
	{#each user.lists as list}
		<h1>
			hi {user.name}
		</h1>

		<ListItem on:click={console.log}>{list.name}</ListItem>
		<List {list} {user} />
	{/each}
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
	}
</style>
