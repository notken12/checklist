<script lang="ts">
	export let back = false;
</script>

<button class="material-symbols-outlined" on:click class:back>
	<slot />
</button>

<style>
	button {
		border: none;
		background: none;
		margin: 0;
		padding: 8px;
		cursor: pointer;
		border-radius: 100px;
		user-select: none;
	}

	button:hover {
		background: #ffffff22;
	}

	.back {
		margin-left: -8px;
	}
</style>
