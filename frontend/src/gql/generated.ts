import { FieldPolicy, FieldReadFunction, TypePolicies, TypePolicy } from '@apollo/client/cache';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  bigint: any;
  date: any;
  json: any;
  jsonb: any;
  timestamp: any;
  timestamptz: any;
  uuid: any;
};

/** expression to compare columns of type Boolean. All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: Maybe<Scalars['Boolean']>;
  _gt?: Maybe<Scalars['Boolean']>;
  _gte?: Maybe<Scalars['Boolean']>;
  _in?: Maybe<Array<Scalars['Boolean']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['Boolean']>;
  _lte?: Maybe<Scalars['Boolean']>;
  _neq?: Maybe<Scalars['Boolean']>;
  _nin?: Maybe<Array<Scalars['Boolean']>>;
};

export type GetDownloadUrlResponse = {
  __typename?: 'GetDownloadUrlResponse';
  downloadUrl: Scalars['String'];
};

export type GetUploadUrlResponse = {
  __typename?: 'GetUploadUrlResponse';
  uploadUrl: Scalars['String'];
  uuid: Scalars['ID'];
};

export type InviteAcceptCommand = {
  code: Scalars['String'];
};

export type InviteAcceptResponse = {
  __typename?: 'InviteAcceptResponse';
  invite?: Maybe<Room_Invites>;
  invite_id: Scalars['ID'];
  team?: Maybe<Team>;
  team_id: Scalars['ID'];
};

/** expression to compare columns of type String. All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: Maybe<Scalars['String']>;
  _gt?: Maybe<Scalars['String']>;
  _gte?: Maybe<Scalars['String']>;
  _ilike?: Maybe<Scalars['String']>;
  _in?: Maybe<Array<Scalars['String']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _like?: Maybe<Scalars['String']>;
  _lt?: Maybe<Scalars['String']>;
  _lte?: Maybe<Scalars['String']>;
  _neq?: Maybe<Scalars['String']>;
  _nilike?: Maybe<Scalars['String']>;
  _nin?: Maybe<Array<Scalars['String']>>;
  _nlike?: Maybe<Scalars['String']>;
  _nsimilar?: Maybe<Scalars['String']>;
  _similar?: Maybe<Scalars['String']>;
};

export type UpgradeUserResponse = {
  __typename?: 'UpgradeUserResponse';
  user?: Maybe<User>;
  user_id: Scalars['ID'];
};

/**
 * Account represents 3rd party login methods used by given user.
 *
 *
 * columns and relationships of "account"
 */
export type Account = {
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
};

/** aggregated selection of "account" */
export type Account_Aggregate = {
  __typename?: 'account_aggregate';
  aggregate?: Maybe<Account_Aggregate_Fields>;
  nodes: Array<Account>;
};

/** aggregate fields of "account" */
export type Account_Aggregate_Fields = {
  __typename?: 'account_aggregate_fields';
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Account_Max_Fields>;
  min?: Maybe<Account_Min_Fields>;
};


/** aggregate fields of "account" */
export type Account_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Account_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "account" */
export type Account_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<Account_Max_Order_By>;
  min?: Maybe<Account_Min_Order_By>;
};

/** input type for inserting array relation for remote table "account" */
export type Account_Arr_Rel_Insert_Input = {
  data: Array<Account_Insert_Input>;
  on_conflict?: Maybe<Account_On_Conflict>;
};

/** Boolean expression to filter rows from the table "account". All fields are combined with a logical 'AND'. */
export type Account_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Account_Bool_Exp>>>;
  _not?: Maybe<Account_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Account_Bool_Exp>>>;
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
};

/** unique or primary key constraints on table "account" */
export enum Account_Constraint {
  /** unique or primary key constraint */
  AccountPkey = 'account_pkey'
}

/** input type for inserting data into table "account" */
export type Account_Insert_Input = {
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
};

/** aggregate max on columns */
export type Account_Max_Fields = {
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
};

/** order by max() on columns of table "account" */
export type Account_Max_Order_By = {
  access_token?: Maybe<Order_By>;
  access_token_expires?: Maybe<Order_By>;
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  provider_account_id?: Maybe<Order_By>;
  provider_id?: Maybe<Order_By>;
  provider_type?: Maybe<Order_By>;
  refresh_token?: Maybe<Order_By>;
  updated_at?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Account_Min_Fields = {
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
};

/** order by min() on columns of table "account" */
export type Account_Min_Order_By = {
  access_token?: Maybe<Order_By>;
  access_token_expires?: Maybe<Order_By>;
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  provider_account_id?: Maybe<Order_By>;
  provider_id?: Maybe<Order_By>;
  provider_type?: Maybe<Order_By>;
  refresh_token?: Maybe<Order_By>;
  updated_at?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** response of any mutation on the table "account" */
export type Account_Mutation_Response = {
  __typename?: 'account_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Account>;
};

/** input type for inserting object relation for remote table "account" */
export type Account_Obj_Rel_Insert_Input = {
  data: Account_Insert_Input;
  on_conflict?: Maybe<Account_On_Conflict>;
};

/** on conflict condition type for table "account" */
export type Account_On_Conflict = {
  constraint: Account_Constraint;
  update_columns: Array<Account_Update_Column>;
  where?: Maybe<Account_Bool_Exp>;
};

/** ordering options when selecting data from "account" */
export type Account_Order_By = {
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
};

/** primary key columns input for table: "account" */
export type Account_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "account" */
export enum Account_Select_Column {
  /** column name */
  AccessToken = 'access_token',
  /** column name */
  AccessTokenExpires = 'access_token_expires',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  ProviderAccountId = 'provider_account_id',
  /** column name */
  ProviderId = 'provider_id',
  /** column name */
  ProviderType = 'provider_type',
  /** column name */
  RefreshToken = 'refresh_token',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserId = 'user_id'
}

/** input type for updating data in table "account" */
export type Account_Set_Input = {
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
};

/** update columns of table "account" */
export enum Account_Update_Column {
  /** column name */
  AccessToken = 'access_token',
  /** column name */
  AccessTokenExpires = 'access_token_expires',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  ProviderAccountId = 'provider_account_id',
  /** column name */
  ProviderId = 'provider_id',
  /** column name */
  ProviderType = 'provider_type',
  /** column name */
  RefreshToken = 'refresh_token',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserId = 'user_id'
}

/** columns and relationships of "attachment" */
export type Attachment = {
  __typename?: 'attachment';
  created_at: Scalars['timestamptz'];
  id: Scalars['uuid'];
  mime_type: Scalars['String'];
  original_name: Scalars['String'];
};

/** aggregated selection of "attachment" */
export type Attachment_Aggregate = {
  __typename?: 'attachment_aggregate';
  aggregate?: Maybe<Attachment_Aggregate_Fields>;
  nodes: Array<Attachment>;
};

/** aggregate fields of "attachment" */
export type Attachment_Aggregate_Fields = {
  __typename?: 'attachment_aggregate_fields';
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Attachment_Max_Fields>;
  min?: Maybe<Attachment_Min_Fields>;
};


/** aggregate fields of "attachment" */
export type Attachment_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Attachment_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "attachment" */
export type Attachment_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<Attachment_Max_Order_By>;
  min?: Maybe<Attachment_Min_Order_By>;
};

/** input type for inserting array relation for remote table "attachment" */
export type Attachment_Arr_Rel_Insert_Input = {
  data: Array<Attachment_Insert_Input>;
  on_conflict?: Maybe<Attachment_On_Conflict>;
};

/** Boolean expression to filter rows from the table "attachment". All fields are combined with a logical 'AND'. */
export type Attachment_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Attachment_Bool_Exp>>>;
  _not?: Maybe<Attachment_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Attachment_Bool_Exp>>>;
  created_at?: Maybe<Timestamptz_Comparison_Exp>;
  id?: Maybe<Uuid_Comparison_Exp>;
  mime_type?: Maybe<String_Comparison_Exp>;
  original_name?: Maybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "attachment" */
export enum Attachment_Constraint {
  /** unique or primary key constraint */
  AttachmentIdKey = 'attachment_id_key',
  /** unique or primary key constraint */
  AttachmentPkey = 'attachment_pkey'
}

/** input type for inserting data into table "attachment" */
export type Attachment_Insert_Input = {
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  mime_type?: Maybe<Scalars['String']>;
  original_name?: Maybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Attachment_Max_Fields = {
  __typename?: 'attachment_max_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  mime_type?: Maybe<Scalars['String']>;
  original_name?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "attachment" */
export type Attachment_Max_Order_By = {
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  mime_type?: Maybe<Order_By>;
  original_name?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Attachment_Min_Fields = {
  __typename?: 'attachment_min_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  mime_type?: Maybe<Scalars['String']>;
  original_name?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "attachment" */
export type Attachment_Min_Order_By = {
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  mime_type?: Maybe<Order_By>;
  original_name?: Maybe<Order_By>;
};

/** response of any mutation on the table "attachment" */
export type Attachment_Mutation_Response = {
  __typename?: 'attachment_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Attachment>;
};

/** input type for inserting object relation for remote table "attachment" */
export type Attachment_Obj_Rel_Insert_Input = {
  data: Attachment_Insert_Input;
  on_conflict?: Maybe<Attachment_On_Conflict>;
};

/** on conflict condition type for table "attachment" */
export type Attachment_On_Conflict = {
  constraint: Attachment_Constraint;
  update_columns: Array<Attachment_Update_Column>;
  where?: Maybe<Attachment_Bool_Exp>;
};

/** ordering options when selecting data from "attachment" */
export type Attachment_Order_By = {
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  mime_type?: Maybe<Order_By>;
  original_name?: Maybe<Order_By>;
};

/** primary key columns input for table: "attachment" */
export type Attachment_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "attachment" */
export enum Attachment_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  MimeType = 'mime_type',
  /** column name */
  OriginalName = 'original_name'
}

/** input type for updating data in table "attachment" */
export type Attachment_Set_Input = {
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  mime_type?: Maybe<Scalars['String']>;
  original_name?: Maybe<Scalars['String']>;
};

/** update columns of table "attachment" */
export enum Attachment_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  MimeType = 'mime_type',
  /** column name */
  OriginalName = 'original_name'
}


/** expression to compare columns of type bigint. All fields are combined with logical 'AND'. */
export type Bigint_Comparison_Exp = {
  _eq?: Maybe<Scalars['bigint']>;
  _gt?: Maybe<Scalars['bigint']>;
  _gte?: Maybe<Scalars['bigint']>;
  _in?: Maybe<Array<Scalars['bigint']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['bigint']>;
  _lte?: Maybe<Scalars['bigint']>;
  _neq?: Maybe<Scalars['bigint']>;
  _nin?: Maybe<Array<Scalars['bigint']>>;
};


/** expression to compare columns of type date. All fields are combined with logical 'AND'. */
export type Date_Comparison_Exp = {
  _eq?: Maybe<Scalars['date']>;
  _gt?: Maybe<Scalars['date']>;
  _gte?: Maybe<Scalars['date']>;
  _in?: Maybe<Array<Scalars['date']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['date']>;
  _lte?: Maybe<Scalars['date']>;
  _neq?: Maybe<Scalars['date']>;
  _nin?: Maybe<Array<Scalars['date']>>;
};

/** columns and relationships of "full_text_search" */
export type Full_Text_Search = {
  __typename?: 'full_text_search';
  attachment_id?: Maybe<Scalars['uuid']>;
  attachment_name?: Maybe<Scalars['String']>;
  message_content?: Maybe<Scalars['String']>;
  message_created_at?: Maybe<Scalars['timestamptz']>;
  message_id?: Maybe<Scalars['uuid']>;
  message_type?: Maybe<Scalars['String']>;
  /** An object relationship */
  room?: Maybe<Room>;
  room_id?: Maybe<Scalars['uuid']>;
  room_name?: Maybe<Scalars['String']>;
  topic_id?: Maybe<Scalars['uuid']>;
  topic_name?: Maybe<Scalars['String']>;
  transcript?: Maybe<Scalars['String']>;
  transcription_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** aggregated selection of "full_text_search" */
export type Full_Text_Search_Aggregate = {
  __typename?: 'full_text_search_aggregate';
  aggregate?: Maybe<Full_Text_Search_Aggregate_Fields>;
  nodes: Array<Full_Text_Search>;
};

/** aggregate fields of "full_text_search" */
export type Full_Text_Search_Aggregate_Fields = {
  __typename?: 'full_text_search_aggregate_fields';
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Full_Text_Search_Max_Fields>;
  min?: Maybe<Full_Text_Search_Min_Fields>;
};


/** aggregate fields of "full_text_search" */
export type Full_Text_Search_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Full_Text_Search_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "full_text_search" */
export type Full_Text_Search_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<Full_Text_Search_Max_Order_By>;
  min?: Maybe<Full_Text_Search_Min_Order_By>;
};

/** input type for inserting array relation for remote table "full_text_search" */
export type Full_Text_Search_Arr_Rel_Insert_Input = {
  data: Array<Full_Text_Search_Insert_Input>;
};

/** Boolean expression to filter rows from the table "full_text_search". All fields are combined with a logical 'AND'. */
export type Full_Text_Search_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Full_Text_Search_Bool_Exp>>>;
  _not?: Maybe<Full_Text_Search_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Full_Text_Search_Bool_Exp>>>;
  attachment_id?: Maybe<Uuid_Comparison_Exp>;
  attachment_name?: Maybe<String_Comparison_Exp>;
  message_content?: Maybe<String_Comparison_Exp>;
  message_created_at?: Maybe<Timestamptz_Comparison_Exp>;
  message_id?: Maybe<Uuid_Comparison_Exp>;
  message_type?: Maybe<String_Comparison_Exp>;
  room?: Maybe<Room_Bool_Exp>;
  room_id?: Maybe<Uuid_Comparison_Exp>;
  room_name?: Maybe<String_Comparison_Exp>;
  topic_id?: Maybe<Uuid_Comparison_Exp>;
  topic_name?: Maybe<String_Comparison_Exp>;
  transcript?: Maybe<String_Comparison_Exp>;
  transcription_id?: Maybe<Uuid_Comparison_Exp>;
  user_id?: Maybe<Uuid_Comparison_Exp>;
};

/** input type for inserting data into table "full_text_search" */
export type Full_Text_Search_Insert_Input = {
  attachment_id?: Maybe<Scalars['uuid']>;
  attachment_name?: Maybe<Scalars['String']>;
  message_content?: Maybe<Scalars['String']>;
  message_created_at?: Maybe<Scalars['timestamptz']>;
  message_id?: Maybe<Scalars['uuid']>;
  message_type?: Maybe<Scalars['String']>;
  room?: Maybe<Room_Obj_Rel_Insert_Input>;
  room_id?: Maybe<Scalars['uuid']>;
  room_name?: Maybe<Scalars['String']>;
  topic_id?: Maybe<Scalars['uuid']>;
  topic_name?: Maybe<Scalars['String']>;
  transcript?: Maybe<Scalars['String']>;
  transcription_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Full_Text_Search_Max_Fields = {
  __typename?: 'full_text_search_max_fields';
  attachment_id?: Maybe<Scalars['uuid']>;
  attachment_name?: Maybe<Scalars['String']>;
  message_content?: Maybe<Scalars['String']>;
  message_created_at?: Maybe<Scalars['timestamptz']>;
  message_id?: Maybe<Scalars['uuid']>;
  message_type?: Maybe<Scalars['String']>;
  room_id?: Maybe<Scalars['uuid']>;
  room_name?: Maybe<Scalars['String']>;
  topic_id?: Maybe<Scalars['uuid']>;
  topic_name?: Maybe<Scalars['String']>;
  transcript?: Maybe<Scalars['String']>;
  transcription_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "full_text_search" */
export type Full_Text_Search_Max_Order_By = {
  attachment_id?: Maybe<Order_By>;
  attachment_name?: Maybe<Order_By>;
  message_content?: Maybe<Order_By>;
  message_created_at?: Maybe<Order_By>;
  message_id?: Maybe<Order_By>;
  message_type?: Maybe<Order_By>;
  room_id?: Maybe<Order_By>;
  room_name?: Maybe<Order_By>;
  topic_id?: Maybe<Order_By>;
  topic_name?: Maybe<Order_By>;
  transcript?: Maybe<Order_By>;
  transcription_id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Full_Text_Search_Min_Fields = {
  __typename?: 'full_text_search_min_fields';
  attachment_id?: Maybe<Scalars['uuid']>;
  attachment_name?: Maybe<Scalars['String']>;
  message_content?: Maybe<Scalars['String']>;
  message_created_at?: Maybe<Scalars['timestamptz']>;
  message_id?: Maybe<Scalars['uuid']>;
  message_type?: Maybe<Scalars['String']>;
  room_id?: Maybe<Scalars['uuid']>;
  room_name?: Maybe<Scalars['String']>;
  topic_id?: Maybe<Scalars['uuid']>;
  topic_name?: Maybe<Scalars['String']>;
  transcript?: Maybe<Scalars['String']>;
  transcription_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "full_text_search" */
export type Full_Text_Search_Min_Order_By = {
  attachment_id?: Maybe<Order_By>;
  attachment_name?: Maybe<Order_By>;
  message_content?: Maybe<Order_By>;
  message_created_at?: Maybe<Order_By>;
  message_id?: Maybe<Order_By>;
  message_type?: Maybe<Order_By>;
  room_id?: Maybe<Order_By>;
  room_name?: Maybe<Order_By>;
  topic_id?: Maybe<Order_By>;
  topic_name?: Maybe<Order_By>;
  transcript?: Maybe<Order_By>;
  transcription_id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** response of any mutation on the table "full_text_search" */
export type Full_Text_Search_Mutation_Response = {
  __typename?: 'full_text_search_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Full_Text_Search>;
};

/** input type for inserting object relation for remote table "full_text_search" */
export type Full_Text_Search_Obj_Rel_Insert_Input = {
  data: Full_Text_Search_Insert_Input;
};

/** ordering options when selecting data from "full_text_search" */
export type Full_Text_Search_Order_By = {
  attachment_id?: Maybe<Order_By>;
  attachment_name?: Maybe<Order_By>;
  message_content?: Maybe<Order_By>;
  message_created_at?: Maybe<Order_By>;
  message_id?: Maybe<Order_By>;
  message_type?: Maybe<Order_By>;
  room?: Maybe<Room_Order_By>;
  room_id?: Maybe<Order_By>;
  room_name?: Maybe<Order_By>;
  topic_id?: Maybe<Order_By>;
  topic_name?: Maybe<Order_By>;
  transcript?: Maybe<Order_By>;
  transcription_id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** select columns of table "full_text_search" */
export enum Full_Text_Search_Select_Column {
  /** column name */
  AttachmentId = 'attachment_id',
  /** column name */
  AttachmentName = 'attachment_name',
  /** column name */
  MessageContent = 'message_content',
  /** column name */
  MessageCreatedAt = 'message_created_at',
  /** column name */
  MessageId = 'message_id',
  /** column name */
  MessageType = 'message_type',
  /** column name */
  RoomId = 'room_id',
  /** column name */
  RoomName = 'room_name',
  /** column name */
  TopicId = 'topic_id',
  /** column name */
  TopicName = 'topic_name',
  /** column name */
  Transcript = 'transcript',
  /** column name */
  TranscriptionId = 'transcription_id',
  /** column name */
  UserId = 'user_id'
}

/** input type for updating data in table "full_text_search" */
export type Full_Text_Search_Set_Input = {
  attachment_id?: Maybe<Scalars['uuid']>;
  attachment_name?: Maybe<Scalars['String']>;
  message_content?: Maybe<Scalars['String']>;
  message_created_at?: Maybe<Scalars['timestamptz']>;
  message_id?: Maybe<Scalars['uuid']>;
  message_type?: Maybe<Scalars['String']>;
  room_id?: Maybe<Scalars['uuid']>;
  room_name?: Maybe<Scalars['String']>;
  topic_id?: Maybe<Scalars['uuid']>;
  topic_name?: Maybe<Scalars['String']>;
  transcript?: Maybe<Scalars['String']>;
  transcription_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
};


/** expression to compare columns of type json. All fields are combined with logical 'AND'. */
export type Json_Comparison_Exp = {
  _eq?: Maybe<Scalars['json']>;
  _gt?: Maybe<Scalars['json']>;
  _gte?: Maybe<Scalars['json']>;
  _in?: Maybe<Array<Scalars['json']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['json']>;
  _lte?: Maybe<Scalars['json']>;
  _neq?: Maybe<Scalars['json']>;
  _nin?: Maybe<Array<Scalars['json']>>;
};


/** expression to compare columns of type jsonb. All fields are combined with logical 'AND'. */
export type Jsonb_Comparison_Exp = {
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
};

/** columns and relationships of "last_seen_message" */
export type Last_Seen_Message = {
  __typename?: 'last_seen_message';
  message_id: Scalars['uuid'];
  seen_at: Scalars['timestamptz'];
  topic_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
};

/** aggregated selection of "last_seen_message" */
export type Last_Seen_Message_Aggregate = {
  __typename?: 'last_seen_message_aggregate';
  aggregate?: Maybe<Last_Seen_Message_Aggregate_Fields>;
  nodes: Array<Last_Seen_Message>;
};

/** aggregate fields of "last_seen_message" */
export type Last_Seen_Message_Aggregate_Fields = {
  __typename?: 'last_seen_message_aggregate_fields';
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Last_Seen_Message_Max_Fields>;
  min?: Maybe<Last_Seen_Message_Min_Fields>;
};


/** aggregate fields of "last_seen_message" */
export type Last_Seen_Message_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Last_Seen_Message_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "last_seen_message" */
export type Last_Seen_Message_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<Last_Seen_Message_Max_Order_By>;
  min?: Maybe<Last_Seen_Message_Min_Order_By>;
};

/** input type for inserting array relation for remote table "last_seen_message" */
export type Last_Seen_Message_Arr_Rel_Insert_Input = {
  data: Array<Last_Seen_Message_Insert_Input>;
  on_conflict?: Maybe<Last_Seen_Message_On_Conflict>;
};

/** Boolean expression to filter rows from the table "last_seen_message". All fields are combined with a logical 'AND'. */
export type Last_Seen_Message_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Last_Seen_Message_Bool_Exp>>>;
  _not?: Maybe<Last_Seen_Message_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Last_Seen_Message_Bool_Exp>>>;
  message_id?: Maybe<Uuid_Comparison_Exp>;
  seen_at?: Maybe<Timestamptz_Comparison_Exp>;
  topic_id?: Maybe<Uuid_Comparison_Exp>;
  user_id?: Maybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "last_seen_message" */
export enum Last_Seen_Message_Constraint {
  /** unique or primary key constraint */
  LastSeenMessagePkey = 'last_seen_message_pkey'
}

/** input type for inserting data into table "last_seen_message" */
export type Last_Seen_Message_Insert_Input = {
  message_id?: Maybe<Scalars['uuid']>;
  seen_at?: Maybe<Scalars['timestamptz']>;
  topic_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Last_Seen_Message_Max_Fields = {
  __typename?: 'last_seen_message_max_fields';
  message_id?: Maybe<Scalars['uuid']>;
  seen_at?: Maybe<Scalars['timestamptz']>;
  topic_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "last_seen_message" */
export type Last_Seen_Message_Max_Order_By = {
  message_id?: Maybe<Order_By>;
  seen_at?: Maybe<Order_By>;
  topic_id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Last_Seen_Message_Min_Fields = {
  __typename?: 'last_seen_message_min_fields';
  message_id?: Maybe<Scalars['uuid']>;
  seen_at?: Maybe<Scalars['timestamptz']>;
  topic_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "last_seen_message" */
export type Last_Seen_Message_Min_Order_By = {
  message_id?: Maybe<Order_By>;
  seen_at?: Maybe<Order_By>;
  topic_id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** response of any mutation on the table "last_seen_message" */
export type Last_Seen_Message_Mutation_Response = {
  __typename?: 'last_seen_message_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Last_Seen_Message>;
};

/** input type for inserting object relation for remote table "last_seen_message" */
export type Last_Seen_Message_Obj_Rel_Insert_Input = {
  data: Last_Seen_Message_Insert_Input;
  on_conflict?: Maybe<Last_Seen_Message_On_Conflict>;
};

/** on conflict condition type for table "last_seen_message" */
export type Last_Seen_Message_On_Conflict = {
  constraint: Last_Seen_Message_Constraint;
  update_columns: Array<Last_Seen_Message_Update_Column>;
  where?: Maybe<Last_Seen_Message_Bool_Exp>;
};

/** ordering options when selecting data from "last_seen_message" */
export type Last_Seen_Message_Order_By = {
  message_id?: Maybe<Order_By>;
  seen_at?: Maybe<Order_By>;
  topic_id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** primary key columns input for table: "last_seen_message" */
export type Last_Seen_Message_Pk_Columns_Input = {
  topic_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
};

/** select columns of table "last_seen_message" */
export enum Last_Seen_Message_Select_Column {
  /** column name */
  MessageId = 'message_id',
  /** column name */
  SeenAt = 'seen_at',
  /** column name */
  TopicId = 'topic_id',
  /** column name */
  UserId = 'user_id'
}

/** input type for updating data in table "last_seen_message" */
export type Last_Seen_Message_Set_Input = {
  message_id?: Maybe<Scalars['uuid']>;
  seen_at?: Maybe<Scalars['timestamptz']>;
  topic_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** update columns of table "last_seen_message" */
export enum Last_Seen_Message_Update_Column {
  /** column name */
  MessageId = 'message_id',
  /** column name */
  SeenAt = 'seen_at',
  /** column name */
  TopicId = 'topic_id',
  /** column name */
  UserId = 'user_id'
}

/** columns and relationships of "membership_status" */
export type Membership_Status = {
  __typename?: 'membership_status';
  value: Scalars['String'];
};

/** aggregated selection of "membership_status" */
export type Membership_Status_Aggregate = {
  __typename?: 'membership_status_aggregate';
  aggregate?: Maybe<Membership_Status_Aggregate_Fields>;
  nodes: Array<Membership_Status>;
};

/** aggregate fields of "membership_status" */
export type Membership_Status_Aggregate_Fields = {
  __typename?: 'membership_status_aggregate_fields';
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Membership_Status_Max_Fields>;
  min?: Maybe<Membership_Status_Min_Fields>;
};


/** aggregate fields of "membership_status" */
export type Membership_Status_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Membership_Status_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "membership_status" */
export type Membership_Status_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<Membership_Status_Max_Order_By>;
  min?: Maybe<Membership_Status_Min_Order_By>;
};

/** input type for inserting array relation for remote table "membership_status" */
export type Membership_Status_Arr_Rel_Insert_Input = {
  data: Array<Membership_Status_Insert_Input>;
  on_conflict?: Maybe<Membership_Status_On_Conflict>;
};

/** Boolean expression to filter rows from the table "membership_status". All fields are combined with a logical 'AND'. */
export type Membership_Status_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Membership_Status_Bool_Exp>>>;
  _not?: Maybe<Membership_Status_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Membership_Status_Bool_Exp>>>;
  value?: Maybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "membership_status" */
export enum Membership_Status_Constraint {
  /** unique or primary key constraint */
  TeamMembershipStatusPkey = 'team_membership_status_pkey'
}

/** input type for inserting data into table "membership_status" */
export type Membership_Status_Insert_Input = {
  value?: Maybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Membership_Status_Max_Fields = {
  __typename?: 'membership_status_max_fields';
  value?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "membership_status" */
export type Membership_Status_Max_Order_By = {
  value?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Membership_Status_Min_Fields = {
  __typename?: 'membership_status_min_fields';
  value?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "membership_status" */
export type Membership_Status_Min_Order_By = {
  value?: Maybe<Order_By>;
};

/** response of any mutation on the table "membership_status" */
export type Membership_Status_Mutation_Response = {
  __typename?: 'membership_status_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Membership_Status>;
};

/** input type for inserting object relation for remote table "membership_status" */
export type Membership_Status_Obj_Rel_Insert_Input = {
  data: Membership_Status_Insert_Input;
  on_conflict?: Maybe<Membership_Status_On_Conflict>;
};

/** on conflict condition type for table "membership_status" */
export type Membership_Status_On_Conflict = {
  constraint: Membership_Status_Constraint;
  update_columns: Array<Membership_Status_Update_Column>;
  where?: Maybe<Membership_Status_Bool_Exp>;
};

/** ordering options when selecting data from "membership_status" */
export type Membership_Status_Order_By = {
  value?: Maybe<Order_By>;
};

/** primary key columns input for table: "membership_status" */
export type Membership_Status_Pk_Columns_Input = {
  value: Scalars['String'];
};

/** select columns of table "membership_status" */
export enum Membership_Status_Select_Column {
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "membership_status" */
export type Membership_Status_Set_Input = {
  value?: Maybe<Scalars['String']>;
};

/** update columns of table "membership_status" */
export enum Membership_Status_Update_Column {
  /** column name */
  Value = 'value'
}

/** columns and relationships of "message" */
export type Message = {
  __typename?: 'message';
  content: Scalars['jsonb'];
  created_at: Scalars['timestamptz'];
  id: Scalars['uuid'];
  is_draft: Scalars['Boolean'];
  /** An array relationship */
  message_attachments: Array<Message_Attachment>;
  /** An aggregated array relationship */
  message_attachments_aggregate: Message_Attachment_Aggregate;
  /** An object relationship */
  message_type: Message_Type;
  /** An object relationship */
  topic: Topic;
  topic_id: Scalars['uuid'];
  /** An object relationship */
  transcription?: Maybe<Transcription>;
  transcription_id?: Maybe<Scalars['uuid']>;
  type: Message_Type_Enum;
  /** An object relationship */
  user: User;
  user_id: Scalars['uuid'];
};


/** columns and relationships of "message" */
export type MessageContentArgs = {
  path?: Maybe<Scalars['String']>;
};


/** columns and relationships of "message" */
export type MessageMessage_AttachmentsArgs = {
  distinct_on?: Maybe<Array<Message_Attachment_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Message_Attachment_Order_By>>;
  where?: Maybe<Message_Attachment_Bool_Exp>;
};


/** columns and relationships of "message" */
export type MessageMessage_Attachments_AggregateArgs = {
  distinct_on?: Maybe<Array<Message_Attachment_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Message_Attachment_Order_By>>;
  where?: Maybe<Message_Attachment_Bool_Exp>;
};

/** aggregated selection of "message" */
export type Message_Aggregate = {
  __typename?: 'message_aggregate';
  aggregate?: Maybe<Message_Aggregate_Fields>;
  nodes: Array<Message>;
};

/** aggregate fields of "message" */
export type Message_Aggregate_Fields = {
  __typename?: 'message_aggregate_fields';
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Message_Max_Fields>;
  min?: Maybe<Message_Min_Fields>;
};


/** aggregate fields of "message" */
export type Message_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Message_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "message" */
export type Message_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<Message_Max_Order_By>;
  min?: Maybe<Message_Min_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Message_Append_Input = {
  content?: Maybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "message" */
export type Message_Arr_Rel_Insert_Input = {
  data: Array<Message_Insert_Input>;
  on_conflict?: Maybe<Message_On_Conflict>;
};

/** columns and relationships of "message_attachment" */
export type Message_Attachment = {
  __typename?: 'message_attachment';
  /** An object relationship */
  attachment: Attachment;
  attachment_id: Scalars['uuid'];
  /** An object relationship */
  message: Message;
  message_id: Scalars['uuid'];
};

/** aggregated selection of "message_attachment" */
export type Message_Attachment_Aggregate = {
  __typename?: 'message_attachment_aggregate';
  aggregate?: Maybe<Message_Attachment_Aggregate_Fields>;
  nodes: Array<Message_Attachment>;
};

/** aggregate fields of "message_attachment" */
export type Message_Attachment_Aggregate_Fields = {
  __typename?: 'message_attachment_aggregate_fields';
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Message_Attachment_Max_Fields>;
  min?: Maybe<Message_Attachment_Min_Fields>;
};


/** aggregate fields of "message_attachment" */
export type Message_Attachment_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Message_Attachment_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "message_attachment" */
export type Message_Attachment_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<Message_Attachment_Max_Order_By>;
  min?: Maybe<Message_Attachment_Min_Order_By>;
};

/** input type for inserting array relation for remote table "message_attachment" */
export type Message_Attachment_Arr_Rel_Insert_Input = {
  data: Array<Message_Attachment_Insert_Input>;
  on_conflict?: Maybe<Message_Attachment_On_Conflict>;
};

/** Boolean expression to filter rows from the table "message_attachment". All fields are combined with a logical 'AND'. */
export type Message_Attachment_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Message_Attachment_Bool_Exp>>>;
  _not?: Maybe<Message_Attachment_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Message_Attachment_Bool_Exp>>>;
  attachment?: Maybe<Attachment_Bool_Exp>;
  attachment_id?: Maybe<Uuid_Comparison_Exp>;
  message?: Maybe<Message_Bool_Exp>;
  message_id?: Maybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "message_attachment" */
export enum Message_Attachment_Constraint {
  /** unique or primary key constraint */
  MessageAttachmentsPkey = 'message_attachments_pkey'
}

/** input type for inserting data into table "message_attachment" */
export type Message_Attachment_Insert_Input = {
  attachment?: Maybe<Attachment_Obj_Rel_Insert_Input>;
  attachment_id?: Maybe<Scalars['uuid']>;
  message?: Maybe<Message_Obj_Rel_Insert_Input>;
  message_id?: Maybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Message_Attachment_Max_Fields = {
  __typename?: 'message_attachment_max_fields';
  attachment_id?: Maybe<Scalars['uuid']>;
  message_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "message_attachment" */
export type Message_Attachment_Max_Order_By = {
  attachment_id?: Maybe<Order_By>;
  message_id?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Message_Attachment_Min_Fields = {
  __typename?: 'message_attachment_min_fields';
  attachment_id?: Maybe<Scalars['uuid']>;
  message_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "message_attachment" */
export type Message_Attachment_Min_Order_By = {
  attachment_id?: Maybe<Order_By>;
  message_id?: Maybe<Order_By>;
};

/** response of any mutation on the table "message_attachment" */
export type Message_Attachment_Mutation_Response = {
  __typename?: 'message_attachment_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Message_Attachment>;
};

/** input type for inserting object relation for remote table "message_attachment" */
export type Message_Attachment_Obj_Rel_Insert_Input = {
  data: Message_Attachment_Insert_Input;
  on_conflict?: Maybe<Message_Attachment_On_Conflict>;
};

/** on conflict condition type for table "message_attachment" */
export type Message_Attachment_On_Conflict = {
  constraint: Message_Attachment_Constraint;
  update_columns: Array<Message_Attachment_Update_Column>;
  where?: Maybe<Message_Attachment_Bool_Exp>;
};

/** ordering options when selecting data from "message_attachment" */
export type Message_Attachment_Order_By = {
  attachment?: Maybe<Attachment_Order_By>;
  attachment_id?: Maybe<Order_By>;
  message?: Maybe<Message_Order_By>;
  message_id?: Maybe<Order_By>;
};

/** primary key columns input for table: "message_attachment" */
export type Message_Attachment_Pk_Columns_Input = {
  attachment_id: Scalars['uuid'];
  message_id: Scalars['uuid'];
};

/** select columns of table "message_attachment" */
export enum Message_Attachment_Select_Column {
  /** column name */
  AttachmentId = 'attachment_id',
  /** column name */
  MessageId = 'message_id'
}

/** input type for updating data in table "message_attachment" */
export type Message_Attachment_Set_Input = {
  attachment_id?: Maybe<Scalars['uuid']>;
  message_id?: Maybe<Scalars['uuid']>;
};

/** update columns of table "message_attachment" */
export enum Message_Attachment_Update_Column {
  /** column name */
  AttachmentId = 'attachment_id',
  /** column name */
  MessageId = 'message_id'
}

/** Boolean expression to filter rows from the table "message". All fields are combined with a logical 'AND'. */
export type Message_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Message_Bool_Exp>>>;
  _not?: Maybe<Message_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Message_Bool_Exp>>>;
  content?: Maybe<Jsonb_Comparison_Exp>;
  created_at?: Maybe<Timestamptz_Comparison_Exp>;
  id?: Maybe<Uuid_Comparison_Exp>;
  is_draft?: Maybe<Boolean_Comparison_Exp>;
  message_attachments?: Maybe<Message_Attachment_Bool_Exp>;
  message_type?: Maybe<Message_Type_Bool_Exp>;
  topic?: Maybe<Topic_Bool_Exp>;
  topic_id?: Maybe<Uuid_Comparison_Exp>;
  transcription?: Maybe<Transcription_Bool_Exp>;
  transcription_id?: Maybe<Uuid_Comparison_Exp>;
  type?: Maybe<Message_Type_Enum_Comparison_Exp>;
  user?: Maybe<User_Bool_Exp>;
  user_id?: Maybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "message" */
export enum Message_Constraint {
  /** unique or primary key constraint */
  MessageIdKey = 'message_id_key',
  /** unique or primary key constraint */
  MessagePkey = 'message_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Message_Delete_At_Path_Input = {
  content?: Maybe<Array<Maybe<Scalars['String']>>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Message_Delete_Elem_Input = {
  content?: Maybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Message_Delete_Key_Input = {
  content?: Maybe<Scalars['String']>;
};

/** columns and relationships of "message_full_text" */
export type Message_Full_Text = {
  __typename?: 'message_full_text';
  content_txt?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  topic_id?: Maybe<Scalars['uuid']>;
  transcription_id?: Maybe<Scalars['uuid']>;
  type?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** aggregated selection of "message_full_text" */
export type Message_Full_Text_Aggregate = {
  __typename?: 'message_full_text_aggregate';
  aggregate?: Maybe<Message_Full_Text_Aggregate_Fields>;
  nodes: Array<Message_Full_Text>;
};

/** aggregate fields of "message_full_text" */
export type Message_Full_Text_Aggregate_Fields = {
  __typename?: 'message_full_text_aggregate_fields';
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Message_Full_Text_Max_Fields>;
  min?: Maybe<Message_Full_Text_Min_Fields>;
};


/** aggregate fields of "message_full_text" */
export type Message_Full_Text_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Message_Full_Text_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "message_full_text" */
export type Message_Full_Text_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<Message_Full_Text_Max_Order_By>;
  min?: Maybe<Message_Full_Text_Min_Order_By>;
};

/** Boolean expression to filter rows from the table "message_full_text". All fields are combined with a logical 'AND'. */
export type Message_Full_Text_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Message_Full_Text_Bool_Exp>>>;
  _not?: Maybe<Message_Full_Text_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Message_Full_Text_Bool_Exp>>>;
  content_txt?: Maybe<String_Comparison_Exp>;
  created_at?: Maybe<Timestamptz_Comparison_Exp>;
  id?: Maybe<Uuid_Comparison_Exp>;
  topic_id?: Maybe<Uuid_Comparison_Exp>;
  transcription_id?: Maybe<Uuid_Comparison_Exp>;
  type?: Maybe<String_Comparison_Exp>;
  user_id?: Maybe<Uuid_Comparison_Exp>;
};

/** aggregate max on columns */
export type Message_Full_Text_Max_Fields = {
  __typename?: 'message_full_text_max_fields';
  content_txt?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  topic_id?: Maybe<Scalars['uuid']>;
  transcription_id?: Maybe<Scalars['uuid']>;
  type?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "message_full_text" */
export type Message_Full_Text_Max_Order_By = {
  content_txt?: Maybe<Order_By>;
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  topic_id?: Maybe<Order_By>;
  transcription_id?: Maybe<Order_By>;
  type?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Message_Full_Text_Min_Fields = {
  __typename?: 'message_full_text_min_fields';
  content_txt?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  topic_id?: Maybe<Scalars['uuid']>;
  transcription_id?: Maybe<Scalars['uuid']>;
  type?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "message_full_text" */
export type Message_Full_Text_Min_Order_By = {
  content_txt?: Maybe<Order_By>;
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  topic_id?: Maybe<Order_By>;
  transcription_id?: Maybe<Order_By>;
  type?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** ordering options when selecting data from "message_full_text" */
export type Message_Full_Text_Order_By = {
  content_txt?: Maybe<Order_By>;
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  topic_id?: Maybe<Order_By>;
  transcription_id?: Maybe<Order_By>;
  type?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** select columns of table "message_full_text" */
export enum Message_Full_Text_Select_Column {
  /** column name */
  ContentTxt = 'content_txt',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  TopicId = 'topic_id',
  /** column name */
  TranscriptionId = 'transcription_id',
  /** column name */
  Type = 'type',
  /** column name */
  UserId = 'user_id'
}

/** input type for inserting data into table "message" */
export type Message_Insert_Input = {
  content?: Maybe<Scalars['jsonb']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  is_draft?: Maybe<Scalars['Boolean']>;
  message_attachments?: Maybe<Message_Attachment_Arr_Rel_Insert_Input>;
  message_type?: Maybe<Message_Type_Obj_Rel_Insert_Input>;
  topic?: Maybe<Topic_Obj_Rel_Insert_Input>;
  topic_id?: Maybe<Scalars['uuid']>;
  transcription?: Maybe<Transcription_Obj_Rel_Insert_Input>;
  transcription_id?: Maybe<Scalars['uuid']>;
  type?: Maybe<Message_Type_Enum>;
  user?: Maybe<User_Obj_Rel_Insert_Input>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Message_Max_Fields = {
  __typename?: 'message_max_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  topic_id?: Maybe<Scalars['uuid']>;
  transcription_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "message" */
export type Message_Max_Order_By = {
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  topic_id?: Maybe<Order_By>;
  transcription_id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Message_Min_Fields = {
  __typename?: 'message_min_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  topic_id?: Maybe<Scalars['uuid']>;
  transcription_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "message" */
export type Message_Min_Order_By = {
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  topic_id?: Maybe<Order_By>;
  transcription_id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** response of any mutation on the table "message" */
export type Message_Mutation_Response = {
  __typename?: 'message_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Message>;
};

/** input type for inserting object relation for remote table "message" */
export type Message_Obj_Rel_Insert_Input = {
  data: Message_Insert_Input;
  on_conflict?: Maybe<Message_On_Conflict>;
};

/** on conflict condition type for table "message" */
export type Message_On_Conflict = {
  constraint: Message_Constraint;
  update_columns: Array<Message_Update_Column>;
  where?: Maybe<Message_Bool_Exp>;
};

/** ordering options when selecting data from "message" */
export type Message_Order_By = {
  content?: Maybe<Order_By>;
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  is_draft?: Maybe<Order_By>;
  message_attachments_aggregate?: Maybe<Message_Attachment_Aggregate_Order_By>;
  message_type?: Maybe<Message_Type_Order_By>;
  topic?: Maybe<Topic_Order_By>;
  topic_id?: Maybe<Order_By>;
  transcription?: Maybe<Transcription_Order_By>;
  transcription_id?: Maybe<Order_By>;
  type?: Maybe<Order_By>;
  user?: Maybe<User_Order_By>;
  user_id?: Maybe<Order_By>;
};

/** primary key columns input for table: "message" */
export type Message_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Message_Prepend_Input = {
  content?: Maybe<Scalars['jsonb']>;
};

/** select columns of table "message" */
export enum Message_Select_Column {
  /** column name */
  Content = 'content',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  IsDraft = 'is_draft',
  /** column name */
  TopicId = 'topic_id',
  /** column name */
  TranscriptionId = 'transcription_id',
  /** column name */
  Type = 'type',
  /** column name */
  UserId = 'user_id'
}

/** input type for updating data in table "message" */
export type Message_Set_Input = {
  content?: Maybe<Scalars['jsonb']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  is_draft?: Maybe<Scalars['Boolean']>;
  topic_id?: Maybe<Scalars['uuid']>;
  transcription_id?: Maybe<Scalars['uuid']>;
  type?: Maybe<Message_Type_Enum>;
  user_id?: Maybe<Scalars['uuid']>;
};

/**
 * Used as an ENUM for the message type field constraint.
 *
 *
 * columns and relationships of "message_type"
 */
export type Message_Type = {
  __typename?: 'message_type';
  value: Scalars['String'];
};

/** aggregated selection of "message_type" */
export type Message_Type_Aggregate = {
  __typename?: 'message_type_aggregate';
  aggregate?: Maybe<Message_Type_Aggregate_Fields>;
  nodes: Array<Message_Type>;
};

/** aggregate fields of "message_type" */
export type Message_Type_Aggregate_Fields = {
  __typename?: 'message_type_aggregate_fields';
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Message_Type_Max_Fields>;
  min?: Maybe<Message_Type_Min_Fields>;
};


/** aggregate fields of "message_type" */
export type Message_Type_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Message_Type_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "message_type" */
export type Message_Type_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<Message_Type_Max_Order_By>;
  min?: Maybe<Message_Type_Min_Order_By>;
};

/** input type for inserting array relation for remote table "message_type" */
export type Message_Type_Arr_Rel_Insert_Input = {
  data: Array<Message_Type_Insert_Input>;
  on_conflict?: Maybe<Message_Type_On_Conflict>;
};

/** Boolean expression to filter rows from the table "message_type". All fields are combined with a logical 'AND'. */
export type Message_Type_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Message_Type_Bool_Exp>>>;
  _not?: Maybe<Message_Type_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Message_Type_Bool_Exp>>>;
  value?: Maybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "message_type" */
export enum Message_Type_Constraint {
  /** unique or primary key constraint */
  MessageTypePkey = 'message_type_pkey'
}

export enum Message_Type_Enum {
  Audio = 'AUDIO',
  File = 'FILE',
  Text = 'TEXT',
  Video = 'VIDEO'
}

/** expression to compare columns of type message_type_enum. All fields are combined with logical 'AND'. */
export type Message_Type_Enum_Comparison_Exp = {
  _eq?: Maybe<Message_Type_Enum>;
  _in?: Maybe<Array<Message_Type_Enum>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _neq?: Maybe<Message_Type_Enum>;
  _nin?: Maybe<Array<Message_Type_Enum>>;
};

/** input type for inserting data into table "message_type" */
export type Message_Type_Insert_Input = {
  value?: Maybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Message_Type_Max_Fields = {
  __typename?: 'message_type_max_fields';
  value?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "message_type" */
export type Message_Type_Max_Order_By = {
  value?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Message_Type_Min_Fields = {
  __typename?: 'message_type_min_fields';
  value?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "message_type" */
export type Message_Type_Min_Order_By = {
  value?: Maybe<Order_By>;
};

/** response of any mutation on the table "message_type" */
export type Message_Type_Mutation_Response = {
  __typename?: 'message_type_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Message_Type>;
};

/** input type for inserting object relation for remote table "message_type" */
export type Message_Type_Obj_Rel_Insert_Input = {
  data: Message_Type_Insert_Input;
  on_conflict?: Maybe<Message_Type_On_Conflict>;
};

/** on conflict condition type for table "message_type" */
export type Message_Type_On_Conflict = {
  constraint: Message_Type_Constraint;
  update_columns: Array<Message_Type_Update_Column>;
  where?: Maybe<Message_Type_Bool_Exp>;
};

/** ordering options when selecting data from "message_type" */
export type Message_Type_Order_By = {
  value?: Maybe<Order_By>;
};

/** primary key columns input for table: "message_type" */
export type Message_Type_Pk_Columns_Input = {
  value: Scalars['String'];
};

/** select columns of table "message_type" */
export enum Message_Type_Select_Column {
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "message_type" */
export type Message_Type_Set_Input = {
  value?: Maybe<Scalars['String']>;
};

/** update columns of table "message_type" */
export enum Message_Type_Update_Column {
  /** column name */
  Value = 'value'
}

/** update columns of table "message" */
export enum Message_Update_Column {
  /** column name */
  Content = 'content',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  IsDraft = 'is_draft',
  /** column name */
  TopicId = 'topic_id',
  /** column name */
  TranscriptionId = 'transcription_id',
  /** column name */
  Type = 'type',
  /** column name */
  UserId = 'user_id'
}

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** perform the action: "accept_invite" */
  accept_invite?: Maybe<InviteAcceptResponse>;
  /** delete data from the table: "account" */
  delete_account?: Maybe<Account_Mutation_Response>;
  /** delete single row from the table: "account" */
  delete_account_by_pk?: Maybe<Account>;
  /** delete data from the table: "attachment" */
  delete_attachment?: Maybe<Attachment_Mutation_Response>;
  /** delete single row from the table: "attachment" */
  delete_attachment_by_pk?: Maybe<Attachment>;
  /** delete data from the table: "full_text_search" */
  delete_full_text_search?: Maybe<Full_Text_Search_Mutation_Response>;
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
  /** delete data from the table: "message_attachment" */
  delete_message_attachment?: Maybe<Message_Attachment_Mutation_Response>;
  /** delete single row from the table: "message_attachment" */
  delete_message_attachment_by_pk?: Maybe<Message_Attachment>;
  /** delete single row from the table: "message" */
  delete_message_by_pk?: Maybe<Message>;
  /** delete data from the table: "message_type" */
  delete_message_type?: Maybe<Message_Type_Mutation_Response>;
  /** delete single row from the table: "message_type" */
  delete_message_type_by_pk?: Maybe<Message_Type>;
  /** delete data from the table: "room" */
  delete_room?: Maybe<Room_Mutation_Response>;
  /** delete single row from the table: "room" */
  delete_room_by_pk?: Maybe<Room>;
  /** delete data from the table: "room_invites" */
  delete_room_invites?: Maybe<Room_Invites_Mutation_Response>;
  /** delete single row from the table: "room_invites" */
  delete_room_invites_by_pk?: Maybe<Room_Invites>;
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
  /** insert data into the table: "account" */
  insert_account?: Maybe<Account_Mutation_Response>;
  /** insert a single row into the table: "account" */
  insert_account_one?: Maybe<Account>;
  /** insert data into the table: "attachment" */
  insert_attachment?: Maybe<Attachment_Mutation_Response>;
  /** insert a single row into the table: "attachment" */
  insert_attachment_one?: Maybe<Attachment>;
  /** insert data into the table: "full_text_search" */
  insert_full_text_search?: Maybe<Full_Text_Search_Mutation_Response>;
  /** insert a single row into the table: "full_text_search" */
  insert_full_text_search_one?: Maybe<Full_Text_Search>;
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
  /** insert data into the table: "message_attachment" */
  insert_message_attachment?: Maybe<Message_Attachment_Mutation_Response>;
  /** insert a single row into the table: "message_attachment" */
  insert_message_attachment_one?: Maybe<Message_Attachment>;
  /** insert a single row into the table: "message" */
  insert_message_one?: Maybe<Message>;
  /** insert data into the table: "message_type" */
  insert_message_type?: Maybe<Message_Type_Mutation_Response>;
  /** insert a single row into the table: "message_type" */
  insert_message_type_one?: Maybe<Message_Type>;
  /** insert data into the table: "room" */
  insert_room?: Maybe<Room_Mutation_Response>;
  /** insert data into the table: "room_invites" */
  insert_room_invites?: Maybe<Room_Invites_Mutation_Response>;
  /** insert a single row into the table: "room_invites" */
  insert_room_invites_one?: Maybe<Room_Invites>;
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
  /** update data of the table: "account" */
  update_account?: Maybe<Account_Mutation_Response>;
  /** update single row of the table: "account" */
  update_account_by_pk?: Maybe<Account>;
  /** update data of the table: "attachment" */
  update_attachment?: Maybe<Attachment_Mutation_Response>;
  /** update single row of the table: "attachment" */
  update_attachment_by_pk?: Maybe<Attachment>;
  /** update data of the table: "full_text_search" */
  update_full_text_search?: Maybe<Full_Text_Search_Mutation_Response>;
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
  /** update data of the table: "message_attachment" */
  update_message_attachment?: Maybe<Message_Attachment_Mutation_Response>;
  /** update single row of the table: "message_attachment" */
  update_message_attachment_by_pk?: Maybe<Message_Attachment>;
  /** update single row of the table: "message" */
  update_message_by_pk?: Maybe<Message>;
  /** update data of the table: "message_type" */
  update_message_type?: Maybe<Message_Type_Mutation_Response>;
  /** update single row of the table: "message_type" */
  update_message_type_by_pk?: Maybe<Message_Type>;
  /** update data of the table: "room" */
  update_room?: Maybe<Room_Mutation_Response>;
  /** update single row of the table: "room" */
  update_room_by_pk?: Maybe<Room>;
  /** update data of the table: "room_invites" */
  update_room_invites?: Maybe<Room_Invites_Mutation_Response>;
  /** update single row of the table: "room_invites" */
  update_room_invites_by_pk?: Maybe<Room_Invites>;
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
  /** perform the action: "upgrade_current_user" */
  upgrade_current_user?: Maybe<UpgradeUserResponse>;
};


/** mutation root */
export type Mutation_RootAccept_InviteArgs = {
  token: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_AccountArgs = {
  where: Account_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Account_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_AttachmentArgs = {
  where: Attachment_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Attachment_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Full_Text_SearchArgs = {
  where: Full_Text_Search_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Last_Seen_MessageArgs = {
  where: Last_Seen_Message_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Last_Seen_Message_By_PkArgs = {
  topic_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Membership_StatusArgs = {
  where: Membership_Status_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Membership_Status_By_PkArgs = {
  value: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_MessageArgs = {
  where: Message_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Message_AttachmentArgs = {
  where: Message_Attachment_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Message_Attachment_By_PkArgs = {
  attachment_id: Scalars['uuid'];
  message_id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Message_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Message_TypeArgs = {
  where: Message_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Message_Type_By_PkArgs = {
  value: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_RoomArgs = {
  where: Room_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Room_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Room_InvitesArgs = {
  where: Room_Invites_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Room_Invites_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Room_MemberArgs = {
  where: Room_Member_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Room_Member_By_PkArgs = {
  room_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_SpaceArgs = {
  where: Space_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Space_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Space_MemberArgs = {
  where: Space_Member_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Space_Member_By_PkArgs = {
  space_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_TeamArgs = {
  where: Team_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Team_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Team_InvitationArgs = {
  where: Team_Invitation_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Team_Invitation_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Team_MemberArgs = {
  where: Team_Member_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Team_Member_By_PkArgs = {
  team_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_TopicArgs = {
  where: Topic_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Topic_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Topic_MemberArgs = {
  where: Topic_Member_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Topic_Member_By_PkArgs = {
  topic_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_TranscriptionArgs = {
  where: Transcription_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Transcription_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Transcription_StatusArgs = {
  where: Transcription_Status_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Transcription_Status_By_PkArgs = {
  value: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_UserArgs = {
  where: User_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_User_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootInsert_AccountArgs = {
  objects: Array<Account_Insert_Input>;
  on_conflict?: Maybe<Account_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Account_OneArgs = {
  object: Account_Insert_Input;
  on_conflict?: Maybe<Account_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_AttachmentArgs = {
  objects: Array<Attachment_Insert_Input>;
  on_conflict?: Maybe<Attachment_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Attachment_OneArgs = {
  object: Attachment_Insert_Input;
  on_conflict?: Maybe<Attachment_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Full_Text_SearchArgs = {
  objects: Array<Full_Text_Search_Insert_Input>;
};


/** mutation root */
export type Mutation_RootInsert_Full_Text_Search_OneArgs = {
  object: Full_Text_Search_Insert_Input;
};


/** mutation root */
export type Mutation_RootInsert_Last_Seen_MessageArgs = {
  objects: Array<Last_Seen_Message_Insert_Input>;
  on_conflict?: Maybe<Last_Seen_Message_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Last_Seen_Message_OneArgs = {
  object: Last_Seen_Message_Insert_Input;
  on_conflict?: Maybe<Last_Seen_Message_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Membership_StatusArgs = {
  objects: Array<Membership_Status_Insert_Input>;
  on_conflict?: Maybe<Membership_Status_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Membership_Status_OneArgs = {
  object: Membership_Status_Insert_Input;
  on_conflict?: Maybe<Membership_Status_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_MessageArgs = {
  objects: Array<Message_Insert_Input>;
  on_conflict?: Maybe<Message_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Message_AttachmentArgs = {
  objects: Array<Message_Attachment_Insert_Input>;
  on_conflict?: Maybe<Message_Attachment_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Message_Attachment_OneArgs = {
  object: Message_Attachment_Insert_Input;
  on_conflict?: Maybe<Message_Attachment_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Message_OneArgs = {
  object: Message_Insert_Input;
  on_conflict?: Maybe<Message_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Message_TypeArgs = {
  objects: Array<Message_Type_Insert_Input>;
  on_conflict?: Maybe<Message_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Message_Type_OneArgs = {
  object: Message_Type_Insert_Input;
  on_conflict?: Maybe<Message_Type_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_RoomArgs = {
  objects: Array<Room_Insert_Input>;
  on_conflict?: Maybe<Room_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Room_InvitesArgs = {
  objects: Array<Room_Invites_Insert_Input>;
  on_conflict?: Maybe<Room_Invites_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Room_Invites_OneArgs = {
  object: Room_Invites_Insert_Input;
  on_conflict?: Maybe<Room_Invites_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Room_MemberArgs = {
  objects: Array<Room_Member_Insert_Input>;
  on_conflict?: Maybe<Room_Member_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Room_Member_OneArgs = {
  object: Room_Member_Insert_Input;
  on_conflict?: Maybe<Room_Member_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Room_OneArgs = {
  object: Room_Insert_Input;
  on_conflict?: Maybe<Room_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_SpaceArgs = {
  objects: Array<Space_Insert_Input>;
  on_conflict?: Maybe<Space_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Space_MemberArgs = {
  objects: Array<Space_Member_Insert_Input>;
  on_conflict?: Maybe<Space_Member_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Space_Member_OneArgs = {
  object: Space_Member_Insert_Input;
  on_conflict?: Maybe<Space_Member_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Space_OneArgs = {
  object: Space_Insert_Input;
  on_conflict?: Maybe<Space_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_TeamArgs = {
  objects: Array<Team_Insert_Input>;
  on_conflict?: Maybe<Team_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Team_InvitationArgs = {
  objects: Array<Team_Invitation_Insert_Input>;
  on_conflict?: Maybe<Team_Invitation_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Team_Invitation_OneArgs = {
  object: Team_Invitation_Insert_Input;
  on_conflict?: Maybe<Team_Invitation_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Team_MemberArgs = {
  objects: Array<Team_Member_Insert_Input>;
  on_conflict?: Maybe<Team_Member_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Team_Member_OneArgs = {
  object: Team_Member_Insert_Input;
  on_conflict?: Maybe<Team_Member_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Team_OneArgs = {
  object: Team_Insert_Input;
  on_conflict?: Maybe<Team_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_TopicArgs = {
  objects: Array<Topic_Insert_Input>;
  on_conflict?: Maybe<Topic_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Topic_MemberArgs = {
  objects: Array<Topic_Member_Insert_Input>;
  on_conflict?: Maybe<Topic_Member_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Topic_Member_OneArgs = {
  object: Topic_Member_Insert_Input;
  on_conflict?: Maybe<Topic_Member_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Topic_OneArgs = {
  object: Topic_Insert_Input;
  on_conflict?: Maybe<Topic_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_TranscriptionArgs = {
  objects: Array<Transcription_Insert_Input>;
  on_conflict?: Maybe<Transcription_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Transcription_OneArgs = {
  object: Transcription_Insert_Input;
  on_conflict?: Maybe<Transcription_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Transcription_StatusArgs = {
  objects: Array<Transcription_Status_Insert_Input>;
  on_conflict?: Maybe<Transcription_Status_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Transcription_Status_OneArgs = {
  object: Transcription_Status_Insert_Input;
  on_conflict?: Maybe<Transcription_Status_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_UserArgs = {
  objects: Array<User_Insert_Input>;
  on_conflict?: Maybe<User_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_User_OneArgs = {
  object: User_Insert_Input;
  on_conflict?: Maybe<User_On_Conflict>;
};


/** mutation root */
export type Mutation_RootUpdate_AccountArgs = {
  _set?: Maybe<Account_Set_Input>;
  where: Account_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Account_By_PkArgs = {
  _set?: Maybe<Account_Set_Input>;
  pk_columns: Account_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_AttachmentArgs = {
  _set?: Maybe<Attachment_Set_Input>;
  where: Attachment_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Attachment_By_PkArgs = {
  _set?: Maybe<Attachment_Set_Input>;
  pk_columns: Attachment_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Full_Text_SearchArgs = {
  _set?: Maybe<Full_Text_Search_Set_Input>;
  where: Full_Text_Search_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Last_Seen_MessageArgs = {
  _set?: Maybe<Last_Seen_Message_Set_Input>;
  where: Last_Seen_Message_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Last_Seen_Message_By_PkArgs = {
  _set?: Maybe<Last_Seen_Message_Set_Input>;
  pk_columns: Last_Seen_Message_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Membership_StatusArgs = {
  _set?: Maybe<Membership_Status_Set_Input>;
  where: Membership_Status_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Membership_Status_By_PkArgs = {
  _set?: Maybe<Membership_Status_Set_Input>;
  pk_columns: Membership_Status_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_MessageArgs = {
  _append?: Maybe<Message_Append_Input>;
  _delete_at_path?: Maybe<Message_Delete_At_Path_Input>;
  _delete_elem?: Maybe<Message_Delete_Elem_Input>;
  _delete_key?: Maybe<Message_Delete_Key_Input>;
  _prepend?: Maybe<Message_Prepend_Input>;
  _set?: Maybe<Message_Set_Input>;
  where: Message_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Message_AttachmentArgs = {
  _set?: Maybe<Message_Attachment_Set_Input>;
  where: Message_Attachment_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Message_Attachment_By_PkArgs = {
  _set?: Maybe<Message_Attachment_Set_Input>;
  pk_columns: Message_Attachment_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Message_By_PkArgs = {
  _append?: Maybe<Message_Append_Input>;
  _delete_at_path?: Maybe<Message_Delete_At_Path_Input>;
  _delete_elem?: Maybe<Message_Delete_Elem_Input>;
  _delete_key?: Maybe<Message_Delete_Key_Input>;
  _prepend?: Maybe<Message_Prepend_Input>;
  _set?: Maybe<Message_Set_Input>;
  pk_columns: Message_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Message_TypeArgs = {
  _set?: Maybe<Message_Type_Set_Input>;
  where: Message_Type_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Message_Type_By_PkArgs = {
  _set?: Maybe<Message_Type_Set_Input>;
  pk_columns: Message_Type_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_RoomArgs = {
  _set?: Maybe<Room_Set_Input>;
  where: Room_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Room_By_PkArgs = {
  _set?: Maybe<Room_Set_Input>;
  pk_columns: Room_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Room_InvitesArgs = {
  _set?: Maybe<Room_Invites_Set_Input>;
  where: Room_Invites_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Room_Invites_By_PkArgs = {
  _set?: Maybe<Room_Invites_Set_Input>;
  pk_columns: Room_Invites_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Room_MemberArgs = {
  _set?: Maybe<Room_Member_Set_Input>;
  where: Room_Member_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Room_Member_By_PkArgs = {
  _set?: Maybe<Room_Member_Set_Input>;
  pk_columns: Room_Member_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_SpaceArgs = {
  _set?: Maybe<Space_Set_Input>;
  where: Space_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Space_By_PkArgs = {
  _set?: Maybe<Space_Set_Input>;
  pk_columns: Space_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Space_MemberArgs = {
  _set?: Maybe<Space_Member_Set_Input>;
  where: Space_Member_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Space_Member_By_PkArgs = {
  _set?: Maybe<Space_Member_Set_Input>;
  pk_columns: Space_Member_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_TeamArgs = {
  _set?: Maybe<Team_Set_Input>;
  where: Team_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Team_By_PkArgs = {
  _set?: Maybe<Team_Set_Input>;
  pk_columns: Team_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Team_InvitationArgs = {
  _set?: Maybe<Team_Invitation_Set_Input>;
  where: Team_Invitation_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Team_Invitation_By_PkArgs = {
  _set?: Maybe<Team_Invitation_Set_Input>;
  pk_columns: Team_Invitation_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Team_MemberArgs = {
  _set?: Maybe<Team_Member_Set_Input>;
  where: Team_Member_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Team_Member_By_PkArgs = {
  _set?: Maybe<Team_Member_Set_Input>;
  pk_columns: Team_Member_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_TopicArgs = {
  _set?: Maybe<Topic_Set_Input>;
  where: Topic_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Topic_By_PkArgs = {
  _set?: Maybe<Topic_Set_Input>;
  pk_columns: Topic_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Topic_MemberArgs = {
  _set?: Maybe<Topic_Member_Set_Input>;
  where: Topic_Member_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Topic_Member_By_PkArgs = {
  _set?: Maybe<Topic_Member_Set_Input>;
  pk_columns: Topic_Member_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_TranscriptionArgs = {
  _append?: Maybe<Transcription_Append_Input>;
  _delete_at_path?: Maybe<Transcription_Delete_At_Path_Input>;
  _delete_elem?: Maybe<Transcription_Delete_Elem_Input>;
  _delete_key?: Maybe<Transcription_Delete_Key_Input>;
  _prepend?: Maybe<Transcription_Prepend_Input>;
  _set?: Maybe<Transcription_Set_Input>;
  where: Transcription_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Transcription_By_PkArgs = {
  _append?: Maybe<Transcription_Append_Input>;
  _delete_at_path?: Maybe<Transcription_Delete_At_Path_Input>;
  _delete_elem?: Maybe<Transcription_Delete_Elem_Input>;
  _delete_key?: Maybe<Transcription_Delete_Key_Input>;
  _prepend?: Maybe<Transcription_Prepend_Input>;
  _set?: Maybe<Transcription_Set_Input>;
  pk_columns: Transcription_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Transcription_StatusArgs = {
  _set?: Maybe<Transcription_Status_Set_Input>;
  where: Transcription_Status_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Transcription_Status_By_PkArgs = {
  _set?: Maybe<Transcription_Status_Set_Input>;
  pk_columns: Transcription_Status_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_UserArgs = {
  _set?: Maybe<User_Set_Input>;
  where: User_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_User_By_PkArgs = {
  _set?: Maybe<User_Set_Input>;
  pk_columns: User_Pk_Columns_Input;
};

/** column ordering options */
export enum Order_By {
  /** in the ascending order, nulls last */
  Asc = 'asc',
  /** in the ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in the ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in the descending order, nulls first */
  Desc = 'desc',
  /** in the descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in the descending order, nulls last */
  DescNullsLast = 'desc_nulls_last'
}

/** query root */
export type Query_Root = {
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
  /** fetch data from the table: "full_text_search" */
  full_text_search: Array<Full_Text_Search>;
  /** fetch aggregated fields from the table: "full_text_search" */
  full_text_search_aggregate: Full_Text_Search_Aggregate;
  /** perform the action: "get_download_url" */
  get_download_url?: Maybe<GetDownloadUrlResponse>;
  /** perform the action: "get_upload_url" */
  get_upload_url?: Maybe<GetUploadUrlResponse>;
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
  /** fetch data from the table: "message_attachment" */
  message_attachment: Array<Message_Attachment>;
  /** fetch aggregated fields from the table: "message_attachment" */
  message_attachment_aggregate: Message_Attachment_Aggregate;
  /** fetch data from the table: "message_attachment" using primary key columns */
  message_attachment_by_pk?: Maybe<Message_Attachment>;
  /** fetch data from the table: "message" using primary key columns */
  message_by_pk?: Maybe<Message>;
  /** fetch data from the table: "message_full_text" */
  message_full_text: Array<Message_Full_Text>;
  /** fetch aggregated fields from the table: "message_full_text" */
  message_full_text_aggregate: Message_Full_Text_Aggregate;
  /** fetch data from the table: "message_type" */
  message_type: Array<Message_Type>;
  /** fetch aggregated fields from the table: "message_type" */
  message_type_aggregate: Message_Type_Aggregate;
  /** fetch data from the table: "message_type" using primary key columns */
  message_type_by_pk?: Maybe<Message_Type>;
  /** fetch data from the table: "room" */
  room: Array<Room>;
  /** fetch aggregated fields from the table: "room" */
  room_aggregate: Room_Aggregate;
  /** fetch data from the table: "room" using primary key columns */
  room_by_pk?: Maybe<Room>;
  /** fetch data from the table: "room_invites" */
  room_invites: Array<Room_Invites>;
  /** fetch aggregated fields from the table: "room_invites" */
  room_invites_aggregate: Room_Invites_Aggregate;
  /** fetch data from the table: "room_invites" using primary key columns */
  room_invites_by_pk?: Maybe<Room_Invites>;
  /** fetch data from the table: "room_member" */
  room_member: Array<Room_Member>;
  /** fetch aggregated fields from the table: "room_member" */
  room_member_aggregate: Room_Member_Aggregate;
  /** fetch data from the table: "room_member" using primary key columns */
  room_member_by_pk?: Maybe<Room_Member>;
  /** execute function "search_full_text" which returns "full_text_search" */
  search_full_text: Array<Full_Text_Search>;
  /** execute function "search_full_text" and query aggregates on result of table type "full_text_search" */
  search_full_text_aggregate: Full_Text_Search_Aggregate;
  /** execute function "search_full_text_topic" which returns "full_text_search" */
  search_full_text_topic: Array<Full_Text_Search>;
  /** execute function "search_full_text_topic" and query aggregates on result of table type "full_text_search" */
  search_full_text_topic_aggregate: Full_Text_Search_Aggregate;
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
  /** fetch data from the table: "transcription_full_text" */
  transcription_full_text: Array<Transcription_Full_Text>;
  /** fetch aggregated fields from the table: "transcription_full_text" */
  transcription_full_text_aggregate: Transcription_Full_Text_Aggregate;
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
};


/** query root */
export type Query_RootAccountArgs = {
  distinct_on?: Maybe<Array<Account_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Account_Order_By>>;
  where?: Maybe<Account_Bool_Exp>;
};


/** query root */
export type Query_RootAccount_AggregateArgs = {
  distinct_on?: Maybe<Array<Account_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Account_Order_By>>;
  where?: Maybe<Account_Bool_Exp>;
};


/** query root */
export type Query_RootAccount_By_PkArgs = {
  id: Scalars['uuid'];
};


/** query root */
export type Query_RootAttachmentArgs = {
  distinct_on?: Maybe<Array<Attachment_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Attachment_Order_By>>;
  where?: Maybe<Attachment_Bool_Exp>;
};


/** query root */
export type Query_RootAttachment_AggregateArgs = {
  distinct_on?: Maybe<Array<Attachment_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Attachment_Order_By>>;
  where?: Maybe<Attachment_Bool_Exp>;
};


/** query root */
export type Query_RootAttachment_By_PkArgs = {
  id: Scalars['uuid'];
};


/** query root */
export type Query_RootFull_Text_SearchArgs = {
  distinct_on?: Maybe<Array<Full_Text_Search_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Full_Text_Search_Order_By>>;
  where?: Maybe<Full_Text_Search_Bool_Exp>;
};


/** query root */
export type Query_RootFull_Text_Search_AggregateArgs = {
  distinct_on?: Maybe<Array<Full_Text_Search_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Full_Text_Search_Order_By>>;
  where?: Maybe<Full_Text_Search_Bool_Exp>;
};


/** query root */
export type Query_RootGet_Download_UrlArgs = {
  uuid: Scalars['uuid'];
};


/** query root */
export type Query_RootGet_Upload_UrlArgs = {
  fileName: Scalars['String'];
  mimeType: Scalars['String'];
};


/** query root */
export type Query_RootLast_Seen_MessageArgs = {
  distinct_on?: Maybe<Array<Last_Seen_Message_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Last_Seen_Message_Order_By>>;
  where?: Maybe<Last_Seen_Message_Bool_Exp>;
};


/** query root */
export type Query_RootLast_Seen_Message_AggregateArgs = {
  distinct_on?: Maybe<Array<Last_Seen_Message_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Last_Seen_Message_Order_By>>;
  where?: Maybe<Last_Seen_Message_Bool_Exp>;
};


/** query root */
export type Query_RootLast_Seen_Message_By_PkArgs = {
  topic_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
};


/** query root */
export type Query_RootMembership_StatusArgs = {
  distinct_on?: Maybe<Array<Membership_Status_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Membership_Status_Order_By>>;
  where?: Maybe<Membership_Status_Bool_Exp>;
};


/** query root */
export type Query_RootMembership_Status_AggregateArgs = {
  distinct_on?: Maybe<Array<Membership_Status_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Membership_Status_Order_By>>;
  where?: Maybe<Membership_Status_Bool_Exp>;
};


/** query root */
export type Query_RootMembership_Status_By_PkArgs = {
  value: Scalars['String'];
};


/** query root */
export type Query_RootMessageArgs = {
  distinct_on?: Maybe<Array<Message_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Message_Order_By>>;
  where?: Maybe<Message_Bool_Exp>;
};


/** query root */
export type Query_RootMessage_AggregateArgs = {
  distinct_on?: Maybe<Array<Message_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Message_Order_By>>;
  where?: Maybe<Message_Bool_Exp>;
};


/** query root */
export type Query_RootMessage_AttachmentArgs = {
  distinct_on?: Maybe<Array<Message_Attachment_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Message_Attachment_Order_By>>;
  where?: Maybe<Message_Attachment_Bool_Exp>;
};


/** query root */
export type Query_RootMessage_Attachment_AggregateArgs = {
  distinct_on?: Maybe<Array<Message_Attachment_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Message_Attachment_Order_By>>;
  where?: Maybe<Message_Attachment_Bool_Exp>;
};


/** query root */
export type Query_RootMessage_Attachment_By_PkArgs = {
  attachment_id: Scalars['uuid'];
  message_id: Scalars['uuid'];
};


/** query root */
export type Query_RootMessage_By_PkArgs = {
  id: Scalars['uuid'];
};


/** query root */
export type Query_RootMessage_Full_TextArgs = {
  distinct_on?: Maybe<Array<Message_Full_Text_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Message_Full_Text_Order_By>>;
  where?: Maybe<Message_Full_Text_Bool_Exp>;
};


/** query root */
export type Query_RootMessage_Full_Text_AggregateArgs = {
  distinct_on?: Maybe<Array<Message_Full_Text_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Message_Full_Text_Order_By>>;
  where?: Maybe<Message_Full_Text_Bool_Exp>;
};


/** query root */
export type Query_RootMessage_TypeArgs = {
  distinct_on?: Maybe<Array<Message_Type_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Message_Type_Order_By>>;
  where?: Maybe<Message_Type_Bool_Exp>;
};


/** query root */
export type Query_RootMessage_Type_AggregateArgs = {
  distinct_on?: Maybe<Array<Message_Type_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Message_Type_Order_By>>;
  where?: Maybe<Message_Type_Bool_Exp>;
};


/** query root */
export type Query_RootMessage_Type_By_PkArgs = {
  value: Scalars['String'];
};


/** query root */
export type Query_RootRoomArgs = {
  distinct_on?: Maybe<Array<Room_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Order_By>>;
  where?: Maybe<Room_Bool_Exp>;
};


/** query root */
export type Query_RootRoom_AggregateArgs = {
  distinct_on?: Maybe<Array<Room_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Order_By>>;
  where?: Maybe<Room_Bool_Exp>;
};


/** query root */
export type Query_RootRoom_By_PkArgs = {
  id: Scalars['uuid'];
};


/** query root */
export type Query_RootRoom_InvitesArgs = {
  distinct_on?: Maybe<Array<Room_Invites_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Invites_Order_By>>;
  where?: Maybe<Room_Invites_Bool_Exp>;
};


/** query root */
export type Query_RootRoom_Invites_AggregateArgs = {
  distinct_on?: Maybe<Array<Room_Invites_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Invites_Order_By>>;
  where?: Maybe<Room_Invites_Bool_Exp>;
};


/** query root */
export type Query_RootRoom_Invites_By_PkArgs = {
  id: Scalars['uuid'];
};


/** query root */
export type Query_RootRoom_MemberArgs = {
  distinct_on?: Maybe<Array<Room_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Member_Order_By>>;
  where?: Maybe<Room_Member_Bool_Exp>;
};


/** query root */
export type Query_RootRoom_Member_AggregateArgs = {
  distinct_on?: Maybe<Array<Room_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Member_Order_By>>;
  where?: Maybe<Room_Member_Bool_Exp>;
};


/** query root */
export type Query_RootRoom_Member_By_PkArgs = {
  room_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
};


/** query root */
export type Query_RootSearch_Full_TextArgs = {
  args: Search_Full_Text_Args;
  distinct_on?: Maybe<Array<Full_Text_Search_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Full_Text_Search_Order_By>>;
  where?: Maybe<Full_Text_Search_Bool_Exp>;
};


/** query root */
export type Query_RootSearch_Full_Text_AggregateArgs = {
  args: Search_Full_Text_Args;
  distinct_on?: Maybe<Array<Full_Text_Search_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Full_Text_Search_Order_By>>;
  where?: Maybe<Full_Text_Search_Bool_Exp>;
};


/** query root */
export type Query_RootSearch_Full_Text_TopicArgs = {
  args: Search_Full_Text_Topic_Args;
  distinct_on?: Maybe<Array<Full_Text_Search_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Full_Text_Search_Order_By>>;
  where?: Maybe<Full_Text_Search_Bool_Exp>;
};


/** query root */
export type Query_RootSearch_Full_Text_Topic_AggregateArgs = {
  args: Search_Full_Text_Topic_Args;
  distinct_on?: Maybe<Array<Full_Text_Search_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Full_Text_Search_Order_By>>;
  where?: Maybe<Full_Text_Search_Bool_Exp>;
};


/** query root */
export type Query_RootSpaceArgs = {
  distinct_on?: Maybe<Array<Space_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Space_Order_By>>;
  where?: Maybe<Space_Bool_Exp>;
};


/** query root */
export type Query_RootSpace_AggregateArgs = {
  distinct_on?: Maybe<Array<Space_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Space_Order_By>>;
  where?: Maybe<Space_Bool_Exp>;
};


/** query root */
export type Query_RootSpace_By_PkArgs = {
  id: Scalars['uuid'];
};


/** query root */
export type Query_RootSpace_MemberArgs = {
  distinct_on?: Maybe<Array<Space_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Space_Member_Order_By>>;
  where?: Maybe<Space_Member_Bool_Exp>;
};


/** query root */
export type Query_RootSpace_Member_AggregateArgs = {
  distinct_on?: Maybe<Array<Space_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Space_Member_Order_By>>;
  where?: Maybe<Space_Member_Bool_Exp>;
};


/** query root */
export type Query_RootSpace_Member_By_PkArgs = {
  space_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
};


/** query root */
export type Query_RootTeamArgs = {
  distinct_on?: Maybe<Array<Team_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Order_By>>;
  where?: Maybe<Team_Bool_Exp>;
};


/** query root */
export type Query_RootTeam_AggregateArgs = {
  distinct_on?: Maybe<Array<Team_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Order_By>>;
  where?: Maybe<Team_Bool_Exp>;
};


/** query root */
export type Query_RootTeam_By_PkArgs = {
  id: Scalars['uuid'];
};


/** query root */
export type Query_RootTeam_InvitationArgs = {
  distinct_on?: Maybe<Array<Team_Invitation_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Invitation_Order_By>>;
  where?: Maybe<Team_Invitation_Bool_Exp>;
};


/** query root */
export type Query_RootTeam_Invitation_AggregateArgs = {
  distinct_on?: Maybe<Array<Team_Invitation_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Invitation_Order_By>>;
  where?: Maybe<Team_Invitation_Bool_Exp>;
};


/** query root */
export type Query_RootTeam_Invitation_By_PkArgs = {
  id: Scalars['uuid'];
};


/** query root */
export type Query_RootTeam_MemberArgs = {
  distinct_on?: Maybe<Array<Team_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Member_Order_By>>;
  where?: Maybe<Team_Member_Bool_Exp>;
};


/** query root */
export type Query_RootTeam_Member_AggregateArgs = {
  distinct_on?: Maybe<Array<Team_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Member_Order_By>>;
  where?: Maybe<Team_Member_Bool_Exp>;
};


/** query root */
export type Query_RootTeam_Member_By_PkArgs = {
  team_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
};


/** query root */
export type Query_RootTopicArgs = {
  distinct_on?: Maybe<Array<Topic_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Topic_Order_By>>;
  where?: Maybe<Topic_Bool_Exp>;
};


/** query root */
export type Query_RootTopic_AggregateArgs = {
  distinct_on?: Maybe<Array<Topic_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Topic_Order_By>>;
  where?: Maybe<Topic_Bool_Exp>;
};


/** query root */
export type Query_RootTopic_By_PkArgs = {
  id: Scalars['uuid'];
};


/** query root */
export type Query_RootTopic_MemberArgs = {
  distinct_on?: Maybe<Array<Topic_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Topic_Member_Order_By>>;
  where?: Maybe<Topic_Member_Bool_Exp>;
};


/** query root */
export type Query_RootTopic_Member_AggregateArgs = {
  distinct_on?: Maybe<Array<Topic_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Topic_Member_Order_By>>;
  where?: Maybe<Topic_Member_Bool_Exp>;
};


/** query root */
export type Query_RootTopic_Member_By_PkArgs = {
  topic_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
};


/** query root */
export type Query_RootTranscriptionArgs = {
  distinct_on?: Maybe<Array<Transcription_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Transcription_Order_By>>;
  where?: Maybe<Transcription_Bool_Exp>;
};


/** query root */
export type Query_RootTranscription_AggregateArgs = {
  distinct_on?: Maybe<Array<Transcription_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Transcription_Order_By>>;
  where?: Maybe<Transcription_Bool_Exp>;
};


/** query root */
export type Query_RootTranscription_By_PkArgs = {
  id: Scalars['uuid'];
};


/** query root */
export type Query_RootTranscription_Full_TextArgs = {
  distinct_on?: Maybe<Array<Transcription_Full_Text_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Transcription_Full_Text_Order_By>>;
  where?: Maybe<Transcription_Full_Text_Bool_Exp>;
};


/** query root */
export type Query_RootTranscription_Full_Text_AggregateArgs = {
  distinct_on?: Maybe<Array<Transcription_Full_Text_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Transcription_Full_Text_Order_By>>;
  where?: Maybe<Transcription_Full_Text_Bool_Exp>;
};


/** query root */
export type Query_RootTranscription_StatusArgs = {
  distinct_on?: Maybe<Array<Transcription_Status_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Transcription_Status_Order_By>>;
  where?: Maybe<Transcription_Status_Bool_Exp>;
};


/** query root */
export type Query_RootTranscription_Status_AggregateArgs = {
  distinct_on?: Maybe<Array<Transcription_Status_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Transcription_Status_Order_By>>;
  where?: Maybe<Transcription_Status_Bool_Exp>;
};


/** query root */
export type Query_RootTranscription_Status_By_PkArgs = {
  value: Scalars['String'];
};


/** query root */
export type Query_RootUnread_MessagesArgs = {
  distinct_on?: Maybe<Array<Unread_Messages_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Unread_Messages_Order_By>>;
  where?: Maybe<Unread_Messages_Bool_Exp>;
};


/** query root */
export type Query_RootUnread_Messages_AggregateArgs = {
  distinct_on?: Maybe<Array<Unread_Messages_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Unread_Messages_Order_By>>;
  where?: Maybe<Unread_Messages_Bool_Exp>;
};


/** query root */
export type Query_RootUserArgs = {
  distinct_on?: Maybe<Array<User_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<User_Order_By>>;
  where?: Maybe<User_Bool_Exp>;
};


/** query root */
export type Query_RootUser_AggregateArgs = {
  distinct_on?: Maybe<Array<User_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<User_Order_By>>;
  where?: Maybe<User_Bool_Exp>;
};


/** query root */
export type Query_RootUser_By_PkArgs = {
  id: Scalars['uuid'];
};

/** columns and relationships of "room" */
export type Room = {
  __typename?: 'room';
  created_at: Scalars['timestamptz'];
  /** An object relationship */
  creator: User;
  creator_id: Scalars['uuid'];
  deadline: Scalars['timestamptz'];
  finished_at?: Maybe<Scalars['timestamptz']>;
  id: Scalars['uuid'];
  /** An array relationship */
  members: Array<Room_Member>;
  /** An aggregated array relationship */
  members_aggregate: Room_Member_Aggregate;
  name?: Maybe<Scalars['String']>;
  notification_job_id?: Maybe<Scalars['String']>;
  /** An array relationship */
  room_invites: Array<Room_Invites>;
  /** An aggregated array relationship */
  room_invites_aggregate: Room_Invites_Aggregate;
  slug: Scalars['String'];
  /** An object relationship */
  space?: Maybe<Space>;
  space_id?: Maybe<Scalars['uuid']>;
  summary?: Maybe<Scalars['String']>;
  /** An array relationship */
  topics: Array<Topic>;
  /** An aggregated array relationship */
  topics_aggregate: Topic_Aggregate;
};


/** columns and relationships of "room" */
export type RoomMembersArgs = {
  distinct_on?: Maybe<Array<Room_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Member_Order_By>>;
  where?: Maybe<Room_Member_Bool_Exp>;
};


/** columns and relationships of "room" */
export type RoomMembers_AggregateArgs = {
  distinct_on?: Maybe<Array<Room_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Member_Order_By>>;
  where?: Maybe<Room_Member_Bool_Exp>;
};


/** columns and relationships of "room" */
export type RoomRoom_InvitesArgs = {
  distinct_on?: Maybe<Array<Room_Invites_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Invites_Order_By>>;
  where?: Maybe<Room_Invites_Bool_Exp>;
};


/** columns and relationships of "room" */
export type RoomRoom_Invites_AggregateArgs = {
  distinct_on?: Maybe<Array<Room_Invites_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Invites_Order_By>>;
  where?: Maybe<Room_Invites_Bool_Exp>;
};


/** columns and relationships of "room" */
export type RoomTopicsArgs = {
  distinct_on?: Maybe<Array<Topic_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Topic_Order_By>>;
  where?: Maybe<Topic_Bool_Exp>;
};


/** columns and relationships of "room" */
export type RoomTopics_AggregateArgs = {
  distinct_on?: Maybe<Array<Topic_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Topic_Order_By>>;
  where?: Maybe<Topic_Bool_Exp>;
};

/** aggregated selection of "room" */
export type Room_Aggregate = {
  __typename?: 'room_aggregate';
  aggregate?: Maybe<Room_Aggregate_Fields>;
  nodes: Array<Room>;
};

/** aggregate fields of "room" */
export type Room_Aggregate_Fields = {
  __typename?: 'room_aggregate_fields';
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Room_Max_Fields>;
  min?: Maybe<Room_Min_Fields>;
};


/** aggregate fields of "room" */
export type Room_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Room_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "room" */
export type Room_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<Room_Max_Order_By>;
  min?: Maybe<Room_Min_Order_By>;
};

/** input type for inserting array relation for remote table "room" */
export type Room_Arr_Rel_Insert_Input = {
  data: Array<Room_Insert_Input>;
  on_conflict?: Maybe<Room_On_Conflict>;
};

/** Boolean expression to filter rows from the table "room". All fields are combined with a logical 'AND'. */
export type Room_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Room_Bool_Exp>>>;
  _not?: Maybe<Room_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Room_Bool_Exp>>>;
  created_at?: Maybe<Timestamptz_Comparison_Exp>;
  creator?: Maybe<User_Bool_Exp>;
  creator_id?: Maybe<Uuid_Comparison_Exp>;
  deadline?: Maybe<Timestamptz_Comparison_Exp>;
  finished_at?: Maybe<Timestamptz_Comparison_Exp>;
  id?: Maybe<Uuid_Comparison_Exp>;
  members?: Maybe<Room_Member_Bool_Exp>;
  name?: Maybe<String_Comparison_Exp>;
  notification_job_id?: Maybe<String_Comparison_Exp>;
  room_invites?: Maybe<Room_Invites_Bool_Exp>;
  slug?: Maybe<String_Comparison_Exp>;
  space?: Maybe<Space_Bool_Exp>;
  space_id?: Maybe<Uuid_Comparison_Exp>;
  summary?: Maybe<String_Comparison_Exp>;
  topics?: Maybe<Topic_Bool_Exp>;
};

/** unique or primary key constraints on table "room" */
export enum Room_Constraint {
  /** unique or primary key constraint */
  RoomPkey = 'room_pkey',
  /** unique or primary key constraint */
  RoomSlugSpaceIdKey = 'room_slug_space_id_key'
}

/** input type for inserting data into table "room" */
export type Room_Insert_Input = {
  created_at?: Maybe<Scalars['timestamptz']>;
  creator?: Maybe<User_Obj_Rel_Insert_Input>;
  creator_id?: Maybe<Scalars['uuid']>;
  deadline?: Maybe<Scalars['timestamptz']>;
  finished_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  members?: Maybe<Room_Member_Arr_Rel_Insert_Input>;
  name?: Maybe<Scalars['String']>;
  notification_job_id?: Maybe<Scalars['String']>;
  room_invites?: Maybe<Room_Invites_Arr_Rel_Insert_Input>;
  slug?: Maybe<Scalars['String']>;
  space?: Maybe<Space_Obj_Rel_Insert_Input>;
  space_id?: Maybe<Scalars['uuid']>;
  summary?: Maybe<Scalars['String']>;
  topics?: Maybe<Topic_Arr_Rel_Insert_Input>;
};

/** columns and relationships of "room_invites" */
export type Room_Invites = {
  __typename?: 'room_invites';
  code: Scalars['uuid'];
  created_at: Scalars['timestamptz'];
  email: Scalars['String'];
  id: Scalars['uuid'];
  /** An object relationship */
  inviter: User;
  inviter_id: Scalars['uuid'];
  /** An object relationship */
  room: Room;
  room_id: Scalars['uuid'];
  used_at?: Maybe<Scalars['timestamptz']>;
};

/** aggregated selection of "room_invites" */
export type Room_Invites_Aggregate = {
  __typename?: 'room_invites_aggregate';
  aggregate?: Maybe<Room_Invites_Aggregate_Fields>;
  nodes: Array<Room_Invites>;
};

/** aggregate fields of "room_invites" */
export type Room_Invites_Aggregate_Fields = {
  __typename?: 'room_invites_aggregate_fields';
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Room_Invites_Max_Fields>;
  min?: Maybe<Room_Invites_Min_Fields>;
};


/** aggregate fields of "room_invites" */
export type Room_Invites_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Room_Invites_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "room_invites" */
export type Room_Invites_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<Room_Invites_Max_Order_By>;
  min?: Maybe<Room_Invites_Min_Order_By>;
};

/** input type for inserting array relation for remote table "room_invites" */
export type Room_Invites_Arr_Rel_Insert_Input = {
  data: Array<Room_Invites_Insert_Input>;
  on_conflict?: Maybe<Room_Invites_On_Conflict>;
};

/** Boolean expression to filter rows from the table "room_invites". All fields are combined with a logical 'AND'. */
export type Room_Invites_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Room_Invites_Bool_Exp>>>;
  _not?: Maybe<Room_Invites_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Room_Invites_Bool_Exp>>>;
  code?: Maybe<Uuid_Comparison_Exp>;
  created_at?: Maybe<Timestamptz_Comparison_Exp>;
  email?: Maybe<String_Comparison_Exp>;
  id?: Maybe<Uuid_Comparison_Exp>;
  inviter?: Maybe<User_Bool_Exp>;
  inviter_id?: Maybe<Uuid_Comparison_Exp>;
  room?: Maybe<Room_Bool_Exp>;
  room_id?: Maybe<Uuid_Comparison_Exp>;
  used_at?: Maybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "room_invites" */
export enum Room_Invites_Constraint {
  /** unique or primary key constraint */
  RoomInvitesCodeKey = 'room_invites_code_key',
  /** unique or primary key constraint */
  RoomInvitesPkey = 'room_invites_pkey',
  /** unique or primary key constraint */
  RoomInvitesRoomIdEmailKey = 'room_invites_room_id_email_key'
}

/** input type for inserting data into table "room_invites" */
export type Room_Invites_Insert_Input = {
  code?: Maybe<Scalars['uuid']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  email?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  inviter?: Maybe<User_Obj_Rel_Insert_Input>;
  inviter_id?: Maybe<Scalars['uuid']>;
  room?: Maybe<Room_Obj_Rel_Insert_Input>;
  room_id?: Maybe<Scalars['uuid']>;
  used_at?: Maybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Room_Invites_Max_Fields = {
  __typename?: 'room_invites_max_fields';
  code?: Maybe<Scalars['uuid']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  email?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  inviter_id?: Maybe<Scalars['uuid']>;
  room_id?: Maybe<Scalars['uuid']>;
  used_at?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "room_invites" */
export type Room_Invites_Max_Order_By = {
  code?: Maybe<Order_By>;
  created_at?: Maybe<Order_By>;
  email?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  inviter_id?: Maybe<Order_By>;
  room_id?: Maybe<Order_By>;
  used_at?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Room_Invites_Min_Fields = {
  __typename?: 'room_invites_min_fields';
  code?: Maybe<Scalars['uuid']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  email?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  inviter_id?: Maybe<Scalars['uuid']>;
  room_id?: Maybe<Scalars['uuid']>;
  used_at?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "room_invites" */
export type Room_Invites_Min_Order_By = {
  code?: Maybe<Order_By>;
  created_at?: Maybe<Order_By>;
  email?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  inviter_id?: Maybe<Order_By>;
  room_id?: Maybe<Order_By>;
  used_at?: Maybe<Order_By>;
};

/** response of any mutation on the table "room_invites" */
export type Room_Invites_Mutation_Response = {
  __typename?: 'room_invites_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Room_Invites>;
};

/** input type for inserting object relation for remote table "room_invites" */
export type Room_Invites_Obj_Rel_Insert_Input = {
  data: Room_Invites_Insert_Input;
  on_conflict?: Maybe<Room_Invites_On_Conflict>;
};

/** on conflict condition type for table "room_invites" */
export type Room_Invites_On_Conflict = {
  constraint: Room_Invites_Constraint;
  update_columns: Array<Room_Invites_Update_Column>;
  where?: Maybe<Room_Invites_Bool_Exp>;
};

/** ordering options when selecting data from "room_invites" */
export type Room_Invites_Order_By = {
  code?: Maybe<Order_By>;
  created_at?: Maybe<Order_By>;
  email?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  inviter?: Maybe<User_Order_By>;
  inviter_id?: Maybe<Order_By>;
  room?: Maybe<Room_Order_By>;
  room_id?: Maybe<Order_By>;
  used_at?: Maybe<Order_By>;
};

/** primary key columns input for table: "room_invites" */
export type Room_Invites_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "room_invites" */
export enum Room_Invites_Select_Column {
  /** column name */
  Code = 'code',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Email = 'email',
  /** column name */
  Id = 'id',
  /** column name */
  InviterId = 'inviter_id',
  /** column name */
  RoomId = 'room_id',
  /** column name */
  UsedAt = 'used_at'
}

/** input type for updating data in table "room_invites" */
export type Room_Invites_Set_Input = {
  code?: Maybe<Scalars['uuid']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  email?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  inviter_id?: Maybe<Scalars['uuid']>;
  room_id?: Maybe<Scalars['uuid']>;
  used_at?: Maybe<Scalars['timestamptz']>;
};

/** update columns of table "room_invites" */
export enum Room_Invites_Update_Column {
  /** column name */
  Code = 'code',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Email = 'email',
  /** column name */
  Id = 'id',
  /** column name */
  InviterId = 'inviter_id',
  /** column name */
  RoomId = 'room_id',
  /** column name */
  UsedAt = 'used_at'
}

/** aggregate max on columns */
export type Room_Max_Fields = {
  __typename?: 'room_max_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  creator_id?: Maybe<Scalars['uuid']>;
  deadline?: Maybe<Scalars['timestamptz']>;
  finished_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  notification_job_id?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  space_id?: Maybe<Scalars['uuid']>;
  summary?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "room" */
export type Room_Max_Order_By = {
  created_at?: Maybe<Order_By>;
  creator_id?: Maybe<Order_By>;
  deadline?: Maybe<Order_By>;
  finished_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  name?: Maybe<Order_By>;
  notification_job_id?: Maybe<Order_By>;
  slug?: Maybe<Order_By>;
  space_id?: Maybe<Order_By>;
  summary?: Maybe<Order_By>;
};

/** columns and relationships of "room_member" */
export type Room_Member = {
  __typename?: 'room_member';
  /** An object relationship */
  room: Room;
  room_id: Scalars['uuid'];
  /** An object relationship */
  user: User;
  user_id: Scalars['uuid'];
};

/** aggregated selection of "room_member" */
export type Room_Member_Aggregate = {
  __typename?: 'room_member_aggregate';
  aggregate?: Maybe<Room_Member_Aggregate_Fields>;
  nodes: Array<Room_Member>;
};

/** aggregate fields of "room_member" */
export type Room_Member_Aggregate_Fields = {
  __typename?: 'room_member_aggregate_fields';
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Room_Member_Max_Fields>;
  min?: Maybe<Room_Member_Min_Fields>;
};


/** aggregate fields of "room_member" */
export type Room_Member_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Room_Member_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "room_member" */
export type Room_Member_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<Room_Member_Max_Order_By>;
  min?: Maybe<Room_Member_Min_Order_By>;
};

/** input type for inserting array relation for remote table "room_member" */
export type Room_Member_Arr_Rel_Insert_Input = {
  data: Array<Room_Member_Insert_Input>;
  on_conflict?: Maybe<Room_Member_On_Conflict>;
};

/** Boolean expression to filter rows from the table "room_member". All fields are combined with a logical 'AND'. */
export type Room_Member_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Room_Member_Bool_Exp>>>;
  _not?: Maybe<Room_Member_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Room_Member_Bool_Exp>>>;
  room?: Maybe<Room_Bool_Exp>;
  room_id?: Maybe<Uuid_Comparison_Exp>;
  user?: Maybe<User_Bool_Exp>;
  user_id?: Maybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "room_member" */
export enum Room_Member_Constraint {
  /** unique or primary key constraint */
  RoomParticipantsPkey = 'room_participants_pkey',
  /** unique or primary key constraint */
  RoomParticipantsRoomIdUserIdKey = 'room_participants_room_id_user_id_key'
}

/** input type for inserting data into table "room_member" */
export type Room_Member_Insert_Input = {
  room?: Maybe<Room_Obj_Rel_Insert_Input>;
  room_id?: Maybe<Scalars['uuid']>;
  user?: Maybe<User_Obj_Rel_Insert_Input>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Room_Member_Max_Fields = {
  __typename?: 'room_member_max_fields';
  room_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "room_member" */
export type Room_Member_Max_Order_By = {
  room_id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Room_Member_Min_Fields = {
  __typename?: 'room_member_min_fields';
  room_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "room_member" */
export type Room_Member_Min_Order_By = {
  room_id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** response of any mutation on the table "room_member" */
export type Room_Member_Mutation_Response = {
  __typename?: 'room_member_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Room_Member>;
};

/** input type for inserting object relation for remote table "room_member" */
export type Room_Member_Obj_Rel_Insert_Input = {
  data: Room_Member_Insert_Input;
  on_conflict?: Maybe<Room_Member_On_Conflict>;
};

/** on conflict condition type for table "room_member" */
export type Room_Member_On_Conflict = {
  constraint: Room_Member_Constraint;
  update_columns: Array<Room_Member_Update_Column>;
  where?: Maybe<Room_Member_Bool_Exp>;
};

/** ordering options when selecting data from "room_member" */
export type Room_Member_Order_By = {
  room?: Maybe<Room_Order_By>;
  room_id?: Maybe<Order_By>;
  user?: Maybe<User_Order_By>;
  user_id?: Maybe<Order_By>;
};

/** primary key columns input for table: "room_member" */
export type Room_Member_Pk_Columns_Input = {
  room_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
};

/** select columns of table "room_member" */
export enum Room_Member_Select_Column {
  /** column name */
  RoomId = 'room_id',
  /** column name */
  UserId = 'user_id'
}

/** input type for updating data in table "room_member" */
export type Room_Member_Set_Input = {
  room_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** update columns of table "room_member" */
export enum Room_Member_Update_Column {
  /** column name */
  RoomId = 'room_id',
  /** column name */
  UserId = 'user_id'
}

/** aggregate min on columns */
export type Room_Min_Fields = {
  __typename?: 'room_min_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  creator_id?: Maybe<Scalars['uuid']>;
  deadline?: Maybe<Scalars['timestamptz']>;
  finished_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  notification_job_id?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  space_id?: Maybe<Scalars['uuid']>;
  summary?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "room" */
export type Room_Min_Order_By = {
  created_at?: Maybe<Order_By>;
  creator_id?: Maybe<Order_By>;
  deadline?: Maybe<Order_By>;
  finished_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  name?: Maybe<Order_By>;
  notification_job_id?: Maybe<Order_By>;
  slug?: Maybe<Order_By>;
  space_id?: Maybe<Order_By>;
  summary?: Maybe<Order_By>;
};

/** response of any mutation on the table "room" */
export type Room_Mutation_Response = {
  __typename?: 'room_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Room>;
};

/** input type for inserting object relation for remote table "room" */
export type Room_Obj_Rel_Insert_Input = {
  data: Room_Insert_Input;
  on_conflict?: Maybe<Room_On_Conflict>;
};

/** on conflict condition type for table "room" */
export type Room_On_Conflict = {
  constraint: Room_Constraint;
  update_columns: Array<Room_Update_Column>;
  where?: Maybe<Room_Bool_Exp>;
};

/** ordering options when selecting data from "room" */
export type Room_Order_By = {
  created_at?: Maybe<Order_By>;
  creator?: Maybe<User_Order_By>;
  creator_id?: Maybe<Order_By>;
  deadline?: Maybe<Order_By>;
  finished_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  members_aggregate?: Maybe<Room_Member_Aggregate_Order_By>;
  name?: Maybe<Order_By>;
  notification_job_id?: Maybe<Order_By>;
  room_invites_aggregate?: Maybe<Room_Invites_Aggregate_Order_By>;
  slug?: Maybe<Order_By>;
  space?: Maybe<Space_Order_By>;
  space_id?: Maybe<Order_By>;
  summary?: Maybe<Order_By>;
  topics_aggregate?: Maybe<Topic_Aggregate_Order_By>;
};

/** primary key columns input for table: "room" */
export type Room_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "room" */
export enum Room_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CreatorId = 'creator_id',
  /** column name */
  Deadline = 'deadline',
  /** column name */
  FinishedAt = 'finished_at',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  NotificationJobId = 'notification_job_id',
  /** column name */
  Slug = 'slug',
  /** column name */
  SpaceId = 'space_id',
  /** column name */
  Summary = 'summary'
}

/** input type for updating data in table "room" */
export type Room_Set_Input = {
  created_at?: Maybe<Scalars['timestamptz']>;
  creator_id?: Maybe<Scalars['uuid']>;
  deadline?: Maybe<Scalars['timestamptz']>;
  finished_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  notification_job_id?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  space_id?: Maybe<Scalars['uuid']>;
  summary?: Maybe<Scalars['String']>;
};

/** update columns of table "room" */
export enum Room_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CreatorId = 'creator_id',
  /** column name */
  Deadline = 'deadline',
  /** column name */
  FinishedAt = 'finished_at',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  NotificationJobId = 'notification_job_id',
  /** column name */
  Slug = 'slug',
  /** column name */
  SpaceId = 'space_id',
  /** column name */
  Summary = 'summary'
}

export type Search_Full_Text_Args = {
  search?: Maybe<Scalars['String']>;
};

export type Search_Full_Text_Topic_Args = {
  search?: Maybe<Scalars['String']>;
};

/** columns and relationships of "space" */
export type Space = {
  __typename?: 'space';
  /** An object relationship */
  creator?: Maybe<User>;
  creator_id: Scalars['uuid'];
  id: Scalars['uuid'];
  /** An array relationship */
  members: Array<Space_Member>;
  /** An aggregated array relationship */
  members_aggregate: Space_Member_Aggregate;
  name: Scalars['String'];
  /** An array relationship */
  rooms: Array<Room>;
  /** An aggregated array relationship */
  rooms_aggregate: Room_Aggregate;
  slug: Scalars['String'];
  /** An object relationship */
  team: Team;
  team_id: Scalars['uuid'];
};


/** columns and relationships of "space" */
export type SpaceMembersArgs = {
  distinct_on?: Maybe<Array<Space_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Space_Member_Order_By>>;
  where?: Maybe<Space_Member_Bool_Exp>;
};


/** columns and relationships of "space" */
export type SpaceMembers_AggregateArgs = {
  distinct_on?: Maybe<Array<Space_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Space_Member_Order_By>>;
  where?: Maybe<Space_Member_Bool_Exp>;
};


/** columns and relationships of "space" */
export type SpaceRoomsArgs = {
  distinct_on?: Maybe<Array<Room_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Order_By>>;
  where?: Maybe<Room_Bool_Exp>;
};


/** columns and relationships of "space" */
export type SpaceRooms_AggregateArgs = {
  distinct_on?: Maybe<Array<Room_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Order_By>>;
  where?: Maybe<Room_Bool_Exp>;
};

/** aggregated selection of "space" */
export type Space_Aggregate = {
  __typename?: 'space_aggregate';
  aggregate?: Maybe<Space_Aggregate_Fields>;
  nodes: Array<Space>;
};

/** aggregate fields of "space" */
export type Space_Aggregate_Fields = {
  __typename?: 'space_aggregate_fields';
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Space_Max_Fields>;
  min?: Maybe<Space_Min_Fields>;
};


/** aggregate fields of "space" */
export type Space_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Space_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "space" */
export type Space_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<Space_Max_Order_By>;
  min?: Maybe<Space_Min_Order_By>;
};

/** input type for inserting array relation for remote table "space" */
export type Space_Arr_Rel_Insert_Input = {
  data: Array<Space_Insert_Input>;
  on_conflict?: Maybe<Space_On_Conflict>;
};

/** Boolean expression to filter rows from the table "space". All fields are combined with a logical 'AND'. */
export type Space_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Space_Bool_Exp>>>;
  _not?: Maybe<Space_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Space_Bool_Exp>>>;
  creator?: Maybe<User_Bool_Exp>;
  creator_id?: Maybe<Uuid_Comparison_Exp>;
  id?: Maybe<Uuid_Comparison_Exp>;
  members?: Maybe<Space_Member_Bool_Exp>;
  name?: Maybe<String_Comparison_Exp>;
  rooms?: Maybe<Room_Bool_Exp>;
  slug?: Maybe<String_Comparison_Exp>;
  team?: Maybe<Team_Bool_Exp>;
  team_id?: Maybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "space" */
export enum Space_Constraint {
  /** unique or primary key constraint */
  SpacePkey = 'space_pkey',
  /** unique or primary key constraint */
  SpaceTeamIdSlugKey = 'space_team_id_slug_key'
}

/** input type for inserting data into table "space" */
export type Space_Insert_Input = {
  creator?: Maybe<User_Obj_Rel_Insert_Input>;
  creator_id?: Maybe<Scalars['uuid']>;
  id?: Maybe<Scalars['uuid']>;
  members?: Maybe<Space_Member_Arr_Rel_Insert_Input>;
  name?: Maybe<Scalars['String']>;
  rooms?: Maybe<Room_Arr_Rel_Insert_Input>;
  slug?: Maybe<Scalars['String']>;
  team?: Maybe<Team_Obj_Rel_Insert_Input>;
  team_id?: Maybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Space_Max_Fields = {
  __typename?: 'space_max_fields';
  creator_id?: Maybe<Scalars['uuid']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  team_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "space" */
export type Space_Max_Order_By = {
  creator_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  name?: Maybe<Order_By>;
  slug?: Maybe<Order_By>;
  team_id?: Maybe<Order_By>;
};

/** columns and relationships of "space_member" */
export type Space_Member = {
  __typename?: 'space_member';
  /** An object relationship */
  space: Space;
  space_id: Scalars['uuid'];
  /** An object relationship */
  user: User;
  user_id: Scalars['uuid'];
};

/** aggregated selection of "space_member" */
export type Space_Member_Aggregate = {
  __typename?: 'space_member_aggregate';
  aggregate?: Maybe<Space_Member_Aggregate_Fields>;
  nodes: Array<Space_Member>;
};

/** aggregate fields of "space_member" */
export type Space_Member_Aggregate_Fields = {
  __typename?: 'space_member_aggregate_fields';
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Space_Member_Max_Fields>;
  min?: Maybe<Space_Member_Min_Fields>;
};


/** aggregate fields of "space_member" */
export type Space_Member_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Space_Member_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "space_member" */
export type Space_Member_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<Space_Member_Max_Order_By>;
  min?: Maybe<Space_Member_Min_Order_By>;
};

/** input type for inserting array relation for remote table "space_member" */
export type Space_Member_Arr_Rel_Insert_Input = {
  data: Array<Space_Member_Insert_Input>;
  on_conflict?: Maybe<Space_Member_On_Conflict>;
};

/** Boolean expression to filter rows from the table "space_member". All fields are combined with a logical 'AND'. */
export type Space_Member_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Space_Member_Bool_Exp>>>;
  _not?: Maybe<Space_Member_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Space_Member_Bool_Exp>>>;
  space?: Maybe<Space_Bool_Exp>;
  space_id?: Maybe<Uuid_Comparison_Exp>;
  user?: Maybe<User_Bool_Exp>;
  user_id?: Maybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "space_member" */
export enum Space_Member_Constraint {
  /** unique or primary key constraint */
  SpaceParticipantsPkey = 'space_participants_pkey'
}

/** input type for inserting data into table "space_member" */
export type Space_Member_Insert_Input = {
  space?: Maybe<Space_Obj_Rel_Insert_Input>;
  space_id?: Maybe<Scalars['uuid']>;
  user?: Maybe<User_Obj_Rel_Insert_Input>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Space_Member_Max_Fields = {
  __typename?: 'space_member_max_fields';
  space_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "space_member" */
export type Space_Member_Max_Order_By = {
  space_id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Space_Member_Min_Fields = {
  __typename?: 'space_member_min_fields';
  space_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "space_member" */
export type Space_Member_Min_Order_By = {
  space_id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** response of any mutation on the table "space_member" */
export type Space_Member_Mutation_Response = {
  __typename?: 'space_member_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Space_Member>;
};

/** input type for inserting object relation for remote table "space_member" */
export type Space_Member_Obj_Rel_Insert_Input = {
  data: Space_Member_Insert_Input;
  on_conflict?: Maybe<Space_Member_On_Conflict>;
};

/** on conflict condition type for table "space_member" */
export type Space_Member_On_Conflict = {
  constraint: Space_Member_Constraint;
  update_columns: Array<Space_Member_Update_Column>;
  where?: Maybe<Space_Member_Bool_Exp>;
};

/** ordering options when selecting data from "space_member" */
export type Space_Member_Order_By = {
  space?: Maybe<Space_Order_By>;
  space_id?: Maybe<Order_By>;
  user?: Maybe<User_Order_By>;
  user_id?: Maybe<Order_By>;
};

/** primary key columns input for table: "space_member" */
export type Space_Member_Pk_Columns_Input = {
  space_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
};

/** select columns of table "space_member" */
export enum Space_Member_Select_Column {
  /** column name */
  SpaceId = 'space_id',
  /** column name */
  UserId = 'user_id'
}

/** input type for updating data in table "space_member" */
export type Space_Member_Set_Input = {
  space_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** update columns of table "space_member" */
export enum Space_Member_Update_Column {
  /** column name */
  SpaceId = 'space_id',
  /** column name */
  UserId = 'user_id'
}

/** aggregate min on columns */
export type Space_Min_Fields = {
  __typename?: 'space_min_fields';
  creator_id?: Maybe<Scalars['uuid']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  team_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "space" */
export type Space_Min_Order_By = {
  creator_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  name?: Maybe<Order_By>;
  slug?: Maybe<Order_By>;
  team_id?: Maybe<Order_By>;
};

/** response of any mutation on the table "space" */
export type Space_Mutation_Response = {
  __typename?: 'space_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Space>;
};

/** input type for inserting object relation for remote table "space" */
export type Space_Obj_Rel_Insert_Input = {
  data: Space_Insert_Input;
  on_conflict?: Maybe<Space_On_Conflict>;
};

/** on conflict condition type for table "space" */
export type Space_On_Conflict = {
  constraint: Space_Constraint;
  update_columns: Array<Space_Update_Column>;
  where?: Maybe<Space_Bool_Exp>;
};

/** ordering options when selecting data from "space" */
export type Space_Order_By = {
  creator?: Maybe<User_Order_By>;
  creator_id?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  members_aggregate?: Maybe<Space_Member_Aggregate_Order_By>;
  name?: Maybe<Order_By>;
  rooms_aggregate?: Maybe<Room_Aggregate_Order_By>;
  slug?: Maybe<Order_By>;
  team?: Maybe<Team_Order_By>;
  team_id?: Maybe<Order_By>;
};

/** primary key columns input for table: "space" */
export type Space_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "space" */
export enum Space_Select_Column {
  /** column name */
  CreatorId = 'creator_id',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  Slug = 'slug',
  /** column name */
  TeamId = 'team_id'
}

/** input type for updating data in table "space" */
export type Space_Set_Input = {
  creator_id?: Maybe<Scalars['uuid']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  team_id?: Maybe<Scalars['uuid']>;
};

/** update columns of table "space" */
export enum Space_Update_Column {
  /** column name */
  CreatorId = 'creator_id',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  Slug = 'slug',
  /** column name */
  TeamId = 'team_id'
}

/** subscription root */
export type Subscription_Root = {
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
  /** fetch data from the table: "full_text_search" */
  full_text_search: Array<Full_Text_Search>;
  /** fetch aggregated fields from the table: "full_text_search" */
  full_text_search_aggregate: Full_Text_Search_Aggregate;
  /** perform the action: "get_download_url" */
  get_download_url?: Maybe<GetDownloadUrlResponse>;
  /** perform the action: "get_upload_url" */
  get_upload_url?: Maybe<GetUploadUrlResponse>;
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
  /** fetch data from the table: "message_attachment" */
  message_attachment: Array<Message_Attachment>;
  /** fetch aggregated fields from the table: "message_attachment" */
  message_attachment_aggregate: Message_Attachment_Aggregate;
  /** fetch data from the table: "message_attachment" using primary key columns */
  message_attachment_by_pk?: Maybe<Message_Attachment>;
  /** fetch data from the table: "message" using primary key columns */
  message_by_pk?: Maybe<Message>;
  /** fetch data from the table: "message_full_text" */
  message_full_text: Array<Message_Full_Text>;
  /** fetch aggregated fields from the table: "message_full_text" */
  message_full_text_aggregate: Message_Full_Text_Aggregate;
  /** fetch data from the table: "message_type" */
  message_type: Array<Message_Type>;
  /** fetch aggregated fields from the table: "message_type" */
  message_type_aggregate: Message_Type_Aggregate;
  /** fetch data from the table: "message_type" using primary key columns */
  message_type_by_pk?: Maybe<Message_Type>;
  /** fetch data from the table: "room" */
  room: Array<Room>;
  /** fetch aggregated fields from the table: "room" */
  room_aggregate: Room_Aggregate;
  /** fetch data from the table: "room" using primary key columns */
  room_by_pk?: Maybe<Room>;
  /** fetch data from the table: "room_invites" */
  room_invites: Array<Room_Invites>;
  /** fetch aggregated fields from the table: "room_invites" */
  room_invites_aggregate: Room_Invites_Aggregate;
  /** fetch data from the table: "room_invites" using primary key columns */
  room_invites_by_pk?: Maybe<Room_Invites>;
  /** fetch data from the table: "room_member" */
  room_member: Array<Room_Member>;
  /** fetch aggregated fields from the table: "room_member" */
  room_member_aggregate: Room_Member_Aggregate;
  /** fetch data from the table: "room_member" using primary key columns */
  room_member_by_pk?: Maybe<Room_Member>;
  /** execute function "search_full_text" which returns "full_text_search" */
  search_full_text: Array<Full_Text_Search>;
  /** execute function "search_full_text" and query aggregates on result of table type "full_text_search" */
  search_full_text_aggregate: Full_Text_Search_Aggregate;
  /** execute function "search_full_text_topic" which returns "full_text_search" */
  search_full_text_topic: Array<Full_Text_Search>;
  /** execute function "search_full_text_topic" and query aggregates on result of table type "full_text_search" */
  search_full_text_topic_aggregate: Full_Text_Search_Aggregate;
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
  /** fetch data from the table: "transcription_full_text" */
  transcription_full_text: Array<Transcription_Full_Text>;
  /** fetch aggregated fields from the table: "transcription_full_text" */
  transcription_full_text_aggregate: Transcription_Full_Text_Aggregate;
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
};


/** subscription root */
export type Subscription_RootAccountArgs = {
  distinct_on?: Maybe<Array<Account_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Account_Order_By>>;
  where?: Maybe<Account_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootAccount_AggregateArgs = {
  distinct_on?: Maybe<Array<Account_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Account_Order_By>>;
  where?: Maybe<Account_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootAccount_By_PkArgs = {
  id: Scalars['uuid'];
};


/** subscription root */
export type Subscription_RootAttachmentArgs = {
  distinct_on?: Maybe<Array<Attachment_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Attachment_Order_By>>;
  where?: Maybe<Attachment_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootAttachment_AggregateArgs = {
  distinct_on?: Maybe<Array<Attachment_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Attachment_Order_By>>;
  where?: Maybe<Attachment_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootAttachment_By_PkArgs = {
  id: Scalars['uuid'];
};


/** subscription root */
export type Subscription_RootFull_Text_SearchArgs = {
  distinct_on?: Maybe<Array<Full_Text_Search_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Full_Text_Search_Order_By>>;
  where?: Maybe<Full_Text_Search_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootFull_Text_Search_AggregateArgs = {
  distinct_on?: Maybe<Array<Full_Text_Search_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Full_Text_Search_Order_By>>;
  where?: Maybe<Full_Text_Search_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootGet_Download_UrlArgs = {
  uuid: Scalars['uuid'];
};


/** subscription root */
export type Subscription_RootGet_Upload_UrlArgs = {
  fileName: Scalars['String'];
  mimeType: Scalars['String'];
};


/** subscription root */
export type Subscription_RootLast_Seen_MessageArgs = {
  distinct_on?: Maybe<Array<Last_Seen_Message_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Last_Seen_Message_Order_By>>;
  where?: Maybe<Last_Seen_Message_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootLast_Seen_Message_AggregateArgs = {
  distinct_on?: Maybe<Array<Last_Seen_Message_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Last_Seen_Message_Order_By>>;
  where?: Maybe<Last_Seen_Message_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootLast_Seen_Message_By_PkArgs = {
  topic_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
};


/** subscription root */
export type Subscription_RootMembership_StatusArgs = {
  distinct_on?: Maybe<Array<Membership_Status_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Membership_Status_Order_By>>;
  where?: Maybe<Membership_Status_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootMembership_Status_AggregateArgs = {
  distinct_on?: Maybe<Array<Membership_Status_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Membership_Status_Order_By>>;
  where?: Maybe<Membership_Status_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootMembership_Status_By_PkArgs = {
  value: Scalars['String'];
};


/** subscription root */
export type Subscription_RootMessageArgs = {
  distinct_on?: Maybe<Array<Message_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Message_Order_By>>;
  where?: Maybe<Message_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootMessage_AggregateArgs = {
  distinct_on?: Maybe<Array<Message_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Message_Order_By>>;
  where?: Maybe<Message_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootMessage_AttachmentArgs = {
  distinct_on?: Maybe<Array<Message_Attachment_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Message_Attachment_Order_By>>;
  where?: Maybe<Message_Attachment_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootMessage_Attachment_AggregateArgs = {
  distinct_on?: Maybe<Array<Message_Attachment_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Message_Attachment_Order_By>>;
  where?: Maybe<Message_Attachment_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootMessage_Attachment_By_PkArgs = {
  attachment_id: Scalars['uuid'];
  message_id: Scalars['uuid'];
};


/** subscription root */
export type Subscription_RootMessage_By_PkArgs = {
  id: Scalars['uuid'];
};


/** subscription root */
export type Subscription_RootMessage_Full_TextArgs = {
  distinct_on?: Maybe<Array<Message_Full_Text_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Message_Full_Text_Order_By>>;
  where?: Maybe<Message_Full_Text_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootMessage_Full_Text_AggregateArgs = {
  distinct_on?: Maybe<Array<Message_Full_Text_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Message_Full_Text_Order_By>>;
  where?: Maybe<Message_Full_Text_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootMessage_TypeArgs = {
  distinct_on?: Maybe<Array<Message_Type_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Message_Type_Order_By>>;
  where?: Maybe<Message_Type_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootMessage_Type_AggregateArgs = {
  distinct_on?: Maybe<Array<Message_Type_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Message_Type_Order_By>>;
  where?: Maybe<Message_Type_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootMessage_Type_By_PkArgs = {
  value: Scalars['String'];
};


/** subscription root */
export type Subscription_RootRoomArgs = {
  distinct_on?: Maybe<Array<Room_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Order_By>>;
  where?: Maybe<Room_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootRoom_AggregateArgs = {
  distinct_on?: Maybe<Array<Room_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Order_By>>;
  where?: Maybe<Room_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootRoom_By_PkArgs = {
  id: Scalars['uuid'];
};


/** subscription root */
export type Subscription_RootRoom_InvitesArgs = {
  distinct_on?: Maybe<Array<Room_Invites_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Invites_Order_By>>;
  where?: Maybe<Room_Invites_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootRoom_Invites_AggregateArgs = {
  distinct_on?: Maybe<Array<Room_Invites_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Invites_Order_By>>;
  where?: Maybe<Room_Invites_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootRoom_Invites_By_PkArgs = {
  id: Scalars['uuid'];
};


/** subscription root */
export type Subscription_RootRoom_MemberArgs = {
  distinct_on?: Maybe<Array<Room_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Member_Order_By>>;
  where?: Maybe<Room_Member_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootRoom_Member_AggregateArgs = {
  distinct_on?: Maybe<Array<Room_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Member_Order_By>>;
  where?: Maybe<Room_Member_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootRoom_Member_By_PkArgs = {
  room_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
};


/** subscription root */
export type Subscription_RootSearch_Full_TextArgs = {
  args: Search_Full_Text_Args;
  distinct_on?: Maybe<Array<Full_Text_Search_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Full_Text_Search_Order_By>>;
  where?: Maybe<Full_Text_Search_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootSearch_Full_Text_AggregateArgs = {
  args: Search_Full_Text_Args;
  distinct_on?: Maybe<Array<Full_Text_Search_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Full_Text_Search_Order_By>>;
  where?: Maybe<Full_Text_Search_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootSearch_Full_Text_TopicArgs = {
  args: Search_Full_Text_Topic_Args;
  distinct_on?: Maybe<Array<Full_Text_Search_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Full_Text_Search_Order_By>>;
  where?: Maybe<Full_Text_Search_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootSearch_Full_Text_Topic_AggregateArgs = {
  args: Search_Full_Text_Topic_Args;
  distinct_on?: Maybe<Array<Full_Text_Search_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Full_Text_Search_Order_By>>;
  where?: Maybe<Full_Text_Search_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootSpaceArgs = {
  distinct_on?: Maybe<Array<Space_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Space_Order_By>>;
  where?: Maybe<Space_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootSpace_AggregateArgs = {
  distinct_on?: Maybe<Array<Space_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Space_Order_By>>;
  where?: Maybe<Space_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootSpace_By_PkArgs = {
  id: Scalars['uuid'];
};


/** subscription root */
export type Subscription_RootSpace_MemberArgs = {
  distinct_on?: Maybe<Array<Space_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Space_Member_Order_By>>;
  where?: Maybe<Space_Member_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootSpace_Member_AggregateArgs = {
  distinct_on?: Maybe<Array<Space_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Space_Member_Order_By>>;
  where?: Maybe<Space_Member_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootSpace_Member_By_PkArgs = {
  space_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
};


/** subscription root */
export type Subscription_RootTeamArgs = {
  distinct_on?: Maybe<Array<Team_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Order_By>>;
  where?: Maybe<Team_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootTeam_AggregateArgs = {
  distinct_on?: Maybe<Array<Team_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Order_By>>;
  where?: Maybe<Team_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootTeam_By_PkArgs = {
  id: Scalars['uuid'];
};


/** subscription root */
export type Subscription_RootTeam_InvitationArgs = {
  distinct_on?: Maybe<Array<Team_Invitation_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Invitation_Order_By>>;
  where?: Maybe<Team_Invitation_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootTeam_Invitation_AggregateArgs = {
  distinct_on?: Maybe<Array<Team_Invitation_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Invitation_Order_By>>;
  where?: Maybe<Team_Invitation_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootTeam_Invitation_By_PkArgs = {
  id: Scalars['uuid'];
};


/** subscription root */
export type Subscription_RootTeam_MemberArgs = {
  distinct_on?: Maybe<Array<Team_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Member_Order_By>>;
  where?: Maybe<Team_Member_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootTeam_Member_AggregateArgs = {
  distinct_on?: Maybe<Array<Team_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Member_Order_By>>;
  where?: Maybe<Team_Member_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootTeam_Member_By_PkArgs = {
  team_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
};


/** subscription root */
export type Subscription_RootTopicArgs = {
  distinct_on?: Maybe<Array<Topic_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Topic_Order_By>>;
  where?: Maybe<Topic_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootTopic_AggregateArgs = {
  distinct_on?: Maybe<Array<Topic_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Topic_Order_By>>;
  where?: Maybe<Topic_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootTopic_By_PkArgs = {
  id: Scalars['uuid'];
};


/** subscription root */
export type Subscription_RootTopic_MemberArgs = {
  distinct_on?: Maybe<Array<Topic_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Topic_Member_Order_By>>;
  where?: Maybe<Topic_Member_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootTopic_Member_AggregateArgs = {
  distinct_on?: Maybe<Array<Topic_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Topic_Member_Order_By>>;
  where?: Maybe<Topic_Member_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootTopic_Member_By_PkArgs = {
  topic_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
};


/** subscription root */
export type Subscription_RootTranscriptionArgs = {
  distinct_on?: Maybe<Array<Transcription_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Transcription_Order_By>>;
  where?: Maybe<Transcription_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootTranscription_AggregateArgs = {
  distinct_on?: Maybe<Array<Transcription_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Transcription_Order_By>>;
  where?: Maybe<Transcription_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootTranscription_By_PkArgs = {
  id: Scalars['uuid'];
};


/** subscription root */
export type Subscription_RootTranscription_Full_TextArgs = {
  distinct_on?: Maybe<Array<Transcription_Full_Text_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Transcription_Full_Text_Order_By>>;
  where?: Maybe<Transcription_Full_Text_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootTranscription_Full_Text_AggregateArgs = {
  distinct_on?: Maybe<Array<Transcription_Full_Text_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Transcription_Full_Text_Order_By>>;
  where?: Maybe<Transcription_Full_Text_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootTranscription_StatusArgs = {
  distinct_on?: Maybe<Array<Transcription_Status_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Transcription_Status_Order_By>>;
  where?: Maybe<Transcription_Status_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootTranscription_Status_AggregateArgs = {
  distinct_on?: Maybe<Array<Transcription_Status_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Transcription_Status_Order_By>>;
  where?: Maybe<Transcription_Status_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootTranscription_Status_By_PkArgs = {
  value: Scalars['String'];
};


/** subscription root */
export type Subscription_RootUnread_MessagesArgs = {
  distinct_on?: Maybe<Array<Unread_Messages_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Unread_Messages_Order_By>>;
  where?: Maybe<Unread_Messages_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootUnread_Messages_AggregateArgs = {
  distinct_on?: Maybe<Array<Unread_Messages_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Unread_Messages_Order_By>>;
  where?: Maybe<Unread_Messages_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootUserArgs = {
  distinct_on?: Maybe<Array<User_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<User_Order_By>>;
  where?: Maybe<User_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootUser_AggregateArgs = {
  distinct_on?: Maybe<Array<User_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<User_Order_By>>;
  where?: Maybe<User_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootUser_By_PkArgs = {
  id: Scalars['uuid'];
};

/** columns and relationships of "team" */
export type Team = {
  __typename?: 'team';
  id: Scalars['uuid'];
  /** An array relationship */
  invitations: Array<Team_Invitation>;
  /** An aggregated array relationship */
  invitations_aggregate: Team_Invitation_Aggregate;
  /** An array relationship */
  memberships: Array<Team_Member>;
  /** An aggregated array relationship */
  memberships_aggregate: Team_Member_Aggregate;
  name: Scalars['String'];
  /** An object relationship */
  owner: User;
  owner_id: Scalars['uuid'];
  slug: Scalars['String'];
  /** An array relationship */
  spaces: Array<Space>;
  /** An aggregated array relationship */
  spaces_aggregate: Space_Aggregate;
};


/** columns and relationships of "team" */
export type TeamInvitationsArgs = {
  distinct_on?: Maybe<Array<Team_Invitation_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Invitation_Order_By>>;
  where?: Maybe<Team_Invitation_Bool_Exp>;
};


/** columns and relationships of "team" */
export type TeamInvitations_AggregateArgs = {
  distinct_on?: Maybe<Array<Team_Invitation_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Invitation_Order_By>>;
  where?: Maybe<Team_Invitation_Bool_Exp>;
};


/** columns and relationships of "team" */
export type TeamMembershipsArgs = {
  distinct_on?: Maybe<Array<Team_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Member_Order_By>>;
  where?: Maybe<Team_Member_Bool_Exp>;
};


/** columns and relationships of "team" */
export type TeamMemberships_AggregateArgs = {
  distinct_on?: Maybe<Array<Team_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Member_Order_By>>;
  where?: Maybe<Team_Member_Bool_Exp>;
};


/** columns and relationships of "team" */
export type TeamSpacesArgs = {
  distinct_on?: Maybe<Array<Space_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Space_Order_By>>;
  where?: Maybe<Space_Bool_Exp>;
};


/** columns and relationships of "team" */
export type TeamSpaces_AggregateArgs = {
  distinct_on?: Maybe<Array<Space_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Space_Order_By>>;
  where?: Maybe<Space_Bool_Exp>;
};

/** aggregated selection of "team" */
export type Team_Aggregate = {
  __typename?: 'team_aggregate';
  aggregate?: Maybe<Team_Aggregate_Fields>;
  nodes: Array<Team>;
};

/** aggregate fields of "team" */
export type Team_Aggregate_Fields = {
  __typename?: 'team_aggregate_fields';
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Team_Max_Fields>;
  min?: Maybe<Team_Min_Fields>;
};


/** aggregate fields of "team" */
export type Team_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Team_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "team" */
export type Team_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<Team_Max_Order_By>;
  min?: Maybe<Team_Min_Order_By>;
};

/** input type for inserting array relation for remote table "team" */
export type Team_Arr_Rel_Insert_Input = {
  data: Array<Team_Insert_Input>;
  on_conflict?: Maybe<Team_On_Conflict>;
};

/** Boolean expression to filter rows from the table "team". All fields are combined with a logical 'AND'. */
export type Team_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Team_Bool_Exp>>>;
  _not?: Maybe<Team_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Team_Bool_Exp>>>;
  id?: Maybe<Uuid_Comparison_Exp>;
  invitations?: Maybe<Team_Invitation_Bool_Exp>;
  memberships?: Maybe<Team_Member_Bool_Exp>;
  name?: Maybe<String_Comparison_Exp>;
  owner?: Maybe<User_Bool_Exp>;
  owner_id?: Maybe<Uuid_Comparison_Exp>;
  slug?: Maybe<String_Comparison_Exp>;
  spaces?: Maybe<Space_Bool_Exp>;
};

/** unique or primary key constraints on table "team" */
export enum Team_Constraint {
  /** unique or primary key constraint */
  TeamIdKey = 'team_id_key',
  /** unique or primary key constraint */
  TeamPkey = 'team_pkey',
  /** unique or primary key constraint */
  TeamSlugKey = 'team_slug_key'
}

/** input type for inserting data into table "team" */
export type Team_Insert_Input = {
  id?: Maybe<Scalars['uuid']>;
  invitations?: Maybe<Team_Invitation_Arr_Rel_Insert_Input>;
  memberships?: Maybe<Team_Member_Arr_Rel_Insert_Input>;
  name?: Maybe<Scalars['String']>;
  owner?: Maybe<User_Obj_Rel_Insert_Input>;
  owner_id?: Maybe<Scalars['uuid']>;
  slug?: Maybe<Scalars['String']>;
  spaces?: Maybe<Space_Arr_Rel_Insert_Input>;
};

/** columns and relationships of "team_invitation" */
export type Team_Invitation = {
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
};

/** aggregated selection of "team_invitation" */
export type Team_Invitation_Aggregate = {
  __typename?: 'team_invitation_aggregate';
  aggregate?: Maybe<Team_Invitation_Aggregate_Fields>;
  nodes: Array<Team_Invitation>;
};

/** aggregate fields of "team_invitation" */
export type Team_Invitation_Aggregate_Fields = {
  __typename?: 'team_invitation_aggregate_fields';
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Team_Invitation_Max_Fields>;
  min?: Maybe<Team_Invitation_Min_Fields>;
};


/** aggregate fields of "team_invitation" */
export type Team_Invitation_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Team_Invitation_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "team_invitation" */
export type Team_Invitation_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<Team_Invitation_Max_Order_By>;
  min?: Maybe<Team_Invitation_Min_Order_By>;
};

/** input type for inserting array relation for remote table "team_invitation" */
export type Team_Invitation_Arr_Rel_Insert_Input = {
  data: Array<Team_Invitation_Insert_Input>;
  on_conflict?: Maybe<Team_Invitation_On_Conflict>;
};

/** Boolean expression to filter rows from the table "team_invitation". All fields are combined with a logical 'AND'. */
export type Team_Invitation_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Team_Invitation_Bool_Exp>>>;
  _not?: Maybe<Team_Invitation_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Team_Invitation_Bool_Exp>>>;
  created_at?: Maybe<Timestamptz_Comparison_Exp>;
  email?: Maybe<String_Comparison_Exp>;
  id?: Maybe<Uuid_Comparison_Exp>;
  inviting_user?: Maybe<User_Bool_Exp>;
  inviting_user_id?: Maybe<Uuid_Comparison_Exp>;
  team?: Maybe<Team_Bool_Exp>;
  team_id?: Maybe<Uuid_Comparison_Exp>;
  token?: Maybe<Uuid_Comparison_Exp>;
  used_at?: Maybe<Date_Comparison_Exp>;
};

/** unique or primary key constraints on table "team_invitation" */
export enum Team_Invitation_Constraint {
  /** unique or primary key constraint */
  TeamInvitationPkey = 'team_invitation_pkey',
  /** unique or primary key constraint */
  TeamInvitationTokenKey = 'team_invitation_token_key'
}

/** input type for inserting data into table "team_invitation" */
export type Team_Invitation_Insert_Input = {
  created_at?: Maybe<Scalars['timestamptz']>;
  email?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  inviting_user?: Maybe<User_Obj_Rel_Insert_Input>;
  inviting_user_id?: Maybe<Scalars['uuid']>;
  team?: Maybe<Team_Obj_Rel_Insert_Input>;
  team_id?: Maybe<Scalars['uuid']>;
  token?: Maybe<Scalars['uuid']>;
  used_at?: Maybe<Scalars['date']>;
};

/** aggregate max on columns */
export type Team_Invitation_Max_Fields = {
  __typename?: 'team_invitation_max_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  email?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  inviting_user_id?: Maybe<Scalars['uuid']>;
  team_id?: Maybe<Scalars['uuid']>;
  token?: Maybe<Scalars['uuid']>;
  used_at?: Maybe<Scalars['date']>;
};

/** order by max() on columns of table "team_invitation" */
export type Team_Invitation_Max_Order_By = {
  created_at?: Maybe<Order_By>;
  email?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  inviting_user_id?: Maybe<Order_By>;
  team_id?: Maybe<Order_By>;
  token?: Maybe<Order_By>;
  used_at?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Team_Invitation_Min_Fields = {
  __typename?: 'team_invitation_min_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  email?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  inviting_user_id?: Maybe<Scalars['uuid']>;
  team_id?: Maybe<Scalars['uuid']>;
  token?: Maybe<Scalars['uuid']>;
  used_at?: Maybe<Scalars['date']>;
};

/** order by min() on columns of table "team_invitation" */
export type Team_Invitation_Min_Order_By = {
  created_at?: Maybe<Order_By>;
  email?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  inviting_user_id?: Maybe<Order_By>;
  team_id?: Maybe<Order_By>;
  token?: Maybe<Order_By>;
  used_at?: Maybe<Order_By>;
};

/** response of any mutation on the table "team_invitation" */
export type Team_Invitation_Mutation_Response = {
  __typename?: 'team_invitation_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Team_Invitation>;
};

/** input type for inserting object relation for remote table "team_invitation" */
export type Team_Invitation_Obj_Rel_Insert_Input = {
  data: Team_Invitation_Insert_Input;
  on_conflict?: Maybe<Team_Invitation_On_Conflict>;
};

/** on conflict condition type for table "team_invitation" */
export type Team_Invitation_On_Conflict = {
  constraint: Team_Invitation_Constraint;
  update_columns: Array<Team_Invitation_Update_Column>;
  where?: Maybe<Team_Invitation_Bool_Exp>;
};

/** ordering options when selecting data from "team_invitation" */
export type Team_Invitation_Order_By = {
  created_at?: Maybe<Order_By>;
  email?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  inviting_user?: Maybe<User_Order_By>;
  inviting_user_id?: Maybe<Order_By>;
  team?: Maybe<Team_Order_By>;
  team_id?: Maybe<Order_By>;
  token?: Maybe<Order_By>;
  used_at?: Maybe<Order_By>;
};

/** primary key columns input for table: "team_invitation" */
export type Team_Invitation_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "team_invitation" */
export enum Team_Invitation_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Email = 'email',
  /** column name */
  Id = 'id',
  /** column name */
  InvitingUserId = 'inviting_user_id',
  /** column name */
  TeamId = 'team_id',
  /** column name */
  Token = 'token',
  /** column name */
  UsedAt = 'used_at'
}

/** input type for updating data in table "team_invitation" */
export type Team_Invitation_Set_Input = {
  created_at?: Maybe<Scalars['timestamptz']>;
  email?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  inviting_user_id?: Maybe<Scalars['uuid']>;
  team_id?: Maybe<Scalars['uuid']>;
  token?: Maybe<Scalars['uuid']>;
  used_at?: Maybe<Scalars['date']>;
};

/** update columns of table "team_invitation" */
export enum Team_Invitation_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Email = 'email',
  /** column name */
  Id = 'id',
  /** column name */
  InvitingUserId = 'inviting_user_id',
  /** column name */
  TeamId = 'team_id',
  /** column name */
  Token = 'token',
  /** column name */
  UsedAt = 'used_at'
}

/** aggregate max on columns */
export type Team_Max_Fields = {
  __typename?: 'team_max_fields';
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  owner_id?: Maybe<Scalars['uuid']>;
  slug?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "team" */
export type Team_Max_Order_By = {
  id?: Maybe<Order_By>;
  name?: Maybe<Order_By>;
  owner_id?: Maybe<Order_By>;
  slug?: Maybe<Order_By>;
};

/** columns and relationships of "team_member" */
export type Team_Member = {
  __typename?: 'team_member';
  /** An object relationship */
  team: Team;
  team_id: Scalars['uuid'];
  /** An object relationship */
  user: User;
  user_id: Scalars['uuid'];
};

/** aggregated selection of "team_member" */
export type Team_Member_Aggregate = {
  __typename?: 'team_member_aggregate';
  aggregate?: Maybe<Team_Member_Aggregate_Fields>;
  nodes: Array<Team_Member>;
};

/** aggregate fields of "team_member" */
export type Team_Member_Aggregate_Fields = {
  __typename?: 'team_member_aggregate_fields';
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Team_Member_Max_Fields>;
  min?: Maybe<Team_Member_Min_Fields>;
};


/** aggregate fields of "team_member" */
export type Team_Member_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Team_Member_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "team_member" */
export type Team_Member_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<Team_Member_Max_Order_By>;
  min?: Maybe<Team_Member_Min_Order_By>;
};

/** input type for inserting array relation for remote table "team_member" */
export type Team_Member_Arr_Rel_Insert_Input = {
  data: Array<Team_Member_Insert_Input>;
  on_conflict?: Maybe<Team_Member_On_Conflict>;
};

/** Boolean expression to filter rows from the table "team_member". All fields are combined with a logical 'AND'. */
export type Team_Member_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Team_Member_Bool_Exp>>>;
  _not?: Maybe<Team_Member_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Team_Member_Bool_Exp>>>;
  team?: Maybe<Team_Bool_Exp>;
  team_id?: Maybe<Uuid_Comparison_Exp>;
  user?: Maybe<User_Bool_Exp>;
  user_id?: Maybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "team_member" */
export enum Team_Member_Constraint {
  /** unique or primary key constraint */
  TeamMembershipPkey = 'team_membership_pkey'
}

/** input type for inserting data into table "team_member" */
export type Team_Member_Insert_Input = {
  team?: Maybe<Team_Obj_Rel_Insert_Input>;
  team_id?: Maybe<Scalars['uuid']>;
  user?: Maybe<User_Obj_Rel_Insert_Input>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Team_Member_Max_Fields = {
  __typename?: 'team_member_max_fields';
  team_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "team_member" */
export type Team_Member_Max_Order_By = {
  team_id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Team_Member_Min_Fields = {
  __typename?: 'team_member_min_fields';
  team_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "team_member" */
export type Team_Member_Min_Order_By = {
  team_id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** response of any mutation on the table "team_member" */
export type Team_Member_Mutation_Response = {
  __typename?: 'team_member_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Team_Member>;
};

/** input type for inserting object relation for remote table "team_member" */
export type Team_Member_Obj_Rel_Insert_Input = {
  data: Team_Member_Insert_Input;
  on_conflict?: Maybe<Team_Member_On_Conflict>;
};

/** on conflict condition type for table "team_member" */
export type Team_Member_On_Conflict = {
  constraint: Team_Member_Constraint;
  update_columns: Array<Team_Member_Update_Column>;
  where?: Maybe<Team_Member_Bool_Exp>;
};

/** ordering options when selecting data from "team_member" */
export type Team_Member_Order_By = {
  team?: Maybe<Team_Order_By>;
  team_id?: Maybe<Order_By>;
  user?: Maybe<User_Order_By>;
  user_id?: Maybe<Order_By>;
};

/** primary key columns input for table: "team_member" */
export type Team_Member_Pk_Columns_Input = {
  team_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
};

/** select columns of table "team_member" */
export enum Team_Member_Select_Column {
  /** column name */
  TeamId = 'team_id',
  /** column name */
  UserId = 'user_id'
}

/** input type for updating data in table "team_member" */
export type Team_Member_Set_Input = {
  team_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** update columns of table "team_member" */
export enum Team_Member_Update_Column {
  /** column name */
  TeamId = 'team_id',
  /** column name */
  UserId = 'user_id'
}

/** aggregate min on columns */
export type Team_Min_Fields = {
  __typename?: 'team_min_fields';
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  owner_id?: Maybe<Scalars['uuid']>;
  slug?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "team" */
export type Team_Min_Order_By = {
  id?: Maybe<Order_By>;
  name?: Maybe<Order_By>;
  owner_id?: Maybe<Order_By>;
  slug?: Maybe<Order_By>;
};

/** response of any mutation on the table "team" */
export type Team_Mutation_Response = {
  __typename?: 'team_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Team>;
};

/** input type for inserting object relation for remote table "team" */
export type Team_Obj_Rel_Insert_Input = {
  data: Team_Insert_Input;
  on_conflict?: Maybe<Team_On_Conflict>;
};

/** on conflict condition type for table "team" */
export type Team_On_Conflict = {
  constraint: Team_Constraint;
  update_columns: Array<Team_Update_Column>;
  where?: Maybe<Team_Bool_Exp>;
};

/** ordering options when selecting data from "team" */
export type Team_Order_By = {
  id?: Maybe<Order_By>;
  invitations_aggregate?: Maybe<Team_Invitation_Aggregate_Order_By>;
  memberships_aggregate?: Maybe<Team_Member_Aggregate_Order_By>;
  name?: Maybe<Order_By>;
  owner?: Maybe<User_Order_By>;
  owner_id?: Maybe<Order_By>;
  slug?: Maybe<Order_By>;
  spaces_aggregate?: Maybe<Space_Aggregate_Order_By>;
};

/** primary key columns input for table: "team" */
export type Team_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "team" */
export enum Team_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  OwnerId = 'owner_id',
  /** column name */
  Slug = 'slug'
}

/** input type for updating data in table "team" */
export type Team_Set_Input = {
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  owner_id?: Maybe<Scalars['uuid']>;
  slug?: Maybe<Scalars['String']>;
};

/** update columns of table "team" */
export enum Team_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  OwnerId = 'owner_id',
  /** column name */
  Slug = 'slug'
}


/** expression to compare columns of type timestamp. All fields are combined with logical 'AND'. */
export type Timestamp_Comparison_Exp = {
  _eq?: Maybe<Scalars['timestamp']>;
  _gt?: Maybe<Scalars['timestamp']>;
  _gte?: Maybe<Scalars['timestamp']>;
  _in?: Maybe<Array<Scalars['timestamp']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['timestamp']>;
  _lte?: Maybe<Scalars['timestamp']>;
  _neq?: Maybe<Scalars['timestamp']>;
  _nin?: Maybe<Array<Scalars['timestamp']>>;
};


/** expression to compare columns of type timestamptz. All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: Maybe<Scalars['timestamptz']>;
  _gt?: Maybe<Scalars['timestamptz']>;
  _gte?: Maybe<Scalars['timestamptz']>;
  _in?: Maybe<Array<Scalars['timestamptz']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['timestamptz']>;
  _lte?: Maybe<Scalars['timestamptz']>;
  _neq?: Maybe<Scalars['timestamptz']>;
  _nin?: Maybe<Array<Scalars['timestamptz']>>;
};

/** columns and relationships of "topic" */
export type Topic = {
  __typename?: 'topic';
  closed_at?: Maybe<Scalars['timestamp']>;
  closed_by?: Maybe<Scalars['uuid']>;
  /** An object relationship */
  closed_by_user?: Maybe<User>;
  closing_summary?: Maybe<Scalars['String']>;
  id: Scalars['uuid'];
  index: Scalars['String'];
  /** An array relationship */
  members: Array<Topic_Member>;
  /** An aggregated array relationship */
  members_aggregate: Topic_Member_Aggregate;
  /** An array relationship */
  messages: Array<Message>;
  /** An aggregated array relationship */
  messages_aggregate: Message_Aggregate;
  name?: Maybe<Scalars['String']>;
  /** An object relationship */
  room: Room;
  room_id: Scalars['uuid'];
  slug: Scalars['String'];
};


/** columns and relationships of "topic" */
export type TopicMembersArgs = {
  distinct_on?: Maybe<Array<Topic_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Topic_Member_Order_By>>;
  where?: Maybe<Topic_Member_Bool_Exp>;
};


/** columns and relationships of "topic" */
export type TopicMembers_AggregateArgs = {
  distinct_on?: Maybe<Array<Topic_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Topic_Member_Order_By>>;
  where?: Maybe<Topic_Member_Bool_Exp>;
};


/** columns and relationships of "topic" */
export type TopicMessagesArgs = {
  distinct_on?: Maybe<Array<Message_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Message_Order_By>>;
  where?: Maybe<Message_Bool_Exp>;
};


/** columns and relationships of "topic" */
export type TopicMessages_AggregateArgs = {
  distinct_on?: Maybe<Array<Message_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Message_Order_By>>;
  where?: Maybe<Message_Bool_Exp>;
};

/** aggregated selection of "topic" */
export type Topic_Aggregate = {
  __typename?: 'topic_aggregate';
  aggregate?: Maybe<Topic_Aggregate_Fields>;
  nodes: Array<Topic>;
};

/** aggregate fields of "topic" */
export type Topic_Aggregate_Fields = {
  __typename?: 'topic_aggregate_fields';
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Topic_Max_Fields>;
  min?: Maybe<Topic_Min_Fields>;
};


/** aggregate fields of "topic" */
export type Topic_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Topic_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "topic" */
export type Topic_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<Topic_Max_Order_By>;
  min?: Maybe<Topic_Min_Order_By>;
};

/** input type for inserting array relation for remote table "topic" */
export type Topic_Arr_Rel_Insert_Input = {
  data: Array<Topic_Insert_Input>;
  on_conflict?: Maybe<Topic_On_Conflict>;
};

/** Boolean expression to filter rows from the table "topic". All fields are combined with a logical 'AND'. */
export type Topic_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Topic_Bool_Exp>>>;
  _not?: Maybe<Topic_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Topic_Bool_Exp>>>;
  closed_at?: Maybe<Timestamp_Comparison_Exp>;
  closed_by?: Maybe<Uuid_Comparison_Exp>;
  closed_by_user?: Maybe<User_Bool_Exp>;
  closing_summary?: Maybe<String_Comparison_Exp>;
  id?: Maybe<Uuid_Comparison_Exp>;
  index?: Maybe<String_Comparison_Exp>;
  members?: Maybe<Topic_Member_Bool_Exp>;
  messages?: Maybe<Message_Bool_Exp>;
  name?: Maybe<String_Comparison_Exp>;
  room?: Maybe<Room_Bool_Exp>;
  room_id?: Maybe<Uuid_Comparison_Exp>;
  slug?: Maybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "topic" */
export enum Topic_Constraint {
  /** unique or primary key constraint */
  ThreadPkey = 'thread_pkey',
  /** unique or primary key constraint */
  TopicSlugRoomIdKey = 'topic_slug_room_id_key'
}

/** input type for inserting data into table "topic" */
export type Topic_Insert_Input = {
  closed_at?: Maybe<Scalars['timestamp']>;
  closed_by?: Maybe<Scalars['uuid']>;
  closed_by_user?: Maybe<User_Obj_Rel_Insert_Input>;
  closing_summary?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  index?: Maybe<Scalars['String']>;
  members?: Maybe<Topic_Member_Arr_Rel_Insert_Input>;
  messages?: Maybe<Message_Arr_Rel_Insert_Input>;
  name?: Maybe<Scalars['String']>;
  room?: Maybe<Room_Obj_Rel_Insert_Input>;
  room_id?: Maybe<Scalars['uuid']>;
  slug?: Maybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Topic_Max_Fields = {
  __typename?: 'topic_max_fields';
  closed_at?: Maybe<Scalars['timestamp']>;
  closed_by?: Maybe<Scalars['uuid']>;
  closing_summary?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  index?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  room_id?: Maybe<Scalars['uuid']>;
  slug?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "topic" */
export type Topic_Max_Order_By = {
  closed_at?: Maybe<Order_By>;
  closed_by?: Maybe<Order_By>;
  closing_summary?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  index?: Maybe<Order_By>;
  name?: Maybe<Order_By>;
  room_id?: Maybe<Order_By>;
  slug?: Maybe<Order_By>;
};

/** columns and relationships of "topic_member" */
export type Topic_Member = {
  __typename?: 'topic_member';
  /** An object relationship */
  topic: Topic;
  topic_id: Scalars['uuid'];
  /** An object relationship */
  user: User;
  user_id: Scalars['uuid'];
};

/** aggregated selection of "topic_member" */
export type Topic_Member_Aggregate = {
  __typename?: 'topic_member_aggregate';
  aggregate?: Maybe<Topic_Member_Aggregate_Fields>;
  nodes: Array<Topic_Member>;
};

/** aggregate fields of "topic_member" */
export type Topic_Member_Aggregate_Fields = {
  __typename?: 'topic_member_aggregate_fields';
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Topic_Member_Max_Fields>;
  min?: Maybe<Topic_Member_Min_Fields>;
};


/** aggregate fields of "topic_member" */
export type Topic_Member_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Topic_Member_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "topic_member" */
export type Topic_Member_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<Topic_Member_Max_Order_By>;
  min?: Maybe<Topic_Member_Min_Order_By>;
};

/** input type for inserting array relation for remote table "topic_member" */
export type Topic_Member_Arr_Rel_Insert_Input = {
  data: Array<Topic_Member_Insert_Input>;
  on_conflict?: Maybe<Topic_Member_On_Conflict>;
};

/** Boolean expression to filter rows from the table "topic_member". All fields are combined with a logical 'AND'. */
export type Topic_Member_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Topic_Member_Bool_Exp>>>;
  _not?: Maybe<Topic_Member_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Topic_Member_Bool_Exp>>>;
  topic?: Maybe<Topic_Bool_Exp>;
  topic_id?: Maybe<Uuid_Comparison_Exp>;
  user?: Maybe<User_Bool_Exp>;
  user_id?: Maybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "topic_member" */
export enum Topic_Member_Constraint {
  /** unique or primary key constraint */
  TopicParticipantsPkey = 'topic_participants_pkey'
}

/** input type for inserting data into table "topic_member" */
export type Topic_Member_Insert_Input = {
  topic?: Maybe<Topic_Obj_Rel_Insert_Input>;
  topic_id?: Maybe<Scalars['uuid']>;
  user?: Maybe<User_Obj_Rel_Insert_Input>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Topic_Member_Max_Fields = {
  __typename?: 'topic_member_max_fields';
  topic_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "topic_member" */
export type Topic_Member_Max_Order_By = {
  topic_id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Topic_Member_Min_Fields = {
  __typename?: 'topic_member_min_fields';
  topic_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "topic_member" */
export type Topic_Member_Min_Order_By = {
  topic_id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** response of any mutation on the table "topic_member" */
export type Topic_Member_Mutation_Response = {
  __typename?: 'topic_member_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Topic_Member>;
};

/** input type for inserting object relation for remote table "topic_member" */
export type Topic_Member_Obj_Rel_Insert_Input = {
  data: Topic_Member_Insert_Input;
  on_conflict?: Maybe<Topic_Member_On_Conflict>;
};

/** on conflict condition type for table "topic_member" */
export type Topic_Member_On_Conflict = {
  constraint: Topic_Member_Constraint;
  update_columns: Array<Topic_Member_Update_Column>;
  where?: Maybe<Topic_Member_Bool_Exp>;
};

/** ordering options when selecting data from "topic_member" */
export type Topic_Member_Order_By = {
  topic?: Maybe<Topic_Order_By>;
  topic_id?: Maybe<Order_By>;
  user?: Maybe<User_Order_By>;
  user_id?: Maybe<Order_By>;
};

/** primary key columns input for table: "topic_member" */
export type Topic_Member_Pk_Columns_Input = {
  topic_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
};

/** select columns of table "topic_member" */
export enum Topic_Member_Select_Column {
  /** column name */
  TopicId = 'topic_id',
  /** column name */
  UserId = 'user_id'
}

/** input type for updating data in table "topic_member" */
export type Topic_Member_Set_Input = {
  topic_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** update columns of table "topic_member" */
export enum Topic_Member_Update_Column {
  /** column name */
  TopicId = 'topic_id',
  /** column name */
  UserId = 'user_id'
}

/** aggregate min on columns */
export type Topic_Min_Fields = {
  __typename?: 'topic_min_fields';
  closed_at?: Maybe<Scalars['timestamp']>;
  closed_by?: Maybe<Scalars['uuid']>;
  closing_summary?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  index?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  room_id?: Maybe<Scalars['uuid']>;
  slug?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "topic" */
export type Topic_Min_Order_By = {
  closed_at?: Maybe<Order_By>;
  closed_by?: Maybe<Order_By>;
  closing_summary?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  index?: Maybe<Order_By>;
  name?: Maybe<Order_By>;
  room_id?: Maybe<Order_By>;
  slug?: Maybe<Order_By>;
};

/** response of any mutation on the table "topic" */
export type Topic_Mutation_Response = {
  __typename?: 'topic_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Topic>;
};

/** input type for inserting object relation for remote table "topic" */
export type Topic_Obj_Rel_Insert_Input = {
  data: Topic_Insert_Input;
  on_conflict?: Maybe<Topic_On_Conflict>;
};

/** on conflict condition type for table "topic" */
export type Topic_On_Conflict = {
  constraint: Topic_Constraint;
  update_columns: Array<Topic_Update_Column>;
  where?: Maybe<Topic_Bool_Exp>;
};

/** ordering options when selecting data from "topic" */
export type Topic_Order_By = {
  closed_at?: Maybe<Order_By>;
  closed_by?: Maybe<Order_By>;
  closed_by_user?: Maybe<User_Order_By>;
  closing_summary?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  index?: Maybe<Order_By>;
  members_aggregate?: Maybe<Topic_Member_Aggregate_Order_By>;
  messages_aggregate?: Maybe<Message_Aggregate_Order_By>;
  name?: Maybe<Order_By>;
  room?: Maybe<Room_Order_By>;
  room_id?: Maybe<Order_By>;
  slug?: Maybe<Order_By>;
};

/** primary key columns input for table: "topic" */
export type Topic_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "topic" */
export enum Topic_Select_Column {
  /** column name */
  ClosedAt = 'closed_at',
  /** column name */
  ClosedBy = 'closed_by',
  /** column name */
  ClosingSummary = 'closing_summary',
  /** column name */
  Id = 'id',
  /** column name */
  Index = 'index',
  /** column name */
  Name = 'name',
  /** column name */
  RoomId = 'room_id',
  /** column name */
  Slug = 'slug'
}

/** input type for updating data in table "topic" */
export type Topic_Set_Input = {
  closed_at?: Maybe<Scalars['timestamp']>;
  closed_by?: Maybe<Scalars['uuid']>;
  closing_summary?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  index?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  room_id?: Maybe<Scalars['uuid']>;
  slug?: Maybe<Scalars['String']>;
};

/** update columns of table "topic" */
export enum Topic_Update_Column {
  /** column name */
  ClosedAt = 'closed_at',
  /** column name */
  ClosedBy = 'closed_by',
  /** column name */
  ClosingSummary = 'closing_summary',
  /** column name */
  Id = 'id',
  /** column name */
  Index = 'index',
  /** column name */
  Name = 'name',
  /** column name */
  RoomId = 'room_id',
  /** column name */
  Slug = 'slug'
}

/** columns and relationships of "transcription" */
export type Transcription = {
  __typename?: 'transcription';
  created_at: Scalars['timestamptz'];
  id: Scalars['uuid'];
  sonix_media_id: Scalars['String'];
  status: Transcription_Status_Enum;
  transcript?: Maybe<Scalars['jsonb']>;
  updated_at: Scalars['timestamptz'];
};


/** columns and relationships of "transcription" */
export type TranscriptionTranscriptArgs = {
  path?: Maybe<Scalars['String']>;
};

/** aggregated selection of "transcription" */
export type Transcription_Aggregate = {
  __typename?: 'transcription_aggregate';
  aggregate?: Maybe<Transcription_Aggregate_Fields>;
  nodes: Array<Transcription>;
};

/** aggregate fields of "transcription" */
export type Transcription_Aggregate_Fields = {
  __typename?: 'transcription_aggregate_fields';
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Transcription_Max_Fields>;
  min?: Maybe<Transcription_Min_Fields>;
};


/** aggregate fields of "transcription" */
export type Transcription_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Transcription_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "transcription" */
export type Transcription_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<Transcription_Max_Order_By>;
  min?: Maybe<Transcription_Min_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Transcription_Append_Input = {
  transcript?: Maybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "transcription" */
export type Transcription_Arr_Rel_Insert_Input = {
  data: Array<Transcription_Insert_Input>;
  on_conflict?: Maybe<Transcription_On_Conflict>;
};

/** Boolean expression to filter rows from the table "transcription". All fields are combined with a logical 'AND'. */
export type Transcription_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Transcription_Bool_Exp>>>;
  _not?: Maybe<Transcription_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Transcription_Bool_Exp>>>;
  created_at?: Maybe<Timestamptz_Comparison_Exp>;
  id?: Maybe<Uuid_Comparison_Exp>;
  sonix_media_id?: Maybe<String_Comparison_Exp>;
  status?: Maybe<Transcription_Status_Enum_Comparison_Exp>;
  transcript?: Maybe<Jsonb_Comparison_Exp>;
  updated_at?: Maybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "transcription" */
export enum Transcription_Constraint {
  /** unique or primary key constraint */
  TranscriptionPkey = 'transcription_pkey',
  /** unique or primary key constraint */
  TranscriptionSonixMediaIdKey = 'transcription_sonix_media_id_key'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Transcription_Delete_At_Path_Input = {
  transcript?: Maybe<Array<Maybe<Scalars['String']>>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Transcription_Delete_Elem_Input = {
  transcript?: Maybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Transcription_Delete_Key_Input = {
  transcript?: Maybe<Scalars['String']>;
};

/** columns and relationships of "transcription_full_text" */
export type Transcription_Full_Text = {
  __typename?: 'transcription_full_text';
  transcript?: Maybe<Scalars['String']>;
  transcription_id?: Maybe<Scalars['uuid']>;
};

/** aggregated selection of "transcription_full_text" */
export type Transcription_Full_Text_Aggregate = {
  __typename?: 'transcription_full_text_aggregate';
  aggregate?: Maybe<Transcription_Full_Text_Aggregate_Fields>;
  nodes: Array<Transcription_Full_Text>;
};

/** aggregate fields of "transcription_full_text" */
export type Transcription_Full_Text_Aggregate_Fields = {
  __typename?: 'transcription_full_text_aggregate_fields';
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Transcription_Full_Text_Max_Fields>;
  min?: Maybe<Transcription_Full_Text_Min_Fields>;
};


/** aggregate fields of "transcription_full_text" */
export type Transcription_Full_Text_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Transcription_Full_Text_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "transcription_full_text" */
export type Transcription_Full_Text_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<Transcription_Full_Text_Max_Order_By>;
  min?: Maybe<Transcription_Full_Text_Min_Order_By>;
};

/** Boolean expression to filter rows from the table "transcription_full_text". All fields are combined with a logical 'AND'. */
export type Transcription_Full_Text_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Transcription_Full_Text_Bool_Exp>>>;
  _not?: Maybe<Transcription_Full_Text_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Transcription_Full_Text_Bool_Exp>>>;
  transcript?: Maybe<String_Comparison_Exp>;
  transcription_id?: Maybe<Uuid_Comparison_Exp>;
};

/** aggregate max on columns */
export type Transcription_Full_Text_Max_Fields = {
  __typename?: 'transcription_full_text_max_fields';
  transcript?: Maybe<Scalars['String']>;
  transcription_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "transcription_full_text" */
export type Transcription_Full_Text_Max_Order_By = {
  transcript?: Maybe<Order_By>;
  transcription_id?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Transcription_Full_Text_Min_Fields = {
  __typename?: 'transcription_full_text_min_fields';
  transcript?: Maybe<Scalars['String']>;
  transcription_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "transcription_full_text" */
export type Transcription_Full_Text_Min_Order_By = {
  transcript?: Maybe<Order_By>;
  transcription_id?: Maybe<Order_By>;
};

/** ordering options when selecting data from "transcription_full_text" */
export type Transcription_Full_Text_Order_By = {
  transcript?: Maybe<Order_By>;
  transcription_id?: Maybe<Order_By>;
};

/** select columns of table "transcription_full_text" */
export enum Transcription_Full_Text_Select_Column {
  /** column name */
  Transcript = 'transcript',
  /** column name */
  TranscriptionId = 'transcription_id'
}

/** input type for inserting data into table "transcription" */
export type Transcription_Insert_Input = {
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  sonix_media_id?: Maybe<Scalars['String']>;
  status?: Maybe<Transcription_Status_Enum>;
  transcript?: Maybe<Scalars['jsonb']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Transcription_Max_Fields = {
  __typename?: 'transcription_max_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  sonix_media_id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "transcription" */
export type Transcription_Max_Order_By = {
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  sonix_media_id?: Maybe<Order_By>;
  updated_at?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Transcription_Min_Fields = {
  __typename?: 'transcription_min_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  sonix_media_id?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "transcription" */
export type Transcription_Min_Order_By = {
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  sonix_media_id?: Maybe<Order_By>;
  updated_at?: Maybe<Order_By>;
};

/** response of any mutation on the table "transcription" */
export type Transcription_Mutation_Response = {
  __typename?: 'transcription_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Transcription>;
};

/** input type for inserting object relation for remote table "transcription" */
export type Transcription_Obj_Rel_Insert_Input = {
  data: Transcription_Insert_Input;
  on_conflict?: Maybe<Transcription_On_Conflict>;
};

/** on conflict condition type for table "transcription" */
export type Transcription_On_Conflict = {
  constraint: Transcription_Constraint;
  update_columns: Array<Transcription_Update_Column>;
  where?: Maybe<Transcription_Bool_Exp>;
};

/** ordering options when selecting data from "transcription" */
export type Transcription_Order_By = {
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  sonix_media_id?: Maybe<Order_By>;
  status?: Maybe<Order_By>;
  transcript?: Maybe<Order_By>;
  updated_at?: Maybe<Order_By>;
};

/** primary key columns input for table: "transcription" */
export type Transcription_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Transcription_Prepend_Input = {
  transcript?: Maybe<Scalars['jsonb']>;
};

/** select columns of table "transcription" */
export enum Transcription_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  SonixMediaId = 'sonix_media_id',
  /** column name */
  Status = 'status',
  /** column name */
  Transcript = 'transcript',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "transcription" */
export type Transcription_Set_Input = {
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  sonix_media_id?: Maybe<Scalars['String']>;
  status?: Maybe<Transcription_Status_Enum>;
  transcript?: Maybe<Scalars['jsonb']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** columns and relationships of "transcription_status" */
export type Transcription_Status = {
  __typename?: 'transcription_status';
  value: Scalars['String'];
};

/** aggregated selection of "transcription_status" */
export type Transcription_Status_Aggregate = {
  __typename?: 'transcription_status_aggregate';
  aggregate?: Maybe<Transcription_Status_Aggregate_Fields>;
  nodes: Array<Transcription_Status>;
};

/** aggregate fields of "transcription_status" */
export type Transcription_Status_Aggregate_Fields = {
  __typename?: 'transcription_status_aggregate_fields';
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Transcription_Status_Max_Fields>;
  min?: Maybe<Transcription_Status_Min_Fields>;
};


/** aggregate fields of "transcription_status" */
export type Transcription_Status_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Transcription_Status_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "transcription_status" */
export type Transcription_Status_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<Transcription_Status_Max_Order_By>;
  min?: Maybe<Transcription_Status_Min_Order_By>;
};

/** input type for inserting array relation for remote table "transcription_status" */
export type Transcription_Status_Arr_Rel_Insert_Input = {
  data: Array<Transcription_Status_Insert_Input>;
  on_conflict?: Maybe<Transcription_Status_On_Conflict>;
};

/** Boolean expression to filter rows from the table "transcription_status". All fields are combined with a logical 'AND'. */
export type Transcription_Status_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Transcription_Status_Bool_Exp>>>;
  _not?: Maybe<Transcription_Status_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Transcription_Status_Bool_Exp>>>;
  value?: Maybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "transcription_status" */
export enum Transcription_Status_Constraint {
  /** unique or primary key constraint */
  TranscriptionStatusPkey = 'transcription_status_pkey'
}

export enum Transcription_Status_Enum {
  Blocked = 'blocked',
  Completed = 'completed',
  Failed = 'failed',
  Preparing = 'preparing',
  Transcribing = 'transcribing'
}

/** expression to compare columns of type transcription_status_enum. All fields are combined with logical 'AND'. */
export type Transcription_Status_Enum_Comparison_Exp = {
  _eq?: Maybe<Transcription_Status_Enum>;
  _in?: Maybe<Array<Transcription_Status_Enum>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _neq?: Maybe<Transcription_Status_Enum>;
  _nin?: Maybe<Array<Transcription_Status_Enum>>;
};

/** input type for inserting data into table "transcription_status" */
export type Transcription_Status_Insert_Input = {
  value?: Maybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Transcription_Status_Max_Fields = {
  __typename?: 'transcription_status_max_fields';
  value?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "transcription_status" */
export type Transcription_Status_Max_Order_By = {
  value?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Transcription_Status_Min_Fields = {
  __typename?: 'transcription_status_min_fields';
  value?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "transcription_status" */
export type Transcription_Status_Min_Order_By = {
  value?: Maybe<Order_By>;
};

/** response of any mutation on the table "transcription_status" */
export type Transcription_Status_Mutation_Response = {
  __typename?: 'transcription_status_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Transcription_Status>;
};

/** input type for inserting object relation for remote table "transcription_status" */
export type Transcription_Status_Obj_Rel_Insert_Input = {
  data: Transcription_Status_Insert_Input;
  on_conflict?: Maybe<Transcription_Status_On_Conflict>;
};

/** on conflict condition type for table "transcription_status" */
export type Transcription_Status_On_Conflict = {
  constraint: Transcription_Status_Constraint;
  update_columns: Array<Transcription_Status_Update_Column>;
  where?: Maybe<Transcription_Status_Bool_Exp>;
};

/** ordering options when selecting data from "transcription_status" */
export type Transcription_Status_Order_By = {
  value?: Maybe<Order_By>;
};

/** primary key columns input for table: "transcription_status" */
export type Transcription_Status_Pk_Columns_Input = {
  value: Scalars['String'];
};

/** select columns of table "transcription_status" */
export enum Transcription_Status_Select_Column {
  /** column name */
  Value = 'value'
}

/** input type for updating data in table "transcription_status" */
export type Transcription_Status_Set_Input = {
  value?: Maybe<Scalars['String']>;
};

/** update columns of table "transcription_status" */
export enum Transcription_Status_Update_Column {
  /** column name */
  Value = 'value'
}

/** update columns of table "transcription" */
export enum Transcription_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  SonixMediaId = 'sonix_media_id',
  /** column name */
  Status = 'status',
  /** column name */
  Transcript = 'transcript',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** columns and relationships of "unread_messages" */
export type Unread_Messages = {
  __typename?: 'unread_messages';
  room_id?: Maybe<Scalars['uuid']>;
  topic_id?: Maybe<Scalars['uuid']>;
  unread_messages?: Maybe<Scalars['bigint']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** aggregated selection of "unread_messages" */
export type Unread_Messages_Aggregate = {
  __typename?: 'unread_messages_aggregate';
  aggregate?: Maybe<Unread_Messages_Aggregate_Fields>;
  nodes: Array<Unread_Messages>;
};

/** aggregate fields of "unread_messages" */
export type Unread_Messages_Aggregate_Fields = {
  __typename?: 'unread_messages_aggregate_fields';
  avg?: Maybe<Unread_Messages_Avg_Fields>;
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Unread_Messages_Max_Fields>;
  min?: Maybe<Unread_Messages_Min_Fields>;
  stddev?: Maybe<Unread_Messages_Stddev_Fields>;
  stddev_pop?: Maybe<Unread_Messages_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Unread_Messages_Stddev_Samp_Fields>;
  sum?: Maybe<Unread_Messages_Sum_Fields>;
  var_pop?: Maybe<Unread_Messages_Var_Pop_Fields>;
  var_samp?: Maybe<Unread_Messages_Var_Samp_Fields>;
  variance?: Maybe<Unread_Messages_Variance_Fields>;
};


/** aggregate fields of "unread_messages" */
export type Unread_Messages_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Unread_Messages_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "unread_messages" */
export type Unread_Messages_Aggregate_Order_By = {
  avg?: Maybe<Unread_Messages_Avg_Order_By>;
  count?: Maybe<Order_By>;
  max?: Maybe<Unread_Messages_Max_Order_By>;
  min?: Maybe<Unread_Messages_Min_Order_By>;
  stddev?: Maybe<Unread_Messages_Stddev_Order_By>;
  stddev_pop?: Maybe<Unread_Messages_Stddev_Pop_Order_By>;
  stddev_samp?: Maybe<Unread_Messages_Stddev_Samp_Order_By>;
  sum?: Maybe<Unread_Messages_Sum_Order_By>;
  var_pop?: Maybe<Unread_Messages_Var_Pop_Order_By>;
  var_samp?: Maybe<Unread_Messages_Var_Samp_Order_By>;
  variance?: Maybe<Unread_Messages_Variance_Order_By>;
};

/** aggregate avg on columns */
export type Unread_Messages_Avg_Fields = {
  __typename?: 'unread_messages_avg_fields';
  unread_messages?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "unread_messages" */
export type Unread_Messages_Avg_Order_By = {
  unread_messages?: Maybe<Order_By>;
};

/** Boolean expression to filter rows from the table "unread_messages". All fields are combined with a logical 'AND'. */
export type Unread_Messages_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Unread_Messages_Bool_Exp>>>;
  _not?: Maybe<Unread_Messages_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Unread_Messages_Bool_Exp>>>;
  room_id?: Maybe<Uuid_Comparison_Exp>;
  topic_id?: Maybe<Uuid_Comparison_Exp>;
  unread_messages?: Maybe<Bigint_Comparison_Exp>;
  user_id?: Maybe<Uuid_Comparison_Exp>;
};

/** aggregate max on columns */
export type Unread_Messages_Max_Fields = {
  __typename?: 'unread_messages_max_fields';
  room_id?: Maybe<Scalars['uuid']>;
  topic_id?: Maybe<Scalars['uuid']>;
  unread_messages?: Maybe<Scalars['bigint']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "unread_messages" */
export type Unread_Messages_Max_Order_By = {
  room_id?: Maybe<Order_By>;
  topic_id?: Maybe<Order_By>;
  unread_messages?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Unread_Messages_Min_Fields = {
  __typename?: 'unread_messages_min_fields';
  room_id?: Maybe<Scalars['uuid']>;
  topic_id?: Maybe<Scalars['uuid']>;
  unread_messages?: Maybe<Scalars['bigint']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "unread_messages" */
export type Unread_Messages_Min_Order_By = {
  room_id?: Maybe<Order_By>;
  topic_id?: Maybe<Order_By>;
  unread_messages?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** ordering options when selecting data from "unread_messages" */
export type Unread_Messages_Order_By = {
  room_id?: Maybe<Order_By>;
  topic_id?: Maybe<Order_By>;
  unread_messages?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** select columns of table "unread_messages" */
export enum Unread_Messages_Select_Column {
  /** column name */
  RoomId = 'room_id',
  /** column name */
  TopicId = 'topic_id',
  /** column name */
  UnreadMessages = 'unread_messages',
  /** column name */
  UserId = 'user_id'
}

/** aggregate stddev on columns */
export type Unread_Messages_Stddev_Fields = {
  __typename?: 'unread_messages_stddev_fields';
  unread_messages?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "unread_messages" */
export type Unread_Messages_Stddev_Order_By = {
  unread_messages?: Maybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Unread_Messages_Stddev_Pop_Fields = {
  __typename?: 'unread_messages_stddev_pop_fields';
  unread_messages?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "unread_messages" */
export type Unread_Messages_Stddev_Pop_Order_By = {
  unread_messages?: Maybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Unread_Messages_Stddev_Samp_Fields = {
  __typename?: 'unread_messages_stddev_samp_fields';
  unread_messages?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "unread_messages" */
export type Unread_Messages_Stddev_Samp_Order_By = {
  unread_messages?: Maybe<Order_By>;
};

/** aggregate sum on columns */
export type Unread_Messages_Sum_Fields = {
  __typename?: 'unread_messages_sum_fields';
  unread_messages?: Maybe<Scalars['bigint']>;
};

/** order by sum() on columns of table "unread_messages" */
export type Unread_Messages_Sum_Order_By = {
  unread_messages?: Maybe<Order_By>;
};

/** aggregate var_pop on columns */
export type Unread_Messages_Var_Pop_Fields = {
  __typename?: 'unread_messages_var_pop_fields';
  unread_messages?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "unread_messages" */
export type Unread_Messages_Var_Pop_Order_By = {
  unread_messages?: Maybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Unread_Messages_Var_Samp_Fields = {
  __typename?: 'unread_messages_var_samp_fields';
  unread_messages?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "unread_messages" */
export type Unread_Messages_Var_Samp_Order_By = {
  unread_messages?: Maybe<Order_By>;
};

/** aggregate variance on columns */
export type Unread_Messages_Variance_Fields = {
  __typename?: 'unread_messages_variance_fields';
  unread_messages?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "unread_messages" */
export type Unread_Messages_Variance_Order_By = {
  unread_messages?: Maybe<Order_By>;
};

/** columns and relationships of "user" */
export type User = {
  __typename?: 'user';
  avatar_url?: Maybe<Scalars['String']>;
  created_at: Scalars['timestamptz'];
  /** An array relationship */
  created_rooms: Array<Room>;
  /** An aggregated array relationship */
  created_rooms_aggregate: Room_Aggregate;
  /** An array relationship */
  created_team_invitations: Array<Team_Invitation>;
  /** An aggregated array relationship */
  created_team_invitations_aggregate: Team_Invitation_Aggregate;
  /** An object relationship */
  current_team?: Maybe<Team>;
  current_team_id?: Maybe<Scalars['uuid']>;
  email?: Maybe<Scalars['String']>;
  email_verified?: Maybe<Scalars['timestamptz']>;
  id: Scalars['uuid'];
  /** An array relationship */
  invites: Array<Room_Invites>;
  /** An aggregated array relationship */
  invites_aggregate: Room_Invites_Aggregate;
  /** An array relationship */
  messages: Array<Message>;
  /** An aggregated array relationship */
  messages_aggregate: Message_Aggregate;
  name?: Maybe<Scalars['String']>;
  /** An array relationship */
  owned_teams: Array<Team>;
  /** An aggregated array relationship */
  owned_teams_aggregate: Team_Aggregate;
  /** An array relationship */
  rooms: Array<Room_Member>;
  /** An aggregated array relationship */
  rooms_aggregate: Room_Member_Aggregate;
  /** An array relationship */
  space_memberships: Array<Space_Member>;
  /** An aggregated array relationship */
  space_memberships_aggregate: Space_Member_Aggregate;
  /** An array relationship */
  team_memberships: Array<Team_Member>;
  /** An aggregated array relationship */
  team_memberships_aggregate: Team_Member_Aggregate;
  /** An array relationship */
  topic_memberships: Array<Topic_Member>;
  /** An aggregated array relationship */
  topic_memberships_aggregate: Topic_Member_Aggregate;
};


/** columns and relationships of "user" */
export type UserCreated_RoomsArgs = {
  distinct_on?: Maybe<Array<Room_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Order_By>>;
  where?: Maybe<Room_Bool_Exp>;
};


/** columns and relationships of "user" */
export type UserCreated_Rooms_AggregateArgs = {
  distinct_on?: Maybe<Array<Room_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Order_By>>;
  where?: Maybe<Room_Bool_Exp>;
};


/** columns and relationships of "user" */
export type UserCreated_Team_InvitationsArgs = {
  distinct_on?: Maybe<Array<Team_Invitation_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Invitation_Order_By>>;
  where?: Maybe<Team_Invitation_Bool_Exp>;
};


/** columns and relationships of "user" */
export type UserCreated_Team_Invitations_AggregateArgs = {
  distinct_on?: Maybe<Array<Team_Invitation_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Invitation_Order_By>>;
  where?: Maybe<Team_Invitation_Bool_Exp>;
};


/** columns and relationships of "user" */
export type UserInvitesArgs = {
  distinct_on?: Maybe<Array<Room_Invites_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Invites_Order_By>>;
  where?: Maybe<Room_Invites_Bool_Exp>;
};


/** columns and relationships of "user" */
export type UserInvites_AggregateArgs = {
  distinct_on?: Maybe<Array<Room_Invites_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Invites_Order_By>>;
  where?: Maybe<Room_Invites_Bool_Exp>;
};


/** columns and relationships of "user" */
export type UserMessagesArgs = {
  distinct_on?: Maybe<Array<Message_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Message_Order_By>>;
  where?: Maybe<Message_Bool_Exp>;
};


/** columns and relationships of "user" */
export type UserMessages_AggregateArgs = {
  distinct_on?: Maybe<Array<Message_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Message_Order_By>>;
  where?: Maybe<Message_Bool_Exp>;
};


/** columns and relationships of "user" */
export type UserOwned_TeamsArgs = {
  distinct_on?: Maybe<Array<Team_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Order_By>>;
  where?: Maybe<Team_Bool_Exp>;
};


/** columns and relationships of "user" */
export type UserOwned_Teams_AggregateArgs = {
  distinct_on?: Maybe<Array<Team_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Order_By>>;
  where?: Maybe<Team_Bool_Exp>;
};


/** columns and relationships of "user" */
export type UserRoomsArgs = {
  distinct_on?: Maybe<Array<Room_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Member_Order_By>>;
  where?: Maybe<Room_Member_Bool_Exp>;
};


/** columns and relationships of "user" */
export type UserRooms_AggregateArgs = {
  distinct_on?: Maybe<Array<Room_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Member_Order_By>>;
  where?: Maybe<Room_Member_Bool_Exp>;
};


/** columns and relationships of "user" */
export type UserSpace_MembershipsArgs = {
  distinct_on?: Maybe<Array<Space_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Space_Member_Order_By>>;
  where?: Maybe<Space_Member_Bool_Exp>;
};


/** columns and relationships of "user" */
export type UserSpace_Memberships_AggregateArgs = {
  distinct_on?: Maybe<Array<Space_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Space_Member_Order_By>>;
  where?: Maybe<Space_Member_Bool_Exp>;
};


/** columns and relationships of "user" */
export type UserTeam_MembershipsArgs = {
  distinct_on?: Maybe<Array<Team_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Member_Order_By>>;
  where?: Maybe<Team_Member_Bool_Exp>;
};


/** columns and relationships of "user" */
export type UserTeam_Memberships_AggregateArgs = {
  distinct_on?: Maybe<Array<Team_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Team_Member_Order_By>>;
  where?: Maybe<Team_Member_Bool_Exp>;
};


/** columns and relationships of "user" */
export type UserTopic_MembershipsArgs = {
  distinct_on?: Maybe<Array<Topic_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Topic_Member_Order_By>>;
  where?: Maybe<Topic_Member_Bool_Exp>;
};


/** columns and relationships of "user" */
export type UserTopic_Memberships_AggregateArgs = {
  distinct_on?: Maybe<Array<Topic_Member_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Topic_Member_Order_By>>;
  where?: Maybe<Topic_Member_Bool_Exp>;
};

/** aggregated selection of "user" */
export type User_Aggregate = {
  __typename?: 'user_aggregate';
  aggregate?: Maybe<User_Aggregate_Fields>;
  nodes: Array<User>;
};

/** aggregate fields of "user" */
export type User_Aggregate_Fields = {
  __typename?: 'user_aggregate_fields';
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<User_Max_Fields>;
  min?: Maybe<User_Min_Fields>;
};


/** aggregate fields of "user" */
export type User_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<User_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "user" */
export type User_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<User_Max_Order_By>;
  min?: Maybe<User_Min_Order_By>;
};

/** input type for inserting array relation for remote table "user" */
export type User_Arr_Rel_Insert_Input = {
  data: Array<User_Insert_Input>;
  on_conflict?: Maybe<User_On_Conflict>;
};

/** Boolean expression to filter rows from the table "user". All fields are combined with a logical 'AND'. */
export type User_Bool_Exp = {
  _and?: Maybe<Array<Maybe<User_Bool_Exp>>>;
  _not?: Maybe<User_Bool_Exp>;
  _or?: Maybe<Array<Maybe<User_Bool_Exp>>>;
  avatar_url?: Maybe<String_Comparison_Exp>;
  created_at?: Maybe<Timestamptz_Comparison_Exp>;
  created_rooms?: Maybe<Room_Bool_Exp>;
  created_team_invitations?: Maybe<Team_Invitation_Bool_Exp>;
  current_team?: Maybe<Team_Bool_Exp>;
  current_team_id?: Maybe<Uuid_Comparison_Exp>;
  email?: Maybe<String_Comparison_Exp>;
  email_verified?: Maybe<Timestamptz_Comparison_Exp>;
  id?: Maybe<Uuid_Comparison_Exp>;
  invites?: Maybe<Room_Invites_Bool_Exp>;
  messages?: Maybe<Message_Bool_Exp>;
  name?: Maybe<String_Comparison_Exp>;
  owned_teams?: Maybe<Team_Bool_Exp>;
  rooms?: Maybe<Room_Member_Bool_Exp>;
  space_memberships?: Maybe<Space_Member_Bool_Exp>;
  team_memberships?: Maybe<Team_Member_Bool_Exp>;
  topic_memberships?: Maybe<Topic_Member_Bool_Exp>;
};

/** unique or primary key constraints on table "user" */
export enum User_Constraint {
  /** unique or primary key constraint */
  UserEmailKey = 'user_email_key',
  /** unique or primary key constraint */
  UserPkey = 'user_pkey'
}

/** input type for inserting data into table "user" */
export type User_Insert_Input = {
  avatar_url?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  created_rooms?: Maybe<Room_Arr_Rel_Insert_Input>;
  created_team_invitations?: Maybe<Team_Invitation_Arr_Rel_Insert_Input>;
  current_team?: Maybe<Team_Obj_Rel_Insert_Input>;
  current_team_id?: Maybe<Scalars['uuid']>;
  email?: Maybe<Scalars['String']>;
  email_verified?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  invites?: Maybe<Room_Invites_Arr_Rel_Insert_Input>;
  messages?: Maybe<Message_Arr_Rel_Insert_Input>;
  name?: Maybe<Scalars['String']>;
  owned_teams?: Maybe<Team_Arr_Rel_Insert_Input>;
  rooms?: Maybe<Room_Member_Arr_Rel_Insert_Input>;
  space_memberships?: Maybe<Space_Member_Arr_Rel_Insert_Input>;
  team_memberships?: Maybe<Team_Member_Arr_Rel_Insert_Input>;
  topic_memberships?: Maybe<Topic_Member_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type User_Max_Fields = {
  __typename?: 'user_max_fields';
  avatar_url?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  current_team_id?: Maybe<Scalars['uuid']>;
  email?: Maybe<Scalars['String']>;
  email_verified?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "user" */
export type User_Max_Order_By = {
  avatar_url?: Maybe<Order_By>;
  created_at?: Maybe<Order_By>;
  current_team_id?: Maybe<Order_By>;
  email?: Maybe<Order_By>;
  email_verified?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  name?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type User_Min_Fields = {
  __typename?: 'user_min_fields';
  avatar_url?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  current_team_id?: Maybe<Scalars['uuid']>;
  email?: Maybe<Scalars['String']>;
  email_verified?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "user" */
export type User_Min_Order_By = {
  avatar_url?: Maybe<Order_By>;
  created_at?: Maybe<Order_By>;
  current_team_id?: Maybe<Order_By>;
  email?: Maybe<Order_By>;
  email_verified?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  name?: Maybe<Order_By>;
};

/** response of any mutation on the table "user" */
export type User_Mutation_Response = {
  __typename?: 'user_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<User>;
};

/** input type for inserting object relation for remote table "user" */
export type User_Obj_Rel_Insert_Input = {
  data: User_Insert_Input;
  on_conflict?: Maybe<User_On_Conflict>;
};

/** on conflict condition type for table "user" */
export type User_On_Conflict = {
  constraint: User_Constraint;
  update_columns: Array<User_Update_Column>;
  where?: Maybe<User_Bool_Exp>;
};

/** ordering options when selecting data from "user" */
export type User_Order_By = {
  avatar_url?: Maybe<Order_By>;
  created_at?: Maybe<Order_By>;
  created_rooms_aggregate?: Maybe<Room_Aggregate_Order_By>;
  created_team_invitations_aggregate?: Maybe<Team_Invitation_Aggregate_Order_By>;
  current_team?: Maybe<Team_Order_By>;
  current_team_id?: Maybe<Order_By>;
  email?: Maybe<Order_By>;
  email_verified?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  invites_aggregate?: Maybe<Room_Invites_Aggregate_Order_By>;
  messages_aggregate?: Maybe<Message_Aggregate_Order_By>;
  name?: Maybe<Order_By>;
  owned_teams_aggregate?: Maybe<Team_Aggregate_Order_By>;
  rooms_aggregate?: Maybe<Room_Member_Aggregate_Order_By>;
  space_memberships_aggregate?: Maybe<Space_Member_Aggregate_Order_By>;
  team_memberships_aggregate?: Maybe<Team_Member_Aggregate_Order_By>;
  topic_memberships_aggregate?: Maybe<Topic_Member_Aggregate_Order_By>;
};

/** primary key columns input for table: "user" */
export type User_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "user" */
export enum User_Select_Column {
  /** column name */
  AvatarUrl = 'avatar_url',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CurrentTeamId = 'current_team_id',
  /** column name */
  Email = 'email',
  /** column name */
  EmailVerified = 'email_verified',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name'
}

/** input type for updating data in table "user" */
export type User_Set_Input = {
  avatar_url?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  current_team_id?: Maybe<Scalars['uuid']>;
  email?: Maybe<Scalars['String']>;
  email_verified?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
};

/** update columns of table "user" */
export enum User_Update_Column {
  /** column name */
  AvatarUrl = 'avatar_url',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  CurrentTeamId = 'current_team_id',
  /** column name */
  Email = 'email',
  /** column name */
  EmailVerified = 'email_verified',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name'
}


/** expression to compare columns of type uuid. All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
  _eq?: Maybe<Scalars['uuid']>;
  _gt?: Maybe<Scalars['uuid']>;
  _gte?: Maybe<Scalars['uuid']>;
  _in?: Maybe<Array<Scalars['uuid']>>;
  _is_null?: Maybe<Scalars['Boolean']>;
  _lt?: Maybe<Scalars['uuid']>;
  _lte?: Maybe<Scalars['uuid']>;
  _neq?: Maybe<Scalars['uuid']>;
  _nin?: Maybe<Array<Scalars['uuid']>>;
};

export type GetRoomsTestQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRoomsTestQueryQuery = (
  { __typename?: 'query_root' }
  & { room: Array<(
    { __typename?: 'room' }
    & Pick<Room, 'id'>
  )> }
);

export type CreateInviteMutationVariables = Exact<{
  email: Scalars['String'];
  roomId?: Maybe<Scalars['uuid']>;
}>;


export type CreateInviteMutation = (
  { __typename?: 'mutation_root' }
  & { invite?: Maybe<(
    { __typename?: 'room_invites' }
    & Pick<Room_Invites, 'id' | 'email'>
    & { usedAt: Room_Invites['used_at'] }
  )> }
);

export type GetRoomInvitesQueryVariables = Exact<{
  roomId: Scalars['uuid'];
}>;


export type GetRoomInvitesQuery = (
  { __typename?: 'query_root' }
  & { invites: Array<(
    { __typename?: 'room_invites' }
    & Pick<Room_Invites, 'id' | 'email'>
    & { usedAt: Room_Invites['used_at'] }
  )> }
);

export type AcceptInviteMutationVariables = Exact<{
  token: Scalars['String'];
}>;


export type AcceptInviteMutation = (
  { __typename?: 'mutation_root' }
  & { invite?: Maybe<(
    { __typename?: 'InviteAcceptResponse' }
    & { team?: Maybe<(
      { __typename?: 'team' }
      & Pick<Team, 'id'>
    )> }
  )> }
);

export type RoomBasicInfoFragment = (
  { __typename?: 'room' }
  & Pick<Room, 'id' | 'name' | 'space_id'>
  & { members: Array<(
    { __typename?: 'room_member' }
    & { user: (
      { __typename?: 'user' }
      & UserBasicInfoFragment
    ) }
  )> }
);

export type RoomDetailedInfoFragment = (
  { __typename?: 'room' }
  & Pick<Room, 'id' | 'name' | 'space_id'>
  & { members: Array<(
    { __typename?: 'room_member' }
    & { user: (
      { __typename?: 'user' }
      & UserBasicInfoFragment
    ) }
  )>, topics: Array<(
    { __typename?: 'topic' }
    & TopicDetailedInfoFragment
  )> }
);

export type RoomParticipantBasicInfoFragment = (
  { __typename?: 'room_member' }
  & { user: (
    { __typename?: 'user' }
    & UserBasicInfoFragment
  ) }
);

export type GetRoomsQueryVariables = Exact<{
  spaceId: Scalars['uuid'];
}>;


export type GetRoomsQuery = (
  { __typename?: 'query_root' }
  & { room: Array<(
    { __typename?: 'room' }
    & RoomBasicInfoFragment
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

export type CreateRoomMutationVariables = Exact<{
  name: Scalars['String'];
  spaceId: Scalars['uuid'];
  slug: Scalars['String'];
}>;


export type CreateRoomMutation = (
  { __typename?: 'mutation_root' }
  & { room?: Maybe<(
    { __typename?: 'room' }
    & RoomDetailedInfoFragment
  )> }
);

export type RoomParticipantsQueryVariables = Exact<{
  roomId: Scalars['uuid'];
}>;


export type RoomParticipantsQuery = (
  { __typename?: 'query_root' }
  & { members: Array<(
    { __typename?: 'room_member' }
    & RoomParticipantBasicInfoFragment
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

export type SearchResultFragment = (
  { __typename?: 'full_text_search' }
  & Pick<Full_Text_Search, 'transcript'>
  & { topicId: Full_Text_Search['topic_id'], topicName: Full_Text_Search['topic_name'], messageId: Full_Text_Search['message_id'], messageContent: Full_Text_Search['message_content'], attachmentName: Full_Text_Search['attachment_name'] }
  & { room?: Maybe<(
    { __typename?: 'room' }
    & Pick<Room, 'id' | 'name'>
    & { space?: Maybe<(
      { __typename?: 'space' }
      & Pick<Space, 'id' | 'name'>
    )> }
  )> }
);

export type GetSearchResultsQueryVariables = Exact<{
  term: Scalars['String'];
}>;


export type GetSearchResultsQuery = (
  { __typename?: 'query_root' }
  & { results: Array<(
    { __typename?: 'full_text_search' }
    & SearchResultFragment
  )> }
);

export type SpaceBasicInfoFragment = (
  { __typename?: 'space' }
  & Pick<Space, 'id' | 'name'>
  & { members: Array<(
    { __typename?: 'space_member' }
    & { user: (
      { __typename?: 'user' }
      & UserBasicInfoFragment
    ) }
  )> }
);

export type SpaceDetailedInfoFragment = (
  { __typename?: 'space' }
  & Pick<Space, 'id' | 'name'>
  & { members: Array<(
    { __typename?: 'space_member' }
    & { user: (
      { __typename?: 'user' }
      & UserBasicInfoFragment
    ) }
  )>, rooms: Array<(
    { __typename?: 'room' }
    & RoomDetailedInfoFragment
  )> }
);

export type GetSpacesQueryVariables = Exact<{
  teamId: Scalars['uuid'];
}>;


export type GetSpacesQuery = (
  { __typename?: 'query_root' }
  & { space: Array<(
    { __typename?: 'space' }
    & SpaceBasicInfoFragment
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

export type CreateSpaceMutationVariables = Exact<{
  name: Scalars['String'];
  teamId: Scalars['uuid'];
  slug: Scalars['String'];
}>;


export type CreateSpaceMutation = (
  { __typename?: 'mutation_root' }
  & { space?: Maybe<(
    { __typename?: 'space' }
    & SpaceBasicInfoFragment
  )> }
);

export type EditSpaceMutationVariables = Exact<{
  name: Scalars['String'];
  spaceId: Scalars['uuid'];
}>;


export type EditSpaceMutation = (
  { __typename?: 'mutation_root' }
  & { space?: Maybe<(
    { __typename?: 'space' }
    & SpaceBasicInfoFragment
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
  & Pick<Team, 'id' | 'name' | 'slug'>
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
  )> }
);

export type CreateTeamMutationVariables = Exact<{
  slug: Scalars['String'];
  name: Scalars['String'];
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

export type TopicDetailedInfoFragment = (
  { __typename?: 'topic' }
  & Pick<Topic, 'id' | 'name' | 'index' | 'slug' | 'closed_at'>
  & { closed_by_user?: Maybe<(
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

export type TopicMessageBasicInfoFragment = (
  { __typename?: 'message' }
  & Pick<Message, 'id' | 'content'>
  & { createdAt: Message['created_at'] }
  & { user: (
    { __typename?: 'user' }
    & UserBasicInfoFragment
  ) }
);

export type AttachmentDetailedInfoFragment = (
  { __typename?: 'attachment' }
  & Pick<Attachment, 'id'>
  & { originalName: Attachment['original_name'], mimeType: Attachment['mime_type'] }
);

export type TopicMessageDetailedInfoFragment = (
  { __typename?: 'message' }
  & Pick<Message, 'id' | 'content' | 'type'>
  & { createdAt: Message['created_at'] }
  & { transcription?: Maybe<(
    { __typename?: 'transcription' }
    & Pick<Transcription, 'status' | 'transcript'>
  )>, user: (
    { __typename?: 'user' }
    & UserBasicInfoFragment
  ), message_attachments: Array<(
    { __typename?: 'message_attachment' }
    & { attachment: (
      { __typename?: 'attachment' }
      & AttachmentDetailedInfoFragment
    ) }
  )> }
);

export type UnreadMessageFragmentFragment = (
  { __typename?: 'unread_messages' }
  & { roomId: Unread_Messages['room_id'], topicId: Unread_Messages['topic_id'], unreadMessages: Unread_Messages['unread_messages'] }
);

export type CreateTopicMutationVariables = Exact<{
  name: Scalars['String'];
  roomId: Scalars['uuid'];
  index: Scalars['String'];
  slug: Scalars['String'];
}>;


export type CreateTopicMutation = (
  { __typename?: 'mutation_root' }
  & { topic?: Maybe<(
    { __typename?: 'topic' }
    & TopicDetailedInfoFragment
  )> }
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
}>;


export type TopicMessagesQuery = (
  { __typename?: 'query_root' }
  & { messages: Array<(
    { __typename?: 'message' }
    & TopicMessageDetailedInfoFragment
  )> }
);

export type CreateMessageMutationVariables = Exact<{
  topicId: Scalars['uuid'];
  content: Scalars['jsonb'];
  type: Message_Type_Enum;
  attachments: Array<Message_Attachment_Insert_Input> | Message_Attachment_Insert_Input;
}>;


export type CreateMessageMutation = (
  { __typename?: 'mutation_root' }
  & { message?: Maybe<(
    { __typename?: 'message' }
    & TopicMessageDetailedInfoFragment
  )> }
);

export type UpdateTextMessageMutationVariables = Exact<{
  id: Scalars['uuid'];
  content: Scalars['jsonb'];
  isDraft: Scalars['Boolean'];
}>;


export type UpdateTextMessageMutation = (
  { __typename?: 'mutation_root' }
  & { update_message?: Maybe<(
    { __typename?: 'message_mutation_response' }
    & { message: Array<(
      { __typename?: 'message' }
      & TopicMessageBasicInfoFragment
    )> }
  )> }
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

export type GetUploadUrlQueryVariables = Exact<{
  fileName: Scalars['String'];
  mimeType: Scalars['String'];
}>;


export type GetUploadUrlQuery = (
  { __typename?: 'query_root' }
  & { uploadUrlInfo?: Maybe<(
    { __typename?: 'GetUploadUrlResponse' }
    & Pick<GetUploadUrlResponse, 'uploadUrl' | 'uuid'>
  )> }
);

export type GetDownloadUrlQueryVariables = Exact<{
  id: Scalars['uuid'];
}>;


export type GetDownloadUrlQuery = (
  { __typename?: 'query_root' }
  & { get_download_url?: Maybe<(
    { __typename?: 'GetDownloadUrlResponse' }
    & Pick<GetDownloadUrlResponse, 'downloadUrl'>
  )> }
);

export type GetAttachmentQueryVariables = Exact<{
  id: Scalars['uuid'];
}>;


export type GetAttachmentQuery = (
  { __typename?: 'query_root' }
  & { attachment?: Maybe<(
    { __typename?: 'attachment' }
    & AttachmentDetailedInfoFragment
  )> }
);

export type AddTopicMemberMutationVariables = Exact<{
  topicId: Scalars['uuid'];
  userId: Scalars['uuid'];
}>;


export type AddTopicMemberMutation = (
  { __typename?: 'mutation_root' }
  & { insert_topic_member_one?: Maybe<(
    { __typename?: 'topic_member' }
    & Pick<Topic_Member, 'topic_id' | 'user_id'>
  )> }
);

export type RemoveTopicMemberMutationVariables = Exact<{
  topicId: Scalars['uuid'];
  userId: Scalars['uuid'];
}>;


export type RemoveTopicMemberMutation = (
  { __typename?: 'mutation_root' }
  & { delete_topic_member?: Maybe<(
    { __typename?: 'topic_member_mutation_response' }
    & Pick<Topic_Member_Mutation_Response, 'affected_rows'>
  )> }
);

export type GetUnreadMessagesQueryVariables = Exact<{
  roomId?: Maybe<Scalars['uuid']>;
}>;


export type GetUnreadMessagesQuery = (
  { __typename?: 'query_root' }
  & { messages: Array<(
    { __typename?: 'unread_messages' }
    & UnreadMessageFragmentFragment
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
    & Pick<Last_Seen_Message, 'message_id'>
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

export type RecentTopicsQueryVariables = Exact<{
  teamId: Scalars['uuid'];
  limit?: Maybe<Scalars['Int']>;
  userId: Scalars['uuid'];
}>;


export type RecentTopicsQuery = (
  { __typename?: 'query_root' }
  & { recentTopics: Array<(
    { __typename?: 'topic' }
    & TopicDetailedInfoFragment
  )> }
);

export type ToggleCloseTopicMutationVariables = Exact<{
  topicId: Scalars['uuid'];
  closedAt?: Maybe<Scalars['timestamp']>;
  closedBy?: Maybe<Scalars['uuid']>;
  summary?: Maybe<Scalars['String']>;
}>;


export type ToggleCloseTopicMutation = (
  { __typename?: 'mutation_root' }
  & { topic?: Maybe<(
    { __typename?: 'topic' }
    & TopicDetailedInfoFragment
  )> }
);

export type UserBasicInfoFragment = (
  { __typename?: 'user' }
  & Pick<User, 'id' | 'name' | 'avatar_url'>
);

export type ChangeCurrentTeamIdMutationVariables = Exact<{
  userId: Scalars['uuid'];
  teamId: Scalars['uuid'];
}>;


export type ChangeCurrentTeamIdMutation = (
  { __typename?: 'mutation_root' }
  & { update_user_by_pk?: Maybe<(
    { __typename?: 'user' }
    & Pick<User, 'id'>
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

export type GetDownloadUrlResponseKeySpecifier = ('downloadUrl' | GetDownloadUrlResponseKeySpecifier)[];
export type GetDownloadUrlResponseFieldPolicy = {
	downloadUrl?: FieldPolicy<any> | FieldReadFunction<any>
};
export type GetUploadUrlResponseKeySpecifier = ('uploadUrl' | 'uuid' | GetUploadUrlResponseKeySpecifier)[];
export type GetUploadUrlResponseFieldPolicy = {
	uploadUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	uuid?: FieldPolicy<any> | FieldReadFunction<any>
};
export type InviteAcceptResponseKeySpecifier = ('invite' | 'invite_id' | 'team' | 'team_id' | InviteAcceptResponseKeySpecifier)[];
export type InviteAcceptResponseFieldPolicy = {
	invite?: FieldPolicy<any> | FieldReadFunction<any>,
	invite_id?: FieldPolicy<any> | FieldReadFunction<any>,
	team?: FieldPolicy<any> | FieldReadFunction<any>,
	team_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UpgradeUserResponseKeySpecifier = ('user' | 'user_id' | UpgradeUserResponseKeySpecifier)[];
export type UpgradeUserResponseFieldPolicy = {
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
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
export type attachmentKeySpecifier = ('created_at' | 'id' | 'mime_type' | 'original_name' | attachmentKeySpecifier)[];
export type attachmentFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	mime_type?: FieldPolicy<any> | FieldReadFunction<any>,
	original_name?: FieldPolicy<any> | FieldReadFunction<any>
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
export type attachment_max_fieldsKeySpecifier = ('created_at' | 'id' | 'mime_type' | 'original_name' | attachment_max_fieldsKeySpecifier)[];
export type attachment_max_fieldsFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	mime_type?: FieldPolicy<any> | FieldReadFunction<any>,
	original_name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type attachment_min_fieldsKeySpecifier = ('created_at' | 'id' | 'mime_type' | 'original_name' | attachment_min_fieldsKeySpecifier)[];
export type attachment_min_fieldsFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	mime_type?: FieldPolicy<any> | FieldReadFunction<any>,
	original_name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type attachment_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | attachment_mutation_responseKeySpecifier)[];
export type attachment_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type full_text_searchKeySpecifier = ('attachment_id' | 'attachment_name' | 'message_content' | 'message_created_at' | 'message_id' | 'message_type' | 'room' | 'room_id' | 'room_name' | 'topic_id' | 'topic_name' | 'transcript' | 'transcription_id' | 'user_id' | full_text_searchKeySpecifier)[];
export type full_text_searchFieldPolicy = {
	attachment_id?: FieldPolicy<any> | FieldReadFunction<any>,
	attachment_name?: FieldPolicy<any> | FieldReadFunction<any>,
	message_content?: FieldPolicy<any> | FieldReadFunction<any>,
	message_created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	message_id?: FieldPolicy<any> | FieldReadFunction<any>,
	message_type?: FieldPolicy<any> | FieldReadFunction<any>,
	room?: FieldPolicy<any> | FieldReadFunction<any>,
	room_id?: FieldPolicy<any> | FieldReadFunction<any>,
	room_name?: FieldPolicy<any> | FieldReadFunction<any>,
	topic_id?: FieldPolicy<any> | FieldReadFunction<any>,
	topic_name?: FieldPolicy<any> | FieldReadFunction<any>,
	transcript?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription_id?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type full_text_search_aggregateKeySpecifier = ('aggregate' | 'nodes' | full_text_search_aggregateKeySpecifier)[];
export type full_text_search_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type full_text_search_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | full_text_search_aggregate_fieldsKeySpecifier)[];
export type full_text_search_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type full_text_search_max_fieldsKeySpecifier = ('attachment_id' | 'attachment_name' | 'message_content' | 'message_created_at' | 'message_id' | 'message_type' | 'room_id' | 'room_name' | 'topic_id' | 'topic_name' | 'transcript' | 'transcription_id' | 'user_id' | full_text_search_max_fieldsKeySpecifier)[];
export type full_text_search_max_fieldsFieldPolicy = {
	attachment_id?: FieldPolicy<any> | FieldReadFunction<any>,
	attachment_name?: FieldPolicy<any> | FieldReadFunction<any>,
	message_content?: FieldPolicy<any> | FieldReadFunction<any>,
	message_created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	message_id?: FieldPolicy<any> | FieldReadFunction<any>,
	message_type?: FieldPolicy<any> | FieldReadFunction<any>,
	room_id?: FieldPolicy<any> | FieldReadFunction<any>,
	room_name?: FieldPolicy<any> | FieldReadFunction<any>,
	topic_id?: FieldPolicy<any> | FieldReadFunction<any>,
	topic_name?: FieldPolicy<any> | FieldReadFunction<any>,
	transcript?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription_id?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type full_text_search_min_fieldsKeySpecifier = ('attachment_id' | 'attachment_name' | 'message_content' | 'message_created_at' | 'message_id' | 'message_type' | 'room_id' | 'room_name' | 'topic_id' | 'topic_name' | 'transcript' | 'transcription_id' | 'user_id' | full_text_search_min_fieldsKeySpecifier)[];
export type full_text_search_min_fieldsFieldPolicy = {
	attachment_id?: FieldPolicy<any> | FieldReadFunction<any>,
	attachment_name?: FieldPolicy<any> | FieldReadFunction<any>,
	message_content?: FieldPolicy<any> | FieldReadFunction<any>,
	message_created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	message_id?: FieldPolicy<any> | FieldReadFunction<any>,
	message_type?: FieldPolicy<any> | FieldReadFunction<any>,
	room_id?: FieldPolicy<any> | FieldReadFunction<any>,
	room_name?: FieldPolicy<any> | FieldReadFunction<any>,
	topic_id?: FieldPolicy<any> | FieldReadFunction<any>,
	topic_name?: FieldPolicy<any> | FieldReadFunction<any>,
	transcript?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription_id?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type full_text_search_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | full_text_search_mutation_responseKeySpecifier)[];
export type full_text_search_mutation_responseFieldPolicy = {
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
export type messageKeySpecifier = ('content' | 'created_at' | 'id' | 'is_draft' | 'message_attachments' | 'message_attachments_aggregate' | 'message_type' | 'topic' | 'topic_id' | 'transcription' | 'transcription_id' | 'type' | 'user' | 'user_id' | messageKeySpecifier)[];
export type messageFieldPolicy = {
	content?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	is_draft?: FieldPolicy<any> | FieldReadFunction<any>,
	message_attachments?: FieldPolicy<any> | FieldReadFunction<any>,
	message_attachments_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	message_type?: FieldPolicy<any> | FieldReadFunction<any>,
	topic?: FieldPolicy<any> | FieldReadFunction<any>,
	topic_id?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription_id?: FieldPolicy<any> | FieldReadFunction<any>,
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
export type message_attachmentKeySpecifier = ('attachment' | 'attachment_id' | 'message' | 'message_id' | message_attachmentKeySpecifier)[];
export type message_attachmentFieldPolicy = {
	attachment?: FieldPolicy<any> | FieldReadFunction<any>,
	attachment_id?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	message_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type message_attachment_aggregateKeySpecifier = ('aggregate' | 'nodes' | message_attachment_aggregateKeySpecifier)[];
export type message_attachment_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type message_attachment_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | message_attachment_aggregate_fieldsKeySpecifier)[];
export type message_attachment_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type message_attachment_max_fieldsKeySpecifier = ('attachment_id' | 'message_id' | message_attachment_max_fieldsKeySpecifier)[];
export type message_attachment_max_fieldsFieldPolicy = {
	attachment_id?: FieldPolicy<any> | FieldReadFunction<any>,
	message_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type message_attachment_min_fieldsKeySpecifier = ('attachment_id' | 'message_id' | message_attachment_min_fieldsKeySpecifier)[];
export type message_attachment_min_fieldsFieldPolicy = {
	attachment_id?: FieldPolicy<any> | FieldReadFunction<any>,
	message_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type message_attachment_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | message_attachment_mutation_responseKeySpecifier)[];
export type message_attachment_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type message_full_textKeySpecifier = ('content_txt' | 'created_at' | 'id' | 'topic_id' | 'transcription_id' | 'type' | 'user_id' | message_full_textKeySpecifier)[];
export type message_full_textFieldPolicy = {
	content_txt?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	topic_id?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription_id?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type message_full_text_aggregateKeySpecifier = ('aggregate' | 'nodes' | message_full_text_aggregateKeySpecifier)[];
export type message_full_text_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type message_full_text_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | message_full_text_aggregate_fieldsKeySpecifier)[];
export type message_full_text_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type message_full_text_max_fieldsKeySpecifier = ('content_txt' | 'created_at' | 'id' | 'topic_id' | 'transcription_id' | 'type' | 'user_id' | message_full_text_max_fieldsKeySpecifier)[];
export type message_full_text_max_fieldsFieldPolicy = {
	content_txt?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	topic_id?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription_id?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type message_full_text_min_fieldsKeySpecifier = ('content_txt' | 'created_at' | 'id' | 'topic_id' | 'transcription_id' | 'type' | 'user_id' | message_full_text_min_fieldsKeySpecifier)[];
export type message_full_text_min_fieldsFieldPolicy = {
	content_txt?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	topic_id?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription_id?: FieldPolicy<any> | FieldReadFunction<any>,
	type?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type message_max_fieldsKeySpecifier = ('created_at' | 'id' | 'topic_id' | 'transcription_id' | 'user_id' | message_max_fieldsKeySpecifier)[];
export type message_max_fieldsFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	topic_id?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription_id?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type message_min_fieldsKeySpecifier = ('created_at' | 'id' | 'topic_id' | 'transcription_id' | 'user_id' | message_min_fieldsKeySpecifier)[];
export type message_min_fieldsFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	topic_id?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription_id?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type message_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | message_mutation_responseKeySpecifier)[];
export type message_mutation_responseFieldPolicy = {
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
export type mutation_rootKeySpecifier = ('accept_invite' | 'delete_account' | 'delete_account_by_pk' | 'delete_attachment' | 'delete_attachment_by_pk' | 'delete_full_text_search' | 'delete_last_seen_message' | 'delete_last_seen_message_by_pk' | 'delete_membership_status' | 'delete_membership_status_by_pk' | 'delete_message' | 'delete_message_attachment' | 'delete_message_attachment_by_pk' | 'delete_message_by_pk' | 'delete_message_type' | 'delete_message_type_by_pk' | 'delete_room' | 'delete_room_by_pk' | 'delete_room_invites' | 'delete_room_invites_by_pk' | 'delete_room_member' | 'delete_room_member_by_pk' | 'delete_space' | 'delete_space_by_pk' | 'delete_space_member' | 'delete_space_member_by_pk' | 'delete_team' | 'delete_team_by_pk' | 'delete_team_invitation' | 'delete_team_invitation_by_pk' | 'delete_team_member' | 'delete_team_member_by_pk' | 'delete_topic' | 'delete_topic_by_pk' | 'delete_topic_member' | 'delete_topic_member_by_pk' | 'delete_transcription' | 'delete_transcription_by_pk' | 'delete_transcription_status' | 'delete_transcription_status_by_pk' | 'delete_user' | 'delete_user_by_pk' | 'insert_account' | 'insert_account_one' | 'insert_attachment' | 'insert_attachment_one' | 'insert_full_text_search' | 'insert_full_text_search_one' | 'insert_last_seen_message' | 'insert_last_seen_message_one' | 'insert_membership_status' | 'insert_membership_status_one' | 'insert_message' | 'insert_message_attachment' | 'insert_message_attachment_one' | 'insert_message_one' | 'insert_message_type' | 'insert_message_type_one' | 'insert_room' | 'insert_room_invites' | 'insert_room_invites_one' | 'insert_room_member' | 'insert_room_member_one' | 'insert_room_one' | 'insert_space' | 'insert_space_member' | 'insert_space_member_one' | 'insert_space_one' | 'insert_team' | 'insert_team_invitation' | 'insert_team_invitation_one' | 'insert_team_member' | 'insert_team_member_one' | 'insert_team_one' | 'insert_topic' | 'insert_topic_member' | 'insert_topic_member_one' | 'insert_topic_one' | 'insert_transcription' | 'insert_transcription_one' | 'insert_transcription_status' | 'insert_transcription_status_one' | 'insert_user' | 'insert_user_one' | 'update_account' | 'update_account_by_pk' | 'update_attachment' | 'update_attachment_by_pk' | 'update_full_text_search' | 'update_last_seen_message' | 'update_last_seen_message_by_pk' | 'update_membership_status' | 'update_membership_status_by_pk' | 'update_message' | 'update_message_attachment' | 'update_message_attachment_by_pk' | 'update_message_by_pk' | 'update_message_type' | 'update_message_type_by_pk' | 'update_room' | 'update_room_by_pk' | 'update_room_invites' | 'update_room_invites_by_pk' | 'update_room_member' | 'update_room_member_by_pk' | 'update_space' | 'update_space_by_pk' | 'update_space_member' | 'update_space_member_by_pk' | 'update_team' | 'update_team_by_pk' | 'update_team_invitation' | 'update_team_invitation_by_pk' | 'update_team_member' | 'update_team_member_by_pk' | 'update_topic' | 'update_topic_by_pk' | 'update_topic_member' | 'update_topic_member_by_pk' | 'update_transcription' | 'update_transcription_by_pk' | 'update_transcription_status' | 'update_transcription_status_by_pk' | 'update_user' | 'update_user_by_pk' | 'upgrade_current_user' | mutation_rootKeySpecifier)[];
export type mutation_rootFieldPolicy = {
	accept_invite?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_account?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_account_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_attachment?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_attachment_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_full_text_search?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_last_seen_message?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_last_seen_message_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_membership_status?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_membership_status_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_message?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_message_attachment?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_message_attachment_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_message_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_message_type?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_message_type_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_room?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_room_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_room_invites?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_room_invites_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_room_member?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_room_member_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_space?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_space_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_space_member?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_space_member_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_team?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_team_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_team_invitation?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_team_invitation_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_team_member?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_team_member_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
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
	insert_account?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_account_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_attachment?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_attachment_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_full_text_search?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_full_text_search_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_last_seen_message?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_last_seen_message_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_membership_status?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_membership_status_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_message?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_message_attachment?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_message_attachment_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_message_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_message_type?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_message_type_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_room?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_room_invites?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_room_invites_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_room_member?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_room_member_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_room_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_space?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_space_member?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_space_member_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_space_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_team?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_team_invitation?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_team_invitation_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_team_member?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_team_member_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_team_one?: FieldPolicy<any> | FieldReadFunction<any>,
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
	update_account?: FieldPolicy<any> | FieldReadFunction<any>,
	update_account_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_attachment?: FieldPolicy<any> | FieldReadFunction<any>,
	update_attachment_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_full_text_search?: FieldPolicy<any> | FieldReadFunction<any>,
	update_last_seen_message?: FieldPolicy<any> | FieldReadFunction<any>,
	update_last_seen_message_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_membership_status?: FieldPolicy<any> | FieldReadFunction<any>,
	update_membership_status_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_message?: FieldPolicy<any> | FieldReadFunction<any>,
	update_message_attachment?: FieldPolicy<any> | FieldReadFunction<any>,
	update_message_attachment_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_message_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_message_type?: FieldPolicy<any> | FieldReadFunction<any>,
	update_message_type_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_room?: FieldPolicy<any> | FieldReadFunction<any>,
	update_room_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_room_invites?: FieldPolicy<any> | FieldReadFunction<any>,
	update_room_invites_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_room_member?: FieldPolicy<any> | FieldReadFunction<any>,
	update_room_member_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_space?: FieldPolicy<any> | FieldReadFunction<any>,
	update_space_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_space_member?: FieldPolicy<any> | FieldReadFunction<any>,
	update_space_member_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_team?: FieldPolicy<any> | FieldReadFunction<any>,
	update_team_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_team_invitation?: FieldPolicy<any> | FieldReadFunction<any>,
	update_team_invitation_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_team_member?: FieldPolicy<any> | FieldReadFunction<any>,
	update_team_member_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
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
	upgrade_current_user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type query_rootKeySpecifier = ('account' | 'account_aggregate' | 'account_by_pk' | 'attachment' | 'attachment_aggregate' | 'attachment_by_pk' | 'full_text_search' | 'full_text_search_aggregate' | 'get_download_url' | 'get_upload_url' | 'last_seen_message' | 'last_seen_message_aggregate' | 'last_seen_message_by_pk' | 'membership_status' | 'membership_status_aggregate' | 'membership_status_by_pk' | 'message' | 'message_aggregate' | 'message_attachment' | 'message_attachment_aggregate' | 'message_attachment_by_pk' | 'message_by_pk' | 'message_full_text' | 'message_full_text_aggregate' | 'message_type' | 'message_type_aggregate' | 'message_type_by_pk' | 'room' | 'room_aggregate' | 'room_by_pk' | 'room_invites' | 'room_invites_aggregate' | 'room_invites_by_pk' | 'room_member' | 'room_member_aggregate' | 'room_member_by_pk' | 'search_full_text' | 'search_full_text_aggregate' | 'search_full_text_topic' | 'search_full_text_topic_aggregate' | 'space' | 'space_aggregate' | 'space_by_pk' | 'space_member' | 'space_member_aggregate' | 'space_member_by_pk' | 'team' | 'team_aggregate' | 'team_by_pk' | 'team_invitation' | 'team_invitation_aggregate' | 'team_invitation_by_pk' | 'team_member' | 'team_member_aggregate' | 'team_member_by_pk' | 'topic' | 'topic_aggregate' | 'topic_by_pk' | 'topic_member' | 'topic_member_aggregate' | 'topic_member_by_pk' | 'transcription' | 'transcription_aggregate' | 'transcription_by_pk' | 'transcription_full_text' | 'transcription_full_text_aggregate' | 'transcription_status' | 'transcription_status_aggregate' | 'transcription_status_by_pk' | 'unread_messages' | 'unread_messages_aggregate' | 'user' | 'user_aggregate' | 'user_by_pk' | query_rootKeySpecifier)[];
export type query_rootFieldPolicy = {
	account?: FieldPolicy<any> | FieldReadFunction<any>,
	account_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	account_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	attachment?: FieldPolicy<any> | FieldReadFunction<any>,
	attachment_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	attachment_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	full_text_search?: FieldPolicy<any> | FieldReadFunction<any>,
	full_text_search_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	get_download_url?: FieldPolicy<any> | FieldReadFunction<any>,
	get_upload_url?: FieldPolicy<any> | FieldReadFunction<any>,
	last_seen_message?: FieldPolicy<any> | FieldReadFunction<any>,
	last_seen_message_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	last_seen_message_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	membership_status?: FieldPolicy<any> | FieldReadFunction<any>,
	membership_status_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	membership_status_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	message_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	message_attachment?: FieldPolicy<any> | FieldReadFunction<any>,
	message_attachment_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	message_attachment_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	message_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	message_full_text?: FieldPolicy<any> | FieldReadFunction<any>,
	message_full_text_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	message_type?: FieldPolicy<any> | FieldReadFunction<any>,
	message_type_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	message_type_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	room?: FieldPolicy<any> | FieldReadFunction<any>,
	room_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	room_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	room_invites?: FieldPolicy<any> | FieldReadFunction<any>,
	room_invites_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	room_invites_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	room_member?: FieldPolicy<any> | FieldReadFunction<any>,
	room_member_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	room_member_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	search_full_text?: FieldPolicy<any> | FieldReadFunction<any>,
	search_full_text_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	search_full_text_topic?: FieldPolicy<any> | FieldReadFunction<any>,
	search_full_text_topic_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	space?: FieldPolicy<any> | FieldReadFunction<any>,
	space_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	space_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	space_member?: FieldPolicy<any> | FieldReadFunction<any>,
	space_member_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	space_member_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	team?: FieldPolicy<any> | FieldReadFunction<any>,
	team_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	team_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	team_invitation?: FieldPolicy<any> | FieldReadFunction<any>,
	team_invitation_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	team_invitation_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	team_member?: FieldPolicy<any> | FieldReadFunction<any>,
	team_member_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	team_member_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	topic?: FieldPolicy<any> | FieldReadFunction<any>,
	topic_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	topic_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	topic_member?: FieldPolicy<any> | FieldReadFunction<any>,
	topic_member_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	topic_member_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription_full_text?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription_full_text_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription_status?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription_status_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription_status_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	unread_messages?: FieldPolicy<any> | FieldReadFunction<any>,
	unread_messages_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	user_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	user_by_pk?: FieldPolicy<any> | FieldReadFunction<any>
};
export type roomKeySpecifier = ('created_at' | 'creator' | 'creator_id' | 'deadline' | 'finished_at' | 'id' | 'members' | 'members_aggregate' | 'name' | 'notification_job_id' | 'room_invites' | 'room_invites_aggregate' | 'slug' | 'space' | 'space_id' | 'summary' | 'topics' | 'topics_aggregate' | roomKeySpecifier)[];
export type roomFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	creator?: FieldPolicy<any> | FieldReadFunction<any>,
	creator_id?: FieldPolicy<any> | FieldReadFunction<any>,
	deadline?: FieldPolicy<any> | FieldReadFunction<any>,
	finished_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	members?: FieldPolicy<any> | FieldReadFunction<any>,
	members_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	notification_job_id?: FieldPolicy<any> | FieldReadFunction<any>,
	room_invites?: FieldPolicy<any> | FieldReadFunction<any>,
	room_invites_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
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
export type room_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | room_aggregate_fieldsKeySpecifier)[];
export type room_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type room_invitesKeySpecifier = ('code' | 'created_at' | 'email' | 'id' | 'inviter' | 'inviter_id' | 'room' | 'room_id' | 'used_at' | room_invitesKeySpecifier)[];
export type room_invitesFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	inviter?: FieldPolicy<any> | FieldReadFunction<any>,
	inviter_id?: FieldPolicy<any> | FieldReadFunction<any>,
	room?: FieldPolicy<any> | FieldReadFunction<any>,
	room_id?: FieldPolicy<any> | FieldReadFunction<any>,
	used_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type room_invites_aggregateKeySpecifier = ('aggregate' | 'nodes' | room_invites_aggregateKeySpecifier)[];
export type room_invites_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type room_invites_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | room_invites_aggregate_fieldsKeySpecifier)[];
export type room_invites_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type room_invites_max_fieldsKeySpecifier = ('code' | 'created_at' | 'email' | 'id' | 'inviter_id' | 'room_id' | 'used_at' | room_invites_max_fieldsKeySpecifier)[];
export type room_invites_max_fieldsFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	inviter_id?: FieldPolicy<any> | FieldReadFunction<any>,
	room_id?: FieldPolicy<any> | FieldReadFunction<any>,
	used_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type room_invites_min_fieldsKeySpecifier = ('code' | 'created_at' | 'email' | 'id' | 'inviter_id' | 'room_id' | 'used_at' | room_invites_min_fieldsKeySpecifier)[];
export type room_invites_min_fieldsFieldPolicy = {
	code?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	inviter_id?: FieldPolicy<any> | FieldReadFunction<any>,
	room_id?: FieldPolicy<any> | FieldReadFunction<any>,
	used_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type room_invites_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | room_invites_mutation_responseKeySpecifier)[];
export type room_invites_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type room_max_fieldsKeySpecifier = ('created_at' | 'creator_id' | 'deadline' | 'finished_at' | 'id' | 'name' | 'notification_job_id' | 'slug' | 'space_id' | 'summary' | room_max_fieldsKeySpecifier)[];
export type room_max_fieldsFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	creator_id?: FieldPolicy<any> | FieldReadFunction<any>,
	deadline?: FieldPolicy<any> | FieldReadFunction<any>,
	finished_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	notification_job_id?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
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
export type room_min_fieldsKeySpecifier = ('created_at' | 'creator_id' | 'deadline' | 'finished_at' | 'id' | 'name' | 'notification_job_id' | 'slug' | 'space_id' | 'summary' | room_min_fieldsKeySpecifier)[];
export type room_min_fieldsFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	creator_id?: FieldPolicy<any> | FieldReadFunction<any>,
	deadline?: FieldPolicy<any> | FieldReadFunction<any>,
	finished_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	notification_job_id?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>,
	space_id?: FieldPolicy<any> | FieldReadFunction<any>,
	summary?: FieldPolicy<any> | FieldReadFunction<any>
};
export type room_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | room_mutation_responseKeySpecifier)[];
export type room_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
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
export type subscription_rootKeySpecifier = ('account' | 'account_aggregate' | 'account_by_pk' | 'attachment' | 'attachment_aggregate' | 'attachment_by_pk' | 'full_text_search' | 'full_text_search_aggregate' | 'get_download_url' | 'get_upload_url' | 'last_seen_message' | 'last_seen_message_aggregate' | 'last_seen_message_by_pk' | 'membership_status' | 'membership_status_aggregate' | 'membership_status_by_pk' | 'message' | 'message_aggregate' | 'message_attachment' | 'message_attachment_aggregate' | 'message_attachment_by_pk' | 'message_by_pk' | 'message_full_text' | 'message_full_text_aggregate' | 'message_type' | 'message_type_aggregate' | 'message_type_by_pk' | 'room' | 'room_aggregate' | 'room_by_pk' | 'room_invites' | 'room_invites_aggregate' | 'room_invites_by_pk' | 'room_member' | 'room_member_aggregate' | 'room_member_by_pk' | 'search_full_text' | 'search_full_text_aggregate' | 'search_full_text_topic' | 'search_full_text_topic_aggregate' | 'space' | 'space_aggregate' | 'space_by_pk' | 'space_member' | 'space_member_aggregate' | 'space_member_by_pk' | 'team' | 'team_aggregate' | 'team_by_pk' | 'team_invitation' | 'team_invitation_aggregate' | 'team_invitation_by_pk' | 'team_member' | 'team_member_aggregate' | 'team_member_by_pk' | 'topic' | 'topic_aggregate' | 'topic_by_pk' | 'topic_member' | 'topic_member_aggregate' | 'topic_member_by_pk' | 'transcription' | 'transcription_aggregate' | 'transcription_by_pk' | 'transcription_full_text' | 'transcription_full_text_aggregate' | 'transcription_status' | 'transcription_status_aggregate' | 'transcription_status_by_pk' | 'unread_messages' | 'unread_messages_aggregate' | 'user' | 'user_aggregate' | 'user_by_pk' | subscription_rootKeySpecifier)[];
export type subscription_rootFieldPolicy = {
	account?: FieldPolicy<any> | FieldReadFunction<any>,
	account_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	account_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	attachment?: FieldPolicy<any> | FieldReadFunction<any>,
	attachment_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	attachment_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	full_text_search?: FieldPolicy<any> | FieldReadFunction<any>,
	full_text_search_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	get_download_url?: FieldPolicy<any> | FieldReadFunction<any>,
	get_upload_url?: FieldPolicy<any> | FieldReadFunction<any>,
	last_seen_message?: FieldPolicy<any> | FieldReadFunction<any>,
	last_seen_message_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	last_seen_message_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	membership_status?: FieldPolicy<any> | FieldReadFunction<any>,
	membership_status_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	membership_status_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	message_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	message_attachment?: FieldPolicy<any> | FieldReadFunction<any>,
	message_attachment_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	message_attachment_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	message_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	message_full_text?: FieldPolicy<any> | FieldReadFunction<any>,
	message_full_text_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	message_type?: FieldPolicy<any> | FieldReadFunction<any>,
	message_type_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	message_type_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	room?: FieldPolicy<any> | FieldReadFunction<any>,
	room_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	room_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	room_invites?: FieldPolicy<any> | FieldReadFunction<any>,
	room_invites_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	room_invites_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	room_member?: FieldPolicy<any> | FieldReadFunction<any>,
	room_member_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	room_member_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	search_full_text?: FieldPolicy<any> | FieldReadFunction<any>,
	search_full_text_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	search_full_text_topic?: FieldPolicy<any> | FieldReadFunction<any>,
	search_full_text_topic_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	space?: FieldPolicy<any> | FieldReadFunction<any>,
	space_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	space_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	space_member?: FieldPolicy<any> | FieldReadFunction<any>,
	space_member_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	space_member_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	team?: FieldPolicy<any> | FieldReadFunction<any>,
	team_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	team_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	team_invitation?: FieldPolicy<any> | FieldReadFunction<any>,
	team_invitation_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	team_invitation_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	team_member?: FieldPolicy<any> | FieldReadFunction<any>,
	team_member_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	team_member_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	topic?: FieldPolicy<any> | FieldReadFunction<any>,
	topic_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	topic_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	topic_member?: FieldPolicy<any> | FieldReadFunction<any>,
	topic_member_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	topic_member_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription_full_text?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription_full_text_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription_status?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription_status_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription_status_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	unread_messages?: FieldPolicy<any> | FieldReadFunction<any>,
	unread_messages_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	user_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	user_by_pk?: FieldPolicy<any> | FieldReadFunction<any>
};
export type teamKeySpecifier = ('id' | 'invitations' | 'invitations_aggregate' | 'memberships' | 'memberships_aggregate' | 'name' | 'owner' | 'owner_id' | 'slug' | 'spaces' | 'spaces_aggregate' | teamKeySpecifier)[];
export type teamFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	invitations?: FieldPolicy<any> | FieldReadFunction<any>,
	invitations_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	memberships?: FieldPolicy<any> | FieldReadFunction<any>,
	memberships_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	owner?: FieldPolicy<any> | FieldReadFunction<any>,
	owner_id?: FieldPolicy<any> | FieldReadFunction<any>,
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
export type team_invitationKeySpecifier = ('created_at' | 'email' | 'id' | 'inviting_user' | 'inviting_user_id' | 'team' | 'team_id' | 'token' | 'used_at' | team_invitationKeySpecifier)[];
export type team_invitationFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	inviting_user?: FieldPolicy<any> | FieldReadFunction<any>,
	inviting_user_id?: FieldPolicy<any> | FieldReadFunction<any>,
	team?: FieldPolicy<any> | FieldReadFunction<any>,
	team_id?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	used_at?: FieldPolicy<any> | FieldReadFunction<any>
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
export type team_invitation_max_fieldsKeySpecifier = ('created_at' | 'email' | 'id' | 'inviting_user_id' | 'team_id' | 'token' | 'used_at' | team_invitation_max_fieldsKeySpecifier)[];
export type team_invitation_max_fieldsFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	inviting_user_id?: FieldPolicy<any> | FieldReadFunction<any>,
	team_id?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	used_at?: FieldPolicy<any> | FieldReadFunction<any>
};
export type team_invitation_min_fieldsKeySpecifier = ('created_at' | 'email' | 'id' | 'inviting_user_id' | 'team_id' | 'token' | 'used_at' | team_invitation_min_fieldsKeySpecifier)[];
export type team_invitation_min_fieldsFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	inviting_user_id?: FieldPolicy<any> | FieldReadFunction<any>,
	team_id?: FieldPolicy<any> | FieldReadFunction<any>,
	token?: FieldPolicy<any> | FieldReadFunction<any>,
	used_at?: FieldPolicy<any> | FieldReadFunction<any>
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
export type topicKeySpecifier = ('closed_at' | 'closed_by' | 'closed_by_user' | 'closing_summary' | 'id' | 'index' | 'members' | 'members_aggregate' | 'messages' | 'messages_aggregate' | 'name' | 'room' | 'room_id' | 'slug' | topicKeySpecifier)[];
export type topicFieldPolicy = {
	closed_at?: FieldPolicy<any> | FieldReadFunction<any>,
	closed_by?: FieldPolicy<any> | FieldReadFunction<any>,
	closed_by_user?: FieldPolicy<any> | FieldReadFunction<any>,
	closing_summary?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	index?: FieldPolicy<any> | FieldReadFunction<any>,
	members?: FieldPolicy<any> | FieldReadFunction<any>,
	members_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	messages?: FieldPolicy<any> | FieldReadFunction<any>,
	messages_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
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
export type topic_max_fieldsKeySpecifier = ('closed_at' | 'closed_by' | 'closing_summary' | 'id' | 'index' | 'name' | 'room_id' | 'slug' | topic_max_fieldsKeySpecifier)[];
export type topic_max_fieldsFieldPolicy = {
	closed_at?: FieldPolicy<any> | FieldReadFunction<any>,
	closed_by?: FieldPolicy<any> | FieldReadFunction<any>,
	closing_summary?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	index?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
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
export type topic_min_fieldsKeySpecifier = ('closed_at' | 'closed_by' | 'closing_summary' | 'id' | 'index' | 'name' | 'room_id' | 'slug' | topic_min_fieldsKeySpecifier)[];
export type topic_min_fieldsFieldPolicy = {
	closed_at?: FieldPolicy<any> | FieldReadFunction<any>,
	closed_by?: FieldPolicy<any> | FieldReadFunction<any>,
	closing_summary?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	index?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	room_id?: FieldPolicy<any> | FieldReadFunction<any>,
	slug?: FieldPolicy<any> | FieldReadFunction<any>
};
export type topic_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | topic_mutation_responseKeySpecifier)[];
export type topic_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type transcriptionKeySpecifier = ('created_at' | 'id' | 'sonix_media_id' | 'status' | 'transcript' | 'updated_at' | transcriptionKeySpecifier)[];
export type transcriptionFieldPolicy = {
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
export type transcription_full_textKeySpecifier = ('transcript' | 'transcription_id' | transcription_full_textKeySpecifier)[];
export type transcription_full_textFieldPolicy = {
	transcript?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type transcription_full_text_aggregateKeySpecifier = ('aggregate' | 'nodes' | transcription_full_text_aggregateKeySpecifier)[];
export type transcription_full_text_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type transcription_full_text_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | transcription_full_text_aggregate_fieldsKeySpecifier)[];
export type transcription_full_text_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type transcription_full_text_max_fieldsKeySpecifier = ('transcript' | 'transcription_id' | transcription_full_text_max_fieldsKeySpecifier)[];
export type transcription_full_text_max_fieldsFieldPolicy = {
	transcript?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type transcription_full_text_min_fieldsKeySpecifier = ('transcript' | 'transcription_id' | transcription_full_text_min_fieldsKeySpecifier)[];
export type transcription_full_text_min_fieldsFieldPolicy = {
	transcript?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription_id?: FieldPolicy<any> | FieldReadFunction<any>
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
export type userKeySpecifier = ('avatar_url' | 'created_at' | 'created_rooms' | 'created_rooms_aggregate' | 'created_team_invitations' | 'created_team_invitations_aggregate' | 'current_team' | 'current_team_id' | 'email' | 'email_verified' | 'id' | 'invites' | 'invites_aggregate' | 'messages' | 'messages_aggregate' | 'name' | 'owned_teams' | 'owned_teams_aggregate' | 'rooms' | 'rooms_aggregate' | 'space_memberships' | 'space_memberships_aggregate' | 'team_memberships' | 'team_memberships_aggregate' | 'topic_memberships' | 'topic_memberships_aggregate' | userKeySpecifier)[];
export type userFieldPolicy = {
	avatar_url?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	created_rooms?: FieldPolicy<any> | FieldReadFunction<any>,
	created_rooms_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	created_team_invitations?: FieldPolicy<any> | FieldReadFunction<any>,
	created_team_invitations_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	current_team?: FieldPolicy<any> | FieldReadFunction<any>,
	current_team_id?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	email_verified?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	invites?: FieldPolicy<any> | FieldReadFunction<any>,
	invites_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	messages?: FieldPolicy<any> | FieldReadFunction<any>,
	messages_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
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
export type TypedTypePolicies = TypePolicies & {
	GetDownloadUrlResponse?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GetDownloadUrlResponseKeySpecifier | (() => undefined | GetDownloadUrlResponseKeySpecifier),
		fields?: GetDownloadUrlResponseFieldPolicy,
	},
	GetUploadUrlResponse?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | GetUploadUrlResponseKeySpecifier | (() => undefined | GetUploadUrlResponseKeySpecifier),
		fields?: GetUploadUrlResponseFieldPolicy,
	},
	InviteAcceptResponse?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | InviteAcceptResponseKeySpecifier | (() => undefined | InviteAcceptResponseKeySpecifier),
		fields?: InviteAcceptResponseFieldPolicy,
	},
	UpgradeUserResponse?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UpgradeUserResponseKeySpecifier | (() => undefined | UpgradeUserResponseKeySpecifier),
		fields?: UpgradeUserResponseFieldPolicy,
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
	full_text_search?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | full_text_searchKeySpecifier | (() => undefined | full_text_searchKeySpecifier),
		fields?: full_text_searchFieldPolicy,
	},
	full_text_search_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | full_text_search_aggregateKeySpecifier | (() => undefined | full_text_search_aggregateKeySpecifier),
		fields?: full_text_search_aggregateFieldPolicy,
	},
	full_text_search_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | full_text_search_aggregate_fieldsKeySpecifier | (() => undefined | full_text_search_aggregate_fieldsKeySpecifier),
		fields?: full_text_search_aggregate_fieldsFieldPolicy,
	},
	full_text_search_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | full_text_search_max_fieldsKeySpecifier | (() => undefined | full_text_search_max_fieldsKeySpecifier),
		fields?: full_text_search_max_fieldsFieldPolicy,
	},
	full_text_search_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | full_text_search_min_fieldsKeySpecifier | (() => undefined | full_text_search_min_fieldsKeySpecifier),
		fields?: full_text_search_min_fieldsFieldPolicy,
	},
	full_text_search_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | full_text_search_mutation_responseKeySpecifier | (() => undefined | full_text_search_mutation_responseKeySpecifier),
		fields?: full_text_search_mutation_responseFieldPolicy,
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
	message_attachment?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | message_attachmentKeySpecifier | (() => undefined | message_attachmentKeySpecifier),
		fields?: message_attachmentFieldPolicy,
	},
	message_attachment_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | message_attachment_aggregateKeySpecifier | (() => undefined | message_attachment_aggregateKeySpecifier),
		fields?: message_attachment_aggregateFieldPolicy,
	},
	message_attachment_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | message_attachment_aggregate_fieldsKeySpecifier | (() => undefined | message_attachment_aggregate_fieldsKeySpecifier),
		fields?: message_attachment_aggregate_fieldsFieldPolicy,
	},
	message_attachment_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | message_attachment_max_fieldsKeySpecifier | (() => undefined | message_attachment_max_fieldsKeySpecifier),
		fields?: message_attachment_max_fieldsFieldPolicy,
	},
	message_attachment_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | message_attachment_min_fieldsKeySpecifier | (() => undefined | message_attachment_min_fieldsKeySpecifier),
		fields?: message_attachment_min_fieldsFieldPolicy,
	},
	message_attachment_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | message_attachment_mutation_responseKeySpecifier | (() => undefined | message_attachment_mutation_responseKeySpecifier),
		fields?: message_attachment_mutation_responseFieldPolicy,
	},
	message_full_text?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | message_full_textKeySpecifier | (() => undefined | message_full_textKeySpecifier),
		fields?: message_full_textFieldPolicy,
	},
	message_full_text_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | message_full_text_aggregateKeySpecifier | (() => undefined | message_full_text_aggregateKeySpecifier),
		fields?: message_full_text_aggregateFieldPolicy,
	},
	message_full_text_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | message_full_text_aggregate_fieldsKeySpecifier | (() => undefined | message_full_text_aggregate_fieldsKeySpecifier),
		fields?: message_full_text_aggregate_fieldsFieldPolicy,
	},
	message_full_text_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | message_full_text_max_fieldsKeySpecifier | (() => undefined | message_full_text_max_fieldsKeySpecifier),
		fields?: message_full_text_max_fieldsFieldPolicy,
	},
	message_full_text_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | message_full_text_min_fieldsKeySpecifier | (() => undefined | message_full_text_min_fieldsKeySpecifier),
		fields?: message_full_text_min_fieldsFieldPolicy,
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
	room_invites?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | room_invitesKeySpecifier | (() => undefined | room_invitesKeySpecifier),
		fields?: room_invitesFieldPolicy,
	},
	room_invites_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | room_invites_aggregateKeySpecifier | (() => undefined | room_invites_aggregateKeySpecifier),
		fields?: room_invites_aggregateFieldPolicy,
	},
	room_invites_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | room_invites_aggregate_fieldsKeySpecifier | (() => undefined | room_invites_aggregate_fieldsKeySpecifier),
		fields?: room_invites_aggregate_fieldsFieldPolicy,
	},
	room_invites_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | room_invites_max_fieldsKeySpecifier | (() => undefined | room_invites_max_fieldsKeySpecifier),
		fields?: room_invites_max_fieldsFieldPolicy,
	},
	room_invites_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | room_invites_min_fieldsKeySpecifier | (() => undefined | room_invites_min_fieldsKeySpecifier),
		fields?: room_invites_min_fieldsFieldPolicy,
	},
	room_invites_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | room_invites_mutation_responseKeySpecifier | (() => undefined | room_invites_mutation_responseKeySpecifier),
		fields?: room_invites_mutation_responseFieldPolicy,
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
	transcription_full_text?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | transcription_full_textKeySpecifier | (() => undefined | transcription_full_textKeySpecifier),
		fields?: transcription_full_textFieldPolicy,
	},
	transcription_full_text_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | transcription_full_text_aggregateKeySpecifier | (() => undefined | transcription_full_text_aggregateKeySpecifier),
		fields?: transcription_full_text_aggregateFieldPolicy,
	},
	transcription_full_text_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | transcription_full_text_aggregate_fieldsKeySpecifier | (() => undefined | transcription_full_text_aggregate_fieldsKeySpecifier),
		fields?: transcription_full_text_aggregate_fieldsFieldPolicy,
	},
	transcription_full_text_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | transcription_full_text_max_fieldsKeySpecifier | (() => undefined | transcription_full_text_max_fieldsKeySpecifier),
		fields?: transcription_full_text_max_fieldsFieldPolicy,
	},
	transcription_full_text_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | transcription_full_text_min_fieldsKeySpecifier | (() => undefined | transcription_full_text_min_fieldsKeySpecifier),
		fields?: transcription_full_text_min_fieldsFieldPolicy,
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
	}
};

      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {}
};
      export default result;
    