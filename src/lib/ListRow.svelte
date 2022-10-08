<script lang="ts">
	import Checkbox from './Checkbox.svelte';
	import { dataSource } from './stores';

	import {
		updateItem,
		type Day,
		type DayColumn,
		type Item,
		type List,
		type UserData
	} from './types';

	export let user: UserData;
	export let list: List;
	export let item: Item;
	export let days: DayColumn[];

	const getDay = (day: DayColumn): Day => {
		if (day.index != null) return list.days[day.index];
		return { date: day.date, completed: {} };
	};

	const updateName = async () => {
		updateItem(user, list.id, item.id, item);
		await $dataSource.write(user);
	};
</script>

<tr>
	<th contenteditable bind:textContent={item.name} on:input={updateName} />
	{#each days as day}
		<Checkbox {user} {list} {item} day={getDay(day)} />
	{/each}
</tr>
