<script lang="ts">
	import Checkbox from './Checkbox.svelte';
	import { dataSource } from './stores';

	import { addItemToList, type List, type UserData, type Day } from './types';
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

	let firstDay = list.days[0]?.date || new Date();
	firstDay.setHours(0, 0, 0, 0);

	const getTotalDays = () => {
		let date = new Date();
		date.setHours(0, 0, 0, 0);
		return Math.floor((date.getTime() - firstDay.getTime()) / (1000 * 3600 * 24)) + 1;
	};

	let totalDays = getTotalDays();

	type DayColumn = {
		index: number | null;
		date: Date;
	};
	const getDays = (): DayColumn[] => {
		const days: DayColumn[] = [];
		let i = 0;
		for (let j = 0; j < getTotalDays(); j++) {
			let date = firstDay.getTime() + j * 1000 * 3600 * 24;
			if (list.days[i]?.date.getTime() === date) {
				days.push({ index: i, date: new Date(date) });
				i++;
			} else {
				days.push({ index: null, date: new Date(date) });
			}
		}
		return days;
	};

	let days: DayColumn[];
	$: {
		days = getDays();
		firstDay;
		list.days;
		console.log(days);
	}

	const getDay = (day: DayColumn): Day => {
		if (day.index != null) return list.days[day.index];
		return { date: day.date, completed: {} };
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
				<tr>
					<th />
					{#each days as day}
						<th>{day.date.toLocaleString().split(',')[0]}</th>
					{/each}
				</tr>
				{#each list.items as item (item.id)}
					<tr>
						<th>{item.name}</th>
						{#each days as day}
							<Checkbox {user} {list} {item} day={getDay(day)} />
						{/each}
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
		flex-grow: 1;
		height: 100%;
		max-height: 100%;
		overflow-y: auto;
		max-width: 100%;
		overflow-x: auto;
	}

	header {
		display: flex;
		gap: 8px;
		padding: 8px 16px;
		height: 64px;
		width: 100%;
		border-bottom: var(--base03) solid 1px;
		align-items: center;
		background: var(--base00);
	}

	.main {
		padding: 16px;
	}

	h2 {
		flex-grow: 1;
	}
</style>
