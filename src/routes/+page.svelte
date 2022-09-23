<script lang="ts">
	import { IDBDataSource } from '$lib/types';
	import type { UserData } from '$lib/types';
	import { onMount } from 'svelte';

	const dataSource = new IDBDataSource();
	let user: UserData;

	const initSource = async () => {
		const init = await dataSource.init();
		const readResult = await dataSource.read();
		if (readResult) user = readResult;
		else {
			const newUser: UserData = {
				id: 'local',
				name: 'ken',
				pfp: null,
				lists: []
			};
			await dataSource.write(newUser);
			console.log('wrote new default user');
			const readResult = await dataSource.read();
			if (readResult) user = readResult;
		}
		console.log(user);
	};

	onMount(() => initSource());
</script>

{#if user}
	<h1>
		hi {user?.name}
	</h1>
{:else}
	<!--TODO: add login form-->
{/if}
