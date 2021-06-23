interface PreviewComponentProps {
  url: string;
}

export interface PreviewProvider {
  isUrlSupported: (url: string) => boolean;
  PreviewComponent: (props: PreviewComponentProps) => React.ReactNode;
}
