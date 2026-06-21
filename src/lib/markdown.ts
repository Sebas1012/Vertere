import DOMPurify from 'dompurify';
import { marked } from 'marked';

marked.setOptions({
	gfm: true,
	breaks: false,
	async: false
});

const ALLOWED_TAGS = [
	'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
	'p', 'br', 'hr',
	'strong', 'em', 'del', 'ins', 'mark', 'sub', 'sup',
	'blockquote', 'pre', 'code',
	'ul', 'ol', 'li',
	'a',
	'img',
	'table', 'thead', 'tbody', 'tr', 'th', 'td',
	'span', 'div'
];

const ALLOWED_ATTR = ['href', 'src', 'alt', 'title', 'class', 'id', 'align', 'colspan', 'rowspan'];

DOMPurify.addHook('afterSanitizeAttributes', (node) => {
	if (node.tagName === 'A') {
		node.setAttribute('target', '_blank');
		node.setAttribute('rel', 'noopener noreferrer nofollow');
	}
	if (node.tagName === 'IMG') {
		node.setAttribute('loading', 'lazy');
		node.setAttribute('referrerpolicy', 'no-referrer');
	}
});

export function renderMarkdown(source: string): string {
	const rawHtml = marked.parse(source) as string;
	return DOMPurify.sanitize(rawHtml, {
		ALLOWED_TAGS,
		ALLOWED_ATTR,
		ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|data:image\/(?:png|jpe?g|gif|webp|svg\+xml);base64,)/i,
		FORBID_ATTR: ['style', 'onerror', 'onload', 'onclick'],
		USE_PROFILES: { html: true }
	});
}
