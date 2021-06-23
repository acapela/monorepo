interface MessageContentPart {
  attributes?: {
    link?: string;
  };
}

export const extractLinksFromMessageContent = (content: MessageContentPart[]) =>
  content.reduce((acc: string[], { attributes }) => {
    if (attributes?.link) {
      acc.push(attributes.link);
    }
    return acc;
  }, []);
