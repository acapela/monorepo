import { createChannelBridge, createInvokeBridge } from "./base/channels";

/**
 * This is an example how bridges are defined
 */

/**
 * This is invoke bridge - it is imported by client to be able te send requests.
 * It is imported by electron to add handler that is able to handle requests.
 */
export const getFoo = createInvokeBridge<string, string>("foo");

/**
 * This is channel bridge - can be imported by both electron and client, allowing both to subscribe or send messages
 */
export const pingPongChannel = createChannelBridge<string>("ping-pong");
