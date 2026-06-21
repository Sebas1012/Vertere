const STORAGE_KEY = 'vertere:document';

export function loadDocument(fallback: string): string {
	if (typeof window === 'undefined') return fallback;
	try {
		return window.localStorage.getItem(STORAGE_KEY) ?? fallback;
	} catch {
		return fallback;
	}
}

export function saveDocument(value: string): void {
	if (typeof window === 'undefined') return;
	try {
		window.localStorage.setItem(STORAGE_KEY, value);
	} catch {
		// ponytail: ignore quota/access errors — autosave is best-effort
	}
}
