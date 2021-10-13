import { font } from "./utils/font";

const readable = font().inter.readingLineHeight;
const header = font().inter.headerLineHeight;

const subtitle = readable.size(11).secondary;
const content = readable.size(14);

const textTitle = content.bold;

export const typo = {
  content: readable.size(14),
  pageTitle: header.size(24).bold,
  textTitle,
  input: {
    placeholder: font().secondary,
  },
  action: {
    // Used for all sort of buttons
    regular: readable.bold.size(13),
  },
  item: {
    // Used for message title, topic list title, options section title etc
    title: textTitle,
    // Used for topic message snippet, options section item description, team member email etc.
    subtitle: subtitle,
    // Used eg. for attachment titles
    secondaryTitle: readable.size(11).bold.secondary,
  },
  section: {
    // Used for 'open', 'closed' topic groups titles,
    minorTitle: subtitle,
  },
  functional: {
    // eg "Hit ⌘ + Enter to create Topic"
    hint: subtitle,
    tooltip: subtitle.bold,
  },
};
