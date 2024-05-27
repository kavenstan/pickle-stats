<script>
	import { createEventDispatcher } from 'svelte';
	export let selected = false;
	const dispatch = createEventDispatcher();
</script>

<div
	class={`pill ${selected ? 'bg-accent text-white' : 'bg-default'}`}
	on:click={() => dispatch('click')}
>
	<slot></slot>
</div>

<style>
	.pill {
		@apply inline-block py-2 px-4 rounded-full transition-colors duration-300 cursor-pointer border;
	}
</style>
