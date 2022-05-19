/* eslint-disable @typescript-eslint/no-explicit-any */
import { IncomingHttpHeaders } from "http";

import { linear } from "./linear";

export interface Service {
  readonly name: string;
  verifyBody?: (rawBody: string, body: any, headers: IncomingHttpHeaders) => Promise<void>;
  processBody?: (body: any) => Promise<any>;
}

const allServices = [linear] as readonly Service[];
export const services: ReadonlyMap<string, Service> = new Map(allServices.map((s) => [s.name, s]));
