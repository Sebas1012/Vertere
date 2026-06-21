import type { Handle } from '@sveltejs/kit';
import { dev } from '$app/environment';

const CSP_DIRECTIVES: Record<string, string[]> = {
	'default-src': ["'self'"],
	'script-src': ["'self'"],
	'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
	'font-src': ["'self'", 'https://fonts.gstatic.com'],
	'img-src': ["'self'", 'data:', 'https:'],
	'connect-src': ["'self'"],
	'frame-ancestors': ["'none'"],
	'base-uri': ["'self'"],
	'form-action': ["'self'"],
	'object-src': ["'none'"]
};

const CSP = Object.entries(CSP_DIRECTIVES)
	.map(([key, values]) => `${key} ${values.join(' ')}`)
	.join('; ');

const STATIC_HEADERS: Record<string, string> = {
	'X-Content-Type-Options': 'nosniff',
	'X-Frame-Options': 'DENY',
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
};

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	for (const [name, value] of Object.entries(STATIC_HEADERS)) {
		response.headers.set(name, value);
	}
	// ponytail: dev injects inline scripts for HMR — CSP only in prod, tighten further if Vite is fronted by a CDN
	if (!dev) response.headers.set('Content-Security-Policy', CSP);
	return response;
};
