import { Blocks, Elements, Message as SlackMessage } from "slack-block-builder";

import { backendUserEventToJSON } from "@aca/shared/backendAnalytics";

import { SlackActionIds } from "../utils";

export function NewUserOnboardingMessage(slackTeamId: string, currentUserId: string) {
  return SlackMessage()
    .blocks(
      Blocks.Section({ text: "Hi there 🤗" }),
      Blocks.Section({ text: "Thank you for installing Acapela!" }),
      Blocks.Section({
        text: "Use Acapela by starting to type `/acapela` in any of the channels you are already invited to.",
      }),
      Blocks.Divider(),
      Blocks.Section({
        text: "*What is Acapela?*\nAcapela is a flexible, lightweight way to turn messages into action items in tools like Slack. It captures and prioritises these requests for you, so you can make your work less distracting and more actionable.",
      }).accessory(
        Elements.Img({
          altText: "Acapela thumbnail",
          imageUrl:
            "https://bucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com/public/images/056b1317-d2b4-4322-b951-f63f7f092fbf_3000x2400.jpeg",
        })
      ),
      Blocks.Context({}).elements([
        "📺  <https://www.loom.com/share/c59d758244c042e48309b104710256c1|Watch this quick 2 min video> to understand how Acapela works.",
      ]),
      Blocks.Context({}).elements(["📃 <https://blog.acapela.com/|Read this article> about why we started Acapela."]),
      Blocks.Context({}).elements(["↗️ <app.acape.la|Try the Acapela Web app> to manage your workflow even quicker."]),
      Blocks.Divider(),
      Blocks.Header({ text: "What's next?" }),
      Blocks.Section({ text: "1️⃣ *Create your first request*\nCould be a todo for yourself or others." }).accessory(
        Elements.Button({ text: "+ New Request", actionId: SlackActionIds.CreateTopic }).primary(true)
      ),
      Blocks.Divider(),
      Blocks.Section({
        text: "2️⃣ *Check out the Home tab of Acapela*\nView new incoming requests and interact with them",
      }).accessory(
        Elements.Button({
          text: "View Home tab",
          url: `https://slack.com/app_redirect?team=${slackTeamId}&app=A012VTBSTNV`,
        })
          .primary(true)
          .actionId(SlackActionIds.TrackEvent)
          .value(backendUserEventToJSON(currentUserId, "Opened Home Tab From Slack Onboarding"))
      ),
      Blocks.Divider(),
      Blocks.Section({
        text: "3️⃣ *Visit our Requests showcase*\nGet inspired by ways you can use Acapela",
      }).accessory(
        Elements.Button({
          text: "Visit gallery",
          url: `https://acapela.notion.site/Request-Templates-eb11cbaa62324203b0e1534b16f9f959`,
        })
          .primary(true)
          .actionId(SlackActionIds.TrackEvent)
          .value(backendUserEventToJSON(currentUserId, "Opened Gallery From Slack Onboarding"))
      ),
      Blocks.Divider(),
      Blocks.Section({
        text: "*Need help or have suggestions?* <mailto:customer@acape.la|Contact us>",
      })
    )
    .buildToObject();
}
