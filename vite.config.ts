import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			// Static SPA: editor runs entirely client-side, so we ship a fallback index.html
			// and let the browser do all routing. No Node runtime in the final container.
			adapter: adapter({
				fallback: 'index.html',
				strict: false
			})
		})
	]
});
