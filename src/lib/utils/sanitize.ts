const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "strong",
  "em",
  "b",
  "i",
  "u",
  "ul",
  "ol",
  "li",
  "a",
  "h2",
  "h3",
  "h4",
  "blockquote",
  "hr",
]);

const GLOBAL_STRIP_PATTERNS = [
  /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
  /<style[\s\S]*?>[\s\S]*?<\/style>/gi,
  /<!--[\s\S]*?-->/g,
  /<\/?(?:iframe|object|embed|form|input|button|textarea|select|svg|math)[^>]*>/gi,
];

const EVENT_HANDLER_ATTR = /\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;
const JAVASCRIPT_URL_ATTR = /\s+(?:href|src|xlink:href)\s*=\s*(?:"\s*javascript:[^"]*"|'\s*javascript:[^']*'|\s*javascript:[^\s>]+)/gi;

function stripDangerousFragments(html: string): string {
  let output = html;
  for (const pattern of GLOBAL_STRIP_PATTERNS) {
    output = output.replace(pattern, "");
  }
  output = output.replace(EVENT_HANDLER_ATTR, "");
  output = output.replace(JAVASCRIPT_URL_ATTR, "");
  return output;
}

function sanitizeTagAttributes(tagName: string, attrs: string): string {
  if (!attrs.trim()) {
    return "";
  }

  const allowed: string[] = [];

  if (tagName === "a") {
    const hrefMatch = attrs.match(/\bhref\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i);
    const href = hrefMatch?.[2] ?? hrefMatch?.[3] ?? hrefMatch?.[4] ?? "";
    if (href && !/^\s*javascript:/i.test(href)) {
      allowed.push(`href="${href.replace(/"/g, "&quot;")}"`);
    }
    const targetMatch = attrs.match(/\btarget\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i);
    const target = targetMatch?.[2] ?? targetMatch?.[3] ?? targetMatch?.[4];
    if (target === "_blank") {
      allowed.push('target="_blank"');
      allowed.push('rel="noopener noreferrer"');
    }
  }

  return allowed.length > 0 ? ` ${allowed.join(" ")}` : "";
}

export function sanitizeHtml(input: string): string {
  if (!input) {
    return "";
  }

  const cleaned = stripDangerousFragments(input);

  return cleaned.replace(/<\/?([a-z][a-z0-9]*)\b([^>]*)>/gi, (match, rawTag, rawAttrs) => {
    const tag = String(rawTag).toLowerCase();
    const isClosing = match.startsWith("</");

    if (!ALLOWED_TAGS.has(tag)) {
      return "";
    }

    if (isClosing) {
      return `</${tag}>`;
    }

    if (tag === "br" || tag === "hr") {
      return `<${tag}>`;
    }

    return `<${tag}${sanitizeTagAttributes(tag, String(rawAttrs))}>`;
  });
}

export function stripHtml(input: string): string {
  return sanitizeHtml(input).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
