/**
 * Extract FAQ question-answer pairs from markdown content.
 *
 * Supports two patterns commonly used in ratgeber articles:
 *
 * Pattern 1 — H3 questions:
 *   ## Häufig gestellte Fragen
 *   ### Question text?
 *   Answer paragraph(s).
 *
 * Pattern 2 — Bold questions:
 *   ## FAQ
 *   **Question text?**
 *   Answer paragraph(s).
 */

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Parse FAQ items from the raw markdown body of a content entry.
 * Returns an empty array when no FAQ section is found.
 */
export function extractFaqFromMarkdown(markdown: string): FaqItem[] {
  // Find the FAQ section: starts with a level-2 heading containing "FAQ"
  // or "Häufig gestellte Fragen". Ends at the next level-2 heading or EOF.
  const lines = markdown.split('\n');

  let faqStart = -1;
  let faqEnd = lines.length;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (faqStart === -1) {
      // Look for the opening ## heading
      if (/^## /.test(line) && (/FAQ/i.test(line) || /Häufig gestellte Fragen/i.test(line))) {
        faqStart = i + 1; // content starts after heading
      }
    } else {
      // After we found the FAQ heading, look for the next ## to end the section
      if (/^## /.test(line)) {
        faqEnd = i;
        break;
      }
    }
  }

  if (faqStart === -1) {
    return [];
  }

  const faqLines = lines.slice(faqStart, faqEnd);
  const faqBlock = faqLines.join('\n');

  // Try bold pattern first: **Question?**\nAnswer lines...
  // (checked before H3 because the H3 splitter can produce false positives
  // when bold-pattern content has no ### headings)
  const boldItems = parseBoldPattern(faqBlock);
  if (boldItems.length > 0) return boldItems;

  // Try H3 pattern: ### Question?\n\nAnswer lines...
  const h3Items = parseH3Pattern(faqBlock);
  if (h3Items.length > 0) return h3Items;

  return [];
}

function parseH3Pattern(block: string): FaqItem[] {
  const items: FaqItem[] = [];
  // Split on ### headings
  const parts = block.split(/^### /m);

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    const newlineIdx = trimmed.indexOf('\n');
    if (newlineIdx === -1) continue;

    const question = trimmed.slice(0, newlineIdx).trim();
    const answer = cleanAnswer(trimmed.slice(newlineIdx + 1).trim());

    if (question && answer) {
      items.push({ question, answer });
    }
  }

  return items;
}

function parseBoldPattern(block: string): FaqItem[] {
  const items: FaqItem[] = [];
  const lines = block.split('\n');

  let currentQuestion = '';
  let answerLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Detect a bold-only line: **Question text?**
    const boldMatch = trimmed.match(/^\*\*(.+?)\*\*$/);
    if (boldMatch) {
      // Save previous Q&A pair if any
      if (currentQuestion && answerLines.length > 0) {
        items.push({
          question: currentQuestion,
          answer: cleanAnswer(answerLines.join('\n').trim()),
        });
      }
      currentQuestion = boldMatch[1].trim();
      answerLines = [];
    } else if (currentQuestion) {
      answerLines.push(trimmed);
    }
  }

  // Don't forget the last Q&A pair
  if (currentQuestion && answerLines.length > 0) {
    items.push({
      question: currentQuestion,
      answer: cleanAnswer(answerLines.join('\n').trim()),
    });
  }

  return items;
}

/**
 * Strip markdown formatting from an answer to produce clean plain text
 * suitable for JSON-LD. Removes bold, links, inline code, etc.
 */
function cleanAnswer(md: string): string {
  return md
    // Remove markdown links: [text](url) → text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove bold/italic markers
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Collapse multiple newlines into a single space
    .replace(/\n+/g, ' ')
    // Collapse multiple spaces
    .replace(/ {2,}/g, ' ')
    .trim();
}

/**
 * Build a FAQPage JSON-LD object from an array of FAQ items.
 * Returns null if the array is empty.
 */
export function buildFaqSchema(items: FaqItem[]): object | null {
  if (items.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
