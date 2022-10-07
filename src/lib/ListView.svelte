<script lang="ts">
	import { dataSource } from './stores';

	import { addItemToList, type List, type UserData } from './types';
	import IconButton from './ui/IconButton.svelte';

	export let list: List;
	export let user: UserData;
	let newItemTitle = '';

	const newItem = async () => {
		const updated = addItemToList(user, list.id, {
			id: list.items.length.toString(),
			name: newItemTitle
		});
		if (updated) list = updated;
		$dataSource.write(user);
	};
</script>

<section>
	<header>
		<h2>{list.name}</h2>
		<IconButton>add</IconButton>
	</header>
	<section class="main">
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
	</section>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding: 0;
	}

	header {
		display: flex;
		gap: 8px;
		padding: 8px 16px;
		height: 64px;
		width: 100%;
		border-bottom: var(--base03) solid 1px;
		align-items: center;
	}

	.main {
		padding: 16px;
	}

	table,
	th,
	td {
		border: var(--base03) solid 1px;
		gap: 0;
		padding: 0;
		margin: 0;
	}

	tbody,
	tr {
		padding: 0;
		margin: 0;
		gap: 0;
		border: none;
	}

	th,
	td {
		padding: 8px;
		font-size: 17px;
		font-weight: normal;
	}

	table {
		border-collapse: collapse;
	}

	h2 {
		flex-grow: 1;
	}
</style>
