import { css } from "styled-components";
import { ACTIVE_COLOR } from "~ui/colors";

export const richEditorContentCss = css`
  .ProseMirror {
    outline: none;
  }

  font-size: 14px;

  line-height: 1.25;

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
    font-family: monospace;
  }

  a {
    text-decoration: underline;
    color: ${ACTIVE_COLOR};
  }

  blockquote {
    border-left: 2px solid #888;
    padding: 0.5rem 0 0.5rem 0.5rem;
  }

  strong {
    font-weight: bold;
  }
`;
