import { css } from "styled-components";

import { theme } from "~ui/theme";

export const richEditorContentCss = css`
  .ProseMirror {
    outline: none;
  }

  ${theme.font.readingLineHeight};

  ol {
    list-style-type: decimal;
  }

  ul {
    list-style-type: disc;
  }

  ul,
  ol {
    padding-left: 24px;
  }

  li {
    ::marker {
      margin-right: 0.25rem;
    }
    ul,
    ol {
      padding-left: 1rem;
    }
  }

  em {
    font-style: italic;
  }

  code,
  pre {
    ${theme.font.speziaMono.medium};
    ${theme.colors.layout.backgroundAccent.withBorder.asBg}
    ${theme.radius.badge};
    padding: 0 0.3em;
  }

  a {
    text-decoration: underline;
    color: ${theme.colors.action.link};
  }

  blockquote {
    border-left: 2px solid ${theme.colors.layout.background.border};
    padding: 0.5rem 0 0.5rem 0.5rem;
  }

  strong {
    font-weight: bold;
  }

  .ProseMirror p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: rgba(0, 0, 0, 0.2);
    pointer-events: none;
    height: 0;

    ${theme.typo.content.semibold}
  }
`;
