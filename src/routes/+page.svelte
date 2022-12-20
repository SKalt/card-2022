<script lang="ts">
	import { browser } from '$app/environment';
	import { render } from '../lib/main';
	if (browser) {
		render(window);
	}
</script>
