import TopicOrNewRequestPage from "./topic/[topicSlug]";

// Reuse reference to same component to avoid full re-mount (including sidebar) when navigating topic<>new-topic page
export default TopicOrNewRequestPage;
