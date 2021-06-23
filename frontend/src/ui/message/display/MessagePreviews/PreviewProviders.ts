import { LoomPreviewProvider } from "./LoomPreviewProvider";
import { PreviewProvider } from "./PreviewProvider";

const supportedPreviewProviders = [LoomPreviewProvider];

export const getPreviewProviders = (urls: string[]) =>
  urls.reduce((acc: PreviewProvider[], url) => {
    const previewProvider = supportedPreviewProviders.find(({ isUrlSupported }) => isUrlSupported(url));

    if (previewProvider) {
      acc.push(previewProvider);
    }

    return acc;
  }, []);
