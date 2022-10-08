<script lang="ts">
	import { dataSource } from './stores';

	import { setDayState, type Day, type Item, type List, type UserData } from './types';

	export let user: UserData;
	export let list: List;
	export let item: Item;
	export let day: Day;

	$: completed = day.completed[item.id] || false;

	const setState = async (state: boolean) => {
		day.completed[item.id] = state;
		const { newDay, newUser } = setDayState(user, list.id, day);
		day = newDay;
		user = newUser;
		await $dataSource.write(user);
	};
</script>

<td on:click={() => setState(!completed)}>{completed}</td>
