import { FieldPolicy, FieldReadFunction, TypePolicies, TypePolicy } from '@apollo/client/cache';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  bigint: number;
  date: Date;
  jsonb: any;
  timestamp: string;
  timestamptz: string;
  uuid: string;
}


/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export interface Boolean_Comparison_Exp {
  _eq?: Maybe<Scalars['Boolean']>;
  _gt?: Maybe<Scalars['Boolean']>;
  _gte?: Maybe<Scalars['Boolean']>;
  _in?: Maybe<Array<Scalars['Boolean']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['Boolean']>;
  _lte?: Maybe<Scalars['Boolean']>;
  _neq?: Maybe<Scalars['Boolean']>;
  _nin?: Maybe<Array<Scalars['Boolean']>>;
}

export interface GetTeamSlackInstallationUrlInput {
  redirectURL: Scalars['String'];
  teamId: Scalars['uuid'];
}

export interface GetTeamSlackInstallationUrlOutput {
  __typename?: 'GetTeamSlackInstallationURLOutput';
  url: Scalars['String'];
}

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export interface Int_Comparison_Exp {
  _eq?: Maybe<Scalars['Int']>;
  _gt?: Maybe<Scalars['Int']>;
  _gte?: Maybe<Scalars['Int']>;
  _in?: Maybe<Array<Scalars['Int']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['Int']>;
  _lte?: Maybe<Scalars['Int']>;
  _neq?: Maybe<Scalars['Int']>;
  _nin?: Maybe<Array<Scalars['Int']>>;
}

export interface LookupTeamNameResponse {
  __typename?: 'LookupTeamNameResponse';
  email: Scalars['String'];
  inviter_name: Scalars['String'];
  team_name: Scalars['String'];
}

export interface ResendInvitationResponse {
  __typename?: 'ResendInvitationResponse';
  sent_at?: Maybe<Scalars['timestamptz']>;
}

export interface RoomInvitationViewResponse {
  __typename?: 'RoomInvitationViewResponse';
  inviter_name: Scalars['String'];
  room_name: Scalars['String'];
}

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export interface String_Comparison_Exp {
  _eq?: Maybe<Scalars['String']>;
  _gt?: Maybe<Scalars['String']>;
  _gte?: Maybe<Scalars['String']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: Maybe<Scalars['String']>;
  _in?: Maybe<Array<Scalars['String']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: Maybe<Scalars['String']>;
  _is_null?: Maybe<Scalars['Boolean']>;
  /** does the column match the given pattern */
  _like?: Maybe<Scalars['String']>;
  _lt?: Maybe<Scalars['String']>;
  _lte?: Maybe<Scalars['String']>;
  _neq?: Maybe<Scalars['String']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: Maybe<Scalars['String']>;
  _nin?: Maybe<Array<Scalars['String']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: Maybe<Scalars['String']>;
  /** does the column NOT match the given pattern */
  _nlike?: Maybe<Scalars['String']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: Maybe<Scalars['String']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: Maybe<Scalars['String']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: Maybe<Scalars['String']>;
  /** does the column match the given SQL regular expression */
  _similar?: Maybe<Scalars['String']>;
}

export interface UpgradeUserResponse {
  __typename?: 'UpgradeUserResponse';
  /** An object relationship */
  user: User;
  user_id: Scalars['ID'];
}

export interface UploadUrlResponse {
  __typename?: 'UploadUrlResponse';
  uploadUrl: Scalars['String'];
  uuid: Scalars['ID'];
}

/**
 * Account represents 3rd party login methods used by given user.
 *
 *
 * columns and relationships of "account"
 */
export interface Account {
  __typename?: 'account';
  access_token?: Maybe<Scalars['String']>;
  access_token_expires?: Maybe<Scalars['timestamptz']>;
  created_at: Scalars['timestamptz'];
  id: Scalars['uuid'];
  provider_account_id: Scalars['String'];
  provider_id: Scalars['String'];
  provider_type: Scalars['String'];
  refresh_token?: Maybe<Scalars['String']>;
  updated_at: Scalars['timestamptz'];
  /** An object relationship */
  user: User;
  user_id: Scalars['uuid'];
}

/** aggregated selection of "account" */
export interface Account_Aggregate {
  __typename?: 'account_aggregate';
  aggregate?: Maybe<Account_Aggregate_Fields>;
  nodes: Array<Account>;
}

/** aggregate fields of "account" */
export interface Account_Aggregate_Fields {
  __typename?: 'account_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Account_Max_Fields>;
  min?: Maybe<Account_Min_Fields>;
}


/** aggregate fields of "account" */
export interface Account_Aggregate_FieldsCountArgs {
  columns?: Maybe<Array<Account_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
}

/** Boolean expression to filter rows from the table "account". All fields are combined with a logical 'AND'. */
export interface Account_Bool_Exp {
  _and?: Maybe<Array<Account_Bool_Exp>>;
  _not?: Maybe<Account_Bool_Exp>;
  _or?: Maybe<Array<Account_Bool_Exp>>;
  access_token?: Maybe<String_Comparison_Exp>;
  access_token_expires?: Maybe<Timestamptz_Comparison_Exp>;
  created_at?: Maybe<Timestamptz_Comparison_Exp>;
  id?: Maybe<Uuid_Comparison_Exp>;
  provider_account_id?: Maybe<String_Comparison_Exp>;
  provider_id?: Maybe<String_Comparison_Exp>;
  provider_type?: Maybe<String_Comparison_Exp>;
  refresh_token?: Maybe<String_Comparison_Exp>;
  updated_at?: Maybe<Timestamptz_Comparison_Exp>;
  user?: Maybe<User_Bool_Exp>;
  user_id?: Maybe<Uuid_Comparison_Exp>;
}

/** unique or primary key constraints on table "account" */
export type Account_Constraint =
  /** unique or primary key constraint */
  | 'account_pkey';

/** input type for inserting data into table "account" */
export interface Account_Insert_Input {
  access_token?: Maybe<Scalars['String']>;
  access_token_expires?: Maybe<Scalars['timestamptz']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  provider_account_id?: Maybe<Scalars['String']>;
  provider_id?: Maybe<Scalars['String']>;
  provider_type?: Maybe<Scalars['String']>;
  refresh_token?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  user?: Maybe<User_Obj_Rel_Insert_Input>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** aggregate max on columns */
export interface Account_Max_Fields {
  __typename?: 'account_max_fields';
  access_token?: Maybe<Scalars['String']>;
  access_token_expires?: Maybe<Scalars['timestamptz']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  provider_account_id?: Maybe<Scalars['String']>;
  provider_id?: Maybe<Scalars['String']>;
  provider_type?: Maybe<Scalars['String']>;
  refresh_token?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** aggregate min on columns */
export interface Account_Min_Fields {
  __typename?: 'account_min_fields';
  access_token?: Maybe<Scalars['String']>;
  access_token_expires?: Maybe<Scalars['timestamptz']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  provider_account_id?: Maybe<Scalars['String']>;
  provider_id?: Maybe<Scalars['String']>;
  provider_type?: Maybe<Scalars['String']>;
  refresh_token?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** response of any mutation on the table "account" */
export interface Account_Mutation_Response {
  __typename?: 'account_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Account>;
}

/** on conflict condition type for table "account" */
export interface Account_On_Conflict {
  constraint: Account_Constraint;
  update_columns?: Array<Account_Update_Column>;
  where?: Maybe<Account_Bool_Exp>;
}

/** Ordering options when selecting data from "account". */
export interface Account_Order_By {
  access_token?: Maybe<Order_By>;
  access_token_expires?: Maybe<Order_By>;
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  provider_account_id?: Maybe<Order_By>;
  provider_id?: Maybe<Order_By>;
  provider_type?: Maybe<Order_By>;
  refresh_token?: Maybe<Order_By>;
  updated_at?: Maybe<Order_By>;
  user?: Maybe<User_Order_By>;
  user_id?: Maybe<Order_By>;
}

/** primary key columns input for table: account */
export interface Account_Pk_Columns_Input {
  id: Scalars['uuid'];
}

/** select columns of table "account" */
export type Account_Select_Column =
  /** column name */
  | 'access_token'
  /** column name */
  | 'access_token_expires'
  /** column name */
  | 'created_at'
  /** column name */
  | 'id'
  /** column name */
  | 'provider_account_id'
  /** column name */
  | 'provider_id'
  /** column name */
  | 'provider_type'
  /** column name */
  | 'refresh_token'
  /** column name */
  | 'updated_at'
  /** column name */
  | 'user_id';

/** input type for updating data in table "account" */
export interface Account_Set_Input {
  access_token?: Maybe<Scalars['String']>;
  access_token_expires?: Maybe<Scalars['timestamptz']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  provider_account_id?: Maybe<Scalars['String']>;
  provider_id?: Maybe<Scalars['String']>;
  provider_type?: Maybe<Scalars['String']>;
  refresh_token?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** update columns of table "account" */
export type Account_Update_Column =
  /** column name */
  | 'access_token'
  /** column name */
  | 'access_token_expires'
  /** column name */
  | 'created_at'
  /** column name */
  | 'id'
  /** column name */
  | 'provider_account_id'
  /** column name */
  | 'provider_id'
  /** column name */
  | 'provider_type'
  /** column name */
  | 'refresh_token'
  /** column name */
  | 'updated_at'
  /** column name */
  | 'user_id';

/** columns and relationships of "attachment" */
export interface Attachment {
  __typename?: 'attachment';
  created_at: Scalars['timestamptz'];
  id: Scalars['uuid'];
  /** An object relationship */
  message?: Maybe<Message>;
  message_id?: Maybe<Scalars['uuid']>;
  mime_type: Scalars['String'];
  original_name: Scalars['String'];
  /** An object relationship */
  transcription?: Maybe<Transcription>;
  transcription_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** aggregated selection of "attachment" */
export interface Attachment_Aggregate {
  __typename?: 'attachment_aggregate';
  aggregate?: Maybe<Attachment_Aggregate_Fields>;
  nodes: Array<Attachment>;
}

/** aggregate fields of "attachment" */
export interface Attachment_Aggregate_Fields {
  __typename?: 'attachment_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Attachment_Max_Fields>;
  min?: Maybe<Attachment_Min_Fields>;
}


/** aggregate fields of "attachment" */
export interface Attachment_Aggregate_FieldsCountArgs {
  columns?: Maybe<Array<Attachment_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
}

/** order by aggregate values of table "attachment" */
export interface Attachment_Aggregate_Order_By {
  count?: Maybe<Order_By>;
  max?: Maybe<Attachment_Max_Order_By>;
  min?: Maybe<Attachment_Min_Order_By>;
}

/** input type for inserting array relation for remote table "attachment" */
export interface Attachment_Arr_Rel_Insert_Input {
  data: Array<Attachment_Insert_Input>;
  /** on conflict condition */
  on_conflict?: Maybe<Attachment_On_Conflict>;
}

/** Boolean expression to filter rows from the table "attachment". All fields are combined with a logical 'AND'. */
export interface Attachment_Bool_Exp {
  _and?: Maybe<Array<Attachment_Bool_Exp>>;
  _not?: Maybe<Attachment_Bool_Exp>;
  _or?: Maybe<Array<Attachment_Bool_Exp>>;
  created_at?: Maybe<Timestamptz_Comparison_Exp>;
  id?: Maybe<Uuid_Comparison_Exp>;
  message?: Maybe<Message_Bool_Exp>;
  message_id?: Maybe<Uuid_Comparison_Exp>;
  mime_type?: Maybe<String_Comparison_Exp>;
  original_name?: Maybe<String_Comparison_Exp>;
  transcription?: Maybe<Transcription_Bool_Exp>;
  transcription_id?: Maybe<Uuid_Comparison_Exp>;
  user_id?: Maybe<Uuid_Comparison_Exp>;
}

/** unique or primary key constraints on table "attachment" */
export type Attachment_Constraint =
  /** unique or primary key constraint */
  | 'attachment_id_key'
  /** unique or primary key constraint */
  | 'attachment_pkey';

/** input type for inserting data into table "attachment" */
export interface Attachment_Insert_Input {
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  message?: Maybe<Message_Obj_Rel_Insert_Input>;
  message_id?: Maybe<Scalars['uuid']>;
  mime_type?: Maybe<Scalars['String']>;
  original_name?: Maybe<Scalars['String']>;
  transcription?: Maybe<Transcription_Obj_Rel_Insert_Input>;
  transcription_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** aggregate max on columns */
export interface Attachment_Max_Fields {
  __typename?: 'attachment_max_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  message_id?: Maybe<Scalars['uuid']>;
  mime_type?: Maybe<Scalars['String']>;
  original_name?: Maybe<Scalars['String']>;
  transcription_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** order by max() on columns of table "attachment" */
export interface Attachment_Max_Order_By {
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  message_id?: Maybe<Order_By>;
  mime_type?: Maybe<Order_By>;
  original_name?: Maybe<Order_By>;
  transcription_id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
}

/** aggregate min on columns */
export interface Attachment_Min_Fields {
  __typename?: 'attachment_min_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  message_id?: Maybe<Scalars['uuid']>;
  mime_type?: Maybe<Scalars['String']>;
  original_name?: Maybe<Scalars['String']>;
  transcription_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** order by min() on columns of table "attachment" */
export interface Attachment_Min_Order_By {
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  message_id?: Maybe<Order_By>;
  mime_type?: Maybe<Order_By>;
  original_name?: Maybe<Order_By>;
  transcription_id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
}

/** response of any mutation on the table "attachment" */
export interface Attachment_Mutation_Response {
  __typename?: 'attachment_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Attachment>;
}

/** on conflict condition type for table "attachment" */
export interface Attachment_On_Conflict {
  constraint: Attachment_Constraint;
  update_columns?: Array<Attachment_Update_Column>;
  where?: Maybe<Attachment_Bool_Exp>;
}

/** Ordering options when selecting data from "attachment". */
export interface Attachment_Order_By {
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  message?: Maybe<Message_Order_By>;
  message_id?: Maybe<Order_By>;
  mime_type?: Maybe<Order_By>;
  original_name?: Maybe<Order_By>;
  transcription?: Maybe<Transcription_Order_By>;
  transcription_id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
}

/** primary key columns input for table: attachment */
export interface Attachment_Pk_Columns_Input {
  id: Scalars['uuid'];
}

/** select columns of table "attachment" */
export type Attachment_Select_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'id'
  /** column name */
  | 'message_id'
  /** column name */
  | 'mime_type'
  /** column name */
  | 'original_name'
  /** column name */
  | 'transcription_id'
  /** column name */
  | 'user_id';

/** input type for updating data in table "attachment" */
export interface Attachment_Set_Input {
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  message_id?: Maybe<Scalars['uuid']>;
  mime_type?: Maybe<Scalars['String']>;
  original_name?: Maybe<Scalars['String']>;
  transcription_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** update columns of table "attachment" */
export type Attachment_Update_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'id'
  /** column name */
  | 'message_id'
  /** column name */
  | 'mime_type'
  /** column name */
  | 'original_name'
  /** column name */
  | 'transcription_id'
  /** column name */
  | 'user_id';


/** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
export interface Bigint_Comparison_Exp {
  _eq?: Maybe<Scalars['bigint']>;
  _gt?: Maybe<Scalars['bigint']>;
  _gte?: Maybe<Scalars['bigint']>;
  _in?: Maybe<Array<Scalars['bigint']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['bigint']>;
  _lte?: Maybe<Scalars['bigint']>;
  _neq?: Maybe<Scalars['bigint']>;
  _nin?: Maybe<Array<Scalars['bigint']>>;
}


/** Boolean expression to compare columns of type "date". All fields are combined with logical 'AND'. */
export interface Date_Comparison_Exp {
  _eq?: Maybe<Scalars['date']>;
  _gt?: Maybe<Scalars['date']>;
  _gte?: Maybe<Scalars['date']>;
  _in?: Maybe<Array<Scalars['date']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['date']>;
  _lte?: Maybe<Scalars['date']>;
  _neq?: Maybe<Scalars['date']>;
  _nin?: Maybe<Array<Scalars['date']>>;
}


/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export interface Jsonb_Comparison_Exp {
  /** is the column contained in the given json value */
  _contained_in?: Maybe<Scalars['jsonb']>;
  /** does the column contain the given json value at the top level */
  _contains?: Maybe<Scalars['jsonb']>;
  _eq?: Maybe<Scalars['jsonb']>;
  _gt?: Maybe<Scalars['jsonb']>;
  _gte?: Maybe<Scalars['jsonb']>;
  /** does the string exist as a top-level key in the column */
  _has_key?: Maybe<Scalars['String']>;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: Maybe<Array<Scalars['String']>>;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: Maybe<Array<Scalars['String']>>;
  _in?: Maybe<Array<Scalars['jsonb']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['jsonb']>;
  _lte?: Maybe<Scalars['jsonb']>;
  _neq?: Maybe<Scalars['jsonb']>;
  _nin?: Maybe<Array<Scalars['jsonb']>>;
}

/** columns and relationships of "last_seen_message" */
export interface Last_Seen_Message {
  __typename?: 'last_seen_message';
  message_id: Scalars['uuid'];
  seen_at: Scalars['timestamptz'];
  topic_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
}

/** aggregated selection of "last_seen_message" */
export interface Last_Seen_Message_Aggregate {
  __typename?: 'last_seen_message_aggregate';
  aggregate?: Maybe<Last_Seen_Message_Aggregate_Fields>;
  nodes: Array<Last_Seen_Message>;
}

/** aggregate fields of "last_seen_message" */
export interface Last_Seen_Message_Aggregate_Fields {
  __typename?: 'last_seen_message_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Last_Seen_Message_Max_Fields>;
  min?: Maybe<Last_Seen_Message_Min_Fields>;
}


/** aggregate fields of "last_seen_message" */
export interface Last_Seen_Message_Aggregate_FieldsCountArgs {
  columns?: Maybe<Array<Last_Seen_Message_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
}

/** Boolean expression to filter rows from the table "last_seen_message". All fields are combined with a logical 'AND'. */
export interface Last_Seen_Message_Bool_Exp {
  _and?: Maybe<Array<Last_Seen_Message_Bool_Exp>>;
  _not?: Maybe<Last_Seen_Message_Bool_Exp>;
  _or?: Maybe<Array<Last_Seen_Message_Bool_Exp>>;
  message_id?: Maybe<Uuid_Comparison_Exp>;
  seen_at?: Maybe<Timestamptz_Comparison_Exp>;
  topic_id?: Maybe<Uuid_Comparison_Exp>;
  user_id?: Maybe<Uuid_Comparison_Exp>;
}

/** unique or primary key constraints on table "last_seen_message" */
export type Last_Seen_Message_Constraint =
  /** unique or primary key constraint */
  | 'last_seen_message_pkey';

/** input type for inserting data into table "last_seen_message" */
export interface Last_Seen_Message_Insert_Input {
  message_id?: Maybe<Scalars['uuid']>;
  seen_at?: Maybe<Scalars['timestamptz']>;
  topic_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** aggregate max on columns */
export interface Last_Seen_Message_Max_Fields {
  __typename?: 'last_seen_message_max_fields';
  message_id?: Maybe<Scalars['uuid']>;
  seen_at?: Maybe<Scalars['timestamptz']>;
  topic_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** aggregate min on columns */
export interface Last_Seen_Message_Min_Fields {
  __typename?: 'last_seen_message_min_fields';
  message_id?: Maybe<Scalars['uuid']>;
  seen_at?: Maybe<Scalars['timestamptz']>;
  topic_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** response of any mutation on the table "last_seen_message" */
export interface Last_Seen_Message_Mutation_Response {
  __typename?: 'last_seen_message_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Last_Seen_Message>;
}

/** on conflict condition type for table "last_seen_message" */
export interface Last_Seen_Message_On_Conflict {
  constraint: Last_Seen_Message_Constraint;
  update_columns?: Array<Last_Seen_Message_Update_Column>;
  where?: Maybe<Last_Seen_Message_Bool_Exp>;
}

/** Ordering options when selecting data from "last_seen_message". */
export interface Last_Seen_Message_Order_By {
  message_id?: Maybe<Order_By>;
  seen_at?: Maybe<Order_By>;
  topic_id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
}

/** primary key columns input for table: last_seen_message */
export interface Last_Seen_Message_Pk_Columns_Input {
  topic_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
}

/** select columns of table "last_seen_message" */
export type Last_Seen_Message_Select_Column =
  /** column name */
  | 'message_id'
  /** column name */
  | 'seen_at'
  /** column name */
  | 'topic_id'
  /** column name */
  | 'user_id';

/** input type for updating data in table "last_seen_message" */
export interface Last_Seen_Message_Set_Input {
  message_id?: Maybe<Scalars['uuid']>;
  seen_at?: Maybe<Scalars['timestamptz']>;
  topic_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** update columns of table "last_seen_message" */
export type Last_Seen_Message_Update_Column =
  /** column name */
  | 'message_id'
  /** column name */
  | 'seen_at'
  /** column name */
  | 'topic_id'
  /** column name */
  | 'user_id';

/** columns and relationships of "membership_status" */
export interface Membership_Status {
  __typename?: 'membership_status';
  value: Scalars['String'];
}

/** aggregated selection of "membership_status" */
export interface Membership_Status_Aggregate {
  __typename?: 'membership_status_aggregate';
  aggregate?: Maybe<Membership_Status_Aggregate_Fields>;
  nodes: Array<Membership_Status>;
}

/** aggregate fields of "membership_status" */
export interface Membership_Status_Aggregate_Fields {
  __typename?: 'membership_status_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Membership_Status_Max_Fields>;
  min?: Maybe<Membership_Status_Min_Fields>;
}


/** aggregate fields of "membership_status" */
export interface Membership_Status_Aggregate_FieldsCountArgs {
  columns?: Maybe<Array<Membership_Status_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
}

/** Boolean expression to filter rows from the table "membership_status". All fields are combined with a logical 'AND'. */
export interface Membership_Status_Bool_Exp {
  _and?: Maybe<Array<Membership_Status_Bool_Exp>>;
  _not?: Maybe<Membership_Status_Bool_Exp>;
  _or?: Maybe<Array<Membership_Status_Bool_Exp>>;
  value?: Maybe<String_Comparison_Exp>;
}

/** unique or primary key constraints on table "membership_status" */
export type Membership_Status_Constraint =
  /** unique or primary key constraint */
  | 'team_membership_status_pkey';

/** input type for inserting data into table "membership_status" */
export interface Membership_Status_Insert_Input {
  value?: Maybe<Scalars['String']>;
}

/** aggregate max on columns */
export interface Membership_Status_Max_Fields {
  __typename?: 'membership_status_max_fields';
  value?: Maybe<Scalars['String']>;
}

/** aggregate min on columns */
export interface Membership_Status_Min_Fields {
  __typename?: 'membership_status_min_fields';
  value?: Maybe<Scalars['String']>;
}

/** response of any mutation on the table "membership_status" */
export interface Membership_Status_Mutation_Response {
  __typename?: 'membership_status_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Membership_Status>;
}

/** on conflict condition type for table "membership_status" */
export interface Membership_Status_On_Conflict {
  constraint: Membership_Status_Constraint;
  update_columns?: Array<Membership_Status_Update_Column>;
  where?: Maybe<Membership_Status_Bool_Exp>;
}

/** Ordering options when selecting data from "membership_status". */
export interface Membership_Status_Order_By {
  value?: Maybe<Order_By>;
}

/** primary key columns input for table: membership_status */
export interface Membership_Status_Pk_Columns_Input {
  value: Scalars['String'];
}

/** select columns of table "membership_status" */
export type Membership_Status_Select_Column =
  /** column name */
  | 'value';

/** input type for updating data in table "membership_status" */
export interface Membership_Status_Set_Input {
  value?: Maybe<Scalars['String']>;
}

/** update columns of table "membership_status" */
export type Membership_Status_Update_Column =
  /** column name */
  | 'value';

/** columns and relationships of "message" */
export interface Message {
  __typename?: 'message';
  content: Scalars['jsonb'];
  content_text?: Maybe<Scalars['String']>;
  created_at: Scalars['timestamptz'];
  id: Scalars['uuid'];
  is_draft: Scalars['Boolean'];
  /** An array relationship */
  message_attachments: Array<Attachment>;
  /** An aggregate relationship */
  message_attachments_aggregate: Attachment_Aggregate;
  /** An array relationship */
  message_reactions: Array<Message_Reaction>;
  /** An aggregate relationship */
  message_reactions_aggregate: Message_Reaction_Aggregate;
  /** An object relationship */
  message_type: Message_Type;
  /** An object relationship */
  replied_to_message?: Maybe<Message>;
  replied_to_message_id?: Maybe<Scalars['uuid']>;
  /** An array relationship */
  tasks: Array<Task>;
  /** An aggregate relationship */
  tasks_aggregate: Task_Aggregate;
  /** An object relationship */
  topic: Topic;
  topic_id: Scalars['uuid'];
  type: Message_Type_Enum;
  /** An object relationship */
  user: User;
  user_id: Scalars['uuid'];
}


/** columns and relationships of "message" */
export interface MessageContentArgs {
  path?: Maybe<Scalars['String']>;
}


/** columns and relationships of "message" */
export interface MessageMessage_AttachmentsArgs {
  distinct_on?: Maybe<Array<Attachment_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Attachment_Order_By>>;
  where?: Maybe<Attachment_Bool_Exp>;
}


/** columns and relationships of "message" */
export interface MessageMessage_Attachments_AggregateArgs {
  distinct_on?: Maybe<Array<Attachment_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Attachment_Order_By>>;
  where?: Maybe<Attachment_Bool_Exp>;
}


/** columns and relationships of "message" */
export interface MessageMessage_ReactionsArgs {
  distinct_on?: Maybe<Array<Message_Reaction_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Message_Reaction_Order_By>>;
  where?: Maybe<Message_Reaction_Bool_Exp>;
}


/** columns and relationships of "message" */
export interface MessageMessage_Reactions_AggregateArgs {
  distinct_on?: Maybe<Array<Message_Reaction_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Message_Reaction_Order_By>>;
  where?: Maybe<Message_Reaction_Bool_Exp>;
}


/** columns and relationships of "message" */
export interface MessageTasksArgs {
  distinct_on?: Maybe<Array<Task_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Task_Order_By>>;
  where?: Maybe<Task_Bool_Exp>;
}


/** columns and relationships of "message" */
export interface MessageTasks_AggregateArgs {
  distinct_on?: Maybe<Array<Task_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Task_Order_By>>;
  where?: Maybe<Task_Bool_Exp>;
}

/** aggregated selection of "message" */
export interface Message_Aggregate {
  __typename?: 'message_aggregate';
  aggregate?: Maybe<Message_Aggregate_Fields>;
  nodes: Array<Message>;
}

/** aggregate fields of "message" */
export interface Message_Aggregate_Fields {
  __typename?: 'message_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Message_Max_Fields>;
  min?: Maybe<Message_Min_Fields>;
}


/** aggregate fields of "message" */
export interface Message_Aggregate_FieldsCountArgs {
  columns?: Maybe<Array<Message_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
}

/** order by aggregate values of table "message" */
export interface Message_Aggregate_Order_By {
  count?: Maybe<Order_By>;
  max?: Maybe<Message_Max_Order_By>;
  min?: Maybe<Message_Min_Order_By>;
}

/** append existing jsonb value of filtered columns with new jsonb value */
export interface Message_Append_Input {
  content?: Maybe<Scalars['jsonb']>;
}

/** input type for inserting array relation for remote table "message" */
export interface Message_Arr_Rel_Insert_Input {
  data: Array<Message_Insert_Input>;
  /** on conflict condition */
  on_conflict?: Maybe<Message_On_Conflict>;
}

/** Boolean expression to filter rows from the table "message". All fields are combined with a logical 'AND'. */
export interface Message_Bool_Exp {
  _and?: Maybe<Array<Message_Bool_Exp>>;
  _not?: Maybe<Message_Bool_Exp>;
  _or?: Maybe<Array<Message_Bool_Exp>>;
  content?: Maybe<Jsonb_Comparison_Exp>;
  content_text?: Maybe<String_Comparison_Exp>;
  created_at?: Maybe<Timestamptz_Comparison_Exp>;
  id?: Maybe<Uuid_Comparison_Exp>;
  is_draft?: Maybe<Boolean_Comparison_Exp>;
  message_attachments?: Maybe<Attachment_Bool_Exp>;
  message_reactions?: Maybe<Message_Reaction_Bool_Exp>;
  message_type?: Maybe<Message_Type_Bool_Exp>;
  replied_to_message?: Maybe<Message_Bool_Exp>;
  replied_to_message_id?: Maybe<Uuid_Comparison_Exp>;
  tasks?: Maybe<Task_Bool_Exp>;
  topic?: Maybe<Topic_Bool_Exp>;
  topic_id?: Maybe<Uuid_Comparison_Exp>;
  type?: Maybe<Message_Type_Enum_Comparison_Exp>;
  user?: Maybe<User_Bool_Exp>;
  user_id?: Maybe<Uuid_Comparison_Exp>;
}

/** unique or primary key constraints on table "message" */
export type Message_Constraint =
  /** unique or primary key constraint */
  | 'message_id_key'
  /** unique or primary key constraint */
  | 'message_pkey';

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export interface Message_Delete_At_Path_Input {
  content?: Maybe<Array<Scalars['String']>>;
}

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export interface Message_Delete_Elem_Input {
  content?: Maybe<Scalars['Int']>;
}

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export interface Message_Delete_Key_Input {
  content?: Maybe<Scalars['String']>;
}

/** input type for inserting data into table "message" */
export interface Message_Insert_Input {
  content?: Maybe<Scalars['jsonb']>;
  content_text?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  is_draft?: Maybe<Scalars['Boolean']>;
  message_attachments?: Maybe<Attachment_Arr_Rel_Insert_Input>;
  message_reactions?: Maybe<Message_Reaction_Arr_Rel_Insert_Input>;
  message_type?: Maybe<Message_Type_Obj_Rel_Insert_Input>;
  replied_to_message?: Maybe<Message_Obj_Rel_Insert_Input>;
  replied_to_message_id?: Maybe<Scalars['uuid']>;
  tasks?: Maybe<Task_Arr_Rel_Insert_Input>;
  topic?: Maybe<Topic_Obj_Rel_Insert_Input>;
  topic_id?: Maybe<Scalars['uuid']>;
  type?: Maybe<Message_Type_Enum>;
  user?: Maybe<User_Obj_Rel_Insert_Input>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** aggregate max on columns */
export interface Message_Max_Fields {
  __typename?: 'message_max_fields';
  content_text?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  replied_to_message_id?: Maybe<Scalars['uuid']>;
  topic_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** order by max() on columns of table "message" */
export interface Message_Max_Order_By {
  content_text?: Maybe<Order_By>;
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  replied_to_message_id?: Maybe<Order_By>;
  topic_id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
}

/** aggregate min on columns */
export interface Message_Min_Fields {
  __typename?: 'message_min_fields';
  content_text?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  replied_to_message_id?: Maybe<Scalars['uuid']>;
  topic_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** order by min() on columns of table "message" */
export interface Message_Min_Order_By {
  content_text?: Maybe<Order_By>;
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  replied_to_message_id?: Maybe<Order_By>;
  topic_id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
}

/** response of any mutation on the table "message" */
export interface Message_Mutation_Response {
  __typename?: 'message_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Message>;
}

/** input type for inserting object relation for remote table "message" */
export interface Message_Obj_Rel_Insert_Input {
  data: Message_Insert_Input;
  /** on conflict condition */
  on_conflict?: Maybe<Message_On_Conflict>;
}

/** on conflict condition type for table "message" */
export interface Message_On_Conflict {
  constraint: Message_Constraint;
  update_columns?: Array<Message_Update_Column>;
  where?: Maybe<Message_Bool_Exp>;
}

/** Ordering options when selecting data from "message". */
export interface Message_Order_By {
  content?: Maybe<Order_By>;
  content_text?: Maybe<Order_By>;
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  is_draft?: Maybe<Order_By>;
  message_attachments_aggregate?: Maybe<Attachment_Aggregate_Order_By>;
  message_reactions_aggregate?: Maybe<Message_Reaction_Aggregate_Order_By>;
  message_type?: Maybe<Message_Type_Order_By>;
  replied_to_message?: Maybe<Message_Order_By>;
  replied_to_message_id?: Maybe<Order_By>;
  tasks_aggregate?: Maybe<Task_Aggregate_Order_By>;
  topic?: Maybe<Topic_Order_By>;
  topic_id?: Maybe<Order_By>;
  type?: Maybe<Order_By>;
  user?: Maybe<User_Order_By>;
  user_id?: Maybe<Order_By>;
}

/** primary key columns input for table: message */
export interface Message_Pk_Columns_Input {
  id: Scalars['uuid'];
}

/** prepend existing jsonb value of filtered columns with new jsonb value */
export interface Message_Prepend_Input {
  content?: Maybe<Scalars['jsonb']>;
}

/** columns and relationships of "message_reaction" */
export interface Message_Reaction {
  __typename?: 'message_reaction';
  emoji: Scalars['String'];
  /** An object relationship */
  message: Message;
  message_id: Scalars['uuid'];
  /** An object relationship */
  user: User;
  user_id: Scalars['uuid'];
}

/** aggregated selection of "message_reaction" */
export interface Message_Reaction_Aggregate {
  __typename?: 'message_reaction_aggregate';
  aggregate?: Maybe<Message_Reaction_Aggregate_Fields>;
  nodes: Array<Message_Reaction>;
}

/** aggregate fields of "message_reaction" */
export interface Message_Reaction_Aggregate_Fields {
  __typename?: 'message_reaction_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Message_Reaction_Max_Fields>;
  min?: Maybe<Message_Reaction_Min_Fields>;
}


/** aggregate fields of "message_reaction" */
export interface Message_Reaction_Aggregate_FieldsCountArgs {
  columns?: Maybe<Array<Message_Reaction_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
}

/** order by aggregate values of table "message_reaction" */
export interface Message_Reaction_Aggregate_Order_By {
  count?: Maybe<Order_By>;
  max?: Maybe<Message_Reaction_Max_Order_By>;
  min?: Maybe<Message_Reaction_Min_Order_By>;
}

/** input type for inserting array relation for remote table "message_reaction" */
export interface Message_Reaction_Arr_Rel_Insert_Input {
  data: Array<Message_Reaction_Insert_Input>;
  /** on conflict condition */
  on_conflict?: Maybe<Message_Reaction_On_Conflict>;
}

/** Boolean expression to filter rows from the table "message_reaction". All fields are combined with a logical 'AND'. */
export interface Message_Reaction_Bool_Exp {
  _and?: Maybe<Array<Message_Reaction_Bool_Exp>>;
  _not?: Maybe<Message_Reaction_Bool_Exp>;
  _or?: Maybe<Array<Message_Reaction_Bool_Exp>>;
  emoji?: Maybe<String_Comparison_Exp>;
  message?: Maybe<Message_Bool_Exp>;
  message_id?: Maybe<Uuid_Comparison_Exp>;
  user?: Maybe<User_Bool_Exp>;
  user_id?: Maybe<Uuid_Comparison_Exp>;
}

/** unique or primary key constraints on table "message_reaction" */
export type Message_Reaction_Constraint =
  /** unique or primary key constraint */
  | 'message_reaction_pkey';

/** input type for inserting data into table "message_reaction" */
export interface Message_Reaction_Insert_Input {
  emoji?: Maybe<Scalars['String']>;
  message?: Maybe<Message_Obj_Rel_Insert_Input>;
  message_id?: Maybe<Scalars['uuid']>;
  user?: Maybe<User_Obj_Rel_Insert_Input>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** aggregate max on columns */
export interface Message_Reaction_Max_Fields {
  __typename?: 'message_reaction_max_fields';
  emoji?: Maybe<Scalars['String']>;
  message_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** order by max() on columns of table "message_reaction" */
export interface Message_Reaction_Max_Order_By {
  emoji?: Maybe<Order_By>;
  message_id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
}

/** aggregate min on columns */
export interface Message_Reaction_Min_Fields {
  __typename?: 'message_reaction_min_fields';
  emoji?: Maybe<Scalars['String']>;
  message_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** order by min() on columns of table "message_reaction" */
export interface Message_Reaction_Min_Order_By {
  emoji?: Maybe<Order_By>;
  message_id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
}

/** response of any mutation on the table "message_reaction" */
export interface Message_Reaction_Mutation_Response {
  __typename?: 'message_reaction_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Message_Reaction>;
}

/** on conflict condition type for table "message_reaction" */
export interface Message_Reaction_On_Conflict {
  constraint: Message_Reaction_Constraint;
  update_columns?: Array<Message_Reaction_Update_Column>;
  where?: Maybe<Message_Reaction_Bool_Exp>;
}

/** Ordering options when selecting data from "message_reaction". */
export interface Message_Reaction_Order_By {
  emoji?: Maybe<Order_By>;
  message?: Maybe<Message_Order_By>;
  message_id?: Maybe<Order_By>;
  user?: Maybe<User_Order_By>;
  user_id?: Maybe<Order_By>;
}

/** primary key columns input for table: message_reaction */
export interface Message_Reaction_Pk_Columns_Input {
  emoji: Scalars['String'];
  message_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
}

/** select columns of table "message_reaction" */
export type Message_Reaction_Select_Column =
  /** column name */
  | 'emoji'
  /** column name */
  | 'message_id'
  /** column name */
  | 'user_id';

/** input type for updating data in table "message_reaction" */
export interface Message_Reaction_Set_Input {
  emoji?: Maybe<Scalars['String']>;
  message_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** update columns of table "message_reaction" */
export type Message_Reaction_Update_Column =
  /** column name */
  | 'emoji'
  /** column name */
  | 'message_id'
  /** column name */
  | 'user_id';

/** select columns of table "message" */
export type Message_Select_Column =
  /** column name */
  | 'content'
  /** column name */
  | 'content_text'
  /** column name */
  | 'created_at'
  /** column name */
  | 'id'
  /** column name */
  | 'is_draft'
  /** column name */
  | 'replied_to_message_id'
  /** column name */
  | 'topic_id'
  /** column name */
  | 'type'
  /** column name */
  | 'user_id';

/** input type for updating data in table "message" */
export interface Message_Set_Input {
  content?: Maybe<Scalars['jsonb']>;
  content_text?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  is_draft?: Maybe<Scalars['Boolean']>;
  replied_to_message_id?: Maybe<Scalars['uuid']>;
  topic_id?: Maybe<Scalars['uuid']>;
  type?: Maybe<Message_Type_Enum>;
  user_id?: Maybe<Scalars['uuid']>;
}

/**
 * Used as an ENUM for the message type field constraint.
 *
 *
 * columns and relationships of "message_type"
 */
export interface Message_Type {
  __typename?: 'message_type';
  value: Scalars['String'];
}

/** aggregated selection of "message_type" */
export interface Message_Type_Aggregate {
  __typename?: 'message_type_aggregate';
  aggregate?: Maybe<Message_Type_Aggregate_Fields>;
  nodes: Array<Message_Type>;
}

/** aggregate fields of "message_type" */
export interface Message_Type_Aggregate_Fields {
  __typename?: 'message_type_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Message_Type_Max_Fields>;
  min?: Maybe<Message_Type_Min_Fields>;
}


/** aggregate fields of "message_type" */
export interface Message_Type_Aggregate_FieldsCountArgs {
  columns?: Maybe<Array<Message_Type_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
}

/** Boolean expression to filter rows from the table "message_type". All fields are combined with a logical 'AND'. */
export interface Message_Type_Bool_Exp {
  _and?: Maybe<Array<Message_Type_Bool_Exp>>;
  _not?: Maybe<Message_Type_Bool_Exp>;
  _or?: Maybe<Array<Message_Type_Bool_Exp>>;
  value?: Maybe<String_Comparison_Exp>;
}

/** unique or primary key constraints on table "message_type" */
export type Message_Type_Constraint =
  /** unique or primary key constraint */
  | 'message_type_pkey';

export type Message_Type_Enum =
  | 'AUDIO'
  | 'FILE'
  | 'TEXT'
  | 'VIDEO';

/** Boolean expression to compare columns of type "message_type_enum". All fields are combined with logical 'AND'. */
export interface Message_Type_Enum_Comparison_Exp {
  _eq?: Maybe<Message_Type_Enum>;
  _in?: Maybe<Array<Message_Type_Enum>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _neq?: Maybe<Message_Type_Enum>;
  _nin?: Maybe<Array<Message_Type_Enum>>;
}

/** input type for inserting data into table "message_type" */
export interface Message_Type_Insert_Input {
  value?: Maybe<Scalars['String']>;
}

/** aggregate max on columns */
export interface Message_Type_Max_Fields {
  __typename?: 'message_type_max_fields';
  value?: Maybe<Scalars['String']>;
}

/** aggregate min on columns */
export interface Message_Type_Min_Fields {
  __typename?: 'message_type_min_fields';
  value?: Maybe<Scalars['String']>;
}

/** response of any mutation on the table "message_type" */
export interface Message_Type_Mutation_Response {
  __typename?: 'message_type_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Message_Type>;
}

/** input type for inserting object relation for remote table "message_type" */
export interface Message_Type_Obj_Rel_Insert_Input {
  data: Message_Type_Insert_Input;
  /** on conflict condition */
  on_conflict?: Maybe<Message_Type_On_Conflict>;
}

/** on conflict condition type for table "message_type" */
export interface Message_Type_On_Conflict {
  constraint: Message_Type_Constraint;
  update_columns?: Array<Message_Type_Update_Column>;
  where?: Maybe<Message_Type_Bool_Exp>;
}

/** Ordering options when selecting data from "message_type". */
export interface Message_Type_Order_By {
  value?: Maybe<Order_By>;
}

/** primary key columns input for table: message_type */
export interface Message_Type_Pk_Columns_Input {
  value: Scalars['String'];
}

/** select columns of table "message_type" */
export type Message_Type_Select_Column =
  /** column name */
  | 'value';

/** input type for updating data in table "message_type" */
export interface Message_Type_Set_Input {
  value?: Maybe<Scalars['String']>;
}

/** update columns of table "message_type" */
export type Message_Type_Update_Column =
  /** column name */
  | 'value';

/** update columns of table "message" */
export type Message_Update_Column =
  /** column name */
  | 'content'
  /** column name */
  | 'content_text'
  /** column name */
  | 'created_at'
  /** column name */
  | 'id'
  /** column name */
  | 'is_draft'
  /** column name */
  | 'replied_to_message_id'
  /** column name */
  | 'topic_id'
  /** column name */
  | 'type'
  /** column name */
  | 'user_id';

/** mutation root */
export interface Mutation_Root {
  __typename?: 'mutation_root';
  /** delete data from the table: "account" */
  delete_account?: Maybe<Account_Mutation_Response>;
  /** delete single row from the table: "account" */
  delete_account_by_pk?: Maybe<Account>;
  /** delete data from the table: "attachment" */
  delete_attachment?: Maybe<Attachment_Mutation_Response>;
  /** delete single row from the table: "attachment" */
  delete_attachment_by_pk?: Maybe<Attachment>;
  /** delete data from the table: "last_seen_message" */
  delete_last_seen_message?: Maybe<Last_Seen_Message_Mutation_Response>;
  /** delete single row from the table: "last_seen_message" */
  delete_last_seen_message_by_pk?: Maybe<Last_Seen_Message>;
  /** delete data from the table: "membership_status" */
  delete_membership_status?: Maybe<Membership_Status_Mutation_Response>;
  /** delete single row from the table: "membership_status" */
  delete_membership_status_by_pk?: Maybe<Membership_Status>;
  /** delete data from the table: "message" */
  delete_message?: Maybe<Message_Mutation_Response>;
  /** delete single row from the table: "message" */
  delete_message_by_pk?: Maybe<Message>;
  /** delete data from the table: "message_reaction" */
  delete_message_reaction?: Maybe<Message_Reaction_Mutation_Response>;
  /** delete single row from the table: "message_reaction" */
  delete_message_reaction_by_pk?: Maybe<Message_Reaction>;
  /** delete data from the table: "message_type" */
  delete_message_type?: Maybe<Message_Type_Mutation_Response>;
  /** delete single row from the table: "message_type" */
  delete_message_type_by_pk?: Maybe<Message_Type>;
  /** delete data from the table: "notification" */
  delete_notification?: Maybe<Notification_Mutation_Response>;
  /** delete single row from the table: "notification" */
  delete_notification_by_pk?: Maybe<Notification>;
  /** delete data from the table: "room" */
  delete_room?: Maybe<Room_Mutation_Response>;
  /** delete single row from the table: "room" */
  delete_room_by_pk?: Maybe<Room>;
  /** delete data from the table: "room_invitation" */
  delete_room_invitation?: Maybe<Room_Invitation_Mutation_Response>;
  /** delete single row from the table: "room_invitation" */
  delete_room_invitation_by_pk?: Maybe<Room_Invitation>;
  /** delete data from the table: "room_member" */
  delete_room_member?: Maybe<Room_Member_Mutation_Response>;
  /** delete single row from the table: "room_member" */
  delete_room_member_by_pk?: Maybe<Room_Member>;
  /** delete data from the table: "space" */
  delete_space?: Maybe<Space_Mutation_Response>;
  /** delete single row from the table: "space" */
  delete_space_by_pk?: Maybe<Space>;
  /** delete data from the table: "space_member" */
  delete_space_member?: Maybe<Space_Member_Mutation_Response>;
  /** delete single row from the table: "space_member" */
  delete_space_member_by_pk?: Maybe<Space_Member>;
  /** delete data from the table: "task" */
  delete_task?: Maybe<Task_Mutation_Response>;
  /** delete single row from the table: "task" */
  delete_task_by_pk?: Maybe<Task>;
  /** delete data from the table: "team" */
  delete_team?: Maybe<Team_Mutation_Response>;
  /** delete single row from the table: "team" */
  delete_team_by_pk?: Maybe<Team>;
  /** delete data from the table: "team_invitation" */
  delete_team_invitation?: Maybe<Team_Invitation_Mutation_Response>;
  /** delete single row from the table: "team_invitation" */
  delete_team_invitation_by_pk?: Maybe<Team_Invitation>;
  /** delete data from the table: "team_member" */
  delete_team_member?: Maybe<Team_Member_Mutation_Response>;
  /** delete single row from the table: "team_member" */
  delete_team_member_by_pk?: Maybe<Team_Member>;
  /** delete data from the table: "team_slack_installation" */
  delete_team_slack_installation?: Maybe<Team_Slack_Installation_Mutation_Response>;
  /** delete single row from the table: "team_slack_installation" */
  delete_team_slack_installation_by_pk?: Maybe<Team_Slack_Installation>;
  /** delete data from the table: "topic" */
  delete_topic?: Maybe<Topic_Mutation_Response>;
  /** delete single row from the table: "topic" */
  delete_topic_by_pk?: Maybe<Topic>;
  /** delete data from the table: "topic_member" */
  delete_topic_member?: Maybe<Topic_Member_Mutation_Response>;
  /** delete single row from the table: "topic_member" */
  delete_topic_member_by_pk?: Maybe<Topic_Member>;
  /** delete data from the table: "transcription" */
  delete_transcription?: Maybe<Transcription_Mutation_Response>;
  /** delete single row from the table: "transcription" */
  delete_transcription_by_pk?: Maybe<Transcription>;
  /** delete data from the table: "transcription_status" */
  delete_transcription_status?: Maybe<Transcription_Status_Mutation_Response>;
  /** delete single row from the table: "transcription_status" */
  delete_transcription_status_by_pk?: Maybe<Transcription_Status>;
  /** delete data from the table: "user" */
  delete_user?: Maybe<User_Mutation_Response>;
  /** delete single row from the table: "user" */
  delete_user_by_pk?: Maybe<User>;
  /** delete data from the table: "whitelist" */
  delete_whitelist?: Maybe<Whitelist_Mutation_Response>;
  /** delete single row from the table: "whitelist" */
  delete_whitelist_by_pk?: Maybe<Whitelist>;
  /** insert data into the table: "account" */
  insert_account?: Maybe<Account_Mutation_Response>;
  /** insert a single row into the table: "account" */
  insert_account_one?: Maybe<Account>;
  /** insert data into the table: "attachment" */
  insert_attachment?: Maybe<Attachment_Mutation_Response>;
  /** insert a single row into the table: "attachment" */
  insert_attachment_one?: Maybe<Attachment>;
  /** insert data into the table: "last_seen_message" */
  insert_last_seen_message?: Maybe<Last_Seen_Message_Mutation_Response>;
  /** insert a single row into the table: "last_seen_message" */
  insert_last_seen_message_one?: Maybe<Last_Seen_Message>;
  /** insert data into the table: "membership_status" */
  insert_membership_status?: Maybe<Membership_Status_Mutation_Response>;
  /** insert a single row into the table: "membership_status" */
  insert_membership_status_one?: Maybe<Membership_Status>;
  /** insert data into the table: "message" */
  insert_message?: Maybe<Message_Mutation_Response>;
  /** insert a single row into the table: "message" */
  insert_message_one?: Maybe<Message>;
  /** insert data into the table: "message_reaction" */
  insert_message_reaction?: Maybe<Message_Reaction_Mutation_Response>;
  /** insert a single row into the table: "message_reaction" */
  insert_message_reaction_one?: Maybe<Message_Reaction>;
  /** insert data into the table: "message_type" */
  insert_message_type?: Maybe<Message_Type_Mutation_Response>;
  /** insert a single row into the table: "message_type" */
  insert_message_type_one?: Maybe<Message_Type>;
  /** insert data into the table: "notification" */
  insert_notification?: Maybe<Notification_Mutation_Response>;
  /** insert a single row into the table: "notification" */
  insert_notification_one?: Maybe<Notification>;
  /** insert data into the table: "room" */
  insert_room?: Maybe<Room_Mutation_Response>;
  /** insert data into the table: "room_invitation" */
  insert_room_invitation?: Maybe<Room_Invitation_Mutation_Response>;
  /** insert a single row into the table: "room_invitation" */
  insert_room_invitation_one?: Maybe<Room_Invitation>;
  /** insert data into the table: "room_member" */
  insert_room_member?: Maybe<Room_Member_Mutation_Response>;
  /** insert a single row into the table: "room_member" */
  insert_room_member_one?: Maybe<Room_Member>;
  /** insert a single row into the table: "room" */
  insert_room_one?: Maybe<Room>;
  /** insert data into the table: "space" */
  insert_space?: Maybe<Space_Mutation_Response>;
  /** insert data into the table: "space_member" */
  insert_space_member?: Maybe<Space_Member_Mutation_Response>;
  /** insert a single row into the table: "space_member" */
  insert_space_member_one?: Maybe<Space_Member>;
  /** insert a single row into the table: "space" */
  insert_space_one?: Maybe<Space>;
  /** insert data into the table: "task" */
  insert_task?: Maybe<Task_Mutation_Response>;
  /** insert a single row into the table: "task" */
  insert_task_one?: Maybe<Task>;
  /** insert data into the table: "team" */
  insert_team?: Maybe<Team_Mutation_Response>;
  /** insert data into the table: "team_invitation" */
  insert_team_invitation?: Maybe<Team_Invitation_Mutation_Response>;
  /** insert a single row into the table: "team_invitation" */
  insert_team_invitation_one?: Maybe<Team_Invitation>;
  /** insert data into the table: "team_member" */
  insert_team_member?: Maybe<Team_Member_Mutation_Response>;
  /** insert a single row into the table: "team_member" */
  insert_team_member_one?: Maybe<Team_Member>;
  /** insert a single row into the table: "team" */
  insert_team_one?: Maybe<Team>;
  /** insert data into the table: "team_slack_installation" */
  insert_team_slack_installation?: Maybe<Team_Slack_Installation_Mutation_Response>;
  /** insert a single row into the table: "team_slack_installation" */
  insert_team_slack_installation_one?: Maybe<Team_Slack_Installation>;
  /** insert data into the table: "topic" */
  insert_topic?: Maybe<Topic_Mutation_Response>;
  /** insert data into the table: "topic_member" */
  insert_topic_member?: Maybe<Topic_Member_Mutation_Response>;
  /** insert a single row into the table: "topic_member" */
  insert_topic_member_one?: Maybe<Topic_Member>;
  /** insert a single row into the table: "topic" */
  insert_topic_one?: Maybe<Topic>;
  /** insert data into the table: "transcription" */
  insert_transcription?: Maybe<Transcription_Mutation_Response>;
  /** insert a single row into the table: "transcription" */
  insert_transcription_one?: Maybe<Transcription>;
  /** insert data into the table: "transcription_status" */
  insert_transcription_status?: Maybe<Transcription_Status_Mutation_Response>;
  /** insert a single row into the table: "transcription_status" */
  insert_transcription_status_one?: Maybe<Transcription_Status>;
  /** insert data into the table: "user" */
  insert_user?: Maybe<User_Mutation_Response>;
  /** insert a single row into the table: "user" */
  insert_user_one?: Maybe<User>;
  /** insert data into the table: "whitelist" */
  insert_whitelist?: Maybe<Whitelist_Mutation_Response>;
  /** insert a single row into the table: "whitelist" */
  insert_whitelist_one?: Maybe<Whitelist>;
  resend_invitation?: Maybe<ResendInvitationResponse>;
  /** update data of the table: "account" */
  update_account?: Maybe<Account_Mutation_Response>;
  /** update single row of the table: "account" */
  update_account_by_pk?: Maybe<Account>;
  /** update data of the table: "attachment" */
  update_attachment?: Maybe<Attachment_Mutation_Response>;
  /** update single row of the table: "attachment" */
  update_attachment_by_pk?: Maybe<Attachment>;
  /** update data of the table: "last_seen_message" */
  update_last_seen_message?: Maybe<Last_Seen_Message_Mutation_Response>;
  /** update single row of the table: "last_seen_message" */
  update_last_seen_message_by_pk?: Maybe<Last_Seen_Message>;
  /** update data of the table: "membership_status" */
  update_membership_status?: Maybe<Membership_Status_Mutation_Response>;
  /** update single row of the table: "membership_status" */
  update_membership_status_by_pk?: Maybe<Membership_Status>;
  /** update data of the table: "message" */
  update_message?: Maybe<Message_Mutation_Response>;
  /** update single row of the table: "message" */
  update_message_by_pk?: Maybe<Message>;
  /** update data of the table: "message_reaction" */
  update_message_reaction?: Maybe<Message_Reaction_Mutation_Response>;
  /** update single row of the table: "message_reaction" */
  update_message_reaction_by_pk?: Maybe<Message_Reaction>;
  /** update data of the table: "message_type" */
  update_message_type?: Maybe<Message_Type_Mutation_Response>;
  /** update single row of the table: "message_type" */
  update_message_type_by_pk?: Maybe<Message_Type>;
  /** update data of the table: "notification" */
  update_notification?: Maybe<Notification_Mutation_Response>;
  /** update single row of the table: "notification" */
  update_notification_by_pk?: Maybe<Notification>;
  /** update data of the table: "room" */
  update_room?: Maybe<Room_Mutation_Response>;
  /** update single row of the table: "room" */
  update_room_by_pk?: Maybe<Room>;
  /** update data of the table: "room_invitation" */
  update_room_invitation?: Maybe<Room_Invitation_Mutation_Response>;
  /** update single row of the table: "room_invitation" */
  update_room_invitation_by_pk?: Maybe<Room_Invitation>;
  /** update data of the table: "room_member" */
  update_room_member?: Maybe<Room_Member_Mutation_Response>;
  /** update single row of the table: "room_member" */
  update_room_member_by_pk?: Maybe<Room_Member>;
  /** update data of the table: "space" */
  update_space?: Maybe<Space_Mutation_Response>;
  /** update single row of the table: "space" */
  update_space_by_pk?: Maybe<Space>;
  /** update data of the table: "space_member" */
  update_space_member?: Maybe<Space_Member_Mutation_Response>;
  /** update single row of the table: "space_member" */
  update_space_member_by_pk?: Maybe<Space_Member>;
  /** update data of the table: "task" */
  update_task?: Maybe<Task_Mutation_Response>;
  /** update single row of the table: "task" */
  update_task_by_pk?: Maybe<Task>;
  /** update data of the table: "team" */
  update_team?: Maybe<Team_Mutation_Response>;
  /** update single row of the table: "team" */
  update_team_by_pk?: Maybe<Team>;
  /** update data of the table: "team_invitation" */
  update_team_invitation?: Maybe<Team_Invitation_Mutation_Response>;
  /** update single row of the table: "team_invitation" */
  update_team_invitation_by_pk?: Maybe<Team_Invitation>;
  /** update data of the table: "team_member" */
  update_team_member?: Maybe<Team_Member_Mutation_Response>;
  /** update single row of the table: "team_member" */
  update_team_member_by_pk?: Maybe<Team_Member>;
  /** update data of the table: "team_slack_installation" */
  update_team_slack_installation?: Maybe<Team_Slack_Installation_Mutation_Response>;
  /** update single row of the table: "team_slack_installation" */
  update_team_slack_installation_by_pk?: Maybe<Team_Slack_Installation>;
  /** update data of the table: "topic" */
  update_topic?: Maybe<Topic_Mutation_Response>;
  /** update single row of the table: "topic" */
  update_topic_by_pk?: Maybe<Topic>;
  /** update data of the table: "topic_member" */
  update_topic_member?: Maybe<Topic_Member_Mutation_Response>;
  /** update single row of the table: "topic_member" */
  update_topic_member_by_pk?: Maybe<Topic_Member>;
  /** update data of the table: "transcription" */
  update_transcription?: Maybe<Transcription_Mutation_Response>;
  /** update single row of the table: "transcription" */
  update_transcription_by_pk?: Maybe<Transcription>;
  /** update data of the table: "transcription_status" */
  update_transcription_status?: Maybe<Transcription_Status_Mutation_Response>;
  /** update single row of the table: "transcription_status" */
  update_transcription_status_by_pk?: Maybe<Transcription_Status>;
  /** update data of the table: "user" */
  update_user?: Maybe<User_Mutation_Response>;
  /** update single row of the table: "user" */
  update_user_by_pk?: Maybe<User>;
  /** update data of the table: "whitelist" */
  update_whitelist?: Maybe<Whitelist_Mutation_Response>;
  /** update single row of the table: "whitelist" */
  update_whitelist_by_pk?: Maybe<Whitelist>;
  upgrade_current_user?: Maybe<UpgradeUserResponse>;
}


/** mutation root */
export interface Mutation_RootDelete_AccountArgs {
  where: Account_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootDelete_Account_By_PkArgs {
  id: Scalars['uuid'];
}


/** mutation root */
export interface Mutation_RootDelete_AttachmentArgs {
  where: Attachment_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootDelete_Attachment_By_PkArgs {
  id: Scalars['uuid'];
}


/** mutation root */
export interface Mutation_RootDelete_Last_Seen_MessageArgs {
  where: Last_Seen_Message_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootDelete_Last_Seen_Message_By_PkArgs {
  topic_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
}


/** mutation root */
export interface Mutation_RootDelete_Membership_StatusArgs {
  where: Membership_Status_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootDelete_Membership_Status_By_PkArgs {
  value: Scalars['String'];
}


/** mutation root */
export interface Mutation_RootDelete_MessageArgs {
  where: Message_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootDelete_Message_By_PkArgs {
  id: Scalars['uuid'];
}


/** mutation root */
export interface Mutation_RootDelete_Message_ReactionArgs {
  where: Message_Reaction_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootDelete_Message_Reaction_By_PkArgs {
  emoji: Scalars['String'];
  message_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
}


/** mutation root */
export interface Mutation_RootDelete_Message_TypeArgs {
  where: Message_Type_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootDelete_Message_Type_By_PkArgs {
  value: Scalars['String'];
}


/** mutation root */
export interface Mutation_RootDelete_NotificationArgs {
  where: Notification_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootDelete_Notification_By_PkArgs {
  id: Scalars['uuid'];
}


/** mutation root */
export interface Mutation_RootDelete_RoomArgs {
  where: Room_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootDelete_Room_By_PkArgs {
  id: Scalars['uuid'];
}


/** mutation root */
export interface Mutation_RootDelete_Room_InvitationArgs {
  where: Room_Invitation_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootDelete_Room_Invitation_By_PkArgs {
  id: Scalars['uuid'];
}


/** mutation root */
export interface Mutation_RootDelete_Room_MemberArgs {
  where: Room_Member_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootDelete_Room_Member_By_PkArgs {
  room_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
}


/** mutation root */
export interface Mutation_RootDelete_SpaceArgs {
  where: Space_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootDelete_Space_By_PkArgs {
  id: Scalars['uuid'];
}


/** mutation root */
export interface Mutation_RootDelete_Space_MemberArgs {
  where: Space_Member_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootDelete_Space_Member_By_PkArgs {
  space_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
}


/** mutation root */
export interface Mutation_RootDelete_TaskArgs {
  where: Task_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootDelete_Task_By_PkArgs {
  id: Scalars['uuid'];
}


/** mutation root */
export interface Mutation_RootDelete_TeamArgs {
  where: Team_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootDelete_Team_By_PkArgs {
  id: Scalars['uuid'];
}


/** mutation root */
export interface Mutation_RootDelete_Team_InvitationArgs {
  where: Team_Invitation_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootDelete_Team_Invitation_By_PkArgs {
  id: Scalars['uuid'];
}


/** mutation root */
export interface Mutation_RootDelete_Team_MemberArgs {
  where: Team_Member_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootDelete_Team_Member_By_PkArgs {
  team_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
}


/** mutation root */
export interface Mutation_RootDelete_Team_Slack_InstallationArgs {
  where: Team_Slack_Installation_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootDelete_Team_Slack_Installation_By_PkArgs {
  team_id: Scalars['uuid'];
}


/** mutation root */
export interface Mutation_RootDelete_TopicArgs {
  where: Topic_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootDelete_Topic_By_PkArgs {
  id: Scalars['uuid'];
}


/** mutation root */
export interface Mutation_RootDelete_Topic_MemberArgs {
  where: Topic_Member_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootDelete_Topic_Member_By_PkArgs {
  topic_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
}


/** mutation root */
export interface Mutation_RootDelete_TranscriptionArgs {
  where: Transcription_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootDelete_Transcription_By_PkArgs {
  id: Scalars['uuid'];
}


/** mutation root */
export interface Mutation_RootDelete_Transcription_StatusArgs {
  where: Transcription_Status_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootDelete_Transcription_Status_By_PkArgs {
  value: Scalars['String'];
}


/** mutation root */
export interface Mutation_RootDelete_UserArgs {
  where: User_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootDelete_User_By_PkArgs {
  id: Scalars['uuid'];
}


/** mutation root */
export interface Mutation_RootDelete_WhitelistArgs {
  where: Whitelist_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootDelete_Whitelist_By_PkArgs {
  email: Scalars['String'];
}


/** mutation root */
export interface Mutation_RootInsert_AccountArgs {
  objects: Array<Account_Insert_Input>;
  on_conflict?: Maybe<Account_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootInsert_Account_OneArgs {
  object: Account_Insert_Input;
  on_conflict?: Maybe<Account_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootInsert_AttachmentArgs {
  objects: Array<Attachment_Insert_Input>;
  on_conflict?: Maybe<Attachment_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootInsert_Attachment_OneArgs {
  object: Attachment_Insert_Input;
  on_conflict?: Maybe<Attachment_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootInsert_Last_Seen_MessageArgs {
  objects: Array<Last_Seen_Message_Insert_Input>;
  on_conflict?: Maybe<Last_Seen_Message_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootInsert_Last_Seen_Message_OneArgs {
  object: Last_Seen_Message_Insert_Input;
  on_conflict?: Maybe<Last_Seen_Message_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootInsert_Membership_StatusArgs {
  objects: Array<Membership_Status_Insert_Input>;
  on_conflict?: Maybe<Membership_Status_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootInsert_Membership_Status_OneArgs {
  object: Membership_Status_Insert_Input;
  on_conflict?: Maybe<Membership_Status_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootInsert_MessageArgs {
  objects: Array<Message_Insert_Input>;
  on_conflict?: Maybe<Message_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootInsert_Message_OneArgs {
  object: Message_Insert_Input;
  on_conflict?: Maybe<Message_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootInsert_Message_ReactionArgs {
  objects: Array<Message_Reaction_Insert_Input>;
  on_conflict?: Maybe<Message_Reaction_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootInsert_Message_Reaction_OneArgs {
  object: Message_Reaction_Insert_Input;
  on_conflict?: Maybe<Message_Reaction_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootInsert_Message_TypeArgs {
  objects: Array<Message_Type_Insert_Input>;
  on_conflict?: Maybe<Message_Type_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootInsert_Message_Type_OneArgs {
  object: Message_Type_Insert_Input;
  on_conflict?: Maybe<Message_Type_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootInsert_NotificationArgs {
  objects: Array<Notification_Insert_Input>;
  on_conflict?: Maybe<Notification_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootInsert_Notification_OneArgs {
  object: Notification_Insert_Input;
  on_conflict?: Maybe<Notification_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootInsert_RoomArgs {
  objects: Array<Room_Insert_Input>;
  on_conflict?: Maybe<Room_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootInsert_Room_InvitationArgs {
  objects: Array<Room_Invitation_Insert_Input>;
  on_conflict?: Maybe<Room_Invitation_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootInsert_Room_Invitation_OneArgs {
  object: Room_Invitation_Insert_Input;
  on_conflict?: Maybe<Room_Invitation_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootInsert_Room_MemberArgs {
  objects: Array<Room_Member_Insert_Input>;
  on_conflict?: Maybe<Room_Member_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootInsert_Room_Member_OneArgs {
  object: Room_Member_Insert_Input;
  on_conflict?: Maybe<Room_Member_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootInsert_Room_OneArgs {
  object: Room_Insert_Input;
  on_conflict?: Maybe<Room_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootInsert_SpaceArgs {
  objects: Array<Space_Insert_Input>;
  on_conflict?: Maybe<Space_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootInsert_Space_MemberArgs {
  objects: Array<Space_Member_Insert_Input>;
  on_conflict?: Maybe<Space_Member_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootInsert_Space_Member_OneArgs {
  object: Space_Member_Insert_Input;
  on_conflict?: Maybe<Space_Member_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootInsert_Space_OneArgs {
  object: Space_Insert_Input;
  on_conflict?: Maybe<Space_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootInsert_TaskArgs {
  objects: Array<Task_Insert_Input>;
  on_conflict?: Maybe<Task_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootInsert_Task_OneArgs {
  object: Task_Insert_Input;
  on_conflict?: Maybe<Task_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootInsert_TeamArgs {
  objects: Array<Team_Insert_Input>;
  on_conflict?: Maybe<Team_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootInsert_Team_InvitationArgs {
  objects: Array<Team_Invitation_Insert_Input>;
  on_conflict?: Maybe<Team_Invitation_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootInsert_Team_Invitation_OneArgs {
  object: Team_Invitation_Insert_Input;
  on_conflict?: Maybe<Team_Invitation_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootInsert_Team_MemberArgs {
  objects: Array<Team_Member_Insert_Input>;
  on_conflict?: Maybe<Team_Member_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootInsert_Team_Member_OneArgs {
  object: Team_Member_Insert_Input;
  on_conflict?: Maybe<Team_Member_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootInsert_Team_OneArgs {
  object: Team_Insert_Input;
  on_conflict?: Maybe<Team_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootInsert_Team_Slack_InstallationArgs {
  objects: Array<Team_Slack_Installation_Insert_Input>;
  on_conflict?: Maybe<Team_Slack_Installation_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootInsert_Team_Slack_Installation_OneArgs {
  object: Team_Slack_Installation_Insert_Input;
  on_conflict?: Maybe<Team_Slack_Installation_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootInsert_TopicArgs {
  objects: Array<Topic_Insert_Input>;
  on_conflict?: Maybe<Topic_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootInsert_Topic_MemberArgs {
  objects: Array<Topic_Member_Insert_Input>;
  on_conflict?: Maybe<Topic_Member_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootInsert_Topic_Member_OneArgs {
  object: Topic_Member_Insert_Input;
  on_conflict?: Maybe<Topic_Member_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootInsert_Topic_OneArgs {
  object: Topic_Insert_Input;
  on_conflict?: Maybe<Topic_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootInsert_TranscriptionArgs {
  objects: Array<Transcription_Insert_Input>;
  on_conflict?: Maybe<Transcription_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootInsert_Transcription_OneArgs {
  object: Transcription_Insert_Input;
  on_conflict?: Maybe<Transcription_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootInsert_Transcription_StatusArgs {
  objects: Array<Transcription_Status_Insert_Input>;
  on_conflict?: Maybe<Transcription_Status_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootInsert_Transcription_Status_OneArgs {
  object: Transcription_Status_Insert_Input;
  on_conflict?: Maybe<Transcription_Status_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootInsert_UserArgs {
  objects: Array<User_Insert_Input>;
  on_conflict?: Maybe<User_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootInsert_User_OneArgs {
  object: User_Insert_Input;
  on_conflict?: Maybe<User_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootInsert_WhitelistArgs {
  objects: Array<Whitelist_Insert_Input>;
  on_conflict?: Maybe<Whitelist_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootInsert_Whitelist_OneArgs {
  object: Whitelist_Insert_Input;
  on_conflict?: Maybe<Whitelist_On_Conflict>;
}


/** mutation root */
export interface Mutation_RootResend_InvitationArgs {
  invitation_id: Scalars['ID'];
}


/** mutation root */
export interface Mutation_RootUpdate_AccountArgs {
  _set?: Maybe<Account_Set_Input>;
  where: Account_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootUpdate_Account_By_PkArgs {
  _set?: Maybe<Account_Set_Input>;
  pk_columns: Account_Pk_Columns_Input;
}


/** mutation root */
export interface Mutation_RootUpdate_AttachmentArgs {
  _set?: Maybe<Attachment_Set_Input>;
  where: Attachment_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootUpdate_Attachment_By_PkArgs {
  _set?: Maybe<Attachment_Set_Input>;
  pk_columns: Attachment_Pk_Columns_Input;
}


/** mutation root */
export interface Mutation_RootUpdate_Last_Seen_MessageArgs {
  _set?: Maybe<Last_Seen_Message_Set_Input>;
  where: Last_Seen_Message_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootUpdate_Last_Seen_Message_By_PkArgs {
  _set?: Maybe<Last_Seen_Message_Set_Input>;
  pk_columns: Last_Seen_Message_Pk_Columns_Input;
}


/** mutation root */
export interface Mutation_RootUpdate_Membership_StatusArgs {
  _set?: Maybe<Membership_Status_Set_Input>;
  where: Membership_Status_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootUpdate_Membership_Status_By_PkArgs {
  _set?: Maybe<Membership_Status_Set_Input>;
  pk_columns: Membership_Status_Pk_Columns_Input;
}


/** mutation root */
export interface Mutation_RootUpdate_MessageArgs {
  _append?: Maybe<Message_Append_Input>;
  _delete_at_path?: Maybe<Message_Delete_At_Path_Input>;
  _delete_elem?: Maybe<Message_Delete_Elem_Input>;
  _delete_key?: Maybe<Message_Delete_Key_Input>;
  _prepend?: Maybe<Message_Prepend_Input>;
  _set?: Maybe<Message_Set_Input>;
  where: Message_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootUpdate_Message_By_PkArgs {
  _append?: Maybe<Message_Append_Input>;
  _delete_at_path?: Maybe<Message_Delete_At_Path_Input>;
  _delete_elem?: Maybe<Message_Delete_Elem_Input>;
  _delete_key?: Maybe<Message_Delete_Key_Input>;
  _prepend?: Maybe<Message_Prepend_Input>;
  _set?: Maybe<Message_Set_Input>;
  pk_columns: Message_Pk_Columns_Input;
}


/** mutation root */
export interface Mutation_RootUpdate_Message_ReactionArgs {
  _set?: Maybe<Message_Reaction_Set_Input>;
  where: Message_Reaction_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootUpdate_Message_Reaction_By_PkArgs {
  _set?: Maybe<Message_Reaction_Set_Input>;
  pk_columns: Message_Reaction_Pk_Columns_Input;
}


/** mutation root */
export interface Mutation_RootUpdate_Message_TypeArgs {
  _set?: Maybe<Message_Type_Set_Input>;
  where: Message_Type_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootUpdate_Message_Type_By_PkArgs {
  _set?: Maybe<Message_Type_Set_Input>;
  pk_columns: Message_Type_Pk_Columns_Input;
}


/** mutation root */
export interface Mutation_RootUpdate_NotificationArgs {
  _append?: Maybe<Notification_Append_Input>;
  _delete_at_path?: Maybe<Notification_Delete_At_Path_Input>;
  _delete_elem?: Maybe<Notification_Delete_Elem_Input>;
  _delete_key?: Maybe<Notification_Delete_Key_Input>;
  _prepend?: Maybe<Notification_Prepend_Input>;
  _set?: Maybe<Notification_Set_Input>;
  where: Notification_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootUpdate_Notification_By_PkArgs {
  _append?: Maybe<Notification_Append_Input>;
  _delete_at_path?: Maybe<Notification_Delete_At_Path_Input>;
  _delete_elem?: Maybe<Notification_Delete_Elem_Input>;
  _delete_key?: Maybe<Notification_Delete_Key_Input>;
  _prepend?: Maybe<Notification_Prepend_Input>;
  _set?: Maybe<Notification_Set_Input>;
  pk_columns: Notification_Pk_Columns_Input;
}


/** mutation root */
export interface Mutation_RootUpdate_RoomArgs {
  _inc?: Maybe<Room_Inc_Input>;
  _set?: Maybe<Room_Set_Input>;
  where: Room_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootUpdate_Room_By_PkArgs {
  _inc?: Maybe<Room_Inc_Input>;
  _set?: Maybe<Room_Set_Input>;
  pk_columns: Room_Pk_Columns_Input;
}


/** mutation root */
export interface Mutation_RootUpdate_Room_InvitationArgs {
  _set?: Maybe<Room_Invitation_Set_Input>;
  where: Room_Invitation_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootUpdate_Room_Invitation_By_PkArgs {
  _set?: Maybe<Room_Invitation_Set_Input>;
  pk_columns: Room_Invitation_Pk_Columns_Input;
}


/** mutation root */
export interface Mutation_RootUpdate_Room_MemberArgs {
  _set?: Maybe<Room_Member_Set_Input>;
  where: Room_Member_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootUpdate_Room_Member_By_PkArgs {
  _set?: Maybe<Room_Member_Set_Input>;
  pk_columns: Room_Member_Pk_Columns_Input;
}


/** mutation root */
export interface Mutation_RootUpdate_SpaceArgs {
  _set?: Maybe<Space_Set_Input>;
  where: Space_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootUpdate_Space_By_PkArgs {
  _set?: Maybe<Space_Set_Input>;
  pk_columns: Space_Pk_Columns_Input;
}


/** mutation root */
export interface Mutation_RootUpdate_Space_MemberArgs {
  _set?: Maybe<Space_Member_Set_Input>;
  where: Space_Member_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootUpdate_Space_Member_By_PkArgs {
  _set?: Maybe<Space_Member_Set_Input>;
  pk_columns: Space_Member_Pk_Columns_Input;
}


/** mutation root */
export interface Mutation_RootUpdate_TaskArgs {
  _set?: Maybe<Task_Set_Input>;
  where: Task_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootUpdate_Task_By_PkArgs {
  _set?: Maybe<Task_Set_Input>;
  pk_columns: Task_Pk_Columns_Input;
}


/** mutation root */
export interface Mutation_RootUpdate_TeamArgs {
  _set?: Maybe<Team_Set_Input>;
  where: Team_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootUpdate_Team_By_PkArgs {
  _set?: Maybe<Team_Set_Input>;
  pk_columns: Team_Pk_Columns_Input;
}


/** mutation root */
export interface Mutation_RootUpdate_Team_InvitationArgs {
  _set?: Maybe<Team_Invitation_Set_Input>;
  where: Team_Invitation_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootUpdate_Team_Invitation_By_PkArgs {
  _set?: Maybe<Team_Invitation_Set_Input>;
  pk_columns: Team_Invitation_Pk_Columns_Input;
}


/** mutation root */
export interface Mutation_RootUpdate_Team_MemberArgs {
  _set?: Maybe<Team_Member_Set_Input>;
  where: Team_Member_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootUpdate_Team_Member_By_PkArgs {
  _set?: Maybe<Team_Member_Set_Input>;
  pk_columns: Team_Member_Pk_Columns_Input;
}


/** mutation root */
export interface Mutation_RootUpdate_Team_Slack_InstallationArgs {
  _append?: Maybe<Team_Slack_Installation_Append_Input>;
  _delete_at_path?: Maybe<Team_Slack_Installation_Delete_At_Path_Input>;
  _delete_elem?: Maybe<Team_Slack_Installation_Delete_Elem_Input>;
  _delete_key?: Maybe<Team_Slack_Installation_Delete_Key_Input>;
  _prepend?: Maybe<Team_Slack_Installation_Prepend_Input>;
  _set?: Maybe<Team_Slack_Installation_Set_Input>;
  where: Team_Slack_Installation_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootUpdate_Team_Slack_Installation_By_PkArgs {
  _append?: Maybe<Team_Slack_Installation_Append_Input>;
  _delete_at_path?: Maybe<Team_Slack_Installation_Delete_At_Path_Input>;
  _delete_elem?: Maybe<Team_Slack_Installation_Delete_Elem_Input>;
  _delete_key?: Maybe<Team_Slack_Installation_Delete_Key_Input>;
  _prepend?: Maybe<Team_Slack_Installation_Prepend_Input>;
  _set?: Maybe<Team_Slack_Installation_Set_Input>;
  pk_columns: Team_Slack_Installation_Pk_Columns_Input;
}


/** mutation root */
export interface Mutation_RootUpdate_TopicArgs {
  _set?: Maybe<Topic_Set_Input>;
  where: Topic_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootUpdate_Topic_By_PkArgs {
  _set?: Maybe<Topic_Set_Input>;
  pk_columns: Topic_Pk_Columns_Input;
}


/** mutation root */
export interface Mutation_RootUpdate_Topic_MemberArgs {
  _set?: Maybe<Topic_Member_Set_Input>;
  where: Topic_Member_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootUpdate_Topic_Member_By_PkArgs {
  _set?: Maybe<Topic_Member_Set_Input>;
  pk_columns: Topic_Member_Pk_Columns_Input;
}


/** mutation root */
export interface Mutation_RootUpdate_TranscriptionArgs {
  _append?: Maybe<Transcription_Append_Input>;
  _delete_at_path?: Maybe<Transcription_Delete_At_Path_Input>;
  _delete_elem?: Maybe<Transcription_Delete_Elem_Input>;
  _delete_key?: Maybe<Transcription_Delete_Key_Input>;
  _prepend?: Maybe<Transcription_Prepend_Input>;
  _set?: Maybe<Transcription_Set_Input>;
  where: Transcription_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootUpdate_Transcription_By_PkArgs {
  _append?: Maybe<Transcription_Append_Input>;
  _delete_at_path?: Maybe<Transcription_Delete_At_Path_Input>;
  _delete_elem?: Maybe<Transcription_Delete_Elem_Input>;
  _delete_key?: Maybe<Transcription_Delete_Key_Input>;
  _prepend?: Maybe<Transcription_Prepend_Input>;
  _set?: Maybe<Transcription_Set_Input>;
  pk_columns: Transcription_Pk_Columns_Input;
}


/** mutation root */
export interface Mutation_RootUpdate_Transcription_StatusArgs {
  _set?: Maybe<Transcription_Status_Set_Input>;
  where: Transcription_Status_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootUpdate_Transcription_Status_By_PkArgs {
  _set?: Maybe<Transcription_Status_Set_Input>;
  pk_columns: Transcription_Status_Pk_Columns_Input;
}


/** mutation root */
export interface Mutation_RootUpdate_UserArgs {
  _set?: Maybe<User_Set_Input>;
  where: User_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootUpdate_User_By_PkArgs {
  _set?: Maybe<User_Set_Input>;
  pk_columns: User_Pk_Columns_Input;
}


/** mutation root */
export interface Mutation_RootUpdate_WhitelistArgs {
  _set?: Maybe<Whitelist_Set_Input>;
  where: Whitelist_Bool_Exp;
}


/** mutation root */
export interface Mutation_RootUpdate_Whitelist_By_PkArgs {
  _set?: Maybe<Whitelist_Set_Input>;
  pk_columns: Whitelist_Pk_Columns_Input;
}

/** columns and relationships of "notification" */
export interface Notification {
  __typename?: 'notification';
  created_at: Scalars['timestamptz'];
  data: Scalars['jsonb'];
  id: Scalars['uuid'];
  read_at?: Maybe<Scalars['timestamptz']>;
  updated_at: Scalars['timestamptz'];
  /** An object relationship */
  user: User;
  user_id: Scalars['uuid'];
}


/** columns and relationships of "notification" */
export interface NotificationDataArgs {
  path?: Maybe<Scalars['String']>;
}

/** aggregated selection of "notification" */
export interface Notification_Aggregate {
  __typename?: 'notification_aggregate';
  aggregate?: Maybe<Notification_Aggregate_Fields>;
  nodes: Array<Notification>;
}

/** aggregate fields of "notification" */
export interface Notification_Aggregate_Fields {
  __typename?: 'notification_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Notification_Max_Fields>;
  min?: Maybe<Notification_Min_Fields>;
}


/** aggregate fields of "notification" */
export interface Notification_Aggregate_FieldsCountArgs {
  columns?: Maybe<Array<Notification_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
}

/** order by aggregate values of table "notification" */
export interface Notification_Aggregate_Order_By {
  count?: Maybe<Order_By>;
  max?: Maybe<Notification_Max_Order_By>;
  min?: Maybe<Notification_Min_Order_By>;
}

/** append existing jsonb value of filtered columns with new jsonb value */
export interface Notification_Append_Input {
  data?: Maybe<Scalars['jsonb']>;
}

/** input type for inserting array relation for remote table "notification" */
export interface Notification_Arr_Rel_Insert_Input {
  data: Array<Notification_Insert_Input>;
  /** on conflict condition */
  on_conflict?: Maybe<Notification_On_Conflict>;
}

/** Boolean expression to filter rows from the table "notification". All fields are combined with a logical 'AND'. */
export interface Notification_Bool_Exp {
  _and?: Maybe<Array<Notification_Bool_Exp>>;
  _not?: Maybe<Notification_Bool_Exp>;
  _or?: Maybe<Array<Notification_Bool_Exp>>;
  created_at?: Maybe<Timestamptz_Comparison_Exp>;
  data?: Maybe<Jsonb_Comparison_Exp>;
  id?: Maybe<Uuid_Comparison_Exp>;
  read_at?: Maybe<Timestamptz_Comparison_Exp>;
  updated_at?: Maybe<Timestamptz_Comparison_Exp>;
  user?: Maybe<User_Bool_Exp>;
  user_id?: Maybe<Uuid_Comparison_Exp>;
}

/** unique or primary key constraints on table "notification" */
export type Notification_Constraint =
  /** unique or primary key constraint */
  | 'notification_pkey';

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export interface Notification_Delete_At_Path_Input {
  data?: Maybe<Array<Scalars['String']>>;
}

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export interface Notification_Delete_Elem_Input {
  data?: Maybe<Scalars['Int']>;
}

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export interface Notification_Delete_Key_Input {
  data?: Maybe<Scalars['String']>;
}

/** input type for inserting data into table "notification" */
export interface Notification_Insert_Input {
  created_at?: Maybe<Scalars['timestamptz']>;
  data?: Maybe<Scalars['jsonb']>;
  id?: Maybe<Scalars['uuid']>;
  read_at?: Maybe<Scalars['timestamptz']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  user?: Maybe<User_Obj_Rel_Insert_Input>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** aggregate max on columns */
export interface Notification_Max_Fields {
  __typename?: 'notification_max_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  read_at?: Maybe<Scalars['timestamptz']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** order by max() on columns of table "notification" */
export interface Notification_Max_Order_By {
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  read_at?: Maybe<Order_By>;
  updated_at?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
}

/** aggregate min on columns */
export interface Notification_Min_Fields {
  __typename?: 'notification_min_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  read_at?: Maybe<Scalars['timestamptz']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** order by min() on columns of table "notification" */
export interface Notification_Min_Order_By {
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  read_at?: Maybe<Order_By>;
  updated_at?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
}

/** response of any mutation on the table "notification" */
export interface Notification_Mutation_Response {
  __typename?: 'notification_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Notification>;
}

/** on conflict condition type for table "notification" */
export interface Notification_On_Conflict {
  constraint: Notification_Constraint;
  update_columns?: Array<Notification_Update_Column>;
  where?: Maybe<Notification_Bool_Exp>;
}

/** Ordering options when selecting data from "notification". */
export interface Notification_Order_By {
  created_at?: Maybe<Order_By>;
  data?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  read_at?: Maybe<Order_By>;
  updated_at?: Maybe<Order_By>;
  user?: Maybe<User_Order_By>;
  user_id?: Maybe<Order_By>;
}

/** primary key columns input for table: notification */
export interface Notification_Pk_Columns_Input {
  id: Scalars['uuid'];
}

/** prepend existing jsonb value of filtered columns with new jsonb value */
export interface Notification_Prepend_Input {
  data?: Maybe<Scalars['jsonb']>;
}

/** select columns of table "notification" */
export type Notification_Select_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'data'
  /** column name */
  | 'id'
  /** column name */
  | 'read_at'
  /** column name */
  | 'updated_at'
  /** column name */
  | 'user_id';

/** input type for updating data in table "notification" */
export interface Notification_Set_Input {
  created_at?: Maybe<Scalars['timestamptz']>;
  data?: Maybe<Scalars['jsonb']>;
  id?: Maybe<Scalars['uuid']>;
  read_at?: Maybe<Scalars['timestamptz']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** update columns of table "notification" */
export type Notification_Update_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'data'
  /** column name */
  | 'id'
  /** column name */
  | 'read_at'
  /** column name */
  | 'updated_at'
  /** column name */
  | 'user_id';

/** column ordering options */
export type Order_By =
  /** in ascending order, nulls last */
  | 'asc'
  /** in ascending order, nulls first */
  | 'asc_nulls_first'
  /** in ascending order, nulls last */
  | 'asc_nulls_last'
  /** in descending order, nulls first */
  | 'desc'
  /** in descending order, nulls first */
  | 'desc_nulls_first'
  /** in descending order, nulls last */
  | 'desc_nulls_last';

export interface Query_Root {
  __typename?: 'query_root';
  /** fetch data from the table: "account" */
  account: Array<Account>;
  /** fetch aggregated fields from the table: "account" */
  account_aggregate: Account_Aggregate;
  /** fetch data from the table: "account" using primary key columns */
  account_by_pk?: Maybe<Account>;
  /** fetch data from the table: "attachment" */
  attachment: Array<Attachment>;
  /** fetch aggregated fields from the table: "attachment" */
  attachment_aggregate: Attachment_Aggregate;
  /** fetch data from the table: "attachment" using primary key columns */
  attachment_by_pk?: Maybe<Attachment>;
  get_team_slack_installation_url?: Maybe<GetTeamSlackInstallationUrlOutput>;
  get_upload_url?: Maybe<UploadUrlResponse>;
  /** fetch data from the table: "last_seen_message" */
  last_seen_message: Array<Last_Seen_Message>;
  /** fetch aggregated fields from the table: "last_seen_message" */
  last_seen_message_aggregate: Last_Seen_Message_Aggregate;
  /** fetch data from the table: "last_seen_message" using primary key columns */
  last_seen_message_by_pk?: Maybe<Last_Seen_Message>;
  lookup_team_name?: Maybe<LookupTeamNameResponse>;
  /** fetch data from the table: "membership_status" */
  membership_status: Array<Membership_Status>;
  /** fetch aggregated fields from the table: "membership_status" */
  membership_status_aggregate: Membership_Status_Aggregate;
  /** fetch data from the table: "membership_status" using primary key columns */
  membership_status_by_pk?: Maybe<Membership_Status>;
  /** fetch data from the table: "message" */
  message: Array<Message>;
  /** fetch aggregated fields from the table: "message" */
  message_aggregate: Message_Aggregate;
  /** fetch data from the table: "message" using primary key columns */
  message_by_pk?: Maybe<Message>;
  /** fetch data from the table: "message_reaction" */
  message_reaction: Array<Message_Reaction>;
  /** fetch aggregated fields from the table: "message_reaction" */
  message_reaction_aggregate: Message_Reaction_Aggregate;
  /** fetch data from the table: "message_reaction" using primary key columns */
  message_reaction_by_pk?: Maybe<Message_Reaction>;
  /** fetch data from the table: "message_type" */
  message_type: Array<Message_Type>;
  /** fetch aggregated fields from the table: "message_type" */
  message_type_aggregate: Message_Type_Aggregate;
  /** fetch data from the table: "message_type" using primary key columns */
  message_type_by_pk?: Maybe<Message_Type>;
  /** fetch data from the table: "notification" */
  notification: Array<Notification>;
  /** fetch aggregated fields from the table: "notification" */
  notification_aggregate: Notification_Aggregate;
  /** fetch data from the table: "notification" using primary key columns */
  notification_by_pk?: Maybe<Notification>;
  /** fetch data from the table: "room" */
  room: Array<Room>;
  /** fetch aggregated fields from the table: "room" */
  room_aggregate: Room_Aggregate;
  /** fetch data from the table: "room" using primary key columns */
  room_by_pk?: Maybe<Room>;
  /** fetch data from the table: "room_invitation" */
  room_invitation: Array<Room_Invitation>;
  /** fetch aggregated fields from the table: "room_invitation" */
  room_invitation_aggregate: Room_Invitation_Aggregate;
  /** fetch data from the table: "room_invitation" using primary key columns */
  room_invitation_by_pk?: Maybe<Room_Invitation>;
  room_invitation_view?: Maybe<RoomInvitationViewResponse>;
  /** fetch data from the table: "room_last_posted_message" */
  room_last_posted_message: Array<Room_Last_Posted_Message>;
  /** fetch aggregated fields from the table: "room_last_posted_message" */
  room_last_posted_message_aggregate: Room_Last_Posted_Message_Aggregate;
  /** fetch data from the table: "room_member" */
  room_member: Array<Room_Member>;
  /** fetch aggregated fields from the table: "room_member" */
  room_member_aggregate: Room_Member_Aggregate;
  /** fetch data from the table: "room_member" using primary key columns */
  room_member_by_pk?: Maybe<Room_Member>;
  /** fetch data from the table: "space" */
  space: Array<Space>;
  /** fetch aggregated fields from the table: "space" */
  space_aggregate: Space_Aggregate;
  /** fetch data from the table: "space" using primary key columns */
  space_by_pk?: Maybe<Space>;
  /** fetch data from the table: "space_member" */
  space_member: Array<Space_Member>;
  /** fetch aggregated fields from the table: "space_member" */
  space_member_aggregate: Space_Member_Aggregate;
  /** fetch data from the table: "space_member" using primary key columns */
  space_member_by_pk?: Maybe<Space_Member>;
  /** fetch data from the table: "task" */
  task: Array<Task>;
  /** fetch aggregated fields from the table: "task" */
  task_aggregate: Task_Aggregate;
  /** fetch data from the table: "task" using primary key columns */
  task_by_pk?: Maybe<Task>;
  /** fetch data from the table: "team" */
  team: Array<Team>;
  /** fetch aggregated fields from the table: "team" */
  team_aggregate: Team_Aggregate;
  /** fetch data from the table: "team" using primary key columns */
  team_by_pk?: Maybe<Team>;
  /** fetch data from the table: "team_invitation" */
  team_invitation: Array<Team_Invitation>;
  /** fetch aggregated fields from the table: "team_invitation" */
  team_invitation_aggregate: Team_Invitation_Aggregate;
  /** fetch data from the table: "team_invitation" using primary key columns */
  team_invitation_by_pk?: Maybe<Team_Invitation>;
  /** fetch data from the table: "team_member" */
  team_member: Array<Team_Member>;
  /** fetch aggregated fields from the table: "team_member" */
  team_member_aggregate: Team_Member_Aggregate;
  /** fetch data from the table: "team_member" using primary key columns */
  team_member_by_pk?: Maybe<Team_Member>;
  /** fetch data from the table: "team_slack_installation" */
  team_slack_installation: Array<Team_Slack_Installation>;
  /** fetch aggregated fields from the table: "team_slack_installation" */
  team_slack_installation_aggregate: Team_Slack_Installation_Aggregate;
  /** fetch data from the table: "team_slack_installation" using primary key columns */
  team_slack_installation_by_pk?: Maybe<Team_Slack_Installation>;
  /** fetch data from the table: "topic" */
  topic: Array<Topic>;
  /** fetch aggregated fields from the table: "topic" */
  topic_aggregate: Topic_Aggregate;
  /** fetch data from the table: "topic" using primary key columns */
  topic_by_pk?: Maybe<Topic>;
  /** fetch data from the table: "topic_member" */
  topic_member: Array<Topic_Member>;
  /** fetch aggregated fields from the table: "topic_member" */
  topic_member_aggregate: Topic_Member_Aggregate;
  /** fetch data from the table: "topic_member" using primary key columns */
  topic_member_by_pk?: Maybe<Topic_Member>;
  /** fetch data from the table: "transcription" */
  transcription: Array<Transcription>;
  /** fetch aggregated fields from the table: "transcription" */
  transcription_aggregate: Transcription_Aggregate;
  /** fetch data from the table: "transcription" using primary key columns */
  transcription_by_pk?: Maybe<Transcription>;
  /** fetch data from the table: "transcription_status" */
  transcription_status: Array<Transcription_Status>;
  /** fetch aggregated fields from the table: "transcription_status" */
  transcription_status_aggregate: Transcription_Status_Aggregate;
  /** fetch data from the table: "transcription_status" using primary key columns */
  transcription_status_by_pk?: Maybe<Transcription_Status>;
  /** fetch data from the table: "unread_messages" */
  unread_messages: Array<Unread_Messages>;
  /** fetch aggregated fields from the table: "unread_messages" */
  unread_messages_aggregate: Unread_Messages_Aggregate;
  /** fetch data from the table: "user" */
  user: Array<User>;
  /** fetch aggregated fields from the table: "user" */
  user_aggregate: User_Aggregate;
  /** fetch data from the table: "user" using primary key columns */
  user_by_pk?: Maybe<User>;
  /** fetch data from the table: "whitelist" */
  whitelist: Array<Whitelist>;
  /** fetch aggregated fields from the table: "whitelist" */
  whitelist_aggregate: Whitelist_Aggregate;
  /** fetch data from the table: "whitelist" using primary key columns */
  whitelist_by_pk?: Maybe<Whitelist>;
}


export interface Query_RootAccountArgs {
  distinct_on?: Maybe<Array<Account_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Account_Order_By>>;
  where?: Maybe<Account_Bool_Exp>;
}


export interface Query_RootAccount_AggregateArgs {
  distinct_on?: Maybe<Array<Account_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Account_Order_By>>;
  where?: Maybe<Account_Bool_Exp>;
}


export interface Query_RootAccount_By_PkArgs {
  id: Scalars['uuid'];
}


export interface Query_RootAttachmentArgs {
  distinct_on?: Maybe<Array<Attachment_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Attachment_Order_By>>;
  where?: Maybe<Attachment_Bool_Exp>;
}


export interface Query_RootAttachment_AggregateArgs {
  distinct_on?: Maybe<Array<Attachment_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Attachment_Order_By>>;
  where?: Maybe<Attachment_Bool_Exp>;
}


export interface Query_RootAttachment_By_PkArgs {
  id: Scalars['uuid'];
}


export interface Query_RootGet_Team_Slack_Installation_UrlArgs {
  input: GetTeamSlackInstallationUrlInput;
}


export interface Query_RootGet_Upload_UrlArgs {
  fileName: Scalars['String'];
  mimeType: Scalars['String'];
}


export interface Query_RootLast_Seen_MessageArgs {
  distinct_on?: Maybe<Array<Last_Seen_Message_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Last_Seen_Message_Order_By>>;
  where?: Maybe<Last_Seen_Message_Bool_Exp>;
}


export interface Query_RootLast_Seen_Message_AggregateArgs {
  distinct_on?: Maybe<Array<Last_Seen_Message_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Last_Seen_Message_Order_By>>;
  where?: Maybe<Last_Seen_Message_Bool_Exp>;
}


export interface Query_RootLast_Seen_Message_By_PkArgs {
  topic_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
}


export interface Query_RootLookup_Team_NameArgs {
  token: Scalars['String'];
}


export interface Query_RootMembership_StatusArgs {
  distinct_on?: Maybe<Array<Membership_Status_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Membership_Status_Order_By>>;
  where?: Maybe<Membership_Status_Bool_Exp>;
}


export interface Query_RootMembership_Status_AggregateArgs {
  distinct_on?: Maybe<Array<Membership_Status_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Membership_Status_Order_By>>;
  where?: Maybe<Membership_Status_Bool_Exp>;
}


export interface Query_RootMembership_Status_By_PkArgs {
  value: Scalars['String'];
}


export interface Query_RootMessageArgs {
  distinct_on?: Maybe<Array<Message_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Message_Order_By>>;
  where?: Maybe<Message_Bool_Exp>;
}


export interface Query_RootMessage_AggregateArgs {
  distinct_on?: Maybe<Array<Message_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Message_Order_By>>;
  where?: Maybe<Message_Bool_Exp>;
}


export interface Query_RootMessage_By_PkArgs {
  id: Scalars['uuid'];
}


export interface Query_RootMessage_ReactionArgs {
  distinct_on?: Maybe<Array<Message_Reaction_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Message_Reaction_Order_By>>;
  where?: Maybe<Message_Reaction_Bool_Exp>;
}


export interface Query_RootMessage_Reaction_AggregateArgs {
  distinct_on?: Maybe<Array<Message_Reaction_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Message_Reaction_Order_By>>;
  where?: Maybe<Message_Reaction_Bool_Exp>;
}


export interface Query_RootMessage_Reaction_By_PkArgs {
  emoji: Scalars['String'];
  message_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
}


export interface Query_RootMessage_TypeArgs {
  distinct_on?: Maybe<Array<Message_Type_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Message_Type_Order_By>>;
  where?: Maybe<Message_Type_Bool_Exp>;
}


export interface Query_RootMessage_Type_AggregateArgs {
  distinct_on?: Maybe<Array<Message_Type_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Message_Type_Order_By>>;
  where?: Maybe<Message_Type_Bool_Exp>;
}


export interface Query_RootMessage_Type_By_PkArgs {
  value: Scalars['String'];
}


export interface Query_RootNotificationArgs {
  distinct_on?: Maybe<Array<Notification_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Notification_Order_By>>;
  where?: Maybe<Notification_Bool_Exp>;
}


export interface Query_RootNotification_AggregateArgs {
  distinct_on?: Maybe<Array<Notification_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Notification_Order_By>>;
  where?: Maybe<Notification_Bool_Exp>;
}


export interface Query_RootNotification_By_PkArgs {
  id: Scalars['uuid'];
}


export interface Query_RootRoomArgs {
  distinct_on?: Maybe<Array<Room_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Order_By>>;
  where?: Maybe<Room_Bool_Exp>;
}


export interface Query_RootRoom_AggregateArgs {
  distinct_on?: Maybe<Array<Room_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Order_By>>;
  where?: Maybe<Room_Bool_Exp>;
}


export interface Query_RootRoom_By_PkArgs {
  id: Scalars['uuid'];
}


export interface Query_RootRoom_InvitationArgs {
  distinct_on?: Maybe<Array<Room_Invitation_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Invitation_Order_By>>;
  where?: Maybe<Room_Invitation_Bool_Exp>;
}


export interface Query_RootRoom_Invitation_AggregateArgs {
  distinct_on?: Maybe<Array<Room_Invitation_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Invitation_Order_By>>;
  where?: Maybe<Room_Invitation_Bool_Exp>;
}


export interface Query_RootRoom_Invitation_By_PkArgs {
  id: Scalars['uuid'];
}


export interface Query_RootRoom_Invitation_ViewArgs {
  token: Scalars['String'];
}


export interface Query_RootRoom_Last_Posted_MessageArgs {
  distinct_on?: Maybe<Array<Room_Last_Posted_Message_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Last_Posted_Message_Order_By>>;
  where?: Maybe<Room_Last_Posted_Message_Bool_Exp>;
}


export interface Query_RootRoom_Last_Posted_Message_AggregateArgs {
  distinct_on?: Maybe<Array<Room_Last_Posted_Message_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Last_Posted_Message_Order_By>>;
  where?: Maybe<Room_Last_Posted_Message_Bool_Exp>;
}


export interface Query_RootRoom_MemberArgs {
  distinct_on?: Maybe<Array<Room_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Member_Order_By>>;
  where?: Maybe<Room_Member_Bool_Exp>;
}


export interface Query_RootRoom_Member_AggregateArgs {
  distinct_on?: Maybe<Array<Room_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Member_Order_By>>;
  where?: Maybe<Room_Member_Bool_Exp>;
}


export interface Query_RootRoom_Member_By_PkArgs {
  room_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
}


export interface Query_RootSpaceArgs {
  distinct_on?: Maybe<Array<Space_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Space_Order_By>>;
  where?: Maybe<Space_Bool_Exp>;
}


export interface Query_RootSpace_AggregateArgs {
  distinct_on?: Maybe<Array<Space_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Space_Order_By>>;
  where?: Maybe<Space_Bool_Exp>;
}


export interface Query_RootSpace_By_PkArgs {
  id: Scalars['uuid'];
}


export interface Query_RootSpace_MemberArgs {
  distinct_on?: Maybe<Array<Space_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Space_Member_Order_By>>;
  where?: Maybe<Space_Member_Bool_Exp>;
}


export interface Query_RootSpace_Member_AggregateArgs {
  distinct_on?: Maybe<Array<Space_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Space_Member_Order_By>>;
  where?: Maybe<Space_Member_Bool_Exp>;
}


export interface Query_RootSpace_Member_By_PkArgs {
  space_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
}


export interface Query_RootTaskArgs {
  distinct_on?: Maybe<Array<Task_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Task_Order_By>>;
  where?: Maybe<Task_Bool_Exp>;
}


export interface Query_RootTask_AggregateArgs {
  distinct_on?: Maybe<Array<Task_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Task_Order_By>>;
  where?: Maybe<Task_Bool_Exp>;
}


export interface Query_RootTask_By_PkArgs {
  id: Scalars['uuid'];
}


export interface Query_RootTeamArgs {
  distinct_on?: Maybe<Array<Team_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Order_By>>;
  where?: Maybe<Team_Bool_Exp>;
}


export interface Query_RootTeam_AggregateArgs {
  distinct_on?: Maybe<Array<Team_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Order_By>>;
  where?: Maybe<Team_Bool_Exp>;
}


export interface Query_RootTeam_By_PkArgs {
  id: Scalars['uuid'];
}


export interface Query_RootTeam_InvitationArgs {
  distinct_on?: Maybe<Array<Team_Invitation_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Invitation_Order_By>>;
  where?: Maybe<Team_Invitation_Bool_Exp>;
}


export interface Query_RootTeam_Invitation_AggregateArgs {
  distinct_on?: Maybe<Array<Team_Invitation_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Invitation_Order_By>>;
  where?: Maybe<Team_Invitation_Bool_Exp>;
}


export interface Query_RootTeam_Invitation_By_PkArgs {
  id: Scalars['uuid'];
}


export interface Query_RootTeam_MemberArgs {
  distinct_on?: Maybe<Array<Team_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Member_Order_By>>;
  where?: Maybe<Team_Member_Bool_Exp>;
}


export interface Query_RootTeam_Member_AggregateArgs {
  distinct_on?: Maybe<Array<Team_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Member_Order_By>>;
  where?: Maybe<Team_Member_Bool_Exp>;
}


export interface Query_RootTeam_Member_By_PkArgs {
  team_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
}


export interface Query_RootTeam_Slack_InstallationArgs {
  distinct_on?: Maybe<Array<Team_Slack_Installation_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Slack_Installation_Order_By>>;
  where?: Maybe<Team_Slack_Installation_Bool_Exp>;
}


export interface Query_RootTeam_Slack_Installation_AggregateArgs {
  distinct_on?: Maybe<Array<Team_Slack_Installation_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Slack_Installation_Order_By>>;
  where?: Maybe<Team_Slack_Installation_Bool_Exp>;
}


export interface Query_RootTeam_Slack_Installation_By_PkArgs {
  team_id: Scalars['uuid'];
}


export interface Query_RootTopicArgs {
  distinct_on?: Maybe<Array<Topic_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Topic_Order_By>>;
  where?: Maybe<Topic_Bool_Exp>;
}


export interface Query_RootTopic_AggregateArgs {
  distinct_on?: Maybe<Array<Topic_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Topic_Order_By>>;
  where?: Maybe<Topic_Bool_Exp>;
}


export interface Query_RootTopic_By_PkArgs {
  id: Scalars['uuid'];
}


export interface Query_RootTopic_MemberArgs {
  distinct_on?: Maybe<Array<Topic_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Topic_Member_Order_By>>;
  where?: Maybe<Topic_Member_Bool_Exp>;
}


export interface Query_RootTopic_Member_AggregateArgs {
  distinct_on?: Maybe<Array<Topic_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Topic_Member_Order_By>>;
  where?: Maybe<Topic_Member_Bool_Exp>;
}


export interface Query_RootTopic_Member_By_PkArgs {
  topic_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
}


export interface Query_RootTranscriptionArgs {
  distinct_on?: Maybe<Array<Transcription_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Transcription_Order_By>>;
  where?: Maybe<Transcription_Bool_Exp>;
}


export interface Query_RootTranscription_AggregateArgs {
  distinct_on?: Maybe<Array<Transcription_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Transcription_Order_By>>;
  where?: Maybe<Transcription_Bool_Exp>;
}


export interface Query_RootTranscription_By_PkArgs {
  id: Scalars['uuid'];
}


export interface Query_RootTranscription_StatusArgs {
  distinct_on?: Maybe<Array<Transcription_Status_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Transcription_Status_Order_By>>;
  where?: Maybe<Transcription_Status_Bool_Exp>;
}


export interface Query_RootTranscription_Status_AggregateArgs {
  distinct_on?: Maybe<Array<Transcription_Status_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Transcription_Status_Order_By>>;
  where?: Maybe<Transcription_Status_Bool_Exp>;
}


export interface Query_RootTranscription_Status_By_PkArgs {
  value: Scalars['String'];
}


export interface Query_RootUnread_MessagesArgs {
  distinct_on?: Maybe<Array<Unread_Messages_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Unread_Messages_Order_By>>;
  where?: Maybe<Unread_Messages_Bool_Exp>;
}


export interface Query_RootUnread_Messages_AggregateArgs {
  distinct_on?: Maybe<Array<Unread_Messages_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Unread_Messages_Order_By>>;
  where?: Maybe<Unread_Messages_Bool_Exp>;
}


export interface Query_RootUserArgs {
  distinct_on?: Maybe<Array<User_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<User_Order_By>>;
  where?: Maybe<User_Bool_Exp>;
}


export interface Query_RootUser_AggregateArgs {
  distinct_on?: Maybe<Array<User_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<User_Order_By>>;
  where?: Maybe<User_Bool_Exp>;
}


export interface Query_RootUser_By_PkArgs {
  id: Scalars['uuid'];
}


export interface Query_RootWhitelistArgs {
  distinct_on?: Maybe<Array<Whitelist_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Whitelist_Order_By>>;
  where?: Maybe<Whitelist_Bool_Exp>;
}


export interface Query_RootWhitelist_AggregateArgs {
  distinct_on?: Maybe<Array<Whitelist_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Whitelist_Order_By>>;
  where?: Maybe<Whitelist_Bool_Exp>;
}


export interface Query_RootWhitelist_By_PkArgs {
  email: Scalars['String'];
}

/** columns and relationships of "room" */
export interface Room {
  __typename?: 'room';
  created_at: Scalars['timestamptz'];
  /** An object relationship */
  creator: User;
  creator_id: Scalars['uuid'];
  deadline: Scalars['timestamptz'];
  finished_at?: Maybe<Scalars['timestamptz']>;
  id: Scalars['uuid'];
  /** An array relationship */
  invitations: Array<Room_Invitation>;
  /** An aggregate relationship */
  invitations_aggregate: Room_Invitation_Aggregate;
  is_private: Scalars['Boolean'];
  last_activity_at?: Maybe<Scalars['timestamptz']>;
  /** An object relationship */
  last_posted_message?: Maybe<Room_Last_Posted_Message>;
  /** An array relationship */
  members: Array<Room_Member>;
  /** An aggregate relationship */
  members_aggregate: Room_Member_Aggregate;
  name: Scalars['String'];
  notification_job_id?: Maybe<Scalars['String']>;
  /** An object relationship */
  owner: User;
  owner_id: Scalars['uuid'];
  recurring_days?: Maybe<Scalars['Int']>;
  recurring_last_restart?: Maybe<Scalars['timestamptz']>;
  slug: Scalars['String'];
  source_google_calendar_event_id?: Maybe<Scalars['String']>;
  /** An object relationship */
  space: Space;
  space_id: Scalars['uuid'];
  summary?: Maybe<Scalars['String']>;
  /** An array relationship */
  topics: Array<Topic>;
  /** An aggregate relationship */
  topics_aggregate: Topic_Aggregate;
}


/** columns and relationships of "room" */
export interface RoomInvitationsArgs {
  distinct_on?: Maybe<Array<Room_Invitation_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Invitation_Order_By>>;
  where?: Maybe<Room_Invitation_Bool_Exp>;
}


/** columns and relationships of "room" */
export interface RoomInvitations_AggregateArgs {
  distinct_on?: Maybe<Array<Room_Invitation_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Invitation_Order_By>>;
  where?: Maybe<Room_Invitation_Bool_Exp>;
}


/** columns and relationships of "room" */
export interface RoomMembersArgs {
  distinct_on?: Maybe<Array<Room_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Member_Order_By>>;
  where?: Maybe<Room_Member_Bool_Exp>;
}


/** columns and relationships of "room" */
export interface RoomMembers_AggregateArgs {
  distinct_on?: Maybe<Array<Room_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Member_Order_By>>;
  where?: Maybe<Room_Member_Bool_Exp>;
}


/** columns and relationships of "room" */
export interface RoomTopicsArgs {
  distinct_on?: Maybe<Array<Topic_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Topic_Order_By>>;
  where?: Maybe<Topic_Bool_Exp>;
}


/** columns and relationships of "room" */
export interface RoomTopics_AggregateArgs {
  distinct_on?: Maybe<Array<Topic_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Topic_Order_By>>;
  where?: Maybe<Topic_Bool_Exp>;
}

/** aggregated selection of "room" */
export interface Room_Aggregate {
  __typename?: 'room_aggregate';
  aggregate?: Maybe<Room_Aggregate_Fields>;
  nodes: Array<Room>;
}

/** aggregate fields of "room" */
export interface Room_Aggregate_Fields {
  __typename?: 'room_aggregate_fields';
  avg?: Maybe<Room_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Room_Max_Fields>;
  min?: Maybe<Room_Min_Fields>;
  stddev?: Maybe<Room_Stddev_Fields>;
  stddev_pop?: Maybe<Room_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Room_Stddev_Samp_Fields>;
  sum?: Maybe<Room_Sum_Fields>;
  var_pop?: Maybe<Room_Var_Pop_Fields>;
  var_samp?: Maybe<Room_Var_Samp_Fields>;
  variance?: Maybe<Room_Variance_Fields>;
}


/** aggregate fields of "room" */
export interface Room_Aggregate_FieldsCountArgs {
  columns?: Maybe<Array<Room_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
}

/** order by aggregate values of table "room" */
export interface Room_Aggregate_Order_By {
  avg?: Maybe<Room_Avg_Order_By>;
  count?: Maybe<Order_By>;
  max?: Maybe<Room_Max_Order_By>;
  min?: Maybe<Room_Min_Order_By>;
  stddev?: Maybe<Room_Stddev_Order_By>;
  stddev_pop?: Maybe<Room_Stddev_Pop_Order_By>;
  stddev_samp?: Maybe<Room_Stddev_Samp_Order_By>;
  sum?: Maybe<Room_Sum_Order_By>;
  var_pop?: Maybe<Room_Var_Pop_Order_By>;
  var_samp?: Maybe<Room_Var_Samp_Order_By>;
  variance?: Maybe<Room_Variance_Order_By>;
}

/** input type for inserting array relation for remote table "room" */
export interface Room_Arr_Rel_Insert_Input {
  data: Array<Room_Insert_Input>;
  /** on conflict condition */
  on_conflict?: Maybe<Room_On_Conflict>;
}

/** aggregate avg on columns */
export interface Room_Avg_Fields {
  __typename?: 'room_avg_fields';
  recurring_days?: Maybe<Scalars['Float']>;
}

/** order by avg() on columns of table "room" */
export interface Room_Avg_Order_By {
  recurring_days?: Maybe<Order_By>;
}

/** Boolean expression to filter rows from the table "room". All fields are combined with a logical 'AND'. */
export interface Room_Bool_Exp {
  _and?: Maybe<Array<Room_Bool_Exp>>;
  _not?: Maybe<Room_Bool_Exp>;
  _or?: Maybe<Array<Room_Bool_Exp>>;
  created_at?: Maybe<Timestamptz_Comparison_Exp>;
  creator?: Maybe<User_Bool_Exp>;
  creator_id?: Maybe<Uuid_Comparison_Exp>;
  deadline?: Maybe<Timestamptz_Comparison_Exp>;
  finished_at?: Maybe<Timestamptz_Comparison_Exp>;
  id?: Maybe<Uuid_Comparison_Exp>;
  invitations?: Maybe<Room_Invitation_Bool_Exp>;
  is_private?: Maybe<Boolean_Comparison_Exp>;
  last_activity_at?: Maybe<Timestamptz_Comparison_Exp>;
  last_posted_message?: Maybe<Room_Last_Posted_Message_Bool_Exp>;
  members?: Maybe<Room_Member_Bool_Exp>;
  name?: Maybe<String_Comparison_Exp>;
  notification_job_id?: Maybe<String_Comparison_Exp>;
  owner?: Maybe<User_Bool_Exp>;
  owner_id?: Maybe<Uuid_Comparison_Exp>;
  recurring_days?: Maybe<Int_Comparison_Exp>;
  recurring_last_restart?: Maybe<Timestamptz_Comparison_Exp>;
  slug?: Maybe<String_Comparison_Exp>;
  source_google_calendar_event_id?: Maybe<String_Comparison_Exp>;
  space?: Maybe<Space_Bool_Exp>;
  space_id?: Maybe<Uuid_Comparison_Exp>;
  summary?: Maybe<String_Comparison_Exp>;
  topics?: Maybe<Topic_Bool_Exp>;
}

/** unique or primary key constraints on table "room" */
export type Room_Constraint =
  /** unique or primary key constraint */
  | 'room_pkey'
  /** unique or primary key constraint */
  | 'room_slug_space_id_key';

/** input type for incrementing numeric columns in table "room" */
export interface Room_Inc_Input {
  recurring_days?: Maybe<Scalars['Int']>;
}

/** input type for inserting data into table "room" */
export interface Room_Insert_Input {
  created_at?: Maybe<Scalars['timestamptz']>;
  creator?: Maybe<User_Obj_Rel_Insert_Input>;
  creator_id?: Maybe<Scalars['uuid']>;
  deadline?: Maybe<Scalars['timestamptz']>;
  finished_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  invitations?: Maybe<Room_Invitation_Arr_Rel_Insert_Input>;
  is_private?: Maybe<Scalars['Boolean']>;
  last_activity_at?: Maybe<Scalars['timestamptz']>;
  last_posted_message?: Maybe<Room_Last_Posted_Message_Obj_Rel_Insert_Input>;
  members?: Maybe<Room_Member_Arr_Rel_Insert_Input>;
  name?: Maybe<Scalars['String']>;
  notification_job_id?: Maybe<Scalars['String']>;
  owner?: Maybe<User_Obj_Rel_Insert_Input>;
  owner_id?: Maybe<Scalars['uuid']>;
  recurring_days?: Maybe<Scalars['Int']>;
  recurring_last_restart?: Maybe<Scalars['timestamptz']>;
  slug?: Maybe<Scalars['String']>;
  source_google_calendar_event_id?: Maybe<Scalars['String']>;
  space?: Maybe<Space_Obj_Rel_Insert_Input>;
  space_id?: Maybe<Scalars['uuid']>;
  summary?: Maybe<Scalars['String']>;
  topics?: Maybe<Topic_Arr_Rel_Insert_Input>;
}

/** columns and relationships of "room_invitation" */
export interface Room_Invitation {
  __typename?: 'room_invitation';
  created_at: Scalars['timestamptz'];
  email: Scalars['String'];
  id: Scalars['uuid'];
  /** An object relationship */
  inviting_user: User;
  inviting_user_id: Scalars['uuid'];
  /** An object relationship */
  room: Room;
  room_id: Scalars['uuid'];
  /** An object relationship */
  team: Team;
  team_id: Scalars['uuid'];
  token: Scalars['uuid'];
  used_at?: Maybe<Scalars['date']>;
  /** An object relationship */
  used_by_user?: Maybe<User>;
  used_by_user_id?: Maybe<Scalars['uuid']>;
}

/** aggregated selection of "room_invitation" */
export interface Room_Invitation_Aggregate {
  __typename?: 'room_invitation_aggregate';
  aggregate?: Maybe<Room_Invitation_Aggregate_Fields>;
  nodes: Array<Room_Invitation>;
}

/** aggregate fields of "room_invitation" */
export interface Room_Invitation_Aggregate_Fields {
  __typename?: 'room_invitation_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Room_Invitation_Max_Fields>;
  min?: Maybe<Room_Invitation_Min_Fields>;
}


/** aggregate fields of "room_invitation" */
export interface Room_Invitation_Aggregate_FieldsCountArgs {
  columns?: Maybe<Array<Room_Invitation_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
}

/** order by aggregate values of table "room_invitation" */
export interface Room_Invitation_Aggregate_Order_By {
  count?: Maybe<Order_By>;
  max?: Maybe<Room_Invitation_Max_Order_By>;
  min?: Maybe<Room_Invitation_Min_Order_By>;
}

/** input type for inserting array relation for remote table "room_invitation" */
export interface Room_Invitation_Arr_Rel_Insert_Input {
  data: Array<Room_Invitation_Insert_Input>;
  /** on conflict condition */
  on_conflict?: Maybe<Room_Invitation_On_Conflict>;
}

/** Boolean expression to filter rows from the table "room_invitation". All fields are combined with a logical 'AND'. */
export interface Room_Invitation_Bool_Exp {
  _and?: Maybe<Array<Room_Invitation_Bool_Exp>>;
  _not?: Maybe<Room_Invitation_Bool_Exp>;
  _or?: Maybe<Array<Room_Invitation_Bool_Exp>>;
  created_at?: Maybe<Timestamptz_Comparison_Exp>;
  email?: Maybe<String_Comparison_Exp>;
  id?: Maybe<Uuid_Comparison_Exp>;
  inviting_user?: Maybe<User_Bool_Exp>;
  inviting_user_id?: Maybe<Uuid_Comparison_Exp>;
  room?: Maybe<Room_Bool_Exp>;
  room_id?: Maybe<Uuid_Comparison_Exp>;
  team?: Maybe<Team_Bool_Exp>;
  team_id?: Maybe<Uuid_Comparison_Exp>;
  token?: Maybe<Uuid_Comparison_Exp>;
  used_at?: Maybe<Date_Comparison_Exp>;
  used_by_user?: Maybe<User_Bool_Exp>;
  used_by_user_id?: Maybe<Uuid_Comparison_Exp>;
}

/** unique or primary key constraints on table "room_invitation" */
export type Room_Invitation_Constraint =
  /** unique or primary key constraint */
  | 'room_invitation_pkey'
  /** unique or primary key constraint */
  | 'room_invitation_team_id_email_key'
  /** unique or primary key constraint */
  | 'room_invitation_token_key';

/** input type for inserting data into table "room_invitation" */
export interface Room_Invitation_Insert_Input {
  created_at?: Maybe<Scalars['timestamptz']>;
  email?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  inviting_user?: Maybe<User_Obj_Rel_Insert_Input>;
  inviting_user_id?: Maybe<Scalars['uuid']>;
  room?: Maybe<Room_Obj_Rel_Insert_Input>;
  room_id?: Maybe<Scalars['uuid']>;
  team?: Maybe<Team_Obj_Rel_Insert_Input>;
  team_id?: Maybe<Scalars['uuid']>;
  token?: Maybe<Scalars['uuid']>;
  used_at?: Maybe<Scalars['date']>;
  used_by_user?: Maybe<User_Obj_Rel_Insert_Input>;
  used_by_user_id?: Maybe<Scalars['uuid']>;
}

/** aggregate max on columns */
export interface Room_Invitation_Max_Fields {
  __typename?: 'room_invitation_max_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  email?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  inviting_user_id?: Maybe<Scalars['uuid']>;
  room_id?: Maybe<Scalars['uuid']>;
  team_id?: Maybe<Scalars['uuid']>;
  token?: Maybe<Scalars['uuid']>;
  used_at?: Maybe<Scalars['date']>;
  used_by_user_id?: Maybe<Scalars['uuid']>;
}

/** order by max() on columns of table "room_invitation" */
export interface Room_Invitation_Max_Order_By {
  created_at?: Maybe<Order_By>;
  email?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  inviting_user_id?: Maybe<Order_By>;
  room_id?: Maybe<Order_By>;
  team_id?: Maybe<Order_By>;
  token?: Maybe<Order_By>;
  used_at?: Maybe<Order_By>;
  used_by_user_id?: Maybe<Order_By>;
}

/** aggregate min on columns */
export interface Room_Invitation_Min_Fields {
  __typename?: 'room_invitation_min_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  email?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  inviting_user_id?: Maybe<Scalars['uuid']>;
  room_id?: Maybe<Scalars['uuid']>;
  team_id?: Maybe<Scalars['uuid']>;
  token?: Maybe<Scalars['uuid']>;
  used_at?: Maybe<Scalars['date']>;
  used_by_user_id?: Maybe<Scalars['uuid']>;
}

/** order by min() on columns of table "room_invitation" */
export interface Room_Invitation_Min_Order_By {
  created_at?: Maybe<Order_By>;
  email?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  inviting_user_id?: Maybe<Order_By>;
  room_id?: Maybe<Order_By>;
  team_id?: Maybe<Order_By>;
  token?: Maybe<Order_By>;
  used_at?: Maybe<Order_By>;
  used_by_user_id?: Maybe<Order_By>;
}

/** response of any mutation on the table "room_invitation" */
export interface Room_Invitation_Mutation_Response {
  __typename?: 'room_invitation_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Room_Invitation>;
}

/** on conflict condition type for table "room_invitation" */
export interface Room_Invitation_On_Conflict {
  constraint: Room_Invitation_Constraint;
  update_columns?: Array<Room_Invitation_Update_Column>;
  where?: Maybe<Room_Invitation_Bool_Exp>;
}

/** Ordering options when selecting data from "room_invitation". */
export interface Room_Invitation_Order_By {
  created_at?: Maybe<Order_By>;
  email?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  inviting_user?: Maybe<User_Order_By>;
  inviting_user_id?: Maybe<Order_By>;
  room?: Maybe<Room_Order_By>;
  room_id?: Maybe<Order_By>;
  team?: Maybe<Team_Order_By>;
  team_id?: Maybe<Order_By>;
  token?: Maybe<Order_By>;
  used_at?: Maybe<Order_By>;
  used_by_user?: Maybe<User_Order_By>;
  used_by_user_id?: Maybe<Order_By>;
}

/** primary key columns input for table: room_invitation */
export interface Room_Invitation_Pk_Columns_Input {
  id: Scalars['uuid'];
}

/** select columns of table "room_invitation" */
export type Room_Invitation_Select_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'email'
  /** column name */
  | 'id'
  /** column name */
  | 'inviting_user_id'
  /** column name */
  | 'room_id'
  /** column name */
  | 'team_id'
  /** column name */
  | 'token'
  /** column name */
  | 'used_at'
  /** column name */
  | 'used_by_user_id';

/** input type for updating data in table "room_invitation" */
export interface Room_Invitation_Set_Input {
  created_at?: Maybe<Scalars['timestamptz']>;
  email?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  inviting_user_id?: Maybe<Scalars['uuid']>;
  room_id?: Maybe<Scalars['uuid']>;
  team_id?: Maybe<Scalars['uuid']>;
  token?: Maybe<Scalars['uuid']>;
  used_at?: Maybe<Scalars['date']>;
  used_by_user_id?: Maybe<Scalars['uuid']>;
}

/** update columns of table "room_invitation" */
export type Room_Invitation_Update_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'email'
  /** column name */
  | 'id'
  /** column name */
  | 'inviting_user_id'
  /** column name */
  | 'room_id'
  /** column name */
  | 'team_id'
  /** column name */
  | 'token'
  /** column name */
  | 'used_at'
  /** column name */
  | 'used_by_user_id';

/** columns and relationships of "room_last_posted_message" */
export interface Room_Last_Posted_Message {
  __typename?: 'room_last_posted_message';
  last_posted_message_time?: Maybe<Scalars['timestamptz']>;
  /** An object relationship */
  room?: Maybe<Room>;
  room_id?: Maybe<Scalars['uuid']>;
}

/** aggregated selection of "room_last_posted_message" */
export interface Room_Last_Posted_Message_Aggregate {
  __typename?: 'room_last_posted_message_aggregate';
  aggregate?: Maybe<Room_Last_Posted_Message_Aggregate_Fields>;
  nodes: Array<Room_Last_Posted_Message>;
}

/** aggregate fields of "room_last_posted_message" */
export interface Room_Last_Posted_Message_Aggregate_Fields {
  __typename?: 'room_last_posted_message_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Room_Last_Posted_Message_Max_Fields>;
  min?: Maybe<Room_Last_Posted_Message_Min_Fields>;
}


/** aggregate fields of "room_last_posted_message" */
export interface Room_Last_Posted_Message_Aggregate_FieldsCountArgs {
  columns?: Maybe<Array<Room_Last_Posted_Message_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
}

/** Boolean expression to filter rows from the table "room_last_posted_message". All fields are combined with a logical 'AND'. */
export interface Room_Last_Posted_Message_Bool_Exp {
  _and?: Maybe<Array<Room_Last_Posted_Message_Bool_Exp>>;
  _not?: Maybe<Room_Last_Posted_Message_Bool_Exp>;
  _or?: Maybe<Array<Room_Last_Posted_Message_Bool_Exp>>;
  last_posted_message_time?: Maybe<Timestamptz_Comparison_Exp>;
  room?: Maybe<Room_Bool_Exp>;
  room_id?: Maybe<Uuid_Comparison_Exp>;
}

/** input type for inserting data into table "room_last_posted_message" */
export interface Room_Last_Posted_Message_Insert_Input {
  last_posted_message_time?: Maybe<Scalars['timestamptz']>;
  room?: Maybe<Room_Obj_Rel_Insert_Input>;
  room_id?: Maybe<Scalars['uuid']>;
}

/** aggregate max on columns */
export interface Room_Last_Posted_Message_Max_Fields {
  __typename?: 'room_last_posted_message_max_fields';
  last_posted_message_time?: Maybe<Scalars['timestamptz']>;
  room_id?: Maybe<Scalars['uuid']>;
}

/** aggregate min on columns */
export interface Room_Last_Posted_Message_Min_Fields {
  __typename?: 'room_last_posted_message_min_fields';
  last_posted_message_time?: Maybe<Scalars['timestamptz']>;
  room_id?: Maybe<Scalars['uuid']>;
}

/** input type for inserting object relation for remote table "room_last_posted_message" */
export interface Room_Last_Posted_Message_Obj_Rel_Insert_Input {
  data: Room_Last_Posted_Message_Insert_Input;
}

/** Ordering options when selecting data from "room_last_posted_message". */
export interface Room_Last_Posted_Message_Order_By {
  last_posted_message_time?: Maybe<Order_By>;
  room?: Maybe<Room_Order_By>;
  room_id?: Maybe<Order_By>;
}

/** select columns of table "room_last_posted_message" */
export type Room_Last_Posted_Message_Select_Column =
  /** column name */
  | 'last_posted_message_time'
  /** column name */
  | 'room_id';

/** aggregate max on columns */
export interface Room_Max_Fields {
  __typename?: 'room_max_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  creator_id?: Maybe<Scalars['uuid']>;
  deadline?: Maybe<Scalars['timestamptz']>;
  finished_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  last_activity_at?: Maybe<Scalars['timestamptz']>;
  name?: Maybe<Scalars['String']>;
  notification_job_id?: Maybe<Scalars['String']>;
  owner_id?: Maybe<Scalars['uuid']>;
  recurring_days?: Maybe<Scalars['Int']>;
  recurring_last_restart?: Maybe<Scalars['timestamptz']>;
  slug?: Maybe<Scalars['String']>;
  source_google_calendar_event_id?: Maybe<Scalars['String']>;
  space_id?: Maybe<Scalars['uuid']>;
  summary?: Maybe<Scalars['String']>;
}

/** order by max() on columns of table "room" */
export interface Room_Max_Order_By {
  created_at?: Maybe<Order_By>;
  creator_id?: Maybe<Order_By>;
  deadline?: Maybe<Order_By>;
  finished_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  last_activity_at?: Maybe<Order_By>;
  name?: Maybe<Order_By>;
  notification_job_id?: Maybe<Order_By>;
  owner_id?: Maybe<Order_By>;
  recurring_days?: Maybe<Order_By>;
  recurring_last_restart?: Maybe<Order_By>;
  slug?: Maybe<Order_By>;
  source_google_calendar_event_id?: Maybe<Order_By>;
  space_id?: Maybe<Order_By>;
  summary?: Maybe<Order_By>;
}

/** columns and relationships of "room_member" */
export interface Room_Member {
  __typename?: 'room_member';
  /** An object relationship */
  room: Room;
  room_id: Scalars['uuid'];
  /** An object relationship */
  user: User;
  user_id: Scalars['uuid'];
}

/** aggregated selection of "room_member" */
export interface Room_Member_Aggregate {
  __typename?: 'room_member_aggregate';
  aggregate?: Maybe<Room_Member_Aggregate_Fields>;
  nodes: Array<Room_Member>;
}

/** aggregate fields of "room_member" */
export interface Room_Member_Aggregate_Fields {
  __typename?: 'room_member_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Room_Member_Max_Fields>;
  min?: Maybe<Room_Member_Min_Fields>;
}


/** aggregate fields of "room_member" */
export interface Room_Member_Aggregate_FieldsCountArgs {
  columns?: Maybe<Array<Room_Member_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
}

/** order by aggregate values of table "room_member" */
export interface Room_Member_Aggregate_Order_By {
  count?: Maybe<Order_By>;
  max?: Maybe<Room_Member_Max_Order_By>;
  min?: Maybe<Room_Member_Min_Order_By>;
}

/** input type for inserting array relation for remote table "room_member" */
export interface Room_Member_Arr_Rel_Insert_Input {
  data: Array<Room_Member_Insert_Input>;
  /** on conflict condition */
  on_conflict?: Maybe<Room_Member_On_Conflict>;
}

/** Boolean expression to filter rows from the table "room_member". All fields are combined with a logical 'AND'. */
export interface Room_Member_Bool_Exp {
  _and?: Maybe<Array<Room_Member_Bool_Exp>>;
  _not?: Maybe<Room_Member_Bool_Exp>;
  _or?: Maybe<Array<Room_Member_Bool_Exp>>;
  room?: Maybe<Room_Bool_Exp>;
  room_id?: Maybe<Uuid_Comparison_Exp>;
  user?: Maybe<User_Bool_Exp>;
  user_id?: Maybe<Uuid_Comparison_Exp>;
}

/** unique or primary key constraints on table "room_member" */
export type Room_Member_Constraint =
  /** unique or primary key constraint */
  | 'room_participants_pkey'
  /** unique or primary key constraint */
  | 'room_participants_room_id_user_id_key';

/** input type for inserting data into table "room_member" */
export interface Room_Member_Insert_Input {
  room?: Maybe<Room_Obj_Rel_Insert_Input>;
  room_id?: Maybe<Scalars['uuid']>;
  user?: Maybe<User_Obj_Rel_Insert_Input>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** aggregate max on columns */
export interface Room_Member_Max_Fields {
  __typename?: 'room_member_max_fields';
  room_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** order by max() on columns of table "room_member" */
export interface Room_Member_Max_Order_By {
  room_id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
}

/** aggregate min on columns */
export interface Room_Member_Min_Fields {
  __typename?: 'room_member_min_fields';
  room_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** order by min() on columns of table "room_member" */
export interface Room_Member_Min_Order_By {
  room_id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
}

/** response of any mutation on the table "room_member" */
export interface Room_Member_Mutation_Response {
  __typename?: 'room_member_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Room_Member>;
}

/** on conflict condition type for table "room_member" */
export interface Room_Member_On_Conflict {
  constraint: Room_Member_Constraint;
  update_columns?: Array<Room_Member_Update_Column>;
  where?: Maybe<Room_Member_Bool_Exp>;
}

/** Ordering options when selecting data from "room_member". */
export interface Room_Member_Order_By {
  room?: Maybe<Room_Order_By>;
  room_id?: Maybe<Order_By>;
  user?: Maybe<User_Order_By>;
  user_id?: Maybe<Order_By>;
}

/** primary key columns input for table: room_member */
export interface Room_Member_Pk_Columns_Input {
  room_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
}

/** select columns of table "room_member" */
export type Room_Member_Select_Column =
  /** column name */
  | 'room_id'
  /** column name */
  | 'user_id';

/** input type for updating data in table "room_member" */
export interface Room_Member_Set_Input {
  room_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** update columns of table "room_member" */
export type Room_Member_Update_Column =
  /** column name */
  | 'room_id'
  /** column name */
  | 'user_id';

/** aggregate min on columns */
export interface Room_Min_Fields {
  __typename?: 'room_min_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  creator_id?: Maybe<Scalars['uuid']>;
  deadline?: Maybe<Scalars['timestamptz']>;
  finished_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  last_activity_at?: Maybe<Scalars['timestamptz']>;
  name?: Maybe<Scalars['String']>;
  notification_job_id?: Maybe<Scalars['String']>;
  owner_id?: Maybe<Scalars['uuid']>;
  recurring_days?: Maybe<Scalars['Int']>;
  recurring_last_restart?: Maybe<Scalars['timestamptz']>;
  slug?: Maybe<Scalars['String']>;
  source_google_calendar_event_id?: Maybe<Scalars['String']>;
  space_id?: Maybe<Scalars['uuid']>;
  summary?: Maybe<Scalars['String']>;
}

/** order by min() on columns of table "room" */
export interface Room_Min_Order_By {
  created_at?: Maybe<Order_By>;
  creator_id?: Maybe<Order_By>;
  deadline?: Maybe<Order_By>;
  finished_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  last_activity_at?: Maybe<Order_By>;
  name?: Maybe<Order_By>;
  notification_job_id?: Maybe<Order_By>;
  owner_id?: Maybe<Order_By>;
  recurring_days?: Maybe<Order_By>;
  recurring_last_restart?: Maybe<Order_By>;
  slug?: Maybe<Order_By>;
  source_google_calendar_event_id?: Maybe<Order_By>;
  space_id?: Maybe<Order_By>;
  summary?: Maybe<Order_By>;
}

/** response of any mutation on the table "room" */
export interface Room_Mutation_Response {
  __typename?: 'room_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Room>;
}

/** input type for inserting object relation for remote table "room" */
export interface Room_Obj_Rel_Insert_Input {
  data: Room_Insert_Input;
  /** on conflict condition */
  on_conflict?: Maybe<Room_On_Conflict>;
}

/** on conflict condition type for table "room" */
export interface Room_On_Conflict {
  constraint: Room_Constraint;
  update_columns?: Array<Room_Update_Column>;
  where?: Maybe<Room_Bool_Exp>;
}

/** Ordering options when selecting data from "room". */
export interface Room_Order_By {
  created_at?: Maybe<Order_By>;
  creator?: Maybe<User_Order_By>;
  creator_id?: Maybe<Order_By>;
  deadline?: Maybe<Order_By>;
  finished_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  invitations_aggregate?: Maybe<Room_Invitation_Aggregate_Order_By>;
  is_private?: Maybe<Order_By>;
  last_activity_at?: Maybe<Order_By>;
  last_posted_message?: Maybe<Room_Last_Posted_Message_Order_By>;
  members_aggregate?: Maybe<Room_Member_Aggregate_Order_By>;
  name?: Maybe<Order_By>;
  notification_job_id?: Maybe<Order_By>;
  owner?: Maybe<User_Order_By>;
  owner_id?: Maybe<Order_By>;
  recurring_days?: Maybe<Order_By>;
  recurring_last_restart?: Maybe<Order_By>;
  slug?: Maybe<Order_By>;
  source_google_calendar_event_id?: Maybe<Order_By>;
  space?: Maybe<Space_Order_By>;
  space_id?: Maybe<Order_By>;
  summary?: Maybe<Order_By>;
  topics_aggregate?: Maybe<Topic_Aggregate_Order_By>;
}

/** primary key columns input for table: room */
export interface Room_Pk_Columns_Input {
  id: Scalars['uuid'];
}

/** select columns of table "room" */
export type Room_Select_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'creator_id'
  /** column name */
  | 'deadline'
  /** column name */
  | 'finished_at'
  /** column name */
  | 'id'
  /** column name */
  | 'is_private'
  /** column name */
  | 'last_activity_at'
  /** column name */
  | 'name'
  /** column name */
  | 'notification_job_id'
  /** column name */
  | 'owner_id'
  /** column name */
  | 'recurring_days'
  /** column name */
  | 'recurring_last_restart'
  /** column name */
  | 'slug'
  /** column name */
  | 'source_google_calendar_event_id'
  /** column name */
  | 'space_id'
  /** column name */
  | 'summary';

/** input type for updating data in table "room" */
export interface Room_Set_Input {
  created_at?: Maybe<Scalars['timestamptz']>;
  creator_id?: Maybe<Scalars['uuid']>;
  deadline?: Maybe<Scalars['timestamptz']>;
  finished_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  is_private?: Maybe<Scalars['Boolean']>;
  last_activity_at?: Maybe<Scalars['timestamptz']>;
  name?: Maybe<Scalars['String']>;
  notification_job_id?: Maybe<Scalars['String']>;
  owner_id?: Maybe<Scalars['uuid']>;
  recurring_days?: Maybe<Scalars['Int']>;
  recurring_last_restart?: Maybe<Scalars['timestamptz']>;
  slug?: Maybe<Scalars['String']>;
  source_google_calendar_event_id?: Maybe<Scalars['String']>;
  space_id?: Maybe<Scalars['uuid']>;
  summary?: Maybe<Scalars['String']>;
}

/** aggregate stddev on columns */
export interface Room_Stddev_Fields {
  __typename?: 'room_stddev_fields';
  recurring_days?: Maybe<Scalars['Float']>;
}

/** order by stddev() on columns of table "room" */
export interface Room_Stddev_Order_By {
  recurring_days?: Maybe<Order_By>;
}

/** aggregate stddev_pop on columns */
export interface Room_Stddev_Pop_Fields {
  __typename?: 'room_stddev_pop_fields';
  recurring_days?: Maybe<Scalars['Float']>;
}

/** order by stddev_pop() on columns of table "room" */
export interface Room_Stddev_Pop_Order_By {
  recurring_days?: Maybe<Order_By>;
}

/** aggregate stddev_samp on columns */
export interface Room_Stddev_Samp_Fields {
  __typename?: 'room_stddev_samp_fields';
  recurring_days?: Maybe<Scalars['Float']>;
}

/** order by stddev_samp() on columns of table "room" */
export interface Room_Stddev_Samp_Order_By {
  recurring_days?: Maybe<Order_By>;
}

/** aggregate sum on columns */
export interface Room_Sum_Fields {
  __typename?: 'room_sum_fields';
  recurring_days?: Maybe<Scalars['Int']>;
}

/** order by sum() on columns of table "room" */
export interface Room_Sum_Order_By {
  recurring_days?: Maybe<Order_By>;
}

/** update columns of table "room" */
export type Room_Update_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'creator_id'
  /** column name */
  | 'deadline'
  /** column name */
  | 'finished_at'
  /** column name */
  | 'id'
  /** column name */
  | 'is_private'
  /** column name */
  | 'last_activity_at'
  /** column name */
  | 'name'
  /** column name */
  | 'notification_job_id'
  /** column name */
  | 'owner_id'
  /** column name */
  | 'recurring_days'
  /** column name */
  | 'recurring_last_restart'
  /** column name */
  | 'slug'
  /** column name */
  | 'source_google_calendar_event_id'
  /** column name */
  | 'space_id'
  /** column name */
  | 'summary';

/** aggregate var_pop on columns */
export interface Room_Var_Pop_Fields {
  __typename?: 'room_var_pop_fields';
  recurring_days?: Maybe<Scalars['Float']>;
}

/** order by var_pop() on columns of table "room" */
export interface Room_Var_Pop_Order_By {
  recurring_days?: Maybe<Order_By>;
}

/** aggregate var_samp on columns */
export interface Room_Var_Samp_Fields {
  __typename?: 'room_var_samp_fields';
  recurring_days?: Maybe<Scalars['Float']>;
}

/** order by var_samp() on columns of table "room" */
export interface Room_Var_Samp_Order_By {
  recurring_days?: Maybe<Order_By>;
}

/** aggregate variance on columns */
export interface Room_Variance_Fields {
  __typename?: 'room_variance_fields';
  recurring_days?: Maybe<Scalars['Float']>;
}

/** order by variance() on columns of table "room" */
export interface Room_Variance_Order_By {
  recurring_days?: Maybe<Order_By>;
}

/** columns and relationships of "space" */
export interface Space {
  __typename?: 'space';
  /** An object relationship */
  creator?: Maybe<User>;
  creator_id: Scalars['uuid'];
  id: Scalars['uuid'];
  /** An array relationship */
  members: Array<Space_Member>;
  /** An aggregate relationship */
  members_aggregate: Space_Member_Aggregate;
  name: Scalars['String'];
  /** An array relationship */
  rooms: Array<Room>;
  /** An aggregate relationship */
  rooms_aggregate: Room_Aggregate;
  slug: Scalars['String'];
  /** An object relationship */
  team: Team;
  team_id: Scalars['uuid'];
}


/** columns and relationships of "space" */
export interface SpaceMembersArgs {
  distinct_on?: Maybe<Array<Space_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Space_Member_Order_By>>;
  where?: Maybe<Space_Member_Bool_Exp>;
}


/** columns and relationships of "space" */
export interface SpaceMembers_AggregateArgs {
  distinct_on?: Maybe<Array<Space_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Space_Member_Order_By>>;
  where?: Maybe<Space_Member_Bool_Exp>;
}


/** columns and relationships of "space" */
export interface SpaceRoomsArgs {
  distinct_on?: Maybe<Array<Room_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Order_By>>;
  where?: Maybe<Room_Bool_Exp>;
}


/** columns and relationships of "space" */
export interface SpaceRooms_AggregateArgs {
  distinct_on?: Maybe<Array<Room_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Order_By>>;
  where?: Maybe<Room_Bool_Exp>;
}

/** aggregated selection of "space" */
export interface Space_Aggregate {
  __typename?: 'space_aggregate';
  aggregate?: Maybe<Space_Aggregate_Fields>;
  nodes: Array<Space>;
}

/** aggregate fields of "space" */
export interface Space_Aggregate_Fields {
  __typename?: 'space_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Space_Max_Fields>;
  min?: Maybe<Space_Min_Fields>;
}


/** aggregate fields of "space" */
export interface Space_Aggregate_FieldsCountArgs {
  columns?: Maybe<Array<Space_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
}

/** order by aggregate values of table "space" */
export interface Space_Aggregate_Order_By {
  count?: Maybe<Order_By>;
  max?: Maybe<Space_Max_Order_By>;
  min?: Maybe<Space_Min_Order_By>;
}

/** input type for inserting array relation for remote table "space" */
export interface Space_Arr_Rel_Insert_Input {
  data: Array<Space_Insert_Input>;
  /** on conflict condition */
  on_conflict?: Maybe<Space_On_Conflict>;
}

/** Boolean expression to filter rows from the table "space". All fields are combined with a logical 'AND'. */
export interface Space_Bool_Exp {
  _and?: Maybe<Array<Space_Bool_Exp>>;
  _not?: Maybe<Space_Bool_Exp>;
  _or?: Maybe<Array<Space_Bool_Exp>>;
  creator?: Maybe<User_Bool_Exp>;
  creator_id?: Maybe<Uuid_Comparison_Exp>;
  id?: Maybe<Uuid_Comparison_Exp>;
  members?: Maybe<Space_Member_Bool_Exp>;
  name?: Maybe<String_Comparison_Exp>;
  rooms?: Maybe<Room_Bool_Exp>;
  slug?: Maybe<String_Comparison_Exp>;
  team?: Maybe<Team_Bool_Exp>;
  team_id?: Maybe<Uuid_Comparison_Exp>;
}

/** unique or primary key constraints on table "space" */
export type Space_Constraint =
  /** unique or primary key constraint */
  | 'space_pkey'
  /** unique or primary key constraint */
  | 'space_team_id_slug_key';

/** input type for inserting data into table "space" */
export interface Space_Insert_Input {
  creator?: Maybe<User_Obj_Rel_Insert_Input>;
  creator_id?: Maybe<Scalars['uuid']>;
  id?: Maybe<Scalars['uuid']>;
  members?: Maybe<Space_Member_Arr_Rel_Insert_Input>;
  name?: Maybe<Scalars['String']>;
  rooms?: Maybe<Room_Arr_Rel_Insert_Input>;
  slug?: Maybe<Scalars['String']>;
  team?: Maybe<Team_Obj_Rel_Insert_Input>;
  team_id?: Maybe<Scalars['uuid']>;
}

/** aggregate max on columns */
export interface Space_Max_Fields {
  __typename?: 'space_max_fields';
  creator_id?: Maybe<Scalars['uuid']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  team_id?: Maybe<Scalars['uuid']>;
}

/** order by max() on columns of table "space" */
export interface Space_Max_Order_By {
  creator_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  name?: Maybe<Order_By>;
  slug?: Maybe<Order_By>;
  team_id?: Maybe<Order_By>;
}

/** columns and relationships of "space_member" */
export interface Space_Member {
  __typename?: 'space_member';
  /** An object relationship */
  space: Space;
  space_id: Scalars['uuid'];
  /** An object relationship */
  user: User;
  user_id: Scalars['uuid'];
}

/** aggregated selection of "space_member" */
export interface Space_Member_Aggregate {
  __typename?: 'space_member_aggregate';
  aggregate?: Maybe<Space_Member_Aggregate_Fields>;
  nodes: Array<Space_Member>;
}

/** aggregate fields of "space_member" */
export interface Space_Member_Aggregate_Fields {
  __typename?: 'space_member_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Space_Member_Max_Fields>;
  min?: Maybe<Space_Member_Min_Fields>;
}


/** aggregate fields of "space_member" */
export interface Space_Member_Aggregate_FieldsCountArgs {
  columns?: Maybe<Array<Space_Member_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
}

/** order by aggregate values of table "space_member" */
export interface Space_Member_Aggregate_Order_By {
  count?: Maybe<Order_By>;
  max?: Maybe<Space_Member_Max_Order_By>;
  min?: Maybe<Space_Member_Min_Order_By>;
}

/** input type for inserting array relation for remote table "space_member" */
export interface Space_Member_Arr_Rel_Insert_Input {
  data: Array<Space_Member_Insert_Input>;
  /** on conflict condition */
  on_conflict?: Maybe<Space_Member_On_Conflict>;
}

/** Boolean expression to filter rows from the table "space_member". All fields are combined with a logical 'AND'. */
export interface Space_Member_Bool_Exp {
  _and?: Maybe<Array<Space_Member_Bool_Exp>>;
  _not?: Maybe<Space_Member_Bool_Exp>;
  _or?: Maybe<Array<Space_Member_Bool_Exp>>;
  space?: Maybe<Space_Bool_Exp>;
  space_id?: Maybe<Uuid_Comparison_Exp>;
  user?: Maybe<User_Bool_Exp>;
  user_id?: Maybe<Uuid_Comparison_Exp>;
}

/** unique or primary key constraints on table "space_member" */
export type Space_Member_Constraint =
  /** unique or primary key constraint */
  | 'space_participants_pkey';

/** input type for inserting data into table "space_member" */
export interface Space_Member_Insert_Input {
  space?: Maybe<Space_Obj_Rel_Insert_Input>;
  space_id?: Maybe<Scalars['uuid']>;
  user?: Maybe<User_Obj_Rel_Insert_Input>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** aggregate max on columns */
export interface Space_Member_Max_Fields {
  __typename?: 'space_member_max_fields';
  space_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** order by max() on columns of table "space_member" */
export interface Space_Member_Max_Order_By {
  space_id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
}

/** aggregate min on columns */
export interface Space_Member_Min_Fields {
  __typename?: 'space_member_min_fields';
  space_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** order by min() on columns of table "space_member" */
export interface Space_Member_Min_Order_By {
  space_id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
}

/** response of any mutation on the table "space_member" */
export interface Space_Member_Mutation_Response {
  __typename?: 'space_member_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Space_Member>;
}

/** on conflict condition type for table "space_member" */
export interface Space_Member_On_Conflict {
  constraint: Space_Member_Constraint;
  update_columns?: Array<Space_Member_Update_Column>;
  where?: Maybe<Space_Member_Bool_Exp>;
}

/** Ordering options when selecting data from "space_member". */
export interface Space_Member_Order_By {
  space?: Maybe<Space_Order_By>;
  space_id?: Maybe<Order_By>;
  user?: Maybe<User_Order_By>;
  user_id?: Maybe<Order_By>;
}

/** primary key columns input for table: space_member */
export interface Space_Member_Pk_Columns_Input {
  space_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
}

/** select columns of table "space_member" */
export type Space_Member_Select_Column =
  /** column name */
  | 'space_id'
  /** column name */
  | 'user_id';

/** input type for updating data in table "space_member" */
export interface Space_Member_Set_Input {
  space_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** update columns of table "space_member" */
export type Space_Member_Update_Column =
  /** column name */
  | 'space_id'
  /** column name */
  | 'user_id';

/** aggregate min on columns */
export interface Space_Min_Fields {
  __typename?: 'space_min_fields';
  creator_id?: Maybe<Scalars['uuid']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  team_id?: Maybe<Scalars['uuid']>;
}

/** order by min() on columns of table "space" */
export interface Space_Min_Order_By {
  creator_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  name?: Maybe<Order_By>;
  slug?: Maybe<Order_By>;
  team_id?: Maybe<Order_By>;
}

/** response of any mutation on the table "space" */
export interface Space_Mutation_Response {
  __typename?: 'space_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Space>;
}

/** input type for inserting object relation for remote table "space" */
export interface Space_Obj_Rel_Insert_Input {
  data: Space_Insert_Input;
  /** on conflict condition */
  on_conflict?: Maybe<Space_On_Conflict>;
}

/** on conflict condition type for table "space" */
export interface Space_On_Conflict {
  constraint: Space_Constraint;
  update_columns?: Array<Space_Update_Column>;
  where?: Maybe<Space_Bool_Exp>;
}

/** Ordering options when selecting data from "space". */
export interface Space_Order_By {
  creator?: Maybe<User_Order_By>;
  creator_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  members_aggregate?: Maybe<Space_Member_Aggregate_Order_By>;
  name?: Maybe<Order_By>;
  rooms_aggregate?: Maybe<Room_Aggregate_Order_By>;
  slug?: Maybe<Order_By>;
  team?: Maybe<Team_Order_By>;
  team_id?: Maybe<Order_By>;
}

/** primary key columns input for table: space */
export interface Space_Pk_Columns_Input {
  id: Scalars['uuid'];
}

/** select columns of table "space" */
export type Space_Select_Column =
  /** column name */
  | 'creator_id'
  /** column name */
  | 'id'
  /** column name */
  | 'name'
  /** column name */
  | 'slug'
  /** column name */
  | 'team_id';

/** input type for updating data in table "space" */
export interface Space_Set_Input {
  creator_id?: Maybe<Scalars['uuid']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  team_id?: Maybe<Scalars['uuid']>;
}

/** update columns of table "space" */
export type Space_Update_Column =
  /** column name */
  | 'creator_id'
  /** column name */
  | 'id'
  /** column name */
  | 'name'
  /** column name */
  | 'slug'
  /** column name */
  | 'team_id';

export interface Subscription_Root {
  __typename?: 'subscription_root';
  /** fetch data from the table: "account" */
  account: Array<Account>;
  /** fetch aggregated fields from the table: "account" */
  account_aggregate: Account_Aggregate;
  /** fetch data from the table: "account" using primary key columns */
  account_by_pk?: Maybe<Account>;
  /** fetch data from the table: "attachment" */
  attachment: Array<Attachment>;
  /** fetch aggregated fields from the table: "attachment" */
  attachment_aggregate: Attachment_Aggregate;
  /** fetch data from the table: "attachment" using primary key columns */
  attachment_by_pk?: Maybe<Attachment>;
  /** fetch data from the table: "last_seen_message" */
  last_seen_message: Array<Last_Seen_Message>;
  /** fetch aggregated fields from the table: "last_seen_message" */
  last_seen_message_aggregate: Last_Seen_Message_Aggregate;
  /** fetch data from the table: "last_seen_message" using primary key columns */
  last_seen_message_by_pk?: Maybe<Last_Seen_Message>;
  /** fetch data from the table: "membership_status" */
  membership_status: Array<Membership_Status>;
  /** fetch aggregated fields from the table: "membership_status" */
  membership_status_aggregate: Membership_Status_Aggregate;
  /** fetch data from the table: "membership_status" using primary key columns */
  membership_status_by_pk?: Maybe<Membership_Status>;
  /** fetch data from the table: "message" */
  message: Array<Message>;
  /** fetch aggregated fields from the table: "message" */
  message_aggregate: Message_Aggregate;
  /** fetch data from the table: "message" using primary key columns */
  message_by_pk?: Maybe<Message>;
  /** fetch data from the table: "message_reaction" */
  message_reaction: Array<Message_Reaction>;
  /** fetch aggregated fields from the table: "message_reaction" */
  message_reaction_aggregate: Message_Reaction_Aggregate;
  /** fetch data from the table: "message_reaction" using primary key columns */
  message_reaction_by_pk?: Maybe<Message_Reaction>;
  /** fetch data from the table: "message_type" */
  message_type: Array<Message_Type>;
  /** fetch aggregated fields from the table: "message_type" */
  message_type_aggregate: Message_Type_Aggregate;
  /** fetch data from the table: "message_type" using primary key columns */
  message_type_by_pk?: Maybe<Message_Type>;
  /** fetch data from the table: "notification" */
  notification: Array<Notification>;
  /** fetch aggregated fields from the table: "notification" */
  notification_aggregate: Notification_Aggregate;
  /** fetch data from the table: "notification" using primary key columns */
  notification_by_pk?: Maybe<Notification>;
  /** fetch data from the table: "room" */
  room: Array<Room>;
  /** fetch aggregated fields from the table: "room" */
  room_aggregate: Room_Aggregate;
  /** fetch data from the table: "room" using primary key columns */
  room_by_pk?: Maybe<Room>;
  /** fetch data from the table: "room_invitation" */
  room_invitation: Array<Room_Invitation>;
  /** fetch aggregated fields from the table: "room_invitation" */
  room_invitation_aggregate: Room_Invitation_Aggregate;
  /** fetch data from the table: "room_invitation" using primary key columns */
  room_invitation_by_pk?: Maybe<Room_Invitation>;
  /** fetch data from the table: "room_last_posted_message" */
  room_last_posted_message: Array<Room_Last_Posted_Message>;
  /** fetch aggregated fields from the table: "room_last_posted_message" */
  room_last_posted_message_aggregate: Room_Last_Posted_Message_Aggregate;
  /** fetch data from the table: "room_member" */
  room_member: Array<Room_Member>;
  /** fetch aggregated fields from the table: "room_member" */
  room_member_aggregate: Room_Member_Aggregate;
  /** fetch data from the table: "room_member" using primary key columns */
  room_member_by_pk?: Maybe<Room_Member>;
  /** fetch data from the table: "space" */
  space: Array<Space>;
  /** fetch aggregated fields from the table: "space" */
  space_aggregate: Space_Aggregate;
  /** fetch data from the table: "space" using primary key columns */
  space_by_pk?: Maybe<Space>;
  /** fetch data from the table: "space_member" */
  space_member: Array<Space_Member>;
  /** fetch aggregated fields from the table: "space_member" */
  space_member_aggregate: Space_Member_Aggregate;
  /** fetch data from the table: "space_member" using primary key columns */
  space_member_by_pk?: Maybe<Space_Member>;
  /** fetch data from the table: "task" */
  task: Array<Task>;
  /** fetch aggregated fields from the table: "task" */
  task_aggregate: Task_Aggregate;
  /** fetch data from the table: "task" using primary key columns */
  task_by_pk?: Maybe<Task>;
  /** fetch data from the table: "team" */
  team: Array<Team>;
  /** fetch aggregated fields from the table: "team" */
  team_aggregate: Team_Aggregate;
  /** fetch data from the table: "team" using primary key columns */
  team_by_pk?: Maybe<Team>;
  /** fetch data from the table: "team_invitation" */
  team_invitation: Array<Team_Invitation>;
  /** fetch aggregated fields from the table: "team_invitation" */
  team_invitation_aggregate: Team_Invitation_Aggregate;
  /** fetch data from the table: "team_invitation" using primary key columns */
  team_invitation_by_pk?: Maybe<Team_Invitation>;
  /** fetch data from the table: "team_member" */
  team_member: Array<Team_Member>;
  /** fetch aggregated fields from the table: "team_member" */
  team_member_aggregate: Team_Member_Aggregate;
  /** fetch data from the table: "team_member" using primary key columns */
  team_member_by_pk?: Maybe<Team_Member>;
  /** fetch data from the table: "team_slack_installation" */
  team_slack_installation: Array<Team_Slack_Installation>;
  /** fetch aggregated fields from the table: "team_slack_installation" */
  team_slack_installation_aggregate: Team_Slack_Installation_Aggregate;
  /** fetch data from the table: "team_slack_installation" using primary key columns */
  team_slack_installation_by_pk?: Maybe<Team_Slack_Installation>;
  /** fetch data from the table: "topic" */
  topic: Array<Topic>;
  /** fetch aggregated fields from the table: "topic" */
  topic_aggregate: Topic_Aggregate;
  /** fetch data from the table: "topic" using primary key columns */
  topic_by_pk?: Maybe<Topic>;
  /** fetch data from the table: "topic_member" */
  topic_member: Array<Topic_Member>;
  /** fetch aggregated fields from the table: "topic_member" */
  topic_member_aggregate: Topic_Member_Aggregate;
  /** fetch data from the table: "topic_member" using primary key columns */
  topic_member_by_pk?: Maybe<Topic_Member>;
  /** fetch data from the table: "transcription" */
  transcription: Array<Transcription>;
  /** fetch aggregated fields from the table: "transcription" */
  transcription_aggregate: Transcription_Aggregate;
  /** fetch data from the table: "transcription" using primary key columns */
  transcription_by_pk?: Maybe<Transcription>;
  /** fetch data from the table: "transcription_status" */
  transcription_status: Array<Transcription_Status>;
  /** fetch aggregated fields from the table: "transcription_status" */
  transcription_status_aggregate: Transcription_Status_Aggregate;
  /** fetch data from the table: "transcription_status" using primary key columns */
  transcription_status_by_pk?: Maybe<Transcription_Status>;
  /** fetch data from the table: "unread_messages" */
  unread_messages: Array<Unread_Messages>;
  /** fetch aggregated fields from the table: "unread_messages" */
  unread_messages_aggregate: Unread_Messages_Aggregate;
  /** fetch data from the table: "user" */
  user: Array<User>;
  /** fetch aggregated fields from the table: "user" */
  user_aggregate: User_Aggregate;
  /** fetch data from the table: "user" using primary key columns */
  user_by_pk?: Maybe<User>;
  /** fetch data from the table: "whitelist" */
  whitelist: Array<Whitelist>;
  /** fetch aggregated fields from the table: "whitelist" */
  whitelist_aggregate: Whitelist_Aggregate;
  /** fetch data from the table: "whitelist" using primary key columns */
  whitelist_by_pk?: Maybe<Whitelist>;
}


export interface Subscription_RootAccountArgs {
  distinct_on?: Maybe<Array<Account_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Account_Order_By>>;
  where?: Maybe<Account_Bool_Exp>;
}


export interface Subscription_RootAccount_AggregateArgs {
  distinct_on?: Maybe<Array<Account_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Account_Order_By>>;
  where?: Maybe<Account_Bool_Exp>;
}


export interface Subscription_RootAccount_By_PkArgs {
  id: Scalars['uuid'];
}


export interface Subscription_RootAttachmentArgs {
  distinct_on?: Maybe<Array<Attachment_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Attachment_Order_By>>;
  where?: Maybe<Attachment_Bool_Exp>;
}


export interface Subscription_RootAttachment_AggregateArgs {
  distinct_on?: Maybe<Array<Attachment_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Attachment_Order_By>>;
  where?: Maybe<Attachment_Bool_Exp>;
}


export interface Subscription_RootAttachment_By_PkArgs {
  id: Scalars['uuid'];
}


export interface Subscription_RootLast_Seen_MessageArgs {
  distinct_on?: Maybe<Array<Last_Seen_Message_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Last_Seen_Message_Order_By>>;
  where?: Maybe<Last_Seen_Message_Bool_Exp>;
}


export interface Subscription_RootLast_Seen_Message_AggregateArgs {
  distinct_on?: Maybe<Array<Last_Seen_Message_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Last_Seen_Message_Order_By>>;
  where?: Maybe<Last_Seen_Message_Bool_Exp>;
}


export interface Subscription_RootLast_Seen_Message_By_PkArgs {
  topic_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
}


export interface Subscription_RootMembership_StatusArgs {
  distinct_on?: Maybe<Array<Membership_Status_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Membership_Status_Order_By>>;
  where?: Maybe<Membership_Status_Bool_Exp>;
}


export interface Subscription_RootMembership_Status_AggregateArgs {
  distinct_on?: Maybe<Array<Membership_Status_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Membership_Status_Order_By>>;
  where?: Maybe<Membership_Status_Bool_Exp>;
}


export interface Subscription_RootMembership_Status_By_PkArgs {
  value: Scalars['String'];
}


export interface Subscription_RootMessageArgs {
  distinct_on?: Maybe<Array<Message_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Message_Order_By>>;
  where?: Maybe<Message_Bool_Exp>;
}


export interface Subscription_RootMessage_AggregateArgs {
  distinct_on?: Maybe<Array<Message_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Message_Order_By>>;
  where?: Maybe<Message_Bool_Exp>;
}


export interface Subscription_RootMessage_By_PkArgs {
  id: Scalars['uuid'];
}


export interface Subscription_RootMessage_ReactionArgs {
  distinct_on?: Maybe<Array<Message_Reaction_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Message_Reaction_Order_By>>;
  where?: Maybe<Message_Reaction_Bool_Exp>;
}


export interface Subscription_RootMessage_Reaction_AggregateArgs {
  distinct_on?: Maybe<Array<Message_Reaction_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Message_Reaction_Order_By>>;
  where?: Maybe<Message_Reaction_Bool_Exp>;
}


export interface Subscription_RootMessage_Reaction_By_PkArgs {
  emoji: Scalars['String'];
  message_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
}


export interface Subscription_RootMessage_TypeArgs {
  distinct_on?: Maybe<Array<Message_Type_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Message_Type_Order_By>>;
  where?: Maybe<Message_Type_Bool_Exp>;
}


export interface Subscription_RootMessage_Type_AggregateArgs {
  distinct_on?: Maybe<Array<Message_Type_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Message_Type_Order_By>>;
  where?: Maybe<Message_Type_Bool_Exp>;
}


export interface Subscription_RootMessage_Type_By_PkArgs {
  value: Scalars['String'];
}


export interface Subscription_RootNotificationArgs {
  distinct_on?: Maybe<Array<Notification_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Notification_Order_By>>;
  where?: Maybe<Notification_Bool_Exp>;
}


export interface Subscription_RootNotification_AggregateArgs {
  distinct_on?: Maybe<Array<Notification_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Notification_Order_By>>;
  where?: Maybe<Notification_Bool_Exp>;
}


export interface Subscription_RootNotification_By_PkArgs {
  id: Scalars['uuid'];
}


export interface Subscription_RootRoomArgs {
  distinct_on?: Maybe<Array<Room_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Order_By>>;
  where?: Maybe<Room_Bool_Exp>;
}


export interface Subscription_RootRoom_AggregateArgs {
  distinct_on?: Maybe<Array<Room_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Order_By>>;
  where?: Maybe<Room_Bool_Exp>;
}


export interface Subscription_RootRoom_By_PkArgs {
  id: Scalars['uuid'];
}


export interface Subscription_RootRoom_InvitationArgs {
  distinct_on?: Maybe<Array<Room_Invitation_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Invitation_Order_By>>;
  where?: Maybe<Room_Invitation_Bool_Exp>;
}


export interface Subscription_RootRoom_Invitation_AggregateArgs {
  distinct_on?: Maybe<Array<Room_Invitation_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Invitation_Order_By>>;
  where?: Maybe<Room_Invitation_Bool_Exp>;
}


export interface Subscription_RootRoom_Invitation_By_PkArgs {
  id: Scalars['uuid'];
}


export interface Subscription_RootRoom_Last_Posted_MessageArgs {
  distinct_on?: Maybe<Array<Room_Last_Posted_Message_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Last_Posted_Message_Order_By>>;
  where?: Maybe<Room_Last_Posted_Message_Bool_Exp>;
}


export interface Subscription_RootRoom_Last_Posted_Message_AggregateArgs {
  distinct_on?: Maybe<Array<Room_Last_Posted_Message_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Last_Posted_Message_Order_By>>;
  where?: Maybe<Room_Last_Posted_Message_Bool_Exp>;
}


export interface Subscription_RootRoom_MemberArgs {
  distinct_on?: Maybe<Array<Room_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Member_Order_By>>;
  where?: Maybe<Room_Member_Bool_Exp>;
}


export interface Subscription_RootRoom_Member_AggregateArgs {
  distinct_on?: Maybe<Array<Room_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Member_Order_By>>;
  where?: Maybe<Room_Member_Bool_Exp>;
}


export interface Subscription_RootRoom_Member_By_PkArgs {
  room_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
}


export interface Subscription_RootSpaceArgs {
  distinct_on?: Maybe<Array<Space_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Space_Order_By>>;
  where?: Maybe<Space_Bool_Exp>;
}


export interface Subscription_RootSpace_AggregateArgs {
  distinct_on?: Maybe<Array<Space_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Space_Order_By>>;
  where?: Maybe<Space_Bool_Exp>;
}


export interface Subscription_RootSpace_By_PkArgs {
  id: Scalars['uuid'];
}


export interface Subscription_RootSpace_MemberArgs {
  distinct_on?: Maybe<Array<Space_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Space_Member_Order_By>>;
  where?: Maybe<Space_Member_Bool_Exp>;
}


export interface Subscription_RootSpace_Member_AggregateArgs {
  distinct_on?: Maybe<Array<Space_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Space_Member_Order_By>>;
  where?: Maybe<Space_Member_Bool_Exp>;
}


export interface Subscription_RootSpace_Member_By_PkArgs {
  space_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
}


export interface Subscription_RootTaskArgs {
  distinct_on?: Maybe<Array<Task_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Task_Order_By>>;
  where?: Maybe<Task_Bool_Exp>;
}


export interface Subscription_RootTask_AggregateArgs {
  distinct_on?: Maybe<Array<Task_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Task_Order_By>>;
  where?: Maybe<Task_Bool_Exp>;
}


export interface Subscription_RootTask_By_PkArgs {
  id: Scalars['uuid'];
}


export interface Subscription_RootTeamArgs {
  distinct_on?: Maybe<Array<Team_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Order_By>>;
  where?: Maybe<Team_Bool_Exp>;
}


export interface Subscription_RootTeam_AggregateArgs {
  distinct_on?: Maybe<Array<Team_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Order_By>>;
  where?: Maybe<Team_Bool_Exp>;
}


export interface Subscription_RootTeam_By_PkArgs {
  id: Scalars['uuid'];
}


export interface Subscription_RootTeam_InvitationArgs {
  distinct_on?: Maybe<Array<Team_Invitation_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Invitation_Order_By>>;
  where?: Maybe<Team_Invitation_Bool_Exp>;
}


export interface Subscription_RootTeam_Invitation_AggregateArgs {
  distinct_on?: Maybe<Array<Team_Invitation_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Invitation_Order_By>>;
  where?: Maybe<Team_Invitation_Bool_Exp>;
}


export interface Subscription_RootTeam_Invitation_By_PkArgs {
  id: Scalars['uuid'];
}


export interface Subscription_RootTeam_MemberArgs {
  distinct_on?: Maybe<Array<Team_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Member_Order_By>>;
  where?: Maybe<Team_Member_Bool_Exp>;
}


export interface Subscription_RootTeam_Member_AggregateArgs {
  distinct_on?: Maybe<Array<Team_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Member_Order_By>>;
  where?: Maybe<Team_Member_Bool_Exp>;
}


export interface Subscription_RootTeam_Member_By_PkArgs {
  team_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
}


export interface Subscription_RootTeam_Slack_InstallationArgs {
  distinct_on?: Maybe<Array<Team_Slack_Installation_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Slack_Installation_Order_By>>;
  where?: Maybe<Team_Slack_Installation_Bool_Exp>;
}


export interface Subscription_RootTeam_Slack_Installation_AggregateArgs {
  distinct_on?: Maybe<Array<Team_Slack_Installation_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Slack_Installation_Order_By>>;
  where?: Maybe<Team_Slack_Installation_Bool_Exp>;
}


export interface Subscription_RootTeam_Slack_Installation_By_PkArgs {
  team_id: Scalars['uuid'];
}


export interface Subscription_RootTopicArgs {
  distinct_on?: Maybe<Array<Topic_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Topic_Order_By>>;
  where?: Maybe<Topic_Bool_Exp>;
}


export interface Subscription_RootTopic_AggregateArgs {
  distinct_on?: Maybe<Array<Topic_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Topic_Order_By>>;
  where?: Maybe<Topic_Bool_Exp>;
}


export interface Subscription_RootTopic_By_PkArgs {
  id: Scalars['uuid'];
}


export interface Subscription_RootTopic_MemberArgs {
  distinct_on?: Maybe<Array<Topic_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Topic_Member_Order_By>>;
  where?: Maybe<Topic_Member_Bool_Exp>;
}


export interface Subscription_RootTopic_Member_AggregateArgs {
  distinct_on?: Maybe<Array<Topic_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Topic_Member_Order_By>>;
  where?: Maybe<Topic_Member_Bool_Exp>;
}


export interface Subscription_RootTopic_Member_By_PkArgs {
  topic_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
}


export interface Subscription_RootTranscriptionArgs {
  distinct_on?: Maybe<Array<Transcription_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Transcription_Order_By>>;
  where?: Maybe<Transcription_Bool_Exp>;
}


export interface Subscription_RootTranscription_AggregateArgs {
  distinct_on?: Maybe<Array<Transcription_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Transcription_Order_By>>;
  where?: Maybe<Transcription_Bool_Exp>;
}


export interface Subscription_RootTranscription_By_PkArgs {
  id: Scalars['uuid'];
}


export interface Subscription_RootTranscription_StatusArgs {
  distinct_on?: Maybe<Array<Transcription_Status_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Transcription_Status_Order_By>>;
  where?: Maybe<Transcription_Status_Bool_Exp>;
}


export interface Subscription_RootTranscription_Status_AggregateArgs {
  distinct_on?: Maybe<Array<Transcription_Status_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Transcription_Status_Order_By>>;
  where?: Maybe<Transcription_Status_Bool_Exp>;
}


export interface Subscription_RootTranscription_Status_By_PkArgs {
  value: Scalars['String'];
}


export interface Subscription_RootUnread_MessagesArgs {
  distinct_on?: Maybe<Array<Unread_Messages_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Unread_Messages_Order_By>>;
  where?: Maybe<Unread_Messages_Bool_Exp>;
}


export interface Subscription_RootUnread_Messages_AggregateArgs {
  distinct_on?: Maybe<Array<Unread_Messages_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Unread_Messages_Order_By>>;
  where?: Maybe<Unread_Messages_Bool_Exp>;
}


export interface Subscription_RootUserArgs {
  distinct_on?: Maybe<Array<User_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<User_Order_By>>;
  where?: Maybe<User_Bool_Exp>;
}


export interface Subscription_RootUser_AggregateArgs {
  distinct_on?: Maybe<Array<User_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<User_Order_By>>;
  where?: Maybe<User_Bool_Exp>;
}


export interface Subscription_RootUser_By_PkArgs {
  id: Scalars['uuid'];
}


export interface Subscription_RootWhitelistArgs {
  distinct_on?: Maybe<Array<Whitelist_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Whitelist_Order_By>>;
  where?: Maybe<Whitelist_Bool_Exp>;
}


export interface Subscription_RootWhitelist_AggregateArgs {
  distinct_on?: Maybe<Array<Whitelist_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Whitelist_Order_By>>;
  where?: Maybe<Whitelist_Bool_Exp>;
}


export interface Subscription_RootWhitelist_By_PkArgs {
  email: Scalars['String'];
}

/** columns and relationships of "task" */
export interface Task {
  __typename?: 'task';
  created_at: Scalars['timestamptz'];
  done_at?: Maybe<Scalars['timestamptz']>;
  id: Scalars['uuid'];
  /** An object relationship */
  message: Message;
  message_id: Scalars['uuid'];
  seen_at?: Maybe<Scalars['timestamptz']>;
  type?: Maybe<Scalars['String']>;
  /** An object relationship */
  user: User;
  user_id: Scalars['uuid'];
}

/** aggregated selection of "task" */
export interface Task_Aggregate {
  __typename?: 'task_aggregate';
  aggregate?: Maybe<Task_Aggregate_Fields>;
  nodes: Array<Task>;
}

/** aggregate fields of "task" */
export interface Task_Aggregate_Fields {
  __typename?: 'task_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Task_Max_Fields>;
  min?: Maybe<Task_Min_Fields>;
}


/** aggregate fields of "task" */
export interface Task_Aggregate_FieldsCountArgs {
  columns?: Maybe<Array<Task_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
}

/** order by aggregate values of table "task" */
export interface Task_Aggregate_Order_By {
  count?: Maybe<Order_By>;
  max?: Maybe<Task_Max_Order_By>;
  min?: Maybe<Task_Min_Order_By>;
}

/** input type for inserting array relation for remote table "task" */
export interface Task_Arr_Rel_Insert_Input {
  data: Array<Task_Insert_Input>;
  /** on conflict condition */
  on_conflict?: Maybe<Task_On_Conflict>;
}

/** Boolean expression to filter rows from the table "task". All fields are combined with a logical 'AND'. */
export interface Task_Bool_Exp {
  _and?: Maybe<Array<Task_Bool_Exp>>;
  _not?: Maybe<Task_Bool_Exp>;
  _or?: Maybe<Array<Task_Bool_Exp>>;
  created_at?: Maybe<Timestamptz_Comparison_Exp>;
  done_at?: Maybe<Timestamptz_Comparison_Exp>;
  id?: Maybe<Uuid_Comparison_Exp>;
  message?: Maybe<Message_Bool_Exp>;
  message_id?: Maybe<Uuid_Comparison_Exp>;
  seen_at?: Maybe<Timestamptz_Comparison_Exp>;
  type?: Maybe<String_Comparison_Exp>;
  user?: Maybe<User_Bool_Exp>;
  user_id?: Maybe<Uuid_Comparison_Exp>;
}

/** unique or primary key constraints on table "task" */
export type Task_Constraint =
  /** unique or primary key constraint */
  | 'task_pkey';

/** input type for inserting data into table "task" */
export interface Task_Insert_Input {
  created_at?: Maybe<Scalars['timestamptz']>;
  done_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  message?: Maybe<Message_Obj_Rel_Insert_Input>;
  message_id?: Maybe<Scalars['uuid']>;
  seen_at?: Maybe<Scalars['timestamptz']>;
  type?: Maybe<Scalars['String']>;
  user?: Maybe<User_Obj_Rel_Insert_Input>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** aggregate max on columns */
export interface Task_Max_Fields {
  __typename?: 'task_max_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  done_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  message_id?: Maybe<Scalars['uuid']>;
  seen_at?: Maybe<Scalars['timestamptz']>;
  type?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** order by max() on columns of table "task" */
export interface Task_Max_Order_By {
  created_at?: Maybe<Order_By>;
  done_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  message_id?: Maybe<Order_By>;
  seen_at?: Maybe<Order_By>;
  type?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
}

/** aggregate min on columns */
export interface Task_Min_Fields {
  __typename?: 'task_min_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  done_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  message_id?: Maybe<Scalars['uuid']>;
  seen_at?: Maybe<Scalars['timestamptz']>;
  type?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** order by min() on columns of table "task" */
export interface Task_Min_Order_By {
  created_at?: Maybe<Order_By>;
  done_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  message_id?: Maybe<Order_By>;
  seen_at?: Maybe<Order_By>;
  type?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
}

/** response of any mutation on the table "task" */
export interface Task_Mutation_Response {
  __typename?: 'task_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Task>;
}

/** on conflict condition type for table "task" */
export interface Task_On_Conflict {
  constraint: Task_Constraint;
  update_columns?: Array<Task_Update_Column>;
  where?: Maybe<Task_Bool_Exp>;
}

/** Ordering options when selecting data from "task". */
export interface Task_Order_By {
  created_at?: Maybe<Order_By>;
  done_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  message?: Maybe<Message_Order_By>;
  message_id?: Maybe<Order_By>;
  seen_at?: Maybe<Order_By>;
  type?: Maybe<Order_By>;
  user?: Maybe<User_Order_By>;
  user_id?: Maybe<Order_By>;
}

/** primary key columns input for table: task */
export interface Task_Pk_Columns_Input {
  id: Scalars['uuid'];
}

/** select columns of table "task" */
export type Task_Select_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'done_at'
  /** column name */
  | 'id'
  /** column name */
  | 'message_id'
  /** column name */
  | 'seen_at'
  /** column name */
  | 'type'
  /** column name */
  | 'user_id';

/** input type for updating data in table "task" */
export interface Task_Set_Input {
  created_at?: Maybe<Scalars['timestamptz']>;
  done_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  message_id?: Maybe<Scalars['uuid']>;
  seen_at?: Maybe<Scalars['timestamptz']>;
  type?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** update columns of table "task" */
export type Task_Update_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'done_at'
  /** column name */
  | 'id'
  /** column name */
  | 'message_id'
  /** column name */
  | 'seen_at'
  /** column name */
  | 'type'
  /** column name */
  | 'user_id';

/** columns and relationships of "team" */
export interface Team {
  __typename?: 'team';
  id: Scalars['uuid'];
  /** An array relationship */
  invitations: Array<Team_Invitation>;
  /** An aggregate relationship */
  invitations_aggregate: Team_Invitation_Aggregate;
  /** An array relationship */
  memberships: Array<Team_Member>;
  /** An aggregate relationship */
  memberships_aggregate: Team_Member_Aggregate;
  name: Scalars['String'];
  /** An object relationship */
  owner: User;
  owner_id: Scalars['uuid'];
  /** An object relationship */
  slack_installation?: Maybe<Team_Slack_Installation>;
  slug: Scalars['String'];
  /** An array relationship */
  spaces: Array<Space>;
  /** An aggregate relationship */
  spaces_aggregate: Space_Aggregate;
}


/** columns and relationships of "team" */
export interface TeamInvitationsArgs {
  distinct_on?: Maybe<Array<Team_Invitation_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Invitation_Order_By>>;
  where?: Maybe<Team_Invitation_Bool_Exp>;
}


/** columns and relationships of "team" */
export interface TeamInvitations_AggregateArgs {
  distinct_on?: Maybe<Array<Team_Invitation_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Invitation_Order_By>>;
  where?: Maybe<Team_Invitation_Bool_Exp>;
}


/** columns and relationships of "team" */
export interface TeamMembershipsArgs {
  distinct_on?: Maybe<Array<Team_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Member_Order_By>>;
  where?: Maybe<Team_Member_Bool_Exp>;
}


/** columns and relationships of "team" */
export interface TeamMemberships_AggregateArgs {
  distinct_on?: Maybe<Array<Team_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Member_Order_By>>;
  where?: Maybe<Team_Member_Bool_Exp>;
}


/** columns and relationships of "team" */
export interface TeamSpacesArgs {
  distinct_on?: Maybe<Array<Space_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Space_Order_By>>;
  where?: Maybe<Space_Bool_Exp>;
}


/** columns and relationships of "team" */
export interface TeamSpaces_AggregateArgs {
  distinct_on?: Maybe<Array<Space_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Space_Order_By>>;
  where?: Maybe<Space_Bool_Exp>;
}

/** aggregated selection of "team" */
export interface Team_Aggregate {
  __typename?: 'team_aggregate';
  aggregate?: Maybe<Team_Aggregate_Fields>;
  nodes: Array<Team>;
}

/** aggregate fields of "team" */
export interface Team_Aggregate_Fields {
  __typename?: 'team_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Team_Max_Fields>;
  min?: Maybe<Team_Min_Fields>;
}


/** aggregate fields of "team" */
export interface Team_Aggregate_FieldsCountArgs {
  columns?: Maybe<Array<Team_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
}

/** order by aggregate values of table "team" */
export interface Team_Aggregate_Order_By {
  count?: Maybe<Order_By>;
  max?: Maybe<Team_Max_Order_By>;
  min?: Maybe<Team_Min_Order_By>;
}

/** input type for inserting array relation for remote table "team" */
export interface Team_Arr_Rel_Insert_Input {
  data: Array<Team_Insert_Input>;
  /** on conflict condition */
  on_conflict?: Maybe<Team_On_Conflict>;
}

/** Boolean expression to filter rows from the table "team". All fields are combined with a logical 'AND'. */
export interface Team_Bool_Exp {
  _and?: Maybe<Array<Team_Bool_Exp>>;
  _not?: Maybe<Team_Bool_Exp>;
  _or?: Maybe<Array<Team_Bool_Exp>>;
  id?: Maybe<Uuid_Comparison_Exp>;
  invitations?: Maybe<Team_Invitation_Bool_Exp>;
  memberships?: Maybe<Team_Member_Bool_Exp>;
  name?: Maybe<String_Comparison_Exp>;
  owner?: Maybe<User_Bool_Exp>;
  owner_id?: Maybe<Uuid_Comparison_Exp>;
  slack_installation?: Maybe<Team_Slack_Installation_Bool_Exp>;
  slug?: Maybe<String_Comparison_Exp>;
  spaces?: Maybe<Space_Bool_Exp>;
}

/** unique or primary key constraints on table "team" */
export type Team_Constraint =
  /** unique or primary key constraint */
  | 'team_id_key'
  /** unique or primary key constraint */
  | 'team_pkey'
  /** unique or primary key constraint */
  | 'team_slug_key';

/** input type for inserting data into table "team" */
export interface Team_Insert_Input {
  id?: Maybe<Scalars['uuid']>;
  invitations?: Maybe<Team_Invitation_Arr_Rel_Insert_Input>;
  memberships?: Maybe<Team_Member_Arr_Rel_Insert_Input>;
  name?: Maybe<Scalars['String']>;
  owner?: Maybe<User_Obj_Rel_Insert_Input>;
  owner_id?: Maybe<Scalars['uuid']>;
  slack_installation?: Maybe<Team_Slack_Installation_Obj_Rel_Insert_Input>;
  slug?: Maybe<Scalars['String']>;
  spaces?: Maybe<Space_Arr_Rel_Insert_Input>;
}

/** columns and relationships of "team_invitation" */
export interface Team_Invitation {
  __typename?: 'team_invitation';
  created_at: Scalars['timestamptz'];
  email: Scalars['String'];
  id: Scalars['uuid'];
  /** An object relationship */
  inviting_user: User;
  inviting_user_id: Scalars['uuid'];
  /** An object relationship */
  team: Team;
  team_id: Scalars['uuid'];
  token: Scalars['uuid'];
  used_at?: Maybe<Scalars['date']>;
  /** An object relationship */
  used_by_user?: Maybe<User>;
  used_by_user_id?: Maybe<Scalars['uuid']>;
}

/** aggregated selection of "team_invitation" */
export interface Team_Invitation_Aggregate {
  __typename?: 'team_invitation_aggregate';
  aggregate?: Maybe<Team_Invitation_Aggregate_Fields>;
  nodes: Array<Team_Invitation>;
}

/** aggregate fields of "team_invitation" */
export interface Team_Invitation_Aggregate_Fields {
  __typename?: 'team_invitation_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Team_Invitation_Max_Fields>;
  min?: Maybe<Team_Invitation_Min_Fields>;
}


/** aggregate fields of "team_invitation" */
export interface Team_Invitation_Aggregate_FieldsCountArgs {
  columns?: Maybe<Array<Team_Invitation_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
}

/** order by aggregate values of table "team_invitation" */
export interface Team_Invitation_Aggregate_Order_By {
  count?: Maybe<Order_By>;
  max?: Maybe<Team_Invitation_Max_Order_By>;
  min?: Maybe<Team_Invitation_Min_Order_By>;
}

/** input type for inserting array relation for remote table "team_invitation" */
export interface Team_Invitation_Arr_Rel_Insert_Input {
  data: Array<Team_Invitation_Insert_Input>;
  /** on conflict condition */
  on_conflict?: Maybe<Team_Invitation_On_Conflict>;
}

/** Boolean expression to filter rows from the table "team_invitation". All fields are combined with a logical 'AND'. */
export interface Team_Invitation_Bool_Exp {
  _and?: Maybe<Array<Team_Invitation_Bool_Exp>>;
  _not?: Maybe<Team_Invitation_Bool_Exp>;
  _or?: Maybe<Array<Team_Invitation_Bool_Exp>>;
  created_at?: Maybe<Timestamptz_Comparison_Exp>;
  email?: Maybe<String_Comparison_Exp>;
  id?: Maybe<Uuid_Comparison_Exp>;
  inviting_user?: Maybe<User_Bool_Exp>;
  inviting_user_id?: Maybe<Uuid_Comparison_Exp>;
  team?: Maybe<Team_Bool_Exp>;
  team_id?: Maybe<Uuid_Comparison_Exp>;
  token?: Maybe<Uuid_Comparison_Exp>;
  used_at?: Maybe<Date_Comparison_Exp>;
  used_by_user?: Maybe<User_Bool_Exp>;
  used_by_user_id?: Maybe<Uuid_Comparison_Exp>;
}

/** unique or primary key constraints on table "team_invitation" */
export type Team_Invitation_Constraint =
  /** unique or primary key constraint */
  | 'team_invitation_pkey'
  /** unique or primary key constraint */
  | 'team_invitation_team_id_email_key'
  /** unique or primary key constraint */
  | 'team_invitation_token_key';

/** input type for inserting data into table "team_invitation" */
export interface Team_Invitation_Insert_Input {
  created_at?: Maybe<Scalars['timestamptz']>;
  email?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  inviting_user?: Maybe<User_Obj_Rel_Insert_Input>;
  inviting_user_id?: Maybe<Scalars['uuid']>;
  team?: Maybe<Team_Obj_Rel_Insert_Input>;
  team_id?: Maybe<Scalars['uuid']>;
  token?: Maybe<Scalars['uuid']>;
  used_at?: Maybe<Scalars['date']>;
  used_by_user?: Maybe<User_Obj_Rel_Insert_Input>;
  used_by_user_id?: Maybe<Scalars['uuid']>;
}

/** aggregate max on columns */
export interface Team_Invitation_Max_Fields {
  __typename?: 'team_invitation_max_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  email?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  inviting_user_id?: Maybe<Scalars['uuid']>;
  team_id?: Maybe<Scalars['uuid']>;
  token?: Maybe<Scalars['uuid']>;
  used_at?: Maybe<Scalars['date']>;
  used_by_user_id?: Maybe<Scalars['uuid']>;
}

/** order by max() on columns of table "team_invitation" */
export interface Team_Invitation_Max_Order_By {
  created_at?: Maybe<Order_By>;
  email?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  inviting_user_id?: Maybe<Order_By>;
  team_id?: Maybe<Order_By>;
  token?: Maybe<Order_By>;
  used_at?: Maybe<Order_By>;
  used_by_user_id?: Maybe<Order_By>;
}

/** aggregate min on columns */
export interface Team_Invitation_Min_Fields {
  __typename?: 'team_invitation_min_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  email?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  inviting_user_id?: Maybe<Scalars['uuid']>;
  team_id?: Maybe<Scalars['uuid']>;
  token?: Maybe<Scalars['uuid']>;
  used_at?: Maybe<Scalars['date']>;
  used_by_user_id?: Maybe<Scalars['uuid']>;
}

/** order by min() on columns of table "team_invitation" */
export interface Team_Invitation_Min_Order_By {
  created_at?: Maybe<Order_By>;
  email?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  inviting_user_id?: Maybe<Order_By>;
  team_id?: Maybe<Order_By>;
  token?: Maybe<Order_By>;
  used_at?: Maybe<Order_By>;
  used_by_user_id?: Maybe<Order_By>;
}

/** response of any mutation on the table "team_invitation" */
export interface Team_Invitation_Mutation_Response {
  __typename?: 'team_invitation_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Team_Invitation>;
}

/** on conflict condition type for table "team_invitation" */
export interface Team_Invitation_On_Conflict {
  constraint: Team_Invitation_Constraint;
  update_columns?: Array<Team_Invitation_Update_Column>;
  where?: Maybe<Team_Invitation_Bool_Exp>;
}

/** Ordering options when selecting data from "team_invitation". */
export interface Team_Invitation_Order_By {
  created_at?: Maybe<Order_By>;
  email?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  inviting_user?: Maybe<User_Order_By>;
  inviting_user_id?: Maybe<Order_By>;
  team?: Maybe<Team_Order_By>;
  team_id?: Maybe<Order_By>;
  token?: Maybe<Order_By>;
  used_at?: Maybe<Order_By>;
  used_by_user?: Maybe<User_Order_By>;
  used_by_user_id?: Maybe<Order_By>;
}

/** primary key columns input for table: team_invitation */
export interface Team_Invitation_Pk_Columns_Input {
  id: Scalars['uuid'];
}

/** select columns of table "team_invitation" */
export type Team_Invitation_Select_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'email'
  /** column name */
  | 'id'
  /** column name */
  | 'inviting_user_id'
  /** column name */
  | 'team_id'
  /** column name */
  | 'token'
  /** column name */
  | 'used_at'
  /** column name */
  | 'used_by_user_id';

/** input type for updating data in table "team_invitation" */
export interface Team_Invitation_Set_Input {
  created_at?: Maybe<Scalars['timestamptz']>;
  email?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  inviting_user_id?: Maybe<Scalars['uuid']>;
  team_id?: Maybe<Scalars['uuid']>;
  token?: Maybe<Scalars['uuid']>;
  used_at?: Maybe<Scalars['date']>;
  used_by_user_id?: Maybe<Scalars['uuid']>;
}

/** update columns of table "team_invitation" */
export type Team_Invitation_Update_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'email'
  /** column name */
  | 'id'
  /** column name */
  | 'inviting_user_id'
  /** column name */
  | 'team_id'
  /** column name */
  | 'token'
  /** column name */
  | 'used_at'
  /** column name */
  | 'used_by_user_id';

/** aggregate max on columns */
export interface Team_Max_Fields {
  __typename?: 'team_max_fields';
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  owner_id?: Maybe<Scalars['uuid']>;
  slug?: Maybe<Scalars['String']>;
}

/** order by max() on columns of table "team" */
export interface Team_Max_Order_By {
  id?: Maybe<Order_By>;
  name?: Maybe<Order_By>;
  owner_id?: Maybe<Order_By>;
  slug?: Maybe<Order_By>;
}

/** columns and relationships of "team_member" */
export interface Team_Member {
  __typename?: 'team_member';
  /** An object relationship */
  team: Team;
  team_id: Scalars['uuid'];
  /** An object relationship */
  user: User;
  user_id: Scalars['uuid'];
}

/** aggregated selection of "team_member" */
export interface Team_Member_Aggregate {
  __typename?: 'team_member_aggregate';
  aggregate?: Maybe<Team_Member_Aggregate_Fields>;
  nodes: Array<Team_Member>;
}

/** aggregate fields of "team_member" */
export interface Team_Member_Aggregate_Fields {
  __typename?: 'team_member_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Team_Member_Max_Fields>;
  min?: Maybe<Team_Member_Min_Fields>;
}


/** aggregate fields of "team_member" */
export interface Team_Member_Aggregate_FieldsCountArgs {
  columns?: Maybe<Array<Team_Member_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
}

/** order by aggregate values of table "team_member" */
export interface Team_Member_Aggregate_Order_By {
  count?: Maybe<Order_By>;
  max?: Maybe<Team_Member_Max_Order_By>;
  min?: Maybe<Team_Member_Min_Order_By>;
}

/** input type for inserting array relation for remote table "team_member" */
export interface Team_Member_Arr_Rel_Insert_Input {
  data: Array<Team_Member_Insert_Input>;
  /** on conflict condition */
  on_conflict?: Maybe<Team_Member_On_Conflict>;
}

/** Boolean expression to filter rows from the table "team_member". All fields are combined with a logical 'AND'. */
export interface Team_Member_Bool_Exp {
  _and?: Maybe<Array<Team_Member_Bool_Exp>>;
  _not?: Maybe<Team_Member_Bool_Exp>;
  _or?: Maybe<Array<Team_Member_Bool_Exp>>;
  team?: Maybe<Team_Bool_Exp>;
  team_id?: Maybe<Uuid_Comparison_Exp>;
  user?: Maybe<User_Bool_Exp>;
  user_id?: Maybe<Uuid_Comparison_Exp>;
}

/** unique or primary key constraints on table "team_member" */
export type Team_Member_Constraint =
  /** unique or primary key constraint */
  | 'team_membership_pkey';

/** input type for inserting data into table "team_member" */
export interface Team_Member_Insert_Input {
  team?: Maybe<Team_Obj_Rel_Insert_Input>;
  team_id?: Maybe<Scalars['uuid']>;
  user?: Maybe<User_Obj_Rel_Insert_Input>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** aggregate max on columns */
export interface Team_Member_Max_Fields {
  __typename?: 'team_member_max_fields';
  team_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** order by max() on columns of table "team_member" */
export interface Team_Member_Max_Order_By {
  team_id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
}

/** aggregate min on columns */
export interface Team_Member_Min_Fields {
  __typename?: 'team_member_min_fields';
  team_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** order by min() on columns of table "team_member" */
export interface Team_Member_Min_Order_By {
  team_id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
}

/** response of any mutation on the table "team_member" */
export interface Team_Member_Mutation_Response {
  __typename?: 'team_member_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Team_Member>;
}

/** on conflict condition type for table "team_member" */
export interface Team_Member_On_Conflict {
  constraint: Team_Member_Constraint;
  update_columns?: Array<Team_Member_Update_Column>;
  where?: Maybe<Team_Member_Bool_Exp>;
}

/** Ordering options when selecting data from "team_member". */
export interface Team_Member_Order_By {
  team?: Maybe<Team_Order_By>;
  team_id?: Maybe<Order_By>;
  user?: Maybe<User_Order_By>;
  user_id?: Maybe<Order_By>;
}

/** primary key columns input for table: team_member */
export interface Team_Member_Pk_Columns_Input {
  team_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
}

/** select columns of table "team_member" */
export type Team_Member_Select_Column =
  /** column name */
  | 'team_id'
  /** column name */
  | 'user_id';

/** input type for updating data in table "team_member" */
export interface Team_Member_Set_Input {
  team_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** update columns of table "team_member" */
export type Team_Member_Update_Column =
  /** column name */
  | 'team_id'
  /** column name */
  | 'user_id';

/** aggregate min on columns */
export interface Team_Min_Fields {
  __typename?: 'team_min_fields';
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  owner_id?: Maybe<Scalars['uuid']>;
  slug?: Maybe<Scalars['String']>;
}

/** order by min() on columns of table "team" */
export interface Team_Min_Order_By {
  id?: Maybe<Order_By>;
  name?: Maybe<Order_By>;
  owner_id?: Maybe<Order_By>;
  slug?: Maybe<Order_By>;
}

/** response of any mutation on the table "team" */
export interface Team_Mutation_Response {
  __typename?: 'team_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Team>;
}

/** input type for inserting object relation for remote table "team" */
export interface Team_Obj_Rel_Insert_Input {
  data: Team_Insert_Input;
  /** on conflict condition */
  on_conflict?: Maybe<Team_On_Conflict>;
}

/** on conflict condition type for table "team" */
export interface Team_On_Conflict {
  constraint: Team_Constraint;
  update_columns?: Array<Team_Update_Column>;
  where?: Maybe<Team_Bool_Exp>;
}

/** Ordering options when selecting data from "team". */
export interface Team_Order_By {
  id?: Maybe<Order_By>;
  invitations_aggregate?: Maybe<Team_Invitation_Aggregate_Order_By>;
  memberships_aggregate?: Maybe<Team_Member_Aggregate_Order_By>;
  name?: Maybe<Order_By>;
  owner?: Maybe<User_Order_By>;
  owner_id?: Maybe<Order_By>;
  slack_installation?: Maybe<Team_Slack_Installation_Order_By>;
  slug?: Maybe<Order_By>;
  spaces_aggregate?: Maybe<Space_Aggregate_Order_By>;
}

/** primary key columns input for table: team */
export interface Team_Pk_Columns_Input {
  id: Scalars['uuid'];
}

/** select columns of table "team" */
export type Team_Select_Column =
  /** column name */
  | 'id'
  /** column name */
  | 'name'
  /** column name */
  | 'owner_id'
  /** column name */
  | 'slug';

/** input type for updating data in table "team" */
export interface Team_Set_Input {
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  owner_id?: Maybe<Scalars['uuid']>;
  slug?: Maybe<Scalars['String']>;
}

/** columns and relationships of "team_slack_installation" */
export interface Team_Slack_Installation {
  __typename?: 'team_slack_installation';
  data: Scalars['jsonb'];
  /** An object relationship */
  team: Team;
  team_id: Scalars['uuid'];
}


/** columns and relationships of "team_slack_installation" */
export interface Team_Slack_InstallationDataArgs {
  path?: Maybe<Scalars['String']>;
}

/** aggregated selection of "team_slack_installation" */
export interface Team_Slack_Installation_Aggregate {
  __typename?: 'team_slack_installation_aggregate';
  aggregate?: Maybe<Team_Slack_Installation_Aggregate_Fields>;
  nodes: Array<Team_Slack_Installation>;
}

/** aggregate fields of "team_slack_installation" */
export interface Team_Slack_Installation_Aggregate_Fields {
  __typename?: 'team_slack_installation_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Team_Slack_Installation_Max_Fields>;
  min?: Maybe<Team_Slack_Installation_Min_Fields>;
}


/** aggregate fields of "team_slack_installation" */
export interface Team_Slack_Installation_Aggregate_FieldsCountArgs {
  columns?: Maybe<Array<Team_Slack_Installation_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
}

/** append existing jsonb value of filtered columns with new jsonb value */
export interface Team_Slack_Installation_Append_Input {
  data?: Maybe<Scalars['jsonb']>;
}

/** Boolean expression to filter rows from the table "team_slack_installation". All fields are combined with a logical 'AND'. */
export interface Team_Slack_Installation_Bool_Exp {
  _and?: Maybe<Array<Team_Slack_Installation_Bool_Exp>>;
  _not?: Maybe<Team_Slack_Installation_Bool_Exp>;
  _or?: Maybe<Array<Team_Slack_Installation_Bool_Exp>>;
  data?: Maybe<Jsonb_Comparison_Exp>;
  team?: Maybe<Team_Bool_Exp>;
  team_id?: Maybe<Uuid_Comparison_Exp>;
}

/** unique or primary key constraints on table "team_slack_installation" */
export type Team_Slack_Installation_Constraint =
  /** unique or primary key constraint */
  | 'team_slack_installation_pkey';

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export interface Team_Slack_Installation_Delete_At_Path_Input {
  data?: Maybe<Array<Scalars['String']>>;
}

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export interface Team_Slack_Installation_Delete_Elem_Input {
  data?: Maybe<Scalars['Int']>;
}

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export interface Team_Slack_Installation_Delete_Key_Input {
  data?: Maybe<Scalars['String']>;
}

/** input type for inserting data into table "team_slack_installation" */
export interface Team_Slack_Installation_Insert_Input {
  data?: Maybe<Scalars['jsonb']>;
  team?: Maybe<Team_Obj_Rel_Insert_Input>;
  team_id?: Maybe<Scalars['uuid']>;
}

/** aggregate max on columns */
export interface Team_Slack_Installation_Max_Fields {
  __typename?: 'team_slack_installation_max_fields';
  team_id?: Maybe<Scalars['uuid']>;
}

/** aggregate min on columns */
export interface Team_Slack_Installation_Min_Fields {
  __typename?: 'team_slack_installation_min_fields';
  team_id?: Maybe<Scalars['uuid']>;
}

/** response of any mutation on the table "team_slack_installation" */
export interface Team_Slack_Installation_Mutation_Response {
  __typename?: 'team_slack_installation_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Team_Slack_Installation>;
}

/** input type for inserting object relation for remote table "team_slack_installation" */
export interface Team_Slack_Installation_Obj_Rel_Insert_Input {
  data: Team_Slack_Installation_Insert_Input;
  /** on conflict condition */
  on_conflict?: Maybe<Team_Slack_Installation_On_Conflict>;
}

/** on conflict condition type for table "team_slack_installation" */
export interface Team_Slack_Installation_On_Conflict {
  constraint: Team_Slack_Installation_Constraint;
  update_columns?: Array<Team_Slack_Installation_Update_Column>;
  where?: Maybe<Team_Slack_Installation_Bool_Exp>;
}

/** Ordering options when selecting data from "team_slack_installation". */
export interface Team_Slack_Installation_Order_By {
  data?: Maybe<Order_By>;
  team?: Maybe<Team_Order_By>;
  team_id?: Maybe<Order_By>;
}

/** primary key columns input for table: team_slack_installation */
export interface Team_Slack_Installation_Pk_Columns_Input {
  team_id: Scalars['uuid'];
}

/** prepend existing jsonb value of filtered columns with new jsonb value */
export interface Team_Slack_Installation_Prepend_Input {
  data?: Maybe<Scalars['jsonb']>;
}

/** select columns of table "team_slack_installation" */
export type Team_Slack_Installation_Select_Column =
  /** column name */
  | 'data'
  /** column name */
  | 'team_id';

/** input type for updating data in table "team_slack_installation" */
export interface Team_Slack_Installation_Set_Input {
  data?: Maybe<Scalars['jsonb']>;
  team_id?: Maybe<Scalars['uuid']>;
}

/** update columns of table "team_slack_installation" */
export type Team_Slack_Installation_Update_Column =
  /** column name */
  | 'data'
  /** column name */
  | 'team_id';

/** update columns of table "team" */
export type Team_Update_Column =
  /** column name */
  | 'id'
  /** column name */
  | 'name'
  /** column name */
  | 'owner_id'
  /** column name */
  | 'slug';


/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
export interface Timestamp_Comparison_Exp {
  _eq?: Maybe<Scalars['timestamp']>;
  _gt?: Maybe<Scalars['timestamp']>;
  _gte?: Maybe<Scalars['timestamp']>;
  _in?: Maybe<Array<Scalars['timestamp']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['timestamp']>;
  _lte?: Maybe<Scalars['timestamp']>;
  _neq?: Maybe<Scalars['timestamp']>;
  _nin?: Maybe<Array<Scalars['timestamp']>>;
}


/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export interface Timestamptz_Comparison_Exp {
  _eq?: Maybe<Scalars['timestamptz']>;
  _gt?: Maybe<Scalars['timestamptz']>;
  _gte?: Maybe<Scalars['timestamptz']>;
  _in?: Maybe<Array<Scalars['timestamptz']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['timestamptz']>;
  _lte?: Maybe<Scalars['timestamptz']>;
  _neq?: Maybe<Scalars['timestamptz']>;
  _nin?: Maybe<Array<Scalars['timestamptz']>>;
}

/** columns and relationships of "topic" */
export interface Topic {
  __typename?: 'topic';
  archived_at?: Maybe<Scalars['timestamptz']>;
  closed_at?: Maybe<Scalars['timestamp']>;
  /** An object relationship */
  closed_by_user?: Maybe<User>;
  closed_by_user_id?: Maybe<Scalars['uuid']>;
  closing_summary?: Maybe<Scalars['String']>;
  id: Scalars['uuid'];
  index: Scalars['String'];
  /** An array relationship */
  members: Array<Topic_Member>;
  /** An aggregate relationship */
  members_aggregate: Topic_Member_Aggregate;
  /** An array relationship */
  messages: Array<Message>;
  /** An aggregate relationship */
  messages_aggregate: Message_Aggregate;
  name: Scalars['String'];
  /** An object relationship */
  owner: User;
  owner_id: Scalars['uuid'];
  /** An object relationship */
  room: Room;
  room_id: Scalars['uuid'];
  slug: Scalars['String'];
}


/** columns and relationships of "topic" */
export interface TopicMembersArgs {
  distinct_on?: Maybe<Array<Topic_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Topic_Member_Order_By>>;
  where?: Maybe<Topic_Member_Bool_Exp>;
}


/** columns and relationships of "topic" */
export interface TopicMembers_AggregateArgs {
  distinct_on?: Maybe<Array<Topic_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Topic_Member_Order_By>>;
  where?: Maybe<Topic_Member_Bool_Exp>;
}


/** columns and relationships of "topic" */
export interface TopicMessagesArgs {
  distinct_on?: Maybe<Array<Message_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Message_Order_By>>;
  where?: Maybe<Message_Bool_Exp>;
}


/** columns and relationships of "topic" */
export interface TopicMessages_AggregateArgs {
  distinct_on?: Maybe<Array<Message_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Message_Order_By>>;
  where?: Maybe<Message_Bool_Exp>;
}

/** aggregated selection of "topic" */
export interface Topic_Aggregate {
  __typename?: 'topic_aggregate';
  aggregate?: Maybe<Topic_Aggregate_Fields>;
  nodes: Array<Topic>;
}

/** aggregate fields of "topic" */
export interface Topic_Aggregate_Fields {
  __typename?: 'topic_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Topic_Max_Fields>;
  min?: Maybe<Topic_Min_Fields>;
}


/** aggregate fields of "topic" */
export interface Topic_Aggregate_FieldsCountArgs {
  columns?: Maybe<Array<Topic_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
}

/** order by aggregate values of table "topic" */
export interface Topic_Aggregate_Order_By {
  count?: Maybe<Order_By>;
  max?: Maybe<Topic_Max_Order_By>;
  min?: Maybe<Topic_Min_Order_By>;
}

/** input type for inserting array relation for remote table "topic" */
export interface Topic_Arr_Rel_Insert_Input {
  data: Array<Topic_Insert_Input>;
  /** on conflict condition */
  on_conflict?: Maybe<Topic_On_Conflict>;
}

/** Boolean expression to filter rows from the table "topic". All fields are combined with a logical 'AND'. */
export interface Topic_Bool_Exp {
  _and?: Maybe<Array<Topic_Bool_Exp>>;
  _not?: Maybe<Topic_Bool_Exp>;
  _or?: Maybe<Array<Topic_Bool_Exp>>;
  archived_at?: Maybe<Timestamptz_Comparison_Exp>;
  closed_at?: Maybe<Timestamp_Comparison_Exp>;
  closed_by_user?: Maybe<User_Bool_Exp>;
  closed_by_user_id?: Maybe<Uuid_Comparison_Exp>;
  closing_summary?: Maybe<String_Comparison_Exp>;
  id?: Maybe<Uuid_Comparison_Exp>;
  index?: Maybe<String_Comparison_Exp>;
  members?: Maybe<Topic_Member_Bool_Exp>;
  messages?: Maybe<Message_Bool_Exp>;
  name?: Maybe<String_Comparison_Exp>;
  owner?: Maybe<User_Bool_Exp>;
  owner_id?: Maybe<Uuid_Comparison_Exp>;
  room?: Maybe<Room_Bool_Exp>;
  room_id?: Maybe<Uuid_Comparison_Exp>;
  slug?: Maybe<String_Comparison_Exp>;
}

/** unique or primary key constraints on table "topic" */
export type Topic_Constraint =
  /** unique or primary key constraint */
  | 'thread_pkey'
  /** unique or primary key constraint */
  | 'topic_slug_room_id_key';

/** input type for inserting data into table "topic" */
export interface Topic_Insert_Input {
  archived_at?: Maybe<Scalars['timestamptz']>;
  closed_at?: Maybe<Scalars['timestamp']>;
  closed_by_user?: Maybe<User_Obj_Rel_Insert_Input>;
  closed_by_user_id?: Maybe<Scalars['uuid']>;
  closing_summary?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  index?: Maybe<Scalars['String']>;
  members?: Maybe<Topic_Member_Arr_Rel_Insert_Input>;
  messages?: Maybe<Message_Arr_Rel_Insert_Input>;
  name?: Maybe<Scalars['String']>;
  owner?: Maybe<User_Obj_Rel_Insert_Input>;
  owner_id?: Maybe<Scalars['uuid']>;
  room?: Maybe<Room_Obj_Rel_Insert_Input>;
  room_id?: Maybe<Scalars['uuid']>;
  slug?: Maybe<Scalars['String']>;
}

/** aggregate max on columns */
export interface Topic_Max_Fields {
  __typename?: 'topic_max_fields';
  archived_at?: Maybe<Scalars['timestamptz']>;
  closed_at?: Maybe<Scalars['timestamp']>;
  closed_by_user_id?: Maybe<Scalars['uuid']>;
  closing_summary?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  index?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  owner_id?: Maybe<Scalars['uuid']>;
  room_id?: Maybe<Scalars['uuid']>;
  slug?: Maybe<Scalars['String']>;
}

/** order by max() on columns of table "topic" */
export interface Topic_Max_Order_By {
  archived_at?: Maybe<Order_By>;
  closed_at?: Maybe<Order_By>;
  closed_by_user_id?: Maybe<Order_By>;
  closing_summary?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  index?: Maybe<Order_By>;
  name?: Maybe<Order_By>;
  owner_id?: Maybe<Order_By>;
  room_id?: Maybe<Order_By>;
  slug?: Maybe<Order_By>;
}

/** columns and relationships of "topic_member" */
export interface Topic_Member {
  __typename?: 'topic_member';
  /** An object relationship */
  topic: Topic;
  topic_id: Scalars['uuid'];
  /** An object relationship */
  user: User;
  user_id: Scalars['uuid'];
}

/** aggregated selection of "topic_member" */
export interface Topic_Member_Aggregate {
  __typename?: 'topic_member_aggregate';
  aggregate?: Maybe<Topic_Member_Aggregate_Fields>;
  nodes: Array<Topic_Member>;
}

/** aggregate fields of "topic_member" */
export interface Topic_Member_Aggregate_Fields {
  __typename?: 'topic_member_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Topic_Member_Max_Fields>;
  min?: Maybe<Topic_Member_Min_Fields>;
}


/** aggregate fields of "topic_member" */
export interface Topic_Member_Aggregate_FieldsCountArgs {
  columns?: Maybe<Array<Topic_Member_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
}

/** order by aggregate values of table "topic_member" */
export interface Topic_Member_Aggregate_Order_By {
  count?: Maybe<Order_By>;
  max?: Maybe<Topic_Member_Max_Order_By>;
  min?: Maybe<Topic_Member_Min_Order_By>;
}

/** input type for inserting array relation for remote table "topic_member" */
export interface Topic_Member_Arr_Rel_Insert_Input {
  data: Array<Topic_Member_Insert_Input>;
  /** on conflict condition */
  on_conflict?: Maybe<Topic_Member_On_Conflict>;
}

/** Boolean expression to filter rows from the table "topic_member". All fields are combined with a logical 'AND'. */
export interface Topic_Member_Bool_Exp {
  _and?: Maybe<Array<Topic_Member_Bool_Exp>>;
  _not?: Maybe<Topic_Member_Bool_Exp>;
  _or?: Maybe<Array<Topic_Member_Bool_Exp>>;
  topic?: Maybe<Topic_Bool_Exp>;
  topic_id?: Maybe<Uuid_Comparison_Exp>;
  user?: Maybe<User_Bool_Exp>;
  user_id?: Maybe<Uuid_Comparison_Exp>;
}

/** unique or primary key constraints on table "topic_member" */
export type Topic_Member_Constraint =
  /** unique or primary key constraint */
  | 'topic_participants_pkey';

/** input type for inserting data into table "topic_member" */
export interface Topic_Member_Insert_Input {
  topic?: Maybe<Topic_Obj_Rel_Insert_Input>;
  topic_id?: Maybe<Scalars['uuid']>;
  user?: Maybe<User_Obj_Rel_Insert_Input>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** aggregate max on columns */
export interface Topic_Member_Max_Fields {
  __typename?: 'topic_member_max_fields';
  topic_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** order by max() on columns of table "topic_member" */
export interface Topic_Member_Max_Order_By {
  topic_id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
}

/** aggregate min on columns */
export interface Topic_Member_Min_Fields {
  __typename?: 'topic_member_min_fields';
  topic_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** order by min() on columns of table "topic_member" */
export interface Topic_Member_Min_Order_By {
  topic_id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
}

/** response of any mutation on the table "topic_member" */
export interface Topic_Member_Mutation_Response {
  __typename?: 'topic_member_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Topic_Member>;
}

/** on conflict condition type for table "topic_member" */
export interface Topic_Member_On_Conflict {
  constraint: Topic_Member_Constraint;
  update_columns?: Array<Topic_Member_Update_Column>;
  where?: Maybe<Topic_Member_Bool_Exp>;
}

/** Ordering options when selecting data from "topic_member". */
export interface Topic_Member_Order_By {
  topic?: Maybe<Topic_Order_By>;
  topic_id?: Maybe<Order_By>;
  user?: Maybe<User_Order_By>;
  user_id?: Maybe<Order_By>;
}

/** primary key columns input for table: topic_member */
export interface Topic_Member_Pk_Columns_Input {
  topic_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
}

/** select columns of table "topic_member" */
export type Topic_Member_Select_Column =
  /** column name */
  | 'topic_id'
  /** column name */
  | 'user_id';

/** input type for updating data in table "topic_member" */
export interface Topic_Member_Set_Input {
  topic_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** update columns of table "topic_member" */
export type Topic_Member_Update_Column =
  /** column name */
  | 'topic_id'
  /** column name */
  | 'user_id';

/** aggregate min on columns */
export interface Topic_Min_Fields {
  __typename?: 'topic_min_fields';
  archived_at?: Maybe<Scalars['timestamptz']>;
  closed_at?: Maybe<Scalars['timestamp']>;
  closed_by_user_id?: Maybe<Scalars['uuid']>;
  closing_summary?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  index?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  owner_id?: Maybe<Scalars['uuid']>;
  room_id?: Maybe<Scalars['uuid']>;
  slug?: Maybe<Scalars['String']>;
}

/** order by min() on columns of table "topic" */
export interface Topic_Min_Order_By {
  archived_at?: Maybe<Order_By>;
  closed_at?: Maybe<Order_By>;
  closed_by_user_id?: Maybe<Order_By>;
  closing_summary?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  index?: Maybe<Order_By>;
  name?: Maybe<Order_By>;
  owner_id?: Maybe<Order_By>;
  room_id?: Maybe<Order_By>;
  slug?: Maybe<Order_By>;
}

/** response of any mutation on the table "topic" */
export interface Topic_Mutation_Response {
  __typename?: 'topic_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Topic>;
}

/** input type for inserting object relation for remote table "topic" */
export interface Topic_Obj_Rel_Insert_Input {
  data: Topic_Insert_Input;
  /** on conflict condition */
  on_conflict?: Maybe<Topic_On_Conflict>;
}

/** on conflict condition type for table "topic" */
export interface Topic_On_Conflict {
  constraint: Topic_Constraint;
  update_columns?: Array<Topic_Update_Column>;
  where?: Maybe<Topic_Bool_Exp>;
}

/** Ordering options when selecting data from "topic". */
export interface Topic_Order_By {
  archived_at?: Maybe<Order_By>;
  closed_at?: Maybe<Order_By>;
  closed_by_user?: Maybe<User_Order_By>;
  closed_by_user_id?: Maybe<Order_By>;
  closing_summary?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  index?: Maybe<Order_By>;
  members_aggregate?: Maybe<Topic_Member_Aggregate_Order_By>;
  messages_aggregate?: Maybe<Message_Aggregate_Order_By>;
  name?: Maybe<Order_By>;
  owner?: Maybe<User_Order_By>;
  owner_id?: Maybe<Order_By>;
  room?: Maybe<Room_Order_By>;
  room_id?: Maybe<Order_By>;
  slug?: Maybe<Order_By>;
}

/** primary key columns input for table: topic */
export interface Topic_Pk_Columns_Input {
  id: Scalars['uuid'];
}

/** select columns of table "topic" */
export type Topic_Select_Column =
  /** column name */
  | 'archived_at'
  /** column name */
  | 'closed_at'
  /** column name */
  | 'closed_by_user_id'
  /** column name */
  | 'closing_summary'
  /** column name */
  | 'id'
  /** column name */
  | 'index'
  /** column name */
  | 'name'
  /** column name */
  | 'owner_id'
  /** column name */
  | 'room_id'
  /** column name */
  | 'slug';

/** input type for updating data in table "topic" */
export interface Topic_Set_Input {
  archived_at?: Maybe<Scalars['timestamptz']>;
  closed_at?: Maybe<Scalars['timestamp']>;
  closed_by_user_id?: Maybe<Scalars['uuid']>;
  closing_summary?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  index?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  owner_id?: Maybe<Scalars['uuid']>;
  room_id?: Maybe<Scalars['uuid']>;
  slug?: Maybe<Scalars['String']>;
}

/** update columns of table "topic" */
export type Topic_Update_Column =
  /** column name */
  | 'archived_at'
  /** column name */
  | 'closed_at'
  /** column name */
  | 'closed_by_user_id'
  /** column name */
  | 'closing_summary'
  /** column name */
  | 'id'
  /** column name */
  | 'index'
  /** column name */
  | 'name'
  /** column name */
  | 'owner_id'
  /** column name */
  | 'room_id'
  /** column name */
  | 'slug';

/** columns and relationships of "transcription" */
export interface Transcription {
  __typename?: 'transcription';
  /** An array relationship */
  attachments: Array<Attachment>;
  /** An aggregate relationship */
  attachments_aggregate: Attachment_Aggregate;
  created_at: Scalars['timestamptz'];
  id: Scalars['uuid'];
  sonix_media_id: Scalars['String'];
  status: Transcription_Status_Enum;
  transcript?: Maybe<Scalars['jsonb']>;
  updated_at: Scalars['timestamptz'];
}


/** columns and relationships of "transcription" */
export interface TranscriptionAttachmentsArgs {
  distinct_on?: Maybe<Array<Attachment_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Attachment_Order_By>>;
  where?: Maybe<Attachment_Bool_Exp>;
}


/** columns and relationships of "transcription" */
export interface TranscriptionAttachments_AggregateArgs {
  distinct_on?: Maybe<Array<Attachment_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Attachment_Order_By>>;
  where?: Maybe<Attachment_Bool_Exp>;
}


/** columns and relationships of "transcription" */
export interface TranscriptionTranscriptArgs {
  path?: Maybe<Scalars['String']>;
}

/** aggregated selection of "transcription" */
export interface Transcription_Aggregate {
  __typename?: 'transcription_aggregate';
  aggregate?: Maybe<Transcription_Aggregate_Fields>;
  nodes: Array<Transcription>;
}

/** aggregate fields of "transcription" */
export interface Transcription_Aggregate_Fields {
  __typename?: 'transcription_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Transcription_Max_Fields>;
  min?: Maybe<Transcription_Min_Fields>;
}


/** aggregate fields of "transcription" */
export interface Transcription_Aggregate_FieldsCountArgs {
  columns?: Maybe<Array<Transcription_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
}

/** append existing jsonb value of filtered columns with new jsonb value */
export interface Transcription_Append_Input {
  transcript?: Maybe<Scalars['jsonb']>;
}

/** Boolean expression to filter rows from the table "transcription". All fields are combined with a logical 'AND'. */
export interface Transcription_Bool_Exp {
  _and?: Maybe<Array<Transcription_Bool_Exp>>;
  _not?: Maybe<Transcription_Bool_Exp>;
  _or?: Maybe<Array<Transcription_Bool_Exp>>;
  attachments?: Maybe<Attachment_Bool_Exp>;
  created_at?: Maybe<Timestamptz_Comparison_Exp>;
  id?: Maybe<Uuid_Comparison_Exp>;
  sonix_media_id?: Maybe<String_Comparison_Exp>;
  status?: Maybe<Transcription_Status_Enum_Comparison_Exp>;
  transcript?: Maybe<Jsonb_Comparison_Exp>;
  updated_at?: Maybe<Timestamptz_Comparison_Exp>;
}

/** unique or primary key constraints on table "transcription" */
export type Transcription_Constraint =
  /** unique or primary key constraint */
  | 'transcription_pkey'
  /** unique or primary key constraint */
  | 'transcription_sonix_media_id_key';

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export interface Transcription_Delete_At_Path_Input {
  transcript?: Maybe<Array<Scalars['String']>>;
}

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export interface Transcription_Delete_Elem_Input {
  transcript?: Maybe<Scalars['Int']>;
}

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export interface Transcription_Delete_Key_Input {
  transcript?: Maybe<Scalars['String']>;
}

/** input type for inserting data into table "transcription" */
export interface Transcription_Insert_Input {
  attachments?: Maybe<Attachment_Arr_Rel_Insert_Input>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  sonix_media_id?: Maybe<Scalars['String']>;
  status?: Maybe<Transcription_Status_Enum>;
  transcript?: Maybe<Scalars['jsonb']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
}

/** aggregate max on columns */
export interface Transcription_Max_Fields {
  __typename?: 'transcription_max_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  sonix_media_id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
}

/** aggregate min on columns */
export interface Transcription_Min_Fields {
  __typename?: 'transcription_min_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  sonix_media_id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
}

/** response of any mutation on the table "transcription" */
export interface Transcription_Mutation_Response {
  __typename?: 'transcription_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Transcription>;
}

/** input type for inserting object relation for remote table "transcription" */
export interface Transcription_Obj_Rel_Insert_Input {
  data: Transcription_Insert_Input;
  /** on conflict condition */
  on_conflict?: Maybe<Transcription_On_Conflict>;
}

/** on conflict condition type for table "transcription" */
export interface Transcription_On_Conflict {
  constraint: Transcription_Constraint;
  update_columns?: Array<Transcription_Update_Column>;
  where?: Maybe<Transcription_Bool_Exp>;
}

/** Ordering options when selecting data from "transcription". */
export interface Transcription_Order_By {
  attachments_aggregate?: Maybe<Attachment_Aggregate_Order_By>;
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  sonix_media_id?: Maybe<Order_By>;
  status?: Maybe<Order_By>;
  transcript?: Maybe<Order_By>;
  updated_at?: Maybe<Order_By>;
}

/** primary key columns input for table: transcription */
export interface Transcription_Pk_Columns_Input {
  id: Scalars['uuid'];
}

/** prepend existing jsonb value of filtered columns with new jsonb value */
export interface Transcription_Prepend_Input {
  transcript?: Maybe<Scalars['jsonb']>;
}

/** select columns of table "transcription" */
export type Transcription_Select_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'id'
  /** column name */
  | 'sonix_media_id'
  /** column name */
  | 'status'
  /** column name */
  | 'transcript'
  /** column name */
  | 'updated_at';

/** input type for updating data in table "transcription" */
export interface Transcription_Set_Input {
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  sonix_media_id?: Maybe<Scalars['String']>;
  status?: Maybe<Transcription_Status_Enum>;
  transcript?: Maybe<Scalars['jsonb']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
}

/** columns and relationships of "transcription_status" */
export interface Transcription_Status {
  __typename?: 'transcription_status';
  value: Scalars['String'];
}

/** aggregated selection of "transcription_status" */
export interface Transcription_Status_Aggregate {
  __typename?: 'transcription_status_aggregate';
  aggregate?: Maybe<Transcription_Status_Aggregate_Fields>;
  nodes: Array<Transcription_Status>;
}

/** aggregate fields of "transcription_status" */
export interface Transcription_Status_Aggregate_Fields {
  __typename?: 'transcription_status_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Transcription_Status_Max_Fields>;
  min?: Maybe<Transcription_Status_Min_Fields>;
}


/** aggregate fields of "transcription_status" */
export interface Transcription_Status_Aggregate_FieldsCountArgs {
  columns?: Maybe<Array<Transcription_Status_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
}

/** Boolean expression to filter rows from the table "transcription_status". All fields are combined with a logical 'AND'. */
export interface Transcription_Status_Bool_Exp {
  _and?: Maybe<Array<Transcription_Status_Bool_Exp>>;
  _not?: Maybe<Transcription_Status_Bool_Exp>;
  _or?: Maybe<Array<Transcription_Status_Bool_Exp>>;
  value?: Maybe<String_Comparison_Exp>;
}

/** unique or primary key constraints on table "transcription_status" */
export type Transcription_Status_Constraint =
  /** unique or primary key constraint */
  | 'transcription_status_pkey';

export type Transcription_Status_Enum =
  | 'blocked'
  | 'completed'
  | 'failed'
  | 'preparing'
  | 'transcribing';

/** Boolean expression to compare columns of type "transcription_status_enum". All fields are combined with logical 'AND'. */
export interface Transcription_Status_Enum_Comparison_Exp {
  _eq?: Maybe<Transcription_Status_Enum>;
  _in?: Maybe<Array<Transcription_Status_Enum>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _neq?: Maybe<Transcription_Status_Enum>;
  _nin?: Maybe<Array<Transcription_Status_Enum>>;
}

/** input type for inserting data into table "transcription_status" */
export interface Transcription_Status_Insert_Input {
  value?: Maybe<Scalars['String']>;
}

/** aggregate max on columns */
export interface Transcription_Status_Max_Fields {
  __typename?: 'transcription_status_max_fields';
  value?: Maybe<Scalars['String']>;
}

/** aggregate min on columns */
export interface Transcription_Status_Min_Fields {
  __typename?: 'transcription_status_min_fields';
  value?: Maybe<Scalars['String']>;
}

/** response of any mutation on the table "transcription_status" */
export interface Transcription_Status_Mutation_Response {
  __typename?: 'transcription_status_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Transcription_Status>;
}

/** on conflict condition type for table "transcription_status" */
export interface Transcription_Status_On_Conflict {
  constraint: Transcription_Status_Constraint;
  update_columns?: Array<Transcription_Status_Update_Column>;
  where?: Maybe<Transcription_Status_Bool_Exp>;
}

/** Ordering options when selecting data from "transcription_status". */
export interface Transcription_Status_Order_By {
  value?: Maybe<Order_By>;
}

/** primary key columns input for table: transcription_status */
export interface Transcription_Status_Pk_Columns_Input {
  value: Scalars['String'];
}

/** select columns of table "transcription_status" */
export type Transcription_Status_Select_Column =
  /** column name */
  | 'value';

/** input type for updating data in table "transcription_status" */
export interface Transcription_Status_Set_Input {
  value?: Maybe<Scalars['String']>;
}

/** update columns of table "transcription_status" */
export type Transcription_Status_Update_Column =
  /** column name */
  | 'value';

/** update columns of table "transcription" */
export type Transcription_Update_Column =
  /** column name */
  | 'created_at'
  /** column name */
  | 'id'
  /** column name */
  | 'sonix_media_id'
  /** column name */
  | 'status'
  /** column name */
  | 'transcript'
  /** column name */
  | 'updated_at';

/** columns and relationships of "unread_messages" */
export interface Unread_Messages {
  __typename?: 'unread_messages';
  room_id?: Maybe<Scalars['uuid']>;
  topic_id?: Maybe<Scalars['uuid']>;
  unread_messages?: Maybe<Scalars['bigint']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** aggregated selection of "unread_messages" */
export interface Unread_Messages_Aggregate {
  __typename?: 'unread_messages_aggregate';
  aggregate?: Maybe<Unread_Messages_Aggregate_Fields>;
  nodes: Array<Unread_Messages>;
}

/** aggregate fields of "unread_messages" */
export interface Unread_Messages_Aggregate_Fields {
  __typename?: 'unread_messages_aggregate_fields';
  avg?: Maybe<Unread_Messages_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Unread_Messages_Max_Fields>;
  min?: Maybe<Unread_Messages_Min_Fields>;
  stddev?: Maybe<Unread_Messages_Stddev_Fields>;
  stddev_pop?: Maybe<Unread_Messages_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Unread_Messages_Stddev_Samp_Fields>;
  sum?: Maybe<Unread_Messages_Sum_Fields>;
  var_pop?: Maybe<Unread_Messages_Var_Pop_Fields>;
  var_samp?: Maybe<Unread_Messages_Var_Samp_Fields>;
  variance?: Maybe<Unread_Messages_Variance_Fields>;
}


/** aggregate fields of "unread_messages" */
export interface Unread_Messages_Aggregate_FieldsCountArgs {
  columns?: Maybe<Array<Unread_Messages_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
}

/** aggregate avg on columns */
export interface Unread_Messages_Avg_Fields {
  __typename?: 'unread_messages_avg_fields';
  unread_messages?: Maybe<Scalars['Float']>;
}

/** Boolean expression to filter rows from the table "unread_messages". All fields are combined with a logical 'AND'. */
export interface Unread_Messages_Bool_Exp {
  _and?: Maybe<Array<Unread_Messages_Bool_Exp>>;
  _not?: Maybe<Unread_Messages_Bool_Exp>;
  _or?: Maybe<Array<Unread_Messages_Bool_Exp>>;
  room_id?: Maybe<Uuid_Comparison_Exp>;
  topic_id?: Maybe<Uuid_Comparison_Exp>;
  unread_messages?: Maybe<Bigint_Comparison_Exp>;
  user_id?: Maybe<Uuid_Comparison_Exp>;
}

/** aggregate max on columns */
export interface Unread_Messages_Max_Fields {
  __typename?: 'unread_messages_max_fields';
  room_id?: Maybe<Scalars['uuid']>;
  topic_id?: Maybe<Scalars['uuid']>;
  unread_messages?: Maybe<Scalars['bigint']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** aggregate min on columns */
export interface Unread_Messages_Min_Fields {
  __typename?: 'unread_messages_min_fields';
  room_id?: Maybe<Scalars['uuid']>;
  topic_id?: Maybe<Scalars['uuid']>;
  unread_messages?: Maybe<Scalars['bigint']>;
  user_id?: Maybe<Scalars['uuid']>;
}

/** Ordering options when selecting data from "unread_messages". */
export interface Unread_Messages_Order_By {
  room_id?: Maybe<Order_By>;
  topic_id?: Maybe<Order_By>;
  unread_messages?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
}

/** select columns of table "unread_messages" */
export type Unread_Messages_Select_Column =
  /** column name */
  | 'room_id'
  /** column name */
  | 'topic_id'
  /** column name */
  | 'unread_messages'
  /** column name */
  | 'user_id';

/** aggregate stddev on columns */
export interface Unread_Messages_Stddev_Fields {
  __typename?: 'unread_messages_stddev_fields';
  unread_messages?: Maybe<Scalars['Float']>;
}

/** aggregate stddev_pop on columns */
export interface Unread_Messages_Stddev_Pop_Fields {
  __typename?: 'unread_messages_stddev_pop_fields';
  unread_messages?: Maybe<Scalars['Float']>;
}

/** aggregate stddev_samp on columns */
export interface Unread_Messages_Stddev_Samp_Fields {
  __typename?: 'unread_messages_stddev_samp_fields';
  unread_messages?: Maybe<Scalars['Float']>;
}

/** aggregate sum on columns */
export interface Unread_Messages_Sum_Fields {
  __typename?: 'unread_messages_sum_fields';
  unread_messages?: Maybe<Scalars['bigint']>;
}

/** aggregate var_pop on columns */
export interface Unread_Messages_Var_Pop_Fields {
  __typename?: 'unread_messages_var_pop_fields';
  unread_messages?: Maybe<Scalars['Float']>;
}

/** aggregate var_samp on columns */
export interface Unread_Messages_Var_Samp_Fields {
  __typename?: 'unread_messages_var_samp_fields';
  unread_messages?: Maybe<Scalars['Float']>;
}

/** aggregate variance on columns */
export interface Unread_Messages_Variance_Fields {
  __typename?: 'unread_messages_variance_fields';
  unread_messages?: Maybe<Scalars['Float']>;
}

/** columns and relationships of "user" */
export interface User {
  __typename?: 'user';
  avatar_url?: Maybe<Scalars['String']>;
  created_at: Scalars['timestamptz'];
  /** An array relationship */
  created_room_invitations: Array<Room_Invitation>;
  /** An aggregate relationship */
  created_room_invitations_aggregate: Room_Invitation_Aggregate;
  /** An array relationship */
  created_rooms: Array<Room>;
  /** An aggregate relationship */
  created_rooms_aggregate: Room_Aggregate;
  /** An array relationship */
  created_team_invitations: Array<Team_Invitation>;
  /** An aggregate relationship */
  created_team_invitations_aggregate: Team_Invitation_Aggregate;
  /** An object relationship */
  current_team?: Maybe<Team>;
  current_team_id?: Maybe<Scalars['uuid']>;
  email?: Maybe<Scalars['String']>;
  email_verified?: Maybe<Scalars['timestamptz']>;
  id: Scalars['uuid'];
  /** An array relationship */
  messages: Array<Message>;
  /** An aggregate relationship */
  messages_aggregate: Message_Aggregate;
  name?: Maybe<Scalars['String']>;
  /** An array relationship */
  notifications: Array<Notification>;
  /** An aggregate relationship */
  notifications_aggregate: Notification_Aggregate;
  /** An array relationship */
  owned_teams: Array<Team>;
  /** An aggregate relationship */
  owned_teams_aggregate: Team_Aggregate;
  /** An array relationship */
  rooms: Array<Room_Member>;
  /** An aggregate relationship */
  rooms_aggregate: Room_Member_Aggregate;
  /** An array relationship */
  space_memberships: Array<Space_Member>;
  /** An aggregate relationship */
  space_memberships_aggregate: Space_Member_Aggregate;
  /** An array relationship */
  team_memberships: Array<Team_Member>;
  /** An aggregate relationship */
  team_memberships_aggregate: Team_Member_Aggregate;
  /** An array relationship */
  topic_memberships: Array<Topic_Member>;
  /** An aggregate relationship */
  topic_memberships_aggregate: Topic_Member_Aggregate;
}


/** columns and relationships of "user" */
export interface UserCreated_Room_InvitationsArgs {
  distinct_on?: Maybe<Array<Room_Invitation_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Invitation_Order_By>>;
  where?: Maybe<Room_Invitation_Bool_Exp>;
}


/** columns and relationships of "user" */
export interface UserCreated_Room_Invitations_AggregateArgs {
  distinct_on?: Maybe<Array<Room_Invitation_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Invitation_Order_By>>;
  where?: Maybe<Room_Invitation_Bool_Exp>;
}


/** columns and relationships of "user" */
export interface UserCreated_RoomsArgs {
  distinct_on?: Maybe<Array<Room_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Order_By>>;
  where?: Maybe<Room_Bool_Exp>;
}


/** columns and relationships of "user" */
export interface UserCreated_Rooms_AggregateArgs {
  distinct_on?: Maybe<Array<Room_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Order_By>>;
  where?: Maybe<Room_Bool_Exp>;
}


/** columns and relationships of "user" */
export interface UserCreated_Team_InvitationsArgs {
  distinct_on?: Maybe<Array<Team_Invitation_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Invitation_Order_By>>;
  where?: Maybe<Team_Invitation_Bool_Exp>;
}


/** columns and relationships of "user" */
export interface UserCreated_Team_Invitations_AggregateArgs {
  distinct_on?: Maybe<Array<Team_Invitation_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Invitation_Order_By>>;
  where?: Maybe<Team_Invitation_Bool_Exp>;
}


/** columns and relationships of "user" */
export interface UserMessagesArgs {
  distinct_on?: Maybe<Array<Message_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Message_Order_By>>;
  where?: Maybe<Message_Bool_Exp>;
}


/** columns and relationships of "user" */
export interface UserMessages_AggregateArgs {
  distinct_on?: Maybe<Array<Message_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Message_Order_By>>;
  where?: Maybe<Message_Bool_Exp>;
}


/** columns and relationships of "user" */
export interface UserNotificationsArgs {
  distinct_on?: Maybe<Array<Notification_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Notification_Order_By>>;
  where?: Maybe<Notification_Bool_Exp>;
}


/** columns and relationships of "user" */
export interface UserNotifications_AggregateArgs {
  distinct_on?: Maybe<Array<Notification_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Notification_Order_By>>;
  where?: Maybe<Notification_Bool_Exp>;
}


/** columns and relationships of "user" */
export interface UserOwned_TeamsArgs {
  distinct_on?: Maybe<Array<Team_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Order_By>>;
  where?: Maybe<Team_Bool_Exp>;
}


/** columns and relationships of "user" */
export interface UserOwned_Teams_AggregateArgs {
  distinct_on?: Maybe<Array<Team_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Order_By>>;
  where?: Maybe<Team_Bool_Exp>;
}


/** columns and relationships of "user" */
export interface UserRoomsArgs {
  distinct_on?: Maybe<Array<Room_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Member_Order_By>>;
  where?: Maybe<Room_Member_Bool_Exp>;
}


/** columns and relationships of "user" */
export interface UserRooms_AggregateArgs {
  distinct_on?: Maybe<Array<Room_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Member_Order_By>>;
  where?: Maybe<Room_Member_Bool_Exp>;
}


/** columns and relationships of "user" */
export interface UserSpace_MembershipsArgs {
  distinct_on?: Maybe<Array<Space_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Space_Member_Order_By>>;
  where?: Maybe<Space_Member_Bool_Exp>;
}


/** columns and relationships of "user" */
export interface UserSpace_Memberships_AggregateArgs {
  distinct_on?: Maybe<Array<Space_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Space_Member_Order_By>>;
  where?: Maybe<Space_Member_Bool_Exp>;
}


/** columns and relationships of "user" */
export interface UserTeam_MembershipsArgs {
  distinct_on?: Maybe<Array<Team_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Member_Order_By>>;
  where?: Maybe<Team_Member_Bool_Exp>;
}


/** columns and relationships of "user" */
export interface UserTeam_Memberships_AggregateArgs {
  distinct_on?: Maybe<Array<Team_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Member_Order_By>>;
  where?: Maybe<Team_Member_Bool_Exp>;
}


/** columns and relationships of "user" */
export interface UserTopic_MembershipsArgs {
  distinct_on?: Maybe<Array<Topic_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Topic_Member_Order_By>>;
  where?: Maybe<Topic_Member_Bool_Exp>;
}


/** columns and relationships of "user" */
export interface UserTopic_Memberships_AggregateArgs {
  distinct_on?: Maybe<Array<Topic_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Topic_Member_Order_By>>;
  where?: Maybe<Topic_Member_Bool_Exp>;
}

/** aggregated selection of "user" */
export interface User_Aggregate {
  __typename?: 'user_aggregate';
  aggregate?: Maybe<User_Aggregate_Fields>;
  nodes: Array<User>;
}

/** aggregate fields of "user" */
export interface User_Aggregate_Fields {
  __typename?: 'user_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<User_Max_Fields>;
  min?: Maybe<User_Min_Fields>;
}


/** aggregate fields of "user" */
export interface User_Aggregate_FieldsCountArgs {
  columns?: Maybe<Array<User_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
}

/** Boolean expression to filter rows from the table "user". All fields are combined with a logical 'AND'. */
export interface User_Bool_Exp {
  _and?: Maybe<Array<User_Bool_Exp>>;
  _not?: Maybe<User_Bool_Exp>;
  _or?: Maybe<Array<User_Bool_Exp>>;
  avatar_url?: Maybe<String_Comparison_Exp>;
  created_at?: Maybe<Timestamptz_Comparison_Exp>;
  created_room_invitations?: Maybe<Room_Invitation_Bool_Exp>;
  created_rooms?: Maybe<Room_Bool_Exp>;
  created_team_invitations?: Maybe<Team_Invitation_Bool_Exp>;
  current_team?: Maybe<Team_Bool_Exp>;
  current_team_id?: Maybe<Uuid_Comparison_Exp>;
  email?: Maybe<String_Comparison_Exp>;
  email_verified?: Maybe<Timestamptz_Comparison_Exp>;
  id?: Maybe<Uuid_Comparison_Exp>;
  messages?: Maybe<Message_Bool_Exp>;
  name?: Maybe<String_Comparison_Exp>;
  notifications?: Maybe<Notification_Bool_Exp>;
  owned_teams?: Maybe<Team_Bool_Exp>;
  rooms?: Maybe<Room_Member_Bool_Exp>;
  space_memberships?: Maybe<Space_Member_Bool_Exp>;
  team_memberships?: Maybe<Team_Member_Bool_Exp>;
  topic_memberships?: Maybe<Topic_Member_Bool_Exp>;
}

/** unique or primary key constraints on table "user" */
export type User_Constraint =
  /** unique or primary key constraint */
  | 'user_email_key'
  /** unique or primary key constraint */
  | 'user_pkey';

/** input type for inserting data into table "user" */
export interface User_Insert_Input {
  avatar_url?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  created_room_invitations?: Maybe<Room_Invitation_Arr_Rel_Insert_Input>;
  created_rooms?: Maybe<Room_Arr_Rel_Insert_Input>;
  created_team_invitations?: Maybe<Team_Invitation_Arr_Rel_Insert_Input>;
  current_team?: Maybe<Team_Obj_Rel_Insert_Input>;
  current_team_id?: Maybe<Scalars['uuid']>;
  email?: Maybe<Scalars['String']>;
  email_verified?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  messages?: Maybe<Message_Arr_Rel_Insert_Input>;
  name?: Maybe<Scalars['String']>;
  notifications?: Maybe<Notification_Arr_Rel_Insert_Input>;
  owned_teams?: Maybe<Team_Arr_Rel_Insert_Input>;
  rooms?: Maybe<Room_Member_Arr_Rel_Insert_Input>;
  space_memberships?: Maybe<Space_Member_Arr_Rel_Insert_Input>;
  team_memberships?: Maybe<Team_Member_Arr_Rel_Insert_Input>;
  topic_memberships?: Maybe<Topic_Member_Arr_Rel_Insert_Input>;
}

/** aggregate max on columns */
export interface User_Max_Fields {
  __typename?: 'user_max_fields';
  avatar_url?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  current_team_id?: Maybe<Scalars['uuid']>;
  email?: Maybe<Scalars['String']>;
  email_verified?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
}

/** aggregate min on columns */
export interface User_Min_Fields {
  __typename?: 'user_min_fields';
  avatar_url?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  current_team_id?: Maybe<Scalars['uuid']>;
  email?: Maybe<Scalars['String']>;
  email_verified?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
}

/** response of any mutation on the table "user" */
export interface User_Mutation_Response {
  __typename?: 'user_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<User>;
}

/** input type for inserting object relation for remote table "user" */
export interface User_Obj_Rel_Insert_Input {
  data: User_Insert_Input;
  /** on conflict condition */
  on_conflict?: Maybe<User_On_Conflict>;
}

/** on conflict condition type for table "user" */
export interface User_On_Conflict {
  constraint: User_Constraint;
  update_columns?: Array<User_Update_Column>;
  where?: Maybe<User_Bool_Exp>;
}

/** Ordering options when selecting data from "user". */
export interface User_Order_By {
  avatar_url?: Maybe<Order_By>;
  created_at?: Maybe<Order_By>;
  created_room_invitations_aggregate?: Maybe<Room_Invitation_Aggregate_Order_By>;
  created_rooms_aggregate?: Maybe<Room_Aggregate_Order_By>;
  created_team_invitations_aggregate?: Maybe<Team_Invitation_Aggregate_Order_By>;
  current_team?: Maybe<Team_Order_By>;
  current_team_id?: Maybe<Order_By>;
  email?: Maybe<Order_By>;
  email_verified?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  messages_aggregate?: Maybe<Message_Aggregate_Order_By>;
  name?: Maybe<Order_By>;
  notifications_aggregate?: Maybe<Notification_Aggregate_Order_By>;
  owned_teams_aggregate?: Maybe<Team_Aggregate_Order_By>;
  rooms_aggregate?: Maybe<Room_Member_Aggregate_Order_By>;
  space_memberships_aggregate?: Maybe<Space_Member_Aggregate_Order_By>;
  team_memberships_aggregate?: Maybe<Team_Member_Aggregate_Order_By>;
  topic_memberships_aggregate?: Maybe<Topic_Member_Aggregate_Order_By>;
}

/** primary key columns input for table: user */
export interface User_Pk_Columns_Input {
  id: Scalars['uuid'];
}

/** select columns of table "user" */
export type User_Select_Column =
  /** column name */
  | 'avatar_url'
  /** column name */
  | 'created_at'
  /** column name */
  | 'current_team_id'
  /** column name */
  | 'email'
  /** column name */
  | 'email_verified'
  /** column name */
  | 'id'
  /** column name */
  | 'name';

/** input type for updating data in table "user" */
export interface User_Set_Input {
  avatar_url?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  current_team_id?: Maybe<Scalars['uuid']>;
  email?: Maybe<Scalars['String']>;
  email_verified?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
}

/** update columns of table "user" */
export type User_Update_Column =
  /** column name */
  | 'avatar_url'
  /** column name */
  | 'created_at'
  /** column name */
  | 'current_team_id'
  /** column name */
  | 'email'
  /** column name */
  | 'email_verified'
  /** column name */
  | 'id'
  /** column name */
  | 'name';


/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export interface Uuid_Comparison_Exp {
  _eq?: Maybe<Scalars['uuid']>;
  _gt?: Maybe<Scalars['uuid']>;
  _gte?: Maybe<Scalars['uuid']>;
  _in?: Maybe<Array<Scalars['uuid']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['uuid']>;
  _lte?: Maybe<Scalars['uuid']>;
  _neq?: Maybe<Scalars['uuid']>;
  _nin?: Maybe<Array<Scalars['uuid']>>;
}

/** columns and relationships of "whitelist" */
export interface Whitelist {
  __typename?: 'whitelist';
  email: Scalars['String'];
  is_approved: Scalars['Boolean'];
  timestamp: Scalars['timestamptz'];
}

/** aggregated selection of "whitelist" */
export interface Whitelist_Aggregate {
  __typename?: 'whitelist_aggregate';
  aggregate?: Maybe<Whitelist_Aggregate_Fields>;
  nodes: Array<Whitelist>;
}

/** aggregate fields of "whitelist" */
export interface Whitelist_Aggregate_Fields {
  __typename?: 'whitelist_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Whitelist_Max_Fields>;
  min?: Maybe<Whitelist_Min_Fields>;
}


/** aggregate fields of "whitelist" */
export interface Whitelist_Aggregate_FieldsCountArgs {
  columns?: Maybe<Array<Whitelist_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
}

/** Boolean expression to filter rows from the table "whitelist". All fields are combined with a logical 'AND'. */
export interface Whitelist_Bool_Exp {
  _and?: Maybe<Array<Whitelist_Bool_Exp>>;
  _not?: Maybe<Whitelist_Bool_Exp>;
  _or?: Maybe<Array<Whitelist_Bool_Exp>>;
  email?: Maybe<String_Comparison_Exp>;
  is_approved?: Maybe<Boolean_Comparison_Exp>;
  timestamp?: Maybe<Timestamptz_Comparison_Exp>;
}

/** unique or primary key constraints on table "whitelist" */
export type Whitelist_Constraint =
  /** unique or primary key constraint */
  | 'whitelist_pkey';

/** input type for inserting data into table "whitelist" */
export interface Whitelist_Insert_Input {
  email?: Maybe<Scalars['String']>;
  is_approved?: Maybe<Scalars['Boolean']>;
  timestamp?: Maybe<Scalars['timestamptz']>;
}

/** aggregate max on columns */
export interface Whitelist_Max_Fields {
  __typename?: 'whitelist_max_fields';
  email?: Maybe<Scalars['String']>;
  timestamp?: Maybe<Scalars['timestamptz']>;
}

/** aggregate min on columns */
export interface Whitelist_Min_Fields {
  __typename?: 'whitelist_min_fields';
  email?: Maybe<Scalars['String']>;
  timestamp?: Maybe<Scalars['timestamptz']>;
}

/** response of any mutation on the table "whitelist" */
export interface Whitelist_Mutation_Response {
  __typename?: 'whitelist_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Whitelist>;
}

/** on conflict condition type for table "whitelist" */
export interface Whitelist_On_Conflict {
  constraint: Whitelist_Constraint;
  update_columns?: Array<Whitelist_Update_Column>;
  where?: Maybe<Whitelist_Bool_Exp>;
}

/** Ordering options when selecting data from "whitelist". */
export interface Whitelist_Order_By {
  email?: Maybe<Order_By>;
  is_approved?: Maybe<Order_By>;
  timestamp?: Maybe<Order_By>;
}

/** primary key columns input for table: whitelist */
export interface Whitelist_Pk_Columns_Input {
  email: Scalars['String'];
}

/** select columns of table "whitelist" */
export type Whitelist_Select_Column =
  /** column name */
  | 'email'
  /** column name */
  | 'is_approved'
  /** column name */
  | 'timestamp';

/** input type for updating data in table "whitelist" */
export interface Whitelist_Set_Input {
  email?: Maybe<Scalars['String']>;
  is_approved?: Maybe<Scalars['Boolean']>;
  timestamp?: Maybe<Scalars['timestamptz']>;
}

/** update columns of table "whitelist" */
export type Whitelist_Update_Column =
  /** column name */
  | 'email'
  /** column name */
  | 'is_approved'
  /** column name */
  | 'timestamp';

export type RoomSummaryPageQueryVariables = Exact<{
  roomId: Scalars['uuid'];
}>;


export type RoomSummaryPageQuery = (
  { __typename?: 'query_root' }
  & { room?: Maybe<(
    { __typename?: 'room' }
    & RoomSummaryView_RoomFragment
  )> }
);

export type AttachmentDetailedInfoFragment = (
  { __typename?: 'attachment' }
  & Pick<Attachment, 'id'>
  & { originalName: Attachment['original_name'], mimeType: Attachment['mime_type'] }
  & { message?: Maybe<(
    { __typename?: 'message' }
    & Pick<Message, 'id' | 'user_id' | 'type'>
  )>, transcription?: Maybe<(
    { __typename?: 'transcription' }
    & Pick<Transcription, 'status' | 'transcript'>
  )> }
);

export type UpdateAttachmentMutationVariables = Exact<{
  id: Scalars['uuid'];
  input: Attachment_Set_Input;
}>;


export type UpdateAttachmentMutation = (
  { __typename?: 'mutation_root' }
  & { update_attachment_by_pk?: Maybe<(
    { __typename?: 'attachment' }
    & AttachmentDetailedInfoFragment
  )> }
);

export type RemoveAttachmentMutationVariables = Exact<{
  id: Scalars['uuid'];
}>;


export type RemoveAttachmentMutation = (
  { __typename?: 'mutation_root' }
  & { delete_attachment_by_pk?: Maybe<(
    { __typename?: 'attachment' }
    & Pick<Attachment, 'id' | 'message_id'>
  )> }
);

export type UploadUrlQueryVariables = Exact<{
  fileName: Scalars['String'];
  mimeType: Scalars['String'];
}>;


export type UploadUrlQuery = (
  { __typename?: 'query_root' }
  & { uploadUrlInfo?: Maybe<(
    { __typename?: 'UploadUrlResponse' }
    & Pick<UploadUrlResponse, 'uploadUrl' | 'uuid'>
  )> }
);

export type AttachmentQueryVariables = Exact<{
  id: Scalars['uuid'];
}>;


export type AttachmentQuery = (
  { __typename?: 'query_root' }
  & { attachment?: Maybe<(
    { __typename?: 'attachment' }
    & AttachmentDetailedInfoFragment
  )> }
);

export type MessageBasicInfoFragment = (
  { __typename?: 'message' }
  & Pick<Message, 'id' | 'content' | 'type'>
  & { createdAt: Message['created_at'] }
  & { user: (
    { __typename?: 'user' }
    & UserBasicInfoFragment
  ) }
);

export type MessageDetailedInfoFragment = (
  { __typename?: 'message' }
  & { message_attachments: Array<(
    { __typename?: 'attachment' }
    & AttachmentDetailedInfoFragment
  )>, message_reactions: Array<(
    { __typename?: 'message_reaction' }
    & ReactionBasicInfoFragment
  )>, tasks: Array<(
    { __typename?: 'task' }
    & TaskBasicInfoFragment
  )> }
  & MessageBasicInfoFragment
);

export type MessageFeedInfoFragment = (
  { __typename?: 'message' }
  & { replied_to_message?: Maybe<(
    { __typename?: 'message' }
    & MessageDetailedInfoFragment
  )> }
  & MessageDetailedInfoFragment
);

export type DeleteTextMessageMutationVariables = Exact<{
  id: Scalars['uuid'];
}>;


export type DeleteTextMessageMutation = (
  { __typename?: 'mutation_root' }
  & { delete_message?: Maybe<(
    { __typename?: 'message_mutation_response' }
    & { message: Array<(
      { __typename?: 'message' }
      & Pick<Message, 'id'>
    )> }
  )> }
);

export type NotificationInfoFragment = (
  { __typename?: 'notification' }
  & Pick<Notification, 'id' | 'created_at' | 'data' | 'read_at'>
);

export type NotificationsQueryVariables = Exact<{ [key: string]: never; }>;


export type NotificationsQuery = (
  { __typename?: 'query_root' }
  & { notification: Array<(
    { __typename?: 'notification' }
    & NotificationInfoFragment
  )> }
);

export type UnreadNotificationsQueryVariables = Exact<{ [key: string]: never; }>;


export type UnreadNotificationsQuery = (
  { __typename?: 'query_root' }
  & { notification: Array<(
    { __typename?: 'notification' }
    & NotificationInfoFragment
  )> }
);

export type MarkNotificationAsReadMutationVariables = Exact<{
  id: Scalars['uuid'];
  date?: Maybe<Scalars['timestamptz']>;
}>;


export type MarkNotificationAsReadMutation = (
  { __typename?: 'mutation_root' }
  & { update_notification?: Maybe<(
    { __typename?: 'notification_mutation_response' }
    & { returning: Array<(
      { __typename?: 'notification' }
      & NotificationInfoFragment
    )> }
  )> }
);

export type RemoveNotificationMutationVariables = Exact<{
  id: Scalars['uuid'];
}>;


export type RemoveNotificationMutation = (
  { __typename?: 'mutation_root' }
  & { delete_notification_by_pk?: Maybe<(
    { __typename?: 'notification' }
    & NotificationInfoFragment
  )> }
);

export type MarkAllNotificationsAsReadMutationVariables = Exact<{
  date?: Maybe<Scalars['timestamptz']>;
}>;


export type MarkAllNotificationsAsReadMutation = (
  { __typename?: 'mutation_root' }
  & { update_notification?: Maybe<(
    { __typename?: 'notification_mutation_response' }
    & { returning: Array<(
      { __typename?: 'notification' }
      & NotificationInfoFragment
    )> }
  )> }
);

export type DeleteAllReadNotificationsMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteAllReadNotificationsMutation = (
  { __typename?: 'mutation_root' }
  & { delete_notification?: Maybe<(
    { __typename?: 'notification_mutation_response' }
    & Pick<Notification_Mutation_Response, 'affected_rows'>
  )> }
);

export type MarkNotificationAsUnreadMutationVariables = Exact<{
  id: Scalars['uuid'];
}>;


export type MarkNotificationAsUnreadMutation = (
  { __typename?: 'mutation_root' }
  & { update_notification?: Maybe<(
    { __typename?: 'notification_mutation_response' }
    & { returning: Array<(
      { __typename?: 'notification' }
      & NotificationInfoFragment
    )> }
  )> }
);

export type ReactionBasicInfoFragment = (
  { __typename?: 'message_reaction' }
  & Pick<Message_Reaction, 'emoji'>
  & { user: (
    { __typename?: 'user' }
    & UserBasicInfoFragment
  ) }
);

export type AddMessageReactionMutationVariables = Exact<{
  input: Message_Reaction_Insert_Input;
}>;


export type AddMessageReactionMutation = (
  { __typename?: 'mutation_root' }
  & { insert_message_reaction_one?: Maybe<(
    { __typename?: 'message_reaction' }
    & ReactionBasicInfoFragment
  )> }
);

export type RemoveMessageReactionMutationVariables = Exact<{
  emoji: Scalars['String'];
  messageId: Scalars['uuid'];
  userId: Scalars['uuid'];
}>;


export type RemoveMessageReactionMutation = (
  { __typename?: 'mutation_root' }
  & { delete_message_reaction_by_pk?: Maybe<(
    { __typename?: 'message_reaction' }
    & Pick<Message_Reaction, 'message_id'>
  )> }
);

export type RoomInvitationBasicInfoFragment = (
  { __typename?: 'room_invitation' }
  & Pick<Room_Invitation, 'email' | 'id' | 'used_at'>
);

export type CreateRoomInvitationMutationVariables = Exact<{
  roomId: Scalars['uuid'];
  teamId: Scalars['uuid'];
  email: Scalars['String'];
}>;


export type CreateRoomInvitationMutation = (
  { __typename?: 'mutation_root' }
  & { insert_room_invitation_one?: Maybe<(
    { __typename?: 'room_invitation' }
    & RoomInvitationBasicInfoFragment
  )> }
);

export type RemoveRoomInvitationMutationVariables = Exact<{
  id: Scalars['uuid'];
}>;


export type RemoveRoomInvitationMutation = (
  { __typename?: 'mutation_root' }
  & { delete_room_invitation_by_pk?: Maybe<(
    { __typename?: 'room_invitation' }
    & Pick<Room_Invitation, 'room_id'>
  )> }
);

export type RoomInvitationViewQueryVariables = Exact<{
  token: Scalars['String'];
}>;


export type RoomInvitationViewQuery = (
  { __typename?: 'query_root' }
  & { invitation?: Maybe<(
    { __typename?: 'RoomInvitationViewResponse' }
    & Pick<RoomInvitationViewResponse, 'room_name' | 'inviter_name'>
  )> }
);

export type PrivateRoomInfoFragment = (
  { __typename?: 'room' }
  & Pick<Room, 'id' | 'name' | 'is_private'>
);

export type RoomBasicInfoFragment = (
  { __typename?: 'room' }
  & Pick<Room, 'space_id' | 'deadline' | 'summary' | 'finished_at' | 'source_google_calendar_event_id' | 'last_activity_at'>
  & { owner: (
    { __typename?: 'user' }
    & UserBasicInfoFragment
  ), members: Array<(
    { __typename?: 'room_member' }
    & { user: (
      { __typename?: 'user' }
      & UserBasicInfoFragment
    ) }
  )>, space: (
    { __typename?: 'space' }
    & Pick<Space, 'id' | 'name'>
  ) }
  & PrivateRoomInfoFragment
);

export type RoomDetailedInfoFragment = (
  { __typename?: 'room' }
  & { topics: Array<(
    { __typename?: 'topic' }
    & TopicDetailedInfoFragment
  )>, invitations: Array<(
    { __typename?: 'room_invitation' }
    & RoomInvitationBasicInfoFragment
  )> }
  & RoomBasicInfoFragment
);

export type RoomsQueryVariables = Exact<{
  limit?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Array<Room_Order_By> | Room_Order_By>;
  where?: Maybe<Room_Bool_Exp>;
}>;


export type RoomsQuery = (
  { __typename?: 'query_root' }
  & { rooms: Array<(
    { __typename?: 'room' }
    & RoomDetailedInfoFragment
  )> }
);

export type SinglePrivateRoomQueryVariables = Exact<{
  id: Scalars['uuid'];
}>;


export type SinglePrivateRoomQuery = (
  { __typename?: 'query_root' }
  & { privateRoom?: Maybe<(
    { __typename?: 'room' }
    & PrivateRoomInfoFragment
  )> }
);

export type SingleRoomQueryVariables = Exact<{
  id: Scalars['uuid'];
}>;


export type SingleRoomQuery = (
  { __typename?: 'query_root' }
  & { room?: Maybe<(
    { __typename?: 'room' }
    & RoomDetailedInfoFragment
  )> }
);

export type IsCurrentUserRoomMember_RoomFragment = (
  { __typename?: 'room' }
  & { members: Array<(
    { __typename?: 'room_member' }
    & { user: (
      { __typename?: 'user' }
      & Pick<User, 'id'>
    ) }
  )> }
);

export type CreateRoomMutationVariables = Exact<{
  input: Room_Insert_Input;
}>;


export type CreateRoomMutation = (
  { __typename?: 'mutation_root' }
  & { room?: Maybe<(
    { __typename?: 'room' }
    & Pick<Room, 'id'>
  )> }
);

export type DeleteRoomMutationVariables = Exact<{
  id: Scalars['uuid'];
}>;


export type DeleteRoomMutation = (
  { __typename?: 'mutation_root' }
  & { room?: Maybe<(
    { __typename?: 'room' }
    & Pick<Room, 'id'>
  )> }
);

export type SearchResultsQueryVariables = Exact<{
  term: Scalars['String'];
}>;


export type SearchResultsQuery = (
  { __typename?: 'query_root' }
  & { spaces: Array<(
    { __typename?: 'space' }
    & Pick<Space, 'id' | 'name'>
  )>, rooms: Array<(
    { __typename?: 'room' }
    & Pick<Room, 'id' | 'name'>
    & { space: (
      { __typename?: 'space' }
      & Pick<Space, 'id' | 'name'>
    ) }
  )>, topics: Array<(
    { __typename?: 'topic' }
    & Pick<Topic, 'id' | 'name'>
    & { room: (
      { __typename?: 'room' }
      & Pick<Room, 'id' | 'name'>
      & { space: (
        { __typename?: 'space' }
        & Pick<Space, 'id' | 'name'>
      ) }
    ) }
  )>, messages: Array<(
    { __typename?: 'message' }
    & Pick<Message, 'id' | 'content_text'>
    & { topic: (
      { __typename?: 'topic' }
      & Pick<Topic, 'id' | 'name'>
      & { room: (
        { __typename?: 'room' }
        & Pick<Room, 'id' | 'name'>
        & { space: (
          { __typename?: 'space' }
          & Pick<Space, 'id' | 'name'>
        ) }
      ) }
    ) }
  )> }
);

export type SpaceBasicInfoFragment = (
  { __typename?: 'space' }
  & Pick<Space, 'id' | 'name'>
  & { members: Array<(
    { __typename?: 'space_member' }
    & Pick<Space_Member, 'space_id' | 'user_id'>
    & { user: (
      { __typename?: 'user' }
      & UserBasicInfoFragment
    ) }
  )> }
);

export type SpaceDetailedInfoFragment = (
  { __typename?: 'space' }
  & Pick<Space, 'team_id'>
  & { rooms: Array<(
    { __typename?: 'room' }
    & RoomDetailedInfoFragment
  )> }
  & SpaceBasicInfoFragment
);

export type TeamSpacesQueryVariables = Exact<{
  teamId: Scalars['uuid'];
}>;


export type TeamSpacesQuery = (
  { __typename?: 'query_root' }
  & { space: Array<(
    { __typename?: 'space' }
    & SpaceDetailedInfoFragment
  )> }
);

export type SpacesQueryVariables = Exact<{
  where: Space_Bool_Exp;
  limit?: Maybe<Scalars['Int']>;
}>;


export type SpacesQuery = (
  { __typename?: 'query_root' }
  & { space: Array<(
    { __typename?: 'space' }
    & SpaceDetailedInfoFragment
  )> }
);

export type SingleSpaceQueryVariables = Exact<{
  id: Scalars['uuid'];
}>;


export type SingleSpaceQuery = (
  { __typename?: 'query_root' }
  & { space?: Maybe<(
    { __typename?: 'space' }
    & SpaceDetailedInfoFragment
  )> }
);

export type IsCurrentUserSpaceMember_SpaceFragment = (
  { __typename?: 'space' }
  & { members: Array<(
    { __typename?: 'space_member' }
    & Pick<Space_Member, 'space_id' | 'user_id'>
    & { user: (
      { __typename?: 'user' }
      & Pick<User, 'id'>
    ) }
  )> }
);

export type CreateSpaceMutationVariables = Exact<{
  input: Space_Insert_Input;
}>;


export type CreateSpaceMutation = (
  { __typename?: 'mutation_root' }
  & { space?: Maybe<(
    { __typename?: 'space' }
    & SpaceBasicInfoFragment
  )> }
);

export type EditSpaceMutationVariables = Exact<{
  spaceId: Scalars['uuid'];
  input: Space_Set_Input;
}>;


export type EditSpaceMutation = (
  { __typename?: 'mutation_root' }
  & { space?: Maybe<(
    { __typename?: 'space' }
    & SpaceDetailedInfoFragment
  )> }
);

export type DeleteSpaceMutationVariables = Exact<{
  spaceId: Scalars['uuid'];
}>;


export type DeleteSpaceMutation = (
  { __typename?: 'mutation_root' }
  & { deletedSpace?: Maybe<(
    { __typename?: 'space' }
    & SpaceDetailedInfoFragment
  )> }
);

export type AddSpaceMemberMutationVariables = Exact<{
  spaceId: Scalars['uuid'];
  userId: Scalars['uuid'];
}>;


export type AddSpaceMemberMutation = (
  { __typename?: 'mutation_root' }
  & { insert_space_member_one?: Maybe<(
    { __typename?: 'space_member' }
    & Pick<Space_Member, 'space_id' | 'user_id'>
  )> }
);

export type RemoveSpaceMemberMutationVariables = Exact<{
  spaceId: Scalars['uuid'];
  userId: Scalars['uuid'];
}>;


export type RemoveSpaceMemberMutation = (
  { __typename?: 'mutation_root' }
  & { delete_space_member?: Maybe<(
    { __typename?: 'space_member_mutation_response' }
    & Pick<Space_Member_Mutation_Response, 'affected_rows'>
  )> }
);

export type TaskBasicInfoFragment = (
  { __typename?: 'task' }
  & Pick<Task, 'id' | 'user_id' | 'message_id' | 'created_at' | 'seen_at' | 'done_at'>
);

export type TaskDetailedInfoFragment = (
  { __typename?: 'task' }
  & { user: (
    { __typename?: 'user' }
    & UserBasicInfoFragment
  ), message: (
    { __typename?: 'message' }
    & { topic: (
      { __typename?: 'topic' }
      & Pick<Topic, 'id'>
      & { room: (
        { __typename?: 'room' }
        & Pick<Room, 'id'>
        & { space: (
          { __typename?: 'space' }
          & Pick<Space, 'id'>
        ) }
      ) }
    ) }
    & MessageBasicInfoFragment
  ) }
  & TaskBasicInfoFragment
);

export type TasksQueryVariables = Exact<{
  limit?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Array<Task_Order_By> | Task_Order_By>;
  where?: Maybe<Task_Bool_Exp>;
}>;


export type TasksQuery = (
  { __typename?: 'query_root' }
  & { tasks: Array<(
    { __typename?: 'task' }
    & TaskDetailedInfoFragment
  )> }
);

export type UpdateTaskMutationVariables = Exact<{
  taskId: Scalars['uuid'];
  input: Task_Set_Input;
}>;


export type UpdateTaskMutation = (
  { __typename?: 'mutation_root' }
  & { update_task_by_pk?: Maybe<(
    { __typename?: 'task' }
    & TaskBasicInfoFragment
  )> }
);

export type TeamBasicInfoFragment = (
  { __typename?: 'team' }
  & Pick<Team, 'id' | 'name' | 'slug'>
);

export type TeamInvitationBasicInfoFragment = (
  { __typename?: 'team_invitation' }
  & Pick<Team_Invitation, 'email' | 'id' | 'used_at'>
);

export type TeamDetailedInfoFragment = (
  { __typename?: 'team' }
  & Pick<Team, 'id' | 'name' | 'slug' | 'owner_id'>
  & { spaces: Array<(
    { __typename?: 'space' }
    & SpaceBasicInfoFragment
  )>, invitations: Array<(
    { __typename?: 'team_invitation' }
    & TeamInvitationBasicInfoFragment
  )>, memberships: Array<(
    { __typename?: 'team_member' }
    & { user: (
      { __typename?: 'user' }
      & UserBasicInfoFragment
    ) }
  )>, slack_installation?: Maybe<(
    { __typename?: 'team_slack_installation' }
    & Pick<Team_Slack_Installation, 'team_id'>
  )> }
);

export type CreateTeamMutationVariables = Exact<{
  input: Team_Insert_Input;
}>;


export type CreateTeamMutation = (
  { __typename?: 'mutation_root' }
  & { insert_team_one?: Maybe<(
    { __typename?: 'team' }
    & TeamDetailedInfoFragment
  )> }
);

export type TeamsQueryVariables = Exact<{ [key: string]: never; }>;


export type TeamsQuery = (
  { __typename?: 'query_root' }
  & { teams: Array<(
    { __typename?: 'team' }
    & TeamBasicInfoFragment
  )> }
);

export type TeamDetailsQueryVariables = Exact<{
  teamId: Scalars['uuid'];
}>;


export type TeamDetailsQuery = (
  { __typename?: 'query_root' }
  & { team?: Maybe<(
    { __typename?: 'team' }
    & TeamDetailedInfoFragment
  )> }
);

export type TeamBasicInfoQueryVariables = Exact<{
  teamId: Scalars['uuid'];
}>;


export type TeamBasicInfoQuery = (
  { __typename?: 'query_root' }
  & { team?: Maybe<(
    { __typename?: 'team' }
    & TeamBasicInfoFragment
  )> }
);

export type CreateTeamInvitationMutationVariables = Exact<{
  teamId: Scalars['uuid'];
  email: Scalars['String'];
}>;


export type CreateTeamInvitationMutation = (
  { __typename?: 'mutation_root' }
  & { insert_team_invitation_one?: Maybe<(
    { __typename?: 'team_invitation' }
    & TeamInvitationBasicInfoFragment
  )> }
);

export type RemoveTeamInvitationMutationVariables = Exact<{
  id: Scalars['uuid'];
}>;


export type RemoveTeamInvitationMutation = (
  { __typename?: 'mutation_root' }
  & { delete_team_invitation_by_pk?: Maybe<(
    { __typename?: 'team_invitation' }
    & Pick<Team_Invitation, 'team_id'>
  )> }
);

export type RemoveTeamMemberMutationVariables = Exact<{
  teamId: Scalars['uuid'];
  userId: Scalars['uuid'];
}>;


export type RemoveTeamMemberMutation = (
  { __typename?: 'mutation_root' }
  & { delete_team_member?: Maybe<(
    { __typename?: 'team_member_mutation_response' }
    & { returning: Array<(
      { __typename?: 'team_member' }
      & Pick<Team_Member, 'user_id'>
    )> }
  )> }
);

export type LookupTeamNameQueryVariables = Exact<{
  token: Scalars['String'];
}>;


export type LookupTeamNameQuery = (
  { __typename?: 'query_root' }
  & { invite?: Maybe<(
    { __typename?: 'LookupTeamNameResponse' }
    & Pick<LookupTeamNameResponse, 'team_name' | 'inviter_name' | 'email'>
  )> }
);

export type ResendInvitationMutationVariables = Exact<{
  invitation_id: Scalars['ID'];
}>;


export type ResendInvitationMutation = (
  { __typename?: 'mutation_root' }
  & { resend_invitation?: Maybe<(
    { __typename?: 'ResendInvitationResponse' }
    & Pick<ResendInvitationResponse, 'sent_at'>
  )> }
);

export type TopicDetailedInfoFragment = (
  { __typename?: 'topic' }
  & Pick<Topic, 'id' | 'name' | 'index' | 'slug' | 'closed_at' | 'closing_summary'>
  & { owner: (
    { __typename?: 'user' }
    & UserBasicInfoFragment
  ), closed_by_user?: Maybe<(
    { __typename?: 'user' }
    & UserBasicInfoFragment
  )>, room: (
    { __typename?: 'room' }
    & RoomBasicInfoFragment
  ), members: Array<(
    { __typename?: 'topic_member' }
    & { user: (
      { __typename?: 'user' }
      & UserBasicInfoFragment
    ) }
  )>, lastMessage: (
    { __typename?: 'message_aggregate' }
    & { aggregate?: Maybe<(
      { __typename?: 'message_aggregate_fields' }
      & { max?: Maybe<(
        { __typename?: 'message_max_fields' }
        & Pick<Message_Max_Fields, 'created_at'>
      )> }
    )> }
  ) }
);

export type RoomTopicsQueryVariables = Exact<{
  roomId: Scalars['uuid'];
}>;


export type RoomTopicsQuery = (
  { __typename?: 'query_root' }
  & { topics: Array<(
    { __typename?: 'topic' }
    & TopicDetailedInfoFragment
  )> }
);

export type TopicMessagesQueryVariables = Exact<{
  topicId: Scalars['uuid'];
  limit?: Maybe<Scalars['Int']>;
  order?: Maybe<Order_By>;
  typeExpression?: Maybe<Message_Type_Enum_Comparison_Exp>;
}>;


export type TopicMessagesQuery = (
  { __typename?: 'query_root' }
  & { messages: Array<(
    { __typename?: 'message' }
    & MessageFeedInfoFragment
  )> }
);

export type UpdateLastSeenMessageMutationVariables = Exact<{
  topicId: Scalars['uuid'];
  messageId: Scalars['uuid'];
}>;


export type UpdateLastSeenMessageMutation = (
  { __typename?: 'mutation_root' }
  & { insert_last_seen_message_one?: Maybe<(
    { __typename?: 'last_seen_message' }
    & Pick<Last_Seen_Message, 'message_id' | 'seen_at'>
  )> }
);

export type SingleTopicQueryVariables = Exact<{
  id: Scalars['uuid'];
}>;


export type SingleTopicQuery = (
  { __typename?: 'query_root' }
  & { topic?: Maybe<(
    { __typename?: 'topic' }
    & TopicDetailedInfoFragment
  )> }
);

export type TopicsQueryVariables = Exact<{
  limit?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Array<Topic_Order_By> | Topic_Order_By>;
  where?: Maybe<Topic_Bool_Exp>;
}>;


export type TopicsQuery = (
  { __typename?: 'query_root' }
  & { topics: Array<(
    { __typename?: 'topic' }
    & TopicDetailedInfoFragment
  )> }
);

export type UserBasicInfoFragment = (
  { __typename?: 'user' }
  & Pick<User, 'id' | 'name' | 'email' | 'avatar_url'>
);

export type UserDetailedInfoFragment = (
  { __typename?: 'user' }
  & { current_team?: Maybe<(
    { __typename?: 'team' }
    & TeamBasicInfoFragment
  )> }
  & UserBasicInfoFragment
);

export type ChangeCurrentTeamIdMutationVariables = Exact<{
  userId: Scalars['uuid'];
  teamId?: Maybe<Scalars['uuid']>;
}>;


export type ChangeCurrentTeamIdMutation = (
  { __typename?: 'mutation_root' }
  & { update_user_by_pk?: Maybe<(
    { __typename?: 'user' }
    & Pick<User, 'id'>
    & { current_team?: Maybe<(
      { __typename?: 'team' }
      & Pick<Team, 'id' | 'name' | 'slug'>
    )> }
  )> }
);

export type TeamMembersQueryVariables = Exact<{
  teamId: Scalars['uuid'];
}>;


export type TeamMembersQuery = (
  { __typename?: 'query_root' }
  & { teamMembers: Array<(
    { __typename?: 'user' }
    & UserBasicInfoFragment
  )> }
);

export type BreadcrumbQueryVariables = Exact<{
  spaceId: Scalars['uuid'];
  roomId?: Maybe<Scalars['uuid']>;
}>;


export type BreadcrumbQuery = (
  { __typename?: 'query_root' }
  & { space?: Maybe<(
    { __typename?: 'space' }
    & Pick<Space, 'id' | 'name'>
  )>, rooms: Array<(
    { __typename?: 'room' }
    & Pick<Room, 'id' | 'name'>
  )> }
);

export type RoomPageQueryVariables = Exact<{
  roomId: Scalars['uuid'];
  topicId?: Maybe<Scalars['uuid']>;
  hasTopicId: Scalars['Boolean'];
}>;


export type RoomPageQuery = (
  { __typename?: 'query_root' }
  & { room?: Maybe<(
    { __typename?: 'room' }
    & Pick<Room, 'id' | 'is_private'>
    & RoomTopicView_RoomFragment
  )>, topics: Maybe<Array<(
    { __typename?: 'topic' }
    & RoomTopicView_TopicFragment
  )>> }
);

export type SpaceManager_SpaceFragment = (
  { __typename?: 'space' }
  & Pick<Space, 'id' | 'name'>
  & IsCurrentUserSpaceMember_SpaceFragment
);

export type CurrentTeamSubscriptionVariables = Exact<{
  userId: Scalars['uuid'];
}>;


export type CurrentTeamSubscription = (
  { __typename?: 'subscription_root' }
  & { user?: Maybe<(
    { __typename?: 'user' }
    & { current_team?: Maybe<(
      { __typename?: 'team' }
      & Pick<Team, 'id'>
    )> }
  )> }
);

export type IsCurrentUserTopicManager_RoomFragment = (
  { __typename?: 'room' }
  & Pick<Room, 'owner_id'>
);

export type IsCurrentUserTopicManager_TopicFragment = (
  { __typename?: 'topic' }
  & Pick<Topic, 'owner_id'>
);

export type IsTopicClosed_TopicFragment = (
  { __typename?: 'topic' }
  & Pick<Topic, 'closed_at' | 'closed_by_user_id'>
);

export type MissingTeamMembersQueryVariables = Exact<{
  teamId: Scalars['uuid'];
  userIds?: Maybe<Array<Scalars['uuid']> | Scalars['uuid']>;
}>;


export type MissingTeamMembersQuery = (
  { __typename?: 'query_root' }
  & { missingTeamMembers: Array<(
    { __typename?: 'team_member' }
    & { user: (
      { __typename?: 'user' }
      & Pick<User, 'id' | 'name' | 'email' | 'avatar_url'>
    ) }
  )> }
);

export type MembersManagerModal_UserFragment = (
  { __typename?: 'user' }
  & Pick<User, 'id'>
  & UserBasicInfo_UserFragment
);

export type MessageAttachment_MessageFragment = (
  { __typename?: 'message' }
  & Pick<Message, 'user_id' | 'type'>
);

export type MessageAttachment_AttachmentFragment = (
  { __typename?: 'attachment' }
  & Pick<Attachment, 'id'>
  & MessageAttachmentDisplayer_AttachmentFragment
);

export type MessageAttachmentDisplayer_AttachmentFragment = (
  { __typename?: 'attachment' }
  & Pick<Attachment, 'mime_type' | 'original_name'>
);

export type CreateNewMessageMutationVariables = Exact<{
  id: Scalars['uuid'];
  topicId: Scalars['uuid'];
  content: Scalars['jsonb'];
  type: Message_Type_Enum;
  replied_to_message_id?: Maybe<Scalars['uuid']>;
}>;


export type CreateNewMessageMutation = (
  { __typename?: 'mutation_root' }
  & { message?: Maybe<(
    { __typename?: 'message' }
    & Pick<Message, 'id' | 'topic_id'>
    & Message_MessageFragment
  )> }
);

export type EditMessageEditor_MessageFragment = (
  { __typename?: 'message' }
  & Pick<Message, 'id' | 'content'>
  & { message_attachments: Array<(
    { __typename?: 'attachment' }
    & Pick<Attachment, 'id' | 'mime_type'>
  )> }
);

export type UpdateMessageContentMutationVariables = Exact<{
  id: Scalars['uuid'];
  content: Scalars['jsonb'];
}>;


export type UpdateMessageContentMutation = (
  { __typename?: 'mutation_root' }
  & { message?: Maybe<(
    { __typename?: 'message' }
    & Pick<Message, 'id' | 'content'>
  )> }
);

export type MessageLinksPreviews_MessageFragment = (
  { __typename?: 'message' }
  & Pick<Message, 'content'>
);

export type MessageMedia_MessageFragment = (
  { __typename?: 'message' }
  & Pick<Message, 'id'>
  & { message_attachments: Array<(
    { __typename?: 'attachment' }
    & MessageAttachment_AttachmentFragment
  )> }
  & MessageAttachment_MessageFragment
);

export type MessageText_MessageFragment = (
  { __typename?: 'message' }
  & Pick<Message, 'content'>
);

export type Message_MessageFragment = (
  { __typename?: 'message' }
  & Pick<Message, 'id' | 'created_at'>
  & { replied_to_message?: Maybe<(
    { __typename?: 'message' }
    & ReplyingToMessage_MessageFragment
  )>, user: (
    { __typename?: 'user' }
    & Pick<User, 'id'>
    & MessageLikeContent_UserFragment
  ), tasks: Array<(
    { __typename?: 'task' }
    & MessageTask_TaskFragment
  )> }
  & MakeReactionButton_MessageFragment
  & MessageText_MessageFragment
  & MessageMedia_MessageFragment
  & MessageLinksPreviews_MessageFragment
  & EditMessageEditor_MessageFragment
  & MessageReactions_MessageFragment
);

export type MessageLikeContent_UserFragment = (
  { __typename?: 'user' }
  & Pick<User, 'id'>
  & MessageMetaData_UserFragment
);

export type MessageMetaData_UserFragment = (
  { __typename?: 'user' }
  & Pick<User, 'name'>
  & UserAvatar_UserFragment
);

export type MessageTask_TaskFragment = (
  { __typename?: 'task' }
  & Pick<Task, 'id' | 'user_id' | 'message_id' | 'seen_at' | 'type' | 'done_at'>
);

export type MakeReactionButton_MessageFragment = (
  { __typename?: 'message' }
  & Pick<Message, 'id'>
  & { message_reactions: Array<(
    { __typename?: 'message_reaction' }
    & Pick<Message_Reaction, 'emoji' | 'user_id'>
  )> }
);

export type MessageReaction_MessageFragment = (
  { __typename?: 'message' }
  & Pick<Message, 'id'>
);

export type MessageReaction_Message_ReactionFragment = (
  { __typename?: 'message_reaction' }
  & Pick<Message_Reaction, 'user_id'>
  & MessageReactionTooltip_Message_ReactionFragment
);

export type MessageReactionTooltip_Message_ReactionFragment = (
  { __typename?: 'message_reaction' }
  & { user: (
    { __typename?: 'user' }
    & Pick<User, 'id' | 'name'>
  ) }
);

export type GroupReactionsByEmoji_ReactionFragment = (
  { __typename?: 'message_reaction' }
  & Pick<Message_Reaction, 'emoji'>
);

export type MessageReactions_MessageFragment = (
  { __typename?: 'message' }
  & { message_reactions: Array<(
    { __typename?: 'message_reaction' }
    & Pick<Message_Reaction, 'emoji' | 'user_id'>
    & GroupReactionsByEmoji_ReactionFragment
    & MessageReaction_Message_ReactionFragment
  )> }
  & MessageReaction_MessageFragment
);

export type ReplyingToMessage_MessageFragment = (
  { __typename?: 'message' }
  & Pick<Message, 'id' | 'created_at'>
  & { user: (
    { __typename?: 'user' }
    & MessageMetaData_UserFragment
  ) }
  & MessageText_MessageFragment
  & MessageMedia_MessageFragment
);

export type ReplyingToMessageQueryVariables = Exact<{
  messageId: Scalars['uuid'];
}>;


export type ReplyingToMessageQuery = (
  { __typename?: 'query_root' }
  & { message?: Maybe<(
    { __typename?: 'message' }
    & ReplyingToMessage_MessageFragment
  )> }
);

export type RoomOwner_RoomFragment = (
  { __typename?: 'room' }
  & { owner: (
    { __typename?: 'user' }
    & Pick<User, 'name'>
    & UserAvatar_UserFragment
  ) }
);

export type ManageRoomMembers_MemberFragment = (
  { __typename?: 'room_member' }
  & { user: (
    { __typename?: 'user' }
    & Pick<User, 'id' | 'email'>
    & MembersManagerModal_UserFragment
    & AvatarList_UserFragment
  ) }
);

export type ManageRoomMembers_RoomFragment = (
  { __typename?: 'room' }
  & Pick<Room, 'id' | 'is_private' | 'owner_id'>
  & { members: Array<(
    { __typename?: 'room_member' }
    & ManageRoomMembers_MemberFragment
  )>, invitations: Array<(
    { __typename?: 'room_invitation' }
    & Pick<Room_Invitation, 'id' | 'email'>
  )> }
  & IsCurrentUserRoomMember_RoomFragment
  & PrivateRoomDeletionPrompt_RoomFragment
  & RoomOwner_RoomFragment
);

export type ManageRoomMembers_InvitationsQueryVariables = Exact<{
  teamId: Scalars['uuid'];
}>;


export type ManageRoomMembers_InvitationsQuery = (
  { __typename?: 'query_root' }
  & { invitations: Array<(
    { __typename?: 'team_invitation' }
    & Pick<Team_Invitation, 'email'>
  )> }
);

export type ManageRoomMembers_MembersSubscriptionVariables = Exact<{
  roomId: Scalars['uuid'];
}>;


export type ManageRoomMembers_MembersSubscription = (
  { __typename?: 'subscription_root' }
  & { room_by_pk?: Maybe<(
    { __typename?: 'room' }
    & Pick<Room, 'id'>
    & { members: Array<(
      { __typename?: 'room_member' }
      & ManageRoomMembers_MemberFragment
    )> }
  )> }
);

export type AddRoomMemberMutationVariables = Exact<{
  roomId: Scalars['uuid'];
  userId: Scalars['uuid'];
}>;


export type AddRoomMemberMutation = (
  { __typename?: 'mutation_root' }
  & { insert_room_member_one?: Maybe<(
    { __typename?: 'room_member' }
    & Pick<Room_Member, 'room_id' | 'user_id'>
  )> }
);

export type RemoveRoomMemberMutationVariables = Exact<{
  roomId: Scalars['uuid'];
  userId: Scalars['uuid'];
}>;


export type RemoveRoomMemberMutation = (
  { __typename?: 'mutation_root' }
  & { delete_room_member?: Maybe<(
    { __typename?: 'room_member_mutation_response' }
    & Pick<Room_Member_Mutation_Response, 'affected_rows'>
  )> }
);

export type PrivateRoomDeletionPrompt_RoomFragment = (
  { __typename?: 'room' }
  & Pick<Room, 'id' | 'space_id'>
);

export type CreateTopicMutationVariables = Exact<{
  input: Topic_Insert_Input;
}>;


export type CreateTopicMutation = (
  { __typename?: 'mutation_root' }
  & { insert_topic_one?: Maybe<(
    { __typename?: 'topic' }
    & Pick<Topic, 'id'>
  )> }
);

export type SpacePickerQueryVariables = Exact<{
  teamId?: Maybe<Scalars['uuid']>;
}>;


export type SpacePickerQuery = (
  { __typename?: 'query_root' }
  & { spaces: Array<(
    { __typename?: 'space' }
    & Pick<Space, 'id' | 'name'>
  )> }
);

export type AvatarList_UserFragment = (
  { __typename?: 'user' }
  & Pick<User, 'id' | 'name'>
  & UserAvatar_UserFragment
);

export type UserAvatar_UserFragment = (
  { __typename?: 'user' }
  & Pick<User, 'name' | 'avatar_url'>
);

export type UserBasicInfo_UserFragment = (
  { __typename?: 'user' }
  & Pick<User, 'name' | 'email'>
);

export type GetUserDisplayName_UserFragment = (
  { __typename?: 'user' }
  & Pick<User, 'name' | 'email'>
);

export type UnreadMessageFragmentFragment = (
  { __typename?: 'unread_messages' }
  & { roomId: Unread_Messages['room_id'], topicId: Unread_Messages['topic_id'], unreadMessages: Unread_Messages['unread_messages'] }
);

export type UserUnreadMessagesQueryVariables = Exact<{
  userId?: Maybe<Scalars['uuid']>;
}>;


export type UserUnreadMessagesQuery = (
  { __typename?: 'query_root' }
  & { messages: Array<(
    { __typename?: 'unread_messages' }
    & UnreadMessageFragmentFragment
  )> }
);

export type DeadlineManager_RoomFragment = (
  { __typename?: 'room' }
  & Pick<Room, 'id' | 'deadline'>
);

export type UpdateRoomDeadlineMutationVariables = Exact<{
  id: Scalars['uuid'];
  deadline: Scalars['timestamptz'];
}>;


export type UpdateRoomDeadlineMutation = (
  { __typename?: 'mutation_root' }
  & { room?: Maybe<(
    { __typename?: 'room' }
    & Pick<Room, 'id' | 'deadline'>
  )> }
);

export type DeadlineManagerSubscriptionVariables = Exact<{
  roomId: Scalars['uuid'];
}>;


export type DeadlineManagerSubscription = (
  { __typename?: 'subscription_root' }
  & { room_by_pk?: Maybe<(
    { __typename?: 'room' }
    & DeadlineManager_RoomFragment
  )> }
);

export type RoomCloseModal_RoomFragment = (
  { __typename?: 'room' }
  & Pick<Room, 'id'>
  & { topics: Array<(
    { __typename?: 'topic' }
    & Pick<Topic, 'id' | 'name'>
  )> }
);

export type CloseOpenTopicsMutationVariables = Exact<{
  roomId: Scalars['uuid'];
  closedAt?: Maybe<Scalars['timestamp']>;
  closedByUserId?: Maybe<Scalars['uuid']>;
}>;


export type CloseOpenTopicsMutation = (
  { __typename?: 'mutation_root' }
  & { update_topic?: Maybe<(
    { __typename?: 'topic_mutation_response' }
    & Pick<Topic_Mutation_Response, 'affected_rows'>
  )> }
);

export type RoomSidebarInfo_RoomFragment = (
  { __typename?: 'room' }
  & Pick<Room, 'space_id'>
  & IsCurrentUserRoomMember_RoomFragment
  & ManageRoomMembers_RoomFragment
  & DeadlineManager_RoomFragment
);

export type ConvertRoom_RoomFragment = (
  { __typename?: 'room' }
  & Pick<Room, 'id' | 'space_id' | 'name' | 'finished_at' | 'summary'>
  & { topics: Array<(
    { __typename?: 'topic' }
    & Pick<Topic, 'name' | 'closed_at' | 'closing_summary'>
    & { closed_by_user?: Maybe<(
      { __typename?: 'user' }
      & Pick<User, 'name'>
    )> }
  )> }
);

export type RoomSummaryView_RoomFragment = (
  { __typename?: 'room' }
  & Pick<Room, 'summary'>
  & { topics: Array<(
    { __typename?: 'topic' }
    & TopicSummary_TopicFragment
  )> }
  & RoomView_RoomFragment
  & ConvertRoom_RoomFragment
);

export type UpdateRoomSummaryMutationVariables = Exact<{
  id: Scalars['uuid'];
  summary: Scalars['String'];
}>;


export type UpdateRoomSummaryMutation = (
  { __typename?: 'mutation_root' }
  & { room?: Maybe<(
    { __typename?: 'room' }
    & Pick<Room, 'id' | 'summary'>
  )> }
);

export type RoomTopicView_RoomFragment = (
  { __typename?: 'room' }
  & Pick<Room, 'id' | 'space_id'>
  & { topics: Array<(
    { __typename?: 'topic' }
    & Pick<Topic, 'id'>
  )> }
  & RoomView_RoomFragment
  & TopicWithMessages_RoomFragment
);

export type RoomTopicView_TopicFragment = (
  { __typename?: 'topic' }
  & Pick<Topic, 'id'>
  & TopicWithMessages_TopicFragment
);

export type RoomView_RoomFragment = (
  { __typename?: 'room' }
  & Pick<Room, 'id' | 'name' | 'finished_at' | 'is_private' | 'source_google_calendar_event_id'>
  & IsCurrentUserRoomMember_RoomFragment
  & EditOptions_RoomFragment
  & RoomSidebarInfo_RoomFragment
  & TopicList_RoomFragment
);

export type UpdateRoomFinishedAtMutationVariables = Exact<{
  id: Scalars['uuid'];
  finishedAt?: Maybe<Scalars['timestamptz']>;
}>;


export type UpdateRoomFinishedAtMutation = (
  { __typename?: 'mutation_root' }
  & { room?: Maybe<(
    { __typename?: 'room' }
    & Pick<Room, 'id' | 'finished_at'>
  )> }
);

export type UpdateRoomNameMutationVariables = Exact<{
  id: Scalars['uuid'];
  name: Scalars['String'];
}>;


export type UpdateRoomNameMutation = (
  { __typename?: 'mutation_root' }
  & { room?: Maybe<(
    { __typename?: 'room' }
    & Pick<Room, 'id' | 'name'>
  )> }
);

export type TopicSummary_TopicFragment = (
  { __typename?: 'topic' }
  & Pick<Topic, 'id' | 'name' | 'closing_summary' | 'closed_at'>
  & { closed_by_user?: Maybe<(
    { __typename?: 'user' }
    & Pick<User, 'name'>
  )> }
);

export type UpdateTopicSummaryMutationVariables = Exact<{
  id: Scalars['uuid'];
  closingSummary: Scalars['String'];
}>;


export type UpdateTopicSummaryMutation = (
  { __typename?: 'mutation_root' }
  & { topic?: Maybe<(
    { __typename?: 'topic' }
    & Pick<Topic, 'id' | 'closing_summary'>
  )> }
);

export type TopicHeader_RoomFragment = (
  { __typename?: 'room' }
  & Pick<Room, 'id' | 'finished_at'>
  & IsCurrentUserRoomMember_RoomFragment
  & IsCurrentUserTopicManager_RoomFragment
  & ManageTopic_RoomFragment
);

export type TopicHeader_TopicFragment = (
  { __typename?: 'topic' }
  & Pick<Topic, 'id' | 'name'>
  & IsTopicClosed_TopicFragment
  & IsCurrentUserTopicManager_TopicFragment
  & ManageTopic_TopicFragment
);

export type CloseTopicMutationVariables = Exact<{
  id: Scalars['uuid'];
  closed_at?: Maybe<Scalars['timestamp']>;
  closed_by_user_id?: Maybe<Scalars['uuid']>;
  closing_summary?: Maybe<Scalars['String']>;
}>;


export type CloseTopicMutation = (
  { __typename?: 'mutation_root' }
  & { topic?: Maybe<(
    { __typename?: 'topic' }
    & Pick<Topic, 'id' | 'closed_at' | 'closed_by_user_id' | 'closing_summary'>
  )> }
);

export type TopicSummaryMessage_TopicFragment = (
  { __typename?: 'topic' }
  & Pick<Topic, 'id' | 'closed_at' | 'closing_summary'>
  & { closed_by_user?: Maybe<(
    { __typename?: 'user' }
    & Pick<User, 'id' | 'name' | 'email'>
    & MessageLikeContent_UserFragment
  )> }
);

export type TopicWithMessages_RoomFragment = (
  { __typename?: 'room' }
  & Pick<Room, 'id' | 'finished_at'>
  & TopicHeader_RoomFragment
);

export type TopicWithMessages_TopicFragment = (
  { __typename?: 'topic' }
  & Pick<Topic, 'id'>
  & IsTopicClosed_TopicFragment
  & TopicSummaryMessage_TopicFragment
  & TopicHeader_TopicFragment
);

export type TopicMessagesAscSubscriptionVariables = Exact<{
  topicId: Scalars['uuid'];
  limit?: Maybe<Scalars['Int']>;
  order?: Maybe<Order_By>;
  typeExpression?: Maybe<Message_Type_Enum_Comparison_Exp>;
}>;


export type TopicMessagesAscSubscription = (
  { __typename?: 'subscription_root' }
  & { messages: Array<(
    { __typename?: 'message' }
    & Message_MessageFragment
  )> }
);

export type TopicClosureSubscriptionVariables = Exact<{
  topicId: Scalars['uuid'];
}>;


export type TopicClosureSubscription = (
  { __typename?: 'subscription_root' }
  & { topic_by_pk?: Maybe<(
    { __typename?: 'topic' }
    & TopicSummaryMessage_TopicFragment
  )> }
);

export type LazyTopicList_RoomFragment = (
  { __typename?: 'room' }
  & Pick<Room, 'id'>
  & StaticTopicList_RoomFragment
);

export type TopicList_RoomSubscriptionVariables = Exact<{
  roomId: Scalars['uuid'];
}>;


export type TopicList_RoomSubscription = (
  { __typename?: 'subscription_root' }
  & { room_by_pk?: Maybe<(
    { __typename?: 'room' }
    & Pick<Room, 'id'>
    & { topics: Array<(
      { __typename?: 'topic' }
      & Pick<Topic, 'id' | 'index'>
    )> }
  )> }
);

export type ManageTopic_RoomFragment = (
  { __typename?: 'room' }
  & Pick<Room, 'id'>
  & IsCurrentUserTopicManager_RoomFragment
);

export type ManageTopic_TopicFragment = (
  { __typename?: 'topic' }
  & Pick<Topic, 'id' | 'name'>
  & IsCurrentUserTopicManager_TopicFragment
);

export type UpdateTopicIndexMutationVariables = Exact<{
  id: Scalars['uuid'];
  index: Scalars['String'];
}>;


export type UpdateTopicIndexMutation = (
  { __typename?: 'mutation_root' }
  & { topic?: Maybe<(
    { __typename?: 'topic' }
    & Pick<Topic, 'id' | 'index'>
  )> }
);

export type SortableTopicList_RoomFragment = (
  { __typename?: 'room' }
  & Pick<Room, 'id'>
  & { topics: Array<(
    { __typename?: 'topic' }
    & Pick<Topic, 'id' | 'index'>
    & TopicMenuItem_TopicFragment
  )> }
  & TopicMenuItem_RoomFragment
);

export type TopicList_TopicFragment = (
  { __typename?: 'topic' }
  & Pick<Topic, 'id' | 'index'>
  & TopicMenuItem_TopicFragment
);

export type StaticTopicList_RoomFragment = (
  { __typename?: 'room' }
  & { topics: Array<(
    { __typename?: 'topic' }
    & TopicList_TopicFragment
  )> }
  & TopicMenuItem_RoomFragment
);

export type TopicMenuItem_RoomFragment = (
  { __typename?: 'room' }
  & Pick<Room, 'id' | 'space_id'>
  & ManageTopic_RoomFragment
  & TopicOwner_RoomFragment
);

export type TopicMenuItem_TopicFragment = (
  { __typename?: 'topic' }
  & Pick<Topic, 'id' | 'name' | 'closed_at'>
  & ManageTopic_TopicFragment
  & TopicOwner_TopicFragment
);

export type TopicMenuItemSubscriptionVariables = Exact<{
  topicId: Scalars['uuid'];
}>;


export type TopicMenuItemSubscription = (
  { __typename?: 'subscription_root' }
  & { topic_by_pk?: Maybe<(
    { __typename?: 'topic' }
    & Pick<Topic, 'id' | 'name' | 'closed_at'>
  )> }
);

export type TopicOwner_RoomFragment = (
  { __typename?: 'room' }
  & { members: Array<(
    { __typename?: 'room_member' }
    & { user: (
      { __typename?: 'user' }
      & Pick<User, 'id' | 'name' | 'email'>
    ) }
  )> }
  & IsCurrentUserTopicManager_RoomFragment
);

export type TopicOwner_TopicFragment = (
  { __typename?: 'topic' }
  & Pick<Topic, 'id'>
  & { owner: (
    { __typename?: 'user' }
    & Pick<User, 'id' | 'name'>
    & UserAvatar_UserFragment
  ) }
  & IsCurrentUserTopicManager_TopicFragment
);

export type UpdateTopicOwnerMutationVariables = Exact<{
  id: Scalars['uuid'];
  ownerId: Scalars['uuid'];
}>;


export type UpdateTopicOwnerMutation = (
  { __typename?: 'mutation_root' }
  & { topic?: Maybe<(
    { __typename?: 'topic' }
    & Pick<Topic, 'id'>
    & TopicOwner_TopicFragment
  )> }
);

export type TopicOwner_TopicSubscriptionVariables = Exact<{
  id: Scalars['uuid'];
}>;


export type TopicOwner_TopicSubscription = (
  { __typename?: 'subscription_root' }
  & { topic_by_pk?: Maybe<(
    { __typename?: 'topic' }
    & Pick<Topic, 'id'>
    & TopicOwner_TopicFragment
  )> }
);

export type TopicList_RoomFragment = (
  { __typename?: 'room' }
  & Pick<Room, 'id' | 'space_id'>
  & { topics: Array<(
    { __typename?: 'topic' }
    & Pick<Topic, 'id' | 'index'>
  )> }
  & IsCurrentUserRoomMember_RoomFragment
  & StaticTopicList_RoomFragment
);

export type TopicListCreateTopicFragment = (
  { __typename?: 'topic' }
  & Pick<Topic, 'id' | 'room_id'>
  & TopicList_TopicFragment
  & TopicWithMessages_TopicFragment
);

export type CreateRoomViewTopicMutationVariables = Exact<{
  id: Scalars['uuid'];
  name: Scalars['String'];
  slug: Scalars['String'];
  index: Scalars['String'];
  room_id: Scalars['uuid'];
  owner_id: Scalars['uuid'];
}>;


export type CreateRoomViewTopicMutation = (
  { __typename?: 'mutation_root' }
  & { topic?: Maybe<(
    { __typename?: 'topic' }
    & TopicListCreateTopicFragment
  )> }
);

export type RoomViewTopicQueryVariables = Exact<{
  id: Scalars['uuid'];
}>;


export type RoomViewTopicQuery = (
  { __typename?: 'query_root' }
  & { topics: Array<(
    { __typename?: 'topic' }
    & TopicListCreateTopicFragment
  )> }
);

export type UpdateTopicNameMutationVariables = Exact<{
  id: Scalars['uuid'];
  name: Scalars['String'];
}>;


export type UpdateTopicNameMutation = (
  { __typename?: 'mutation_root' }
  & { topic?: Maybe<(
    { __typename?: 'topic' }
    & Pick<Topic, 'id' | 'name'>
  )> }
);

export type DeleteTopicMutationVariables = Exact<{
  id: Scalars['uuid'];
}>;


export type DeleteTopicMutation = (
  { __typename?: 'mutation_root' }
  & { topic?: Maybe<(
    { __typename?: 'topic' }
    & Pick<Topic, 'id' | 'room_id'>
  )> }
);

export type EditOptions_RoomFragment = (
  { __typename?: 'room' }
  & Pick<Room, 'id' | 'name' | 'finished_at' | 'is_private' | 'space_id'>
  & { topics: Array<(
    { __typename?: 'topic' }
    & Pick<Topic, 'closed_at'>
  )> }
  & RoomCloseModal_RoomFragment
);

export type UpdateRoomIsPrivateMutationVariables = Exact<{
  id: Scalars['uuid'];
  isPrivate: Scalars['Boolean'];
}>;


export type UpdateRoomIsPrivateMutation = (
  { __typename?: 'mutation_root' }
  & { room?: Maybe<(
    { __typename?: 'room' }
    & Pick<Room, 'id' | 'is_private'>
  )> }
);

export type SpaceCard_SpaceFragment = (
  { __typename?: 'space' }
  & Pick<Space, 'id' | 'name'>
  & { members: Array<(
    { __typename?: 'space_member' }
    & Pick<Space_Member, 'space_id' | 'user_id'>
    & { user: (
      { __typename?: 'user' }
      & AvatarList_UserFragment
    ) }
  )> }
  & IsCurrentUserSpaceMember_SpaceFragment
);

export type SpacesListQueryVariables = Exact<{
  teamId: Scalars['uuid'];
}>;


export type SpacesListQuery = (
  { __typename?: 'query_root' }
  & { spaces: Array<(
    { __typename?: 'space' }
    & { members: Array<(
      { __typename?: 'space_member' }
      & Pick<Space_Member, 'space_id' | 'user_id'>
      & { user: (
        { __typename?: 'user' }
        & Pick<User, 'id'>
      ) }
    )> }
    & SpaceCard_SpaceFragment
  )> }
);

export type GetSlackInstallationUrlQueryVariables = Exact<{
  input: GetTeamSlackInstallationUrlInput;
}>;


export type GetSlackInstallationUrlQuery = (
  { __typename?: 'query_root' }
  & { get_team_slack_installation_url?: Maybe<(
    { __typename?: 'GetTeamSlackInstallationURLOutput' }
    & Pick<GetTeamSlackInstallationUrlOutput, 'url'>
  )> }
);

export type DeleteSlackInstallationMutationVariables = Exact<{
  teamId: Scalars['uuid'];
}>;


export type DeleteSlackInstallationMutation = (
  { __typename?: 'mutation_root' }
  & { delete_team_slack_installation_by_pk?: Maybe<(
    { __typename?: 'team_slack_installation' }
    & { team: (
      { __typename?: 'team' }
      & { slack_installation?: Maybe<(
        { __typename?: 'team_slack_installation' }
        & Pick<Team_Slack_Installation, 'team_id'>
      )> }
    ) }
  )> }
);

export type GetTeamSlackInstallationURLOutputKeySpecifier = ('url' | GetTeamSlackInstallationURLOutputKeySpecifier)[];
export type GetTeamSlackInstallationURLOutputFieldPolicy = {
	url?: FieldPolicy<any> | FieldReadFunction<any>
};
export type LookupTeamNameResponseKeySpecifier = ('email' | 'inviter_name' | 'team_name' | LookupTeamNameResponseKeySpecifier)[];
export type LookupTeamNameResponseFieldPolicy = {
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	inviter_name?: FieldPolicy<any> | FieldReadFunction<any>,
	team_name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ResendInvitationResponseKeySpecifier = ('sent_at' | ResendInvitationResponseKeySpecifier)[];
export type ResendInvitationResponseFieldPolicy = {
	sent_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RoomInvitationViewResponseKeySpecifier = ('inviter_name' | 'room_name' | RoomInvitationViewResponseKeySpecifier)[];
export type RoomInvitationViewResponseFieldPolicy = {
	inviter_name?: FieldPolicy<any> | FieldReadFunction<any>,
	room_name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UpgradeUserResponseKeySpecifier = ('user' | 'user_id' | UpgradeUserResponseKeySpecifier)[];
export type UpgradeUserResponseFieldPolicy = {
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UploadUrlResponseKeySpecifier = ('uploadUrl' | 'uuid' | UploadUrlResponseKeySpecifier)[];
export type UploadUrlResponseFieldPolicy = {
	uploadUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	uuid?: FieldPolicy<any> | FieldReadFunction<any>
};
export type accountKeySpecifier = ('access_token' | 'access_token_expires' | 'created_at' | 'id' | 'provider_account_id' | 'provider_id' | 'provider_type' | 'refresh_token' | 'updated_at' | 'user' | 'user_id' | accountKeySpecifier)[];
export type accountFieldPolicy = {
	access_token?: FieldPolicy<any> | FieldReadFunction<any>,
	access_token_expires?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	provider_account_id?: FieldPolicy<any> | FieldReadFunction<any>,
	provider_id?: FieldPolicy<any> | FieldReadFunction<any>,
	provider_type?: FieldPolicy<any> | FieldReadFunction<any>,
	refresh_token?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type account_aggregateKeySpecifier = ('aggregate' | 'nodes' | account_aggregateKeySpecifier)[];
export type account_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type account_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | account_aggregate_fieldsKeySpecifier)[];
export type account_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type account_max_fieldsKeySpecifier = ('access_token' | 'access_token_expires' | 'created_at' | 'id' | 'provider_account_id' | 'provider_id' | 'provider_type' | 'refresh_token' | 'updated_at' | 'user_id' | account_max_fieldsKeySpecifier)[];
export type account_max_fieldsFieldPolicy = {
	access_token?: FieldPolicy<any> | FieldReadFunction<any>,
	access_token_expires?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	provider_account_id?: FieldPolicy<any> | FieldReadFunction<any>,
	provider_id?: FieldPolicy<any> | FieldReadFunction<any>,
	provider_type?: FieldPolicy<any> | FieldReadFunction<any>,
	refresh_token?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type account_min_fieldsKeySpecifier = ('access_token' | 'access_token_expires' | 'created_at' | 'id' | 'provider_account_id' | 'provider_id' | 'provider_type' | 'refresh_token' | 'updated_at' | 'user_id' | account_min_fieldsKeySpecifier)[];
export type account_min_fieldsFieldPolicy = {
	access_token?: FieldPolicy<any> | FieldReadFunction<any>,
	access_token_expires?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	provider_account_id?: FieldPolicy<any> | FieldReadFunction<any>,
	provider_id?: FieldPolicy<any> | FieldReadFunction<any>,
	provider_type?: FieldPolicy<any> | FieldReadFunction<any>,
	refresh_token?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type account_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | account_mutation_responseKeySpecifier)[];
export type account_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type attachmentKeySpecifier = ('created_at' | 'id' | 'message' | 'message_id' | 'mime_type' | 'original_name' | 'transcription' | 'transcription_id' | 'user_id' | attachmentKeySpecifier)[];
export type attachmentFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	message_id?: FieldPolicy<any> | FieldReadFunction<any>,
	mime_type?: FieldPolicy<any> | FieldReadFunction<any>,
	original_name?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription_id?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type attachment_aggregateKeySpecifier = ('aggregate' | 'nodes' | attachment_aggregateKeySpecifier)[];
export type attachment_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type attachment_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | attachment_aggregate_fieldsKeySpecifier)[];
export type attachment_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type attachment_max_fieldsKeySpecifier = ('created_at' | 'id' | 'message_id' | 'mime_type' | 'original_name' | 'transcription_id' | 'user_id' | attachment_max_fieldsKeySpecifier)[];
export type attachment_max_fieldsFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	message_id?: FieldPolicy<any> | FieldReadFunction<any>,
	mime_type?: FieldPolicy<any> | FieldReadFunction<any>,
	original_name?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription_id?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type attachment_min_fieldsKeySpecifier = ('created_at' | 'id' | 'message_id' | 'mime_type' | 'original_name' | 'transcription_id' | 'user_id' | attachment_min_fieldsKeySpecifier)[];
export type attachment_min_fieldsFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	message_id?: FieldPolicy<any> | FieldReadFunction<any>,
	mime_type?: FieldPolicy<any> | FieldReadFunction<any>,
	original_name?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription_id?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type attachment_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | attachment_mutation_responseKeySpecifier)[];
export type attachment_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type last_seen_messageKeySpecifier = ('message_id' | 'seen_at' | 'topic_id' | 'user_id' | last_seen_messageKeySpecifier)[];
export type last_seen_messageFieldPolicy = {
	message_id?: FieldPolicy<any> | FieldReadFunction<any>,
	seen_at?: FieldPolicy<any> | FieldReadFunction<any>,
	topic_id?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type last_seen_message_aggregateKeySpecifier = ('aggregate' | 'nodes' | last_seen_message_aggregateKeySpecifier)[];
export type last_seen_message_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type last_seen_message_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | last_seen_message_aggregate_fieldsKeySpecifier)[];
export type last_seen_message_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type last_seen_message_max_fieldsKeySpecifier = ('message_id' | 'seen_at' | 'topic_id' | 'user_id' | last_seen_message_max_fieldsKeySpecifier)[];
export type last_seen_message_max_fieldsFieldPolicy = {
	message_id?: FieldPolicy<any> | FieldReadFunction<any>,
	seen_at?: FieldPolicy<any> | FieldReadFunction<any>,
	topic_id?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type last_seen_message_min_fieldsKeySpecifier = ('message_id' | 'seen_at' | 'topic_id' | 'user_id' | last_seen_message_min_fieldsKeySpecifier)[];
export type last_seen_message_min_fieldsFieldPolicy = {
	message_id?: FieldPolicy<any> | FieldReadFunction<any>,
	seen_at?: FieldPolicy<any> | FieldReadFunction<any>,
	topic_id?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type last_seen_message_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | last_seen_message_mutation_responseKeySpecifier)[];
export type last_seen_message_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type membership_statusKeySpecifier = ('value' | membership_statusKeySpecifier)[];
export type membership_statusFieldPolicy = {
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type membership_status_aggregateKeySpecifier = ('aggregate' | 'nodes' | membership_status_aggregateKeySpecifier)[];
export type membership_status_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type membership_status_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | membership_status_aggregate_fieldsKeySpecifier)[];
export type membership_status_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type membership_status_max_fieldsKeySpecifier = ('value' | membership_status_max_fieldsKeySpecifier)[];
export type membership_status_max_fieldsFieldPolicy = {
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type membership_status_min_fieldsKeySpecifier = ('value' | membership_status_min_fieldsKeySpecifier)[];
export type membership_status_min_fieldsFieldPolicy = {
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type membership_status_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | membership_status_mutation_responseKeySpecifier)[];
export type membership_status_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type messageKeySpecifier = ('content' | 'content_text' | 'created_at' | 'id' | 'is_draft' | 'message_attachments' | 'message_attachments_aggregate' | 'message_reactions' | 'message_reactions_aggregate' | 'message_type' | 'replied_to_message' | 'replied_to_message_id' | 'tasks' | 'tasks_aggregate' | 'topic' | 'topic_id' | 'type' | 'user' | 'user_id' | messageKeySpecifier)[];
export type messageFieldPolicy = {
	content?: FieldPolicy<any> | FieldReadFunction<any>,
	content_text?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	is_draft?: FieldPolicy<any> | FieldReadFunction<any>,
	message_attachments?: FieldPolicy<any> | FieldReadFunction<any>,
	message_attachments_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	message_reactions?: FieldPolicy<any> | FieldReadFunction<any>,
	message_reactions_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	message_type?: FieldPolicy<any> | FieldReadFunction<any>,
	replied_to_message?: FieldPolicy<any> | FieldReadFunction<any>,
	replied_to_message_id?: FieldPolicy<any> | FieldReadFunction<any>,
	tasks?: FieldPolicy<any> | FieldReadFunction<any>,
	tasks_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	topic?: FieldPolicy<any> | FieldReadFunction<any>,
	topic_id?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type message_aggregateKeySpecifier = ('aggregate' | 'nodes' | message_aggregateKeySpecifier)[];
export type message_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type message_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | message_aggregate_fieldsKeySpecifier)[];
export type message_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type message_max_fieldsKeySpecifier = ('content_text' | 'created_at' | 'id' | 'replied_to_message_id' | 'topic_id' | 'user_id' | message_max_fieldsKeySpecifier)[];
export type message_max_fieldsFieldPolicy = {
	content_text?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	replied_to_message_id?: FieldPolicy<any> | FieldReadFunction<any>,
	topic_id?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type message_min_fieldsKeySpecifier = ('content_text' | 'created_at' | 'id' | 'replied_to_message_id' | 'topic_id' | 'user_id' | message_min_fieldsKeySpecifier)[];
export type message_min_fieldsFieldPolicy = {
	content_text?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	replied_to_message_id?: FieldPolicy<any> | FieldReadFunction<any>,
	topic_id?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type message_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | message_mutation_responseKeySpecifier)[];
export type message_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type message_reactionKeySpecifier = ('emoji' | 'message' | 'message_id' | 'user' | 'user_id' | message_reactionKeySpecifier)[];
export type message_reactionFieldPolicy = {
	emoji?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	message_id?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type message_reaction_aggregateKeySpecifier = ('aggregate' | 'nodes' | message_reaction_aggregateKeySpecifier)[];
export type message_reaction_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type message_reaction_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | message_reaction_aggregate_fieldsKeySpecifier)[];
export type message_reaction_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type message_reaction_max_fieldsKeySpecifier = ('emoji' | 'message_id' | 'user_id' | message_reaction_max_fieldsKeySpecifier)[];
export type message_reaction_max_fieldsFieldPolicy = {
	emoji?: FieldPolicy<any> | FieldReadFunction<any>,
	message_id?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type message_reaction_min_fieldsKeySpecifier = ('emoji' | 'message_id' | 'user_id' | message_reaction_min_fieldsKeySpecifier)[];
export type message_reaction_min_fieldsFieldPolicy = {
	emoji?: FieldPolicy<any> | FieldReadFunction<any>,
	message_id?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type message_reaction_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | message_reaction_mutation_responseKeySpecifier)[];
export type message_reaction_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type message_typeKeySpecifier = ('value' | message_typeKeySpecifier)[];
export type message_typeFieldPolicy = {
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type message_type_aggregateKeySpecifier = ('aggregate' | 'nodes' | message_type_aggregateKeySpecifier)[];
export type message_type_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type message_type_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | message_type_aggregate_fieldsKeySpecifier)[];
export type message_type_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type message_type_max_fieldsKeySpecifier = ('value' | message_type_max_fieldsKeySpecifier)[];
export type message_type_max_fieldsFieldPolicy = {
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type message_type_min_fieldsKeySpecifier = ('value' | message_type_min_fieldsKeySpecifier)[];
export type message_type_min_fieldsFieldPolicy = {
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type message_type_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | message_type_mutation_responseKeySpecifier)[];
export type message_type_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type mutation_rootKeySpecifier = ('delete_account' | 'delete_account_by_pk' | 'delete_attachment' | 'delete_attachment_by_pk' | 'delete_last_seen_message' | 'delete_last_seen_message_by_pk' | 'delete_membership_status' | 'delete_membership_status_by_pk' | 'delete_message' | 'delete_message_by_pk' | 'delete_message_reaction' | 'delete_message_reaction_by_pk' | 'delete_message_type' | 'delete_message_type_by_pk' | 'delete_notification' | 'delete_notification_by_pk' | 'delete_room' | 'delete_room_by_pk' | 'delete_room_invitation' | 'delete_room_invitation_by_pk' | 'delete_room_member' | 'delete_room_member_by_pk' | 'delete_space' | 'delete_space_by_pk' | 'delete_space_member' | 'delete_space_member_by_pk' | 'delete_task' | 'delete_task_by_pk' | 'delete_team' | 'delete_team_by_pk' | 'delete_team_invitation' | 'delete_team_invitation_by_pk' | 'delete_team_member' | 'delete_team_member_by_pk' | 'delete_team_slack_installation' | 'delete_team_slack_installation_by_pk' | 'delete_topic' | 'delete_topic_by_pk' | 'delete_topic_member' | 'delete_topic_member_by_pk' | 'delete_transcription' | 'delete_transcription_by_pk' | 'delete_transcription_status' | 'delete_transcription_status_by_pk' | 'delete_user' | 'delete_user_by_pk' | 'delete_whitelist' | 'delete_whitelist_by_pk' | 'insert_account' | 'insert_account_one' | 'insert_attachment' | 'insert_attachment_one' | 'insert_last_seen_message' | 'insert_last_seen_message_one' | 'insert_membership_status' | 'insert_membership_status_one' | 'insert_message' | 'insert_message_one' | 'insert_message_reaction' | 'insert_message_reaction_one' | 'insert_message_type' | 'insert_message_type_one' | 'insert_notification' | 'insert_notification_one' | 'insert_room' | 'insert_room_invitation' | 'insert_room_invitation_one' | 'insert_room_member' | 'insert_room_member_one' | 'insert_room_one' | 'insert_space' | 'insert_space_member' | 'insert_space_member_one' | 'insert_space_one' | 'insert_task' | 'insert_task_one' | 'insert_team' | 'insert_team_invitation' | 'insert_team_invitation_one' | 'insert_team_member' | 'insert_team_member_one' | 'insert_team_one' | 'insert_team_slack_installation' | 'insert_team_slack_installation_one' | 'insert_topic' | 'insert_topic_member' | 'insert_topic_member_one' | 'insert_topic_one' | 'insert_transcription' | 'insert_transcription_one' | 'insert_transcription_status' | 'insert_transcription_status_one' | 'insert_user' | 'insert_user_one' | 'insert_whitelist' | 'insert_whitelist_one' | 'resend_invitation' | 'update_account' | 'update_account_by_pk' | 'update_attachment' | 'update_attachment_by_pk' | 'update_last_seen_message' | 'update_last_seen_message_by_pk' | 'update_membership_status' | 'update_membership_status_by_pk' | 'update_message' | 'update_message_by_pk' | 'update_message_reaction' | 'update_message_reaction_by_pk' | 'update_message_type' | 'update_message_type_by_pk' | 'update_notification' | 'update_notification_by_pk' | 'update_room' | 'update_room_by_pk' | 'update_room_invitation' | 'update_room_invitation_by_pk' | 'update_room_member' | 'update_room_member_by_pk' | 'update_space' | 'update_space_by_pk' | 'update_space_member' | 'update_space_member_by_pk' | 'update_task' | 'update_task_by_pk' | 'update_team' | 'update_team_by_pk' | 'update_team_invitation' | 'update_team_invitation_by_pk' | 'update_team_member' | 'update_team_member_by_pk' | 'update_team_slack_installation' | 'update_team_slack_installation_by_pk' | 'update_topic' | 'update_topic_by_pk' | 'update_topic_member' | 'update_topic_member_by_pk' | 'update_transcription' | 'update_transcription_by_pk' | 'update_transcription_status' | 'update_transcription_status_by_pk' | 'update_user' | 'update_user_by_pk' | 'update_whitelist' | 'update_whitelist_by_pk' | 'upgrade_current_user' | mutation_rootKeySpecifier)[];
export type mutation_rootFieldPolicy = {
	delete_account?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_account_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_attachment?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_attachment_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_last_seen_message?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_last_seen_message_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_membership_status?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_membership_status_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_message?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_message_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_message_reaction?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_message_reaction_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_message_type?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_message_type_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_notification?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_notification_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_room?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_room_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_room_invitation?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_room_invitation_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_room_member?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_room_member_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_space?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_space_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_space_member?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_space_member_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_task?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_task_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_team?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_team_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_team_invitation?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_team_invitation_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_team_member?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_team_member_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_team_slack_installation?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_team_slack_installation_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_topic?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_topic_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_topic_member?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_topic_member_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_transcription?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_transcription_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_transcription_status?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_transcription_status_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_user?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_user_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_whitelist?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_whitelist_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_account?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_account_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_attachment?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_attachment_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_last_seen_message?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_last_seen_message_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_membership_status?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_membership_status_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_message?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_message_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_message_reaction?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_message_reaction_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_message_type?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_message_type_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_notification?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_notification_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_room?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_room_invitation?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_room_invitation_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_room_member?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_room_member_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_room_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_space?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_space_member?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_space_member_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_space_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_task?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_task_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_team?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_team_invitation?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_team_invitation_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_team_member?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_team_member_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_team_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_team_slack_installation?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_team_slack_installation_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_topic?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_topic_member?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_topic_member_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_topic_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_transcription?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_transcription_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_transcription_status?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_transcription_status_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_user?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_user_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_whitelist?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_whitelist_one?: FieldPolicy<any> | FieldReadFunction<any>,
	resend_invitation?: FieldPolicy<any> | FieldReadFunction<any>,
	update_account?: FieldPolicy<any> | FieldReadFunction<any>,
	update_account_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_attachment?: FieldPolicy<any> | FieldReadFunction<any>,
	update_attachment_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_last_seen_message?: FieldPolicy<any> | FieldReadFunction<any>,
	update_last_seen_message_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_membership_status?: FieldPolicy<any> | FieldReadFunction<any>,
	update_membership_status_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_message?: FieldPolicy<any> | FieldReadFunction<any>,
	update_message_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_message_reaction?: FieldPolicy<any> | FieldReadFunction<any>,
	update_message_reaction_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_message_type?: FieldPolicy<any> | FieldReadFunction<any>,
	update_message_type_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_notification?: FieldPolicy<any> | FieldReadFunction<any>,
	update_notification_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_room?: FieldPolicy<any> | FieldReadFunction<any>,
	update_room_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_room_invitation?: FieldPolicy<any> | FieldReadFunction<any>,
	update_room_invitation_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_room_member?: FieldPolicy<any> | FieldReadFunction<any>,
	update_room_member_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_space?: FieldPolicy<any> | FieldReadFunction<any>,
	update_space_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_space_member?: FieldPolicy<any> | FieldReadFunction<any>,
	update_space_member_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_task?: FieldPolicy<any> | FieldReadFunction<any>,
	update_task_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_team?: FieldPolicy<any> | FieldReadFunction<any>,
	update_team_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_team_invitation?: FieldPolicy<any> | FieldReadFunction<any>,
	update_team_invitation_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_team_member?: FieldPolicy<any> | FieldReadFunction<any>,
	update_team_member_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_team_slack_installation?: FieldPolicy<any> | FieldReadFunction<any>,
	update_team_slack_installation_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_topic?: FieldPolicy<any> | FieldReadFunction<any>,
	update_topic_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_topic_member?: FieldPolicy<any> | FieldReadFunction<any>,
	update_topic_member_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_transcription?: FieldPolicy<any> | FieldReadFunction<any>,
	update_transcription_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_transcription_status?: FieldPolicy<any> | FieldReadFunction<any>,
	update_transcription_status_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_user?: FieldPolicy<any> | FieldReadFunction<any>,
	update_user_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_whitelist?: FieldPolicy<any> | FieldReadFunction<any>,
	update_whitelist_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	upgrade_current_user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type notificationKeySpecifier = ('created_at' | 'data' | 'id' | 'read_at' | 'updated_at' | 'user' | 'user_id' | notificationKeySpecifier)[];
export type notificationFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	data?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	read_at?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type notification_aggregateKeySpecifier = ('aggregate' | 'nodes' | notification_aggregateKeySpecifier)[];
export type notification_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type notification_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | notification_aggregate_fieldsKeySpecifier)[];
export type notification_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type notification_max_fieldsKeySpecifier = ('created_at' | 'id' | 'read_at' | 'updated_at' | 'user_id' | notification_max_fieldsKeySpecifier)[];
export type notification_max_fieldsFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	read_at?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type notification_min_fieldsKeySpecifier = ('created_at' | 'id' | 'read_at' | 'updated_at' | 'user_id' | notification_min_fieldsKeySpecifier)[];
export type notification_min_fieldsFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	read_at?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type notification_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | notification_mutation_responseKeySpecifier)[];
export type notification_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type query_rootKeySpecifier = ('account' | 'account_aggregate' | 'account_by_pk' | 'attachment' | 'attachment_aggregate' | 'attachment_by_pk' | 'get_team_slack_installation_url' | 'get_upload_url' | 'last_seen_message' | 'last_seen_message_aggregate' | 'last_seen_message_by_pk' | 'lookup_team_name' | 'membership_status' | 'membership_status_aggregate' | 'membership_status_by_pk' | 'message' | 'message_aggregate' | 'message_by_pk' | 'message_reaction' | 'message_reaction_aggregate' | 'message_reaction_by_pk' | 'message_type' | 'message_type_aggregate' | 'message_type_by_pk' | 'notification' | 'notification_aggregate' | 'notification_by_pk' | 'room' | 'room_aggregate' | 'room_by_pk' | 'room_invitation' | 'room_invitation_aggregate' | 'room_invitation_by_pk' | 'room_invitation_view' | 'room_last_posted_message' | 'room_last_posted_message_aggregate' | 'room_member' | 'room_member_aggregate' | 'room_member_by_pk' | 'space' | 'space_aggregate' | 'space_by_pk' | 'space_member' | 'space_member_aggregate' | 'space_member_by_pk' | 'task' | 'task_aggregate' | 'task_by_pk' | 'team' | 'team_aggregate' | 'team_by_pk' | 'team_invitation' | 'team_invitation_aggregate' | 'team_invitation_by_pk' | 'team_member' | 'team_member_aggregate' | 'team_member_by_pk' | 'team_slack_installation' | 'team_slack_installation_aggregate' | 'team_slack_installation_by_pk' | 'topic' | 'topic_aggregate' | 'topic_by_pk' | 'topic_member' | 'topic_member_aggregate' | 'topic_member_by_pk' | 'transcription' | 'transcription_aggregate' | 'transcription_by_pk' | 'transcription_status' | 'transcription_status_aggregate' | 'transcription_status_by_pk' | 'unread_messages' | 'unread_messages_aggregate' | 'user' | 'user_aggregate' | 'user_by_pk' | 'whitelist' | 'whitelist_aggregate' | 'whitelist_by_pk' | query_rootKeySpecifier)[];
export type query_rootFieldPolicy = {
	account?: FieldPolicy<any> | FieldReadFunction<any>,
	account_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	account_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	attachment?: FieldPolicy<any> | FieldReadFunction<any>,
	attachment_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	attachment_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	get_team_slack_installation_url?: FieldPolicy<any> | FieldReadFunction<any>,
	get_upload_url?: FieldPolicy<any> | FieldReadFunction<any>,
	last_seen_message?: FieldPolicy<any> | FieldReadFunction<any>,
	last_seen_message_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	last_seen_message_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	lookup_team_name?: FieldPolicy<any> | FieldReadFunction<any>,
	membership_status?: FieldPolicy<any> | FieldReadFunction<any>,
	membership_status_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	membership_status_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	message_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	message_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	message_reaction?: FieldPolicy<any> | FieldReadFunction<any>,
	message_reaction_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	message_reaction_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	message_type?: FieldPolicy<any> | FieldReadFunction<any>,
	message_type_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	message_type_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	notification?: FieldPolicy<any> | FieldReadFunction<any>,
	notification_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	notification_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	room?: FieldPolicy<any> | FieldReadFunction<any>,
	room_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	room_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	room_invitation?: FieldPolicy<any> | FieldReadFunction<any>,
	room_invitation_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	room_invitation_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	room_invitation_view?: FieldPolicy<any> | FieldReadFunction<any>,
	room_last_posted_message?: FieldPolicy<any> | FieldReadFunction<any>,
	room_last_posted_message_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	room_member?: FieldPolicy<any> | FieldReadFunction<any>,
	room_member_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	room_member_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	space?: FieldPolicy<any> | FieldReadFunction<any>,
	space_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	space_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	space_member?: FieldPolicy<any> | FieldReadFunction<any>,
	space_member_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	space_member_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	task?: FieldPolicy<any> | FieldReadFunction<any>,
	task_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	task_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	team?: FieldPolicy<any> | FieldReadFunction<any>,
	team_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	team_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	team_invitation?: FieldPolicy<any> | FieldReadFunction<any>,
	team_invitation_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	team_invitation_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	team_member?: FieldPolicy<any> | FieldReadFunction<any>,
	team_member_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	team_member_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	team_slack_installation?: FieldPolicy<any> | FieldReadFunction<any>,
	team_slack_installation_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	team_slack_installation_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	topic?: FieldPolicy<any> | FieldReadFunction<any>,
	topic_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	topic_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	topic_member?: FieldPolicy<any> | FieldReadFunction<any>,
	topic_member_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	topic_member_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription_status?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription_status_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription_status_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	unread_messages?: FieldPolicy<any> | FieldReadFunction<any>,
	unread_messages_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	user_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	user_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	whitelist?: FieldPolicy<any> | FieldReadFunction<any>,
	whitelist_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	whitelist_by_pk?: FieldPolicy<any> | FieldReadFunction<any>
};
export type roomKeySpecifier = ('created_at' | 'creator' | 'creator_id' | 'deadline' | 'finished_at' | 'id' | 'invitations' | 'invitations_aggregate' | 'is_private' | 'last_activity_at' | 'last_posted_message' | 'members' | 'members_aggregate' | 'name' | 'notification_job_id' | 'owner' | 'owner_id' | 'recurring_days' | 'recurring_last_restart' | 'slug' | 'source_google_calendar_event_id' | 'space' | 'space_id' | 'summary' | 'topics' | 'topics_aggregate' | roomKeySpecifier)[];
export type roomFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	creator?: FieldPolicy<any> | FieldReadFunction<any>,
	creator_id?: FieldPolicy<any> | FieldReadFunction<any>,
	deadline?: FieldPolicy<any> | FieldReadFunction<any>,
	finished_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	invitations?: FieldPolicy<any> | FieldReadFunction<any>,
	invitations_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	is_private?: FieldPolicy<any> | FieldReadFunction<any>,
	last_activity_at?: FieldPolicy<any> | FieldReadFunction<any>,
	last_posted_message?: FieldPolicy<any> | FieldReadFunction<any>,
	members?: FieldPolicy<any> | FieldReadFunction<any>,
	members_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	notification_job_id?: FieldPolicy<any> | FieldReadFunction<any>,
	owner?: FieldPolicy<any> | FieldReadFunction<any>,
	owner_id?: FieldPolicy<any> | FieldReadFunction<any>,
	recurring_days?: FieldPolicy<any> | FieldReadFunction<any>,
	recurring_last_restart?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	source_google_calendar_event_id?: FieldPolicy<any> | FieldReadFunction<any>,
	space?: FieldPolicy<any> | FieldReadFunction<any>,
	space_id?: FieldPolicy<any> | FieldReadFunction<any>,
	summary?: FieldPolicy<any> | FieldReadFunction<any>,
	topics?: FieldPolicy<any> | FieldReadFunction<any>,
	topics_aggregate?: FieldPolicy<any> | FieldReadFunction<any>
};
export type room_aggregateKeySpecifier = ('aggregate' | 'nodes' | room_aggregateKeySpecifier)[];
export type room_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type room_aggregate_fieldsKeySpecifier = ('avg' | 'count' | 'max' | 'min' | 'stddev' | 'stddev_pop' | 'stddev_samp' | 'sum' | 'var_pop' | 'var_samp' | 'variance' | room_aggregate_fieldsKeySpecifier)[];
export type room_aggregate_fieldsFieldPolicy = {
	avg?: FieldPolicy<any> | FieldReadFunction<any>,
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev_pop?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev_samp?: FieldPolicy<any> | FieldReadFunction<any>,
	sum?: FieldPolicy<any> | FieldReadFunction<any>,
	var_pop?: FieldPolicy<any> | FieldReadFunction<any>,
	var_samp?: FieldPolicy<any> | FieldReadFunction<any>,
	variance?: FieldPolicy<any> | FieldReadFunction<any>
};
export type room_avg_fieldsKeySpecifier = ('recurring_days' | room_avg_fieldsKeySpecifier)[];
export type room_avg_fieldsFieldPolicy = {
	recurring_days?: FieldPolicy<any> | FieldReadFunction<any>
};
export type room_invitationKeySpecifier = ('created_at' | 'email' | 'id' | 'inviting_user' | 'inviting_user_id' | 'room' | 'room_id' | 'team' | 'team_id' | 'token' | 'used_at' | 'used_by_user' | 'used_by_user_id' | room_invitationKeySpecifier)[];
export type room_invitationFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	inviting_user?: FieldPolicy<any> | FieldReadFunction<any>,
	inviting_user_id?: FieldPolicy<any> | FieldReadFunction<any>,
	room?: FieldPolicy<any> | FieldReadFunction<any>,
	room_id?: FieldPolicy<any> | FieldReadFunction<any>,
	team?: FieldPolicy<any> | FieldReadFunction<any>,
	team_id?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	used_at?: FieldPolicy<any> | FieldReadFunction<any>,
	used_by_user?: FieldPolicy<any> | FieldReadFunction<any>,
	used_by_user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type room_invitation_aggregateKeySpecifier = ('aggregate' | 'nodes' | room_invitation_aggregateKeySpecifier)[];
export type room_invitation_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type room_invitation_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | room_invitation_aggregate_fieldsKeySpecifier)[];
export type room_invitation_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type room_invitation_max_fieldsKeySpecifier = ('created_at' | 'email' | 'id' | 'inviting_user_id' | 'room_id' | 'team_id' | 'token' | 'used_at' | 'used_by_user_id' | room_invitation_max_fieldsKeySpecifier)[];
export type room_invitation_max_fieldsFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	inviting_user_id?: FieldPolicy<any> | FieldReadFunction<any>,
	room_id?: FieldPolicy<any> | FieldReadFunction<any>,
	team_id?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	used_at?: FieldPolicy<any> | FieldReadFunction<any>,
	used_by_user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type room_invitation_min_fieldsKeySpecifier = ('created_at' | 'email' | 'id' | 'inviting_user_id' | 'room_id' | 'team_id' | 'token' | 'used_at' | 'used_by_user_id' | room_invitation_min_fieldsKeySpecifier)[];
export type room_invitation_min_fieldsFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	inviting_user_id?: FieldPolicy<any> | FieldReadFunction<any>,
	room_id?: FieldPolicy<any> | FieldReadFunction<any>,
	team_id?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	used_at?: FieldPolicy<any> | FieldReadFunction<any>,
	used_by_user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type room_invitation_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | room_invitation_mutation_responseKeySpecifier)[];
export type room_invitation_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type room_last_posted_messageKeySpecifier = ('last_posted_message_time' | 'room' | 'room_id' | room_last_posted_messageKeySpecifier)[];
export type room_last_posted_messageFieldPolicy = {
	last_posted_message_time?: FieldPolicy<any> | FieldReadFunction<any>,
	room?: FieldPolicy<any> | FieldReadFunction<any>,
	room_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type room_last_posted_message_aggregateKeySpecifier = ('aggregate' | 'nodes' | room_last_posted_message_aggregateKeySpecifier)[];
export type room_last_posted_message_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type room_last_posted_message_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | room_last_posted_message_aggregate_fieldsKeySpecifier)[];
export type room_last_posted_message_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type room_last_posted_message_max_fieldsKeySpecifier = ('last_posted_message_time' | 'room_id' | room_last_posted_message_max_fieldsKeySpecifier)[];
export type room_last_posted_message_max_fieldsFieldPolicy = {
	last_posted_message_time?: FieldPolicy<any> | FieldReadFunction<any>,
	room_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type room_last_posted_message_min_fieldsKeySpecifier = ('last_posted_message_time' | 'room_id' | room_last_posted_message_min_fieldsKeySpecifier)[];
export type room_last_posted_message_min_fieldsFieldPolicy = {
	last_posted_message_time?: FieldPolicy<any> | FieldReadFunction<any>,
	room_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type room_max_fieldsKeySpecifier = ('created_at' | 'creator_id' | 'deadline' | 'finished_at' | 'id' | 'last_activity_at' | 'name' | 'notification_job_id' | 'owner_id' | 'recurring_days' | 'recurring_last_restart' | 'slug' | 'source_google_calendar_event_id' | 'space_id' | 'summary' | room_max_fieldsKeySpecifier)[];
export type room_max_fieldsFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	creator_id?: FieldPolicy<any> | FieldReadFunction<any>,
	deadline?: FieldPolicy<any> | FieldReadFunction<any>,
	finished_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	last_activity_at?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	notification_job_id?: FieldPolicy<any> | FieldReadFunction<any>,
	owner_id?: FieldPolicy<any> | FieldReadFunction<any>,
	recurring_days?: FieldPolicy<any> | FieldReadFunction<any>,
	recurring_last_restart?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	source_google_calendar_event_id?: FieldPolicy<any> | FieldReadFunction<any>,
	space_id?: FieldPolicy<any> | FieldReadFunction<any>,
	summary?: FieldPolicy<any> | FieldReadFunction<any>
};
export type room_memberKeySpecifier = ('room' | 'room_id' | 'user' | 'user_id' | room_memberKeySpecifier)[];
export type room_memberFieldPolicy = {
	room?: FieldPolicy<any> | FieldReadFunction<any>,
	room_id?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type room_member_aggregateKeySpecifier = ('aggregate' | 'nodes' | room_member_aggregateKeySpecifier)[];
export type room_member_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type room_member_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | room_member_aggregate_fieldsKeySpecifier)[];
export type room_member_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type room_member_max_fieldsKeySpecifier = ('room_id' | 'user_id' | room_member_max_fieldsKeySpecifier)[];
export type room_member_max_fieldsFieldPolicy = {
	room_id?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type room_member_min_fieldsKeySpecifier = ('room_id' | 'user_id' | room_member_min_fieldsKeySpecifier)[];
export type room_member_min_fieldsFieldPolicy = {
	room_id?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type room_member_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | room_member_mutation_responseKeySpecifier)[];
export type room_member_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type room_min_fieldsKeySpecifier = ('created_at' | 'creator_id' | 'deadline' | 'finished_at' | 'id' | 'last_activity_at' | 'name' | 'notification_job_id' | 'owner_id' | 'recurring_days' | 'recurring_last_restart' | 'slug' | 'source_google_calendar_event_id' | 'space_id' | 'summary' | room_min_fieldsKeySpecifier)[];
export type room_min_fieldsFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	creator_id?: FieldPolicy<any> | FieldReadFunction<any>,
	deadline?: FieldPolicy<any> | FieldReadFunction<any>,
	finished_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	last_activity_at?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	notification_job_id?: FieldPolicy<any> | FieldReadFunction<any>,
	owner_id?: FieldPolicy<any> | FieldReadFunction<any>,
	recurring_days?: FieldPolicy<any> | FieldReadFunction<any>,
	recurring_last_restart?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	source_google_calendar_event_id?: FieldPolicy<any> | FieldReadFunction<any>,
	space_id?: FieldPolicy<any> | FieldReadFunction<any>,
	summary?: FieldPolicy<any> | FieldReadFunction<any>
};
export type room_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | room_mutation_responseKeySpecifier)[];
export type room_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type room_stddev_fieldsKeySpecifier = ('recurring_days' | room_stddev_fieldsKeySpecifier)[];
export type room_stddev_fieldsFieldPolicy = {
	recurring_days?: FieldPolicy<any> | FieldReadFunction<any>
};
export type room_stddev_pop_fieldsKeySpecifier = ('recurring_days' | room_stddev_pop_fieldsKeySpecifier)[];
export type room_stddev_pop_fieldsFieldPolicy = {
	recurring_days?: FieldPolicy<any> | FieldReadFunction<any>
};
export type room_stddev_samp_fieldsKeySpecifier = ('recurring_days' | room_stddev_samp_fieldsKeySpecifier)[];
export type room_stddev_samp_fieldsFieldPolicy = {
	recurring_days?: FieldPolicy<any> | FieldReadFunction<any>
};
export type room_sum_fieldsKeySpecifier = ('recurring_days' | room_sum_fieldsKeySpecifier)[];
export type room_sum_fieldsFieldPolicy = {
	recurring_days?: FieldPolicy<any> | FieldReadFunction<any>
};
export type room_var_pop_fieldsKeySpecifier = ('recurring_days' | room_var_pop_fieldsKeySpecifier)[];
export type room_var_pop_fieldsFieldPolicy = {
	recurring_days?: FieldPolicy<any> | FieldReadFunction<any>
};
export type room_var_samp_fieldsKeySpecifier = ('recurring_days' | room_var_samp_fieldsKeySpecifier)[];
export type room_var_samp_fieldsFieldPolicy = {
	recurring_days?: FieldPolicy<any> | FieldReadFunction<any>
};
export type room_variance_fieldsKeySpecifier = ('recurring_days' | room_variance_fieldsKeySpecifier)[];
export type room_variance_fieldsFieldPolicy = {
	recurring_days?: FieldPolicy<any> | FieldReadFunction<any>
};
export type spaceKeySpecifier = ('creator' | 'creator_id' | 'id' | 'members' | 'members_aggregate' | 'name' | 'rooms' | 'rooms_aggregate' | 'slug' | 'team' | 'team_id' | spaceKeySpecifier)[];
export type spaceFieldPolicy = {
	creator?: FieldPolicy<any> | FieldReadFunction<any>,
	creator_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	members?: FieldPolicy<any> | FieldReadFunction<any>,
	members_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	rooms?: FieldPolicy<any> | FieldReadFunction<any>,
	rooms_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	team?: FieldPolicy<any> | FieldReadFunction<any>,
	team_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type space_aggregateKeySpecifier = ('aggregate' | 'nodes' | space_aggregateKeySpecifier)[];
export type space_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type space_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | space_aggregate_fieldsKeySpecifier)[];
export type space_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type space_max_fieldsKeySpecifier = ('creator_id' | 'id' | 'name' | 'slug' | 'team_id' | space_max_fieldsKeySpecifier)[];
export type space_max_fieldsFieldPolicy = {
	creator_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	team_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type space_memberKeySpecifier = ('space' | 'space_id' | 'user' | 'user_id' | space_memberKeySpecifier)[];
export type space_memberFieldPolicy = {
	space?: FieldPolicy<any> | FieldReadFunction<any>,
	space_id?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type space_member_aggregateKeySpecifier = ('aggregate' | 'nodes' | space_member_aggregateKeySpecifier)[];
export type space_member_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type space_member_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | space_member_aggregate_fieldsKeySpecifier)[];
export type space_member_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type space_member_max_fieldsKeySpecifier = ('space_id' | 'user_id' | space_member_max_fieldsKeySpecifier)[];
export type space_member_max_fieldsFieldPolicy = {
	space_id?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type space_member_min_fieldsKeySpecifier = ('space_id' | 'user_id' | space_member_min_fieldsKeySpecifier)[];
export type space_member_min_fieldsFieldPolicy = {
	space_id?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type space_member_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | space_member_mutation_responseKeySpecifier)[];
export type space_member_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type space_min_fieldsKeySpecifier = ('creator_id' | 'id' | 'name' | 'slug' | 'team_id' | space_min_fieldsKeySpecifier)[];
export type space_min_fieldsFieldPolicy = {
	creator_id?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	team_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type space_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | space_mutation_responseKeySpecifier)[];
export type space_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type subscription_rootKeySpecifier = ('account' | 'account_aggregate' | 'account_by_pk' | 'attachment' | 'attachment_aggregate' | 'attachment_by_pk' | 'last_seen_message' | 'last_seen_message_aggregate' | 'last_seen_message_by_pk' | 'membership_status' | 'membership_status_aggregate' | 'membership_status_by_pk' | 'message' | 'message_aggregate' | 'message_by_pk' | 'message_reaction' | 'message_reaction_aggregate' | 'message_reaction_by_pk' | 'message_type' | 'message_type_aggregate' | 'message_type_by_pk' | 'notification' | 'notification_aggregate' | 'notification_by_pk' | 'room' | 'room_aggregate' | 'room_by_pk' | 'room_invitation' | 'room_invitation_aggregate' | 'room_invitation_by_pk' | 'room_last_posted_message' | 'room_last_posted_message_aggregate' | 'room_member' | 'room_member_aggregate' | 'room_member_by_pk' | 'space' | 'space_aggregate' | 'space_by_pk' | 'space_member' | 'space_member_aggregate' | 'space_member_by_pk' | 'task' | 'task_aggregate' | 'task_by_pk' | 'team' | 'team_aggregate' | 'team_by_pk' | 'team_invitation' | 'team_invitation_aggregate' | 'team_invitation_by_pk' | 'team_member' | 'team_member_aggregate' | 'team_member_by_pk' | 'team_slack_installation' | 'team_slack_installation_aggregate' | 'team_slack_installation_by_pk' | 'topic' | 'topic_aggregate' | 'topic_by_pk' | 'topic_member' | 'topic_member_aggregate' | 'topic_member_by_pk' | 'transcription' | 'transcription_aggregate' | 'transcription_by_pk' | 'transcription_status' | 'transcription_status_aggregate' | 'transcription_status_by_pk' | 'unread_messages' | 'unread_messages_aggregate' | 'user' | 'user_aggregate' | 'user_by_pk' | 'whitelist' | 'whitelist_aggregate' | 'whitelist_by_pk' | subscription_rootKeySpecifier)[];
export type subscription_rootFieldPolicy = {
	account?: FieldPolicy<any> | FieldReadFunction<any>,
	account_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	account_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	attachment?: FieldPolicy<any> | FieldReadFunction<any>,
	attachment_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	attachment_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	last_seen_message?: FieldPolicy<any> | FieldReadFunction<any>,
	last_seen_message_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	last_seen_message_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	membership_status?: FieldPolicy<any> | FieldReadFunction<any>,
	membership_status_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	membership_status_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	message_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	message_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	message_reaction?: FieldPolicy<any> | FieldReadFunction<any>,
	message_reaction_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	message_reaction_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	message_type?: FieldPolicy<any> | FieldReadFunction<any>,
	message_type_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	message_type_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	notification?: FieldPolicy<any> | FieldReadFunction<any>,
	notification_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	notification_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	room?: FieldPolicy<any> | FieldReadFunction<any>,
	room_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	room_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	room_invitation?: FieldPolicy<any> | FieldReadFunction<any>,
	room_invitation_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	room_invitation_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	room_last_posted_message?: FieldPolicy<any> | FieldReadFunction<any>,
	room_last_posted_message_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	room_member?: FieldPolicy<any> | FieldReadFunction<any>,
	room_member_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	room_member_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	space?: FieldPolicy<any> | FieldReadFunction<any>,
	space_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	space_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	space_member?: FieldPolicy<any> | FieldReadFunction<any>,
	space_member_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	space_member_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	task?: FieldPolicy<any> | FieldReadFunction<any>,
	task_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	task_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	team?: FieldPolicy<any> | FieldReadFunction<any>,
	team_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	team_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	team_invitation?: FieldPolicy<any> | FieldReadFunction<any>,
	team_invitation_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	team_invitation_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	team_member?: FieldPolicy<any> | FieldReadFunction<any>,
	team_member_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	team_member_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	team_slack_installation?: FieldPolicy<any> | FieldReadFunction<any>,
	team_slack_installation_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	team_slack_installation_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	topic?: FieldPolicy<any> | FieldReadFunction<any>,
	topic_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	topic_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	topic_member?: FieldPolicy<any> | FieldReadFunction<any>,
	topic_member_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	topic_member_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription_status?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription_status_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription_status_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	unread_messages?: FieldPolicy<any> | FieldReadFunction<any>,
	unread_messages_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	user_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	user_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	whitelist?: FieldPolicy<any> | FieldReadFunction<any>,
	whitelist_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	whitelist_by_pk?: FieldPolicy<any> | FieldReadFunction<any>
};
export type taskKeySpecifier = ('created_at' | 'done_at' | 'id' | 'message' | 'message_id' | 'seen_at' | 'type' | 'user' | 'user_id' | taskKeySpecifier)[];
export type taskFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	done_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	message_id?: FieldPolicy<any> | FieldReadFunction<any>,
	seen_at?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type task_aggregateKeySpecifier = ('aggregate' | 'nodes' | task_aggregateKeySpecifier)[];
export type task_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type task_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | task_aggregate_fieldsKeySpecifier)[];
export type task_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type task_max_fieldsKeySpecifier = ('created_at' | 'done_at' | 'id' | 'message_id' | 'seen_at' | 'type' | 'user_id' | task_max_fieldsKeySpecifier)[];
export type task_max_fieldsFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	done_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	message_id?: FieldPolicy<any> | FieldReadFunction<any>,
	seen_at?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type task_min_fieldsKeySpecifier = ('created_at' | 'done_at' | 'id' | 'message_id' | 'seen_at' | 'type' | 'user_id' | task_min_fieldsKeySpecifier)[];
export type task_min_fieldsFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	done_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	message_id?: FieldPolicy<any> | FieldReadFunction<any>,
	seen_at?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type task_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | task_mutation_responseKeySpecifier)[];
export type task_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type teamKeySpecifier = ('id' | 'invitations' | 'invitations_aggregate' | 'memberships' | 'memberships_aggregate' | 'name' | 'owner' | 'owner_id' | 'slack_installation' | 'slug' | 'spaces' | 'spaces_aggregate' | teamKeySpecifier)[];
export type teamFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	invitations?: FieldPolicy<any> | FieldReadFunction<any>,
	invitations_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	memberships?: FieldPolicy<any> | FieldReadFunction<any>,
	memberships_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	owner?: FieldPolicy<any> | FieldReadFunction<any>,
	owner_id?: FieldPolicy<any> | FieldReadFunction<any>,
	slack_installation?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	spaces?: FieldPolicy<any> | FieldReadFunction<any>,
	spaces_aggregate?: FieldPolicy<any> | FieldReadFunction<any>
};
export type team_aggregateKeySpecifier = ('aggregate' | 'nodes' | team_aggregateKeySpecifier)[];
export type team_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type team_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | team_aggregate_fieldsKeySpecifier)[];
export type team_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type team_invitationKeySpecifier = ('created_at' | 'email' | 'id' | 'inviting_user' | 'inviting_user_id' | 'team' | 'team_id' | 'token' | 'used_at' | 'used_by_user' | 'used_by_user_id' | team_invitationKeySpecifier)[];
export type team_invitationFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	inviting_user?: FieldPolicy<any> | FieldReadFunction<any>,
	inviting_user_id?: FieldPolicy<any> | FieldReadFunction<any>,
	team?: FieldPolicy<any> | FieldReadFunction<any>,
	team_id?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	used_at?: FieldPolicy<any> | FieldReadFunction<any>,
	used_by_user?: FieldPolicy<any> | FieldReadFunction<any>,
	used_by_user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type team_invitation_aggregateKeySpecifier = ('aggregate' | 'nodes' | team_invitation_aggregateKeySpecifier)[];
export type team_invitation_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type team_invitation_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | team_invitation_aggregate_fieldsKeySpecifier)[];
export type team_invitation_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type team_invitation_max_fieldsKeySpecifier = ('created_at' | 'email' | 'id' | 'inviting_user_id' | 'team_id' | 'token' | 'used_at' | 'used_by_user_id' | team_invitation_max_fieldsKeySpecifier)[];
export type team_invitation_max_fieldsFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	inviting_user_id?: FieldPolicy<any> | FieldReadFunction<any>,
	team_id?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	used_at?: FieldPolicy<any> | FieldReadFunction<any>,
	used_by_user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type team_invitation_min_fieldsKeySpecifier = ('created_at' | 'email' | 'id' | 'inviting_user_id' | 'team_id' | 'token' | 'used_at' | 'used_by_user_id' | team_invitation_min_fieldsKeySpecifier)[];
export type team_invitation_min_fieldsFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	inviting_user_id?: FieldPolicy<any> | FieldReadFunction<any>,
	team_id?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	used_at?: FieldPolicy<any> | FieldReadFunction<any>,
	used_by_user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type team_invitation_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | team_invitation_mutation_responseKeySpecifier)[];
export type team_invitation_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type team_max_fieldsKeySpecifier = ('id' | 'name' | 'owner_id' | 'slug' | team_max_fieldsKeySpecifier)[];
export type team_max_fieldsFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	owner_id?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>
};
export type team_memberKeySpecifier = ('team' | 'team_id' | 'user' | 'user_id' | team_memberKeySpecifier)[];
export type team_memberFieldPolicy = {
	team?: FieldPolicy<any> | FieldReadFunction<any>,
	team_id?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type team_member_aggregateKeySpecifier = ('aggregate' | 'nodes' | team_member_aggregateKeySpecifier)[];
export type team_member_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type team_member_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | team_member_aggregate_fieldsKeySpecifier)[];
export type team_member_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type team_member_max_fieldsKeySpecifier = ('team_id' | 'user_id' | team_member_max_fieldsKeySpecifier)[];
export type team_member_max_fieldsFieldPolicy = {
	team_id?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type team_member_min_fieldsKeySpecifier = ('team_id' | 'user_id' | team_member_min_fieldsKeySpecifier)[];
export type team_member_min_fieldsFieldPolicy = {
	team_id?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type team_member_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | team_member_mutation_responseKeySpecifier)[];
export type team_member_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type team_min_fieldsKeySpecifier = ('id' | 'name' | 'owner_id' | 'slug' | team_min_fieldsKeySpecifier)[];
export type team_min_fieldsFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	owner_id?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>
};
export type team_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | team_mutation_responseKeySpecifier)[];
export type team_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type team_slack_installationKeySpecifier = ('data' | 'team' | 'team_id' | team_slack_installationKeySpecifier)[];
export type team_slack_installationFieldPolicy = {
	data?: FieldPolicy<any> | FieldReadFunction<any>,
	team?: FieldPolicy<any> | FieldReadFunction<any>,
	team_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type team_slack_installation_aggregateKeySpecifier = ('aggregate' | 'nodes' | team_slack_installation_aggregateKeySpecifier)[];
export type team_slack_installation_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type team_slack_installation_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | team_slack_installation_aggregate_fieldsKeySpecifier)[];
export type team_slack_installation_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type team_slack_installation_max_fieldsKeySpecifier = ('team_id' | team_slack_installation_max_fieldsKeySpecifier)[];
export type team_slack_installation_max_fieldsFieldPolicy = {
	team_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type team_slack_installation_min_fieldsKeySpecifier = ('team_id' | team_slack_installation_min_fieldsKeySpecifier)[];
export type team_slack_installation_min_fieldsFieldPolicy = {
	team_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type team_slack_installation_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | team_slack_installation_mutation_responseKeySpecifier)[];
export type team_slack_installation_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type topicKeySpecifier = ('archived_at' | 'closed_at' | 'closed_by_user' | 'closed_by_user_id' | 'closing_summary' | 'id' | 'index' | 'members' | 'members_aggregate' | 'messages' | 'messages_aggregate' | 'name' | 'owner' | 'owner_id' | 'room' | 'room_id' | 'slug' | topicKeySpecifier)[];
export type topicFieldPolicy = {
	archived_at?: FieldPolicy<any> | FieldReadFunction<any>,
	closed_at?: FieldPolicy<any> | FieldReadFunction<any>,
	closed_by_user?: FieldPolicy<any> | FieldReadFunction<any>,
	closed_by_user_id?: FieldPolicy<any> | FieldReadFunction<any>,
	closing_summary?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	index?: FieldPolicy<any> | FieldReadFunction<any>,
	members?: FieldPolicy<any> | FieldReadFunction<any>,
	members_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	messages?: FieldPolicy<any> | FieldReadFunction<any>,
	messages_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	owner?: FieldPolicy<any> | FieldReadFunction<any>,
	owner_id?: FieldPolicy<any> | FieldReadFunction<any>,
	room?: FieldPolicy<any> | FieldReadFunction<any>,
	room_id?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>
};
export type topic_aggregateKeySpecifier = ('aggregate' | 'nodes' | topic_aggregateKeySpecifier)[];
export type topic_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type topic_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | topic_aggregate_fieldsKeySpecifier)[];
export type topic_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type topic_max_fieldsKeySpecifier = ('archived_at' | 'closed_at' | 'closed_by_user_id' | 'closing_summary' | 'id' | 'index' | 'name' | 'owner_id' | 'room_id' | 'slug' | topic_max_fieldsKeySpecifier)[];
export type topic_max_fieldsFieldPolicy = {
	archived_at?: FieldPolicy<any> | FieldReadFunction<any>,
	closed_at?: FieldPolicy<any> | FieldReadFunction<any>,
	closed_by_user_id?: FieldPolicy<any> | FieldReadFunction<any>,
	closing_summary?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	index?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	owner_id?: FieldPolicy<any> | FieldReadFunction<any>,
	room_id?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>
};
export type topic_memberKeySpecifier = ('topic' | 'topic_id' | 'user' | 'user_id' | topic_memberKeySpecifier)[];
export type topic_memberFieldPolicy = {
	topic?: FieldPolicy<any> | FieldReadFunction<any>,
	topic_id?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type topic_member_aggregateKeySpecifier = ('aggregate' | 'nodes' | topic_member_aggregateKeySpecifier)[];
export type topic_member_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type topic_member_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | topic_member_aggregate_fieldsKeySpecifier)[];
export type topic_member_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type topic_member_max_fieldsKeySpecifier = ('topic_id' | 'user_id' | topic_member_max_fieldsKeySpecifier)[];
export type topic_member_max_fieldsFieldPolicy = {
	topic_id?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type topic_member_min_fieldsKeySpecifier = ('topic_id' | 'user_id' | topic_member_min_fieldsKeySpecifier)[];
export type topic_member_min_fieldsFieldPolicy = {
	topic_id?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type topic_member_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | topic_member_mutation_responseKeySpecifier)[];
export type topic_member_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type topic_min_fieldsKeySpecifier = ('archived_at' | 'closed_at' | 'closed_by_user_id' | 'closing_summary' | 'id' | 'index' | 'name' | 'owner_id' | 'room_id' | 'slug' | topic_min_fieldsKeySpecifier)[];
export type topic_min_fieldsFieldPolicy = {
	archived_at?: FieldPolicy<any> | FieldReadFunction<any>,
	closed_at?: FieldPolicy<any> | FieldReadFunction<any>,
	closed_by_user_id?: FieldPolicy<any> | FieldReadFunction<any>,
	closing_summary?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	index?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	owner_id?: FieldPolicy<any> | FieldReadFunction<any>,
	room_id?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>
};
export type topic_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | topic_mutation_responseKeySpecifier)[];
export type topic_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type transcriptionKeySpecifier = ('attachments' | 'attachments_aggregate' | 'created_at' | 'id' | 'sonix_media_id' | 'status' | 'transcript' | 'updated_at' | transcriptionKeySpecifier)[];
export type transcriptionFieldPolicy = {
	attachments?: FieldPolicy<any> | FieldReadFunction<any>,
	attachments_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	sonix_media_id?: FieldPolicy<any> | FieldReadFunction<any>,
	status?: FieldPolicy<any> | FieldReadFunction<any>,
	transcript?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type transcription_aggregateKeySpecifier = ('aggregate' | 'nodes' | transcription_aggregateKeySpecifier)[];
export type transcription_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type transcription_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | transcription_aggregate_fieldsKeySpecifier)[];
export type transcription_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type transcription_max_fieldsKeySpecifier = ('created_at' | 'id' | 'sonix_media_id' | 'updated_at' | transcription_max_fieldsKeySpecifier)[];
export type transcription_max_fieldsFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	sonix_media_id?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type transcription_min_fieldsKeySpecifier = ('created_at' | 'id' | 'sonix_media_id' | 'updated_at' | transcription_min_fieldsKeySpecifier)[];
export type transcription_min_fieldsFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	sonix_media_id?: FieldPolicy<any> | FieldReadFunction<any>,
	updated_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type transcription_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | transcription_mutation_responseKeySpecifier)[];
export type transcription_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type transcription_statusKeySpecifier = ('value' | transcription_statusKeySpecifier)[];
export type transcription_statusFieldPolicy = {
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type transcription_status_aggregateKeySpecifier = ('aggregate' | 'nodes' | transcription_status_aggregateKeySpecifier)[];
export type transcription_status_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type transcription_status_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | transcription_status_aggregate_fieldsKeySpecifier)[];
export type transcription_status_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type transcription_status_max_fieldsKeySpecifier = ('value' | transcription_status_max_fieldsKeySpecifier)[];
export type transcription_status_max_fieldsFieldPolicy = {
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type transcription_status_min_fieldsKeySpecifier = ('value' | transcription_status_min_fieldsKeySpecifier)[];
export type transcription_status_min_fieldsFieldPolicy = {
	value?: FieldPolicy<any> | FieldReadFunction<any>
};
export type transcription_status_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | transcription_status_mutation_responseKeySpecifier)[];
export type transcription_status_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type unread_messagesKeySpecifier = ('room_id' | 'topic_id' | 'unread_messages' | 'user_id' | unread_messagesKeySpecifier)[];
export type unread_messagesFieldPolicy = {
	room_id?: FieldPolicy<any> | FieldReadFunction<any>,
	topic_id?: FieldPolicy<any> | FieldReadFunction<any>,
	unread_messages?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type unread_messages_aggregateKeySpecifier = ('aggregate' | 'nodes' | unread_messages_aggregateKeySpecifier)[];
export type unread_messages_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type unread_messages_aggregate_fieldsKeySpecifier = ('avg' | 'count' | 'max' | 'min' | 'stddev' | 'stddev_pop' | 'stddev_samp' | 'sum' | 'var_pop' | 'var_samp' | 'variance' | unread_messages_aggregate_fieldsKeySpecifier)[];
export type unread_messages_aggregate_fieldsFieldPolicy = {
	avg?: FieldPolicy<any> | FieldReadFunction<any>,
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev_pop?: FieldPolicy<any> | FieldReadFunction<any>,
	stddev_samp?: FieldPolicy<any> | FieldReadFunction<any>,
	sum?: FieldPolicy<any> | FieldReadFunction<any>,
	var_pop?: FieldPolicy<any> | FieldReadFunction<any>,
	var_samp?: FieldPolicy<any> | FieldReadFunction<any>,
	variance?: FieldPolicy<any> | FieldReadFunction<any>
};
export type unread_messages_avg_fieldsKeySpecifier = ('unread_messages' | unread_messages_avg_fieldsKeySpecifier)[];
export type unread_messages_avg_fieldsFieldPolicy = {
	unread_messages?: FieldPolicy<any> | FieldReadFunction<any>
};
export type unread_messages_max_fieldsKeySpecifier = ('room_id' | 'topic_id' | 'unread_messages' | 'user_id' | unread_messages_max_fieldsKeySpecifier)[];
export type unread_messages_max_fieldsFieldPolicy = {
	room_id?: FieldPolicy<any> | FieldReadFunction<any>,
	topic_id?: FieldPolicy<any> | FieldReadFunction<any>,
	unread_messages?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type unread_messages_min_fieldsKeySpecifier = ('room_id' | 'topic_id' | 'unread_messages' | 'user_id' | unread_messages_min_fieldsKeySpecifier)[];
export type unread_messages_min_fieldsFieldPolicy = {
	room_id?: FieldPolicy<any> | FieldReadFunction<any>,
	topic_id?: FieldPolicy<any> | FieldReadFunction<any>,
	unread_messages?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type unread_messages_stddev_fieldsKeySpecifier = ('unread_messages' | unread_messages_stddev_fieldsKeySpecifier)[];
export type unread_messages_stddev_fieldsFieldPolicy = {
	unread_messages?: FieldPolicy<any> | FieldReadFunction<any>
};
export type unread_messages_stddev_pop_fieldsKeySpecifier = ('unread_messages' | unread_messages_stddev_pop_fieldsKeySpecifier)[];
export type unread_messages_stddev_pop_fieldsFieldPolicy = {
	unread_messages?: FieldPolicy<any> | FieldReadFunction<any>
};
export type unread_messages_stddev_samp_fieldsKeySpecifier = ('unread_messages' | unread_messages_stddev_samp_fieldsKeySpecifier)[];
export type unread_messages_stddev_samp_fieldsFieldPolicy = {
	unread_messages?: FieldPolicy<any> | FieldReadFunction<any>
};
export type unread_messages_sum_fieldsKeySpecifier = ('unread_messages' | unread_messages_sum_fieldsKeySpecifier)[];
export type unread_messages_sum_fieldsFieldPolicy = {
	unread_messages?: FieldPolicy<any> | FieldReadFunction<any>
};
export type unread_messages_var_pop_fieldsKeySpecifier = ('unread_messages' | unread_messages_var_pop_fieldsKeySpecifier)[];
export type unread_messages_var_pop_fieldsFieldPolicy = {
	unread_messages?: FieldPolicy<any> | FieldReadFunction<any>
};
export type unread_messages_var_samp_fieldsKeySpecifier = ('unread_messages' | unread_messages_var_samp_fieldsKeySpecifier)[];
export type unread_messages_var_samp_fieldsFieldPolicy = {
	unread_messages?: FieldPolicy<any> | FieldReadFunction<any>
};
export type unread_messages_variance_fieldsKeySpecifier = ('unread_messages' | unread_messages_variance_fieldsKeySpecifier)[];
export type unread_messages_variance_fieldsFieldPolicy = {
	unread_messages?: FieldPolicy<any> | FieldReadFunction<any>
};
export type userKeySpecifier = ('avatar_url' | 'created_at' | 'created_room_invitations' | 'created_room_invitations_aggregate' | 'created_rooms' | 'created_rooms_aggregate' | 'created_team_invitations' | 'created_team_invitations_aggregate' | 'current_team' | 'current_team_id' | 'email' | 'email_verified' | 'id' | 'messages' | 'messages_aggregate' | 'name' | 'notifications' | 'notifications_aggregate' | 'owned_teams' | 'owned_teams_aggregate' | 'rooms' | 'rooms_aggregate' | 'space_memberships' | 'space_memberships_aggregate' | 'team_memberships' | 'team_memberships_aggregate' | 'topic_memberships' | 'topic_memberships_aggregate' | userKeySpecifier)[];
export type userFieldPolicy = {
	avatar_url?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	created_room_invitations?: FieldPolicy<any> | FieldReadFunction<any>,
	created_room_invitations_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	created_rooms?: FieldPolicy<any> | FieldReadFunction<any>,
	created_rooms_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	created_team_invitations?: FieldPolicy<any> | FieldReadFunction<any>,
	created_team_invitations_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	current_team?: FieldPolicy<any> | FieldReadFunction<any>,
	current_team_id?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	email_verified?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	messages?: FieldPolicy<any> | FieldReadFunction<any>,
	messages_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	notifications?: FieldPolicy<any> | FieldReadFunction<any>,
	notifications_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	owned_teams?: FieldPolicy<any> | FieldReadFunction<any>,
	owned_teams_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	rooms?: FieldPolicy<any> | FieldReadFunction<any>,
	rooms_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	space_memberships?: FieldPolicy<any> | FieldReadFunction<any>,
	space_memberships_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	team_memberships?: FieldPolicy<any> | FieldReadFunction<any>,
	team_memberships_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	topic_memberships?: FieldPolicy<any> | FieldReadFunction<any>,
	topic_memberships_aggregate?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_aggregateKeySpecifier = ('aggregate' | 'nodes' | user_aggregateKeySpecifier)[];
export type user_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | user_aggregate_fieldsKeySpecifier)[];
export type user_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_max_fieldsKeySpecifier = ('avatar_url' | 'created_at' | 'current_team_id' | 'email' | 'email_verified' | 'id' | 'name' | user_max_fieldsKeySpecifier)[];
export type user_max_fieldsFieldPolicy = {
	avatar_url?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	current_team_id?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	email_verified?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_min_fieldsKeySpecifier = ('avatar_url' | 'created_at' | 'current_team_id' | 'email' | 'email_verified' | 'id' | 'name' | user_min_fieldsKeySpecifier)[];
export type user_min_fieldsFieldPolicy = {
	avatar_url?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	current_team_id?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	email_verified?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | user_mutation_responseKeySpecifier)[];
export type user_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type whitelistKeySpecifier = ('email' | 'is_approved' | 'timestamp' | whitelistKeySpecifier)[];
export type whitelistFieldPolicy = {
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	is_approved?: FieldPolicy<any> | FieldReadFunction<any>,
	timestamp?: FieldPolicy<any> | FieldReadFunction<any>
};
export type whitelist_aggregateKeySpecifier = ('aggregate' | 'nodes' | whitelist_aggregateKeySpecifier)[];
export type whitelist_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type whitelist_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | whitelist_aggregate_fieldsKeySpecifier)[];
export type whitelist_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type whitelist_max_fieldsKeySpecifier = ('email' | 'timestamp' | whitelist_max_fieldsKeySpecifier)[];
export type whitelist_max_fieldsFieldPolicy = {
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	timestamp?: FieldPolicy<any> | FieldReadFunction<any>
};
export type whitelist_min_fieldsKeySpecifier = ('email' | 'timestamp' | whitelist_min_fieldsKeySpecifier)[];
export type whitelist_min_fieldsFieldPolicy = {
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	timestamp?: FieldPolicy<any> | FieldReadFunction<any>
};
export type whitelist_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | whitelist_mutation_responseKeySpecifier)[];
export type whitelist_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TypedTypePolicies = TypePolicies & {
	GetTeamSlackInstallationURLOutput?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GetTeamSlackInstallationURLOutputKeySpecifier | (() => undefined | GetTeamSlackInstallationURLOutputKeySpecifier),
		fields?: GetTeamSlackInstallationURLOutputFieldPolicy,
	},
	LookupTeamNameResponse?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | LookupTeamNameResponseKeySpecifier | (() => undefined | LookupTeamNameResponseKeySpecifier),
		fields?: LookupTeamNameResponseFieldPolicy,
	},
	ResendInvitationResponse?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ResendInvitationResponseKeySpecifier | (() => undefined | ResendInvitationResponseKeySpecifier),
		fields?: ResendInvitationResponseFieldPolicy,
	},
	RoomInvitationViewResponse?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | RoomInvitationViewResponseKeySpecifier | (() => undefined | RoomInvitationViewResponseKeySpecifier),
		fields?: RoomInvitationViewResponseFieldPolicy,
	},
	UpgradeUserResponse?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UpgradeUserResponseKeySpecifier | (() => undefined | UpgradeUserResponseKeySpecifier),
		fields?: UpgradeUserResponseFieldPolicy,
	},
	UploadUrlResponse?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UploadUrlResponseKeySpecifier | (() => undefined | UploadUrlResponseKeySpecifier),
		fields?: UploadUrlResponseFieldPolicy,
	},
	account?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | accountKeySpecifier | (() => undefined | accountKeySpecifier),
		fields?: accountFieldPolicy,
	},
	account_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | account_aggregateKeySpecifier | (() => undefined | account_aggregateKeySpecifier),
		fields?: account_aggregateFieldPolicy,
	},
	account_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | account_aggregate_fieldsKeySpecifier | (() => undefined | account_aggregate_fieldsKeySpecifier),
		fields?: account_aggregate_fieldsFieldPolicy,
	},
	account_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | account_max_fieldsKeySpecifier | (() => undefined | account_max_fieldsKeySpecifier),
		fields?: account_max_fieldsFieldPolicy,
	},
	account_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | account_min_fieldsKeySpecifier | (() => undefined | account_min_fieldsKeySpecifier),
		fields?: account_min_fieldsFieldPolicy,
	},
	account_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | account_mutation_responseKeySpecifier | (() => undefined | account_mutation_responseKeySpecifier),
		fields?: account_mutation_responseFieldPolicy,
	},
	attachment?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | attachmentKeySpecifier | (() => undefined | attachmentKeySpecifier),
		fields?: attachmentFieldPolicy,
	},
	attachment_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | attachment_aggregateKeySpecifier | (() => undefined | attachment_aggregateKeySpecifier),
		fields?: attachment_aggregateFieldPolicy,
	},
	attachment_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | attachment_aggregate_fieldsKeySpecifier | (() => undefined | attachment_aggregate_fieldsKeySpecifier),
		fields?: attachment_aggregate_fieldsFieldPolicy,
	},
	attachment_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | attachment_max_fieldsKeySpecifier | (() => undefined | attachment_max_fieldsKeySpecifier),
		fields?: attachment_max_fieldsFieldPolicy,
	},
	attachment_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | attachment_min_fieldsKeySpecifier | (() => undefined | attachment_min_fieldsKeySpecifier),
		fields?: attachment_min_fieldsFieldPolicy,
	},
	attachment_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | attachment_mutation_responseKeySpecifier | (() => undefined | attachment_mutation_responseKeySpecifier),
		fields?: attachment_mutation_responseFieldPolicy,
	},
	last_seen_message?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | last_seen_messageKeySpecifier | (() => undefined | last_seen_messageKeySpecifier),
		fields?: last_seen_messageFieldPolicy,
	},
	last_seen_message_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | last_seen_message_aggregateKeySpecifier | (() => undefined | last_seen_message_aggregateKeySpecifier),
		fields?: last_seen_message_aggregateFieldPolicy,
	},
	last_seen_message_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | last_seen_message_aggregate_fieldsKeySpecifier | (() => undefined | last_seen_message_aggregate_fieldsKeySpecifier),
		fields?: last_seen_message_aggregate_fieldsFieldPolicy,
	},
	last_seen_message_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | last_seen_message_max_fieldsKeySpecifier | (() => undefined | last_seen_message_max_fieldsKeySpecifier),
		fields?: last_seen_message_max_fieldsFieldPolicy,
	},
	last_seen_message_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | last_seen_message_min_fieldsKeySpecifier | (() => undefined | last_seen_message_min_fieldsKeySpecifier),
		fields?: last_seen_message_min_fieldsFieldPolicy,
	},
	last_seen_message_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | last_seen_message_mutation_responseKeySpecifier | (() => undefined | last_seen_message_mutation_responseKeySpecifier),
		fields?: last_seen_message_mutation_responseFieldPolicy,
	},
	membership_status?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | membership_statusKeySpecifier | (() => undefined | membership_statusKeySpecifier),
		fields?: membership_statusFieldPolicy,
	},
	membership_status_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | membership_status_aggregateKeySpecifier | (() => undefined | membership_status_aggregateKeySpecifier),
		fields?: membership_status_aggregateFieldPolicy,
	},
	membership_status_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | membership_status_aggregate_fieldsKeySpecifier | (() => undefined | membership_status_aggregate_fieldsKeySpecifier),
		fields?: membership_status_aggregate_fieldsFieldPolicy,
	},
	membership_status_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | membership_status_max_fieldsKeySpecifier | (() => undefined | membership_status_max_fieldsKeySpecifier),
		fields?: membership_status_max_fieldsFieldPolicy,
	},
	membership_status_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | membership_status_min_fieldsKeySpecifier | (() => undefined | membership_status_min_fieldsKeySpecifier),
		fields?: membership_status_min_fieldsFieldPolicy,
	},
	membership_status_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | membership_status_mutation_responseKeySpecifier | (() => undefined | membership_status_mutation_responseKeySpecifier),
		fields?: membership_status_mutation_responseFieldPolicy,
	},
	message?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | messageKeySpecifier | (() => undefined | messageKeySpecifier),
		fields?: messageFieldPolicy,
	},
	message_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | message_aggregateKeySpecifier | (() => undefined | message_aggregateKeySpecifier),
		fields?: message_aggregateFieldPolicy,
	},
	message_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | message_aggregate_fieldsKeySpecifier | (() => undefined | message_aggregate_fieldsKeySpecifier),
		fields?: message_aggregate_fieldsFieldPolicy,
	},
	message_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | message_max_fieldsKeySpecifier | (() => undefined | message_max_fieldsKeySpecifier),
		fields?: message_max_fieldsFieldPolicy,
	},
	message_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | message_min_fieldsKeySpecifier | (() => undefined | message_min_fieldsKeySpecifier),
		fields?: message_min_fieldsFieldPolicy,
	},
	message_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | message_mutation_responseKeySpecifier | (() => undefined | message_mutation_responseKeySpecifier),
		fields?: message_mutation_responseFieldPolicy,
	},
	message_reaction?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | message_reactionKeySpecifier | (() => undefined | message_reactionKeySpecifier),
		fields?: message_reactionFieldPolicy,
	},
	message_reaction_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | message_reaction_aggregateKeySpecifier | (() => undefined | message_reaction_aggregateKeySpecifier),
		fields?: message_reaction_aggregateFieldPolicy,
	},
	message_reaction_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | message_reaction_aggregate_fieldsKeySpecifier | (() => undefined | message_reaction_aggregate_fieldsKeySpecifier),
		fields?: message_reaction_aggregate_fieldsFieldPolicy,
	},
	message_reaction_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | message_reaction_max_fieldsKeySpecifier | (() => undefined | message_reaction_max_fieldsKeySpecifier),
		fields?: message_reaction_max_fieldsFieldPolicy,
	},
	message_reaction_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | message_reaction_min_fieldsKeySpecifier | (() => undefined | message_reaction_min_fieldsKeySpecifier),
		fields?: message_reaction_min_fieldsFieldPolicy,
	},
	message_reaction_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | message_reaction_mutation_responseKeySpecifier | (() => undefined | message_reaction_mutation_responseKeySpecifier),
		fields?: message_reaction_mutation_responseFieldPolicy,
	},
	message_type?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | message_typeKeySpecifier | (() => undefined | message_typeKeySpecifier),
		fields?: message_typeFieldPolicy,
	},
	message_type_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | message_type_aggregateKeySpecifier | (() => undefined | message_type_aggregateKeySpecifier),
		fields?: message_type_aggregateFieldPolicy,
	},
	message_type_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | message_type_aggregate_fieldsKeySpecifier | (() => undefined | message_type_aggregate_fieldsKeySpecifier),
		fields?: message_type_aggregate_fieldsFieldPolicy,
	},
	message_type_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | message_type_max_fieldsKeySpecifier | (() => undefined | message_type_max_fieldsKeySpecifier),
		fields?: message_type_max_fieldsFieldPolicy,
	},
	message_type_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | message_type_min_fieldsKeySpecifier | (() => undefined | message_type_min_fieldsKeySpecifier),
		fields?: message_type_min_fieldsFieldPolicy,
	},
	message_type_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | message_type_mutation_responseKeySpecifier | (() => undefined | message_type_mutation_responseKeySpecifier),
		fields?: message_type_mutation_responseFieldPolicy,
	},
	mutation_root?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | mutation_rootKeySpecifier | (() => undefined | mutation_rootKeySpecifier),
		fields?: mutation_rootFieldPolicy,
	},
	notification?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | notificationKeySpecifier | (() => undefined | notificationKeySpecifier),
		fields?: notificationFieldPolicy,
	},
	notification_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | notification_aggregateKeySpecifier | (() => undefined | notification_aggregateKeySpecifier),
		fields?: notification_aggregateFieldPolicy,
	},
	notification_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | notification_aggregate_fieldsKeySpecifier | (() => undefined | notification_aggregate_fieldsKeySpecifier),
		fields?: notification_aggregate_fieldsFieldPolicy,
	},
	notification_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | notification_max_fieldsKeySpecifier | (() => undefined | notification_max_fieldsKeySpecifier),
		fields?: notification_max_fieldsFieldPolicy,
	},
	notification_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | notification_min_fieldsKeySpecifier | (() => undefined | notification_min_fieldsKeySpecifier),
		fields?: notification_min_fieldsFieldPolicy,
	},
	notification_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | notification_mutation_responseKeySpecifier | (() => undefined | notification_mutation_responseKeySpecifier),
		fields?: notification_mutation_responseFieldPolicy,
	},
	query_root?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | query_rootKeySpecifier | (() => undefined | query_rootKeySpecifier),
		fields?: query_rootFieldPolicy,
	},
	room?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | roomKeySpecifier | (() => undefined | roomKeySpecifier),
		fields?: roomFieldPolicy,
	},
	room_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | room_aggregateKeySpecifier | (() => undefined | room_aggregateKeySpecifier),
		fields?: room_aggregateFieldPolicy,
	},
	room_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | room_aggregate_fieldsKeySpecifier | (() => undefined | room_aggregate_fieldsKeySpecifier),
		fields?: room_aggregate_fieldsFieldPolicy,
	},
	room_avg_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | room_avg_fieldsKeySpecifier | (() => undefined | room_avg_fieldsKeySpecifier),
		fields?: room_avg_fieldsFieldPolicy,
	},
	room_invitation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | room_invitationKeySpecifier | (() => undefined | room_invitationKeySpecifier),
		fields?: room_invitationFieldPolicy,
	},
	room_invitation_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | room_invitation_aggregateKeySpecifier | (() => undefined | room_invitation_aggregateKeySpecifier),
		fields?: room_invitation_aggregateFieldPolicy,
	},
	room_invitation_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | room_invitation_aggregate_fieldsKeySpecifier | (() => undefined | room_invitation_aggregate_fieldsKeySpecifier),
		fields?: room_invitation_aggregate_fieldsFieldPolicy,
	},
	room_invitation_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | room_invitation_max_fieldsKeySpecifier | (() => undefined | room_invitation_max_fieldsKeySpecifier),
		fields?: room_invitation_max_fieldsFieldPolicy,
	},
	room_invitation_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | room_invitation_min_fieldsKeySpecifier | (() => undefined | room_invitation_min_fieldsKeySpecifier),
		fields?: room_invitation_min_fieldsFieldPolicy,
	},
	room_invitation_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | room_invitation_mutation_responseKeySpecifier | (() => undefined | room_invitation_mutation_responseKeySpecifier),
		fields?: room_invitation_mutation_responseFieldPolicy,
	},
	room_last_posted_message?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | room_last_posted_messageKeySpecifier | (() => undefined | room_last_posted_messageKeySpecifier),
		fields?: room_last_posted_messageFieldPolicy,
	},
	room_last_posted_message_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | room_last_posted_message_aggregateKeySpecifier | (() => undefined | room_last_posted_message_aggregateKeySpecifier),
		fields?: room_last_posted_message_aggregateFieldPolicy,
	},
	room_last_posted_message_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | room_last_posted_message_aggregate_fieldsKeySpecifier | (() => undefined | room_last_posted_message_aggregate_fieldsKeySpecifier),
		fields?: room_last_posted_message_aggregate_fieldsFieldPolicy,
	},
	room_last_posted_message_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | room_last_posted_message_max_fieldsKeySpecifier | (() => undefined | room_last_posted_message_max_fieldsKeySpecifier),
		fields?: room_last_posted_message_max_fieldsFieldPolicy,
	},
	room_last_posted_message_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | room_last_posted_message_min_fieldsKeySpecifier | (() => undefined | room_last_posted_message_min_fieldsKeySpecifier),
		fields?: room_last_posted_message_min_fieldsFieldPolicy,
	},
	room_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | room_max_fieldsKeySpecifier | (() => undefined | room_max_fieldsKeySpecifier),
		fields?: room_max_fieldsFieldPolicy,
	},
	room_member?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | room_memberKeySpecifier | (() => undefined | room_memberKeySpecifier),
		fields?: room_memberFieldPolicy,
	},
	room_member_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | room_member_aggregateKeySpecifier | (() => undefined | room_member_aggregateKeySpecifier),
		fields?: room_member_aggregateFieldPolicy,
	},
	room_member_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | room_member_aggregate_fieldsKeySpecifier | (() => undefined | room_member_aggregate_fieldsKeySpecifier),
		fields?: room_member_aggregate_fieldsFieldPolicy,
	},
	room_member_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | room_member_max_fieldsKeySpecifier | (() => undefined | room_member_max_fieldsKeySpecifier),
		fields?: room_member_max_fieldsFieldPolicy,
	},
	room_member_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | room_member_min_fieldsKeySpecifier | (() => undefined | room_member_min_fieldsKeySpecifier),
		fields?: room_member_min_fieldsFieldPolicy,
	},
	room_member_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | room_member_mutation_responseKeySpecifier | (() => undefined | room_member_mutation_responseKeySpecifier),
		fields?: room_member_mutation_responseFieldPolicy,
	},
	room_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | room_min_fieldsKeySpecifier | (() => undefined | room_min_fieldsKeySpecifier),
		fields?: room_min_fieldsFieldPolicy,
	},
	room_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | room_mutation_responseKeySpecifier | (() => undefined | room_mutation_responseKeySpecifier),
		fields?: room_mutation_responseFieldPolicy,
	},
	room_stddev_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | room_stddev_fieldsKeySpecifier | (() => undefined | room_stddev_fieldsKeySpecifier),
		fields?: room_stddev_fieldsFieldPolicy,
	},
	room_stddev_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | room_stddev_pop_fieldsKeySpecifier | (() => undefined | room_stddev_pop_fieldsKeySpecifier),
		fields?: room_stddev_pop_fieldsFieldPolicy,
	},
	room_stddev_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | room_stddev_samp_fieldsKeySpecifier | (() => undefined | room_stddev_samp_fieldsKeySpecifier),
		fields?: room_stddev_samp_fieldsFieldPolicy,
	},
	room_sum_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | room_sum_fieldsKeySpecifier | (() => undefined | room_sum_fieldsKeySpecifier),
		fields?: room_sum_fieldsFieldPolicy,
	},
	room_var_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | room_var_pop_fieldsKeySpecifier | (() => undefined | room_var_pop_fieldsKeySpecifier),
		fields?: room_var_pop_fieldsFieldPolicy,
	},
	room_var_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | room_var_samp_fieldsKeySpecifier | (() => undefined | room_var_samp_fieldsKeySpecifier),
		fields?: room_var_samp_fieldsFieldPolicy,
	},
	room_variance_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | room_variance_fieldsKeySpecifier | (() => undefined | room_variance_fieldsKeySpecifier),
		fields?: room_variance_fieldsFieldPolicy,
	},
	space?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | spaceKeySpecifier | (() => undefined | spaceKeySpecifier),
		fields?: spaceFieldPolicy,
	},
	space_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | space_aggregateKeySpecifier | (() => undefined | space_aggregateKeySpecifier),
		fields?: space_aggregateFieldPolicy,
	},
	space_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | space_aggregate_fieldsKeySpecifier | (() => undefined | space_aggregate_fieldsKeySpecifier),
		fields?: space_aggregate_fieldsFieldPolicy,
	},
	space_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | space_max_fieldsKeySpecifier | (() => undefined | space_max_fieldsKeySpecifier),
		fields?: space_max_fieldsFieldPolicy,
	},
	space_member?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | space_memberKeySpecifier | (() => undefined | space_memberKeySpecifier),
		fields?: space_memberFieldPolicy,
	},
	space_member_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | space_member_aggregateKeySpecifier | (() => undefined | space_member_aggregateKeySpecifier),
		fields?: space_member_aggregateFieldPolicy,
	},
	space_member_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | space_member_aggregate_fieldsKeySpecifier | (() => undefined | space_member_aggregate_fieldsKeySpecifier),
		fields?: space_member_aggregate_fieldsFieldPolicy,
	},
	space_member_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | space_member_max_fieldsKeySpecifier | (() => undefined | space_member_max_fieldsKeySpecifier),
		fields?: space_member_max_fieldsFieldPolicy,
	},
	space_member_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | space_member_min_fieldsKeySpecifier | (() => undefined | space_member_min_fieldsKeySpecifier),
		fields?: space_member_min_fieldsFieldPolicy,
	},
	space_member_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | space_member_mutation_responseKeySpecifier | (() => undefined | space_member_mutation_responseKeySpecifier),
		fields?: space_member_mutation_responseFieldPolicy,
	},
	space_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | space_min_fieldsKeySpecifier | (() => undefined | space_min_fieldsKeySpecifier),
		fields?: space_min_fieldsFieldPolicy,
	},
	space_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | space_mutation_responseKeySpecifier | (() => undefined | space_mutation_responseKeySpecifier),
		fields?: space_mutation_responseFieldPolicy,
	},
	subscription_root?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | subscription_rootKeySpecifier | (() => undefined | subscription_rootKeySpecifier),
		fields?: subscription_rootFieldPolicy,
	},
	task?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | taskKeySpecifier | (() => undefined | taskKeySpecifier),
		fields?: taskFieldPolicy,
	},
	task_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | task_aggregateKeySpecifier | (() => undefined | task_aggregateKeySpecifier),
		fields?: task_aggregateFieldPolicy,
	},
	task_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | task_aggregate_fieldsKeySpecifier | (() => undefined | task_aggregate_fieldsKeySpecifier),
		fields?: task_aggregate_fieldsFieldPolicy,
	},
	task_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | task_max_fieldsKeySpecifier | (() => undefined | task_max_fieldsKeySpecifier),
		fields?: task_max_fieldsFieldPolicy,
	},
	task_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | task_min_fieldsKeySpecifier | (() => undefined | task_min_fieldsKeySpecifier),
		fields?: task_min_fieldsFieldPolicy,
	},
	task_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | task_mutation_responseKeySpecifier | (() => undefined | task_mutation_responseKeySpecifier),
		fields?: task_mutation_responseFieldPolicy,
	},
	team?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | teamKeySpecifier | (() => undefined | teamKeySpecifier),
		fields?: teamFieldPolicy,
	},
	team_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | team_aggregateKeySpecifier | (() => undefined | team_aggregateKeySpecifier),
		fields?: team_aggregateFieldPolicy,
	},
	team_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | team_aggregate_fieldsKeySpecifier | (() => undefined | team_aggregate_fieldsKeySpecifier),
		fields?: team_aggregate_fieldsFieldPolicy,
	},
	team_invitation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | team_invitationKeySpecifier | (() => undefined | team_invitationKeySpecifier),
		fields?: team_invitationFieldPolicy,
	},
	team_invitation_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | team_invitation_aggregateKeySpecifier | (() => undefined | team_invitation_aggregateKeySpecifier),
		fields?: team_invitation_aggregateFieldPolicy,
	},
	team_invitation_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | team_invitation_aggregate_fieldsKeySpecifier | (() => undefined | team_invitation_aggregate_fieldsKeySpecifier),
		fields?: team_invitation_aggregate_fieldsFieldPolicy,
	},
	team_invitation_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | team_invitation_max_fieldsKeySpecifier | (() => undefined | team_invitation_max_fieldsKeySpecifier),
		fields?: team_invitation_max_fieldsFieldPolicy,
	},
	team_invitation_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | team_invitation_min_fieldsKeySpecifier | (() => undefined | team_invitation_min_fieldsKeySpecifier),
		fields?: team_invitation_min_fieldsFieldPolicy,
	},
	team_invitation_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | team_invitation_mutation_responseKeySpecifier | (() => undefined | team_invitation_mutation_responseKeySpecifier),
		fields?: team_invitation_mutation_responseFieldPolicy,
	},
	team_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | team_max_fieldsKeySpecifier | (() => undefined | team_max_fieldsKeySpecifier),
		fields?: team_max_fieldsFieldPolicy,
	},
	team_member?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | team_memberKeySpecifier | (() => undefined | team_memberKeySpecifier),
		fields?: team_memberFieldPolicy,
	},
	team_member_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | team_member_aggregateKeySpecifier | (() => undefined | team_member_aggregateKeySpecifier),
		fields?: team_member_aggregateFieldPolicy,
	},
	team_member_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | team_member_aggregate_fieldsKeySpecifier | (() => undefined | team_member_aggregate_fieldsKeySpecifier),
		fields?: team_member_aggregate_fieldsFieldPolicy,
	},
	team_member_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | team_member_max_fieldsKeySpecifier | (() => undefined | team_member_max_fieldsKeySpecifier),
		fields?: team_member_max_fieldsFieldPolicy,
	},
	team_member_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | team_member_min_fieldsKeySpecifier | (() => undefined | team_member_min_fieldsKeySpecifier),
		fields?: team_member_min_fieldsFieldPolicy,
	},
	team_member_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | team_member_mutation_responseKeySpecifier | (() => undefined | team_member_mutation_responseKeySpecifier),
		fields?: team_member_mutation_responseFieldPolicy,
	},
	team_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | team_min_fieldsKeySpecifier | (() => undefined | team_min_fieldsKeySpecifier),
		fields?: team_min_fieldsFieldPolicy,
	},
	team_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | team_mutation_responseKeySpecifier | (() => undefined | team_mutation_responseKeySpecifier),
		fields?: team_mutation_responseFieldPolicy,
	},
	team_slack_installation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | team_slack_installationKeySpecifier | (() => undefined | team_slack_installationKeySpecifier),
		fields?: team_slack_installationFieldPolicy,
	},
	team_slack_installation_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | team_slack_installation_aggregateKeySpecifier | (() => undefined | team_slack_installation_aggregateKeySpecifier),
		fields?: team_slack_installation_aggregateFieldPolicy,
	},
	team_slack_installation_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | team_slack_installation_aggregate_fieldsKeySpecifier | (() => undefined | team_slack_installation_aggregate_fieldsKeySpecifier),
		fields?: team_slack_installation_aggregate_fieldsFieldPolicy,
	},
	team_slack_installation_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | team_slack_installation_max_fieldsKeySpecifier | (() => undefined | team_slack_installation_max_fieldsKeySpecifier),
		fields?: team_slack_installation_max_fieldsFieldPolicy,
	},
	team_slack_installation_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | team_slack_installation_min_fieldsKeySpecifier | (() => undefined | team_slack_installation_min_fieldsKeySpecifier),
		fields?: team_slack_installation_min_fieldsFieldPolicy,
	},
	team_slack_installation_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | team_slack_installation_mutation_responseKeySpecifier | (() => undefined | team_slack_installation_mutation_responseKeySpecifier),
		fields?: team_slack_installation_mutation_responseFieldPolicy,
	},
	topic?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | topicKeySpecifier | (() => undefined | topicKeySpecifier),
		fields?: topicFieldPolicy,
	},
	topic_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | topic_aggregateKeySpecifier | (() => undefined | topic_aggregateKeySpecifier),
		fields?: topic_aggregateFieldPolicy,
	},
	topic_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | topic_aggregate_fieldsKeySpecifier | (() => undefined | topic_aggregate_fieldsKeySpecifier),
		fields?: topic_aggregate_fieldsFieldPolicy,
	},
	topic_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | topic_max_fieldsKeySpecifier | (() => undefined | topic_max_fieldsKeySpecifier),
		fields?: topic_max_fieldsFieldPolicy,
	},
	topic_member?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | topic_memberKeySpecifier | (() => undefined | topic_memberKeySpecifier),
		fields?: topic_memberFieldPolicy,
	},
	topic_member_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | topic_member_aggregateKeySpecifier | (() => undefined | topic_member_aggregateKeySpecifier),
		fields?: topic_member_aggregateFieldPolicy,
	},
	topic_member_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | topic_member_aggregate_fieldsKeySpecifier | (() => undefined | topic_member_aggregate_fieldsKeySpecifier),
		fields?: topic_member_aggregate_fieldsFieldPolicy,
	},
	topic_member_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | topic_member_max_fieldsKeySpecifier | (() => undefined | topic_member_max_fieldsKeySpecifier),
		fields?: topic_member_max_fieldsFieldPolicy,
	},
	topic_member_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | topic_member_min_fieldsKeySpecifier | (() => undefined | topic_member_min_fieldsKeySpecifier),
		fields?: topic_member_min_fieldsFieldPolicy,
	},
	topic_member_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | topic_member_mutation_responseKeySpecifier | (() => undefined | topic_member_mutation_responseKeySpecifier),
		fields?: topic_member_mutation_responseFieldPolicy,
	},
	topic_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | topic_min_fieldsKeySpecifier | (() => undefined | topic_min_fieldsKeySpecifier),
		fields?: topic_min_fieldsFieldPolicy,
	},
	topic_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | topic_mutation_responseKeySpecifier | (() => undefined | topic_mutation_responseKeySpecifier),
		fields?: topic_mutation_responseFieldPolicy,
	},
	transcription?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | transcriptionKeySpecifier | (() => undefined | transcriptionKeySpecifier),
		fields?: transcriptionFieldPolicy,
	},
	transcription_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | transcription_aggregateKeySpecifier | (() => undefined | transcription_aggregateKeySpecifier),
		fields?: transcription_aggregateFieldPolicy,
	},
	transcription_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | transcription_aggregate_fieldsKeySpecifier | (() => undefined | transcription_aggregate_fieldsKeySpecifier),
		fields?: transcription_aggregate_fieldsFieldPolicy,
	},
	transcription_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | transcription_max_fieldsKeySpecifier | (() => undefined | transcription_max_fieldsKeySpecifier),
		fields?: transcription_max_fieldsFieldPolicy,
	},
	transcription_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | transcription_min_fieldsKeySpecifier | (() => undefined | transcription_min_fieldsKeySpecifier),
		fields?: transcription_min_fieldsFieldPolicy,
	},
	transcription_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | transcription_mutation_responseKeySpecifier | (() => undefined | transcription_mutation_responseKeySpecifier),
		fields?: transcription_mutation_responseFieldPolicy,
	},
	transcription_status?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | transcription_statusKeySpecifier | (() => undefined | transcription_statusKeySpecifier),
		fields?: transcription_statusFieldPolicy,
	},
	transcription_status_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | transcription_status_aggregateKeySpecifier | (() => undefined | transcription_status_aggregateKeySpecifier),
		fields?: transcription_status_aggregateFieldPolicy,
	},
	transcription_status_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | transcription_status_aggregate_fieldsKeySpecifier | (() => undefined | transcription_status_aggregate_fieldsKeySpecifier),
		fields?: transcription_status_aggregate_fieldsFieldPolicy,
	},
	transcription_status_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | transcription_status_max_fieldsKeySpecifier | (() => undefined | transcription_status_max_fieldsKeySpecifier),
		fields?: transcription_status_max_fieldsFieldPolicy,
	},
	transcription_status_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | transcription_status_min_fieldsKeySpecifier | (() => undefined | transcription_status_min_fieldsKeySpecifier),
		fields?: transcription_status_min_fieldsFieldPolicy,
	},
	transcription_status_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | transcription_status_mutation_responseKeySpecifier | (() => undefined | transcription_status_mutation_responseKeySpecifier),
		fields?: transcription_status_mutation_responseFieldPolicy,
	},
	unread_messages?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | unread_messagesKeySpecifier | (() => undefined | unread_messagesKeySpecifier),
		fields?: unread_messagesFieldPolicy,
	},
	unread_messages_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | unread_messages_aggregateKeySpecifier | (() => undefined | unread_messages_aggregateKeySpecifier),
		fields?: unread_messages_aggregateFieldPolicy,
	},
	unread_messages_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | unread_messages_aggregate_fieldsKeySpecifier | (() => undefined | unread_messages_aggregate_fieldsKeySpecifier),
		fields?: unread_messages_aggregate_fieldsFieldPolicy,
	},
	unread_messages_avg_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | unread_messages_avg_fieldsKeySpecifier | (() => undefined | unread_messages_avg_fieldsKeySpecifier),
		fields?: unread_messages_avg_fieldsFieldPolicy,
	},
	unread_messages_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | unread_messages_max_fieldsKeySpecifier | (() => undefined | unread_messages_max_fieldsKeySpecifier),
		fields?: unread_messages_max_fieldsFieldPolicy,
	},
	unread_messages_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | unread_messages_min_fieldsKeySpecifier | (() => undefined | unread_messages_min_fieldsKeySpecifier),
		fields?: unread_messages_min_fieldsFieldPolicy,
	},
	unread_messages_stddev_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | unread_messages_stddev_fieldsKeySpecifier | (() => undefined | unread_messages_stddev_fieldsKeySpecifier),
		fields?: unread_messages_stddev_fieldsFieldPolicy,
	},
	unread_messages_stddev_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | unread_messages_stddev_pop_fieldsKeySpecifier | (() => undefined | unread_messages_stddev_pop_fieldsKeySpecifier),
		fields?: unread_messages_stddev_pop_fieldsFieldPolicy,
	},
	unread_messages_stddev_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | unread_messages_stddev_samp_fieldsKeySpecifier | (() => undefined | unread_messages_stddev_samp_fieldsKeySpecifier),
		fields?: unread_messages_stddev_samp_fieldsFieldPolicy,
	},
	unread_messages_sum_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | unread_messages_sum_fieldsKeySpecifier | (() => undefined | unread_messages_sum_fieldsKeySpecifier),
		fields?: unread_messages_sum_fieldsFieldPolicy,
	},
	unread_messages_var_pop_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | unread_messages_var_pop_fieldsKeySpecifier | (() => undefined | unread_messages_var_pop_fieldsKeySpecifier),
		fields?: unread_messages_var_pop_fieldsFieldPolicy,
	},
	unread_messages_var_samp_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | unread_messages_var_samp_fieldsKeySpecifier | (() => undefined | unread_messages_var_samp_fieldsKeySpecifier),
		fields?: unread_messages_var_samp_fieldsFieldPolicy,
	},
	unread_messages_variance_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | unread_messages_variance_fieldsKeySpecifier | (() => undefined | unread_messages_variance_fieldsKeySpecifier),
		fields?: unread_messages_variance_fieldsFieldPolicy,
	},
	user?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | userKeySpecifier | (() => undefined | userKeySpecifier),
		fields?: userFieldPolicy,
	},
	user_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_aggregateKeySpecifier | (() => undefined | user_aggregateKeySpecifier),
		fields?: user_aggregateFieldPolicy,
	},
	user_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_aggregate_fieldsKeySpecifier | (() => undefined | user_aggregate_fieldsKeySpecifier),
		fields?: user_aggregate_fieldsFieldPolicy,
	},
	user_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_max_fieldsKeySpecifier | (() => undefined | user_max_fieldsKeySpecifier),
		fields?: user_max_fieldsFieldPolicy,
	},
	user_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_min_fieldsKeySpecifier | (() => undefined | user_min_fieldsKeySpecifier),
		fields?: user_min_fieldsFieldPolicy,
	},
	user_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | user_mutation_responseKeySpecifier | (() => undefined | user_mutation_responseKeySpecifier),
		fields?: user_mutation_responseFieldPolicy,
	},
	whitelist?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | whitelistKeySpecifier | (() => undefined | whitelistKeySpecifier),
		fields?: whitelistFieldPolicy,
	},
	whitelist_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | whitelist_aggregateKeySpecifier | (() => undefined | whitelist_aggregateKeySpecifier),
		fields?: whitelist_aggregateFieldPolicy,
	},
	whitelist_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | whitelist_aggregate_fieldsKeySpecifier | (() => undefined | whitelist_aggregate_fieldsKeySpecifier),
		fields?: whitelist_aggregate_fieldsFieldPolicy,
	},
	whitelist_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | whitelist_max_fieldsKeySpecifier | (() => undefined | whitelist_max_fieldsKeySpecifier),
		fields?: whitelist_max_fieldsFieldPolicy,
	},
	whitelist_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | whitelist_min_fieldsKeySpecifier | (() => undefined | whitelist_min_fieldsKeySpecifier),
		fields?: whitelist_min_fieldsFieldPolicy,
	},
	whitelist_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | whitelist_mutation_responseKeySpecifier | (() => undefined | whitelist_mutation_responseKeySpecifier),
		fields?: whitelist_mutation_responseFieldPolicy,
	}
};

      export type PossibleTypesResultData = {
  "possibleTypes": {}
};
      const result: PossibleTypesResultData = {
  "possibleTypes": {}
};
      export default result;
    