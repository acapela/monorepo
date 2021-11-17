import dynamic from "next/dynamic";

const TopicOrNewRequestPageDynamic = dynamic(
  async () => (await import("~frontend/views/TopicOrNewRequestPage")).TopicOrNewRequestPage,
  { ssr: false }
);

export default function Foo() {
  return <TopicOrNewRequestPageDynamic />;
}
