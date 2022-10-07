<script lang="ts">
	import ListView from './ListView.svelte';
	import type { UserData, List } from './types';

	export let user: UserData;
	export let list: List | null;
</script>

<main>
	{#if list}
		<ListView {list} {user} />
	{/if}
</main>
