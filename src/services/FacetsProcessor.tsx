/**
 * Este processador vai ajustar a posição dos facets no texto a ser postado,
 * compensando os índices de inicio e fim após a limpeza dos caracteres de markdown.
 */

interface detectedFacets {
	links: linkFacet[],
	mentions: mentionFacet[]
}

interface linkFacet {
	linkText: string;
    linkUrl: string;
    start: number;
    end: number;
	isMarkdown: boolean;
}

interface mentionFacet {
	mention: string;
	start: number;
	end: number;
}

const findLinksAndMentions = (text: string): detectedFacets => {
	// Diferente do client oficial, aqui link será considerado pelo protocolo
	const rawUrlRegex = /https?:\/\/[^\s)]+/g; 
	const markdownLinkRegex = /\[([^\]]+)\]\(([^\s)]+:\/\/[^\s)]+)\)/g;
	const mentionRegex = /(^|\s)(@[^\s]+\.+[^\s]+)/g; // (@user.domain)

	const links = [];
	const mentions = [];
	const markdownLinkRanges = [];	
	let match;
  
	while ((match = markdownLinkRegex.exec(text)) !== null) {
		const [fullMatch, linkText, linkUrl] = match;
		const start = match.index;
		const end = start + linkText.length;
		const markdownEnd = start + fullMatch.length;
		markdownLinkRanges.push({ start, end: markdownEnd });
		links.push({ linkText, linkUrl, start, end, isMarkdown: true });
	}

	while ((match = rawUrlRegex.exec(text)) !== null) {
		const [linkUrl] = match;
		const start = match.index;
		const end = start + linkUrl.length;

		const isInsideMarkdownLink = markdownLinkRanges
		.some((range) => start >= range.start && end <= range.end);

		if (!isInsideMarkdownLink) {
			links.push({ linkText: linkUrl, linkUrl, start, end, isMarkdown: false });
		}
	}

	while ((match = mentionRegex.exec(text)) !== null) {
		const [fullMatch, prefix, mention] = match;
		const start = match.index + prefix.length;
		const end = start + mention.length;
		mentions.push({ mention: `@${mention.slice(1)}`, start, end });
	}

	links.sort((a, b) => a.start - b.start);
	mentions.sort((a, b) => a.start - b.start);
  
	return { links, mentions };
};

// Remove as notações de markdown, no momento apenas link
const clearText = (text: string) => text.replace(/\[([^\]]+)\]\(([^\s)]+:\/\/[^\s)]+)\)/g, '$1');

const adjustPositions = (text: string, links: linkFacet[], mentions: mentionFacet[]) => {
	const cleanText = clearText(text);
	
	const adjustPosition = (originalText: string, start: number, end: number) => {
		const prefix = originalText.slice(0, start);	// Captura o prefixo do facet
		const cleanPrefix = clearText(prefix);			// Limpa o prefixo
		const cleanStart = cleanPrefix.length;			// Agora o início é o mesmo do prefixo limpo
		const cleanEnd = cleanStart + (end - start);	// O fim é o início + o tamanho do feature do facet (link, mention, etc)

		return { cleanStart, cleanEnd };
	};

	const adjustedLinks = links.map((link) => {
		const linkText = link.isMarkdown ? link.linkText : link.linkUrl;
		const { cleanStart, cleanEnd } = adjustPosition(text, link.start, link.end);
		return {
			...link,
			linkText,
			start: cleanStart,
			end: cleanEnd,
		};
	});
  
	const adjustedMentions = mentions.map((mention) => {
		const { cleanStart, cleanEnd } = adjustPosition(text, mention.start, mention.end);
		return {
			...mention,
			start: cleanStart,
			end: cleanEnd,
		};
	});
  
	return { cleanText, adjustedLinks, adjustedMentions };
  };

const processFacetsFromMarkdown = (text: string) => {
	const { links, mentions } = findLinksAndMentions(text);
	const { cleanText, adjustedLinks, adjustedMentions } = adjustPositions(text, links, mentions);
  
	return { cleanText, adjustedLinks, adjustedMentions };
};

export default processFacetsFromMarkdown;