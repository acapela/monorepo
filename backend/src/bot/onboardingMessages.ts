import { JSONContent } from "@tiptap/core";

// Edit here - http://localhost:3000/dev/content?content=eyJ0eXBlIjoiZG9jIiwiY29udGVudCI6W3sidHlwZSI6InBhcmFncmFwaCIsImNvbnRlbnQiOlt7InR5cGUiOiJ0ZXh0IiwidGV4dCI6IldoYXQgYmV0dGVyIHdheSB0byBvbmJvYXJkIHlvdSAifSx7InR5cGUiOiJtZW50aW9uIiwiYXR0cnMiOnsiZGF0YSI6eyJ1c2VySWQiOiIyMDJmMjIzMy04ZTBmLTQ4N2MtODI1OS1hNzI5ZTA1MWZjZTIiLCJ0eXBlIjoicmVxdWVzdC1yZWFkIn19fSx7InR5cGUiOiJ0ZXh0IiwidGV4dCI6IiAgdGhhbiBzZW5kaW5nIHlvdXIgZmlyc3QgcmVxdWVzdD8ifV19LHsidHlwZSI6InBhcmFncmFwaCJ9LHsidHlwZSI6ImJ1bGxldExpc3QiLCJjb250ZW50IjpbeyJ0eXBlIjoibGlzdEl0ZW0iLCJjb250ZW50IjpbeyJ0eXBlIjoicGFyYWdyYXBoIiwiY29udGVudCI6W3sidHlwZSI6InRleHQiLCJtYXJrcyI6W3sidHlwZSI6ImJvbGQifV0sInRleHQiOiJNYXJrIHRoaXMgUmVxdWVzdCBhcyBkb25lIn0seyJ0eXBlIjoidGV4dCIsInRleHQiOiIgdG8gc2VlIGl0IHJlc29sdmVkLiJ9XX1dfSx7InR5cGUiOiJsaXN0SXRlbSIsImNvbnRlbnQiOlt7InR5cGUiOiJwYXJhZ3JhcGgiLCJjb250ZW50IjpbeyJ0eXBlIjoidGV4dCIsIm1hcmtzIjpbeyJ0eXBlIjoiYm9sZCJ9XSwidGV4dCI6IkNsb3NlIn0seyJ0eXBlIjoidGV4dCIsInRleHQiOiIgaXQgdG8gZnJlZSB1cCB5b3VyIFJlY2VpdmVkIHNlY3Rpb24gYW5kIHdhdGNoIGl0IGRpc2FwcGVhciBhZnRlciAyNCBob3Vycy4ifV19XX0seyJ0eXBlIjoibGlzdEl0ZW0iLCJjb250ZW50IjpbeyJ0eXBlIjoicGFyYWdyYXBoIiwiY29udGVudCI6W3sidHlwZSI6InRleHQiLCJ0ZXh0IjoiWW91IGNhbiAifSx7InR5cGUiOiJ0ZXh0IiwibWFya3MiOlt7InR5cGUiOiJib2xkIn1dLCJ0ZXh0IjoiQ2xvc2UgJiBBcmNoaXZlIn0seyJ0eXBlIjoidGV4dCIsInRleHQiOiIgaXQgZnJvbSB0aGUgdG9wIHJpZ2h0IG1lbnUgdG8gbWFrZSBpdCBkaXNhcHBlciBxdWlja2VyLiJ9XX1dfV19LHsidHlwZSI6InBhcmFncmFwaCJ9LHsidHlwZSI6InBhcmFncmFwaCIsImNvbnRlbnQiOlt7InR5cGUiOiJ0ZXh0IiwidGV4dCI6Ik5vdCBzdXJlIHdoYXQgdG8gZG8gbmV4dD8gVHJ5IENyZWF0aW5nIGEgbmV3IHJlcXVlc3QgZm9yIHlvdXJzZWxmIG9yIHRlYW1tYXRlISJ9XX1dfQ%3D%3D
export function getWelcomeToAcapelaMessage(userId: string): JSONContent {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "What better way to onboard you ",
          },
          {
            type: "mention",
            attrs: {
              data: {
                userId: userId,
                type: "request-read",
              },
            },
          },
          {
            type: "text",
            text: "  than sending your first request?",
          },
        ],
      },
      {
        type: "paragraph",
      },
      {
        type: "bulletList",
        content: [
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    marks: [
                      {
                        type: "bold",
                      },
                    ],
                    text: "Mark this Request as done",
                  },
                  {
                    type: "text",
                    text: " to see it resolved.",
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    marks: [
                      {
                        type: "bold",
                      },
                    ],
                    text: "Close",
                  },
                  {
                    type: "text",
                    text: " it to free up your Received section and watch it disappear after 24 hours.",
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "You can ",
                  },
                  {
                    type: "text",
                    marks: [
                      {
                        type: "bold",
                      },
                    ],
                    text: "Close & Archive",
                  },
                  {
                    type: "text",
                    text: " it from the top right menu to make it disapper quicker.",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: "paragraph",
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Not sure what to do next? Try Creating a new request for yourself or teammate!",
          },
        ],
      },
    ],
  };
}

// Edit here - http://localhost:3000/dev/content?content=eyJ0eXBlIjoiZG9jIiwiY29udGVudCI6W3sidHlwZSI6InBhcmFncmFwaCIsImNvbnRlbnQiOlt7InR5cGUiOiJ0ZXh0IiwidGV4dCI6IkhleSAifSx7InR5cGUiOiJtZW50aW9uIiwiYXR0cnMiOnsiZGF0YSI6eyJ1c2VySWQiOiIyMDJmMjIzMy04ZTBmLTQ4N2MtODI1OS1hNzI5ZTA1MWZjZTIiLCJ0eXBlIjoicmVxdWVzdC1yZXNwb25zZSJ9fX0seyJ0eXBlIjoidGV4dCIsInRleHQiOiIgLCBnZXQgYSBoZWFkc3RhcnQgYnkgY2hlY2tpbmcgb3V0IHRoZXNlIHRpcHM6In1dfSx7InR5cGUiOiJwYXJhZ3JhcGgifSx7InR5cGUiOiJwYXJhZ3JhcGgiLCJjb250ZW50IjpbeyJ0eXBlIjoidGV4dCIsIm1hcmtzIjpbeyJ0eXBlIjoiYm9sZCJ9XSwidGV4dCI6IvCflZMgU2V0IGR1ZSBkYXRlcyBvbiByZXF1ZXN0cyJ9XX0seyJ0eXBlIjoicGFyYWdyYXBoIiwiY29udGVudCI6W3sidHlwZSI6InRleHQiLCJ0ZXh0IjoiTWFrZSBzdXJlIHlvdXIgcmVxdWVzdCBpcyB0b3Agb2YgbWluZCBmb3IgeW91IHRlYW0ifV19LHsidHlwZSI6InBhcmFncmFwaCJ9LHsidHlwZSI6InBhcmFncmFwaCIsImNvbnRlbnQiOlt7InR5cGUiOiJ0ZXh0IiwibWFya3MiOlt7InR5cGUiOiJib2xkIn1dLCJ0ZXh0Ijoi8J%2BTjCBZb3UgY2FuIG1lbnRpb24geW91cnNlbGYhIn1dfSx7InR5cGUiOiJwYXJhZ3JhcGgiLCJjb250ZW50IjpbeyJ0eXBlIjoidGV4dCIsInRleHQiOiJUaGlzIHdheSwgQWNhcGVsYSBjYW4gaGVscCB5b3UgZ2V0IHRocm91Z2ggeW91ciBkYWlseSB0YXNrcy4ifV19LHsidHlwZSI6InBhcmFncmFwaCJ9LHsidHlwZSI6InBhcmFncmFwaCIsImNvbnRlbnQiOlt7InR5cGUiOiJ0ZXh0IiwibWFya3MiOlt7InR5cGUiOiJib2xkIn1dLCJ0ZXh0Ijoi8J%2BZgiBBZGQgcmVhY3Rpb25zIHRvIG1lc3NhZ2VzICh3ZWIgYXBwIG9ubHkpIn1dfSx7InR5cGUiOiJwYXJhZ3JhcGgiLCJjb250ZW50IjpbeyJ0eXBlIjoidGV4dCIsInRleHQiOiJTaG93IHlvdXIgYXBwcmVjaWF0aW9uIG9yIHF1aWNrIGZlZWRiYWNrIHdpdGggZW1vamkgcmVhY3Rpb25zLiJ9XX0seyJ0eXBlIjoicGFyYWdyYXBoIn0seyJ0eXBlIjoicGFyYWdyYXBoIiwiY29udGVudCI6W3sidHlwZSI6InRleHQiLCJtYXJrcyI6W3sidHlwZSI6ImJvbGQifV0sInRleHQiOiLwn6SdIE1lbnRpb24gZ3JvdXBzICh3ZWIgYXBwIG9ubHkpIn1dfSx7InR5cGUiOiJwYXJhZ3JhcGgiLCJjb250ZW50IjpbeyJ0eXBlIjoidGV4dCIsInRleHQiOiJZb3UgY2FuIG5vdyBtZW50aW9uIGdyb3VwcyBvZiBwZW9wbGUgYW5kIGNyZWF0ZSBjdXN0b20gYWxpYXNlcy4ifV19LHsidHlwZSI6InBhcmFncmFwaCJ9LHsidHlwZSI6InBhcmFncmFwaCIsImNvbnRlbnQiOlt7InR5cGUiOiJ0ZXh0IiwibWFya3MiOlt7InR5cGUiOiJib2xkIn1dLCJ0ZXh0Ijoi8J%2BTjiBBZGQgbGlua3MgYW5kIGF0dGFjaG1lbnRzIn1dfSx7InR5cGUiOiJwYXJhZ3JhcGgiLCJjb250ZW50IjpbeyJ0eXBlIjoidGV4dCIsInRleHQiOiJObyBtb3JlIGRvY3VtZW50IGh1bnRpbmcgYW5kIGNoYXNpbmcgZm9yIHRlYW0gcHJvamVjdHMuIn1dfSx7InR5cGUiOiJwYXJhZ3JhcGgifSx7InR5cGUiOiJwYXJhZ3JhcGgiLCJjb250ZW50IjpbeyJ0eXBlIjoidGV4dCIsInRleHQiOiJIYXZlIG1vcmUgaWRlYXMgb3IgZmVhdHVyZSByZXF1ZXN0cz8gTGVhdmUgdXMgZmVlZGJhY2suIFRoYW5rIHlvdSBhIGJ1bmNoLiDwn5mPIn1dfV19
export function getInitialTipsMessage(userId: string): JSONContent {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Hey ",
          },
          {
            type: "mention",
            attrs: {
              data: {
                userId,
                type: "request-response",
              },
            },
          },
          {
            type: "text",
            text: " , get a headstart by checking out these tips:",
          },
        ],
      },
      {
        type: "paragraph",
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            marks: [
              {
                type: "bold",
              },
            ],
            text: "🕓 Set due dates on requests",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Make sure your request is top of mind for you team",
          },
        ],
      },
      {
        type: "paragraph",
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            marks: [
              {
                type: "bold",
              },
            ],
            text: "📌 You can mention yourself!",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "This way, Acapela can help you get through your daily tasks.",
          },
        ],
      },
      {
        type: "paragraph",
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            marks: [
              {
                type: "bold",
              },
            ],
            text: "🙂 Add reactions to messages (web app only)",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Show your appreciation or quick feedback with emoji reactions.",
          },
        ],
      },
      {
        type: "paragraph",
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            marks: [
              {
                type: "bold",
              },
            ],
            text: "🤝 Mention groups (web app only)",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "You can now mention groups of people and create custom aliases.",
          },
        ],
      },
      {
        type: "paragraph",
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            marks: [
              {
                type: "bold",
              },
            ],
            text: "📎 Add links and attachments",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "No more document hunting and chasing for team projects.",
          },
        ],
      },
      {
        type: "paragraph",
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Have more ideas or feature requests? Leave us feedback. Thank you a bunch. 🙏",
          },
        ],
      },
    ],
  };
}

// Edit here - http://localhost:3000/dev/content?content=eyJ0eXBlIjoiZG9jIiwiY29udGVudCI6W3sidHlwZSI6InBhcmFncmFwaCIsImNvbnRlbnQiOlt7InR5cGUiOiJtZW50aW9uIiwiYXR0cnMiOnsiZGF0YSI6eyJ1c2VySWQiOiIyMDJmMjIzMy04ZTBmLTQ4N2MtODI1OS1hNzI5ZTA1MWZjZTIiLCJ0eXBlIjoicmVxdWVzdC1yZXNwb25zZSJ9fX0seyJ0eXBlIjoidGV4dCIsInRleHQiOiIgSW4gY2FzZSB5b3UgaGF2ZW7igJl0IHRyaWVkIGl0IHlldCwgd2UgaGF2ZSBhIHByZXR0eSBwb3dlcmZ1bCBTbGFjayBhZGQtb24geW91IHNob3VsZCB0cnkhIn1dfSx7InR5cGUiOiJwYXJhZ3JhcGgifSx7InR5cGUiOiJwYXJhZ3JhcGgiLCJjb250ZW50IjpbeyJ0eXBlIjoidGV4dCIsInRleHQiOiLwn5GJIEFkZCB0byB5b3VyIFNsYWNrIG5vdy4ifV19LHsidHlwZSI6InBhcmFncmFwaCJ9LHsidHlwZSI6InBhcmFncmFwaCIsImNvbnRlbnQiOlt7InR5cGUiOiJ0ZXh0IiwidGV4dCI6IkhhdmUgbW9yZSBpZGVhcyBvciBmZWF0dXJlIHJlcXVlc3RzPyBMZWF2ZSB1cyBmZWVkYmFjay4gVGhhbmsgeW91IGEgYnVuY2guIPCfmY8ifV19XX0%3D
export function getSlackIntegrationTipsMessage(userId: string): JSONContent {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "mention",
            attrs: {
              data: {
                userId: userId,
                type: "request-response",
              },
            },
          },
          {
            type: "text",
            text: " In case you haven’t tried it yet, we have a pretty powerful Slack add-on you should try!",
          },
        ],
      },
      {
        type: "paragraph",
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "👉 Add to your Slack now.",
          },
        ],
      },
      {
        type: "paragraph",
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Have more ideas or feature requests? Leave us feedback. Thank you a bunch. 🙏",
          },
        ],
      },
    ],
  };
}
