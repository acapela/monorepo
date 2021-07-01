import { Node, mergeAttributes, Editor } from "@tiptap/core";
import { Node as ProseMirrorNode } from "prosemirror-model";
import Suggestion, { SuggestionOptions, SuggestionProps } from "@tiptap/suggestion";
import { KeyboardShortcutCommand, ReactNodeViewRenderer, ReactRenderer } from "@tiptap/react";
import { ComponentType, FunctionComponent } from "react";
import { AutocompleteNodeProps, AutocompletePickerProps } from "./component";
import { AutocompletePickerPopoverBase } from "./AutocompletePickerPopover";
import { AutocompleteNodeWrapper } from "./AutocompleteNodeWrapper";

export type MentionOptions = {
  HTMLAttributes: Record<string, any>;
  renderLabel: (props: { options: MentionOptions; node: ProseMirrorNode }) => string;
  suggestion: Omit<SuggestionOptions, "editor">;
};

interface AutocompletePluginOptions<D> {
  type: string;
  nodeComponent: ComponentType<AutocompleteNodeProps<D>>;
  pickerComponent: ComponentType<AutocompletePickerProps<D>>;
  triggerChar: string;
}

type ProsemirrorSuggestionOptions = Omit<SuggestionOptions, "editor">;

type KeyboardHandlersMap = {
  [key: string]: KeyboardShortcutCommand;
};

export function createAutocompletePlugin<D>(options: AutocompletePluginOptions<D>) {
  const tagName = `node-${options.type}`;

  function PickerPopoverComponent(props: SuggestionProps) {
    return <AutocompletePickerPopoverBase baseProps={props} PickerComponent={options.pickerComponent} />;
  }

  function NodeComponent(props: AutocompleteNodeProps<D>) {
    return <AutocompleteNodeWrapper type={options.type} data={props.data} NodeComponent={options.nodeComponent} />;
  }

  const suggestionOptions: ProsemirrorSuggestionOptions = {
    allowSpaces: true,
    char: options.triggerChar,
    command: ({ editor, range, props }) => {
      editor
        .chain()
        .focus()
        .insertContentAt(range, [
          {
            type: options.type,
            attrs: props,
          },
          // When inserting suggestion, also add a spacebar after it.
          {
            type: "text",
            text: " ",
          },
        ])
        .run();
    },
    allow: ({ editor, range }) => {
      return editor.can().insertContentAt(range, { type: options.type });
    },
    render() {
      let reactRenderer: ReactRenderer;

      return {
        onStart(props) {
          // eslint-disable-next-line @typescript-eslint/ban-types
          reactRenderer = new ReactRenderer(PickerPopoverComponent as FunctionComponent<{}>, {
            props,
            editor: props.editor,
          });
        },
        onUpdate(props) {
          reactRenderer.updateProps(props);
        },
        onExit() {
          // popup[0].destroy()
          reactRenderer.destroy();
        },
      };
    },
  };

  function createKeyboardHandlers(editor: Editor): KeyboardHandlersMap {
    return {
      Backspace: () => {
        return editor.commands.command(({ tr, state }) => {
          let isMention = false;
          const { selection } = state;
          const { empty, anchor } = selection;

          if (!empty) {
            return false;
          }

          state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
            if (node.type.name === options.type) {
              isMention = true;
              tr.insertText(options.triggerChar, pos, pos + node.nodeSize);

              return false;
            }
          });

          return isMention;
        });
      },
    };
  }

  // const backspaceKeyboardHandler: KeyboardShortcutCommand =

  const NodePlugin = Node.create({
    name: options.type,
    group: "inline",
    inline: true,
    selectable: false,
    atom: true,
    addNodeView() {
      return ReactNodeViewRenderer(NodeComponent);
    },
    parseHTML() {
      return [
        {
          tag: "react-component",
        },
      ];
    },
    renderHTML({ HTMLAttributes }) {
      return ["react-component", mergeAttributes(HTMLAttributes)];
    },
    addKeyboardShortcuts() {
      return createKeyboardHandlers(this.editor);
    },

    addProseMirrorPlugins() {
      return [
        Suggestion({
          editor: this.editor,
          ...suggestionOptions,
        }),
      ];
    },
  });

  return NodePlugin;
}

export const MentionTest = Node.create<MentionOptions>({
  name: "mention",

  defaultOptions: {
    HTMLAttributes: {},
    renderLabel({ options, node }) {
      return `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`;
    },
    suggestion: {
      char: "#",
      command: ({ editor, range, props }) => {
        editor
          .chain()
          .focus()
          .insertContentAt(range, [
            {
              type: "mention",
              attrs: props,
            },
            {
              type: "text",
              text: " ",
            },
          ])
          .run();
      },
      allow: ({ editor, range }) => {
        return editor.can().insertContentAt(range, { type: "mention" });
      },
    },
  },

  group: "inline",

  inline: true,

  selectable: false,

  atom: true,

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: (element) => {
          return {
            id: element.getAttribute("data-id"),
          };
        },
        renderHTML: (attributes) => {
          if (!attributes.id) {
            return {};
          }

          return {
            "data-id": attributes.id,
          };
        },
      },

      label: {
        default: null,
        parseHTML: (element) => {
          return {
            label: element.getAttribute("data-label"),
          };
        },
        renderHTML: (attributes) => {
          if (!attributes.label) {
            return {};
          }

          return {
            "data-label": attributes.label,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-mention]",
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "span",
      mergeAttributes({ "data-mention": "" }, this.options.HTMLAttributes, HTMLAttributes),
      this.options.renderLabel({
        options: this.options,
        node,
      }),
    ];
  },

  renderText({ node }) {
    return this.options.renderLabel({
      options: this.options,
      node,
    });
  },

  addKeyboardShortcuts() {
    return {
      Backspace: () =>
        this.editor.commands.command(({ tr, state }) => {
          let isMention = false;
          const { selection } = state;
          const { empty, anchor } = selection;

          if (!empty) {
            return false;
          }

          state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
            if (node.type.name === this.name) {
              isMention = true;
              tr.insertText(this.options.suggestion.char || "", pos, pos + node.nodeSize);

              return false;
            }
          });

          return isMention;
        }),
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});
