<script lang="ts">
</script>

<li on:click>
	<slot />
</li>

<style>
	li {
		list-style: none;
		background: var(--base01);
		padding: 6px 10px;
		border-radius: 6px;
		width: 100%;
		cursor: pointer;
	}
</style>
