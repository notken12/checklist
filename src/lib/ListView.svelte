<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Checkbox from './Checkbox.svelte';
	import ListRow from './ListRow.svelte';
	import { dataSource } from './stores';

	import { addItemToList, type List, type UserData, type Day, type DayColumn } from './types';
	import IconButton from './ui/IconButton.svelte';

	export let list: List;
	export let user: UserData;
	let newItemTitle = '';

	const newItem = async () => {
		if (newItemTitle.length === 0) return;
		const updated = addItemToList(user, list.id, {
			id: list.items.length.toString(),
			name: newItemTitle
		});
		if (updated) list = updated;
		newItemTitle = '';
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
	}

	let newItemInput: HTMLInputElement;

	const dispatch = createEventDispatcher<{ back: void }>();
</script>

<section>
	<header>
		<IconButton on:click={() => dispatch('back')} back>arrow_back</IconButton>
		<h2>{list.name}</h2>
		<IconButton on:click={() => newItemInput.focus()}>format_list_bulleted_add</IconButton>
	</header>
	<section class="main">
		<table>
			<tbody>
				<tr>
					<th />
					{#each days as day}
						<th class="day"><span>{day.date.toLocaleString().split(',')[0]}</span></th>
					{/each}
				</tr>
				{#each list.items as item (item.id)}
					<ListRow {user} {list} {item} {days} />
				{/each}
				<tr>
					<th class="new-item">
						<form
							on:submit={(e) => {
								e.preventDefault();
								newItem();
							}}
						>
							<input
								type="text"
								placeholder="New item"
								bind:value={newItemTitle}
								bind:this={newItemInput}
							/>
						</form>
					</th>
					<td class="hint" colspan="100" />
				</tr>
			</tbody>
		</table>
		<div class="hint">
			{!newItemTitle ? '' : 'Hit <Enter> to create'}
		</div>
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
		width: 100%;
		max-width: 100%;
		overflow-y: auto;
		overflow-x: auto;
	}

	header {
		display: flex;
		gap: 8px;
		padding: 8px 8px;
		padding-left: 16px;
		height: 64px;
		width: 100%;
		border-bottom: var(--base03) solid 1px;
		align-items: center;
		background: var(--base00);
	}

	.main {
		padding: 16px;
		gap: 8px;
	}

	h2 {
		flex-grow: 1;
	}

	.new-item {
		padding: 0;
	}

	input {
		background: none;
		border: none;
		outline: none;
		margin: 0 !important;
		width: 176px;
	}

	.hint {
		opacity: 0.7;
		font-family: 'Space Mono', monospace;
		line-height: 17px;
		font-size: 14px;
		user-select: none;
	}

	.day span {
		writing-mode: vertical-rl;
		display: block;
		width: 17px;
	}

	@media only screen and (max-width: 600px) {
	}
</style>
