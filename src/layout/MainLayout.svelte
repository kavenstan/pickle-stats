<script>
	import { Cog } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Settings, NavItem, Toggle, Menu, MenuItem, Button } from 'svelte-ux';
	import { location } from 'svelte-spa-router';

	export let title = 'Title';
</script>

<div class="w-full bg-gray-800 text-white">
	<div class="container flex justify-between items-center py-4">
		<div class="flex items-center space-x-4">
			<!-- <img src="/images/logo.png" alt="Logo" class="h-8" /> -->
			<span class="text-lg font-bold">{title}</span>
		</div>
		<nav class="flex space-x-4">
			<NavItem text="Home" currentUrl={{ pathname: `#/${location}` }} path="#/" />
			<NavItem text="Matchmaking" currentUrl={{ pathname: `#/${location}` }} path="#/matchmaking" />
			<!-- 
			<Settings
				components={{
					Button: { classes: 'border-2 font-bold' },
					Menu: { classes: 'shadow-xl border-gray-500' },
					MenuItem: { classes: 'font-bold' }
				}}
			>
				<Toggle let:on={open} let:toggle>
					<Button on:click={toggle} variant="outline" color="primary">
						<Icon src={Cog} size="24px" theme="solid" class="h-6 w-6" />
						<Menu {open} on:close={toggle}>
							<MenuItem>Refresh</MenuItem>
							<MenuItem>Settings</MenuItem>
							<MenuItem>Help</MenuItem>
							<MenuItem>Sign In</MenuItem>
							<MenuItem disabled>Disabled</MenuItem>
						</Menu>
					</Button>
				</Toggle>
			</Settings> -->
		</nav>
	</div>
</div>

<slot></slot>

<style>
	.container {
		max-width: 1400px;
		margin: 0 auto;
		padding: 0 1rem;
	}
</style>
