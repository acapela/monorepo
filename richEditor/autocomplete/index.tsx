import { Editor, Node, mergeAttributes } from "@tiptap/core";
import {
  KeyboardShortcutCommand,
  NodeViewProps,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  ReactRenderer,
} from "@tiptap/react";
import Suggestion, { SuggestionOptions, SuggestionProps } from "@tiptap/suggestion";
import { PluginKey } from "prosemirror-state";
import React, { ComponentType, FunctionComponent } from "react";

import { AutocompletePickerPopoverBase } from "./AutocompletePickerPopover";
import { AutocompleteNodeProps, AutocompletePickerProps } from "./component";

interface AutocompletePluginOptions<D> {
  type: string;
  nodeComponent: ComponentType<AutocompleteNodeProps<D>>;
  pickerComponent: ComponentType<AutocompletePickerProps<D>>;
  triggerChar: string;
  allowSpaces?: boolean;
}

type ProsemirrorSuggestionOptions = Omit<SuggestionOptions, "editor">;

type KeyboardHandlersMap = {
  [key: string]: KeyboardShortcutCommand;
};

export function createAutocompletePlugin<D>(options: AutocompletePluginOptions<D>) {
  function PickerPopoverComponent(props: SuggestionProps) {
    return <AutocompletePickerPopoverBase baseProps={props} PickerComponent={options.pickerComponent} />;
  }

  function NodeComponent(props: NodeViewProps) {
    const data = props.node.attrs?.data as D;
    const { editor } = props;

    const NodeComponent = options.nodeComponent as ComponentType<AutocompleteNodeProps<D>>;

    return (
      <NodeViewWrapper className={`node-${options.type}`} as="span">
        <NodeComponent
          data={data}
          node={props.node}
          isEditable={editor.isEditable}
          editor={editor}
          update={(attributes) => {
            const previousAttributes = props.node.attrs.data;
            const mergedAttributes = { ...previousAttributes, ...attributes };
            props.updateAttributes({ data: mergedAttributes });
          }}
        />
      </NodeViewWrapper>
    );
  }

  const suggestionOptions: ProsemirrorSuggestionOptions = {
    allowSpaces: options.allowSpaces ?? false,
    char: options.triggerChar,
    command: ({ editor, range, props }) => {
      editor
        .chain()
        .focus()
        .insertContentAt(
          range,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          props.flatMap((data: any) => [
            { type: options.type, attrs: { data } },
            // When inserting suggestion, also add a space after it.
            { type: "text", text: " " },
          ])
        )
        .run();
    },
    allow: ({ editor, range }) => {
      return editor.can().insertContentAt(range, { type: options.type });
    },
    render() {
      let reactRenderer: ReactRenderer;

      return {
        onStart(props) {
          if (!props.editor.isEditable) return;
          // eslint-disable-next-line @typescript-eslint/ban-types
          reactRenderer = new ReactRenderer(PickerPopoverComponent as FunctionComponent<{}>, {
            props,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            editor: props.editor as any,
          });
        },
        onUpdate(props) {
          reactRenderer?.updateProps(props);
        },
        onExit() {
          reactRenderer?.destroy();
        },
      };
    },
  };

  function createKeyboardHandlers(editor: Editor): KeyboardHandlersMap {
    return {
      // When erasing existing autocomplete entry with backspace, replace it with trigger char
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

  const DATA_ATTRIBUTE_NAME = "data-info";

  const NodePlugin = Node.create({
    name: options.type,
    group: "inline",
    inline: true,
    selectable: false,
    atom: true,
    addNodeView() {
      return ReactNodeViewRenderer(NodeComponent);
    },
    addAttributes() {
      return {
        data: {
          default: {},
          parseHTML: (element) => {
            const rawDataJSON = element.getAttribute(DATA_ATTRIBUTE_NAME);

            const data = rawDataJSON ? JSON.parse(rawDataJSON) : {};
            return data;
          },

          renderHTML: (attributes) => {
            if (!attributes.data) {
              return {};
            }

            return {
              [DATA_ATTRIBUTE_NAME]: JSON.stringify(attributes.data),
            };
          },
        },
      };
    },
    parseHTML() {
      return [
        {
          tag: `span[data-autocomplete-type="${options.type}"]`,
        },
      ];
    },
    renderHTML({ HTMLAttributes }) {
      return ["span", mergeAttributes(HTMLAttributes, { "data-autocomplete-type": options.type })];
    },
    addKeyboardShortcuts() {
      return createKeyboardHandlers(this.editor);
    },

    addProseMirrorPlugins() {
      return [
        Suggestion({
          pluginKey: new PluginKey(`autocomplete-${options.type}`),
          editor: this.editor,
          ...suggestionOptions,
        }),
      ];
    },
  });

  return NodePlugin;
}
