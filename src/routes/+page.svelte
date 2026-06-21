<script lang="ts">
	import Editor from '$lib/components/Editor.svelte';
	import Preview from '$lib/components/Preview.svelte';
	import { loadDocument, saveDocument } from '$lib/storage';
	import { SAMPLE } from '$lib/sample';

	let source = $state(SAMPLE);
	let hydrated = $state(false);

	$effect(() => {
		source = loadDocument(SAMPLE);
		hydrated = true;
	});

	let saveTimer: ReturnType<typeof setTimeout> | undefined;
	$effect(() => {
		if (!hydrated) return;
		const value = source;
		clearTimeout(saveTimer);
		saveTimer = setTimeout(() => saveDocument(value), 400);
	});

	function exportPdf() {
		window.print();
	}

	function reset() {
		if (!confirm('Discard current document and load the sample?')) return;
		source = SAMPLE;
	}
</script>

<svelte:head>
	<title>Vertere — Markdown to PDF</title>
	<meta name="description" content="Minimal, secure Markdown to PDF editor." />
</svelte:head>

<div class="app">
	<header class="topbar">
		<div class="brand">
			<svg class="logo" viewBox="0 0 32 32" width="26" height="26" aria-hidden="true">
				<defs>
					<linearGradient id="vertere-logo" x1="0" y1="0" x2="1" y2="1">
						<stop offset="0" stop-color="#34d399" />
						<stop offset="1" stop-color="#16a34a" />
					</linearGradient>
				</defs>
				<rect width="32" height="32" rx="7" fill="url(#vertere-logo)" />
				<path
					d="M8.5 10 L16 22.5 L23.5 10"
					stroke="#04130a"
					stroke-width="3.2"
					fill="none"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			<h1>Vertere</h1>
			<span class="tag">markdown → pdf</span>
		</div>
		<div class="actions">
			<button type="button" class="ghost" onclick={reset}>Reset</button>
			<button type="button" class="primary" onclick={exportPdf}>
				<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
					<path
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M12 4v12m0 0l-4-4m4 4l4-4M5 20h14"
					/>
				</svg>
				Export PDF
			</button>
		</div>
	</header>

	<main class="split">
		<section class="pane" aria-label="Editor">
			<Editor value={source} onChange={(next) => (source = next)} />
		</section>
		<section class="pane print-area" aria-label="Preview">
			<Preview {source} />
		</section>
	</main>
</div>

<style>
	.app {
		display: grid;
		grid-template-rows: auto 1fr;
		height: 100vh;
		min-height: 0;
		background: var(--bg);
		color: var(--text);
	}

	.topbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem 1.25rem;
		background: var(--surface);
		border-bottom: 1px solid var(--border);
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.brand h1 {
		margin: 0;
		font-size: 1rem;
		font-family: var(--font-mono);
		letter-spacing: 0.02em;
		font-weight: 700;
	}

	.tag {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		color: var(--text-muted);
		padding: 0.15rem 0.5rem;
		border: 1px solid var(--border);
		border-radius: 999px;
	}

	.logo {
		display: block;
		filter: drop-shadow(0 4px 12px color-mix(in srgb, var(--accent) 35%, transparent));
	}

	.actions {
		display: flex;
		gap: 0.5rem;
	}

	button {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-family: var(--font-mono);
		font-size: 0.8125rem;
		font-weight: 600;
		padding: 0.55rem 0.9rem;
		border-radius: 6px;
		border: 1px solid transparent;
		cursor: pointer;
		transition:
			background-color 200ms ease,
			border-color 200ms ease,
			color 200ms ease;
	}

	button:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.ghost {
		background: transparent;
		color: var(--text-muted);
		border-color: var(--border);
	}

	.ghost:hover {
		color: var(--text);
		border-color: var(--text-muted);
	}

	.primary {
		background: var(--accent);
		color: #04130a;
	}

	.primary:hover {
		background: color-mix(in srgb, var(--accent) 85%, white);
	}

	.split {
		display: grid;
		grid-template-columns: 1fr 1fr;
		min-height: 0;
		overflow: hidden;
	}

	.pane {
		min-height: 0;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	@media (max-width: 900px) {
		.split {
			grid-template-columns: 1fr;
			grid-template-rows: 1fr 1fr;
		}
	}

	@media print {
		.app {
			display: block;
			height: auto;
			background: #ffffff;
		}
		.topbar,
		.pane:not(.print-area) {
			display: none !important;
		}
		.split {
			display: block;
			overflow: visible;
		}
		.pane.print-area {
			display: block;
			overflow: visible;
			height: auto;
		}
	}
</style>
