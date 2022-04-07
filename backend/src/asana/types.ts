export interface Webhook {
  user: Resource;
  created_at: string;
  action: string;
  resource: Resource;
  parent: Resource | null;
  change?: Change;
}

export interface Resource {
  gid: string;
  resource_type: string;
  resource_subtype?: string;
}

export interface Change {
  field: string;
  action: string;
  new_value: Resource;
}
