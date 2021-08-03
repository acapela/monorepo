import { withServerSideAuthRedirect } from "~frontend/authentication/withServerSideAuthRedirect";
import { RoomOrTopicPage } from "~frontend/pages/RoomOrTopicPage";

export const getServerSideProps = withServerSideAuthRedirect();

/**
 * We're reusing exact same component for both room main page and room single topic page.
 *
 * This is to avoid re-mounting the entire page when navigating from /[spaceId]/[roomId] to /[spaceId]/[roomId]/[topicId]
 *
 * Both of those pages use exact same component <RoomView />, but only with different props.
 *
 * However, if both those pages (index.tsx and [topicId].tsx) export default different function, react will read it as
 * brand new component and perform remounting.
 */
export default RoomOrTopicPage;
