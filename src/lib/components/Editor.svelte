<script lang="ts">
	interface Props {
		value: string;
		onChange: (next: string) => void;
	}

	let { value, onChange }: Props = $props();
	let textarea: HTMLTextAreaElement | undefined = $state();
	let gutter: HTMLDivElement | undefined = $state();

	let lineCount = $derived(value.split('\n').length);

	function handleInput(event: Event) {
		onChange((event.currentTarget as HTMLTextAreaElement).value);
	}

	function handleScroll(event: Event) {
		if (!gutter) return;
		gutter.scrollTop = (event.currentTarget as HTMLTextAreaElement).scrollTop;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key !== 'Tab' || event.shiftKey || event.ctrlKey || event.metaKey) return;
		event.preventDefault();
		const el = event.currentTarget as HTMLTextAreaElement;
		const { selectionStart: start, selectionEnd: end, value: text } = el;
		const next = text.slice(0, start) + '\t' + text.slice(end);
		onChange(next);
		queueMicrotask(() => el.setSelectionRange(start + 1, start + 1));
	}
</script>

<div class="editor">
	<label class="visually-hidden" for="markdown-input">Markdown source</label>
	<div class="gutter" bind:this={gutter} aria-hidden="true">
		{#each { length: lineCount }, i}
			<span>{i + 1}</span>
		{/each}
	</div>
	<textarea
		id="markdown-input"
		bind:this={textarea}
		{value}
		oninput={handleInput}
		onscroll={handleScroll}
		onkeydown={handleKeydown}
		spellcheck="false"
		autocomplete="off"
		autocapitalize="off"
		aria-label="Markdown source editor"
		placeholder="# Start writing markdown..."
	></textarea>
</div>

<style>
	.editor {
		display: grid;
		grid-template-columns: auto 1fr;
		height: 100%;
		min-height: 0;
		background: var(--surface);
		border-right: 1px solid var(--border);
		font-family: var(--font-mono);
		font-size: 0.9375rem;
		line-height: 1.7;
	}

	.gutter {
		padding: 1.5rem 0.75rem 1.5rem 1rem;
		color: var(--text-muted);
		text-align: right;
		user-select: none;
		overflow: hidden;
		border-right: 1px solid var(--border);
		background: color-mix(in srgb, var(--surface) 80%, black);
		min-width: 3ch;
		display: flex;
		flex-direction: column;
	}

	.gutter span {
		display: block;
		opacity: 0.55;
		font-variant-numeric: tabular-nums;
	}

	textarea {
		min-height: 0;
		padding: 1.5rem 1.75rem;
		background: transparent;
		color: var(--text);
		font: inherit;
		line-height: inherit;
		border: 0;
		outline: none;
		resize: none;
		tab-size: 2;
		caret-color: var(--accent);
		white-space: pre;
		overflow: auto;
	}

	textarea::placeholder {
		color: var(--text-muted);
	}

	textarea::selection {
		background: color-mix(in srgb, var(--accent) 35%, transparent);
	}

	textarea:focus-visible {
		box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--accent) 40%, transparent);
	}

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
</style>
