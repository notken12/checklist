<script lang="ts">
	export let selected = false;
</script>

<li on:click class:selected>
	<slot />
</li>

<style>
	li {
		list-style: none;
		background: var(--base01);
		padding: 8px 10px;
		border-radius: 6px;
		width: 100%;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	li:hover {
		background: var(--base02);
	}

	.selected {
		background: var(--base0D);
		color: var(--base00);
	}

	.selected:hover {
		background: var(--base0D);
	}
</style>
