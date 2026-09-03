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
			}),
			// El bootstrap de SvelteKit es un <script> inline cuyo hash cambia en cada
			// build, asi que no se puede fijar en la cabecera de nginx. Kit emite un
			// <meta http-equiv="content-security-policy"> con el hash correcto; esa es
			// la politica estricta para scripts. frame-ancestors va solo en la cabecera
			// porque los <meta> lo ignoran.
			csp: {
				mode: 'hash',
				directives: {
					'default-src': ['self'],
					'script-src': ['self'],
					'style-src': ['self', 'unsafe-inline', 'https://fonts.googleapis.com'],
					'font-src': ['self', 'https://fonts.gstatic.com'],
					'img-src': ['self', 'data:', 'https:'],
					'connect-src': ['self'],
					'base-uri': ['self'],
					'form-action': ['self'],
					'object-src': ['none']
				}
			}
		})
	]
});
