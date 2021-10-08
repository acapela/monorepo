import { css } from "styled-components";

import { theme } from "~ui/theme";

export const richEditorContentCss = css`
  .ProseMirror {
    outline: none;
  }

  ${theme.font.body14.withExceptionalLineHeight("1.25", "This line-height is different from the standard").build}

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
    ${theme.font.speziaMono.build}
  }

  a {
    text-decoration: underline;
    color: ${theme.colors.layout.link()};
  }

  blockquote {
    border-left: 2px solid ${theme.colors.layout.strongLine()};
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

    ${theme.font.body14.semibold.build()}
  }
`;
