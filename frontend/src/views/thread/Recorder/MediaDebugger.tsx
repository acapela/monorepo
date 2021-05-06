// TODO: delete
export const MediaDebugger = ({
  status,
  error,
  mediaBlobUrl,
}: {
  status: string;
  error: string;
  mediaBlobUrl: string | null;
}) => {
  return (
    <>
      <span>Status: {status}</span>
      {error && <span>&nbsp;|&nbsp;Error: {error}</span>}
      {mediaBlobUrl && <video src={mediaBlobUrl} autoPlay />}
    </>
  );
};
