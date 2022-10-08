<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import ListView from './ListView.svelte';
	import type { UserData, List } from './types';

	export let user: UserData;
	export let list: List | null;

	const dispatch = createEventDispatcher<{ back: void }>();
</script>

<main>
	{#if list}
		<ListView {list} {user} on:back={() => dispatch('back')} />
	{/if}
</main>
