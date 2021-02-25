
/**
 * Client
**/

import * as runtime from './runtime';
declare const prisma: unique symbol
export type PrismaPromise<A> = Promise<A> & {[prisma]: true}
type UnwrapTuple<Tuple extends readonly unknown[]> = {
  [K in keyof Tuple]: K extends `${number}` ? Tuple[K] extends PrismaPromise<infer X> ? X : never : never
};


/**
 * Model account
 */

export type account = {
  id: string
  created_at: Date
  user_id: string
  provider_id: string
  provider_type: string
  provider_account_id: string
  refresh_token: string | null
  access_token: string | null
  access_token_expires: Date | null
  updated_at: Date
}

/**
 * Model message
 */

export type message = {
  thread_id: string
  user_id: string
  created_at: Date
  type: string
  media_url: string | null
  text: string | null
  transcription: string | null
  id: string
}

/**
 * Model message_type
 */

export type message_type = {
  value: string
}

/**
 * Model room
 */

export type room = {
  id: string
  creator_id: string
  name: string | null
  created_at: Date
  deadline: Date
  notification_job_id: string | null
  summary: string | null
  finished_at: Date | null
}

/**
 * Model room_invites
 */

export type room_invites = {
  id: string
  room_id: string
  inviter_id: string
  code: string
  email: string
  created_at: Date
  used_at: Date | null
}

/**
 * Model room_participants
 */

export type room_participants = {
  room_id: string
  user_id: string
}

/**
 * Model thread
 */

export type thread = {
  id: string
  room_id: string
  name: string | null
  index: string
}

/**
 * Model user
 */

export type user = {
  id: string
  email: string | null
  firebase_id: string | null
  name: string | null
  avatar_url: string | null
  created_at: Date
}


/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js (ORM replacement)
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Accounts
 * const accounts = await prisma.account.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof T ? T['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<T['log']> : never : never,
  GlobalReject = 'rejectOnNotFound' extends keyof T
    ? T['rejectOnNotFound']
    : false
      > {
      /**
       * @private
       */
      private fetcher;
      /**
       * @private
       */
      private readonly dmmf;
      /**
       * @private
       */
      private connectionPromise?;
      /**
       * @private
       */
      private disconnectionPromise?;
      /**
       * @private
       */
      private readonly engineConfig;
      /**
       * @private
       */
      private readonly measurePerformance;

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js (ORM replacement)
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Accounts
   * const accounts = await prisma.account.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<T, Prisma.PrismaClientOptions>);
  $on<V extends (U | 'beforeExit')>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : V extends 'beforeExit' ? () => Promise<void> : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): Promise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): Promise<any>;

  /**
   * Add a middleware
   */
  $use(cb: Prisma.Middleware): void

  /**
   * Executes a raw query and returns the number of affected rows
   * @example
   * ```
   * // With parameters use prisma.executeRaw``, values will be escaped automatically
   * const result = await prisma.executeRaw`UPDATE User SET cool = ${true} WHERE id = ${1};`
   * // Or
   * const result = await prisma.executeRaw('UPDATE User SET cool = $1 WHERE id = $2 ;', true, 1)
  * ```
  * 
  * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
  */
  $executeRaw < T = any > (query: string | TemplateStringsArray | Prisma.Sql, ...values: any[]): PrismaPromise<number>;

  /**
   * Performs a raw query and returns the SELECT data
   * @example
   * ```
   * // With parameters use prisma.queryRaw``, values will be escaped automatically
   * const result = await prisma.queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'ema.il'};`
   * // Or
   * const result = await prisma.queryRaw('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'ema.il')
  * ```
  * 
  * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
  */
  $queryRaw < T = any > (query: string | TemplateStringsArray | Prisma.Sql, ...values: any[]): PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends PrismaPromise<any>[]>(arg: [...P]): Promise<UnwrapTuple<P>>

      /**
   * `prisma.account`: Exposes CRUD operations for the **account** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accounts
    * const accounts = await prisma.account.findMany()
    * ```
    */
  get account(): Prisma.accountDelegate<GlobalReject>;

  /**
   * `prisma.message`: Exposes CRUD operations for the **message** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Messages
    * const messages = await prisma.message.findMany()
    * ```
    */
  get message(): Prisma.messageDelegate<GlobalReject>;

  /**
   * `prisma.message_type`: Exposes CRUD operations for the **message_type** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Message_types
    * const message_types = await prisma.message_type.findMany()
    * ```
    */
  get message_type(): Prisma.message_typeDelegate<GlobalReject>;

  /**
   * `prisma.room`: Exposes CRUD operations for the **room** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Rooms
    * const rooms = await prisma.room.findMany()
    * ```
    */
  get room(): Prisma.roomDelegate<GlobalReject>;

  /**
   * `prisma.room_invites`: Exposes CRUD operations for the **room_invites** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Room_invites
    * const room_invites = await prisma.room_invites.findMany()
    * ```
    */
  get room_invites(): Prisma.room_invitesDelegate<GlobalReject>;

  /**
   * `prisma.room_participants`: Exposes CRUD operations for the **room_participants** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Room_participants
    * const room_participants = await prisma.room_participants.findMany()
    * ```
    */
  get room_participants(): Prisma.room_participantsDelegate<GlobalReject>;

  /**
   * `prisma.thread`: Exposes CRUD operations for the **thread** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Threads
    * const threads = await prisma.thread.findMany()
    * ```
    */
  get thread(): Prisma.threadDelegate<GlobalReject>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **user** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.userDelegate<GlobalReject>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  /**
   * Prisma Client JS version: 2.17.0
   * Query Engine version: 3c463ebd78b1d21d8fdacdd27899e280cf686223
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON object.
   * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. 
   */
  export type JsonObject = {[Key in string]?: JsonValue}
 
  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}
 
  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue = string | number | boolean | null | JsonObject | JsonArray

  /**
   * Same as JsonObject, but allows undefined
   */
  export type InputJsonObject = {[Key in string]?: JsonValue}
 
  export interface InputJsonArray extends Array<JsonValue> {}
 
  export type InputJsonValue = undefined |  string | number | boolean | null | InputJsonObject | InputJsonArray
   type SelectAndInclude = {
    select: any
    include: any
  }
  type HasSelect = {
    select: any
  }
  type HasInclude = {
    include: any
  }
  type CheckSelect<T, S, U> = T extends SelectAndInclude
    ? 'Please either choose `select` or `include`'
    : T extends HasSelect
    ? U
    : T extends HasInclude
    ? U
    : S

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => Promise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = {
    [key in keyof T]: T[key] extends false | undefined | null ? never : key
  }[keyof T]

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Buffer
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  export type Union = any

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Exact<A, W = unknown> = 
  W extends unknown ? A extends Narrowable ? Cast<A, W> : Cast<
  {[K in keyof A]: K extends keyof W ? Exact<A[K], W[K]> : never},
  {[K in keyof W]: K extends keyof A ? Exact<A[K], W[K]> : W[K]}>
  : never;

  type Narrowable = string | number | boolean | bigint;

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;

  export function validator<V>(): <S>(select: Exact<S, V>) => S;

  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, 'avg' | 'sum' | 'count' | 'min' | 'max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but with an array
   */
  type PickArray<T, K extends Array<keyof T>> = Prisma__Pick<T, TupleToUnion<K>>

  class PrismaClientFetcher {
    private readonly prisma;
    private readonly debug;
    private readonly hooks?;
    constructor(prisma: PrismaClient<any, any>, debug?: boolean, hooks?: Hooks | undefined);
    request<T>(document: any, dataPath?: string[], rootField?: string, typeName?: string, isList?: boolean, callsite?: string): Promise<T>;
    sanitizeMessage(message: string): string;
    protected unpack(document: any, data: any, path: string[], rootField?: string, isList?: boolean): any;
  }

  export const ModelName: {
    account: 'account',
    message: 'message',
    message_type: 'message_type',
    room: 'room',
    room_invites: 'room_invites',
    room_participants: 'room_participants',
    thread: 'thread',
    user: 'user'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  export type RejectOnNotFound = boolean | ((error: Error) => Error)
  export type RejectPerModel = { [P in ModelName]?: RejectOnNotFound }
  export type RejectPerOperation =  { [P in "findUnique" | "findFirst"]?: RejectPerModel | RejectOnNotFound } 
  type IsReject<T> = T extends true ? True : T extends (err: Error) => Error ? True : False
  export type HasReject<
    GlobalRejectSettings extends Prisma.PrismaClientOptions['rejectOnNotFound'],
    LocalRejectSettings,
    Action extends PrismaAction,
    Model extends ModelName
  > = LocalRejectSettings extends RejectOnNotFound
    ? IsReject<LocalRejectSettings>
    : GlobalRejectSettings extends RejectPerOperation
    ? Action extends keyof GlobalRejectSettings
      ? GlobalRejectSettings[Action] extends boolean
        ? IsReject<GlobalRejectSettings[Action]>
        : GlobalRejectSettings[Action] extends RejectPerModel
        ? Model extends keyof GlobalRejectSettings[Action]
          ? IsReject<GlobalRejectSettings[Action][Model]>
          : False
        : False
      : False
    : IsReject<GlobalRejectSettings>
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'

  export interface PrismaClientOptions {
    /**
     * Configure findUnique/findFirst to throw an error if the query returns null. 
     *  * @example
     * ```
     * // Reject on both findUnique/findFirst
     * rejectOnNotFound: true
     * // Reject only on findFirst with a custom error
     * rejectOnNotFound: { findFirst: (err) => new Error("Custom Error")}
     * // Reject on user.findUnique with a custom error
     * rejectOnNotFound: { findUnique: {User: (err) => new Error("User not found")}}
     * ```
     */
    rejectOnNotFound?: RejectOnNotFound | RejectPerOperation
    /**
     * Overwrites the datasource url from your prisma.schema file
     */
    datasources?: Datasources

    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat

    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: Array<LogLevel | LogDefinition>
  }

  export type Hooks = {
    beforeRequest?: (options: { query: string, path: string[], rootField?: string, typeName?: string, document: any }) => any
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findMany'
    | 'findFirst'
    | 'create'
    | 'createMany'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'

  /**
   * These options are being passed in to the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => Promise<T>,
  ) => Promise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined; 
  export type Datasource = {
    url?: string
  }


  /**
   * Model account
   */


  export type AggregateAccount = {
    count: AccountCountAggregateOutputType | null
    min: AccountMinAggregateOutputType | null
    max: AccountMaxAggregateOutputType | null
  }

  export type AccountMinAggregateOutputType = {
    id: string | null
    created_at: Date | null
    user_id: string | null
    provider_id: string | null
    provider_type: string | null
    provider_account_id: string | null
    refresh_token: string | null
    access_token: string | null
    access_token_expires: Date | null
    updated_at: Date | null
  }

  export type AccountMaxAggregateOutputType = {
    id: string | null
    created_at: Date | null
    user_id: string | null
    provider_id: string | null
    provider_type: string | null
    provider_account_id: string | null
    refresh_token: string | null
    access_token: string | null
    access_token_expires: Date | null
    updated_at: Date | null
  }

  export type AccountCountAggregateOutputType = {
    id: number | null
    created_at: number | null
    user_id: number | null
    provider_id: number | null
    provider_type: number | null
    provider_account_id: number | null
    refresh_token: number | null
    access_token: number | null
    access_token_expires: number | null
    updated_at: number | null
    _all: number
  }


  export type AccountMinAggregateInputType = {
    id?: true
    created_at?: true
    user_id?: true
    provider_id?: true
    provider_type?: true
    provider_account_id?: true
    refresh_token?: true
    access_token?: true
    access_token_expires?: true
    updated_at?: true
  }

  export type AccountMaxAggregateInputType = {
    id?: true
    created_at?: true
    user_id?: true
    provider_id?: true
    provider_type?: true
    provider_account_id?: true
    refresh_token?: true
    access_token?: true
    access_token_expires?: true
    updated_at?: true
  }

  export type AccountCountAggregateInputType = {
    id?: true
    created_at?: true
    user_id?: true
    provider_id?: true
    provider_type?: true
    provider_account_id?: true
    refresh_token?: true
    access_token?: true
    access_token_expires?: true
    updated_at?: true
    _all?: true
  }

  export type AccountAggregateArgs = {
    /**
     * Filter which account to aggregate.
    **/
    where?: accountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of accounts to fetch.
    **/
    orderBy?: Enumerable<accountOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
    **/
    cursor?: accountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` accounts from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` accounts.
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned accounts
    **/
    count?: true | AccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    min?: AccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    max?: AccountMaxAggregateInputType
  }

  export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
    [P in keyof T & keyof AggregateAccount]: P extends 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccount[P]>
      : GetScalarType<T[P], AggregateAccount[P]>
  }



  export type accountSelect = {
    id?: boolean
    created_at?: boolean
    user_id?: boolean
    provider_id?: boolean
    provider_type?: boolean
    provider_account_id?: boolean
    refresh_token?: boolean
    access_token?: boolean
    access_token_expires?: boolean
    updated_at?: boolean
    user?: boolean | userArgs
  }

  export type accountInclude = {
    user?: boolean | userArgs
  }

  export type accountGetPayload<
    S extends boolean | null | undefined | accountArgs,
    U = keyof S
      > = S extends true
        ? account
    : S extends undefined
    ? never
    : S extends accountArgs | accountFindManyArgs
    ?'include' extends U
    ? account  & {
    [P in TrueKeys<S['include']>]: 
          P extends 'user'
        ? userGetPayload<S['include'][P]> : never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]: P extends keyof account ?account [P]
  : 
          P extends 'user'
        ? userGetPayload<S['select'][P]> : never
  } 
    : account
  : account


  type accountCountArgs = Merge<
    Omit<accountFindManyArgs, 'select' | 'include'> & {
      select?: AccountCountAggregateInputType | true
    }
  >

  export interface accountDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one Account that matches the filter.
     * @param {accountFindUniqueArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends accountFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, accountFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'account'> extends True ? CheckSelect<T, Prisma__accountClient<account>, Prisma__accountClient<accountGetPayload<T>>> : CheckSelect<T, Prisma__accountClient<account | null >, Prisma__accountClient<accountGetPayload<T> | null >>

    /**
     * Find the first Account that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {accountFindFirstArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends accountFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, accountFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'account'> extends True ? CheckSelect<T, Prisma__accountClient<account>, Prisma__accountClient<accountGetPayload<T>>> : CheckSelect<T, Prisma__accountClient<account | null >, Prisma__accountClient<accountGetPayload<T> | null >>

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {accountFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.account.findMany()
     * 
     * // Get first 10 Accounts
     * const accounts = await prisma.account.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accountWithIdOnly = await prisma.account.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends accountFindManyArgs>(
      args?: SelectSubset<T, accountFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<account>>, PrismaPromise<Array<accountGetPayload<T>>>>

    /**
     * Create a Account.
     * @param {accountCreateArgs} args - Arguments to create a Account.
     * @example
     * // Create one Account
     * const Account = await prisma.account.create({
     *   data: {
     *     // ... data to create a Account
     *   }
     * })
     * 
    **/
    create<T extends accountCreateArgs>(
      args: SelectSubset<T, accountCreateArgs>
    ): CheckSelect<T, Prisma__accountClient<account>, Prisma__accountClient<accountGetPayload<T>>>

    /**
     * Delete a Account.
     * @param {accountDeleteArgs} args - Arguments to delete one Account.
     * @example
     * // Delete one Account
     * const Account = await prisma.account.delete({
     *   where: {
     *     // ... filter to delete one Account
     *   }
     * })
     * 
    **/
    delete<T extends accountDeleteArgs>(
      args: SelectSubset<T, accountDeleteArgs>
    ): CheckSelect<T, Prisma__accountClient<account>, Prisma__accountClient<accountGetPayload<T>>>

    /**
     * Update one Account.
     * @param {accountUpdateArgs} args - Arguments to update one Account.
     * @example
     * // Update one Account
     * const account = await prisma.account.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends accountUpdateArgs>(
      args: SelectSubset<T, accountUpdateArgs>
    ): CheckSelect<T, Prisma__accountClient<account>, Prisma__accountClient<accountGetPayload<T>>>

    /**
     * Delete zero or more Accounts.
     * @param {accountDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.account.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends accountDeleteManyArgs>(
      args?: SelectSubset<T, accountDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {accountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends accountUpdateManyArgs>(
      args: SelectSubset<T, accountUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one Account.
     * @param {accountUpsertArgs} args - Arguments to update or create a Account.
     * @example
     * // Update or create a Account
     * const account = await prisma.account.upsert({
     *   create: {
     *     // ... data to create a Account
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Account we want to update
     *   }
     * })
    **/
    upsert<T extends accountUpsertArgs>(
      args: SelectSubset<T, accountUpsertArgs>
    ): CheckSelect<T, Prisma__accountClient<account>, Prisma__accountClient<accountGetPayload<T>>>

    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {accountCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.account.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
    **/
    count<T extends accountCountArgs>(
      args?: Subset<T, accountCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AccountAggregateArgs>(args: Subset<T, AccountAggregateArgs>): PrismaPromise<GetAccountAggregateType<T>>


  }

  /**
   * The delegate class that acts as a "Promise-like" for account.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in 
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__accountClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    user<T extends userArgs = {}>(args?: Subset<T, userArgs>): CheckSelect<T, Prisma__userClient<user | null >, Prisma__userClient<userGetPayload<T> | null >>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * account findUnique
   */
  export type accountFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the account
    **/
    select?: accountSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: accountInclude | null
    /**
     * Throw an Error if a account can't be found
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which account to fetch.
    **/
    where: accountWhereUniqueInput
  }


  /**
   * account findFirst
   */
  export type accountFindFirstArgs = {
    /**
     * Select specific fields to fetch from the account
    **/
    select?: accountSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: accountInclude | null
    /**
     * Throw an Error if a account can't be found
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which account to fetch.
    **/
    where?: accountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of accounts to fetch.
    **/
    orderBy?: Enumerable<accountOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for accounts.
    **/
    cursor?: accountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` accounts from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` accounts.
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of accounts.
    **/
    distinct?: Enumerable<AccountScalarFieldEnum>
  }


  /**
   * account findMany
   */
  export type accountFindManyArgs = {
    /**
     * Select specific fields to fetch from the account
    **/
    select?: accountSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: accountInclude | null
    /**
     * Filter, which accounts to fetch.
    **/
    where?: accountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of accounts to fetch.
    **/
    orderBy?: Enumerable<accountOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing accounts.
    **/
    cursor?: accountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` accounts from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` accounts.
    **/
    skip?: number
    distinct?: Enumerable<AccountScalarFieldEnum>
  }


  /**
   * account create
   */
  export type accountCreateArgs = {
    /**
     * Select specific fields to fetch from the account
    **/
    select?: accountSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: accountInclude | null
    /**
     * The data needed to create a account.
    **/
    data: XOR<accountUncheckedCreateInput, accountCreateInput>
  }


  /**
   * account update
   */
  export type accountUpdateArgs = {
    /**
     * Select specific fields to fetch from the account
    **/
    select?: accountSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: accountInclude | null
    /**
     * The data needed to update a account.
    **/
    data: XOR<accountUncheckedUpdateInput, accountUpdateInput>
    /**
     * Choose, which account to update.
    **/
    where: accountWhereUniqueInput
  }


  /**
   * account updateMany
   */
  export type accountUpdateManyArgs = {
    data: XOR<accountUncheckedUpdateManyInput, accountUpdateManyMutationInput>
    where?: accountWhereInput
  }


  /**
   * account upsert
   */
  export type accountUpsertArgs = {
    /**
     * Select specific fields to fetch from the account
    **/
    select?: accountSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: accountInclude | null
    /**
     * The filter to search for the account to update in case it exists.
    **/
    where: accountWhereUniqueInput
    /**
     * In case the account found by the `where` argument doesn't exist, create a new account with this data.
    **/
    create: XOR<accountUncheckedCreateInput, accountCreateInput>
    /**
     * In case the account was found with the provided `where` argument, update it with this data.
    **/
    update: XOR<accountUncheckedUpdateInput, accountUpdateInput>
  }


  /**
   * account delete
   */
  export type accountDeleteArgs = {
    /**
     * Select specific fields to fetch from the account
    **/
    select?: accountSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: accountInclude | null
    /**
     * Filter which account to delete.
    **/
    where: accountWhereUniqueInput
  }


  /**
   * account deleteMany
   */
  export type accountDeleteManyArgs = {
    where?: accountWhereInput
  }


  /**
   * account without action
   */
  export type accountArgs = {
    /**
     * Select specific fields to fetch from the account
    **/
    select?: accountSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: accountInclude | null
  }



  /**
   * Model message
   */


  export type AggregateMessage = {
    count: MessageCountAggregateOutputType | null
    min: MessageMinAggregateOutputType | null
    max: MessageMaxAggregateOutputType | null
  }

  export type MessageMinAggregateOutputType = {
    thread_id: string | null
    user_id: string | null
    created_at: Date | null
    type: string | null
    media_url: string | null
    text: string | null
    transcription: string | null
    id: string | null
  }

  export type MessageMaxAggregateOutputType = {
    thread_id: string | null
    user_id: string | null
    created_at: Date | null
    type: string | null
    media_url: string | null
    text: string | null
    transcription: string | null
    id: string | null
  }

  export type MessageCountAggregateOutputType = {
    thread_id: number | null
    user_id: number | null
    created_at: number | null
    type: number | null
    media_url: number | null
    text: number | null
    transcription: number | null
    id: number | null
    _all: number
  }


  export type MessageMinAggregateInputType = {
    thread_id?: true
    user_id?: true
    created_at?: true
    type?: true
    media_url?: true
    text?: true
    transcription?: true
    id?: true
  }

  export type MessageMaxAggregateInputType = {
    thread_id?: true
    user_id?: true
    created_at?: true
    type?: true
    media_url?: true
    text?: true
    transcription?: true
    id?: true
  }

  export type MessageCountAggregateInputType = {
    thread_id?: true
    user_id?: true
    created_at?: true
    type?: true
    media_url?: true
    text?: true
    transcription?: true
    id?: true
    _all?: true
  }

  export type MessageAggregateArgs = {
    /**
     * Filter which message to aggregate.
    **/
    where?: messageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of messages to fetch.
    **/
    orderBy?: Enumerable<messageOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
    **/
    cursor?: messageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` messages from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` messages.
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned messages
    **/
    count?: true | MessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    min?: MessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    max?: MessageMaxAggregateInputType
  }

  export type GetMessageAggregateType<T extends MessageAggregateArgs> = {
    [P in keyof T & keyof AggregateMessage]: P extends 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMessage[P]>
      : GetScalarType<T[P], AggregateMessage[P]>
  }



  export type messageSelect = {
    thread_id?: boolean
    user_id?: boolean
    created_at?: boolean
    type?: boolean
    media_url?: boolean
    text?: boolean
    transcription?: boolean
    id?: boolean
    thread?: boolean | threadArgs
    message_type?: boolean | message_typeArgs
    user?: boolean | userArgs
  }

  export type messageInclude = {
    thread?: boolean | threadArgs
    message_type?: boolean | message_typeArgs
    user?: boolean | userArgs
  }

  export type messageGetPayload<
    S extends boolean | null | undefined | messageArgs,
    U = keyof S
      > = S extends true
        ? message
    : S extends undefined
    ? never
    : S extends messageArgs | messageFindManyArgs
    ?'include' extends U
    ? message  & {
    [P in TrueKeys<S['include']>]: 
          P extends 'thread'
        ? threadGetPayload<S['include'][P]> :
        P extends 'message_type'
        ? message_typeGetPayload<S['include'][P]> :
        P extends 'user'
        ? userGetPayload<S['include'][P]> : never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]: P extends keyof message ?message [P]
  : 
          P extends 'thread'
        ? threadGetPayload<S['select'][P]> :
        P extends 'message_type'
        ? message_typeGetPayload<S['select'][P]> :
        P extends 'user'
        ? userGetPayload<S['select'][P]> : never
  } 
    : message
  : message


  type messageCountArgs = Merge<
    Omit<messageFindManyArgs, 'select' | 'include'> & {
      select?: MessageCountAggregateInputType | true
    }
  >

  export interface messageDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one Message that matches the filter.
     * @param {messageFindUniqueArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends messageFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, messageFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'message'> extends True ? CheckSelect<T, Prisma__messageClient<message>, Prisma__messageClient<messageGetPayload<T>>> : CheckSelect<T, Prisma__messageClient<message | null >, Prisma__messageClient<messageGetPayload<T> | null >>

    /**
     * Find the first Message that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {messageFindFirstArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends messageFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, messageFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'message'> extends True ? CheckSelect<T, Prisma__messageClient<message>, Prisma__messageClient<messageGetPayload<T>>> : CheckSelect<T, Prisma__messageClient<message | null >, Prisma__messageClient<messageGetPayload<T> | null >>

    /**
     * Find zero or more Messages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {messageFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Messages
     * const messages = await prisma.message.findMany()
     * 
     * // Get first 10 Messages
     * const messages = await prisma.message.findMany({ take: 10 })
     * 
     * // Only select the `thread_id`
     * const messageWithThread_idOnly = await prisma.message.findMany({ select: { thread_id: true } })
     * 
    **/
    findMany<T extends messageFindManyArgs>(
      args?: SelectSubset<T, messageFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<message>>, PrismaPromise<Array<messageGetPayload<T>>>>

    /**
     * Create a Message.
     * @param {messageCreateArgs} args - Arguments to create a Message.
     * @example
     * // Create one Message
     * const Message = await prisma.message.create({
     *   data: {
     *     // ... data to create a Message
     *   }
     * })
     * 
    **/
    create<T extends messageCreateArgs>(
      args: SelectSubset<T, messageCreateArgs>
    ): CheckSelect<T, Prisma__messageClient<message>, Prisma__messageClient<messageGetPayload<T>>>

    /**
     * Delete a Message.
     * @param {messageDeleteArgs} args - Arguments to delete one Message.
     * @example
     * // Delete one Message
     * const Message = await prisma.message.delete({
     *   where: {
     *     // ... filter to delete one Message
     *   }
     * })
     * 
    **/
    delete<T extends messageDeleteArgs>(
      args: SelectSubset<T, messageDeleteArgs>
    ): CheckSelect<T, Prisma__messageClient<message>, Prisma__messageClient<messageGetPayload<T>>>

    /**
     * Update one Message.
     * @param {messageUpdateArgs} args - Arguments to update one Message.
     * @example
     * // Update one Message
     * const message = await prisma.message.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends messageUpdateArgs>(
      args: SelectSubset<T, messageUpdateArgs>
    ): CheckSelect<T, Prisma__messageClient<message>, Prisma__messageClient<messageGetPayload<T>>>

    /**
     * Delete zero or more Messages.
     * @param {messageDeleteManyArgs} args - Arguments to filter Messages to delete.
     * @example
     * // Delete a few Messages
     * const { count } = await prisma.message.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends messageDeleteManyArgs>(
      args?: SelectSubset<T, messageDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {messageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Messages
     * const message = await prisma.message.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends messageUpdateManyArgs>(
      args: SelectSubset<T, messageUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one Message.
     * @param {messageUpsertArgs} args - Arguments to update or create a Message.
     * @example
     * // Update or create a Message
     * const message = await prisma.message.upsert({
     *   create: {
     *     // ... data to create a Message
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Message we want to update
     *   }
     * })
    **/
    upsert<T extends messageUpsertArgs>(
      args: SelectSubset<T, messageUpsertArgs>
    ): CheckSelect<T, Prisma__messageClient<message>, Prisma__messageClient<messageGetPayload<T>>>

    /**
     * Count the number of Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {messageCountArgs} args - Arguments to filter Messages to count.
     * @example
     * // Count the number of Messages
     * const count = await prisma.message.count({
     *   where: {
     *     // ... the filter for the Messages we want to count
     *   }
     * })
    **/
    count<T extends messageCountArgs>(
      args?: Subset<T, messageCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Message.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MessageAggregateArgs>(args: Subset<T, MessageAggregateArgs>): PrismaPromise<GetMessageAggregateType<T>>


  }

  /**
   * The delegate class that acts as a "Promise-like" for message.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in 
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__messageClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    thread<T extends threadArgs = {}>(args?: Subset<T, threadArgs>): CheckSelect<T, Prisma__threadClient<thread | null >, Prisma__threadClient<threadGetPayload<T> | null >>;

    message_type<T extends message_typeArgs = {}>(args?: Subset<T, message_typeArgs>): CheckSelect<T, Prisma__message_typeClient<message_type | null >, Prisma__message_typeClient<message_typeGetPayload<T> | null >>;

    user<T extends userArgs = {}>(args?: Subset<T, userArgs>): CheckSelect<T, Prisma__userClient<user | null >, Prisma__userClient<userGetPayload<T> | null >>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * message findUnique
   */
  export type messageFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the message
    **/
    select?: messageSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: messageInclude | null
    /**
     * Throw an Error if a message can't be found
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which message to fetch.
    **/
    where: messageWhereUniqueInput
  }


  /**
   * message findFirst
   */
  export type messageFindFirstArgs = {
    /**
     * Select specific fields to fetch from the message
    **/
    select?: messageSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: messageInclude | null
    /**
     * Throw an Error if a message can't be found
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which message to fetch.
    **/
    where?: messageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of messages to fetch.
    **/
    orderBy?: Enumerable<messageOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for messages.
    **/
    cursor?: messageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` messages from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` messages.
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of messages.
    **/
    distinct?: Enumerable<MessageScalarFieldEnum>
  }


  /**
   * message findMany
   */
  export type messageFindManyArgs = {
    /**
     * Select specific fields to fetch from the message
    **/
    select?: messageSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: messageInclude | null
    /**
     * Filter, which messages to fetch.
    **/
    where?: messageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of messages to fetch.
    **/
    orderBy?: Enumerable<messageOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing messages.
    **/
    cursor?: messageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` messages from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` messages.
    **/
    skip?: number
    distinct?: Enumerable<MessageScalarFieldEnum>
  }


  /**
   * message create
   */
  export type messageCreateArgs = {
    /**
     * Select specific fields to fetch from the message
    **/
    select?: messageSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: messageInclude | null
    /**
     * The data needed to create a message.
    **/
    data: XOR<messageUncheckedCreateInput, messageCreateInput>
  }


  /**
   * message update
   */
  export type messageUpdateArgs = {
    /**
     * Select specific fields to fetch from the message
    **/
    select?: messageSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: messageInclude | null
    /**
     * The data needed to update a message.
    **/
    data: XOR<messageUncheckedUpdateInput, messageUpdateInput>
    /**
     * Choose, which message to update.
    **/
    where: messageWhereUniqueInput
  }


  /**
   * message updateMany
   */
  export type messageUpdateManyArgs = {
    data: XOR<messageUncheckedUpdateManyInput, messageUpdateManyMutationInput>
    where?: messageWhereInput
  }


  /**
   * message upsert
   */
  export type messageUpsertArgs = {
    /**
     * Select specific fields to fetch from the message
    **/
    select?: messageSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: messageInclude | null
    /**
     * The filter to search for the message to update in case it exists.
    **/
    where: messageWhereUniqueInput
    /**
     * In case the message found by the `where` argument doesn't exist, create a new message with this data.
    **/
    create: XOR<messageUncheckedCreateInput, messageCreateInput>
    /**
     * In case the message was found with the provided `where` argument, update it with this data.
    **/
    update: XOR<messageUncheckedUpdateInput, messageUpdateInput>
  }


  /**
   * message delete
   */
  export type messageDeleteArgs = {
    /**
     * Select specific fields to fetch from the message
    **/
    select?: messageSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: messageInclude | null
    /**
     * Filter which message to delete.
    **/
    where: messageWhereUniqueInput
  }


  /**
   * message deleteMany
   */
  export type messageDeleteManyArgs = {
    where?: messageWhereInput
  }


  /**
   * message without action
   */
  export type messageArgs = {
    /**
     * Select specific fields to fetch from the message
    **/
    select?: messageSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: messageInclude | null
  }



  /**
   * Model message_type
   */


  export type AggregateMessage_type = {
    count: Message_typeCountAggregateOutputType | null
    min: Message_typeMinAggregateOutputType | null
    max: Message_typeMaxAggregateOutputType | null
  }

  export type Message_typeMinAggregateOutputType = {
    value: string | null
  }

  export type Message_typeMaxAggregateOutputType = {
    value: string | null
  }

  export type Message_typeCountAggregateOutputType = {
    value: number | null
    _all: number
  }


  export type Message_typeMinAggregateInputType = {
    value?: true
  }

  export type Message_typeMaxAggregateInputType = {
    value?: true
  }

  export type Message_typeCountAggregateInputType = {
    value?: true
    _all?: true
  }

  export type Message_typeAggregateArgs = {
    /**
     * Filter which message_type to aggregate.
    **/
    where?: message_typeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of message_types to fetch.
    **/
    orderBy?: Enumerable<message_typeOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
    **/
    cursor?: message_typeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` message_types from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` message_types.
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned message_types
    **/
    count?: true | Message_typeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    min?: Message_typeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    max?: Message_typeMaxAggregateInputType
  }

  export type GetMessage_typeAggregateType<T extends Message_typeAggregateArgs> = {
    [P in keyof T & keyof AggregateMessage_type]: P extends 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMessage_type[P]>
      : GetScalarType<T[P], AggregateMessage_type[P]>
  }



  export type message_typeSelect = {
    value?: boolean
    message?: boolean | messageFindManyArgs
  }

  export type message_typeInclude = {
    message?: boolean | messageFindManyArgs
  }

  export type message_typeGetPayload<
    S extends boolean | null | undefined | message_typeArgs,
    U = keyof S
      > = S extends true
        ? message_type
    : S extends undefined
    ? never
    : S extends message_typeArgs | message_typeFindManyArgs
    ?'include' extends U
    ? message_type  & {
    [P in TrueKeys<S['include']>]: 
          P extends 'message'
        ? Array < messageGetPayload<S['include'][P]>>  : never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]: P extends keyof message_type ?message_type [P]
  : 
          P extends 'message'
        ? Array < messageGetPayload<S['select'][P]>>  : never
  } 
    : message_type
  : message_type


  type message_typeCountArgs = Merge<
    Omit<message_typeFindManyArgs, 'select' | 'include'> & {
      select?: Message_typeCountAggregateInputType | true
    }
  >

  export interface message_typeDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one Message_type that matches the filter.
     * @param {message_typeFindUniqueArgs} args - Arguments to find a Message_type
     * @example
     * // Get one Message_type
     * const message_type = await prisma.message_type.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends message_typeFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, message_typeFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'message_type'> extends True ? CheckSelect<T, Prisma__message_typeClient<message_type>, Prisma__message_typeClient<message_typeGetPayload<T>>> : CheckSelect<T, Prisma__message_typeClient<message_type | null >, Prisma__message_typeClient<message_typeGetPayload<T> | null >>

    /**
     * Find the first Message_type that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {message_typeFindFirstArgs} args - Arguments to find a Message_type
     * @example
     * // Get one Message_type
     * const message_type = await prisma.message_type.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends message_typeFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, message_typeFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'message_type'> extends True ? CheckSelect<T, Prisma__message_typeClient<message_type>, Prisma__message_typeClient<message_typeGetPayload<T>>> : CheckSelect<T, Prisma__message_typeClient<message_type | null >, Prisma__message_typeClient<message_typeGetPayload<T> | null >>

    /**
     * Find zero or more Message_types that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {message_typeFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Message_types
     * const message_types = await prisma.message_type.findMany()
     * 
     * // Get first 10 Message_types
     * const message_types = await prisma.message_type.findMany({ take: 10 })
     * 
     * // Only select the `value`
     * const message_typeWithValueOnly = await prisma.message_type.findMany({ select: { value: true } })
     * 
    **/
    findMany<T extends message_typeFindManyArgs>(
      args?: SelectSubset<T, message_typeFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<message_type>>, PrismaPromise<Array<message_typeGetPayload<T>>>>

    /**
     * Create a Message_type.
     * @param {message_typeCreateArgs} args - Arguments to create a Message_type.
     * @example
     * // Create one Message_type
     * const Message_type = await prisma.message_type.create({
     *   data: {
     *     // ... data to create a Message_type
     *   }
     * })
     * 
    **/
    create<T extends message_typeCreateArgs>(
      args: SelectSubset<T, message_typeCreateArgs>
    ): CheckSelect<T, Prisma__message_typeClient<message_type>, Prisma__message_typeClient<message_typeGetPayload<T>>>

    /**
     * Delete a Message_type.
     * @param {message_typeDeleteArgs} args - Arguments to delete one Message_type.
     * @example
     * // Delete one Message_type
     * const Message_type = await prisma.message_type.delete({
     *   where: {
     *     // ... filter to delete one Message_type
     *   }
     * })
     * 
    **/
    delete<T extends message_typeDeleteArgs>(
      args: SelectSubset<T, message_typeDeleteArgs>
    ): CheckSelect<T, Prisma__message_typeClient<message_type>, Prisma__message_typeClient<message_typeGetPayload<T>>>

    /**
     * Update one Message_type.
     * @param {message_typeUpdateArgs} args - Arguments to update one Message_type.
     * @example
     * // Update one Message_type
     * const message_type = await prisma.message_type.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends message_typeUpdateArgs>(
      args: SelectSubset<T, message_typeUpdateArgs>
    ): CheckSelect<T, Prisma__message_typeClient<message_type>, Prisma__message_typeClient<message_typeGetPayload<T>>>

    /**
     * Delete zero or more Message_types.
     * @param {message_typeDeleteManyArgs} args - Arguments to filter Message_types to delete.
     * @example
     * // Delete a few Message_types
     * const { count } = await prisma.message_type.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends message_typeDeleteManyArgs>(
      args?: SelectSubset<T, message_typeDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more Message_types.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {message_typeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Message_types
     * const message_type = await prisma.message_type.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends message_typeUpdateManyArgs>(
      args: SelectSubset<T, message_typeUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one Message_type.
     * @param {message_typeUpsertArgs} args - Arguments to update or create a Message_type.
     * @example
     * // Update or create a Message_type
     * const message_type = await prisma.message_type.upsert({
     *   create: {
     *     // ... data to create a Message_type
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Message_type we want to update
     *   }
     * })
    **/
    upsert<T extends message_typeUpsertArgs>(
      args: SelectSubset<T, message_typeUpsertArgs>
    ): CheckSelect<T, Prisma__message_typeClient<message_type>, Prisma__message_typeClient<message_typeGetPayload<T>>>

    /**
     * Count the number of Message_types.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {message_typeCountArgs} args - Arguments to filter Message_types to count.
     * @example
     * // Count the number of Message_types
     * const count = await prisma.message_type.count({
     *   where: {
     *     // ... the filter for the Message_types we want to count
     *   }
     * })
    **/
    count<T extends message_typeCountArgs>(
      args?: Subset<T, message_typeCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Message_typeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Message_type.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Message_typeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Message_typeAggregateArgs>(args: Subset<T, Message_typeAggregateArgs>): PrismaPromise<GetMessage_typeAggregateType<T>>


  }

  /**
   * The delegate class that acts as a "Promise-like" for message_type.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in 
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__message_typeClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    message<T extends messageFindManyArgs = {}>(args?: Subset<T, messageFindManyArgs>): CheckSelect<T, PrismaPromise<Array<message>>, PrismaPromise<Array<messageGetPayload<T>>>>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * message_type findUnique
   */
  export type message_typeFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the message_type
    **/
    select?: message_typeSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: message_typeInclude | null
    /**
     * Throw an Error if a message_type can't be found
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which message_type to fetch.
    **/
    where: message_typeWhereUniqueInput
  }


  /**
   * message_type findFirst
   */
  export type message_typeFindFirstArgs = {
    /**
     * Select specific fields to fetch from the message_type
    **/
    select?: message_typeSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: message_typeInclude | null
    /**
     * Throw an Error if a message_type can't be found
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which message_type to fetch.
    **/
    where?: message_typeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of message_types to fetch.
    **/
    orderBy?: Enumerable<message_typeOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for message_types.
    **/
    cursor?: message_typeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` message_types from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` message_types.
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of message_types.
    **/
    distinct?: Enumerable<Message_typeScalarFieldEnum>
  }


  /**
   * message_type findMany
   */
  export type message_typeFindManyArgs = {
    /**
     * Select specific fields to fetch from the message_type
    **/
    select?: message_typeSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: message_typeInclude | null
    /**
     * Filter, which message_types to fetch.
    **/
    where?: message_typeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of message_types to fetch.
    **/
    orderBy?: Enumerable<message_typeOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing message_types.
    **/
    cursor?: message_typeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` message_types from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` message_types.
    **/
    skip?: number
    distinct?: Enumerable<Message_typeScalarFieldEnum>
  }


  /**
   * message_type create
   */
  export type message_typeCreateArgs = {
    /**
     * Select specific fields to fetch from the message_type
    **/
    select?: message_typeSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: message_typeInclude | null
    /**
     * The data needed to create a message_type.
    **/
    data: XOR<message_typeUncheckedCreateInput, message_typeCreateInput>
  }


  /**
   * message_type update
   */
  export type message_typeUpdateArgs = {
    /**
     * Select specific fields to fetch from the message_type
    **/
    select?: message_typeSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: message_typeInclude | null
    /**
     * The data needed to update a message_type.
    **/
    data: XOR<message_typeUncheckedUpdateInput, message_typeUpdateInput>
    /**
     * Choose, which message_type to update.
    **/
    where: message_typeWhereUniqueInput
  }


  /**
   * message_type updateMany
   */
  export type message_typeUpdateManyArgs = {
    data: XOR<message_typeUncheckedUpdateManyInput, message_typeUpdateManyMutationInput>
    where?: message_typeWhereInput
  }


  /**
   * message_type upsert
   */
  export type message_typeUpsertArgs = {
    /**
     * Select specific fields to fetch from the message_type
    **/
    select?: message_typeSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: message_typeInclude | null
    /**
     * The filter to search for the message_type to update in case it exists.
    **/
    where: message_typeWhereUniqueInput
    /**
     * In case the message_type found by the `where` argument doesn't exist, create a new message_type with this data.
    **/
    create: XOR<message_typeUncheckedCreateInput, message_typeCreateInput>
    /**
     * In case the message_type was found with the provided `where` argument, update it with this data.
    **/
    update: XOR<message_typeUncheckedUpdateInput, message_typeUpdateInput>
  }


  /**
   * message_type delete
   */
  export type message_typeDeleteArgs = {
    /**
     * Select specific fields to fetch from the message_type
    **/
    select?: message_typeSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: message_typeInclude | null
    /**
     * Filter which message_type to delete.
    **/
    where: message_typeWhereUniqueInput
  }


  /**
   * message_type deleteMany
   */
  export type message_typeDeleteManyArgs = {
    where?: message_typeWhereInput
  }


  /**
   * message_type without action
   */
  export type message_typeArgs = {
    /**
     * Select specific fields to fetch from the message_type
    **/
    select?: message_typeSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: message_typeInclude | null
  }



  /**
   * Model room
   */


  export type AggregateRoom = {
    count: RoomCountAggregateOutputType | null
    min: RoomMinAggregateOutputType | null
    max: RoomMaxAggregateOutputType | null
  }

  export type RoomMinAggregateOutputType = {
    id: string | null
    creator_id: string | null
    name: string | null
    created_at: Date | null
    deadline: Date | null
    notification_job_id: string | null
    summary: string | null
    finished_at: Date | null
  }

  export type RoomMaxAggregateOutputType = {
    id: string | null
    creator_id: string | null
    name: string | null
    created_at: Date | null
    deadline: Date | null
    notification_job_id: string | null
    summary: string | null
    finished_at: Date | null
  }

  export type RoomCountAggregateOutputType = {
    id: number | null
    creator_id: number | null
    name: number | null
    created_at: number | null
    deadline: number | null
    notification_job_id: number | null
    summary: number | null
    finished_at: number | null
    _all: number
  }


  export type RoomMinAggregateInputType = {
    id?: true
    creator_id?: true
    name?: true
    created_at?: true
    deadline?: true
    notification_job_id?: true
    summary?: true
    finished_at?: true
  }

  export type RoomMaxAggregateInputType = {
    id?: true
    creator_id?: true
    name?: true
    created_at?: true
    deadline?: true
    notification_job_id?: true
    summary?: true
    finished_at?: true
  }

  export type RoomCountAggregateInputType = {
    id?: true
    creator_id?: true
    name?: true
    created_at?: true
    deadline?: true
    notification_job_id?: true
    summary?: true
    finished_at?: true
    _all?: true
  }

  export type RoomAggregateArgs = {
    /**
     * Filter which room to aggregate.
    **/
    where?: roomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of rooms to fetch.
    **/
    orderBy?: Enumerable<roomOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
    **/
    cursor?: roomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` rooms from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` rooms.
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned rooms
    **/
    count?: true | RoomCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    min?: RoomMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    max?: RoomMaxAggregateInputType
  }

  export type GetRoomAggregateType<T extends RoomAggregateArgs> = {
    [P in keyof T & keyof AggregateRoom]: P extends 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRoom[P]>
      : GetScalarType<T[P], AggregateRoom[P]>
  }



  export type roomSelect = {
    id?: boolean
    creator_id?: boolean
    name?: boolean
    created_at?: boolean
    deadline?: boolean
    notification_job_id?: boolean
    summary?: boolean
    finished_at?: boolean
    user?: boolean | userArgs
    room_invites?: boolean | room_invitesFindManyArgs
    room_participants?: boolean | room_participantsFindManyArgs
    thread?: boolean | threadFindManyArgs
  }

  export type roomInclude = {
    user?: boolean | userArgs
    room_invites?: boolean | room_invitesFindManyArgs
    room_participants?: boolean | room_participantsFindManyArgs
    thread?: boolean | threadFindManyArgs
  }

  export type roomGetPayload<
    S extends boolean | null | undefined | roomArgs,
    U = keyof S
      > = S extends true
        ? room
    : S extends undefined
    ? never
    : S extends roomArgs | roomFindManyArgs
    ?'include' extends U
    ? room  & {
    [P in TrueKeys<S['include']>]: 
          P extends 'user'
        ? userGetPayload<S['include'][P]> :
        P extends 'room_invites'
        ? Array < room_invitesGetPayload<S['include'][P]>>  :
        P extends 'room_participants'
        ? Array < room_participantsGetPayload<S['include'][P]>>  :
        P extends 'thread'
        ? Array < threadGetPayload<S['include'][P]>>  : never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]: P extends keyof room ?room [P]
  : 
          P extends 'user'
        ? userGetPayload<S['select'][P]> :
        P extends 'room_invites'
        ? Array < room_invitesGetPayload<S['select'][P]>>  :
        P extends 'room_participants'
        ? Array < room_participantsGetPayload<S['select'][P]>>  :
        P extends 'thread'
        ? Array < threadGetPayload<S['select'][P]>>  : never
  } 
    : room
  : room


  type roomCountArgs = Merge<
    Omit<roomFindManyArgs, 'select' | 'include'> & {
      select?: RoomCountAggregateInputType | true
    }
  >

  export interface roomDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one Room that matches the filter.
     * @param {roomFindUniqueArgs} args - Arguments to find a Room
     * @example
     * // Get one Room
     * const room = await prisma.room.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends roomFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, roomFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'room'> extends True ? CheckSelect<T, Prisma__roomClient<room>, Prisma__roomClient<roomGetPayload<T>>> : CheckSelect<T, Prisma__roomClient<room | null >, Prisma__roomClient<roomGetPayload<T> | null >>

    /**
     * Find the first Room that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {roomFindFirstArgs} args - Arguments to find a Room
     * @example
     * // Get one Room
     * const room = await prisma.room.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends roomFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, roomFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'room'> extends True ? CheckSelect<T, Prisma__roomClient<room>, Prisma__roomClient<roomGetPayload<T>>> : CheckSelect<T, Prisma__roomClient<room | null >, Prisma__roomClient<roomGetPayload<T> | null >>

    /**
     * Find zero or more Rooms that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {roomFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Rooms
     * const rooms = await prisma.room.findMany()
     * 
     * // Get first 10 Rooms
     * const rooms = await prisma.room.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const roomWithIdOnly = await prisma.room.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends roomFindManyArgs>(
      args?: SelectSubset<T, roomFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<room>>, PrismaPromise<Array<roomGetPayload<T>>>>

    /**
     * Create a Room.
     * @param {roomCreateArgs} args - Arguments to create a Room.
     * @example
     * // Create one Room
     * const Room = await prisma.room.create({
     *   data: {
     *     // ... data to create a Room
     *   }
     * })
     * 
    **/
    create<T extends roomCreateArgs>(
      args: SelectSubset<T, roomCreateArgs>
    ): CheckSelect<T, Prisma__roomClient<room>, Prisma__roomClient<roomGetPayload<T>>>

    /**
     * Delete a Room.
     * @param {roomDeleteArgs} args - Arguments to delete one Room.
     * @example
     * // Delete one Room
     * const Room = await prisma.room.delete({
     *   where: {
     *     // ... filter to delete one Room
     *   }
     * })
     * 
    **/
    delete<T extends roomDeleteArgs>(
      args: SelectSubset<T, roomDeleteArgs>
    ): CheckSelect<T, Prisma__roomClient<room>, Prisma__roomClient<roomGetPayload<T>>>

    /**
     * Update one Room.
     * @param {roomUpdateArgs} args - Arguments to update one Room.
     * @example
     * // Update one Room
     * const room = await prisma.room.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends roomUpdateArgs>(
      args: SelectSubset<T, roomUpdateArgs>
    ): CheckSelect<T, Prisma__roomClient<room>, Prisma__roomClient<roomGetPayload<T>>>

    /**
     * Delete zero or more Rooms.
     * @param {roomDeleteManyArgs} args - Arguments to filter Rooms to delete.
     * @example
     * // Delete a few Rooms
     * const { count } = await prisma.room.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends roomDeleteManyArgs>(
      args?: SelectSubset<T, roomDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more Rooms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {roomUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Rooms
     * const room = await prisma.room.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends roomUpdateManyArgs>(
      args: SelectSubset<T, roomUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one Room.
     * @param {roomUpsertArgs} args - Arguments to update or create a Room.
     * @example
     * // Update or create a Room
     * const room = await prisma.room.upsert({
     *   create: {
     *     // ... data to create a Room
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Room we want to update
     *   }
     * })
    **/
    upsert<T extends roomUpsertArgs>(
      args: SelectSubset<T, roomUpsertArgs>
    ): CheckSelect<T, Prisma__roomClient<room>, Prisma__roomClient<roomGetPayload<T>>>

    /**
     * Count the number of Rooms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {roomCountArgs} args - Arguments to filter Rooms to count.
     * @example
     * // Count the number of Rooms
     * const count = await prisma.room.count({
     *   where: {
     *     // ... the filter for the Rooms we want to count
     *   }
     * })
    **/
    count<T extends roomCountArgs>(
      args?: Subset<T, roomCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RoomCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Room.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoomAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RoomAggregateArgs>(args: Subset<T, RoomAggregateArgs>): PrismaPromise<GetRoomAggregateType<T>>


  }

  /**
   * The delegate class that acts as a "Promise-like" for room.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in 
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__roomClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    user<T extends userArgs = {}>(args?: Subset<T, userArgs>): CheckSelect<T, Prisma__userClient<user | null >, Prisma__userClient<userGetPayload<T> | null >>;

    room_invites<T extends room_invitesFindManyArgs = {}>(args?: Subset<T, room_invitesFindManyArgs>): CheckSelect<T, PrismaPromise<Array<room_invites>>, PrismaPromise<Array<room_invitesGetPayload<T>>>>;

    room_participants<T extends room_participantsFindManyArgs = {}>(args?: Subset<T, room_participantsFindManyArgs>): CheckSelect<T, PrismaPromise<Array<room_participants>>, PrismaPromise<Array<room_participantsGetPayload<T>>>>;

    thread<T extends threadFindManyArgs = {}>(args?: Subset<T, threadFindManyArgs>): CheckSelect<T, PrismaPromise<Array<thread>>, PrismaPromise<Array<threadGetPayload<T>>>>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * room findUnique
   */
  export type roomFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the room
    **/
    select?: roomSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: roomInclude | null
    /**
     * Throw an Error if a room can't be found
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which room to fetch.
    **/
    where: roomWhereUniqueInput
  }


  /**
   * room findFirst
   */
  export type roomFindFirstArgs = {
    /**
     * Select specific fields to fetch from the room
    **/
    select?: roomSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: roomInclude | null
    /**
     * Throw an Error if a room can't be found
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which room to fetch.
    **/
    where?: roomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of rooms to fetch.
    **/
    orderBy?: Enumerable<roomOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for rooms.
    **/
    cursor?: roomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` rooms from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` rooms.
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of rooms.
    **/
    distinct?: Enumerable<RoomScalarFieldEnum>
  }


  /**
   * room findMany
   */
  export type roomFindManyArgs = {
    /**
     * Select specific fields to fetch from the room
    **/
    select?: roomSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: roomInclude | null
    /**
     * Filter, which rooms to fetch.
    **/
    where?: roomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of rooms to fetch.
    **/
    orderBy?: Enumerable<roomOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing rooms.
    **/
    cursor?: roomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` rooms from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` rooms.
    **/
    skip?: number
    distinct?: Enumerable<RoomScalarFieldEnum>
  }


  /**
   * room create
   */
  export type roomCreateArgs = {
    /**
     * Select specific fields to fetch from the room
    **/
    select?: roomSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: roomInclude | null
    /**
     * The data needed to create a room.
    **/
    data: XOR<roomUncheckedCreateInput, roomCreateInput>
  }


  /**
   * room update
   */
  export type roomUpdateArgs = {
    /**
     * Select specific fields to fetch from the room
    **/
    select?: roomSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: roomInclude | null
    /**
     * The data needed to update a room.
    **/
    data: XOR<roomUncheckedUpdateInput, roomUpdateInput>
    /**
     * Choose, which room to update.
    **/
    where: roomWhereUniqueInput
  }


  /**
   * room updateMany
   */
  export type roomUpdateManyArgs = {
    data: XOR<roomUncheckedUpdateManyInput, roomUpdateManyMutationInput>
    where?: roomWhereInput
  }


  /**
   * room upsert
   */
  export type roomUpsertArgs = {
    /**
     * Select specific fields to fetch from the room
    **/
    select?: roomSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: roomInclude | null
    /**
     * The filter to search for the room to update in case it exists.
    **/
    where: roomWhereUniqueInput
    /**
     * In case the room found by the `where` argument doesn't exist, create a new room with this data.
    **/
    create: XOR<roomUncheckedCreateInput, roomCreateInput>
    /**
     * In case the room was found with the provided `where` argument, update it with this data.
    **/
    update: XOR<roomUncheckedUpdateInput, roomUpdateInput>
  }


  /**
   * room delete
   */
  export type roomDeleteArgs = {
    /**
     * Select specific fields to fetch from the room
    **/
    select?: roomSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: roomInclude | null
    /**
     * Filter which room to delete.
    **/
    where: roomWhereUniqueInput
  }


  /**
   * room deleteMany
   */
  export type roomDeleteManyArgs = {
    where?: roomWhereInput
  }


  /**
   * room without action
   */
  export type roomArgs = {
    /**
     * Select specific fields to fetch from the room
    **/
    select?: roomSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: roomInclude | null
  }



  /**
   * Model room_invites
   */


  export type AggregateRoom_invites = {
    count: Room_invitesCountAggregateOutputType | null
    min: Room_invitesMinAggregateOutputType | null
    max: Room_invitesMaxAggregateOutputType | null
  }

  export type Room_invitesMinAggregateOutputType = {
    id: string | null
    room_id: string | null
    inviter_id: string | null
    code: string | null
    email: string | null
    created_at: Date | null
    used_at: Date | null
  }

  export type Room_invitesMaxAggregateOutputType = {
    id: string | null
    room_id: string | null
    inviter_id: string | null
    code: string | null
    email: string | null
    created_at: Date | null
    used_at: Date | null
  }

  export type Room_invitesCountAggregateOutputType = {
    id: number | null
    room_id: number | null
    inviter_id: number | null
    code: number | null
    email: number | null
    created_at: number | null
    used_at: number | null
    _all: number
  }


  export type Room_invitesMinAggregateInputType = {
    id?: true
    room_id?: true
    inviter_id?: true
    code?: true
    email?: true
    created_at?: true
    used_at?: true
  }

  export type Room_invitesMaxAggregateInputType = {
    id?: true
    room_id?: true
    inviter_id?: true
    code?: true
    email?: true
    created_at?: true
    used_at?: true
  }

  export type Room_invitesCountAggregateInputType = {
    id?: true
    room_id?: true
    inviter_id?: true
    code?: true
    email?: true
    created_at?: true
    used_at?: true
    _all?: true
  }

  export type Room_invitesAggregateArgs = {
    /**
     * Filter which room_invites to aggregate.
    **/
    where?: room_invitesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of room_invites to fetch.
    **/
    orderBy?: Enumerable<room_invitesOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
    **/
    cursor?: room_invitesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` room_invites from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` room_invites.
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned room_invites
    **/
    count?: true | Room_invitesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    min?: Room_invitesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    max?: Room_invitesMaxAggregateInputType
  }

  export type GetRoom_invitesAggregateType<T extends Room_invitesAggregateArgs> = {
    [P in keyof T & keyof AggregateRoom_invites]: P extends 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRoom_invites[P]>
      : GetScalarType<T[P], AggregateRoom_invites[P]>
  }



  export type room_invitesSelect = {
    id?: boolean
    room_id?: boolean
    inviter_id?: boolean
    code?: boolean
    email?: boolean
    created_at?: boolean
    used_at?: boolean
    user?: boolean | userArgs
    room?: boolean | roomArgs
  }

  export type room_invitesInclude = {
    user?: boolean | userArgs
    room?: boolean | roomArgs
  }

  export type room_invitesGetPayload<
    S extends boolean | null | undefined | room_invitesArgs,
    U = keyof S
      > = S extends true
        ? room_invites
    : S extends undefined
    ? never
    : S extends room_invitesArgs | room_invitesFindManyArgs
    ?'include' extends U
    ? room_invites  & {
    [P in TrueKeys<S['include']>]: 
          P extends 'user'
        ? userGetPayload<S['include'][P]> :
        P extends 'room'
        ? roomGetPayload<S['include'][P]> : never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]: P extends keyof room_invites ?room_invites [P]
  : 
          P extends 'user'
        ? userGetPayload<S['select'][P]> :
        P extends 'room'
        ? roomGetPayload<S['select'][P]> : never
  } 
    : room_invites
  : room_invites


  type room_invitesCountArgs = Merge<
    Omit<room_invitesFindManyArgs, 'select' | 'include'> & {
      select?: Room_invitesCountAggregateInputType | true
    }
  >

  export interface room_invitesDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one Room_invites that matches the filter.
     * @param {room_invitesFindUniqueArgs} args - Arguments to find a Room_invites
     * @example
     * // Get one Room_invites
     * const room_invites = await prisma.room_invites.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends room_invitesFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, room_invitesFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'room_invites'> extends True ? CheckSelect<T, Prisma__room_invitesClient<room_invites>, Prisma__room_invitesClient<room_invitesGetPayload<T>>> : CheckSelect<T, Prisma__room_invitesClient<room_invites | null >, Prisma__room_invitesClient<room_invitesGetPayload<T> | null >>

    /**
     * Find the first Room_invites that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {room_invitesFindFirstArgs} args - Arguments to find a Room_invites
     * @example
     * // Get one Room_invites
     * const room_invites = await prisma.room_invites.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends room_invitesFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, room_invitesFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'room_invites'> extends True ? CheckSelect<T, Prisma__room_invitesClient<room_invites>, Prisma__room_invitesClient<room_invitesGetPayload<T>>> : CheckSelect<T, Prisma__room_invitesClient<room_invites | null >, Prisma__room_invitesClient<room_invitesGetPayload<T> | null >>

    /**
     * Find zero or more Room_invites that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {room_invitesFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Room_invites
     * const room_invites = await prisma.room_invites.findMany()
     * 
     * // Get first 10 Room_invites
     * const room_invites = await prisma.room_invites.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const room_invitesWithIdOnly = await prisma.room_invites.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends room_invitesFindManyArgs>(
      args?: SelectSubset<T, room_invitesFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<room_invites>>, PrismaPromise<Array<room_invitesGetPayload<T>>>>

    /**
     * Create a Room_invites.
     * @param {room_invitesCreateArgs} args - Arguments to create a Room_invites.
     * @example
     * // Create one Room_invites
     * const Room_invites = await prisma.room_invites.create({
     *   data: {
     *     // ... data to create a Room_invites
     *   }
     * })
     * 
    **/
    create<T extends room_invitesCreateArgs>(
      args: SelectSubset<T, room_invitesCreateArgs>
    ): CheckSelect<T, Prisma__room_invitesClient<room_invites>, Prisma__room_invitesClient<room_invitesGetPayload<T>>>

    /**
     * Delete a Room_invites.
     * @param {room_invitesDeleteArgs} args - Arguments to delete one Room_invites.
     * @example
     * // Delete one Room_invites
     * const Room_invites = await prisma.room_invites.delete({
     *   where: {
     *     // ... filter to delete one Room_invites
     *   }
     * })
     * 
    **/
    delete<T extends room_invitesDeleteArgs>(
      args: SelectSubset<T, room_invitesDeleteArgs>
    ): CheckSelect<T, Prisma__room_invitesClient<room_invites>, Prisma__room_invitesClient<room_invitesGetPayload<T>>>

    /**
     * Update one Room_invites.
     * @param {room_invitesUpdateArgs} args - Arguments to update one Room_invites.
     * @example
     * // Update one Room_invites
     * const room_invites = await prisma.room_invites.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends room_invitesUpdateArgs>(
      args: SelectSubset<T, room_invitesUpdateArgs>
    ): CheckSelect<T, Prisma__room_invitesClient<room_invites>, Prisma__room_invitesClient<room_invitesGetPayload<T>>>

    /**
     * Delete zero or more Room_invites.
     * @param {room_invitesDeleteManyArgs} args - Arguments to filter Room_invites to delete.
     * @example
     * // Delete a few Room_invites
     * const { count } = await prisma.room_invites.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends room_invitesDeleteManyArgs>(
      args?: SelectSubset<T, room_invitesDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more Room_invites.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {room_invitesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Room_invites
     * const room_invites = await prisma.room_invites.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends room_invitesUpdateManyArgs>(
      args: SelectSubset<T, room_invitesUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one Room_invites.
     * @param {room_invitesUpsertArgs} args - Arguments to update or create a Room_invites.
     * @example
     * // Update or create a Room_invites
     * const room_invites = await prisma.room_invites.upsert({
     *   create: {
     *     // ... data to create a Room_invites
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Room_invites we want to update
     *   }
     * })
    **/
    upsert<T extends room_invitesUpsertArgs>(
      args: SelectSubset<T, room_invitesUpsertArgs>
    ): CheckSelect<T, Prisma__room_invitesClient<room_invites>, Prisma__room_invitesClient<room_invitesGetPayload<T>>>

    /**
     * Count the number of Room_invites.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {room_invitesCountArgs} args - Arguments to filter Room_invites to count.
     * @example
     * // Count the number of Room_invites
     * const count = await prisma.room_invites.count({
     *   where: {
     *     // ... the filter for the Room_invites we want to count
     *   }
     * })
    **/
    count<T extends room_invitesCountArgs>(
      args?: Subset<T, room_invitesCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Room_invitesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Room_invites.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Room_invitesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Room_invitesAggregateArgs>(args: Subset<T, Room_invitesAggregateArgs>): PrismaPromise<GetRoom_invitesAggregateType<T>>


  }

  /**
   * The delegate class that acts as a "Promise-like" for room_invites.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in 
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__room_invitesClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    user<T extends userArgs = {}>(args?: Subset<T, userArgs>): CheckSelect<T, Prisma__userClient<user | null >, Prisma__userClient<userGetPayload<T> | null >>;

    room<T extends roomArgs = {}>(args?: Subset<T, roomArgs>): CheckSelect<T, Prisma__roomClient<room | null >, Prisma__roomClient<roomGetPayload<T> | null >>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * room_invites findUnique
   */
  export type room_invitesFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the room_invites
    **/
    select?: room_invitesSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: room_invitesInclude | null
    /**
     * Throw an Error if a room_invites can't be found
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which room_invites to fetch.
    **/
    where: room_invitesWhereUniqueInput
  }


  /**
   * room_invites findFirst
   */
  export type room_invitesFindFirstArgs = {
    /**
     * Select specific fields to fetch from the room_invites
    **/
    select?: room_invitesSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: room_invitesInclude | null
    /**
     * Throw an Error if a room_invites can't be found
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which room_invites to fetch.
    **/
    where?: room_invitesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of room_invites to fetch.
    **/
    orderBy?: Enumerable<room_invitesOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for room_invites.
    **/
    cursor?: room_invitesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` room_invites from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` room_invites.
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of room_invites.
    **/
    distinct?: Enumerable<Room_invitesScalarFieldEnum>
  }


  /**
   * room_invites findMany
   */
  export type room_invitesFindManyArgs = {
    /**
     * Select specific fields to fetch from the room_invites
    **/
    select?: room_invitesSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: room_invitesInclude | null
    /**
     * Filter, which room_invites to fetch.
    **/
    where?: room_invitesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of room_invites to fetch.
    **/
    orderBy?: Enumerable<room_invitesOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing room_invites.
    **/
    cursor?: room_invitesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` room_invites from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` room_invites.
    **/
    skip?: number
    distinct?: Enumerable<Room_invitesScalarFieldEnum>
  }


  /**
   * room_invites create
   */
  export type room_invitesCreateArgs = {
    /**
     * Select specific fields to fetch from the room_invites
    **/
    select?: room_invitesSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: room_invitesInclude | null
    /**
     * The data needed to create a room_invites.
    **/
    data: XOR<room_invitesUncheckedCreateInput, room_invitesCreateInput>
  }


  /**
   * room_invites update
   */
  export type room_invitesUpdateArgs = {
    /**
     * Select specific fields to fetch from the room_invites
    **/
    select?: room_invitesSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: room_invitesInclude | null
    /**
     * The data needed to update a room_invites.
    **/
    data: XOR<room_invitesUncheckedUpdateInput, room_invitesUpdateInput>
    /**
     * Choose, which room_invites to update.
    **/
    where: room_invitesWhereUniqueInput
  }


  /**
   * room_invites updateMany
   */
  export type room_invitesUpdateManyArgs = {
    data: XOR<room_invitesUncheckedUpdateManyInput, room_invitesUpdateManyMutationInput>
    where?: room_invitesWhereInput
  }


  /**
   * room_invites upsert
   */
  export type room_invitesUpsertArgs = {
    /**
     * Select specific fields to fetch from the room_invites
    **/
    select?: room_invitesSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: room_invitesInclude | null
    /**
     * The filter to search for the room_invites to update in case it exists.
    **/
    where: room_invitesWhereUniqueInput
    /**
     * In case the room_invites found by the `where` argument doesn't exist, create a new room_invites with this data.
    **/
    create: XOR<room_invitesUncheckedCreateInput, room_invitesCreateInput>
    /**
     * In case the room_invites was found with the provided `where` argument, update it with this data.
    **/
    update: XOR<room_invitesUncheckedUpdateInput, room_invitesUpdateInput>
  }


  /**
   * room_invites delete
   */
  export type room_invitesDeleteArgs = {
    /**
     * Select specific fields to fetch from the room_invites
    **/
    select?: room_invitesSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: room_invitesInclude | null
    /**
     * Filter which room_invites to delete.
    **/
    where: room_invitesWhereUniqueInput
  }


  /**
   * room_invites deleteMany
   */
  export type room_invitesDeleteManyArgs = {
    where?: room_invitesWhereInput
  }


  /**
   * room_invites without action
   */
  export type room_invitesArgs = {
    /**
     * Select specific fields to fetch from the room_invites
    **/
    select?: room_invitesSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: room_invitesInclude | null
  }



  /**
   * Model room_participants
   */


  export type AggregateRoom_participants = {
    count: Room_participantsCountAggregateOutputType | null
    min: Room_participantsMinAggregateOutputType | null
    max: Room_participantsMaxAggregateOutputType | null
  }

  export type Room_participantsMinAggregateOutputType = {
    room_id: string | null
    user_id: string | null
  }

  export type Room_participantsMaxAggregateOutputType = {
    room_id: string | null
    user_id: string | null
  }

  export type Room_participantsCountAggregateOutputType = {
    room_id: number | null
    user_id: number | null
    _all: number
  }


  export type Room_participantsMinAggregateInputType = {
    room_id?: true
    user_id?: true
  }

  export type Room_participantsMaxAggregateInputType = {
    room_id?: true
    user_id?: true
  }

  export type Room_participantsCountAggregateInputType = {
    room_id?: true
    user_id?: true
    _all?: true
  }

  export type Room_participantsAggregateArgs = {
    /**
     * Filter which room_participants to aggregate.
    **/
    where?: room_participantsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of room_participants to fetch.
    **/
    orderBy?: Enumerable<room_participantsOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
    **/
    cursor?: room_participantsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` room_participants from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` room_participants.
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned room_participants
    **/
    count?: true | Room_participantsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    min?: Room_participantsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    max?: Room_participantsMaxAggregateInputType
  }

  export type GetRoom_participantsAggregateType<T extends Room_participantsAggregateArgs> = {
    [P in keyof T & keyof AggregateRoom_participants]: P extends 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRoom_participants[P]>
      : GetScalarType<T[P], AggregateRoom_participants[P]>
  }



  export type room_participantsSelect = {
    room_id?: boolean
    user_id?: boolean
    room?: boolean | roomArgs
    user?: boolean | userArgs
  }

  export type room_participantsInclude = {
    room?: boolean | roomArgs
    user?: boolean | userArgs
  }

  export type room_participantsGetPayload<
    S extends boolean | null | undefined | room_participantsArgs,
    U = keyof S
      > = S extends true
        ? room_participants
    : S extends undefined
    ? never
    : S extends room_participantsArgs | room_participantsFindManyArgs
    ?'include' extends U
    ? room_participants  & {
    [P in TrueKeys<S['include']>]: 
          P extends 'room'
        ? roomGetPayload<S['include'][P]> :
        P extends 'user'
        ? userGetPayload<S['include'][P]> : never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]: P extends keyof room_participants ?room_participants [P]
  : 
          P extends 'room'
        ? roomGetPayload<S['select'][P]> :
        P extends 'user'
        ? userGetPayload<S['select'][P]> : never
  } 
    : room_participants
  : room_participants


  type room_participantsCountArgs = Merge<
    Omit<room_participantsFindManyArgs, 'select' | 'include'> & {
      select?: Room_participantsCountAggregateInputType | true
    }
  >

  export interface room_participantsDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one Room_participants that matches the filter.
     * @param {room_participantsFindUniqueArgs} args - Arguments to find a Room_participants
     * @example
     * // Get one Room_participants
     * const room_participants = await prisma.room_participants.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends room_participantsFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, room_participantsFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'room_participants'> extends True ? CheckSelect<T, Prisma__room_participantsClient<room_participants>, Prisma__room_participantsClient<room_participantsGetPayload<T>>> : CheckSelect<T, Prisma__room_participantsClient<room_participants | null >, Prisma__room_participantsClient<room_participantsGetPayload<T> | null >>

    /**
     * Find the first Room_participants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {room_participantsFindFirstArgs} args - Arguments to find a Room_participants
     * @example
     * // Get one Room_participants
     * const room_participants = await prisma.room_participants.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends room_participantsFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, room_participantsFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'room_participants'> extends True ? CheckSelect<T, Prisma__room_participantsClient<room_participants>, Prisma__room_participantsClient<room_participantsGetPayload<T>>> : CheckSelect<T, Prisma__room_participantsClient<room_participants | null >, Prisma__room_participantsClient<room_participantsGetPayload<T> | null >>

    /**
     * Find zero or more Room_participants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {room_participantsFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Room_participants
     * const room_participants = await prisma.room_participants.findMany()
     * 
     * // Get first 10 Room_participants
     * const room_participants = await prisma.room_participants.findMany({ take: 10 })
     * 
     * // Only select the `room_id`
     * const room_participantsWithRoom_idOnly = await prisma.room_participants.findMany({ select: { room_id: true } })
     * 
    **/
    findMany<T extends room_participantsFindManyArgs>(
      args?: SelectSubset<T, room_participantsFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<room_participants>>, PrismaPromise<Array<room_participantsGetPayload<T>>>>

    /**
     * Create a Room_participants.
     * @param {room_participantsCreateArgs} args - Arguments to create a Room_participants.
     * @example
     * // Create one Room_participants
     * const Room_participants = await prisma.room_participants.create({
     *   data: {
     *     // ... data to create a Room_participants
     *   }
     * })
     * 
    **/
    create<T extends room_participantsCreateArgs>(
      args: SelectSubset<T, room_participantsCreateArgs>
    ): CheckSelect<T, Prisma__room_participantsClient<room_participants>, Prisma__room_participantsClient<room_participantsGetPayload<T>>>

    /**
     * Delete a Room_participants.
     * @param {room_participantsDeleteArgs} args - Arguments to delete one Room_participants.
     * @example
     * // Delete one Room_participants
     * const Room_participants = await prisma.room_participants.delete({
     *   where: {
     *     // ... filter to delete one Room_participants
     *   }
     * })
     * 
    **/
    delete<T extends room_participantsDeleteArgs>(
      args: SelectSubset<T, room_participantsDeleteArgs>
    ): CheckSelect<T, Prisma__room_participantsClient<room_participants>, Prisma__room_participantsClient<room_participantsGetPayload<T>>>

    /**
     * Update one Room_participants.
     * @param {room_participantsUpdateArgs} args - Arguments to update one Room_participants.
     * @example
     * // Update one Room_participants
     * const room_participants = await prisma.room_participants.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends room_participantsUpdateArgs>(
      args: SelectSubset<T, room_participantsUpdateArgs>
    ): CheckSelect<T, Prisma__room_participantsClient<room_participants>, Prisma__room_participantsClient<room_participantsGetPayload<T>>>

    /**
     * Delete zero or more Room_participants.
     * @param {room_participantsDeleteManyArgs} args - Arguments to filter Room_participants to delete.
     * @example
     * // Delete a few Room_participants
     * const { count } = await prisma.room_participants.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends room_participantsDeleteManyArgs>(
      args?: SelectSubset<T, room_participantsDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more Room_participants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {room_participantsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Room_participants
     * const room_participants = await prisma.room_participants.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends room_participantsUpdateManyArgs>(
      args: SelectSubset<T, room_participantsUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one Room_participants.
     * @param {room_participantsUpsertArgs} args - Arguments to update or create a Room_participants.
     * @example
     * // Update or create a Room_participants
     * const room_participants = await prisma.room_participants.upsert({
     *   create: {
     *     // ... data to create a Room_participants
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Room_participants we want to update
     *   }
     * })
    **/
    upsert<T extends room_participantsUpsertArgs>(
      args: SelectSubset<T, room_participantsUpsertArgs>
    ): CheckSelect<T, Prisma__room_participantsClient<room_participants>, Prisma__room_participantsClient<room_participantsGetPayload<T>>>

    /**
     * Count the number of Room_participants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {room_participantsCountArgs} args - Arguments to filter Room_participants to count.
     * @example
     * // Count the number of Room_participants
     * const count = await prisma.room_participants.count({
     *   where: {
     *     // ... the filter for the Room_participants we want to count
     *   }
     * })
    **/
    count<T extends room_participantsCountArgs>(
      args?: Subset<T, room_participantsCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Room_participantsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Room_participants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Room_participantsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Room_participantsAggregateArgs>(args: Subset<T, Room_participantsAggregateArgs>): PrismaPromise<GetRoom_participantsAggregateType<T>>


  }

  /**
   * The delegate class that acts as a "Promise-like" for room_participants.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in 
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__room_participantsClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    room<T extends roomArgs = {}>(args?: Subset<T, roomArgs>): CheckSelect<T, Prisma__roomClient<room | null >, Prisma__roomClient<roomGetPayload<T> | null >>;

    user<T extends userArgs = {}>(args?: Subset<T, userArgs>): CheckSelect<T, Prisma__userClient<user | null >, Prisma__userClient<userGetPayload<T> | null >>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * room_participants findUnique
   */
  export type room_participantsFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the room_participants
    **/
    select?: room_participantsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: room_participantsInclude | null
    /**
     * Throw an Error if a room_participants can't be found
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which room_participants to fetch.
    **/
    where: room_participantsWhereUniqueInput
  }


  /**
   * room_participants findFirst
   */
  export type room_participantsFindFirstArgs = {
    /**
     * Select specific fields to fetch from the room_participants
    **/
    select?: room_participantsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: room_participantsInclude | null
    /**
     * Throw an Error if a room_participants can't be found
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which room_participants to fetch.
    **/
    where?: room_participantsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of room_participants to fetch.
    **/
    orderBy?: Enumerable<room_participantsOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for room_participants.
    **/
    cursor?: room_participantsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` room_participants from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` room_participants.
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of room_participants.
    **/
    distinct?: Enumerable<Room_participantsScalarFieldEnum>
  }


  /**
   * room_participants findMany
   */
  export type room_participantsFindManyArgs = {
    /**
     * Select specific fields to fetch from the room_participants
    **/
    select?: room_participantsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: room_participantsInclude | null
    /**
     * Filter, which room_participants to fetch.
    **/
    where?: room_participantsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of room_participants to fetch.
    **/
    orderBy?: Enumerable<room_participantsOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing room_participants.
    **/
    cursor?: room_participantsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` room_participants from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` room_participants.
    **/
    skip?: number
    distinct?: Enumerable<Room_participantsScalarFieldEnum>
  }


  /**
   * room_participants create
   */
  export type room_participantsCreateArgs = {
    /**
     * Select specific fields to fetch from the room_participants
    **/
    select?: room_participantsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: room_participantsInclude | null
    /**
     * The data needed to create a room_participants.
    **/
    data: XOR<room_participantsUncheckedCreateInput, room_participantsCreateInput>
  }


  /**
   * room_participants update
   */
  export type room_participantsUpdateArgs = {
    /**
     * Select specific fields to fetch from the room_participants
    **/
    select?: room_participantsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: room_participantsInclude | null
    /**
     * The data needed to update a room_participants.
    **/
    data: XOR<room_participantsUncheckedUpdateInput, room_participantsUpdateInput>
    /**
     * Choose, which room_participants to update.
    **/
    where: room_participantsWhereUniqueInput
  }


  /**
   * room_participants updateMany
   */
  export type room_participantsUpdateManyArgs = {
    data: XOR<room_participantsUncheckedUpdateManyInput, room_participantsUpdateManyMutationInput>
    where?: room_participantsWhereInput
  }


  /**
   * room_participants upsert
   */
  export type room_participantsUpsertArgs = {
    /**
     * Select specific fields to fetch from the room_participants
    **/
    select?: room_participantsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: room_participantsInclude | null
    /**
     * The filter to search for the room_participants to update in case it exists.
    **/
    where: room_participantsWhereUniqueInput
    /**
     * In case the room_participants found by the `where` argument doesn't exist, create a new room_participants with this data.
    **/
    create: XOR<room_participantsUncheckedCreateInput, room_participantsCreateInput>
    /**
     * In case the room_participants was found with the provided `where` argument, update it with this data.
    **/
    update: XOR<room_participantsUncheckedUpdateInput, room_participantsUpdateInput>
  }


  /**
   * room_participants delete
   */
  export type room_participantsDeleteArgs = {
    /**
     * Select specific fields to fetch from the room_participants
    **/
    select?: room_participantsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: room_participantsInclude | null
    /**
     * Filter which room_participants to delete.
    **/
    where: room_participantsWhereUniqueInput
  }


  /**
   * room_participants deleteMany
   */
  export type room_participantsDeleteManyArgs = {
    where?: room_participantsWhereInput
  }


  /**
   * room_participants without action
   */
  export type room_participantsArgs = {
    /**
     * Select specific fields to fetch from the room_participants
    **/
    select?: room_participantsSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: room_participantsInclude | null
  }



  /**
   * Model thread
   */


  export type AggregateThread = {
    count: ThreadCountAggregateOutputType | null
    min: ThreadMinAggregateOutputType | null
    max: ThreadMaxAggregateOutputType | null
  }

  export type ThreadMinAggregateOutputType = {
    id: string | null
    room_id: string | null
    name: string | null
    index: string | null
  }

  export type ThreadMaxAggregateOutputType = {
    id: string | null
    room_id: string | null
    name: string | null
    index: string | null
  }

  export type ThreadCountAggregateOutputType = {
    id: number | null
    room_id: number | null
    name: number | null
    index: number | null
    _all: number
  }


  export type ThreadMinAggregateInputType = {
    id?: true
    room_id?: true
    name?: true
    index?: true
  }

  export type ThreadMaxAggregateInputType = {
    id?: true
    room_id?: true
    name?: true
    index?: true
  }

  export type ThreadCountAggregateInputType = {
    id?: true
    room_id?: true
    name?: true
    index?: true
    _all?: true
  }

  export type ThreadAggregateArgs = {
    /**
     * Filter which thread to aggregate.
    **/
    where?: threadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of threads to fetch.
    **/
    orderBy?: Enumerable<threadOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
    **/
    cursor?: threadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` threads from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` threads.
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned threads
    **/
    count?: true | ThreadCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    min?: ThreadMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    max?: ThreadMaxAggregateInputType
  }

  export type GetThreadAggregateType<T extends ThreadAggregateArgs> = {
    [P in keyof T & keyof AggregateThread]: P extends 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateThread[P]>
      : GetScalarType<T[P], AggregateThread[P]>
  }



  export type threadSelect = {
    id?: boolean
    room_id?: boolean
    name?: boolean
    index?: boolean
    room?: boolean | roomArgs
    message?: boolean | messageFindManyArgs
  }

  export type threadInclude = {
    room?: boolean | roomArgs
    message?: boolean | messageFindManyArgs
  }

  export type threadGetPayload<
    S extends boolean | null | undefined | threadArgs,
    U = keyof S
      > = S extends true
        ? thread
    : S extends undefined
    ? never
    : S extends threadArgs | threadFindManyArgs
    ?'include' extends U
    ? thread  & {
    [P in TrueKeys<S['include']>]: 
          P extends 'room'
        ? roomGetPayload<S['include'][P]> :
        P extends 'message'
        ? Array < messageGetPayload<S['include'][P]>>  : never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]: P extends keyof thread ?thread [P]
  : 
          P extends 'room'
        ? roomGetPayload<S['select'][P]> :
        P extends 'message'
        ? Array < messageGetPayload<S['select'][P]>>  : never
  } 
    : thread
  : thread


  type threadCountArgs = Merge<
    Omit<threadFindManyArgs, 'select' | 'include'> & {
      select?: ThreadCountAggregateInputType | true
    }
  >

  export interface threadDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one Thread that matches the filter.
     * @param {threadFindUniqueArgs} args - Arguments to find a Thread
     * @example
     * // Get one Thread
     * const thread = await prisma.thread.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends threadFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, threadFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'thread'> extends True ? CheckSelect<T, Prisma__threadClient<thread>, Prisma__threadClient<threadGetPayload<T>>> : CheckSelect<T, Prisma__threadClient<thread | null >, Prisma__threadClient<threadGetPayload<T> | null >>

    /**
     * Find the first Thread that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {threadFindFirstArgs} args - Arguments to find a Thread
     * @example
     * // Get one Thread
     * const thread = await prisma.thread.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends threadFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, threadFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'thread'> extends True ? CheckSelect<T, Prisma__threadClient<thread>, Prisma__threadClient<threadGetPayload<T>>> : CheckSelect<T, Prisma__threadClient<thread | null >, Prisma__threadClient<threadGetPayload<T> | null >>

    /**
     * Find zero or more Threads that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {threadFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Threads
     * const threads = await prisma.thread.findMany()
     * 
     * // Get first 10 Threads
     * const threads = await prisma.thread.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const threadWithIdOnly = await prisma.thread.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends threadFindManyArgs>(
      args?: SelectSubset<T, threadFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<thread>>, PrismaPromise<Array<threadGetPayload<T>>>>

    /**
     * Create a Thread.
     * @param {threadCreateArgs} args - Arguments to create a Thread.
     * @example
     * // Create one Thread
     * const Thread = await prisma.thread.create({
     *   data: {
     *     // ... data to create a Thread
     *   }
     * })
     * 
    **/
    create<T extends threadCreateArgs>(
      args: SelectSubset<T, threadCreateArgs>
    ): CheckSelect<T, Prisma__threadClient<thread>, Prisma__threadClient<threadGetPayload<T>>>

    /**
     * Delete a Thread.
     * @param {threadDeleteArgs} args - Arguments to delete one Thread.
     * @example
     * // Delete one Thread
     * const Thread = await prisma.thread.delete({
     *   where: {
     *     // ... filter to delete one Thread
     *   }
     * })
     * 
    **/
    delete<T extends threadDeleteArgs>(
      args: SelectSubset<T, threadDeleteArgs>
    ): CheckSelect<T, Prisma__threadClient<thread>, Prisma__threadClient<threadGetPayload<T>>>

    /**
     * Update one Thread.
     * @param {threadUpdateArgs} args - Arguments to update one Thread.
     * @example
     * // Update one Thread
     * const thread = await prisma.thread.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends threadUpdateArgs>(
      args: SelectSubset<T, threadUpdateArgs>
    ): CheckSelect<T, Prisma__threadClient<thread>, Prisma__threadClient<threadGetPayload<T>>>

    /**
     * Delete zero or more Threads.
     * @param {threadDeleteManyArgs} args - Arguments to filter Threads to delete.
     * @example
     * // Delete a few Threads
     * const { count } = await prisma.thread.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends threadDeleteManyArgs>(
      args?: SelectSubset<T, threadDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more Threads.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {threadUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Threads
     * const thread = await prisma.thread.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends threadUpdateManyArgs>(
      args: SelectSubset<T, threadUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one Thread.
     * @param {threadUpsertArgs} args - Arguments to update or create a Thread.
     * @example
     * // Update or create a Thread
     * const thread = await prisma.thread.upsert({
     *   create: {
     *     // ... data to create a Thread
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Thread we want to update
     *   }
     * })
    **/
    upsert<T extends threadUpsertArgs>(
      args: SelectSubset<T, threadUpsertArgs>
    ): CheckSelect<T, Prisma__threadClient<thread>, Prisma__threadClient<threadGetPayload<T>>>

    /**
     * Count the number of Threads.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {threadCountArgs} args - Arguments to filter Threads to count.
     * @example
     * // Count the number of Threads
     * const count = await prisma.thread.count({
     *   where: {
     *     // ... the filter for the Threads we want to count
     *   }
     * })
    **/
    count<T extends threadCountArgs>(
      args?: Subset<T, threadCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ThreadCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Thread.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThreadAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ThreadAggregateArgs>(args: Subset<T, ThreadAggregateArgs>): PrismaPromise<GetThreadAggregateType<T>>


  }

  /**
   * The delegate class that acts as a "Promise-like" for thread.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in 
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__threadClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    room<T extends roomArgs = {}>(args?: Subset<T, roomArgs>): CheckSelect<T, Prisma__roomClient<room | null >, Prisma__roomClient<roomGetPayload<T> | null >>;

    message<T extends messageFindManyArgs = {}>(args?: Subset<T, messageFindManyArgs>): CheckSelect<T, PrismaPromise<Array<message>>, PrismaPromise<Array<messageGetPayload<T>>>>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * thread findUnique
   */
  export type threadFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the thread
    **/
    select?: threadSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: threadInclude | null
    /**
     * Throw an Error if a thread can't be found
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which thread to fetch.
    **/
    where: threadWhereUniqueInput
  }


  /**
   * thread findFirst
   */
  export type threadFindFirstArgs = {
    /**
     * Select specific fields to fetch from the thread
    **/
    select?: threadSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: threadInclude | null
    /**
     * Throw an Error if a thread can't be found
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which thread to fetch.
    **/
    where?: threadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of threads to fetch.
    **/
    orderBy?: Enumerable<threadOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for threads.
    **/
    cursor?: threadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` threads from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` threads.
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of threads.
    **/
    distinct?: Enumerable<ThreadScalarFieldEnum>
  }


  /**
   * thread findMany
   */
  export type threadFindManyArgs = {
    /**
     * Select specific fields to fetch from the thread
    **/
    select?: threadSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: threadInclude | null
    /**
     * Filter, which threads to fetch.
    **/
    where?: threadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of threads to fetch.
    **/
    orderBy?: Enumerable<threadOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing threads.
    **/
    cursor?: threadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` threads from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` threads.
    **/
    skip?: number
    distinct?: Enumerable<ThreadScalarFieldEnum>
  }


  /**
   * thread create
   */
  export type threadCreateArgs = {
    /**
     * Select specific fields to fetch from the thread
    **/
    select?: threadSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: threadInclude | null
    /**
     * The data needed to create a thread.
    **/
    data: XOR<threadUncheckedCreateInput, threadCreateInput>
  }


  /**
   * thread update
   */
  export type threadUpdateArgs = {
    /**
     * Select specific fields to fetch from the thread
    **/
    select?: threadSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: threadInclude | null
    /**
     * The data needed to update a thread.
    **/
    data: XOR<threadUncheckedUpdateInput, threadUpdateInput>
    /**
     * Choose, which thread to update.
    **/
    where: threadWhereUniqueInput
  }


  /**
   * thread updateMany
   */
  export type threadUpdateManyArgs = {
    data: XOR<threadUncheckedUpdateManyInput, threadUpdateManyMutationInput>
    where?: threadWhereInput
  }


  /**
   * thread upsert
   */
  export type threadUpsertArgs = {
    /**
     * Select specific fields to fetch from the thread
    **/
    select?: threadSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: threadInclude | null
    /**
     * The filter to search for the thread to update in case it exists.
    **/
    where: threadWhereUniqueInput
    /**
     * In case the thread found by the `where` argument doesn't exist, create a new thread with this data.
    **/
    create: XOR<threadUncheckedCreateInput, threadCreateInput>
    /**
     * In case the thread was found with the provided `where` argument, update it with this data.
    **/
    update: XOR<threadUncheckedUpdateInput, threadUpdateInput>
  }


  /**
   * thread delete
   */
  export type threadDeleteArgs = {
    /**
     * Select specific fields to fetch from the thread
    **/
    select?: threadSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: threadInclude | null
    /**
     * Filter which thread to delete.
    **/
    where: threadWhereUniqueInput
  }


  /**
   * thread deleteMany
   */
  export type threadDeleteManyArgs = {
    where?: threadWhereInput
  }


  /**
   * thread without action
   */
  export type threadArgs = {
    /**
     * Select specific fields to fetch from the thread
    **/
    select?: threadSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: threadInclude | null
  }



  /**
   * Model user
   */


  export type AggregateUser = {
    count: UserCountAggregateOutputType | null
    min: UserMinAggregateOutputType | null
    max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    firebase_id: string | null
    name: string | null
    avatar_url: string | null
    created_at: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    firebase_id: string | null
    name: string | null
    avatar_url: string | null
    created_at: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number | null
    email: number | null
    firebase_id: number | null
    name: number | null
    avatar_url: number | null
    created_at: number | null
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    firebase_id?: true
    name?: true
    avatar_url?: true
    created_at?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    firebase_id?: true
    name?: true
    avatar_url?: true
    created_at?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    firebase_id?: true
    name?: true
    avatar_url?: true
    created_at?: true
    _all?: true
  }

  export type UserAggregateArgs = {
    /**
     * Filter which user to aggregate.
    **/
    where?: userWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
    **/
    orderBy?: Enumerable<userOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
    **/
    cursor?: userWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned users
    **/
    count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
    [P in keyof T & keyof AggregateUser]: P extends 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }



  export type userSelect = {
    id?: boolean
    email?: boolean
    firebase_id?: boolean
    name?: boolean
    avatar_url?: boolean
    created_at?: boolean
    account?: boolean | accountFindManyArgs
    message?: boolean | messageFindManyArgs
    room?: boolean | roomFindManyArgs
    room_invites?: boolean | room_invitesFindManyArgs
    room_participants?: boolean | room_participantsFindManyArgs
  }

  export type userInclude = {
    account?: boolean | accountFindManyArgs
    message?: boolean | messageFindManyArgs
    room?: boolean | roomFindManyArgs
    room_invites?: boolean | room_invitesFindManyArgs
    room_participants?: boolean | room_participantsFindManyArgs
  }

  export type userGetPayload<
    S extends boolean | null | undefined | userArgs,
    U = keyof S
      > = S extends true
        ? user
    : S extends undefined
    ? never
    : S extends userArgs | userFindManyArgs
    ?'include' extends U
    ? user  & {
    [P in TrueKeys<S['include']>]: 
          P extends 'account'
        ? Array < accountGetPayload<S['include'][P]>>  :
        P extends 'message'
        ? Array < messageGetPayload<S['include'][P]>>  :
        P extends 'room'
        ? Array < roomGetPayload<S['include'][P]>>  :
        P extends 'room_invites'
        ? Array < room_invitesGetPayload<S['include'][P]>>  :
        P extends 'room_participants'
        ? Array < room_participantsGetPayload<S['include'][P]>>  : never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]: P extends keyof user ?user [P]
  : 
          P extends 'account'
        ? Array < accountGetPayload<S['select'][P]>>  :
        P extends 'message'
        ? Array < messageGetPayload<S['select'][P]>>  :
        P extends 'room'
        ? Array < roomGetPayload<S['select'][P]>>  :
        P extends 'room_invites'
        ? Array < room_invitesGetPayload<S['select'][P]>>  :
        P extends 'room_participants'
        ? Array < room_participantsGetPayload<S['select'][P]>>  : never
  } 
    : user
  : user


  type userCountArgs = Merge<
    Omit<userFindManyArgs, 'select' | 'include'> & {
      select?: UserCountAggregateInputType | true
    }
  >

  export interface userDelegate<GlobalRejectSettings> {
    /**
     * Find zero or one User that matches the filter.
     * @param {userFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends userFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, userFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'user'> extends True ? CheckSelect<T, Prisma__userClient<user>, Prisma__userClient<userGetPayload<T>>> : CheckSelect<T, Prisma__userClient<user | null >, Prisma__userClient<userGetPayload<T> | null >>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends userFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, userFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'user'> extends True ? CheckSelect<T, Prisma__userClient<user>, Prisma__userClient<userGetPayload<T>>> : CheckSelect<T, Prisma__userClient<user | null >, Prisma__userClient<userGetPayload<T> | null >>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends userFindManyArgs>(
      args?: SelectSubset<T, userFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<user>>, PrismaPromise<Array<userGetPayload<T>>>>

    /**
     * Create a User.
     * @param {userCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
    **/
    create<T extends userCreateArgs>(
      args: SelectSubset<T, userCreateArgs>
    ): CheckSelect<T, Prisma__userClient<user>, Prisma__userClient<userGetPayload<T>>>

    /**
     * Delete a User.
     * @param {userDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
    **/
    delete<T extends userDeleteArgs>(
      args: SelectSubset<T, userDeleteArgs>
    ): CheckSelect<T, Prisma__userClient<user>, Prisma__userClient<userGetPayload<T>>>

    /**
     * Update one User.
     * @param {userUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends userUpdateArgs>(
      args: SelectSubset<T, userUpdateArgs>
    ): CheckSelect<T, Prisma__userClient<user>, Prisma__userClient<userGetPayload<T>>>

    /**
     * Delete zero or more Users.
     * @param {userDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends userDeleteManyArgs>(
      args?: SelectSubset<T, userDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends userUpdateManyArgs>(
      args: SelectSubset<T, userUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {userUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
    **/
    upsert<T extends userUpsertArgs>(
      args: SelectSubset<T, userUpsertArgs>
    ): CheckSelect<T, Prisma__userClient<user>, Prisma__userClient<userGetPayload<T>>>

    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {userCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends userCountArgs>(
      args?: Subset<T, userCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): PrismaPromise<GetUserAggregateType<T>>


  }

  /**
   * The delegate class that acts as a "Promise-like" for user.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in 
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__userClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    account<T extends accountFindManyArgs = {}>(args?: Subset<T, accountFindManyArgs>): CheckSelect<T, PrismaPromise<Array<account>>, PrismaPromise<Array<accountGetPayload<T>>>>;

    message<T extends messageFindManyArgs = {}>(args?: Subset<T, messageFindManyArgs>): CheckSelect<T, PrismaPromise<Array<message>>, PrismaPromise<Array<messageGetPayload<T>>>>;

    room<T extends roomFindManyArgs = {}>(args?: Subset<T, roomFindManyArgs>): CheckSelect<T, PrismaPromise<Array<room>>, PrismaPromise<Array<roomGetPayload<T>>>>;

    room_invites<T extends room_invitesFindManyArgs = {}>(args?: Subset<T, room_invitesFindManyArgs>): CheckSelect<T, PrismaPromise<Array<room_invites>>, PrismaPromise<Array<room_invitesGetPayload<T>>>>;

    room_participants<T extends room_participantsFindManyArgs = {}>(args?: Subset<T, room_participantsFindManyArgs>): CheckSelect<T, PrismaPromise<Array<room_participants>>, PrismaPromise<Array<room_participantsGetPayload<T>>>>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  // Custom InputTypes

  /**
   * user findUnique
   */
  export type userFindUniqueArgs = {
    /**
     * Select specific fields to fetch from the user
    **/
    select?: userSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: userInclude | null
    /**
     * Throw an Error if a user can't be found
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which user to fetch.
    **/
    where: userWhereUniqueInput
  }


  /**
   * user findFirst
   */
  export type userFindFirstArgs = {
    /**
     * Select specific fields to fetch from the user
    **/
    select?: userSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: userInclude | null
    /**
     * Throw an Error if a user can't be found
    **/
    rejectOnNotFound?: RejectOnNotFound
    /**
     * Filter, which user to fetch.
    **/
    where?: userWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
    **/
    orderBy?: Enumerable<userOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for users.
    **/
    cursor?: userWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of users.
    **/
    distinct?: Enumerable<UserScalarFieldEnum>
  }


  /**
   * user findMany
   */
  export type userFindManyArgs = {
    /**
     * Select specific fields to fetch from the user
    **/
    select?: userSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: userInclude | null
    /**
     * Filter, which users to fetch.
    **/
    where?: userWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of users to fetch.
    **/
    orderBy?: Enumerable<userOrderByInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing users.
    **/
    cursor?: userWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` users from the position of the cursor.
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` users.
    **/
    skip?: number
    distinct?: Enumerable<UserScalarFieldEnum>
  }


  /**
   * user create
   */
  export type userCreateArgs = {
    /**
     * Select specific fields to fetch from the user
    **/
    select?: userSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: userInclude | null
    /**
     * The data needed to create a user.
    **/
    data: XOR<userUncheckedCreateInput, userCreateInput>
  }


  /**
   * user update
   */
  export type userUpdateArgs = {
    /**
     * Select specific fields to fetch from the user
    **/
    select?: userSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: userInclude | null
    /**
     * The data needed to update a user.
    **/
    data: XOR<userUncheckedUpdateInput, userUpdateInput>
    /**
     * Choose, which user to update.
    **/
    where: userWhereUniqueInput
  }


  /**
   * user updateMany
   */
  export type userUpdateManyArgs = {
    data: XOR<userUncheckedUpdateManyInput, userUpdateManyMutationInput>
    where?: userWhereInput
  }


  /**
   * user upsert
   */
  export type userUpsertArgs = {
    /**
     * Select specific fields to fetch from the user
    **/
    select?: userSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: userInclude | null
    /**
     * The filter to search for the user to update in case it exists.
    **/
    where: userWhereUniqueInput
    /**
     * In case the user found by the `where` argument doesn't exist, create a new user with this data.
    **/
    create: XOR<userUncheckedCreateInput, userCreateInput>
    /**
     * In case the user was found with the provided `where` argument, update it with this data.
    **/
    update: XOR<userUncheckedUpdateInput, userUpdateInput>
  }


  /**
   * user delete
   */
  export type userDeleteArgs = {
    /**
     * Select specific fields to fetch from the user
    **/
    select?: userSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: userInclude | null
    /**
     * Filter which user to delete.
    **/
    where: userWhereUniqueInput
  }


  /**
   * user deleteMany
   */
  export type userDeleteManyArgs = {
    where?: userWhereInput
  }


  /**
   * user without action
   */
  export type userArgs = {
    /**
     * Select specific fields to fetch from the user
    **/
    select?: userSelect | null
    /**
     * Choose, which related nodes to fetch as well.
    **/
    include?: userInclude | null
  }



  /**
   * Enums
   */

  // Based on
  // https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275

  export const AccountScalarFieldEnum: {
    id: 'id',
    created_at: 'created_at',
    user_id: 'user_id',
    provider_id: 'provider_id',
    provider_type: 'provider_type',
    provider_account_id: 'provider_account_id',
    refresh_token: 'refresh_token',
    access_token: 'access_token',
    access_token_expires: 'access_token_expires',
    updated_at: 'updated_at'
  };

  export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum]


  export const MessageScalarFieldEnum: {
    thread_id: 'thread_id',
    user_id: 'user_id',
    created_at: 'created_at',
    type: 'type',
    media_url: 'media_url',
    text: 'text',
    transcription: 'transcription',
    id: 'id'
  };

  export type MessageScalarFieldEnum = (typeof MessageScalarFieldEnum)[keyof typeof MessageScalarFieldEnum]


  export const Message_typeScalarFieldEnum: {
    value: 'value'
  };

  export type Message_typeScalarFieldEnum = (typeof Message_typeScalarFieldEnum)[keyof typeof Message_typeScalarFieldEnum]


  export const RoomScalarFieldEnum: {
    id: 'id',
    creator_id: 'creator_id',
    name: 'name',
    created_at: 'created_at',
    deadline: 'deadline',
    notification_job_id: 'notification_job_id',
    summary: 'summary',
    finished_at: 'finished_at'
  };

  export type RoomScalarFieldEnum = (typeof RoomScalarFieldEnum)[keyof typeof RoomScalarFieldEnum]


  export const Room_invitesScalarFieldEnum: {
    id: 'id',
    room_id: 'room_id',
    inviter_id: 'inviter_id',
    code: 'code',
    email: 'email',
    created_at: 'created_at',
    used_at: 'used_at'
  };

  export type Room_invitesScalarFieldEnum = (typeof Room_invitesScalarFieldEnum)[keyof typeof Room_invitesScalarFieldEnum]


  export const Room_participantsScalarFieldEnum: {
    room_id: 'room_id',
    user_id: 'user_id'
  };

  export type Room_participantsScalarFieldEnum = (typeof Room_participantsScalarFieldEnum)[keyof typeof Room_participantsScalarFieldEnum]


  export const ThreadScalarFieldEnum: {
    id: 'id',
    room_id: 'room_id',
    name: 'name',
    index: 'index'
  };

  export type ThreadScalarFieldEnum = (typeof ThreadScalarFieldEnum)[keyof typeof ThreadScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    firebase_id: 'firebase_id',
    name: 'name',
    avatar_url: 'avatar_url',
    created_at: 'created_at'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  /**
   * Deep Input Types
   */


  export type accountWhereInput = {
    AND?: Enumerable<accountWhereInput>
    OR?: Enumerable<accountWhereInput>
    NOT?: Enumerable<accountWhereInput>
    id?: StringFilter | string
    created_at?: DateTimeFilter | Date | string
    user_id?: StringFilter | string
    provider_id?: StringFilter | string
    provider_type?: StringFilter | string
    provider_account_id?: StringFilter | string
    refresh_token?: StringNullableFilter | string | null
    access_token?: StringNullableFilter | string | null
    access_token_expires?: DateTimeNullableFilter | Date | string | null
    updated_at?: DateTimeFilter | Date | string
    user?: XOR<userWhereInput, UserRelationFilter>
  }

  export type accountOrderByInput = {
    id?: SortOrder
    created_at?: SortOrder
    user_id?: SortOrder
    provider_id?: SortOrder
    provider_type?: SortOrder
    provider_account_id?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    access_token_expires?: SortOrder
    updated_at?: SortOrder
    user?: userOrderByInput
  }

  export type accountWhereUniqueInput = {
    id?: string
  }

  export type messageWhereInput = {
    AND?: Enumerable<messageWhereInput>
    OR?: Enumerable<messageWhereInput>
    NOT?: Enumerable<messageWhereInput>
    thread_id?: StringFilter | string
    user_id?: StringFilter | string
    created_at?: DateTimeFilter | Date | string
    type?: StringFilter | string
    media_url?: StringNullableFilter | string | null
    text?: StringNullableFilter | string | null
    transcription?: StringNullableFilter | string | null
    id?: StringFilter | string
    thread?: XOR<threadWhereInput, ThreadRelationFilter>
    message_type?: XOR<message_typeWhereInput, Message_typeRelationFilter>
    user?: XOR<userWhereInput, UserRelationFilter>
  }

  export type messageOrderByInput = {
    thread_id?: SortOrder
    user_id?: SortOrder
    created_at?: SortOrder
    type?: SortOrder
    media_url?: SortOrder
    text?: SortOrder
    transcription?: SortOrder
    id?: SortOrder
    thread?: threadOrderByInput
    message_type?: message_typeOrderByInput
    user?: userOrderByInput
  }

  export type messageWhereUniqueInput = {
    id?: string
  }

  export type message_typeWhereInput = {
    AND?: Enumerable<message_typeWhereInput>
    OR?: Enumerable<message_typeWhereInput>
    NOT?: Enumerable<message_typeWhereInput>
    value?: StringFilter | string
    message?: MessageListRelationFilter
  }

  export type message_typeOrderByInput = {
    value?: SortOrder
  }

  export type message_typeWhereUniqueInput = {
    value?: string
  }

  export type roomWhereInput = {
    AND?: Enumerable<roomWhereInput>
    OR?: Enumerable<roomWhereInput>
    NOT?: Enumerable<roomWhereInput>
    id?: StringFilter | string
    creator_id?: StringFilter | string
    name?: StringNullableFilter | string | null
    created_at?: DateTimeFilter | Date | string
    deadline?: DateTimeFilter | Date | string
    notification_job_id?: StringNullableFilter | string | null
    summary?: StringNullableFilter | string | null
    finished_at?: DateTimeNullableFilter | Date | string | null
    user?: XOR<userWhereInput, UserRelationFilter>
    room_invites?: Room_invitesListRelationFilter
    room_participants?: Room_participantsListRelationFilter
    thread?: ThreadListRelationFilter
  }

  export type roomOrderByInput = {
    id?: SortOrder
    creator_id?: SortOrder
    name?: SortOrder
    created_at?: SortOrder
    deadline?: SortOrder
    notification_job_id?: SortOrder
    summary?: SortOrder
    finished_at?: SortOrder
    user?: userOrderByInput
  }

  export type roomWhereUniqueInput = {
    id?: string
  }

  export type room_invitesWhereInput = {
    AND?: Enumerable<room_invitesWhereInput>
    OR?: Enumerable<room_invitesWhereInput>
    NOT?: Enumerable<room_invitesWhereInput>
    id?: StringFilter | string
    room_id?: StringFilter | string
    inviter_id?: StringFilter | string
    code?: StringFilter | string
    email?: StringFilter | string
    created_at?: DateTimeFilter | Date | string
    used_at?: DateTimeNullableFilter | Date | string | null
    user?: XOR<userWhereInput, UserRelationFilter>
    room?: XOR<roomWhereInput, RoomRelationFilter>
  }

  export type room_invitesOrderByInput = {
    id?: SortOrder
    room_id?: SortOrder
    inviter_id?: SortOrder
    code?: SortOrder
    email?: SortOrder
    created_at?: SortOrder
    used_at?: SortOrder
    user?: userOrderByInput
    room?: roomOrderByInput
  }

  export type room_invitesWhereUniqueInput = {
    id?: string
    code?: string
    room_invites_room_id_email_key?: room_invitesRoom_invites_room_id_email_keyCompoundUniqueInput
  }

  export type room_participantsWhereInput = {
    AND?: Enumerable<room_participantsWhereInput>
    OR?: Enumerable<room_participantsWhereInput>
    NOT?: Enumerable<room_participantsWhereInput>
    room_id?: StringFilter | string
    user_id?: StringFilter | string
    room?: XOR<roomWhereInput, RoomRelationFilter>
    user?: XOR<userWhereInput, UserRelationFilter>
  }

  export type room_participantsOrderByInput = {
    room_id?: SortOrder
    user_id?: SortOrder
    room?: roomOrderByInput
    user?: userOrderByInput
  }

  export type room_participantsWhereUniqueInput = {
    room_participants_room_id_user_id_key?: room_participantsRoom_participants_room_id_user_id_keyCompoundUniqueInput
    room_id_user_id?: room_participantsRoom_idUser_idCompoundUniqueInput
  }

  export type threadWhereInput = {
    AND?: Enumerable<threadWhereInput>
    OR?: Enumerable<threadWhereInput>
    NOT?: Enumerable<threadWhereInput>
    id?: StringFilter | string
    room_id?: StringFilter | string
    name?: StringNullableFilter | string | null
    index?: StringFilter | string
    room?: XOR<roomWhereInput, RoomRelationFilter>
    message?: MessageListRelationFilter
  }

  export type threadOrderByInput = {
    id?: SortOrder
    room_id?: SortOrder
    name?: SortOrder
    index?: SortOrder
    room?: roomOrderByInput
  }

  export type threadWhereUniqueInput = {
    id?: string
  }

  export type userWhereInput = {
    AND?: Enumerable<userWhereInput>
    OR?: Enumerable<userWhereInput>
    NOT?: Enumerable<userWhereInput>
    id?: StringFilter | string
    email?: StringNullableFilter | string | null
    firebase_id?: StringNullableFilter | string | null
    name?: StringNullableFilter | string | null
    avatar_url?: StringNullableFilter | string | null
    created_at?: DateTimeFilter | Date | string
    account?: AccountListRelationFilter
    message?: MessageListRelationFilter
    room?: RoomListRelationFilter
    room_invites?: Room_invitesListRelationFilter
    room_participants?: Room_participantsListRelationFilter
  }

  export type userOrderByInput = {
    id?: SortOrder
    email?: SortOrder
    firebase_id?: SortOrder
    name?: SortOrder
    avatar_url?: SortOrder
    created_at?: SortOrder
  }

  export type userWhereUniqueInput = {
    id?: string
    email?: string
    firebase_id?: string
  }

  export type accountCreateInput = {
    id?: string
    created_at?: Date | string
    provider_id: string
    provider_type: string
    provider_account_id: string
    refresh_token?: string | null
    access_token?: string | null
    access_token_expires?: Date | string | null
    updated_at?: Date | string
    user: userCreateNestedOneWithoutAccountInput
  }

  export type accountUncheckedCreateInput = {
    id?: string
    created_at?: Date | string
    user_id: string
    provider_id: string
    provider_type: string
    provider_account_id: string
    refresh_token?: string | null
    access_token?: string | null
    access_token_expires?: Date | string | null
    updated_at?: Date | string
  }

  export type accountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    provider_id?: StringFieldUpdateOperationsInput | string
    provider_type?: StringFieldUpdateOperationsInput | string
    provider_account_id?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token_expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: userUpdateOneRequiredWithoutAccountInput
  }

  export type accountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: StringFieldUpdateOperationsInput | string
    provider_id?: StringFieldUpdateOperationsInput | string
    provider_type?: StringFieldUpdateOperationsInput | string
    provider_account_id?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token_expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type accountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    provider_id?: StringFieldUpdateOperationsInput | string
    provider_type?: StringFieldUpdateOperationsInput | string
    provider_account_id?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token_expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type accountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_id?: StringFieldUpdateOperationsInput | string
    provider_id?: StringFieldUpdateOperationsInput | string
    provider_type?: StringFieldUpdateOperationsInput | string
    provider_account_id?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token_expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type messageCreateInput = {
    created_at?: Date | string
    media_url?: string | null
    text?: string | null
    transcription?: string | null
    id?: string
    thread: threadCreateNestedOneWithoutMessageInput
    message_type: message_typeCreateNestedOneWithoutMessageInput
    user: userCreateNestedOneWithoutMessageInput
  }

  export type messageUncheckedCreateInput = {
    thread_id: string
    user_id: string
    created_at?: Date | string
    type: string
    media_url?: string | null
    text?: string | null
    transcription?: string | null
    id?: string
  }

  export type messageUpdateInput = {
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    media_url?: NullableStringFieldUpdateOperationsInput | string | null
    text?: NullableStringFieldUpdateOperationsInput | string | null
    transcription?: NullableStringFieldUpdateOperationsInput | string | null
    id?: StringFieldUpdateOperationsInput | string
    thread?: threadUpdateOneRequiredWithoutMessageInput
    message_type?: message_typeUpdateOneRequiredWithoutMessageInput
    user?: userUpdateOneRequiredWithoutMessageInput
  }

  export type messageUncheckedUpdateInput = {
    thread_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    media_url?: NullableStringFieldUpdateOperationsInput | string | null
    text?: NullableStringFieldUpdateOperationsInput | string | null
    transcription?: NullableStringFieldUpdateOperationsInput | string | null
    id?: StringFieldUpdateOperationsInput | string
  }

  export type messageUpdateManyMutationInput = {
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    media_url?: NullableStringFieldUpdateOperationsInput | string | null
    text?: NullableStringFieldUpdateOperationsInput | string | null
    transcription?: NullableStringFieldUpdateOperationsInput | string | null
    id?: StringFieldUpdateOperationsInput | string
  }

  export type messageUncheckedUpdateManyInput = {
    thread_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    media_url?: NullableStringFieldUpdateOperationsInput | string | null
    text?: NullableStringFieldUpdateOperationsInput | string | null
    transcription?: NullableStringFieldUpdateOperationsInput | string | null
    id?: StringFieldUpdateOperationsInput | string
  }

  export type message_typeCreateInput = {
    value: string
    message?: messageCreateNestedManyWithoutMessage_typeInput
  }

  export type message_typeUncheckedCreateInput = {
    value: string
    message?: messageUncheckedCreateNestedManyWithoutMessage_typeInput
  }

  export type message_typeUpdateInput = {
    value?: StringFieldUpdateOperationsInput | string
    message?: messageUpdateManyWithoutMessage_typeInput
  }

  export type message_typeUncheckedUpdateInput = {
    value?: StringFieldUpdateOperationsInput | string
    message?: messageUncheckedUpdateManyWithoutMessage_typeInput
  }

  export type message_typeUpdateManyMutationInput = {
    value?: StringFieldUpdateOperationsInput | string
  }

  export type message_typeUncheckedUpdateManyInput = {
    value?: StringFieldUpdateOperationsInput | string
  }

  export type roomCreateInput = {
    id?: string
    name?: string | null
    created_at?: Date | string
    deadline?: Date | string
    notification_job_id?: string | null
    summary?: string | null
    finished_at?: Date | string | null
    user: userCreateNestedOneWithoutRoomInput
    room_invites?: room_invitesCreateNestedManyWithoutRoomInput
    room_participants?: room_participantsCreateNestedManyWithoutRoomInput
    thread?: threadCreateNestedManyWithoutRoomInput
  }

  export type roomUncheckedCreateInput = {
    id?: string
    creator_id: string
    name?: string | null
    created_at?: Date | string
    deadline?: Date | string
    notification_job_id?: string | null
    summary?: string | null
    finished_at?: Date | string | null
    room_invites?: room_invitesUncheckedCreateNestedManyWithoutRoomInput
    room_participants?: room_participantsUncheckedCreateNestedManyWithoutRoomInput
    thread?: threadUncheckedCreateNestedManyWithoutRoomInput
  }

  export type roomUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    notification_job_id?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    finished_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: userUpdateOneRequiredWithoutRoomInput
    room_invites?: room_invitesUpdateManyWithoutRoomInput
    room_participants?: room_participantsUpdateManyWithoutRoomInput
    thread?: threadUpdateManyWithoutRoomInput
  }

  export type roomUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    creator_id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    notification_job_id?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    finished_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    room_invites?: room_invitesUncheckedUpdateManyWithoutRoomInput
    room_participants?: room_participantsUncheckedUpdateManyWithoutRoomInput
    thread?: threadUncheckedUpdateManyWithoutRoomInput
  }

  export type roomUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    notification_job_id?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    finished_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type roomUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    creator_id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    notification_job_id?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    finished_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type room_invitesCreateInput = {
    id?: string
    code?: string
    email: string
    created_at?: Date | string
    used_at?: Date | string | null
    user: userCreateNestedOneWithoutRoom_invitesInput
    room: roomCreateNestedOneWithoutRoom_invitesInput
  }

  export type room_invitesUncheckedCreateInput = {
    id?: string
    room_id: string
    inviter_id: string
    code?: string
    email: string
    created_at?: Date | string
    used_at?: Date | string | null
  }

  export type room_invitesUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    used_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: userUpdateOneRequiredWithoutRoom_invitesInput
    room?: roomUpdateOneRequiredWithoutRoom_invitesInput
  }

  export type room_invitesUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    room_id?: StringFieldUpdateOperationsInput | string
    inviter_id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    used_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type room_invitesUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    used_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type room_invitesUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    room_id?: StringFieldUpdateOperationsInput | string
    inviter_id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    used_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type room_participantsCreateInput = {
    room: roomCreateNestedOneWithoutRoom_participantsInput
    user: userCreateNestedOneWithoutRoom_participantsInput
  }

  export type room_participantsUncheckedCreateInput = {
    room_id: string
    user_id: string
  }

  export type room_participantsUpdateInput = {
    room?: roomUpdateOneRequiredWithoutRoom_participantsInput
    user?: userUpdateOneRequiredWithoutRoom_participantsInput
  }

  export type room_participantsUncheckedUpdateInput = {
    room_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
  }

  export type room_participantsUpdateManyMutationInput = {

  }

  export type room_participantsUncheckedUpdateManyInput = {
    room_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
  }

  export type threadCreateInput = {
    id?: string
    name?: string | null
    index: string
    room: roomCreateNestedOneWithoutThreadInput
    message?: messageCreateNestedManyWithoutThreadInput
  }

  export type threadUncheckedCreateInput = {
    id?: string
    room_id: string
    name?: string | null
    index: string
    message?: messageUncheckedCreateNestedManyWithoutThreadInput
  }

  export type threadUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    index?: StringFieldUpdateOperationsInput | string
    room?: roomUpdateOneRequiredWithoutThreadInput
    message?: messageUpdateManyWithoutThreadInput
  }

  export type threadUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    room_id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    index?: StringFieldUpdateOperationsInput | string
    message?: messageUncheckedUpdateManyWithoutThreadInput
  }

  export type threadUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    index?: StringFieldUpdateOperationsInput | string
  }

  export type threadUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    room_id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    index?: StringFieldUpdateOperationsInput | string
  }

  export type userCreateInput = {
    id?: string
    email?: string | null
    firebase_id?: string | null
    name?: string | null
    avatar_url?: string | null
    created_at?: Date | string
    account?: accountCreateNestedManyWithoutUserInput
    message?: messageCreateNestedManyWithoutUserInput
    room?: roomCreateNestedManyWithoutUserInput
    room_invites?: room_invitesCreateNestedManyWithoutUserInput
    room_participants?: room_participantsCreateNestedManyWithoutUserInput
  }

  export type userUncheckedCreateInput = {
    id?: string
    email?: string | null
    firebase_id?: string | null
    name?: string | null
    avatar_url?: string | null
    created_at?: Date | string
    account?: accountUncheckedCreateNestedManyWithoutUserInput
    message?: messageUncheckedCreateNestedManyWithoutUserInput
    room?: roomUncheckedCreateNestedManyWithoutUserInput
    room_invites?: room_invitesUncheckedCreateNestedManyWithoutUserInput
    room_participants?: room_participantsUncheckedCreateNestedManyWithoutUserInput
  }

  export type userUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    firebase_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: accountUpdateManyWithoutUserInput
    message?: messageUpdateManyWithoutUserInput
    room?: roomUpdateManyWithoutUserInput
    room_invites?: room_invitesUpdateManyWithoutUserInput
    room_participants?: room_participantsUpdateManyWithoutUserInput
  }

  export type userUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    firebase_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: accountUncheckedUpdateManyWithoutUserInput
    message?: messageUncheckedUpdateManyWithoutUserInput
    room?: roomUncheckedUpdateManyWithoutUserInput
    room_invites?: room_invitesUncheckedUpdateManyWithoutUserInput
    room_participants?: room_participantsUncheckedUpdateManyWithoutUserInput
  }

  export type userUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    firebase_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type userUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    firebase_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringFilter | string
  }

  export type DateTimeFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeFilter | Date | string
  }

  export type StringNullableFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringNullableFilter | string | null
  }

  export type DateTimeNullableFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | null
    notIn?: Enumerable<Date> | Enumerable<string> | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableFilter | Date | string | null
  }

  export type UserRelationFilter = {
    is?: userWhereInput
    isNot?: userWhereInput
  }

  export type ThreadRelationFilter = {
    is?: threadWhereInput
    isNot?: threadWhereInput
  }

  export type Message_typeRelationFilter = {
    is?: message_typeWhereInput
    isNot?: message_typeWhereInput
  }

  export type MessageListRelationFilter = {
    every?: messageWhereInput
    some?: messageWhereInput
    none?: messageWhereInput
  }

  export type Room_invitesListRelationFilter = {
    every?: room_invitesWhereInput
    some?: room_invitesWhereInput
    none?: room_invitesWhereInput
  }

  export type Room_participantsListRelationFilter = {
    every?: room_participantsWhereInput
    some?: room_participantsWhereInput
    none?: room_participantsWhereInput
  }

  export type ThreadListRelationFilter = {
    every?: threadWhereInput
    some?: threadWhereInput
    none?: threadWhereInput
  }

  export type RoomRelationFilter = {
    is?: roomWhereInput
    isNot?: roomWhereInput
  }

  export type room_invitesRoom_invites_room_id_email_keyCompoundUniqueInput = {
    room_id: string
    email: string
  }

  export type room_participantsRoom_participants_room_id_user_id_keyCompoundUniqueInput = {
    room_id: string
    user_id: string
  }

  export type room_participantsRoom_idUser_idCompoundUniqueInput = {
    room_id: string
    user_id: string
  }

  export type AccountListRelationFilter = {
    every?: accountWhereInput
    some?: accountWhereInput
    none?: accountWhereInput
  }

  export type RoomListRelationFilter = {
    every?: roomWhereInput
    some?: roomWhereInput
    none?: roomWhereInput
  }

  export type userCreateNestedOneWithoutAccountInput = {
    create?: XOR<userUncheckedCreateWithoutAccountInput, userCreateWithoutAccountInput>
    connectOrCreate?: userCreateOrConnectWithoutAccountInput
    connect?: userWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type userUpdateOneRequiredWithoutAccountInput = {
    create?: XOR<userUncheckedCreateWithoutAccountInput, userCreateWithoutAccountInput>
    connectOrCreate?: userCreateOrConnectWithoutAccountInput
    upsert?: userUpsertWithoutAccountInput
    connect?: userWhereUniqueInput
    update?: XOR<userUncheckedUpdateWithoutAccountInput, userUpdateWithoutAccountInput>
  }

  export type threadCreateNestedOneWithoutMessageInput = {
    create?: XOR<threadUncheckedCreateWithoutMessageInput, threadCreateWithoutMessageInput>
    connectOrCreate?: threadCreateOrConnectWithoutMessageInput
    connect?: threadWhereUniqueInput
  }

  export type message_typeCreateNestedOneWithoutMessageInput = {
    create?: XOR<message_typeUncheckedCreateWithoutMessageInput, message_typeCreateWithoutMessageInput>
    connectOrCreate?: message_typeCreateOrConnectWithoutMessageInput
    connect?: message_typeWhereUniqueInput
  }

  export type userCreateNestedOneWithoutMessageInput = {
    create?: XOR<userUncheckedCreateWithoutMessageInput, userCreateWithoutMessageInput>
    connectOrCreate?: userCreateOrConnectWithoutMessageInput
    connect?: userWhereUniqueInput
  }

  export type threadUpdateOneRequiredWithoutMessageInput = {
    create?: XOR<threadUncheckedCreateWithoutMessageInput, threadCreateWithoutMessageInput>
    connectOrCreate?: threadCreateOrConnectWithoutMessageInput
    upsert?: threadUpsertWithoutMessageInput
    connect?: threadWhereUniqueInput
    update?: XOR<threadUncheckedUpdateWithoutMessageInput, threadUpdateWithoutMessageInput>
  }

  export type message_typeUpdateOneRequiredWithoutMessageInput = {
    create?: XOR<message_typeUncheckedCreateWithoutMessageInput, message_typeCreateWithoutMessageInput>
    connectOrCreate?: message_typeCreateOrConnectWithoutMessageInput
    upsert?: message_typeUpsertWithoutMessageInput
    connect?: message_typeWhereUniqueInput
    update?: XOR<message_typeUncheckedUpdateWithoutMessageInput, message_typeUpdateWithoutMessageInput>
  }

  export type userUpdateOneRequiredWithoutMessageInput = {
    create?: XOR<userUncheckedCreateWithoutMessageInput, userCreateWithoutMessageInput>
    connectOrCreate?: userCreateOrConnectWithoutMessageInput
    upsert?: userUpsertWithoutMessageInput
    connect?: userWhereUniqueInput
    update?: XOR<userUncheckedUpdateWithoutMessageInput, userUpdateWithoutMessageInput>
  }

  export type messageCreateNestedManyWithoutMessage_typeInput = {
    create?: XOR<Enumerable<messageUncheckedCreateWithoutMessage_typeInput>, Enumerable<messageCreateWithoutMessage_typeInput>>
    connectOrCreate?: Enumerable<messageCreateOrConnectWithoutMessage_typeInput>
    connect?: Enumerable<messageWhereUniqueInput>
  }

  export type messageUncheckedCreateNestedManyWithoutMessage_typeInput = {
    create?: XOR<Enumerable<messageUncheckedCreateWithoutMessage_typeInput>, Enumerable<messageCreateWithoutMessage_typeInput>>
    connectOrCreate?: Enumerable<messageCreateOrConnectWithoutMessage_typeInput>
    connect?: Enumerable<messageWhereUniqueInput>
  }

  export type messageUpdateManyWithoutMessage_typeInput = {
    create?: XOR<Enumerable<messageUncheckedCreateWithoutMessage_typeInput>, Enumerable<messageCreateWithoutMessage_typeInput>>
    connectOrCreate?: Enumerable<messageCreateOrConnectWithoutMessage_typeInput>
    upsert?: Enumerable<messageUpsertWithWhereUniqueWithoutMessage_typeInput>
    connect?: Enumerable<messageWhereUniqueInput>
    set?: Enumerable<messageWhereUniqueInput>
    disconnect?: Enumerable<messageWhereUniqueInput>
    delete?: Enumerable<messageWhereUniqueInput>
    update?: Enumerable<messageUpdateWithWhereUniqueWithoutMessage_typeInput>
    updateMany?: Enumerable<messageUpdateManyWithWhereWithoutMessage_typeInput>
    deleteMany?: Enumerable<messageScalarWhereInput>
  }

  export type messageUncheckedUpdateManyWithoutMessage_typeInput = {
    create?: XOR<Enumerable<messageUncheckedCreateWithoutMessage_typeInput>, Enumerable<messageCreateWithoutMessage_typeInput>>
    connectOrCreate?: Enumerable<messageCreateOrConnectWithoutMessage_typeInput>
    upsert?: Enumerable<messageUpsertWithWhereUniqueWithoutMessage_typeInput>
    connect?: Enumerable<messageWhereUniqueInput>
    set?: Enumerable<messageWhereUniqueInput>
    disconnect?: Enumerable<messageWhereUniqueInput>
    delete?: Enumerable<messageWhereUniqueInput>
    update?: Enumerable<messageUpdateWithWhereUniqueWithoutMessage_typeInput>
    updateMany?: Enumerable<messageUpdateManyWithWhereWithoutMessage_typeInput>
    deleteMany?: Enumerable<messageScalarWhereInput>
  }

  export type userCreateNestedOneWithoutRoomInput = {
    create?: XOR<userUncheckedCreateWithoutRoomInput, userCreateWithoutRoomInput>
    connectOrCreate?: userCreateOrConnectWithoutRoomInput
    connect?: userWhereUniqueInput
  }

  export type room_invitesCreateNestedManyWithoutRoomInput = {
    create?: XOR<Enumerable<room_invitesUncheckedCreateWithoutRoomInput>, Enumerable<room_invitesCreateWithoutRoomInput>>
    connectOrCreate?: Enumerable<room_invitesCreateOrConnectWithoutRoomInput>
    connect?: Enumerable<room_invitesWhereUniqueInput>
  }

  export type room_participantsCreateNestedManyWithoutRoomInput = {
    create?: XOR<Enumerable<room_participantsUncheckedCreateWithoutRoomInput>, Enumerable<room_participantsCreateWithoutRoomInput>>
    connectOrCreate?: Enumerable<room_participantsCreateOrConnectWithoutRoomInput>
    connect?: Enumerable<room_participantsWhereUniqueInput>
  }

  export type threadCreateNestedManyWithoutRoomInput = {
    create?: XOR<Enumerable<threadUncheckedCreateWithoutRoomInput>, Enumerable<threadCreateWithoutRoomInput>>
    connectOrCreate?: Enumerable<threadCreateOrConnectWithoutRoomInput>
    connect?: Enumerable<threadWhereUniqueInput>
  }

  export type room_invitesUncheckedCreateNestedManyWithoutRoomInput = {
    create?: XOR<Enumerable<room_invitesUncheckedCreateWithoutRoomInput>, Enumerable<room_invitesCreateWithoutRoomInput>>
    connectOrCreate?: Enumerable<room_invitesCreateOrConnectWithoutRoomInput>
    connect?: Enumerable<room_invitesWhereUniqueInput>
  }

  export type room_participantsUncheckedCreateNestedManyWithoutRoomInput = {
    create?: XOR<Enumerable<room_participantsUncheckedCreateWithoutRoomInput>, Enumerable<room_participantsCreateWithoutRoomInput>>
    connectOrCreate?: Enumerable<room_participantsCreateOrConnectWithoutRoomInput>
    connect?: Enumerable<room_participantsWhereUniqueInput>
  }

  export type threadUncheckedCreateNestedManyWithoutRoomInput = {
    create?: XOR<Enumerable<threadUncheckedCreateWithoutRoomInput>, Enumerable<threadCreateWithoutRoomInput>>
    connectOrCreate?: Enumerable<threadCreateOrConnectWithoutRoomInput>
    connect?: Enumerable<threadWhereUniqueInput>
  }

  export type userUpdateOneRequiredWithoutRoomInput = {
    create?: XOR<userUncheckedCreateWithoutRoomInput, userCreateWithoutRoomInput>
    connectOrCreate?: userCreateOrConnectWithoutRoomInput
    upsert?: userUpsertWithoutRoomInput
    connect?: userWhereUniqueInput
    update?: XOR<userUncheckedUpdateWithoutRoomInput, userUpdateWithoutRoomInput>
  }

  export type room_invitesUpdateManyWithoutRoomInput = {
    create?: XOR<Enumerable<room_invitesUncheckedCreateWithoutRoomInput>, Enumerable<room_invitesCreateWithoutRoomInput>>
    connectOrCreate?: Enumerable<room_invitesCreateOrConnectWithoutRoomInput>
    upsert?: Enumerable<room_invitesUpsertWithWhereUniqueWithoutRoomInput>
    connect?: Enumerable<room_invitesWhereUniqueInput>
    set?: Enumerable<room_invitesWhereUniqueInput>
    disconnect?: Enumerable<room_invitesWhereUniqueInput>
    delete?: Enumerable<room_invitesWhereUniqueInput>
    update?: Enumerable<room_invitesUpdateWithWhereUniqueWithoutRoomInput>
    updateMany?: Enumerable<room_invitesUpdateManyWithWhereWithoutRoomInput>
    deleteMany?: Enumerable<room_invitesScalarWhereInput>
  }

  export type room_participantsUpdateManyWithoutRoomInput = {
    create?: XOR<Enumerable<room_participantsUncheckedCreateWithoutRoomInput>, Enumerable<room_participantsCreateWithoutRoomInput>>
    connectOrCreate?: Enumerable<room_participantsCreateOrConnectWithoutRoomInput>
    upsert?: Enumerable<room_participantsUpsertWithWhereUniqueWithoutRoomInput>
    connect?: Enumerable<room_participantsWhereUniqueInput>
    set?: Enumerable<room_participantsWhereUniqueInput>
    disconnect?: Enumerable<room_participantsWhereUniqueInput>
    delete?: Enumerable<room_participantsWhereUniqueInput>
    update?: Enumerable<room_participantsUpdateWithWhereUniqueWithoutRoomInput>
    updateMany?: Enumerable<room_participantsUpdateManyWithWhereWithoutRoomInput>
    deleteMany?: Enumerable<room_participantsScalarWhereInput>
  }

  export type threadUpdateManyWithoutRoomInput = {
    create?: XOR<Enumerable<threadUncheckedCreateWithoutRoomInput>, Enumerable<threadCreateWithoutRoomInput>>
    connectOrCreate?: Enumerable<threadCreateOrConnectWithoutRoomInput>
    upsert?: Enumerable<threadUpsertWithWhereUniqueWithoutRoomInput>
    connect?: Enumerable<threadWhereUniqueInput>
    set?: Enumerable<threadWhereUniqueInput>
    disconnect?: Enumerable<threadWhereUniqueInput>
    delete?: Enumerable<threadWhereUniqueInput>
    update?: Enumerable<threadUpdateWithWhereUniqueWithoutRoomInput>
    updateMany?: Enumerable<threadUpdateManyWithWhereWithoutRoomInput>
    deleteMany?: Enumerable<threadScalarWhereInput>
  }

  export type room_invitesUncheckedUpdateManyWithoutRoomInput = {
    create?: XOR<Enumerable<room_invitesUncheckedCreateWithoutRoomInput>, Enumerable<room_invitesCreateWithoutRoomInput>>
    connectOrCreate?: Enumerable<room_invitesCreateOrConnectWithoutRoomInput>
    upsert?: Enumerable<room_invitesUpsertWithWhereUniqueWithoutRoomInput>
    connect?: Enumerable<room_invitesWhereUniqueInput>
    set?: Enumerable<room_invitesWhereUniqueInput>
    disconnect?: Enumerable<room_invitesWhereUniqueInput>
    delete?: Enumerable<room_invitesWhereUniqueInput>
    update?: Enumerable<room_invitesUpdateWithWhereUniqueWithoutRoomInput>
    updateMany?: Enumerable<room_invitesUpdateManyWithWhereWithoutRoomInput>
    deleteMany?: Enumerable<room_invitesScalarWhereInput>
  }

  export type room_participantsUncheckedUpdateManyWithoutRoomInput = {
    create?: XOR<Enumerable<room_participantsUncheckedCreateWithoutRoomInput>, Enumerable<room_participantsCreateWithoutRoomInput>>
    connectOrCreate?: Enumerable<room_participantsCreateOrConnectWithoutRoomInput>
    upsert?: Enumerable<room_participantsUpsertWithWhereUniqueWithoutRoomInput>
    connect?: Enumerable<room_participantsWhereUniqueInput>
    set?: Enumerable<room_participantsWhereUniqueInput>
    disconnect?: Enumerable<room_participantsWhereUniqueInput>
    delete?: Enumerable<room_participantsWhereUniqueInput>
    update?: Enumerable<room_participantsUpdateWithWhereUniqueWithoutRoomInput>
    updateMany?: Enumerable<room_participantsUpdateManyWithWhereWithoutRoomInput>
    deleteMany?: Enumerable<room_participantsScalarWhereInput>
  }

  export type threadUncheckedUpdateManyWithoutRoomInput = {
    create?: XOR<Enumerable<threadUncheckedCreateWithoutRoomInput>, Enumerable<threadCreateWithoutRoomInput>>
    connectOrCreate?: Enumerable<threadCreateOrConnectWithoutRoomInput>
    upsert?: Enumerable<threadUpsertWithWhereUniqueWithoutRoomInput>
    connect?: Enumerable<threadWhereUniqueInput>
    set?: Enumerable<threadWhereUniqueInput>
    disconnect?: Enumerable<threadWhereUniqueInput>
    delete?: Enumerable<threadWhereUniqueInput>
    update?: Enumerable<threadUpdateWithWhereUniqueWithoutRoomInput>
    updateMany?: Enumerable<threadUpdateManyWithWhereWithoutRoomInput>
    deleteMany?: Enumerable<threadScalarWhereInput>
  }

  export type userCreateNestedOneWithoutRoom_invitesInput = {
    create?: XOR<userUncheckedCreateWithoutRoom_invitesInput, userCreateWithoutRoom_invitesInput>
    connectOrCreate?: userCreateOrConnectWithoutRoom_invitesInput
    connect?: userWhereUniqueInput
  }

  export type roomCreateNestedOneWithoutRoom_invitesInput = {
    create?: XOR<roomUncheckedCreateWithoutRoom_invitesInput, roomCreateWithoutRoom_invitesInput>
    connectOrCreate?: roomCreateOrConnectWithoutRoom_invitesInput
    connect?: roomWhereUniqueInput
  }

  export type userUpdateOneRequiredWithoutRoom_invitesInput = {
    create?: XOR<userUncheckedCreateWithoutRoom_invitesInput, userCreateWithoutRoom_invitesInput>
    connectOrCreate?: userCreateOrConnectWithoutRoom_invitesInput
    upsert?: userUpsertWithoutRoom_invitesInput
    connect?: userWhereUniqueInput
    update?: XOR<userUncheckedUpdateWithoutRoom_invitesInput, userUpdateWithoutRoom_invitesInput>
  }

  export type roomUpdateOneRequiredWithoutRoom_invitesInput = {
    create?: XOR<roomUncheckedCreateWithoutRoom_invitesInput, roomCreateWithoutRoom_invitesInput>
    connectOrCreate?: roomCreateOrConnectWithoutRoom_invitesInput
    upsert?: roomUpsertWithoutRoom_invitesInput
    connect?: roomWhereUniqueInput
    update?: XOR<roomUncheckedUpdateWithoutRoom_invitesInput, roomUpdateWithoutRoom_invitesInput>
  }

  export type roomCreateNestedOneWithoutRoom_participantsInput = {
    create?: XOR<roomUncheckedCreateWithoutRoom_participantsInput, roomCreateWithoutRoom_participantsInput>
    connectOrCreate?: roomCreateOrConnectWithoutRoom_participantsInput
    connect?: roomWhereUniqueInput
  }

  export type userCreateNestedOneWithoutRoom_participantsInput = {
    create?: XOR<userUncheckedCreateWithoutRoom_participantsInput, userCreateWithoutRoom_participantsInput>
    connectOrCreate?: userCreateOrConnectWithoutRoom_participantsInput
    connect?: userWhereUniqueInput
  }

  export type roomUpdateOneRequiredWithoutRoom_participantsInput = {
    create?: XOR<roomUncheckedCreateWithoutRoom_participantsInput, roomCreateWithoutRoom_participantsInput>
    connectOrCreate?: roomCreateOrConnectWithoutRoom_participantsInput
    upsert?: roomUpsertWithoutRoom_participantsInput
    connect?: roomWhereUniqueInput
    update?: XOR<roomUncheckedUpdateWithoutRoom_participantsInput, roomUpdateWithoutRoom_participantsInput>
  }

  export type userUpdateOneRequiredWithoutRoom_participantsInput = {
    create?: XOR<userUncheckedCreateWithoutRoom_participantsInput, userCreateWithoutRoom_participantsInput>
    connectOrCreate?: userCreateOrConnectWithoutRoom_participantsInput
    upsert?: userUpsertWithoutRoom_participantsInput
    connect?: userWhereUniqueInput
    update?: XOR<userUncheckedUpdateWithoutRoom_participantsInput, userUpdateWithoutRoom_participantsInput>
  }

  export type roomCreateNestedOneWithoutThreadInput = {
    create?: XOR<roomUncheckedCreateWithoutThreadInput, roomCreateWithoutThreadInput>
    connectOrCreate?: roomCreateOrConnectWithoutThreadInput
    connect?: roomWhereUniqueInput
  }

  export type messageCreateNestedManyWithoutThreadInput = {
    create?: XOR<Enumerable<messageUncheckedCreateWithoutThreadInput>, Enumerable<messageCreateWithoutThreadInput>>
    connectOrCreate?: Enumerable<messageCreateOrConnectWithoutThreadInput>
    connect?: Enumerable<messageWhereUniqueInput>
  }

  export type messageUncheckedCreateNestedManyWithoutThreadInput = {
    create?: XOR<Enumerable<messageUncheckedCreateWithoutThreadInput>, Enumerable<messageCreateWithoutThreadInput>>
    connectOrCreate?: Enumerable<messageCreateOrConnectWithoutThreadInput>
    connect?: Enumerable<messageWhereUniqueInput>
  }

  export type roomUpdateOneRequiredWithoutThreadInput = {
    create?: XOR<roomUncheckedCreateWithoutThreadInput, roomCreateWithoutThreadInput>
    connectOrCreate?: roomCreateOrConnectWithoutThreadInput
    upsert?: roomUpsertWithoutThreadInput
    connect?: roomWhereUniqueInput
    update?: XOR<roomUncheckedUpdateWithoutThreadInput, roomUpdateWithoutThreadInput>
  }

  export type messageUpdateManyWithoutThreadInput = {
    create?: XOR<Enumerable<messageUncheckedCreateWithoutThreadInput>, Enumerable<messageCreateWithoutThreadInput>>
    connectOrCreate?: Enumerable<messageCreateOrConnectWithoutThreadInput>
    upsert?: Enumerable<messageUpsertWithWhereUniqueWithoutThreadInput>
    connect?: Enumerable<messageWhereUniqueInput>
    set?: Enumerable<messageWhereUniqueInput>
    disconnect?: Enumerable<messageWhereUniqueInput>
    delete?: Enumerable<messageWhereUniqueInput>
    update?: Enumerable<messageUpdateWithWhereUniqueWithoutThreadInput>
    updateMany?: Enumerable<messageUpdateManyWithWhereWithoutThreadInput>
    deleteMany?: Enumerable<messageScalarWhereInput>
  }

  export type messageUncheckedUpdateManyWithoutThreadInput = {
    create?: XOR<Enumerable<messageUncheckedCreateWithoutThreadInput>, Enumerable<messageCreateWithoutThreadInput>>
    connectOrCreate?: Enumerable<messageCreateOrConnectWithoutThreadInput>
    upsert?: Enumerable<messageUpsertWithWhereUniqueWithoutThreadInput>
    connect?: Enumerable<messageWhereUniqueInput>
    set?: Enumerable<messageWhereUniqueInput>
    disconnect?: Enumerable<messageWhereUniqueInput>
    delete?: Enumerable<messageWhereUniqueInput>
    update?: Enumerable<messageUpdateWithWhereUniqueWithoutThreadInput>
    updateMany?: Enumerable<messageUpdateManyWithWhereWithoutThreadInput>
    deleteMany?: Enumerable<messageScalarWhereInput>
  }

  export type accountCreateNestedManyWithoutUserInput = {
    create?: XOR<Enumerable<accountUncheckedCreateWithoutUserInput>, Enumerable<accountCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<accountCreateOrConnectWithoutUserInput>
    connect?: Enumerable<accountWhereUniqueInput>
  }

  export type messageCreateNestedManyWithoutUserInput = {
    create?: XOR<Enumerable<messageUncheckedCreateWithoutUserInput>, Enumerable<messageCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<messageCreateOrConnectWithoutUserInput>
    connect?: Enumerable<messageWhereUniqueInput>
  }

  export type roomCreateNestedManyWithoutUserInput = {
    create?: XOR<Enumerable<roomUncheckedCreateWithoutUserInput>, Enumerable<roomCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<roomCreateOrConnectWithoutUserInput>
    connect?: Enumerable<roomWhereUniqueInput>
  }

  export type room_invitesCreateNestedManyWithoutUserInput = {
    create?: XOR<Enumerable<room_invitesUncheckedCreateWithoutUserInput>, Enumerable<room_invitesCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<room_invitesCreateOrConnectWithoutUserInput>
    connect?: Enumerable<room_invitesWhereUniqueInput>
  }

  export type room_participantsCreateNestedManyWithoutUserInput = {
    create?: XOR<Enumerable<room_participantsUncheckedCreateWithoutUserInput>, Enumerable<room_participantsCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<room_participantsCreateOrConnectWithoutUserInput>
    connect?: Enumerable<room_participantsWhereUniqueInput>
  }

  export type accountUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<Enumerable<accountUncheckedCreateWithoutUserInput>, Enumerable<accountCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<accountCreateOrConnectWithoutUserInput>
    connect?: Enumerable<accountWhereUniqueInput>
  }

  export type messageUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<Enumerable<messageUncheckedCreateWithoutUserInput>, Enumerable<messageCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<messageCreateOrConnectWithoutUserInput>
    connect?: Enumerable<messageWhereUniqueInput>
  }

  export type roomUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<Enumerable<roomUncheckedCreateWithoutUserInput>, Enumerable<roomCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<roomCreateOrConnectWithoutUserInput>
    connect?: Enumerable<roomWhereUniqueInput>
  }

  export type room_invitesUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<Enumerable<room_invitesUncheckedCreateWithoutUserInput>, Enumerable<room_invitesCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<room_invitesCreateOrConnectWithoutUserInput>
    connect?: Enumerable<room_invitesWhereUniqueInput>
  }

  export type room_participantsUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<Enumerable<room_participantsUncheckedCreateWithoutUserInput>, Enumerable<room_participantsCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<room_participantsCreateOrConnectWithoutUserInput>
    connect?: Enumerable<room_participantsWhereUniqueInput>
  }

  export type accountUpdateManyWithoutUserInput = {
    create?: XOR<Enumerable<accountUncheckedCreateWithoutUserInput>, Enumerable<accountCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<accountCreateOrConnectWithoutUserInput>
    upsert?: Enumerable<accountUpsertWithWhereUniqueWithoutUserInput>
    connect?: Enumerable<accountWhereUniqueInput>
    set?: Enumerable<accountWhereUniqueInput>
    disconnect?: Enumerable<accountWhereUniqueInput>
    delete?: Enumerable<accountWhereUniqueInput>
    update?: Enumerable<accountUpdateWithWhereUniqueWithoutUserInput>
    updateMany?: Enumerable<accountUpdateManyWithWhereWithoutUserInput>
    deleteMany?: Enumerable<accountScalarWhereInput>
  }

  export type messageUpdateManyWithoutUserInput = {
    create?: XOR<Enumerable<messageUncheckedCreateWithoutUserInput>, Enumerable<messageCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<messageCreateOrConnectWithoutUserInput>
    upsert?: Enumerable<messageUpsertWithWhereUniqueWithoutUserInput>
    connect?: Enumerable<messageWhereUniqueInput>
    set?: Enumerable<messageWhereUniqueInput>
    disconnect?: Enumerable<messageWhereUniqueInput>
    delete?: Enumerable<messageWhereUniqueInput>
    update?: Enumerable<messageUpdateWithWhereUniqueWithoutUserInput>
    updateMany?: Enumerable<messageUpdateManyWithWhereWithoutUserInput>
    deleteMany?: Enumerable<messageScalarWhereInput>
  }

  export type roomUpdateManyWithoutUserInput = {
    create?: XOR<Enumerable<roomUncheckedCreateWithoutUserInput>, Enumerable<roomCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<roomCreateOrConnectWithoutUserInput>
    upsert?: Enumerable<roomUpsertWithWhereUniqueWithoutUserInput>
    connect?: Enumerable<roomWhereUniqueInput>
    set?: Enumerable<roomWhereUniqueInput>
    disconnect?: Enumerable<roomWhereUniqueInput>
    delete?: Enumerable<roomWhereUniqueInput>
    update?: Enumerable<roomUpdateWithWhereUniqueWithoutUserInput>
    updateMany?: Enumerable<roomUpdateManyWithWhereWithoutUserInput>
    deleteMany?: Enumerable<roomScalarWhereInput>
  }

  export type room_invitesUpdateManyWithoutUserInput = {
    create?: XOR<Enumerable<room_invitesUncheckedCreateWithoutUserInput>, Enumerable<room_invitesCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<room_invitesCreateOrConnectWithoutUserInput>
    upsert?: Enumerable<room_invitesUpsertWithWhereUniqueWithoutUserInput>
    connect?: Enumerable<room_invitesWhereUniqueInput>
    set?: Enumerable<room_invitesWhereUniqueInput>
    disconnect?: Enumerable<room_invitesWhereUniqueInput>
    delete?: Enumerable<room_invitesWhereUniqueInput>
    update?: Enumerable<room_invitesUpdateWithWhereUniqueWithoutUserInput>
    updateMany?: Enumerable<room_invitesUpdateManyWithWhereWithoutUserInput>
    deleteMany?: Enumerable<room_invitesScalarWhereInput>
  }

  export type room_participantsUpdateManyWithoutUserInput = {
    create?: XOR<Enumerable<room_participantsUncheckedCreateWithoutUserInput>, Enumerable<room_participantsCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<room_participantsCreateOrConnectWithoutUserInput>
    upsert?: Enumerable<room_participantsUpsertWithWhereUniqueWithoutUserInput>
    connect?: Enumerable<room_participantsWhereUniqueInput>
    set?: Enumerable<room_participantsWhereUniqueInput>
    disconnect?: Enumerable<room_participantsWhereUniqueInput>
    delete?: Enumerable<room_participantsWhereUniqueInput>
    update?: Enumerable<room_participantsUpdateWithWhereUniqueWithoutUserInput>
    updateMany?: Enumerable<room_participantsUpdateManyWithWhereWithoutUserInput>
    deleteMany?: Enumerable<room_participantsScalarWhereInput>
  }

  export type accountUncheckedUpdateManyWithoutUserInput = {
    create?: XOR<Enumerable<accountUncheckedCreateWithoutUserInput>, Enumerable<accountCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<accountCreateOrConnectWithoutUserInput>
    upsert?: Enumerable<accountUpsertWithWhereUniqueWithoutUserInput>
    connect?: Enumerable<accountWhereUniqueInput>
    set?: Enumerable<accountWhereUniqueInput>
    disconnect?: Enumerable<accountWhereUniqueInput>
    delete?: Enumerable<accountWhereUniqueInput>
    update?: Enumerable<accountUpdateWithWhereUniqueWithoutUserInput>
    updateMany?: Enumerable<accountUpdateManyWithWhereWithoutUserInput>
    deleteMany?: Enumerable<accountScalarWhereInput>
  }

  export type messageUncheckedUpdateManyWithoutUserInput = {
    create?: XOR<Enumerable<messageUncheckedCreateWithoutUserInput>, Enumerable<messageCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<messageCreateOrConnectWithoutUserInput>
    upsert?: Enumerable<messageUpsertWithWhereUniqueWithoutUserInput>
    connect?: Enumerable<messageWhereUniqueInput>
    set?: Enumerable<messageWhereUniqueInput>
    disconnect?: Enumerable<messageWhereUniqueInput>
    delete?: Enumerable<messageWhereUniqueInput>
    update?: Enumerable<messageUpdateWithWhereUniqueWithoutUserInput>
    updateMany?: Enumerable<messageUpdateManyWithWhereWithoutUserInput>
    deleteMany?: Enumerable<messageScalarWhereInput>
  }

  export type roomUncheckedUpdateManyWithoutUserInput = {
    create?: XOR<Enumerable<roomUncheckedCreateWithoutUserInput>, Enumerable<roomCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<roomCreateOrConnectWithoutUserInput>
    upsert?: Enumerable<roomUpsertWithWhereUniqueWithoutUserInput>
    connect?: Enumerable<roomWhereUniqueInput>
    set?: Enumerable<roomWhereUniqueInput>
    disconnect?: Enumerable<roomWhereUniqueInput>
    delete?: Enumerable<roomWhereUniqueInput>
    update?: Enumerable<roomUpdateWithWhereUniqueWithoutUserInput>
    updateMany?: Enumerable<roomUpdateManyWithWhereWithoutUserInput>
    deleteMany?: Enumerable<roomScalarWhereInput>
  }

  export type room_invitesUncheckedUpdateManyWithoutUserInput = {
    create?: XOR<Enumerable<room_invitesUncheckedCreateWithoutUserInput>, Enumerable<room_invitesCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<room_invitesCreateOrConnectWithoutUserInput>
    upsert?: Enumerable<room_invitesUpsertWithWhereUniqueWithoutUserInput>
    connect?: Enumerable<room_invitesWhereUniqueInput>
    set?: Enumerable<room_invitesWhereUniqueInput>
    disconnect?: Enumerable<room_invitesWhereUniqueInput>
    delete?: Enumerable<room_invitesWhereUniqueInput>
    update?: Enumerable<room_invitesUpdateWithWhereUniqueWithoutUserInput>
    updateMany?: Enumerable<room_invitesUpdateManyWithWhereWithoutUserInput>
    deleteMany?: Enumerable<room_invitesScalarWhereInput>
  }

  export type room_participantsUncheckedUpdateManyWithoutUserInput = {
    create?: XOR<Enumerable<room_participantsUncheckedCreateWithoutUserInput>, Enumerable<room_participantsCreateWithoutUserInput>>
    connectOrCreate?: Enumerable<room_participantsCreateOrConnectWithoutUserInput>
    upsert?: Enumerable<room_participantsUpsertWithWhereUniqueWithoutUserInput>
    connect?: Enumerable<room_participantsWhereUniqueInput>
    set?: Enumerable<room_participantsWhereUniqueInput>
    disconnect?: Enumerable<room_participantsWhereUniqueInput>
    delete?: Enumerable<room_participantsWhereUniqueInput>
    update?: Enumerable<room_participantsUpdateWithWhereUniqueWithoutUserInput>
    updateMany?: Enumerable<room_participantsUpdateManyWithWhereWithoutUserInput>
    deleteMany?: Enumerable<room_participantsScalarWhereInput>
  }

  export type NestedStringFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringFilter | string
  }

  export type NestedDateTimeFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeFilter | Date | string
  }

  export type NestedStringNullableFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringNullableFilter | string | null
  }

  export type NestedDateTimeNullableFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | null
    notIn?: Enumerable<Date> | Enumerable<string> | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableFilter | Date | string | null
  }

  export type userCreateWithoutAccountInput = {
    id?: string
    email?: string | null
    firebase_id?: string | null
    name?: string | null
    avatar_url?: string | null
    created_at?: Date | string
    message?: messageCreateNestedManyWithoutUserInput
    room?: roomCreateNestedManyWithoutUserInput
    room_invites?: room_invitesCreateNestedManyWithoutUserInput
    room_participants?: room_participantsCreateNestedManyWithoutUserInput
  }

  export type userUncheckedCreateWithoutAccountInput = {
    id?: string
    email?: string | null
    firebase_id?: string | null
    name?: string | null
    avatar_url?: string | null
    created_at?: Date | string
    message?: messageUncheckedCreateNestedManyWithoutUserInput
    room?: roomUncheckedCreateNestedManyWithoutUserInput
    room_invites?: room_invitesUncheckedCreateNestedManyWithoutUserInput
    room_participants?: room_participantsUncheckedCreateNestedManyWithoutUserInput
  }

  export type userCreateOrConnectWithoutAccountInput = {
    where: userWhereUniqueInput
    create: XOR<userUncheckedCreateWithoutAccountInput, userCreateWithoutAccountInput>
  }

  export type userUpsertWithoutAccountInput = {
    update: XOR<userUncheckedUpdateWithoutAccountInput, userUpdateWithoutAccountInput>
    create: XOR<userUncheckedCreateWithoutAccountInput, userCreateWithoutAccountInput>
  }

  export type userUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    firebase_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    message?: messageUpdateManyWithoutUserInput
    room?: roomUpdateManyWithoutUserInput
    room_invites?: room_invitesUpdateManyWithoutUserInput
    room_participants?: room_participantsUpdateManyWithoutUserInput
  }

  export type userUncheckedUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    firebase_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    message?: messageUncheckedUpdateManyWithoutUserInput
    room?: roomUncheckedUpdateManyWithoutUserInput
    room_invites?: room_invitesUncheckedUpdateManyWithoutUserInput
    room_participants?: room_participantsUncheckedUpdateManyWithoutUserInput
  }

  export type threadCreateWithoutMessageInput = {
    id?: string
    name?: string | null
    index: string
    room: roomCreateNestedOneWithoutThreadInput
  }

  export type threadUncheckedCreateWithoutMessageInput = {
    id?: string
    room_id: string
    name?: string | null
    index: string
  }

  export type threadCreateOrConnectWithoutMessageInput = {
    where: threadWhereUniqueInput
    create: XOR<threadUncheckedCreateWithoutMessageInput, threadCreateWithoutMessageInput>
  }

  export type message_typeCreateWithoutMessageInput = {
    value: string
  }

  export type message_typeUncheckedCreateWithoutMessageInput = {
    value: string
  }

  export type message_typeCreateOrConnectWithoutMessageInput = {
    where: message_typeWhereUniqueInput
    create: XOR<message_typeUncheckedCreateWithoutMessageInput, message_typeCreateWithoutMessageInput>
  }

  export type userCreateWithoutMessageInput = {
    id?: string
    email?: string | null
    firebase_id?: string | null
    name?: string | null
    avatar_url?: string | null
    created_at?: Date | string
    account?: accountCreateNestedManyWithoutUserInput
    room?: roomCreateNestedManyWithoutUserInput
    room_invites?: room_invitesCreateNestedManyWithoutUserInput
    room_participants?: room_participantsCreateNestedManyWithoutUserInput
  }

  export type userUncheckedCreateWithoutMessageInput = {
    id?: string
    email?: string | null
    firebase_id?: string | null
    name?: string | null
    avatar_url?: string | null
    created_at?: Date | string
    account?: accountUncheckedCreateNestedManyWithoutUserInput
    room?: roomUncheckedCreateNestedManyWithoutUserInput
    room_invites?: room_invitesUncheckedCreateNestedManyWithoutUserInput
    room_participants?: room_participantsUncheckedCreateNestedManyWithoutUserInput
  }

  export type userCreateOrConnectWithoutMessageInput = {
    where: userWhereUniqueInput
    create: XOR<userUncheckedCreateWithoutMessageInput, userCreateWithoutMessageInput>
  }

  export type threadUpsertWithoutMessageInput = {
    update: XOR<threadUncheckedUpdateWithoutMessageInput, threadUpdateWithoutMessageInput>
    create: XOR<threadUncheckedCreateWithoutMessageInput, threadCreateWithoutMessageInput>
  }

  export type threadUpdateWithoutMessageInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    index?: StringFieldUpdateOperationsInput | string
    room?: roomUpdateOneRequiredWithoutThreadInput
  }

  export type threadUncheckedUpdateWithoutMessageInput = {
    id?: StringFieldUpdateOperationsInput | string
    room_id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    index?: StringFieldUpdateOperationsInput | string
  }

  export type message_typeUpsertWithoutMessageInput = {
    update: XOR<message_typeUncheckedUpdateWithoutMessageInput, message_typeUpdateWithoutMessageInput>
    create: XOR<message_typeUncheckedCreateWithoutMessageInput, message_typeCreateWithoutMessageInput>
  }

  export type message_typeUpdateWithoutMessageInput = {
    value?: StringFieldUpdateOperationsInput | string
  }

  export type message_typeUncheckedUpdateWithoutMessageInput = {
    value?: StringFieldUpdateOperationsInput | string
  }

  export type userUpsertWithoutMessageInput = {
    update: XOR<userUncheckedUpdateWithoutMessageInput, userUpdateWithoutMessageInput>
    create: XOR<userUncheckedCreateWithoutMessageInput, userCreateWithoutMessageInput>
  }

  export type userUpdateWithoutMessageInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    firebase_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: accountUpdateManyWithoutUserInput
    room?: roomUpdateManyWithoutUserInput
    room_invites?: room_invitesUpdateManyWithoutUserInput
    room_participants?: room_participantsUpdateManyWithoutUserInput
  }

  export type userUncheckedUpdateWithoutMessageInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    firebase_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: accountUncheckedUpdateManyWithoutUserInput
    room?: roomUncheckedUpdateManyWithoutUserInput
    room_invites?: room_invitesUncheckedUpdateManyWithoutUserInput
    room_participants?: room_participantsUncheckedUpdateManyWithoutUserInput
  }

  export type messageCreateWithoutMessage_typeInput = {
    created_at?: Date | string
    media_url?: string | null
    text?: string | null
    transcription?: string | null
    id?: string
    thread: threadCreateNestedOneWithoutMessageInput
    user: userCreateNestedOneWithoutMessageInput
  }

  export type messageUncheckedCreateWithoutMessage_typeInput = {
    thread_id: string
    user_id: string
    created_at?: Date | string
    media_url?: string | null
    text?: string | null
    transcription?: string | null
    id?: string
  }

  export type messageCreateOrConnectWithoutMessage_typeInput = {
    where: messageWhereUniqueInput
    create: XOR<messageUncheckedCreateWithoutMessage_typeInput, messageCreateWithoutMessage_typeInput>
  }

  export type messageUpsertWithWhereUniqueWithoutMessage_typeInput = {
    where: messageWhereUniqueInput
    update: XOR<messageUncheckedUpdateWithoutMessage_typeInput, messageUpdateWithoutMessage_typeInput>
    create: XOR<messageUncheckedCreateWithoutMessage_typeInput, messageCreateWithoutMessage_typeInput>
  }

  export type messageUpdateWithWhereUniqueWithoutMessage_typeInput = {
    where: messageWhereUniqueInput
    data: XOR<messageUncheckedUpdateWithoutMessage_typeInput, messageUpdateWithoutMessage_typeInput>
  }

  export type messageUpdateManyWithWhereWithoutMessage_typeInput = {
    where: messageScalarWhereInput
    data: XOR<messageUncheckedUpdateManyWithoutMessageInput, messageUpdateManyMutationInput>
  }

  export type messageScalarWhereInput = {
    AND?: Enumerable<messageScalarWhereInput>
    OR?: Enumerable<messageScalarWhereInput>
    NOT?: Enumerable<messageScalarWhereInput>
    thread_id?: StringFilter | string
    user_id?: StringFilter | string
    created_at?: DateTimeFilter | Date | string
    type?: StringFilter | string
    media_url?: StringNullableFilter | string | null
    text?: StringNullableFilter | string | null
    transcription?: StringNullableFilter | string | null
    id?: StringFilter | string
  }

  export type userCreateWithoutRoomInput = {
    id?: string
    email?: string | null
    firebase_id?: string | null
    name?: string | null
    avatar_url?: string | null
    created_at?: Date | string
    account?: accountCreateNestedManyWithoutUserInput
    message?: messageCreateNestedManyWithoutUserInput
    room_invites?: room_invitesCreateNestedManyWithoutUserInput
    room_participants?: room_participantsCreateNestedManyWithoutUserInput
  }

  export type userUncheckedCreateWithoutRoomInput = {
    id?: string
    email?: string | null
    firebase_id?: string | null
    name?: string | null
    avatar_url?: string | null
    created_at?: Date | string
    account?: accountUncheckedCreateNestedManyWithoutUserInput
    message?: messageUncheckedCreateNestedManyWithoutUserInput
    room_invites?: room_invitesUncheckedCreateNestedManyWithoutUserInput
    room_participants?: room_participantsUncheckedCreateNestedManyWithoutUserInput
  }

  export type userCreateOrConnectWithoutRoomInput = {
    where: userWhereUniqueInput
    create: XOR<userUncheckedCreateWithoutRoomInput, userCreateWithoutRoomInput>
  }

  export type room_invitesCreateWithoutRoomInput = {
    id?: string
    code?: string
    email: string
    created_at?: Date | string
    used_at?: Date | string | null
    user: userCreateNestedOneWithoutRoom_invitesInput
  }

  export type room_invitesUncheckedCreateWithoutRoomInput = {
    id?: string
    inviter_id: string
    code?: string
    email: string
    created_at?: Date | string
    used_at?: Date | string | null
  }

  export type room_invitesCreateOrConnectWithoutRoomInput = {
    where: room_invitesWhereUniqueInput
    create: XOR<room_invitesUncheckedCreateWithoutRoomInput, room_invitesCreateWithoutRoomInput>
  }

  export type room_participantsCreateWithoutRoomInput = {
    user: userCreateNestedOneWithoutRoom_participantsInput
  }

  export type room_participantsUncheckedCreateWithoutRoomInput = {
    user_id: string
  }

  export type room_participantsCreateOrConnectWithoutRoomInput = {
    where: room_participantsWhereUniqueInput
    create: XOR<room_participantsUncheckedCreateWithoutRoomInput, room_participantsCreateWithoutRoomInput>
  }

  export type threadCreateWithoutRoomInput = {
    id?: string
    name?: string | null
    index: string
    message?: messageCreateNestedManyWithoutThreadInput
  }

  export type threadUncheckedCreateWithoutRoomInput = {
    id?: string
    name?: string | null
    index: string
    message?: messageUncheckedCreateNestedManyWithoutThreadInput
  }

  export type threadCreateOrConnectWithoutRoomInput = {
    where: threadWhereUniqueInput
    create: XOR<threadUncheckedCreateWithoutRoomInput, threadCreateWithoutRoomInput>
  }

  export type userUpsertWithoutRoomInput = {
    update: XOR<userUncheckedUpdateWithoutRoomInput, userUpdateWithoutRoomInput>
    create: XOR<userUncheckedCreateWithoutRoomInput, userCreateWithoutRoomInput>
  }

  export type userUpdateWithoutRoomInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    firebase_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: accountUpdateManyWithoutUserInput
    message?: messageUpdateManyWithoutUserInput
    room_invites?: room_invitesUpdateManyWithoutUserInput
    room_participants?: room_participantsUpdateManyWithoutUserInput
  }

  export type userUncheckedUpdateWithoutRoomInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    firebase_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: accountUncheckedUpdateManyWithoutUserInput
    message?: messageUncheckedUpdateManyWithoutUserInput
    room_invites?: room_invitesUncheckedUpdateManyWithoutUserInput
    room_participants?: room_participantsUncheckedUpdateManyWithoutUserInput
  }

  export type room_invitesUpsertWithWhereUniqueWithoutRoomInput = {
    where: room_invitesWhereUniqueInput
    update: XOR<room_invitesUncheckedUpdateWithoutRoomInput, room_invitesUpdateWithoutRoomInput>
    create: XOR<room_invitesUncheckedCreateWithoutRoomInput, room_invitesCreateWithoutRoomInput>
  }

  export type room_invitesUpdateWithWhereUniqueWithoutRoomInput = {
    where: room_invitesWhereUniqueInput
    data: XOR<room_invitesUncheckedUpdateWithoutRoomInput, room_invitesUpdateWithoutRoomInput>
  }

  export type room_invitesUpdateManyWithWhereWithoutRoomInput = {
    where: room_invitesScalarWhereInput
    data: XOR<room_invitesUncheckedUpdateManyWithoutRoom_invitesInput, room_invitesUpdateManyMutationInput>
  }

  export type room_invitesScalarWhereInput = {
    AND?: Enumerable<room_invitesScalarWhereInput>
    OR?: Enumerable<room_invitesScalarWhereInput>
    NOT?: Enumerable<room_invitesScalarWhereInput>
    id?: StringFilter | string
    room_id?: StringFilter | string
    inviter_id?: StringFilter | string
    code?: StringFilter | string
    email?: StringFilter | string
    created_at?: DateTimeFilter | Date | string
    used_at?: DateTimeNullableFilter | Date | string | null
  }

  export type room_participantsUpsertWithWhereUniqueWithoutRoomInput = {
    where: room_participantsWhereUniqueInput
    update: XOR<room_participantsUncheckedUpdateWithoutRoomInput, room_participantsUpdateWithoutRoomInput>
    create: XOR<room_participantsUncheckedCreateWithoutRoomInput, room_participantsCreateWithoutRoomInput>
  }

  export type room_participantsUpdateWithWhereUniqueWithoutRoomInput = {
    where: room_participantsWhereUniqueInput
    data: XOR<room_participantsUncheckedUpdateWithoutRoomInput, room_participantsUpdateWithoutRoomInput>
  }

  export type room_participantsUpdateManyWithWhereWithoutRoomInput = {
    where: room_participantsScalarWhereInput
    data: XOR<room_participantsUncheckedUpdateManyWithoutRoom_participantsInput, room_participantsUpdateManyMutationInput>
  }

  export type room_participantsScalarWhereInput = {
    AND?: Enumerable<room_participantsScalarWhereInput>
    OR?: Enumerable<room_participantsScalarWhereInput>
    NOT?: Enumerable<room_participantsScalarWhereInput>
    room_id?: StringFilter | string
    user_id?: StringFilter | string
  }

  export type threadUpsertWithWhereUniqueWithoutRoomInput = {
    where: threadWhereUniqueInput
    update: XOR<threadUncheckedUpdateWithoutRoomInput, threadUpdateWithoutRoomInput>
    create: XOR<threadUncheckedCreateWithoutRoomInput, threadCreateWithoutRoomInput>
  }

  export type threadUpdateWithWhereUniqueWithoutRoomInput = {
    where: threadWhereUniqueInput
    data: XOR<threadUncheckedUpdateWithoutRoomInput, threadUpdateWithoutRoomInput>
  }

  export type threadUpdateManyWithWhereWithoutRoomInput = {
    where: threadScalarWhereInput
    data: XOR<threadUncheckedUpdateManyWithoutThreadInput, threadUpdateManyMutationInput>
  }

  export type threadScalarWhereInput = {
    AND?: Enumerable<threadScalarWhereInput>
    OR?: Enumerable<threadScalarWhereInput>
    NOT?: Enumerable<threadScalarWhereInput>
    id?: StringFilter | string
    room_id?: StringFilter | string
    name?: StringNullableFilter | string | null
    index?: StringFilter | string
  }

  export type userCreateWithoutRoom_invitesInput = {
    id?: string
    email?: string | null
    firebase_id?: string | null
    name?: string | null
    avatar_url?: string | null
    created_at?: Date | string
    account?: accountCreateNestedManyWithoutUserInput
    message?: messageCreateNestedManyWithoutUserInput
    room?: roomCreateNestedManyWithoutUserInput
    room_participants?: room_participantsCreateNestedManyWithoutUserInput
  }

  export type userUncheckedCreateWithoutRoom_invitesInput = {
    id?: string
    email?: string | null
    firebase_id?: string | null
    name?: string | null
    avatar_url?: string | null
    created_at?: Date | string
    account?: accountUncheckedCreateNestedManyWithoutUserInput
    message?: messageUncheckedCreateNestedManyWithoutUserInput
    room?: roomUncheckedCreateNestedManyWithoutUserInput
    room_participants?: room_participantsUncheckedCreateNestedManyWithoutUserInput
  }

  export type userCreateOrConnectWithoutRoom_invitesInput = {
    where: userWhereUniqueInput
    create: XOR<userUncheckedCreateWithoutRoom_invitesInput, userCreateWithoutRoom_invitesInput>
  }

  export type roomCreateWithoutRoom_invitesInput = {
    id?: string
    name?: string | null
    created_at?: Date | string
    deadline?: Date | string
    notification_job_id?: string | null
    summary?: string | null
    finished_at?: Date | string | null
    user: userCreateNestedOneWithoutRoomInput
    room_participants?: room_participantsCreateNestedManyWithoutRoomInput
    thread?: threadCreateNestedManyWithoutRoomInput
  }

  export type roomUncheckedCreateWithoutRoom_invitesInput = {
    id?: string
    creator_id: string
    name?: string | null
    created_at?: Date | string
    deadline?: Date | string
    notification_job_id?: string | null
    summary?: string | null
    finished_at?: Date | string | null
    room_participants?: room_participantsUncheckedCreateNestedManyWithoutRoomInput
    thread?: threadUncheckedCreateNestedManyWithoutRoomInput
  }

  export type roomCreateOrConnectWithoutRoom_invitesInput = {
    where: roomWhereUniqueInput
    create: XOR<roomUncheckedCreateWithoutRoom_invitesInput, roomCreateWithoutRoom_invitesInput>
  }

  export type userUpsertWithoutRoom_invitesInput = {
    update: XOR<userUncheckedUpdateWithoutRoom_invitesInput, userUpdateWithoutRoom_invitesInput>
    create: XOR<userUncheckedCreateWithoutRoom_invitesInput, userCreateWithoutRoom_invitesInput>
  }

  export type userUpdateWithoutRoom_invitesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    firebase_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: accountUpdateManyWithoutUserInput
    message?: messageUpdateManyWithoutUserInput
    room?: roomUpdateManyWithoutUserInput
    room_participants?: room_participantsUpdateManyWithoutUserInput
  }

  export type userUncheckedUpdateWithoutRoom_invitesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    firebase_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: accountUncheckedUpdateManyWithoutUserInput
    message?: messageUncheckedUpdateManyWithoutUserInput
    room?: roomUncheckedUpdateManyWithoutUserInput
    room_participants?: room_participantsUncheckedUpdateManyWithoutUserInput
  }

  export type roomUpsertWithoutRoom_invitesInput = {
    update: XOR<roomUncheckedUpdateWithoutRoom_invitesInput, roomUpdateWithoutRoom_invitesInput>
    create: XOR<roomUncheckedCreateWithoutRoom_invitesInput, roomCreateWithoutRoom_invitesInput>
  }

  export type roomUpdateWithoutRoom_invitesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    notification_job_id?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    finished_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: userUpdateOneRequiredWithoutRoomInput
    room_participants?: room_participantsUpdateManyWithoutRoomInput
    thread?: threadUpdateManyWithoutRoomInput
  }

  export type roomUncheckedUpdateWithoutRoom_invitesInput = {
    id?: StringFieldUpdateOperationsInput | string
    creator_id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    notification_job_id?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    finished_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    room_participants?: room_participantsUncheckedUpdateManyWithoutRoomInput
    thread?: threadUncheckedUpdateManyWithoutRoomInput
  }

  export type roomCreateWithoutRoom_participantsInput = {
    id?: string
    name?: string | null
    created_at?: Date | string
    deadline?: Date | string
    notification_job_id?: string | null
    summary?: string | null
    finished_at?: Date | string | null
    user: userCreateNestedOneWithoutRoomInput
    room_invites?: room_invitesCreateNestedManyWithoutRoomInput
    thread?: threadCreateNestedManyWithoutRoomInput
  }

  export type roomUncheckedCreateWithoutRoom_participantsInput = {
    id?: string
    creator_id: string
    name?: string | null
    created_at?: Date | string
    deadline?: Date | string
    notification_job_id?: string | null
    summary?: string | null
    finished_at?: Date | string | null
    room_invites?: room_invitesUncheckedCreateNestedManyWithoutRoomInput
    thread?: threadUncheckedCreateNestedManyWithoutRoomInput
  }

  export type roomCreateOrConnectWithoutRoom_participantsInput = {
    where: roomWhereUniqueInput
    create: XOR<roomUncheckedCreateWithoutRoom_participantsInput, roomCreateWithoutRoom_participantsInput>
  }

  export type userCreateWithoutRoom_participantsInput = {
    id?: string
    email?: string | null
    firebase_id?: string | null
    name?: string | null
    avatar_url?: string | null
    created_at?: Date | string
    account?: accountCreateNestedManyWithoutUserInput
    message?: messageCreateNestedManyWithoutUserInput
    room?: roomCreateNestedManyWithoutUserInput
    room_invites?: room_invitesCreateNestedManyWithoutUserInput
  }

  export type userUncheckedCreateWithoutRoom_participantsInput = {
    id?: string
    email?: string | null
    firebase_id?: string | null
    name?: string | null
    avatar_url?: string | null
    created_at?: Date | string
    account?: accountUncheckedCreateNestedManyWithoutUserInput
    message?: messageUncheckedCreateNestedManyWithoutUserInput
    room?: roomUncheckedCreateNestedManyWithoutUserInput
    room_invites?: room_invitesUncheckedCreateNestedManyWithoutUserInput
  }

  export type userCreateOrConnectWithoutRoom_participantsInput = {
    where: userWhereUniqueInput
    create: XOR<userUncheckedCreateWithoutRoom_participantsInput, userCreateWithoutRoom_participantsInput>
  }

  export type roomUpsertWithoutRoom_participantsInput = {
    update: XOR<roomUncheckedUpdateWithoutRoom_participantsInput, roomUpdateWithoutRoom_participantsInput>
    create: XOR<roomUncheckedCreateWithoutRoom_participantsInput, roomCreateWithoutRoom_participantsInput>
  }

  export type roomUpdateWithoutRoom_participantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    notification_job_id?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    finished_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: userUpdateOneRequiredWithoutRoomInput
    room_invites?: room_invitesUpdateManyWithoutRoomInput
    thread?: threadUpdateManyWithoutRoomInput
  }

  export type roomUncheckedUpdateWithoutRoom_participantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    creator_id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    notification_job_id?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    finished_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    room_invites?: room_invitesUncheckedUpdateManyWithoutRoomInput
    thread?: threadUncheckedUpdateManyWithoutRoomInput
  }

  export type userUpsertWithoutRoom_participantsInput = {
    update: XOR<userUncheckedUpdateWithoutRoom_participantsInput, userUpdateWithoutRoom_participantsInput>
    create: XOR<userUncheckedCreateWithoutRoom_participantsInput, userCreateWithoutRoom_participantsInput>
  }

  export type userUpdateWithoutRoom_participantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    firebase_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: accountUpdateManyWithoutUserInput
    message?: messageUpdateManyWithoutUserInput
    room?: roomUpdateManyWithoutUserInput
    room_invites?: room_invitesUpdateManyWithoutUserInput
  }

  export type userUncheckedUpdateWithoutRoom_participantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    firebase_id?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    account?: accountUncheckedUpdateManyWithoutUserInput
    message?: messageUncheckedUpdateManyWithoutUserInput
    room?: roomUncheckedUpdateManyWithoutUserInput
    room_invites?: room_invitesUncheckedUpdateManyWithoutUserInput
  }

  export type roomCreateWithoutThreadInput = {
    id?: string
    name?: string | null
    created_at?: Date | string
    deadline?: Date | string
    notification_job_id?: string | null
    summary?: string | null
    finished_at?: Date | string | null
    user: userCreateNestedOneWithoutRoomInput
    room_invites?: room_invitesCreateNestedManyWithoutRoomInput
    room_participants?: room_participantsCreateNestedManyWithoutRoomInput
  }

  export type roomUncheckedCreateWithoutThreadInput = {
    id?: string
    creator_id: string
    name?: string | null
    created_at?: Date | string
    deadline?: Date | string
    notification_job_id?: string | null
    summary?: string | null
    finished_at?: Date | string | null
    room_invites?: room_invitesUncheckedCreateNestedManyWithoutRoomInput
    room_participants?: room_participantsUncheckedCreateNestedManyWithoutRoomInput
  }

  export type roomCreateOrConnectWithoutThreadInput = {
    where: roomWhereUniqueInput
    create: XOR<roomUncheckedCreateWithoutThreadInput, roomCreateWithoutThreadInput>
  }

  export type messageCreateWithoutThreadInput = {
    created_at?: Date | string
    media_url?: string | null
    text?: string | null
    transcription?: string | null
    id?: string
    message_type: message_typeCreateNestedOneWithoutMessageInput
    user: userCreateNestedOneWithoutMessageInput
  }

  export type messageUncheckedCreateWithoutThreadInput = {
    user_id: string
    created_at?: Date | string
    type: string
    media_url?: string | null
    text?: string | null
    transcription?: string | null
    id?: string
  }

  export type messageCreateOrConnectWithoutThreadInput = {
    where: messageWhereUniqueInput
    create: XOR<messageUncheckedCreateWithoutThreadInput, messageCreateWithoutThreadInput>
  }

  export type roomUpsertWithoutThreadInput = {
    update: XOR<roomUncheckedUpdateWithoutThreadInput, roomUpdateWithoutThreadInput>
    create: XOR<roomUncheckedCreateWithoutThreadInput, roomCreateWithoutThreadInput>
  }

  export type roomUpdateWithoutThreadInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    notification_job_id?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    finished_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: userUpdateOneRequiredWithoutRoomInput
    room_invites?: room_invitesUpdateManyWithoutRoomInput
    room_participants?: room_participantsUpdateManyWithoutRoomInput
  }

  export type roomUncheckedUpdateWithoutThreadInput = {
    id?: StringFieldUpdateOperationsInput | string
    creator_id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    notification_job_id?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    finished_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    room_invites?: room_invitesUncheckedUpdateManyWithoutRoomInput
    room_participants?: room_participantsUncheckedUpdateManyWithoutRoomInput
  }

  export type messageUpsertWithWhereUniqueWithoutThreadInput = {
    where: messageWhereUniqueInput
    update: XOR<messageUncheckedUpdateWithoutThreadInput, messageUpdateWithoutThreadInput>
    create: XOR<messageUncheckedCreateWithoutThreadInput, messageCreateWithoutThreadInput>
  }

  export type messageUpdateWithWhereUniqueWithoutThreadInput = {
    where: messageWhereUniqueInput
    data: XOR<messageUncheckedUpdateWithoutThreadInput, messageUpdateWithoutThreadInput>
  }

  export type messageUpdateManyWithWhereWithoutThreadInput = {
    where: messageScalarWhereInput
    data: XOR<messageUncheckedUpdateManyWithoutMessageInput, messageUpdateManyMutationInput>
  }

  export type accountCreateWithoutUserInput = {
    id?: string
    created_at?: Date | string
    provider_id: string
    provider_type: string
    provider_account_id: string
    refresh_token?: string | null
    access_token?: string | null
    access_token_expires?: Date | string | null
    updated_at?: Date | string
  }

  export type accountUncheckedCreateWithoutUserInput = {
    id?: string
    created_at?: Date | string
    provider_id: string
    provider_type: string
    provider_account_id: string
    refresh_token?: string | null
    access_token?: string | null
    access_token_expires?: Date | string | null
    updated_at?: Date | string
  }

  export type accountCreateOrConnectWithoutUserInput = {
    where: accountWhereUniqueInput
    create: XOR<accountUncheckedCreateWithoutUserInput, accountCreateWithoutUserInput>
  }

  export type messageCreateWithoutUserInput = {
    created_at?: Date | string
    media_url?: string | null
    text?: string | null
    transcription?: string | null
    id?: string
    thread: threadCreateNestedOneWithoutMessageInput
    message_type: message_typeCreateNestedOneWithoutMessageInput
  }

  export type messageUncheckedCreateWithoutUserInput = {
    thread_id: string
    created_at?: Date | string
    type: string
    media_url?: string | null
    text?: string | null
    transcription?: string | null
    id?: string
  }

  export type messageCreateOrConnectWithoutUserInput = {
    where: messageWhereUniqueInput
    create: XOR<messageUncheckedCreateWithoutUserInput, messageCreateWithoutUserInput>
  }

  export type roomCreateWithoutUserInput = {
    id?: string
    name?: string | null
    created_at?: Date | string
    deadline?: Date | string
    notification_job_id?: string | null
    summary?: string | null
    finished_at?: Date | string | null
    room_invites?: room_invitesCreateNestedManyWithoutRoomInput
    room_participants?: room_participantsCreateNestedManyWithoutRoomInput
    thread?: threadCreateNestedManyWithoutRoomInput
  }

  export type roomUncheckedCreateWithoutUserInput = {
    id?: string
    name?: string | null
    created_at?: Date | string
    deadline?: Date | string
    notification_job_id?: string | null
    summary?: string | null
    finished_at?: Date | string | null
    room_invites?: room_invitesUncheckedCreateNestedManyWithoutRoomInput
    room_participants?: room_participantsUncheckedCreateNestedManyWithoutRoomInput
    thread?: threadUncheckedCreateNestedManyWithoutRoomInput
  }

  export type roomCreateOrConnectWithoutUserInput = {
    where: roomWhereUniqueInput
    create: XOR<roomUncheckedCreateWithoutUserInput, roomCreateWithoutUserInput>
  }

  export type room_invitesCreateWithoutUserInput = {
    id?: string
    code?: string
    email: string
    created_at?: Date | string
    used_at?: Date | string | null
    room: roomCreateNestedOneWithoutRoom_invitesInput
  }

  export type room_invitesUncheckedCreateWithoutUserInput = {
    id?: string
    room_id: string
    code?: string
    email: string
    created_at?: Date | string
    used_at?: Date | string | null
  }

  export type room_invitesCreateOrConnectWithoutUserInput = {
    where: room_invitesWhereUniqueInput
    create: XOR<room_invitesUncheckedCreateWithoutUserInput, room_invitesCreateWithoutUserInput>
  }

  export type room_participantsCreateWithoutUserInput = {
    room: roomCreateNestedOneWithoutRoom_participantsInput
  }

  export type room_participantsUncheckedCreateWithoutUserInput = {
    room_id: string
  }

  export type room_participantsCreateOrConnectWithoutUserInput = {
    where: room_participantsWhereUniqueInput
    create: XOR<room_participantsUncheckedCreateWithoutUserInput, room_participantsCreateWithoutUserInput>
  }

  export type accountUpsertWithWhereUniqueWithoutUserInput = {
    where: accountWhereUniqueInput
    update: XOR<accountUncheckedUpdateWithoutUserInput, accountUpdateWithoutUserInput>
    create: XOR<accountUncheckedCreateWithoutUserInput, accountCreateWithoutUserInput>
  }

  export type accountUpdateWithWhereUniqueWithoutUserInput = {
    where: accountWhereUniqueInput
    data: XOR<accountUncheckedUpdateWithoutUserInput, accountUpdateWithoutUserInput>
  }

  export type accountUpdateManyWithWhereWithoutUserInput = {
    where: accountScalarWhereInput
    data: XOR<accountUncheckedUpdateManyWithoutAccountInput, accountUpdateManyMutationInput>
  }

  export type accountScalarWhereInput = {
    AND?: Enumerable<accountScalarWhereInput>
    OR?: Enumerable<accountScalarWhereInput>
    NOT?: Enumerable<accountScalarWhereInput>
    id?: StringFilter | string
    created_at?: DateTimeFilter | Date | string
    user_id?: StringFilter | string
    provider_id?: StringFilter | string
    provider_type?: StringFilter | string
    provider_account_id?: StringFilter | string
    refresh_token?: StringNullableFilter | string | null
    access_token?: StringNullableFilter | string | null
    access_token_expires?: DateTimeNullableFilter | Date | string | null
    updated_at?: DateTimeFilter | Date | string
  }

  export type messageUpsertWithWhereUniqueWithoutUserInput = {
    where: messageWhereUniqueInput
    update: XOR<messageUncheckedUpdateWithoutUserInput, messageUpdateWithoutUserInput>
    create: XOR<messageUncheckedCreateWithoutUserInput, messageCreateWithoutUserInput>
  }

  export type messageUpdateWithWhereUniqueWithoutUserInput = {
    where: messageWhereUniqueInput
    data: XOR<messageUncheckedUpdateWithoutUserInput, messageUpdateWithoutUserInput>
  }

  export type messageUpdateManyWithWhereWithoutUserInput = {
    where: messageScalarWhereInput
    data: XOR<messageUncheckedUpdateManyWithoutMessageInput, messageUpdateManyMutationInput>
  }

  export type roomUpsertWithWhereUniqueWithoutUserInput = {
    where: roomWhereUniqueInput
    update: XOR<roomUncheckedUpdateWithoutUserInput, roomUpdateWithoutUserInput>
    create: XOR<roomUncheckedCreateWithoutUserInput, roomCreateWithoutUserInput>
  }

  export type roomUpdateWithWhereUniqueWithoutUserInput = {
    where: roomWhereUniqueInput
    data: XOR<roomUncheckedUpdateWithoutUserInput, roomUpdateWithoutUserInput>
  }

  export type roomUpdateManyWithWhereWithoutUserInput = {
    where: roomScalarWhereInput
    data: XOR<roomUncheckedUpdateManyWithoutRoomInput, roomUpdateManyMutationInput>
  }

  export type roomScalarWhereInput = {
    AND?: Enumerable<roomScalarWhereInput>
    OR?: Enumerable<roomScalarWhereInput>
    NOT?: Enumerable<roomScalarWhereInput>
    id?: StringFilter | string
    creator_id?: StringFilter | string
    name?: StringNullableFilter | string | null
    created_at?: DateTimeFilter | Date | string
    deadline?: DateTimeFilter | Date | string
    notification_job_id?: StringNullableFilter | string | null
    summary?: StringNullableFilter | string | null
    finished_at?: DateTimeNullableFilter | Date | string | null
  }

  export type room_invitesUpsertWithWhereUniqueWithoutUserInput = {
    where: room_invitesWhereUniqueInput
    update: XOR<room_invitesUncheckedUpdateWithoutUserInput, room_invitesUpdateWithoutUserInput>
    create: XOR<room_invitesUncheckedCreateWithoutUserInput, room_invitesCreateWithoutUserInput>
  }

  export type room_invitesUpdateWithWhereUniqueWithoutUserInput = {
    where: room_invitesWhereUniqueInput
    data: XOR<room_invitesUncheckedUpdateWithoutUserInput, room_invitesUpdateWithoutUserInput>
  }

  export type room_invitesUpdateManyWithWhereWithoutUserInput = {
    where: room_invitesScalarWhereInput
    data: XOR<room_invitesUncheckedUpdateManyWithoutRoom_invitesInput, room_invitesUpdateManyMutationInput>
  }

  export type room_participantsUpsertWithWhereUniqueWithoutUserInput = {
    where: room_participantsWhereUniqueInput
    update: XOR<room_participantsUncheckedUpdateWithoutUserInput, room_participantsUpdateWithoutUserInput>
    create: XOR<room_participantsUncheckedCreateWithoutUserInput, room_participantsCreateWithoutUserInput>
  }

  export type room_participantsUpdateWithWhereUniqueWithoutUserInput = {
    where: room_participantsWhereUniqueInput
    data: XOR<room_participantsUncheckedUpdateWithoutUserInput, room_participantsUpdateWithoutUserInput>
  }

  export type room_participantsUpdateManyWithWhereWithoutUserInput = {
    where: room_participantsScalarWhereInput
    data: XOR<room_participantsUncheckedUpdateManyWithoutRoom_participantsInput, room_participantsUpdateManyMutationInput>
  }

  export type messageUpdateWithoutMessage_typeInput = {
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    media_url?: NullableStringFieldUpdateOperationsInput | string | null
    text?: NullableStringFieldUpdateOperationsInput | string | null
    transcription?: NullableStringFieldUpdateOperationsInput | string | null
    id?: StringFieldUpdateOperationsInput | string
    thread?: threadUpdateOneRequiredWithoutMessageInput
    user?: userUpdateOneRequiredWithoutMessageInput
  }

  export type messageUncheckedUpdateWithoutMessage_typeInput = {
    thread_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    media_url?: NullableStringFieldUpdateOperationsInput | string | null
    text?: NullableStringFieldUpdateOperationsInput | string | null
    transcription?: NullableStringFieldUpdateOperationsInput | string | null
    id?: StringFieldUpdateOperationsInput | string
  }

  export type messageUncheckedUpdateManyWithoutMessageInput = {
    thread_id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    media_url?: NullableStringFieldUpdateOperationsInput | string | null
    text?: NullableStringFieldUpdateOperationsInput | string | null
    transcription?: NullableStringFieldUpdateOperationsInput | string | null
    id?: StringFieldUpdateOperationsInput | string
  }

  export type room_invitesUpdateWithoutRoomInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    used_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: userUpdateOneRequiredWithoutRoom_invitesInput
  }

  export type room_invitesUncheckedUpdateWithoutRoomInput = {
    id?: StringFieldUpdateOperationsInput | string
    inviter_id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    used_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type room_invitesUncheckedUpdateManyWithoutRoom_invitesInput = {
    id?: StringFieldUpdateOperationsInput | string
    inviter_id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    used_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type room_participantsUpdateWithoutRoomInput = {
    user?: userUpdateOneRequiredWithoutRoom_participantsInput
  }

  export type room_participantsUncheckedUpdateWithoutRoomInput = {
    user_id?: StringFieldUpdateOperationsInput | string
  }

  export type room_participantsUncheckedUpdateManyWithoutRoom_participantsInput = {
    user_id?: StringFieldUpdateOperationsInput | string
  }

  export type threadUpdateWithoutRoomInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    index?: StringFieldUpdateOperationsInput | string
    message?: messageUpdateManyWithoutThreadInput
  }

  export type threadUncheckedUpdateWithoutRoomInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    index?: StringFieldUpdateOperationsInput | string
    message?: messageUncheckedUpdateManyWithoutThreadInput
  }

  export type threadUncheckedUpdateManyWithoutThreadInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    index?: StringFieldUpdateOperationsInput | string
  }

  export type messageUpdateWithoutThreadInput = {
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    media_url?: NullableStringFieldUpdateOperationsInput | string | null
    text?: NullableStringFieldUpdateOperationsInput | string | null
    transcription?: NullableStringFieldUpdateOperationsInput | string | null
    id?: StringFieldUpdateOperationsInput | string
    message_type?: message_typeUpdateOneRequiredWithoutMessageInput
    user?: userUpdateOneRequiredWithoutMessageInput
  }

  export type messageUncheckedUpdateWithoutThreadInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    media_url?: NullableStringFieldUpdateOperationsInput | string | null
    text?: NullableStringFieldUpdateOperationsInput | string | null
    transcription?: NullableStringFieldUpdateOperationsInput | string | null
    id?: StringFieldUpdateOperationsInput | string
  }

  export type accountUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    provider_id?: StringFieldUpdateOperationsInput | string
    provider_type?: StringFieldUpdateOperationsInput | string
    provider_account_id?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token_expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type accountUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    provider_id?: StringFieldUpdateOperationsInput | string
    provider_type?: StringFieldUpdateOperationsInput | string
    provider_account_id?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token_expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type accountUncheckedUpdateManyWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    provider_id?: StringFieldUpdateOperationsInput | string
    provider_type?: StringFieldUpdateOperationsInput | string
    provider_account_id?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token_expires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type messageUpdateWithoutUserInput = {
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    media_url?: NullableStringFieldUpdateOperationsInput | string | null
    text?: NullableStringFieldUpdateOperationsInput | string | null
    transcription?: NullableStringFieldUpdateOperationsInput | string | null
    id?: StringFieldUpdateOperationsInput | string
    thread?: threadUpdateOneRequiredWithoutMessageInput
    message_type?: message_typeUpdateOneRequiredWithoutMessageInput
  }

  export type messageUncheckedUpdateWithoutUserInput = {
    thread_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: StringFieldUpdateOperationsInput | string
    media_url?: NullableStringFieldUpdateOperationsInput | string | null
    text?: NullableStringFieldUpdateOperationsInput | string | null
    transcription?: NullableStringFieldUpdateOperationsInput | string | null
    id?: StringFieldUpdateOperationsInput | string
  }

  export type roomUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    notification_job_id?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    finished_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    room_invites?: room_invitesUpdateManyWithoutRoomInput
    room_participants?: room_participantsUpdateManyWithoutRoomInput
    thread?: threadUpdateManyWithoutRoomInput
  }

  export type roomUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    notification_job_id?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    finished_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    room_invites?: room_invitesUncheckedUpdateManyWithoutRoomInput
    room_participants?: room_participantsUncheckedUpdateManyWithoutRoomInput
    thread?: threadUncheckedUpdateManyWithoutRoomInput
  }

  export type roomUncheckedUpdateManyWithoutRoomInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    deadline?: DateTimeFieldUpdateOperationsInput | Date | string
    notification_job_id?: NullableStringFieldUpdateOperationsInput | string | null
    summary?: NullableStringFieldUpdateOperationsInput | string | null
    finished_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type room_invitesUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    used_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    room?: roomUpdateOneRequiredWithoutRoom_invitesInput
  }

  export type room_invitesUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    room_id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    used_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type room_participantsUpdateWithoutUserInput = {
    room?: roomUpdateOneRequiredWithoutRoom_participantsInput
  }

  export type room_participantsUncheckedUpdateWithoutUserInput = {
    room_id?: StringFieldUpdateOperationsInput | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.DMMF.Document;
}