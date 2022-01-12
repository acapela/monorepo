import Head from "next/head";

import { Maybe } from "@aca/shared/types";

interface Props {
  title?: Maybe<string>;
}

function getTitleString(title: Maybe<string>) {
  title = title?.trim();

  if (!title) return "Acapela";

  return `${title.trim()} | Acapela`;
}

export function PageMeta({ title }: Props) {
  return (
    <Head>
      <title>{getTitleString(title)}</title>
    </Head>
  );
}
