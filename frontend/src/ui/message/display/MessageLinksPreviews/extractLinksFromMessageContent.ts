interface MessageContentPart {
  attributes?: {
    link?: string;
  };
}

// TO-DO: It will probably break if the link is in nested content, e.g. a part of the list.
// Review this part after moving away from Quill.
export const extractLinksFromMessageContent = (content: MessageContentPart[]) =>
  content.reduce((acc: string[], { attributes }) => {
    if (attributes?.link) {
      acc.push(attributes.link);
    }
    return acc;
  }, []);
