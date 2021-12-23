import { JSONContent } from "@tiptap/core";

// Edit here - http://localhost:3000/dev/content?content=eyJ0eXBlIjoiZG9jIiwiY29udGVudCI6W3sidHlwZSI6InBhcmFncmFwaCIsImNvbnRlbnQiOlt7InR5cGUiOiJ0ZXh0IiwidGV4dCI6IldoYXQgYmV0dGVyIHdheSB0byBvbmJvYXJkIHlvdSAifSx7InR5cGUiOiJtZW50aW9uIiwiYXR0cnMiOnsiZGF0YSI6eyJ1c2VySWQiOiIyMDJmMjIzMy04ZTBmLTQ4N2MtODI1OS1hNzI5ZTA1MWZjZTIiLCJ0eXBlIjoicmVxdWVzdC1yZXNwb25zZSJ9fX0seyJ0eXBlIjoidGV4dCIsInRleHQiOiIgdGhhbiBzZW5kaW5nIHlvdXIgZmlyc3QgcmVxdWVzdD%2FigKgifV19LHsidHlwZSI6ImJ1bGxldExpc3QiLCJjb250ZW50IjpbeyJ0eXBlIjoibGlzdEl0ZW0iLCJjb250ZW50IjpbeyJ0eXBlIjoicGFyYWdyYXBoIiwiY29udGVudCI6W3sidHlwZSI6InRleHQiLCJtYXJrcyI6W3sidHlwZSI6ImJvbGQifV0sInRleHQiOiJNYXJrIHRoaXMgUmVxdWVzdCBhcyBkb25lIn0seyJ0eXBlIjoidGV4dCIsInRleHQiOiIgdG8gc2VlIGl0IHJlc29sdmVkLiJ9XX1dfSx7InR5cGUiOiJsaXN0SXRlbSIsImNvbnRlbnQiOlt7InR5cGUiOiJwYXJhZ3JhcGgiLCJjb250ZW50IjpbeyJ0eXBlIjoidGV4dCIsInRleHQiOiJBZnRlciBtYXJraW5nIGl0IGFzIGRvbmUsIHlvdSBjYW4gIn0seyJ0eXBlIjoidGV4dCIsIm1hcmtzIjpbeyJ0eXBlIjoiYm9sZCJ9XSwidGV4dCI6ImNsb3NlIHRoaXMgcmVxdWVzdCJ9LHsidHlwZSI6InRleHQiLCJ0ZXh0IjoiIHVzaW5nIGJ1dHRvbiBpbiB0b3AgcmlnaHQgY29ybmVyLiJ9XX1dfSx7InR5cGUiOiJsaXN0SXRlbSIsImNvbnRlbnQiOlt7InR5cGUiOiJwYXJhZ3JhcGgiLCJjb250ZW50IjpbeyJ0eXBlIjoidGV4dCIsInRleHQiOiJBZnRlciBjbG9zaW5nIHRoaXMgcmVxdWVzdCB5b3UgY2FuICJ9LHsidHlwZSI6InRleHQiLCJtYXJrcyI6W3sidHlwZSI6ImJvbGQifV0sInRleHQiOiJhcmNoaXZlIn0seyJ0eXBlIjoidGV4dCIsInRleHQiOiIgaXQgeW91cnNlbGYgb3Igd2FpdCBmb3IgaXQgdG8gZ2V0IGFyY2hpdmVkIGF1dG9tYXRpY2FsbHkgYWZ0ZXIgMjQgaG91cnMuIn1dfV19XX0seyJ0eXBlIjoicGFyYWdyYXBoIn0seyJ0eXBlIjoicGFyYWdyYXBoIiwiY29udGVudCI6W3sidHlwZSI6InRleHQiLCJ0ZXh0IjoiTm90IHN1cmUgd2hhdCB0byBkbyBuZXh0PyBUcnkgIn0seyJ0eXBlIjoidGV4dCIsIm1hcmtzIjpbeyJ0eXBlIjoiYm9sZCJ9XSwidGV4dCI6IkNyZWF0aW5nIGEgbmV3IHJlcXVlc3QifSx7InR5cGUiOiJ0ZXh0IiwidGV4dCI6IiBmcm9tIHRoZSBzaWRlYmFyIGZvciB5b3Vyc2VsZiBvciB0ZWFtbWF0ZSEifV19XX0%3D
export function getWelcomeToAcapelaMessage(userId: string): JSONContent {
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
                type: "request-read",
              },
            },
          },
          {
            type: "text",
            text: "!",
          },
        ],
      },
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
                userId,
                type: "request-read",
              },
            },
          },
          {
            type: "text",
            text: " than sending your first request?",
          },
        ],
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
                    text: "After marking it as done, you can ",
                  },
                  {
                    type: "text",
                    marks: [
                      {
                        type: "bold",
                      },
                    ],
                    text: "close this request",
                  },
                  {
                    type: "text",
                    text: " using button in top right corner.",
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
                    text: "After closing this request you can ",
                  },
                  {
                    type: "text",
                    marks: [
                      {
                        type: "bold",
                      },
                    ],
                    text: "archive",
                  },
                  {
                    type: "text",
                    text: " it yourself or wait for it to get archived automatically after 24 hours.",
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
            text: "Not sure what to do next? Try ",
          },
          {
            type: "text",
            marks: [
              {
                type: "bold",
              },
            ],
            text: "Creating a new request",
          },
          {
            type: "text",
            text: " from the sidebar for yourself or teammate!",
          },
        ],
      },
    ],
  };
}

// Edit here - http://localhost:3000/dev/content?content=eyJ0eXBlIjoiZG9jIiwiY29udGVudCI6W3sidHlwZSI6InBhcmFncmFwaCIsImNvbnRlbnQiOlt7InR5cGUiOiJ0ZXh0IiwidGV4dCI6IkhleSAifSx7InR5cGUiOiJtZW50aW9uIiwiYXR0cnMiOnsiZGF0YSI6eyJ1c2VySWQiOiIyMDJmMjIzMy04ZTBmLTQ4N2MtODI1OS1hNzI5ZTA1MWZjZTIiLCJ0eXBlIjoicmVxdWVzdC1yZXNwb25zZSJ9fX0seyJ0eXBlIjoidGV4dCIsInRleHQiOiIsIGdldCBhIGhlYWRzdGFydCBieSBjaGVja2luZyBvdXQgdGhlc2UgdGlwczoifV19LHsidHlwZSI6InBhcmFncmFwaCJ9LHsidHlwZSI6InBhcmFncmFwaCIsImNvbnRlbnQiOlt7InR5cGUiOiJ0ZXh0IiwibWFya3MiOlt7InR5cGUiOiJib2xkIn1dLCJ0ZXh0Ijoi8J%2BVkyBTZXQgZHVlIGRhdGVzIG9uIHJlcXVlc3RzIn1dfSx7InR5cGUiOiJwYXJhZ3JhcGgiLCJjb250ZW50IjpbeyJ0eXBlIjoidGV4dCIsInRleHQiOiJNYWtlIHN1cmUgeW91ciByZXF1ZXN0IGlzIHRvcCBvZiBtaW5kIGZvciB5b3UgdGVhbS4ifV19LHsidHlwZSI6InBhcmFncmFwaCJ9LHsidHlwZSI6InBhcmFncmFwaCIsImNvbnRlbnQiOlt7InR5cGUiOiJ0ZXh0IiwibWFya3MiOlt7InR5cGUiOiJib2xkIn1dLCJ0ZXh0Ijoi8J%2BTjCBZb3UgY2FuIG1lbnRpb24geW91cnNlbGYhIn1dfSx7InR5cGUiOiJwYXJhZ3JhcGgiLCJjb250ZW50IjpbeyJ0eXBlIjoidGV4dCIsInRleHQiOiJUaGlzIHdheSwgQWNhcGVsYSBjYW4gaGVscCB5b3UgZ2V0IHRocm91Z2ggeW91ciBkYWlseSB0YXNrcy4ifV19LHsidHlwZSI6InBhcmFncmFwaCJ9LHsidHlwZSI6InBhcmFncmFwaCIsImNvbnRlbnQiOlt7InR5cGUiOiJ0ZXh0IiwibWFya3MiOlt7InR5cGUiOiJib2xkIn1dLCJ0ZXh0Ijoi8J%2BZgiBBZGQgcmVhY3Rpb25zIHRvIG1lc3NhZ2VzICh3ZWIgYXBwIG9ubHkpIn1dfSx7InR5cGUiOiJwYXJhZ3JhcGgiLCJjb250ZW50IjpbeyJ0eXBlIjoidGV4dCIsInRleHQiOiJTaG93IHlvdXIgYXBwcmVjaWF0aW9uIG9yIHF1aWNrIGZlZWRiYWNrIHdpdGggZW1vamkgcmVhY3Rpb25zLiJ9XX0seyJ0eXBlIjoicGFyYWdyYXBoIn0seyJ0eXBlIjoicGFyYWdyYXBoIiwiY29udGVudCI6W3sidHlwZSI6InRleHQiLCJtYXJrcyI6W3sidHlwZSI6ImJvbGQifV0sInRleHQiOiLwn6SdIE1lbnRpb24gZ3JvdXBzICh3ZWIgYXBwIG9ubHkpIn1dfSx7InR5cGUiOiJwYXJhZ3JhcGgiLCJjb250ZW50IjpbeyJ0eXBlIjoidGV4dCIsInRleHQiOiJZb3UgY2FuIG5vdyBtZW50aW9uIGdyb3VwcyBvZiBwZW9wbGUgYW5kIGNyZWF0ZSBjdXN0b20gYWxpYXNlcy4ifV19LHsidHlwZSI6InBhcmFncmFwaCJ9LHsidHlwZSI6InBhcmFncmFwaCIsImNvbnRlbnQiOlt7InR5cGUiOiJ0ZXh0IiwibWFya3MiOlt7InR5cGUiOiJib2xkIn1dLCJ0ZXh0Ijoi8J%2BTjiBBZGQgbGlua3MgYW5kIGF0dGFjaG1lbnRzIn1dfSx7InR5cGUiOiJwYXJhZ3JhcGgiLCJjb250ZW50IjpbeyJ0eXBlIjoidGV4dCIsInRleHQiOiJObyBtb3JlIGRvY3VtZW50IGh1bnRpbmcgYW5kIGNoYXNpbmcgZm9yIHRlYW0gcHJvamVjdHMuIn1dfSx7InR5cGUiOiJwYXJhZ3JhcGgifSx7InR5cGUiOiJwYXJhZ3JhcGgiLCJjb250ZW50IjpbeyJ0eXBlIjoidGV4dCIsInRleHQiOiJIYXZlIG1vcmUgaWRlYXMgb3IgZmVhdHVyZSByZXF1ZXN0cz8gR2l2ZSB1cyBmZWVkYmFjayB1c2luZyB0aGUgYnV0dG9uIG9uIHRoZSByaWdodC1oYW5kIHNpZGUuIFRoYW5rIHlvdSBhIGJ1bmNoISDwn5mPIn1dfV19
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
                type: "request-read",
              },
            },
          },
          {
            type: "text",
            text: ", get a headstart by checking out these tips:",
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
            text: "Make sure your request is top of mind for you team.",
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
            text: "Have more ideas or feature requests? Give us feedback using the button on the right-hand side. Thank you a bunch! 🙏",
          },
        ],
      },
    ],
  };
}

// Edit here - http://localhost:3000/dev/content?content=eyJ0eXBlIjoiZG9jIiwiY29udGVudCI6W3sidHlwZSI6InBhcmFncmFwaCIsImNvbnRlbnQiOlt7InR5cGUiOiJtZW50aW9uIiwiYXR0cnMiOnsiZGF0YSI6eyJ1c2VySWQiOiIyMDJmMjIzMy04ZTBmLTQ4N2MtODI1OS1hNzI5ZTA1MWZjZTIiLCJ0eXBlIjoicmVxdWVzdC1yZXNwb25zZSJ9fX0seyJ0eXBlIjoidGV4dCIsInRleHQiOiIgaW4gY2FzZSB5b3UgaGF2ZW7igJl0IHRyaWVkIGl0IHlldCwgd2UgaGF2ZSBhIHByZXR0eSBwb3dlcmZ1bCBTbGFjayBhZGQtb24geW91IHNob3VsZCB0cnkhIn1dfSx7InR5cGUiOiJwYXJhZ3JhcGgifSx7InR5cGUiOiJwYXJhZ3JhcGgiLCJjb250ZW50IjpbeyJ0eXBlIjoidGV4dCIsIm1hcmtzIjpbeyJ0eXBlIjoibGluayIsImF0dHJzIjp7ImhyZWYiOiIvc2V0dGluZ3MiLCJ0YXJnZXQiOiJfYmxhbmsifX1dLCJ0ZXh0Ijoi8J%2BRiSBBZGQgdG8geW91ciBTbGFjayBub3cuIn0seyJ0eXBlIjoidGV4dCIsInRleHQiOiIgIn1dfSx7InR5cGUiOiJwYXJhZ3JhcGgifSx7InR5cGUiOiJwYXJhZ3JhcGgiLCJjb250ZW50IjpbeyJ0eXBlIjoidGV4dCIsInRleHQiOiJIYXZlIG1vcmUgaWRlYXMgb3IgZmVhdHVyZSByZXF1ZXN0cz8gR2l2ZSB1cyBmZWVkYmFjayB1c2luZyB0aGUgYnV0dG9uIG9uIHRoZSByaWdodC1oYW5kIHNpZGUuIFRoYW5rIHlvdSBhIGJ1bmNoISDwn5mPIn1dfV19
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
                userId,
                type: "request-action",
              },
            },
          },
          {
            type: "text",
            text: " in case you haven’t tried it yet, we have a pretty powerful Slack add-on you should try!",
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
                type: "link",
                attrs: {
                  href: "/settings",
                },
              },
            ],
            text: "👉 Add to your Slack now.",
          },
          {
            type: "text",
            text: " ",
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
            text: "Have more ideas or feature requests? Give us feedback using the button on the right-hand side. Thank you a bunch! 🙏",
          },
        ],
      },
    ],
  };
}
