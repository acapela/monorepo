import React from "react";

import { SidebarLayout } from "./Layout";
import { SidebarContent } from "./SidebarContent";

export function NewRequestView() {
  return <SidebarLayout sidebarContent={<SidebarContent />}>These are my hopes and dreams</SidebarLayout>;
}
