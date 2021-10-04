import { observer } from "mobx-react";
import styled from "styled-components";

import { useDb } from "~frontend/clientdb";
import { AppLayout } from "~frontend/layouts/AppLayout";
import { assignPageLayout } from "~frontend/utils/pageLayout";

function createMessageContent(text: string) {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ text, type: "text" }],
      },
    ],
  };
}

const ClientDbPlayground = observer(function ClientDbPlayground(): JSX.Element {
  const db = useDb();
  return (
    <UIHolder>
      <div>
        Topics
        <ul>
          {db.topic.all.map((topic) => {
            return (
              <li key={topic.id}>
                <span
                  onClick={() => {
                    const newName = prompt("name") ?? topic.name;

                    topic.update({ name: newName });
                  }}
                >
                  <strong>
                    {topic.name} ({topic.owner?.name})
                  </strong>
                </span>
                <button
                  onClick={() => {
                    topic.remove();
                  }}
                >
                  Remove topic
                </button>

                <div>
                  Topic messages
                  <ul>
                    {topic.messages.all.map((message) => {
                      return (
                        <li key={message.id}>
                          <div
                            onClick={() => {
                              const content = prompt("name") ?? "new message";

                              message.update({ content: createMessageContent(content) });
                            }}
                          >
                            ({message.user?.name}) {JSON.stringify(message.content)}
                          </div>
                          <button
                            onClick={() => {
                              message.remove();
                            }}
                          >
                            Remove message
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  <button
                    onClick={() => {
                      const content = prompt("name") ?? "new message";

                      db.message.create({ topic_id: topic.id, type: "TEXT", content: createMessageContent(content) });
                    }}
                  >
                    Create message
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <button
        onClick={() => {
          const newName = prompt("name") ?? "new topic";

          db.topic.create({ name: newName, slug: newName });
        }}
      >
        Add new topic
      </button>
    </UIHolder>
  );
});

export default ClientDbPlayground;

assignPageLayout(ClientDbPlayground, AppLayout);

const UIHolder = styled.div`
  ul {
    all: revert;
    list-style: circle;
  }

  button {
    all: revert;
  }

  strong {
    font-weight: 700;
  }
`;
