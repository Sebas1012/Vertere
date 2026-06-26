<script lang="ts">
	import { tick } from 'svelte';
	import { renderMarkdown } from '$lib/markdown';

	interface Props {
		source: string;
	}

	let { source }: Props = $props();
	let html = $derived(renderMarkdown(source));

	let measureEl: HTMLElement | undefined = $state();
	let pages = $state<string[]>(['']);

	// A4 = 210 × 297mm. Preview uses 18mm vertical padding → usable = 261mm.
	// Print shrinks padding to 16mm 10mm, which leaves more room, so measuring against the
	// preview geometry is conservative — printed pages may have a sliver of extra whitespace
	// at the bottom, never overflow.
	const MM_TO_PX = 96 / 25.4;
	const PAGE_PAD_Y_MM = 18;
	const USABLE_PAGE_HEIGHT_PX = (297 - PAGE_PAD_Y_MM * 2) * MM_TO_PX;

	$effect(() => {
		const rendered = html;
		let cancelled = false;

		const paginate = async () => {
			await document.fonts.ready;
			await tick();
			if (cancelled || !measureEl) return;

			const children = Array.from(measureEl.children) as HTMLElement[];
			if (children.length === 0) {
				pages = [''];
				return;
			}

			const baseTop = measureEl.getBoundingClientRect().top;
			const result: string[][] = [[]];
			let pageStart = 0;

			for (const el of children) {
				const rect = el.getBoundingClientRect();
				const top = rect.top - baseTop;
				const bottom = rect.bottom - baseTop;

				if (
					bottom - pageStart > USABLE_PAGE_HEIGHT_PX &&
					result[result.length - 1].length > 0
				) {
					pageStart = top;
					result.push([]);
				}
				result[result.length - 1].push(el.outerHTML);
			}

			pages = result.map((chunk) => chunk.join(''));
			void rendered;
		};

		paginate();
		return () => {
			cancelled = true;
		};
	});
</script>

<div class="preview" aria-label="PDF preview">
	{#each pages as pageHtml, i (i)}
		<article class="page" aria-label={`Page ${i + 1} of ${pages.length}`}>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			<div class="content">{@html pageHtml}</div>
			<span class="page-number" aria-hidden="true">{i + 1} / {pages.length}</span>
		</article>
	{/each}
</div>

<!-- Offscreen measure pass: matches the display page geometry so heights line up. -->
<div class="measure" aria-hidden="true">
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	<div class="content" bind:this={measureEl}>{@html html}</div>
</div>

<style>
	.preview {
		height: 100%;
		min-height: 0;
		overflow-y: auto;
		padding: 2rem 2rem 3rem;
		background: var(--bg);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.25rem;
	}

	.page,
	.measure .content {
		width: 210mm;
		max-width: 100%;
		background: #ffffff;
		color: #0f172a;
		font-family: var(--font-doc);
		font-size: 11pt;
		line-height: 1.65;
	}

	.page {
		position: relative;
		height: 297mm;
		border-radius: 4px;
		overflow: hidden;
		box-shadow:
			0 1px 2px rgba(2, 6, 23, 0.5),
			0 16px 40px -8px rgba(2, 6, 23, 0.65);
		flex-shrink: 0;
	}

	.page .content {
		height: 100%;
		padding: 18mm 16mm;
		overflow: hidden;
	}

	.page-number {
		position: absolute;
		bottom: 6mm;
		right: 8mm;
		font-family: var(--font-mono);
		font-size: 8pt;
		color: #94a3b8;
		letter-spacing: 0.05em;
	}

	.measure {
		position: absolute;
		left: -10000px;
		top: 0;
		visibility: hidden;
		pointer-events: none;
		width: 210mm;
	}

	.measure .content {
		padding: 0 16mm;
	}

	.content :global(h1),
	.content :global(h2),
	.content :global(h3),
	.content :global(h4) {
		font-family: var(--font-doc);
		color: #0f172a;
		margin: 1.4em 0 0.5em;
		line-height: 1.25;
		font-weight: 700;
	}

	.content :global(h1) { font-size: 1.9em; margin-top: 0; }
	.content :global(h2) { font-size: 1.5em; }
	.content :global(h3) { font-size: 1.2em; }
	.content :global(h4) { font-size: 1em; }

	.content :global(p) { margin: 0 0 1em; }

	.content :global(a) {
		color: #1d4ed8;
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.content :global(blockquote) {
		margin: 1em 0;
		padding: 0.25em 1em;
		border-left: 3px solid #cbd5e1;
		color: #475569;
	}

	.content :global(code) {
		font-family: var(--font-mono);
		font-size: 0.9em;
		background: #f1f5f9;
		padding: 0.15em 0.35em;
		border-radius: 3px;
	}

	.content :global(pre) {
		background: #f1f5f9;
		color: #0f172a;
		padding: 1em;
		border-radius: 6px;
		overflow-x: auto;
		font-size: 0.9em;
		line-height: 1.55;
	}

	.content :global(pre code) {
		background: transparent;
		padding: 0;
	}

	.content :global(table) {
		width: 100%;
		border-collapse: collapse;
		margin: 1em 0;
		font-size: 0.95em;
	}

	.content :global(th),
	.content :global(td) {
		padding: 0.55em 0.75em;
		border: 1px solid #e2e8f0;
		text-align: left;
	}

	.content :global(th) {
		background: #f8fafc;
		font-weight: 600;
	}

	.content :global(img) {
		max-width: 100%;
		height: auto;
		border-radius: 4px;
	}

	.content :global(hr) {
		border: 0;
		border-top: 1px solid #e2e8f0;
		margin: 2em 0;
	}

	.content :global(ul),
	.content :global(ol) {
		margin: 0 0 1em 1.25em;
		padding: 0;
	}

	.content :global(li) { margin: 0.25em 0; }

	@media print {
		.measure {
			display: none !important;
		}

		.preview {
			padding: 0;
			gap: 0;
			background: #ffffff;
			overflow: visible;
			height: auto;
			display: block;
		}

		.page {
			width: 210mm;
			height: 297mm;
			margin: 0;
			border-radius: 0;
			box-shadow: none;
			break-after: page;
			page-break-after: always;
		}

		.page .content {
			padding: 16mm 10mm;
		}

		.page:last-of-type {
			break-after: auto;
			page-break-after: auto;
		}

		.page-number {
			display: none;
		}
	}
</style>
