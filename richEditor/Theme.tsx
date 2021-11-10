import { css } from "styled-components";

import { phone } from "~ui/responsive";
import { theme } from "~ui/theme";

export const richEditorContentCss = css`
  .ProseMirror {
    outline: none;
    /* 
      ProseMirror core styles (tiptap/packages/core/src/style.ts) will get injected async as a script
      as the Editor loads. This creates a race condition between our global styles and
      the Prosemirror core styles. 
      
      Having this race condition means that the global styles will load first. The content
      will look a certain way, then the core Prosemirror core styles will be loaded (500ms later),
      and the content will have a slight movement, e.g. white spaces will appear or disappear and 
      @ symbols would move up and down.
      
      The properties below are directly copied over from tiptap/packages/core/src/style.ts. Having
      these here prevents this movement to occur.
     */
    word-wrap: break-word;
    white-space: pre-wrap;
    white-space: break-spaces;
    -webkit-font-variant-ligatures: none;
    font-variant-ligatures: none;
    font-feature-settings: "liga" 0;
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
    word-break: break-all;
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

    ${theme.typo.content.medium};

    ${phone(css`
      white-space: nowrap;
    `)}
  }
`;
