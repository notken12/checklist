<script lang="ts">
	import { dataSource, user } from './stores';

	import type { List } from './types';

	export let list: List;
	let newItemTitle = '';

	const newItem = async () => {
		list.items.push({ id: list.items.length.toString(), name: newItemTitle });
		$dataSource.write($user);
	};
</script>

<h3>{list.name}</h3>
<table>
	<tbody>
		{#each list.items as item}
			<tr>
				<th>{item.name}</th>
			</tr>
		{/each}
	</tbody>
</table>
<button on:click={newItem}> New item </button>
<input type="text" placeholder="Item" bind:value={newItemTitle} />
