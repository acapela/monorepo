import { JSONContent } from "@tiptap/react";

interface ContentMark {
  type: string;
  attrs?: Record<string, unknown>;
}

function getLinkFromMark(mark: ContentMark) {
  if (mark.type !== "link") return null;

  return (mark.attrs?.href as string) ?? null;
}

/**
 * Will extract list of all links in a message content, including deeply nested nodes.
 */
export const extractLinksFromRichContent = (content: JSONContent): string[] => {
  const links: string[] = [];

  // All links will be marked with 'link' type mark.
  // Check if this node is marked as link
  if (content?.marks) {
    for (const mark of content.marks) {
      const markLink = getLinkFromMark(mark);

      if (markLink) {
        links.push(markLink);
      }
    }
  }

  // If node has children, find all links in them.
  const children = content?.content;

  if (!children) {
    return links;
  }

  for (const child of children) {
    const linksInChild = extractLinksFromRichContent(child);
    links.push(...linksInChild);
  }

  return links;
};
