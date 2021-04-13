import { FieldPolicy, FieldReadFunction, TypePolicies, TypePolicy } from '@apollo/client/cache';
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  json: any;
  timestamptz: any;
  uuid: any;
};

export type InviteAcceptCommand = {
  code: Scalars['String'];
};

export type InviteAcceptResponse = {
  __typename?: 'InviteAcceptResponse';
  invite?: Maybe<Room_Invites>;
  invite_id: Scalars['ID'];
  room?: Maybe<Room>;
  room_id: Scalars['ID'];
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


/** columns and relationships of "message" */
export type Message = {
  __typename?: 'message';
  created_at: Scalars['timestamptz'];
  id: Scalars['uuid'];
  media_url?: Maybe<Scalars['String']>;
  /** An object relationship */
  message_type: Message_Type;
  text?: Maybe<Scalars['String']>;
  /** An object relationship */
  thread: Thread;
  thread_id: Scalars['uuid'];
  transcription?: Maybe<Scalars['String']>;
  type: Message_Type_Enum;
  /** An object relationship */
  user: User;
  user_id: Scalars['uuid'];
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

/** input type for inserting array relation for remote table "message" */
export type Message_Arr_Rel_Insert_Input = {
  data: Array<Message_Insert_Input>;
  on_conflict?: Maybe<Message_On_Conflict>;
};

/** Boolean expression to filter rows from the table "message". All fields are combined with a logical 'AND'. */
export type Message_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Message_Bool_Exp>>>;
  _not?: Maybe<Message_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Message_Bool_Exp>>>;
  created_at?: Maybe<Timestamptz_Comparison_Exp>;
  id?: Maybe<Uuid_Comparison_Exp>;
  media_url?: Maybe<String_Comparison_Exp>;
  message_type?: Maybe<Message_Type_Bool_Exp>;
  text?: Maybe<String_Comparison_Exp>;
  thread?: Maybe<Thread_Bool_Exp>;
  thread_id?: Maybe<Uuid_Comparison_Exp>;
  transcription?: Maybe<String_Comparison_Exp>;
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

/** input type for inserting data into table "message" */
export type Message_Insert_Input = {
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  media_url?: Maybe<Scalars['String']>;
  message_type?: Maybe<Message_Type_Obj_Rel_Insert_Input>;
  text?: Maybe<Scalars['String']>;
  thread?: Maybe<Thread_Obj_Rel_Insert_Input>;
  thread_id?: Maybe<Scalars['uuid']>;
  transcription?: Maybe<Scalars['String']>;
  type?: Maybe<Message_Type_Enum>;
  user?: Maybe<User_Obj_Rel_Insert_Input>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Message_Max_Fields = {
  __typename?: 'message_max_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  media_url?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
  thread_id?: Maybe<Scalars['uuid']>;
  transcription?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "message" */
export type Message_Max_Order_By = {
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  media_url?: Maybe<Order_By>;
  text?: Maybe<Order_By>;
  thread_id?: Maybe<Order_By>;
  transcription?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Message_Min_Fields = {
  __typename?: 'message_min_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  media_url?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
  thread_id?: Maybe<Scalars['uuid']>;
  transcription?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "message" */
export type Message_Min_Order_By = {
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  media_url?: Maybe<Order_By>;
  text?: Maybe<Order_By>;
  thread_id?: Maybe<Order_By>;
  transcription?: Maybe<Order_By>;
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
  created_at?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  media_url?: Maybe<Order_By>;
  message_type?: Maybe<Message_Type_Order_By>;
  text?: Maybe<Order_By>;
  thread?: Maybe<Thread_Order_By>;
  thread_id?: Maybe<Order_By>;
  transcription?: Maybe<Order_By>;
  type?: Maybe<Order_By>;
  user?: Maybe<User_Order_By>;
  user_id?: Maybe<Order_By>;
};

/** primary key columns input for table: "message" */
export type Message_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "message" */
export enum Message_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  MediaUrl = 'media_url',
  /** column name */
  Text = 'text',
  /** column name */
  ThreadId = 'thread_id',
  /** column name */
  Transcription = 'transcription',
  /** column name */
  Type = 'type',
  /** column name */
  UserId = 'user_id'
}

/** input type for updating data in table "message" */
export type Message_Set_Input = {
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  media_url?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
  thread_id?: Maybe<Scalars['uuid']>;
  transcription?: Maybe<Scalars['String']>;
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
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  MediaUrl = 'media_url',
  /** column name */
  Text = 'text',
  /** column name */
  ThreadId = 'thread_id',
  /** column name */
  Transcription = 'transcription',
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
  /** delete data from the table: "message" */
  delete_message?: Maybe<Message_Mutation_Response>;
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
  /** delete data from the table: "room_participants" */
  delete_room_participants?: Maybe<Room_Participants_Mutation_Response>;
  /** delete single row from the table: "room_participants" */
  delete_room_participants_by_pk?: Maybe<Room_Participants>;
  /** delete data from the table: "thread" */
  delete_thread?: Maybe<Thread_Mutation_Response>;
  /** delete single row from the table: "thread" */
  delete_thread_by_pk?: Maybe<Thread>;
  /** delete data from the table: "user" */
  delete_user?: Maybe<User_Mutation_Response>;
  /** delete single row from the table: "user" */
  delete_user_by_pk?: Maybe<User>;
  /** insert data into the table: "account" */
  insert_account?: Maybe<Account_Mutation_Response>;
  /** insert a single row into the table: "account" */
  insert_account_one?: Maybe<Account>;
  /** insert data into the table: "message" */
  insert_message?: Maybe<Message_Mutation_Response>;
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
  /** insert a single row into the table: "room" */
  insert_room_one?: Maybe<Room>;
  /** insert data into the table: "room_participants" */
  insert_room_participants?: Maybe<Room_Participants_Mutation_Response>;
  /** insert a single row into the table: "room_participants" */
  insert_room_participants_one?: Maybe<Room_Participants>;
  /** insert data into the table: "thread" */
  insert_thread?: Maybe<Thread_Mutation_Response>;
  /** insert a single row into the table: "thread" */
  insert_thread_one?: Maybe<Thread>;
  /** insert data into the table: "user" */
  insert_user?: Maybe<User_Mutation_Response>;
  /** insert a single row into the table: "user" */
  insert_user_one?: Maybe<User>;
  /** update data of the table: "account" */
  update_account?: Maybe<Account_Mutation_Response>;
  /** update single row of the table: "account" */
  update_account_by_pk?: Maybe<Account>;
  /** update data of the table: "message" */
  update_message?: Maybe<Message_Mutation_Response>;
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
  /** update data of the table: "room_participants" */
  update_room_participants?: Maybe<Room_Participants_Mutation_Response>;
  /** update single row of the table: "room_participants" */
  update_room_participants_by_pk?: Maybe<Room_Participants>;
  /** update data of the table: "thread" */
  update_thread?: Maybe<Thread_Mutation_Response>;
  /** update single row of the table: "thread" */
  update_thread_by_pk?: Maybe<Thread>;
  /** update data of the table: "user" */
  update_user?: Maybe<User_Mutation_Response>;
  /** update single row of the table: "user" */
  update_user_by_pk?: Maybe<User>;
  /** perform the action: "upgrade_current_user" */
  upgrade_current_user?: Maybe<UpgradeUserResponse>;
};


/** mutation root */
export type Mutation_RootAccept_InviteArgs = {
  code: Scalars['String'];
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
export type Mutation_RootDelete_MessageArgs = {
  where: Message_Bool_Exp;
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
export type Mutation_RootDelete_Room_ParticipantsArgs = {
  where: Room_Participants_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Room_Participants_By_PkArgs = {
  room_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_ThreadArgs = {
  where: Thread_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Thread_By_PkArgs = {
  id: Scalars['uuid'];
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
export type Mutation_RootInsert_MessageArgs = {
  objects: Array<Message_Insert_Input>;
  on_conflict?: Maybe<Message_On_Conflict>;
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
export type Mutation_RootInsert_Room_OneArgs = {
  object: Room_Insert_Input;
  on_conflict?: Maybe<Room_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Room_ParticipantsArgs = {
  objects: Array<Room_Participants_Insert_Input>;
  on_conflict?: Maybe<Room_Participants_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Room_Participants_OneArgs = {
  object: Room_Participants_Insert_Input;
  on_conflict?: Maybe<Room_Participants_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_ThreadArgs = {
  objects: Array<Thread_Insert_Input>;
  on_conflict?: Maybe<Thread_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Thread_OneArgs = {
  object: Thread_Insert_Input;
  on_conflict?: Maybe<Thread_On_Conflict>;
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
export type Mutation_RootUpdate_MessageArgs = {
  _set?: Maybe<Message_Set_Input>;
  where: Message_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Message_By_PkArgs = {
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
export type Mutation_RootUpdate_Room_ParticipantsArgs = {
  _set?: Maybe<Room_Participants_Set_Input>;
  where: Room_Participants_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Room_Participants_By_PkArgs = {
  _set?: Maybe<Room_Participants_Set_Input>;
  pk_columns: Room_Participants_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_ThreadArgs = {
  _set?: Maybe<Thread_Set_Input>;
  where: Thread_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Thread_By_PkArgs = {
  _set?: Maybe<Thread_Set_Input>;
  pk_columns: Thread_Pk_Columns_Input;
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
  /** fetch data from the table: "message" */
  message: Array<Message>;
  /** fetch aggregated fields from the table: "message" */
  message_aggregate: Message_Aggregate;
  /** fetch data from the table: "message" using primary key columns */
  message_by_pk?: Maybe<Message>;
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
  /** fetch data from the table: "room_participants" */
  room_participants: Array<Room_Participants>;
  /** fetch aggregated fields from the table: "room_participants" */
  room_participants_aggregate: Room_Participants_Aggregate;
  /** fetch data from the table: "room_participants" using primary key columns */
  room_participants_by_pk?: Maybe<Room_Participants>;
  /** fetch data from the table: "thread" */
  thread: Array<Thread>;
  /** fetch aggregated fields from the table: "thread" */
  thread_aggregate: Thread_Aggregate;
  /** fetch data from the table: "thread" using primary key columns */
  thread_by_pk?: Maybe<Thread>;
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
export type Query_RootMessage_By_PkArgs = {
  id: Scalars['uuid'];
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
export type Query_RootRoom_ParticipantsArgs = {
  distinct_on?: Maybe<Array<Room_Participants_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Participants_Order_By>>;
  where?: Maybe<Room_Participants_Bool_Exp>;
};


/** query root */
export type Query_RootRoom_Participants_AggregateArgs = {
  distinct_on?: Maybe<Array<Room_Participants_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Participants_Order_By>>;
  where?: Maybe<Room_Participants_Bool_Exp>;
};


/** query root */
export type Query_RootRoom_Participants_By_PkArgs = {
  room_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
};


/** query root */
export type Query_RootThreadArgs = {
  distinct_on?: Maybe<Array<Thread_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Thread_Order_By>>;
  where?: Maybe<Thread_Bool_Exp>;
};


/** query root */
export type Query_RootThread_AggregateArgs = {
  distinct_on?: Maybe<Array<Thread_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Thread_Order_By>>;
  where?: Maybe<Thread_Bool_Exp>;
};


/** query root */
export type Query_RootThread_By_PkArgs = {
  id: Scalars['uuid'];
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
  name?: Maybe<Scalars['String']>;
  notification_job_id?: Maybe<Scalars['String']>;
  /** An array relationship */
  participants: Array<Room_Participants>;
  /** An aggregated array relationship */
  participants_aggregate: Room_Participants_Aggregate;
  /** An array relationship */
  room_invites: Array<Room_Invites>;
  /** An aggregated array relationship */
  room_invites_aggregate: Room_Invites_Aggregate;
  summary?: Maybe<Scalars['String']>;
  /** An array relationship */
  threads: Array<Thread>;
  /** An aggregated array relationship */
  threads_aggregate: Thread_Aggregate;
};


/** columns and relationships of "room" */
export type RoomParticipantsArgs = {
  distinct_on?: Maybe<Array<Room_Participants_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Participants_Order_By>>;
  where?: Maybe<Room_Participants_Bool_Exp>;
};


/** columns and relationships of "room" */
export type RoomParticipants_AggregateArgs = {
  distinct_on?: Maybe<Array<Room_Participants_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Participants_Order_By>>;
  where?: Maybe<Room_Participants_Bool_Exp>;
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
export type RoomThreadsArgs = {
  distinct_on?: Maybe<Array<Thread_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Thread_Order_By>>;
  where?: Maybe<Thread_Bool_Exp>;
};


/** columns and relationships of "room" */
export type RoomThreads_AggregateArgs = {
  distinct_on?: Maybe<Array<Thread_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Thread_Order_By>>;
  where?: Maybe<Thread_Bool_Exp>;
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
  name?: Maybe<String_Comparison_Exp>;
  notification_job_id?: Maybe<String_Comparison_Exp>;
  participants?: Maybe<Room_Participants_Bool_Exp>;
  room_invites?: Maybe<Room_Invites_Bool_Exp>;
  summary?: Maybe<String_Comparison_Exp>;
  threads?: Maybe<Thread_Bool_Exp>;
};

/** unique or primary key constraints on table "room" */
export enum Room_Constraint {
  /** unique or primary key constraint */
  RoomPkey = 'room_pkey'
}

/** input type for inserting data into table "room" */
export type Room_Insert_Input = {
  created_at?: Maybe<Scalars['timestamptz']>;
  creator?: Maybe<User_Obj_Rel_Insert_Input>;
  creator_id?: Maybe<Scalars['uuid']>;
  deadline?: Maybe<Scalars['timestamptz']>;
  finished_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  notification_job_id?: Maybe<Scalars['String']>;
  participants?: Maybe<Room_Participants_Arr_Rel_Insert_Input>;
  room_invites?: Maybe<Room_Invites_Arr_Rel_Insert_Input>;
  summary?: Maybe<Scalars['String']>;
  threads?: Maybe<Thread_Arr_Rel_Insert_Input>;
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
  summary?: Maybe<Order_By>;
};

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
  name?: Maybe<Order_By>;
  notification_job_id?: Maybe<Order_By>;
  participants_aggregate?: Maybe<Room_Participants_Aggregate_Order_By>;
  room_invites_aggregate?: Maybe<Room_Invites_Aggregate_Order_By>;
  summary?: Maybe<Order_By>;
  threads_aggregate?: Maybe<Thread_Aggregate_Order_By>;
};

/** columns and relationships of "room_participants" */
export type Room_Participants = {
  __typename?: 'room_participants';
  /** An object relationship */
  room: Room;
  room_id: Scalars['uuid'];
  /** An object relationship */
  user: User;
  user_id: Scalars['uuid'];
};

/** aggregated selection of "room_participants" */
export type Room_Participants_Aggregate = {
  __typename?: 'room_participants_aggregate';
  aggregate?: Maybe<Room_Participants_Aggregate_Fields>;
  nodes: Array<Room_Participants>;
};

/** aggregate fields of "room_participants" */
export type Room_Participants_Aggregate_Fields = {
  __typename?: 'room_participants_aggregate_fields';
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Room_Participants_Max_Fields>;
  min?: Maybe<Room_Participants_Min_Fields>;
};


/** aggregate fields of "room_participants" */
export type Room_Participants_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Room_Participants_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "room_participants" */
export type Room_Participants_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<Room_Participants_Max_Order_By>;
  min?: Maybe<Room_Participants_Min_Order_By>;
};

/** input type for inserting array relation for remote table "room_participants" */
export type Room_Participants_Arr_Rel_Insert_Input = {
  data: Array<Room_Participants_Insert_Input>;
  on_conflict?: Maybe<Room_Participants_On_Conflict>;
};

/** Boolean expression to filter rows from the table "room_participants". All fields are combined with a logical 'AND'. */
export type Room_Participants_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Room_Participants_Bool_Exp>>>;
  _not?: Maybe<Room_Participants_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Room_Participants_Bool_Exp>>>;
  room?: Maybe<Room_Bool_Exp>;
  room_id?: Maybe<Uuid_Comparison_Exp>;
  user?: Maybe<User_Bool_Exp>;
  user_id?: Maybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "room_participants" */
export enum Room_Participants_Constraint {
  /** unique or primary key constraint */
  RoomParticipantsPkey = 'room_participants_pkey',
  /** unique or primary key constraint */
  RoomParticipantsRoomIdUserIdKey = 'room_participants_room_id_user_id_key'
}

/** input type for inserting data into table "room_participants" */
export type Room_Participants_Insert_Input = {
  room?: Maybe<Room_Obj_Rel_Insert_Input>;
  room_id?: Maybe<Scalars['uuid']>;
  user?: Maybe<User_Obj_Rel_Insert_Input>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Room_Participants_Max_Fields = {
  __typename?: 'room_participants_max_fields';
  room_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "room_participants" */
export type Room_Participants_Max_Order_By = {
  room_id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Room_Participants_Min_Fields = {
  __typename?: 'room_participants_min_fields';
  room_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "room_participants" */
export type Room_Participants_Min_Order_By = {
  room_id?: Maybe<Order_By>;
  user_id?: Maybe<Order_By>;
};

/** response of any mutation on the table "room_participants" */
export type Room_Participants_Mutation_Response = {
  __typename?: 'room_participants_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Room_Participants>;
};

/** input type for inserting object relation for remote table "room_participants" */
export type Room_Participants_Obj_Rel_Insert_Input = {
  data: Room_Participants_Insert_Input;
  on_conflict?: Maybe<Room_Participants_On_Conflict>;
};

/** on conflict condition type for table "room_participants" */
export type Room_Participants_On_Conflict = {
  constraint: Room_Participants_Constraint;
  update_columns: Array<Room_Participants_Update_Column>;
  where?: Maybe<Room_Participants_Bool_Exp>;
};

/** ordering options when selecting data from "room_participants" */
export type Room_Participants_Order_By = {
  room?: Maybe<Room_Order_By>;
  room_id?: Maybe<Order_By>;
  user?: Maybe<User_Order_By>;
  user_id?: Maybe<Order_By>;
};

/** primary key columns input for table: "room_participants" */
export type Room_Participants_Pk_Columns_Input = {
  room_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
};

/** select columns of table "room_participants" */
export enum Room_Participants_Select_Column {
  /** column name */
  RoomId = 'room_id',
  /** column name */
  UserId = 'user_id'
}

/** input type for updating data in table "room_participants" */
export type Room_Participants_Set_Input = {
  room_id?: Maybe<Scalars['uuid']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** update columns of table "room_participants" */
export enum Room_Participants_Update_Column {
  /** column name */
  RoomId = 'room_id',
  /** column name */
  UserId = 'user_id'
}

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
  Summary = 'summary'
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
  /** fetch data from the table: "message" */
  message: Array<Message>;
  /** fetch aggregated fields from the table: "message" */
  message_aggregate: Message_Aggregate;
  /** fetch data from the table: "message" using primary key columns */
  message_by_pk?: Maybe<Message>;
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
  /** fetch data from the table: "room_participants" */
  room_participants: Array<Room_Participants>;
  /** fetch aggregated fields from the table: "room_participants" */
  room_participants_aggregate: Room_Participants_Aggregate;
  /** fetch data from the table: "room_participants" using primary key columns */
  room_participants_by_pk?: Maybe<Room_Participants>;
  /** fetch data from the table: "thread" */
  thread: Array<Thread>;
  /** fetch aggregated fields from the table: "thread" */
  thread_aggregate: Thread_Aggregate;
  /** fetch data from the table: "thread" using primary key columns */
  thread_by_pk?: Maybe<Thread>;
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
export type Subscription_RootMessage_By_PkArgs = {
  id: Scalars['uuid'];
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
export type Subscription_RootRoom_ParticipantsArgs = {
  distinct_on?: Maybe<Array<Room_Participants_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Participants_Order_By>>;
  where?: Maybe<Room_Participants_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootRoom_Participants_AggregateArgs = {
  distinct_on?: Maybe<Array<Room_Participants_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Participants_Order_By>>;
  where?: Maybe<Room_Participants_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootRoom_Participants_By_PkArgs = {
  room_id: Scalars['uuid'];
  user_id: Scalars['uuid'];
};


/** subscription root */
export type Subscription_RootThreadArgs = {
  distinct_on?: Maybe<Array<Thread_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Thread_Order_By>>;
  where?: Maybe<Thread_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootThread_AggregateArgs = {
  distinct_on?: Maybe<Array<Thread_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Thread_Order_By>>;
  where?: Maybe<Thread_Bool_Exp>;
};


/** subscription root */
export type Subscription_RootThread_By_PkArgs = {
  id: Scalars['uuid'];
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

/** columns and relationships of "thread" */
export type Thread = {
  __typename?: 'thread';
  id: Scalars['uuid'];
  index: Scalars['String'];
  /** An array relationship */
  messages: Array<Message>;
  /** An aggregated array relationship */
  messages_aggregate: Message_Aggregate;
  name?: Maybe<Scalars['String']>;
  /** An object relationship */
  room: Room;
  room_id: Scalars['uuid'];
};


/** columns and relationships of "thread" */
export type ThreadMessagesArgs = {
  distinct_on?: Maybe<Array<Message_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Message_Order_By>>;
  where?: Maybe<Message_Bool_Exp>;
};


/** columns and relationships of "thread" */
export type ThreadMessages_AggregateArgs = {
  distinct_on?: Maybe<Array<Message_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Message_Order_By>>;
  where?: Maybe<Message_Bool_Exp>;
};

/** aggregated selection of "thread" */
export type Thread_Aggregate = {
  __typename?: 'thread_aggregate';
  aggregate?: Maybe<Thread_Aggregate_Fields>;
  nodes: Array<Thread>;
};

/** aggregate fields of "thread" */
export type Thread_Aggregate_Fields = {
  __typename?: 'thread_aggregate_fields';
  count?: Maybe<Scalars['Int']>;
  max?: Maybe<Thread_Max_Fields>;
  min?: Maybe<Thread_Min_Fields>;
};


/** aggregate fields of "thread" */
export type Thread_Aggregate_FieldsCountArgs = {
  columns?: Maybe<Array<Thread_Select_Column>>;
  distinct?: Maybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "thread" */
export type Thread_Aggregate_Order_By = {
  count?: Maybe<Order_By>;
  max?: Maybe<Thread_Max_Order_By>;
  min?: Maybe<Thread_Min_Order_By>;
};

/** input type for inserting array relation for remote table "thread" */
export type Thread_Arr_Rel_Insert_Input = {
  data: Array<Thread_Insert_Input>;
  on_conflict?: Maybe<Thread_On_Conflict>;
};

/** Boolean expression to filter rows from the table "thread". All fields are combined with a logical 'AND'. */
export type Thread_Bool_Exp = {
  _and?: Maybe<Array<Maybe<Thread_Bool_Exp>>>;
  _not?: Maybe<Thread_Bool_Exp>;
  _or?: Maybe<Array<Maybe<Thread_Bool_Exp>>>;
  id?: Maybe<Uuid_Comparison_Exp>;
  index?: Maybe<String_Comparison_Exp>;
  messages?: Maybe<Message_Bool_Exp>;
  name?: Maybe<String_Comparison_Exp>;
  room?: Maybe<Room_Bool_Exp>;
  room_id?: Maybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "thread" */
export enum Thread_Constraint {
  /** unique or primary key constraint */
  ThreadPkey = 'thread_pkey'
}

/** input type for inserting data into table "thread" */
export type Thread_Insert_Input = {
  id?: Maybe<Scalars['uuid']>;
  index?: Maybe<Scalars['String']>;
  messages?: Maybe<Message_Arr_Rel_Insert_Input>;
  name?: Maybe<Scalars['String']>;
  room?: Maybe<Room_Obj_Rel_Insert_Input>;
  room_id?: Maybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Thread_Max_Fields = {
  __typename?: 'thread_max_fields';
  id?: Maybe<Scalars['uuid']>;
  index?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  room_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "thread" */
export type Thread_Max_Order_By = {
  id?: Maybe<Order_By>;
  index?: Maybe<Order_By>;
  name?: Maybe<Order_By>;
  room_id?: Maybe<Order_By>;
};

/** aggregate min on columns */
export type Thread_Min_Fields = {
  __typename?: 'thread_min_fields';
  id?: Maybe<Scalars['uuid']>;
  index?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  room_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "thread" */
export type Thread_Min_Order_By = {
  id?: Maybe<Order_By>;
  index?: Maybe<Order_By>;
  name?: Maybe<Order_By>;
  room_id?: Maybe<Order_By>;
};

/** response of any mutation on the table "thread" */
export type Thread_Mutation_Response = {
  __typename?: 'thread_mutation_response';
  /** number of affected rows by the mutation */
  affected_rows: Scalars['Int'];
  /** data of the affected rows by the mutation */
  returning: Array<Thread>;
};

/** input type for inserting object relation for remote table "thread" */
export type Thread_Obj_Rel_Insert_Input = {
  data: Thread_Insert_Input;
  on_conflict?: Maybe<Thread_On_Conflict>;
};

/** on conflict condition type for table "thread" */
export type Thread_On_Conflict = {
  constraint: Thread_Constraint;
  update_columns: Array<Thread_Update_Column>;
  where?: Maybe<Thread_Bool_Exp>;
};

/** ordering options when selecting data from "thread" */
export type Thread_Order_By = {
  id?: Maybe<Order_By>;
  index?: Maybe<Order_By>;
  messages_aggregate?: Maybe<Message_Aggregate_Order_By>;
  name?: Maybe<Order_By>;
  room?: Maybe<Room_Order_By>;
  room_id?: Maybe<Order_By>;
};

/** primary key columns input for table: "thread" */
export type Thread_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "thread" */
export enum Thread_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Index = 'index',
  /** column name */
  Name = 'name',
  /** column name */
  RoomId = 'room_id'
}

/** input type for updating data in table "thread" */
export type Thread_Set_Input = {
  id?: Maybe<Scalars['uuid']>;
  index?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  room_id?: Maybe<Scalars['uuid']>;
};

/** update columns of table "thread" */
export enum Thread_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Index = 'index',
  /** column name */
  Name = 'name',
  /** column name */
  RoomId = 'room_id'
}


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

/** columns and relationships of "user" */
export type User = {
  __typename?: 'user';
  avatar_url?: Maybe<Scalars['String']>;
  created_at: Scalars['timestamptz'];
  /** An array relationship */
  created_rooms: Array<Room>;
  /** An aggregated array relationship */
  created_rooms_aggregate: Room_Aggregate;
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
  rooms: Array<Room_Participants>;
  /** An aggregated array relationship */
  rooms_aggregate: Room_Participants_Aggregate;
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
export type UserRoomsArgs = {
  distinct_on?: Maybe<Array<Room_Participants_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Participants_Order_By>>;
  where?: Maybe<Room_Participants_Bool_Exp>;
};


/** columns and relationships of "user" */
export type UserRooms_AggregateArgs = {
  distinct_on?: Maybe<Array<Room_Participants_Select_Column>>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Array<Room_Participants_Order_By>>;
  where?: Maybe<Room_Participants_Bool_Exp>;
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
  email?: Maybe<String_Comparison_Exp>;
  email_verified?: Maybe<Timestamptz_Comparison_Exp>;
  id?: Maybe<Uuid_Comparison_Exp>;
  invites?: Maybe<Room_Invites_Bool_Exp>;
  messages?: Maybe<Message_Bool_Exp>;
  name?: Maybe<String_Comparison_Exp>;
  rooms?: Maybe<Room_Participants_Bool_Exp>;
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
  email?: Maybe<Scalars['String']>;
  email_verified?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  invites?: Maybe<Room_Invites_Arr_Rel_Insert_Input>;
  messages?: Maybe<Message_Arr_Rel_Insert_Input>;
  name?: Maybe<Scalars['String']>;
  rooms?: Maybe<Room_Participants_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type User_Max_Fields = {
  __typename?: 'user_max_fields';
  avatar_url?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  email?: Maybe<Scalars['String']>;
  email_verified?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "user" */
export type User_Max_Order_By = {
  avatar_url?: Maybe<Order_By>;
  created_at?: Maybe<Order_By>;
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
  email?: Maybe<Scalars['String']>;
  email_verified?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "user" */
export type User_Min_Order_By = {
  avatar_url?: Maybe<Order_By>;
  created_at?: Maybe<Order_By>;
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
  email?: Maybe<Order_By>;
  email_verified?: Maybe<Order_By>;
  id?: Maybe<Order_By>;
  invites_aggregate?: Maybe<Room_Invites_Aggregate_Order_By>;
  messages_aggregate?: Maybe<Message_Aggregate_Order_By>;
  name?: Maybe<Order_By>;
  rooms_aggregate?: Maybe<Room_Participants_Aggregate_Order_By>;
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
  code: Scalars['String'];
}>;


export type AcceptInviteMutation = (
  { __typename?: 'mutation_root' }
  & { invite?: Maybe<(
    { __typename?: 'InviteAcceptResponse' }
    & { roomId: InviteAcceptResponse['room_id'] }
  )> }
);

export type RoomBasicInfoFragment = (
  { __typename?: 'room' }
  & Pick<Room, 'id' | 'name'>
  & { participants: Array<(
    { __typename?: 'room_participants' }
    & { user: (
      { __typename?: 'user' }
      & Pick<User, 'id' | 'name'>
      & { avatarUrl: User['avatar_url'] }
    ) }
  )> }
);

export type RoomDetailedInfoFragment = (
  { __typename?: 'room' }
  & Pick<Room, 'id' | 'name'>
  & { participants: Array<(
    { __typename?: 'room_participants' }
    & { user: (
      { __typename?: 'user' }
      & Pick<User, 'id' | 'name'>
      & { avatarUrl: User['avatar_url'] }
    ) }
  )>, threads: Array<(
    { __typename?: 'thread' }
    & Pick<Thread, 'id' | 'name' | 'index'>
  )> }
);

export type ParticipantBasicInfoFragment = (
  { __typename?: 'room_participants' }
  & { user: (
    { __typename?: 'user' }
    & Pick<User, 'name'>
    & { avatarUrl: User['avatar_url'] }
  ) }
);

export type ThreadDetailedInfoFragment = (
  { __typename?: 'thread' }
  & Pick<Thread, 'id' | 'name' | 'index'>
);

export type ThreadMessageBasicInfoFragment = (
  { __typename?: 'message' }
  & Pick<Message, 'id' | 'text'>
  & { createdAt: Message['created_at'] }
  & { user: (
    { __typename?: 'user' }
    & Pick<User, 'id' | 'name'>
    & { avatarUrl: User['avatar_url'] }
  ) }
);

export type RoomParticipantBasicInfoFragment = (
  { __typename?: 'room_participants' }
  & { user: (
    { __typename?: 'user' }
    & Pick<User, 'name'>
    & { avatarUrl: User['avatar_url'] }
  ) }
);

export type GetRoomsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRoomsQuery = (
  { __typename?: 'query_root' }
  & { room: Array<(
    { __typename?: 'room' }
    & RoomBasicInfoFragment
  )> }
);

export type GetSingleRoomQueryVariables = Exact<{
  id: Scalars['uuid'];
}>;


export type GetSingleRoomQuery = (
  { __typename?: 'query_root' }
  & { room?: Maybe<(
    { __typename?: 'room' }
    & RoomDetailedInfoFragment
  )> }
);

export type CreateRoomMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type CreateRoomMutation = (
  { __typename?: 'mutation_root' }
  & { room?: Maybe<(
    { __typename?: 'room' }
    & RoomBasicInfoFragment
  )> }
);

export type RoomParticipantsSubscriptionVariables = Exact<{
  roomId: Scalars['uuid'];
}>;


export type RoomParticipantsSubscription = (
  { __typename?: 'subscription_root' }
  & { participants: Array<(
    { __typename?: 'room_participants' }
    & ParticipantBasicInfoFragment
  )> }
);

export type CreateThreadMutationVariables = Exact<{
  name: Scalars['String'];
  roomId: Scalars['uuid'];
  index: Scalars['String'];
}>;


export type CreateThreadMutation = (
  { __typename?: 'mutation_root' }
  & { thread?: Maybe<(
    { __typename?: 'thread' }
    & Pick<Thread, 'id'>
  )> }
);

export type RoomThreadsSubscriptionVariables = Exact<{
  roomId: Scalars['uuid'];
}>;


export type RoomThreadsSubscription = (
  { __typename?: 'subscription_root' }
  & { threads: Array<(
    { __typename?: 'thread' }
    & ThreadDetailedInfoFragment
  )> }
);

export type ThreadMessagesSubscriptionVariables = Exact<{
  threadId: Scalars['uuid'];
}>;


export type ThreadMessagesSubscription = (
  { __typename?: 'subscription_root' }
  & { messages: Array<(
    { __typename?: 'message' }
    & ThreadMessageBasicInfoFragment
  )> }
);

export type CreateTextMessageMutationVariables = Exact<{
  text: Scalars['String'];
  threadId: Scalars['uuid'];
}>;


export type CreateTextMessageMutation = (
  { __typename?: 'mutation_root' }
  & { message?: Maybe<(
    { __typename?: 'message' }
    & ThreadMessageBasicInfoFragment
  )> }
);

export type UpdateTextMessageMutationVariables = Exact<{
  id: Scalars['uuid'];
  text: Scalars['String'];
}>;


export type UpdateTextMessageMutation = (
  { __typename?: 'mutation_root' }
  & { update_message?: Maybe<(
    { __typename?: 'message_mutation_response' }
    & { message: Array<(
      { __typename?: 'message' }
      & ThreadMessageBasicInfoFragment
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

export type InviteAcceptResponseKeySpecifier = ('invite' | 'invite_id' | 'room' | 'room_id' | InviteAcceptResponseKeySpecifier)[];
export type InviteAcceptResponseFieldPolicy = {
	invite?: FieldPolicy<any> | FieldReadFunction<any>,
	invite_id?: FieldPolicy<any> | FieldReadFunction<any>,
	room?: FieldPolicy<any> | FieldReadFunction<any>,
	room_id?: FieldPolicy<any> | FieldReadFunction<any>
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
export type messageKeySpecifier = ('created_at' | 'id' | 'media_url' | 'message_type' | 'text' | 'thread' | 'thread_id' | 'transcription' | 'type' | 'user' | 'user_id' | messageKeySpecifier)[];
export type messageFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	media_url?: FieldPolicy<any> | FieldReadFunction<any>,
	message_type?: FieldPolicy<any> | FieldReadFunction<any>,
	text?: FieldPolicy<any> | FieldReadFunction<any>,
	thread?: FieldPolicy<any> | FieldReadFunction<any>,
	thread_id?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription?: FieldPolicy<any> | FieldReadFunction<any>,
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
export type message_max_fieldsKeySpecifier = ('created_at' | 'id' | 'media_url' | 'text' | 'thread_id' | 'transcription' | 'user_id' | message_max_fieldsKeySpecifier)[];
export type message_max_fieldsFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	media_url?: FieldPolicy<any> | FieldReadFunction<any>,
	text?: FieldPolicy<any> | FieldReadFunction<any>,
	thread_id?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type message_min_fieldsKeySpecifier = ('created_at' | 'id' | 'media_url' | 'text' | 'thread_id' | 'transcription' | 'user_id' | message_min_fieldsKeySpecifier)[];
export type message_min_fieldsFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	media_url?: FieldPolicy<any> | FieldReadFunction<any>,
	text?: FieldPolicy<any> | FieldReadFunction<any>,
	thread_id?: FieldPolicy<any> | FieldReadFunction<any>,
	transcription?: FieldPolicy<any> | FieldReadFunction<any>,
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
export type mutation_rootKeySpecifier = ('accept_invite' | 'delete_account' | 'delete_account_by_pk' | 'delete_message' | 'delete_message_by_pk' | 'delete_message_type' | 'delete_message_type_by_pk' | 'delete_room' | 'delete_room_by_pk' | 'delete_room_invites' | 'delete_room_invites_by_pk' | 'delete_room_participants' | 'delete_room_participants_by_pk' | 'delete_thread' | 'delete_thread_by_pk' | 'delete_user' | 'delete_user_by_pk' | 'insert_account' | 'insert_account_one' | 'insert_message' | 'insert_message_one' | 'insert_message_type' | 'insert_message_type_one' | 'insert_room' | 'insert_room_invites' | 'insert_room_invites_one' | 'insert_room_one' | 'insert_room_participants' | 'insert_room_participants_one' | 'insert_thread' | 'insert_thread_one' | 'insert_user' | 'insert_user_one' | 'update_account' | 'update_account_by_pk' | 'update_message' | 'update_message_by_pk' | 'update_message_type' | 'update_message_type_by_pk' | 'update_room' | 'update_room_by_pk' | 'update_room_invites' | 'update_room_invites_by_pk' | 'update_room_participants' | 'update_room_participants_by_pk' | 'update_thread' | 'update_thread_by_pk' | 'update_user' | 'update_user_by_pk' | 'upgrade_current_user' | mutation_rootKeySpecifier)[];
export type mutation_rootFieldPolicy = {
	accept_invite?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_account?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_account_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_message?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_message_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_message_type?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_message_type_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_room?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_room_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_room_invites?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_room_invites_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_room_participants?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_room_participants_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_thread?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_thread_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_user?: FieldPolicy<any> | FieldReadFunction<any>,
	delete_user_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_account?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_account_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_message?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_message_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_message_type?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_message_type_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_room?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_room_invites?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_room_invites_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_room_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_room_participants?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_room_participants_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_thread?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_thread_one?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_user?: FieldPolicy<any> | FieldReadFunction<any>,
	insert_user_one?: FieldPolicy<any> | FieldReadFunction<any>,
	update_account?: FieldPolicy<any> | FieldReadFunction<any>,
	update_account_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_message?: FieldPolicy<any> | FieldReadFunction<any>,
	update_message_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_message_type?: FieldPolicy<any> | FieldReadFunction<any>,
	update_message_type_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_room?: FieldPolicy<any> | FieldReadFunction<any>,
	update_room_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_room_invites?: FieldPolicy<any> | FieldReadFunction<any>,
	update_room_invites_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_room_participants?: FieldPolicy<any> | FieldReadFunction<any>,
	update_room_participants_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_thread?: FieldPolicy<any> | FieldReadFunction<any>,
	update_thread_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	update_user?: FieldPolicy<any> | FieldReadFunction<any>,
	update_user_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	upgrade_current_user?: FieldPolicy<any> | FieldReadFunction<any>
};
export type query_rootKeySpecifier = ('account' | 'account_aggregate' | 'account_by_pk' | 'message' | 'message_aggregate' | 'message_by_pk' | 'message_type' | 'message_type_aggregate' | 'message_type_by_pk' | 'room' | 'room_aggregate' | 'room_by_pk' | 'room_invites' | 'room_invites_aggregate' | 'room_invites_by_pk' | 'room_participants' | 'room_participants_aggregate' | 'room_participants_by_pk' | 'thread' | 'thread_aggregate' | 'thread_by_pk' | 'user' | 'user_aggregate' | 'user_by_pk' | query_rootKeySpecifier)[];
export type query_rootFieldPolicy = {
	account?: FieldPolicy<any> | FieldReadFunction<any>,
	account_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	account_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	message_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	message_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	message_type?: FieldPolicy<any> | FieldReadFunction<any>,
	message_type_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	message_type_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	room?: FieldPolicy<any> | FieldReadFunction<any>,
	room_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	room_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	room_invites?: FieldPolicy<any> | FieldReadFunction<any>,
	room_invites_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	room_invites_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	room_participants?: FieldPolicy<any> | FieldReadFunction<any>,
	room_participants_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	room_participants_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	thread?: FieldPolicy<any> | FieldReadFunction<any>,
	thread_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	thread_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	user_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	user_by_pk?: FieldPolicy<any> | FieldReadFunction<any>
};
export type roomKeySpecifier = ('created_at' | 'creator' | 'creator_id' | 'deadline' | 'finished_at' | 'id' | 'name' | 'notification_job_id' | 'participants' | 'participants_aggregate' | 'room_invites' | 'room_invites_aggregate' | 'summary' | 'threads' | 'threads_aggregate' | roomKeySpecifier)[];
export type roomFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	creator?: FieldPolicy<any> | FieldReadFunction<any>,
	creator_id?: FieldPolicy<any> | FieldReadFunction<any>,
	deadline?: FieldPolicy<any> | FieldReadFunction<any>,
	finished_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	notification_job_id?: FieldPolicy<any> | FieldReadFunction<any>,
	participants?: FieldPolicy<any> | FieldReadFunction<any>,
	participants_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	room_invites?: FieldPolicy<any> | FieldReadFunction<any>,
	room_invites_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	summary?: FieldPolicy<any> | FieldReadFunction<any>,
	threads?: FieldPolicy<any> | FieldReadFunction<any>,
	threads_aggregate?: FieldPolicy<any> | FieldReadFunction<any>
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
export type room_max_fieldsKeySpecifier = ('created_at' | 'creator_id' | 'deadline' | 'finished_at' | 'id' | 'name' | 'notification_job_id' | 'summary' | room_max_fieldsKeySpecifier)[];
export type room_max_fieldsFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	creator_id?: FieldPolicy<any> | FieldReadFunction<any>,
	deadline?: FieldPolicy<any> | FieldReadFunction<any>,
	finished_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	notification_job_id?: FieldPolicy<any> | FieldReadFunction<any>,
	summary?: FieldPolicy<any> | FieldReadFunction<any>
};
export type room_min_fieldsKeySpecifier = ('created_at' | 'creator_id' | 'deadline' | 'finished_at' | 'id' | 'name' | 'notification_job_id' | 'summary' | room_min_fieldsKeySpecifier)[];
export type room_min_fieldsFieldPolicy = {
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	creator_id?: FieldPolicy<any> | FieldReadFunction<any>,
	deadline?: FieldPolicy<any> | FieldReadFunction<any>,
	finished_at?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	notification_job_id?: FieldPolicy<any> | FieldReadFunction<any>,
	summary?: FieldPolicy<any> | FieldReadFunction<any>
};
export type room_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | room_mutation_responseKeySpecifier)[];
export type room_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type room_participantsKeySpecifier = ('room' | 'room_id' | 'user' | 'user_id' | room_participantsKeySpecifier)[];
export type room_participantsFieldPolicy = {
	room?: FieldPolicy<any> | FieldReadFunction<any>,
	room_id?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type room_participants_aggregateKeySpecifier = ('aggregate' | 'nodes' | room_participants_aggregateKeySpecifier)[];
export type room_participants_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type room_participants_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | room_participants_aggregate_fieldsKeySpecifier)[];
export type room_participants_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type room_participants_max_fieldsKeySpecifier = ('room_id' | 'user_id' | room_participants_max_fieldsKeySpecifier)[];
export type room_participants_max_fieldsFieldPolicy = {
	room_id?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type room_participants_min_fieldsKeySpecifier = ('room_id' | 'user_id' | room_participants_min_fieldsKeySpecifier)[];
export type room_participants_min_fieldsFieldPolicy = {
	room_id?: FieldPolicy<any> | FieldReadFunction<any>,
	user_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type room_participants_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | room_participants_mutation_responseKeySpecifier)[];
export type room_participants_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type subscription_rootKeySpecifier = ('account' | 'account_aggregate' | 'account_by_pk' | 'message' | 'message_aggregate' | 'message_by_pk' | 'message_type' | 'message_type_aggregate' | 'message_type_by_pk' | 'room' | 'room_aggregate' | 'room_by_pk' | 'room_invites' | 'room_invites_aggregate' | 'room_invites_by_pk' | 'room_participants' | 'room_participants_aggregate' | 'room_participants_by_pk' | 'thread' | 'thread_aggregate' | 'thread_by_pk' | 'user' | 'user_aggregate' | 'user_by_pk' | subscription_rootKeySpecifier)[];
export type subscription_rootFieldPolicy = {
	account?: FieldPolicy<any> | FieldReadFunction<any>,
	account_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	account_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	message?: FieldPolicy<any> | FieldReadFunction<any>,
	message_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	message_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	message_type?: FieldPolicy<any> | FieldReadFunction<any>,
	message_type_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	message_type_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	room?: FieldPolicy<any> | FieldReadFunction<any>,
	room_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	room_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	room_invites?: FieldPolicy<any> | FieldReadFunction<any>,
	room_invites_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	room_invites_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	room_participants?: FieldPolicy<any> | FieldReadFunction<any>,
	room_participants_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	room_participants_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	thread?: FieldPolicy<any> | FieldReadFunction<any>,
	thread_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	thread_by_pk?: FieldPolicy<any> | FieldReadFunction<any>,
	user?: FieldPolicy<any> | FieldReadFunction<any>,
	user_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	user_by_pk?: FieldPolicy<any> | FieldReadFunction<any>
};
export type threadKeySpecifier = ('id' | 'index' | 'messages' | 'messages_aggregate' | 'name' | 'room' | 'room_id' | threadKeySpecifier)[];
export type threadFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	index?: FieldPolicy<any> | FieldReadFunction<any>,
	messages?: FieldPolicy<any> | FieldReadFunction<any>,
	messages_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	room?: FieldPolicy<any> | FieldReadFunction<any>,
	room_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type thread_aggregateKeySpecifier = ('aggregate' | 'nodes' | thread_aggregateKeySpecifier)[];
export type thread_aggregateFieldPolicy = {
	aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	nodes?: FieldPolicy<any> | FieldReadFunction<any>
};
export type thread_aggregate_fieldsKeySpecifier = ('count' | 'max' | 'min' | thread_aggregate_fieldsKeySpecifier)[];
export type thread_aggregate_fieldsFieldPolicy = {
	count?: FieldPolicy<any> | FieldReadFunction<any>,
	max?: FieldPolicy<any> | FieldReadFunction<any>,
	min?: FieldPolicy<any> | FieldReadFunction<any>
};
export type thread_max_fieldsKeySpecifier = ('id' | 'index' | 'name' | 'room_id' | thread_max_fieldsKeySpecifier)[];
export type thread_max_fieldsFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	index?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	room_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type thread_min_fieldsKeySpecifier = ('id' | 'index' | 'name' | 'room_id' | thread_min_fieldsKeySpecifier)[];
export type thread_min_fieldsFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	index?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	room_id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type thread_mutation_responseKeySpecifier = ('affected_rows' | 'returning' | thread_mutation_responseKeySpecifier)[];
export type thread_mutation_responseFieldPolicy = {
	affected_rows?: FieldPolicy<any> | FieldReadFunction<any>,
	returning?: FieldPolicy<any> | FieldReadFunction<any>
};
export type userKeySpecifier = ('avatar_url' | 'created_at' | 'created_rooms' | 'created_rooms_aggregate' | 'email' | 'email_verified' | 'id' | 'invites' | 'invites_aggregate' | 'messages' | 'messages_aggregate' | 'name' | 'rooms' | 'rooms_aggregate' | userKeySpecifier)[];
export type userFieldPolicy = {
	avatar_url?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	created_rooms?: FieldPolicy<any> | FieldReadFunction<any>,
	created_rooms_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	email_verified?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	invites?: FieldPolicy<any> | FieldReadFunction<any>,
	invites_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	messages?: FieldPolicy<any> | FieldReadFunction<any>,
	messages_aggregate?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	rooms?: FieldPolicy<any> | FieldReadFunction<any>,
	rooms_aggregate?: FieldPolicy<any> | FieldReadFunction<any>
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
export type user_max_fieldsKeySpecifier = ('avatar_url' | 'created_at' | 'email' | 'email_verified' | 'id' | 'name' | user_max_fieldsKeySpecifier)[];
export type user_max_fieldsFieldPolicy = {
	avatar_url?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	email_verified?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>
};
export type user_min_fieldsKeySpecifier = ('avatar_url' | 'created_at' | 'email' | 'email_verified' | 'id' | 'name' | user_min_fieldsKeySpecifier)[];
export type user_min_fieldsFieldPolicy = {
	avatar_url?: FieldPolicy<any> | FieldReadFunction<any>,
	created_at?: FieldPolicy<any> | FieldReadFunction<any>,
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
	room_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | room_min_fieldsKeySpecifier | (() => undefined | room_min_fieldsKeySpecifier),
		fields?: room_min_fieldsFieldPolicy,
	},
	room_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | room_mutation_responseKeySpecifier | (() => undefined | room_mutation_responseKeySpecifier),
		fields?: room_mutation_responseFieldPolicy,
	},
	room_participants?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | room_participantsKeySpecifier | (() => undefined | room_participantsKeySpecifier),
		fields?: room_participantsFieldPolicy,
	},
	room_participants_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | room_participants_aggregateKeySpecifier | (() => undefined | room_participants_aggregateKeySpecifier),
		fields?: room_participants_aggregateFieldPolicy,
	},
	room_participants_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | room_participants_aggregate_fieldsKeySpecifier | (() => undefined | room_participants_aggregate_fieldsKeySpecifier),
		fields?: room_participants_aggregate_fieldsFieldPolicy,
	},
	room_participants_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | room_participants_max_fieldsKeySpecifier | (() => undefined | room_participants_max_fieldsKeySpecifier),
		fields?: room_participants_max_fieldsFieldPolicy,
	},
	room_participants_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | room_participants_min_fieldsKeySpecifier | (() => undefined | room_participants_min_fieldsKeySpecifier),
		fields?: room_participants_min_fieldsFieldPolicy,
	},
	room_participants_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | room_participants_mutation_responseKeySpecifier | (() => undefined | room_participants_mutation_responseKeySpecifier),
		fields?: room_participants_mutation_responseFieldPolicy,
	},
	subscription_root?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | subscription_rootKeySpecifier | (() => undefined | subscription_rootKeySpecifier),
		fields?: subscription_rootFieldPolicy,
	},
	thread?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | threadKeySpecifier | (() => undefined | threadKeySpecifier),
		fields?: threadFieldPolicy,
	},
	thread_aggregate?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | thread_aggregateKeySpecifier | (() => undefined | thread_aggregateKeySpecifier),
		fields?: thread_aggregateFieldPolicy,
	},
	thread_aggregate_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | thread_aggregate_fieldsKeySpecifier | (() => undefined | thread_aggregate_fieldsKeySpecifier),
		fields?: thread_aggregate_fieldsFieldPolicy,
	},
	thread_max_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | thread_max_fieldsKeySpecifier | (() => undefined | thread_max_fieldsKeySpecifier),
		fields?: thread_max_fieldsFieldPolicy,
	},
	thread_min_fields?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | thread_min_fieldsKeySpecifier | (() => undefined | thread_min_fieldsKeySpecifier),
		fields?: thread_min_fieldsFieldPolicy,
	},
	thread_mutation_response?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | thread_mutation_responseKeySpecifier | (() => undefined | thread_mutation_responseKeySpecifier),
		fields?: thread_mutation_responseFieldPolicy,
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
export const RoomBasicInfoFragmentDoc = gql`
    fragment RoomBasicInfo on room {
  id
  name
  participants {
    user {
      id
      name
      avatarUrl: avatar_url
    }
  }
}
    `;
export const RoomDetailedInfoFragmentDoc = gql`
    fragment RoomDetailedInfo on room {
  id
  name
  participants {
    user {
      id
      name
      avatarUrl: avatar_url
    }
  }
  threads {
    id
    name
    index
  }
}
    `;
export const ParticipantBasicInfoFragmentDoc = gql`
    fragment ParticipantBasicInfo on room_participants {
  user {
    name
    avatarUrl: avatar_url
  }
}
    `;
export const ThreadDetailedInfoFragmentDoc = gql`
    fragment ThreadDetailedInfo on thread {
  id
  name
  index
}
    `;
export const ThreadMessageBasicInfoFragmentDoc = gql`
    fragment ThreadMessageBasicInfo on message {
  id
  text
  createdAt: created_at
  user {
    id
    name
    avatarUrl: avatar_url
  }
}
    `;
export const RoomParticipantBasicInfoFragmentDoc = gql`
    fragment RoomParticipantBasicInfo on room_participants {
  user {
    name
    avatarUrl: avatar_url
  }
}
    `;
export const GetRoomsTestQueryDocument = gql`
    query GetRoomsTestQuery {
  room {
    id
  }
}
    `;

/**
 * __useGetRoomsTestQueryQuery__
 *
 * To run a query within a React component, call `useGetRoomsTestQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRoomsTestQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRoomsTestQueryQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetRoomsTestQueryQuery(baseOptions?: Apollo.QueryHookOptions<GetRoomsTestQueryQuery, GetRoomsTestQueryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRoomsTestQueryQuery, GetRoomsTestQueryQueryVariables>(GetRoomsTestQueryDocument, options);
      }
export function useGetRoomsTestQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRoomsTestQueryQuery, GetRoomsTestQueryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRoomsTestQueryQuery, GetRoomsTestQueryQueryVariables>(GetRoomsTestQueryDocument, options);
        }
export type GetRoomsTestQueryQueryHookResult = ReturnType<typeof useGetRoomsTestQueryQuery>;
export type GetRoomsTestQueryLazyQueryHookResult = ReturnType<typeof useGetRoomsTestQueryLazyQuery>;
export type GetRoomsTestQueryQueryResult = Apollo.QueryResult<GetRoomsTestQueryQuery, GetRoomsTestQueryQueryVariables>;
export const CreateInviteDocument = gql`
    mutation CreateInvite($email: String!, $roomId: uuid) {
  invite: insert_room_invites_one(object: {email: $email, room_id: $roomId}) {
    id
    email
    usedAt: used_at
  }
}
    `;
export type CreateInviteMutationFn = Apollo.MutationFunction<CreateInviteMutation, CreateInviteMutationVariables>;

/**
 * __useCreateInviteMutation__
 *
 * To run a mutation, you first call `useCreateInviteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateInviteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createInviteMutation, { data, loading, error }] = useCreateInviteMutation({
 *   variables: {
 *      email: // value for 'email'
 *      roomId: // value for 'roomId'
 *   },
 * });
 */
export function useCreateInviteMutation(baseOptions?: Apollo.MutationHookOptions<CreateInviteMutation, CreateInviteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateInviteMutation, CreateInviteMutationVariables>(CreateInviteDocument, options);
      }
export type CreateInviteMutationHookResult = ReturnType<typeof useCreateInviteMutation>;
export type CreateInviteMutationResult = Apollo.MutationResult<CreateInviteMutation>;
export type CreateInviteMutationOptions = Apollo.BaseMutationOptions<CreateInviteMutation, CreateInviteMutationVariables>;
export const GetRoomInvitesDocument = gql`
    query GetRoomInvites($roomId: uuid!) {
  invites: room_invites(where: {room_id: {_eq: $roomId}}) {
    id
    email
    usedAt: used_at
  }
}
    `;

/**
 * __useGetRoomInvitesQuery__
 *
 * To run a query within a React component, call `useGetRoomInvitesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRoomInvitesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRoomInvitesQuery({
 *   variables: {
 *      roomId: // value for 'roomId'
 *   },
 * });
 */
export function useGetRoomInvitesQuery(baseOptions: Apollo.QueryHookOptions<GetRoomInvitesQuery, GetRoomInvitesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRoomInvitesQuery, GetRoomInvitesQueryVariables>(GetRoomInvitesDocument, options);
      }
export function useGetRoomInvitesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRoomInvitesQuery, GetRoomInvitesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRoomInvitesQuery, GetRoomInvitesQueryVariables>(GetRoomInvitesDocument, options);
        }
export type GetRoomInvitesQueryHookResult = ReturnType<typeof useGetRoomInvitesQuery>;
export type GetRoomInvitesLazyQueryHookResult = ReturnType<typeof useGetRoomInvitesLazyQuery>;
export type GetRoomInvitesQueryResult = Apollo.QueryResult<GetRoomInvitesQuery, GetRoomInvitesQueryVariables>;
export const AcceptInviteDocument = gql`
    mutation AcceptInvite($code: String!) {
  invite: accept_invite(code: $code) {
    roomId: room_id
  }
}
    `;
export type AcceptInviteMutationFn = Apollo.MutationFunction<AcceptInviteMutation, AcceptInviteMutationVariables>;

/**
 * __useAcceptInviteMutation__
 *
 * To run a mutation, you first call `useAcceptInviteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptInviteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptInviteMutation, { data, loading, error }] = useAcceptInviteMutation({
 *   variables: {
 *      code: // value for 'code'
 *   },
 * });
 */
export function useAcceptInviteMutation(baseOptions?: Apollo.MutationHookOptions<AcceptInviteMutation, AcceptInviteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AcceptInviteMutation, AcceptInviteMutationVariables>(AcceptInviteDocument, options);
      }
export type AcceptInviteMutationHookResult = ReturnType<typeof useAcceptInviteMutation>;
export type AcceptInviteMutationResult = Apollo.MutationResult<AcceptInviteMutation>;
export type AcceptInviteMutationOptions = Apollo.BaseMutationOptions<AcceptInviteMutation, AcceptInviteMutationVariables>;
export const GetRoomsDocument = gql`
    query GetRooms {
  room {
    ...RoomBasicInfo
  }
}
    ${RoomBasicInfoFragmentDoc}`;

/**
 * __useGetRoomsQuery__
 *
 * To run a query within a React component, call `useGetRoomsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRoomsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRoomsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetRoomsQuery(baseOptions?: Apollo.QueryHookOptions<GetRoomsQuery, GetRoomsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRoomsQuery, GetRoomsQueryVariables>(GetRoomsDocument, options);
      }
export function useGetRoomsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRoomsQuery, GetRoomsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRoomsQuery, GetRoomsQueryVariables>(GetRoomsDocument, options);
        }
export type GetRoomsQueryHookResult = ReturnType<typeof useGetRoomsQuery>;
export type GetRoomsLazyQueryHookResult = ReturnType<typeof useGetRoomsLazyQuery>;
export type GetRoomsQueryResult = Apollo.QueryResult<GetRoomsQuery, GetRoomsQueryVariables>;
export const GetSingleRoomDocument = gql`
    query GetSingleRoom($id: uuid!) {
  room: room_by_pk(id: $id) {
    ...RoomDetailedInfo
  }
}
    ${RoomDetailedInfoFragmentDoc}`;

/**
 * __useGetSingleRoomQuery__
 *
 * To run a query within a React component, call `useGetSingleRoomQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSingleRoomQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSingleRoomQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetSingleRoomQuery(baseOptions: Apollo.QueryHookOptions<GetSingleRoomQuery, GetSingleRoomQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSingleRoomQuery, GetSingleRoomQueryVariables>(GetSingleRoomDocument, options);
      }
export function useGetSingleRoomLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSingleRoomQuery, GetSingleRoomQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSingleRoomQuery, GetSingleRoomQueryVariables>(GetSingleRoomDocument, options);
        }
export type GetSingleRoomQueryHookResult = ReturnType<typeof useGetSingleRoomQuery>;
export type GetSingleRoomLazyQueryHookResult = ReturnType<typeof useGetSingleRoomLazyQuery>;
export type GetSingleRoomQueryResult = Apollo.QueryResult<GetSingleRoomQuery, GetSingleRoomQueryVariables>;
export const CreateRoomDocument = gql`
    mutation CreateRoom($name: String!) {
  room: insert_room_one(object: {name: $name}) {
    ...RoomBasicInfo
  }
}
    ${RoomBasicInfoFragmentDoc}`;
export type CreateRoomMutationFn = Apollo.MutationFunction<CreateRoomMutation, CreateRoomMutationVariables>;

/**
 * __useCreateRoomMutation__
 *
 * To run a mutation, you first call `useCreateRoomMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRoomMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRoomMutation, { data, loading, error }] = useCreateRoomMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateRoomMutation(baseOptions?: Apollo.MutationHookOptions<CreateRoomMutation, CreateRoomMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateRoomMutation, CreateRoomMutationVariables>(CreateRoomDocument, options);
      }
export type CreateRoomMutationHookResult = ReturnType<typeof useCreateRoomMutation>;
export type CreateRoomMutationResult = Apollo.MutationResult<CreateRoomMutation>;
export type CreateRoomMutationOptions = Apollo.BaseMutationOptions<CreateRoomMutation, CreateRoomMutationVariables>;
export const RoomParticipantsDocument = gql`
    subscription RoomParticipants($roomId: uuid!) {
  participants: room_participants(where: {room_id: {_eq: $roomId}}) {
    ...ParticipantBasicInfo
  }
}
    ${ParticipantBasicInfoFragmentDoc}`;

/**
 * __useRoomParticipantsSubscription__
 *
 * To run a query within a React component, call `useRoomParticipantsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useRoomParticipantsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRoomParticipantsSubscription({
 *   variables: {
 *      roomId: // value for 'roomId'
 *   },
 * });
 */
export function useRoomParticipantsSubscription(baseOptions: Apollo.SubscriptionHookOptions<RoomParticipantsSubscription, RoomParticipantsSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<RoomParticipantsSubscription, RoomParticipantsSubscriptionVariables>(RoomParticipantsDocument, options);
      }
export type RoomParticipantsSubscriptionHookResult = ReturnType<typeof useRoomParticipantsSubscription>;
export type RoomParticipantsSubscriptionResult = Apollo.SubscriptionResult<RoomParticipantsSubscription>;
export const CreateThreadDocument = gql`
    mutation CreateThread($name: String!, $roomId: uuid!, $index: String!) {
  thread: insert_thread_one(
    object: {name: $name, room_id: $roomId, index: $index}
  ) {
    id
  }
}
    `;
export type CreateThreadMutationFn = Apollo.MutationFunction<CreateThreadMutation, CreateThreadMutationVariables>;

/**
 * __useCreateThreadMutation__
 *
 * To run a mutation, you first call `useCreateThreadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateThreadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createThreadMutation, { data, loading, error }] = useCreateThreadMutation({
 *   variables: {
 *      name: // value for 'name'
 *      roomId: // value for 'roomId'
 *      index: // value for 'index'
 *   },
 * });
 */
export function useCreateThreadMutation(baseOptions?: Apollo.MutationHookOptions<CreateThreadMutation, CreateThreadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateThreadMutation, CreateThreadMutationVariables>(CreateThreadDocument, options);
      }
export type CreateThreadMutationHookResult = ReturnType<typeof useCreateThreadMutation>;
export type CreateThreadMutationResult = Apollo.MutationResult<CreateThreadMutation>;
export type CreateThreadMutationOptions = Apollo.BaseMutationOptions<CreateThreadMutation, CreateThreadMutationVariables>;
export const RoomThreadsDocument = gql`
    subscription RoomThreads($roomId: uuid!) {
  threads: thread(where: {room_id: {_eq: $roomId}}, order_by: [{index: asc}]) {
    ...ThreadDetailedInfo
  }
}
    ${ThreadDetailedInfoFragmentDoc}`;

/**
 * __useRoomThreadsSubscription__
 *
 * To run a query within a React component, call `useRoomThreadsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useRoomThreadsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRoomThreadsSubscription({
 *   variables: {
 *      roomId: // value for 'roomId'
 *   },
 * });
 */
export function useRoomThreadsSubscription(baseOptions: Apollo.SubscriptionHookOptions<RoomThreadsSubscription, RoomThreadsSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<RoomThreadsSubscription, RoomThreadsSubscriptionVariables>(RoomThreadsDocument, options);
      }
export type RoomThreadsSubscriptionHookResult = ReturnType<typeof useRoomThreadsSubscription>;
export type RoomThreadsSubscriptionResult = Apollo.SubscriptionResult<RoomThreadsSubscription>;
export const ThreadMessagesDocument = gql`
    subscription ThreadMessages($threadId: uuid!) {
  messages: message(
    where: {thread_id: {_eq: $threadId}}
    order_by: [{created_at: asc}]
  ) {
    ...ThreadMessageBasicInfo
  }
}
    ${ThreadMessageBasicInfoFragmentDoc}`;

/**
 * __useThreadMessagesSubscription__
 *
 * To run a query within a React component, call `useThreadMessagesSubscription` and pass it any options that fit your needs.
 * When your component renders, `useThreadMessagesSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useThreadMessagesSubscription({
 *   variables: {
 *      threadId: // value for 'threadId'
 *   },
 * });
 */
export function useThreadMessagesSubscription(baseOptions: Apollo.SubscriptionHookOptions<ThreadMessagesSubscription, ThreadMessagesSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<ThreadMessagesSubscription, ThreadMessagesSubscriptionVariables>(ThreadMessagesDocument, options);
      }
export type ThreadMessagesSubscriptionHookResult = ReturnType<typeof useThreadMessagesSubscription>;
export type ThreadMessagesSubscriptionResult = Apollo.SubscriptionResult<ThreadMessagesSubscription>;
export const CreateTextMessageDocument = gql`
    mutation CreateTextMessage($text: String!, $threadId: uuid!) {
  message: insert_message_one(
    object: {text: $text, thread_id: $threadId, type: TEXT}
  ) {
    ...ThreadMessageBasicInfo
  }
}
    ${ThreadMessageBasicInfoFragmentDoc}`;
export type CreateTextMessageMutationFn = Apollo.MutationFunction<CreateTextMessageMutation, CreateTextMessageMutationVariables>;

/**
 * __useCreateTextMessageMutation__
 *
 * To run a mutation, you first call `useCreateTextMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTextMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTextMessageMutation, { data, loading, error }] = useCreateTextMessageMutation({
 *   variables: {
 *      text: // value for 'text'
 *      threadId: // value for 'threadId'
 *   },
 * });
 */
export function useCreateTextMessageMutation(baseOptions?: Apollo.MutationHookOptions<CreateTextMessageMutation, CreateTextMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTextMessageMutation, CreateTextMessageMutationVariables>(CreateTextMessageDocument, options);
      }
export type CreateTextMessageMutationHookResult = ReturnType<typeof useCreateTextMessageMutation>;
export type CreateTextMessageMutationResult = Apollo.MutationResult<CreateTextMessageMutation>;
export type CreateTextMessageMutationOptions = Apollo.BaseMutationOptions<CreateTextMessageMutation, CreateTextMessageMutationVariables>;
export const UpdateTextMessageDocument = gql`
    mutation UpdateTextMessage($id: uuid!, $text: String!) {
  update_message(where: {id: {_eq: $id}}, _set: {text: $text}) {
    message: returning {
      ...ThreadMessageBasicInfo
    }
  }
}
    ${ThreadMessageBasicInfoFragmentDoc}`;
export type UpdateTextMessageMutationFn = Apollo.MutationFunction<UpdateTextMessageMutation, UpdateTextMessageMutationVariables>;

/**
 * __useUpdateTextMessageMutation__
 *
 * To run a mutation, you first call `useUpdateTextMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTextMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTextMessageMutation, { data, loading, error }] = useUpdateTextMessageMutation({
 *   variables: {
 *      id: // value for 'id'
 *      text: // value for 'text'
 *   },
 * });
 */
export function useUpdateTextMessageMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTextMessageMutation, UpdateTextMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTextMessageMutation, UpdateTextMessageMutationVariables>(UpdateTextMessageDocument, options);
      }
export type UpdateTextMessageMutationHookResult = ReturnType<typeof useUpdateTextMessageMutation>;
export type UpdateTextMessageMutationResult = Apollo.MutationResult<UpdateTextMessageMutation>;
export type UpdateTextMessageMutationOptions = Apollo.BaseMutationOptions<UpdateTextMessageMutation, UpdateTextMessageMutationVariables>;
export const DeleteTextMessageDocument = gql`
    mutation DeleteTextMessage($id: uuid!) {
  delete_message(where: {id: {_eq: $id}}) {
    message: returning {
      id
    }
  }
}
    `;
export type DeleteTextMessageMutationFn = Apollo.MutationFunction<DeleteTextMessageMutation, DeleteTextMessageMutationVariables>;

/**
 * __useDeleteTextMessageMutation__
 *
 * To run a mutation, you first call `useDeleteTextMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTextMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTextMessageMutation, { data, loading, error }] = useDeleteTextMessageMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteTextMessageMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTextMessageMutation, DeleteTextMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTextMessageMutation, DeleteTextMessageMutationVariables>(DeleteTextMessageDocument, options);
      }
export type DeleteTextMessageMutationHookResult = ReturnType<typeof useDeleteTextMessageMutation>;
export type DeleteTextMessageMutationResult = Apollo.MutationResult<DeleteTextMessageMutation>;
export type DeleteTextMessageMutationOptions = Apollo.BaseMutationOptions<DeleteTextMessageMutation, DeleteTextMessageMutationVariables>;

      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {}
};
      export default result;
    