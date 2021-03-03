
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal
} = require('./runtime/index-browser')


const Prisma = {}

exports.Prisma = Prisma

/**
 * Prisma Client JS version: 2.17.0
 * Query Engine version: 3c463ebd78b1d21d8fdacdd27899e280cf686223
 */
Prisma.prismaVersion = {
  client: "2.17.0",
  engine: "3c463ebd78b1d21d8fdacdd27899e280cf686223"
}

Prisma.PrismaClientKnownRequestError = () => {
  throw new Error(`PrismaClientKnownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  throw new Error(`PrismaClientUnknownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientRustPanicError = () => {
  throw new Error(`PrismaClientRustPanicError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientInitializationError = () => {
  throw new Error(`PrismaClientInitializationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientValidationError = () => {
  throw new Error(`PrismaClientValidationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */

Prisma.sql = () => {
  throw new Error(`sqltag is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.empty = () => {
  throw new Error(`empty is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.join = () => {
  throw new Error(`join is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.raw = () => {
  throw new Error(`raw is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.validator = () => (val) => val

/**
 * Enums
 */
// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275
function makeEnum(x) { return x; }

exports.Prisma.AccountScalarFieldEnum = makeEnum({
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
});

exports.Prisma.MessageScalarFieldEnum = makeEnum({
  thread_id: 'thread_id',
  user_id: 'user_id',
  created_at: 'created_at',
  type: 'type',
  media_url: 'media_url',
  text: 'text',
  transcription: 'transcription',
  id: 'id'
});

exports.Prisma.Message_typeScalarFieldEnum = makeEnum({
  value: 'value'
});

exports.Prisma.RoomScalarFieldEnum = makeEnum({
  id: 'id',
  creator_id: 'creator_id',
  name: 'name',
  created_at: 'created_at',
  deadline: 'deadline',
  notification_job_id: 'notification_job_id',
  summary: 'summary',
  finished_at: 'finished_at'
});

exports.Prisma.Room_invitesScalarFieldEnum = makeEnum({
  id: 'id',
  room_id: 'room_id',
  inviter_id: 'inviter_id',
  code: 'code',
  email: 'email',
  created_at: 'created_at',
  used_at: 'used_at'
});

exports.Prisma.Room_participantsScalarFieldEnum = makeEnum({
  room_id: 'room_id',
  user_id: 'user_id'
});

exports.Prisma.ThreadScalarFieldEnum = makeEnum({
  id: 'id',
  room_id: 'room_id',
  name: 'name',
  index: 'index'
});

exports.Prisma.UserScalarFieldEnum = makeEnum({
  id: 'id',
  email: 'email',
  name: 'name',
  avatar_url: 'avatar_url',
  created_at: 'created_at'
});

exports.Prisma.SortOrder = makeEnum({
  asc: 'asc',
  desc: 'desc'
});

exports.Prisma.QueryMode = makeEnum({
  default: 'default',
  insensitive: 'insensitive'
});


exports.Prisma.ModelName = makeEnum({
  account: 'account',
  message: 'message',
  message_type: 'message_type',
  room: 'room',
  room_invites: 'room_invites',
  room_participants: 'room_participants',
  thread: 'thread',
  user: 'user'
});

/**
 * Create the Client
 */
class PrismaClient {
  constructor() {
    throw new Error(
      `PrismaClient is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma-client-js/issues`,
    )
  }
}
exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
