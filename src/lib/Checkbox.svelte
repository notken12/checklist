<script lang="ts">
	import { dataSource } from './stores';

	import type { Day, Item, List, UserData } from './types';

	export let user: UserData;
	export let list: List;
	export let item: Item;
	export let day: Day;

	$: completed = day.completed[item.id] || false;

	// Function to find insert position of K
	function find_index<T>(arr: T[], K: T) {
		// Traverse the array
		for (let i = 0; i < arr.length; i++)
			// If K is found
			if (arr[i] == K) return { index: i, match: true };
			// If current array element
			// exceeds K
			else if (arr[i] > K) return { index: i, match: false };

		// If all elements are smaller
		// than K
		return { index: arr.length, match: false };
	}

	const setState = async (state: boolean) => {
		day.completed[item.id] = state;
		const { index, match } = find_index(list.days, day);
		if (match) list.days[index] = day;
		else list.days.splice(index, 0, day);
		await $dataSource.write(user);
	};
</script>

<td on:click={() => setState(!completed)}>{completed}</td>
