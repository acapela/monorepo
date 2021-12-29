import axios, { AxiosError } from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let backendRes = { status: "error" };
  try {
    backendRes = (await axios.get(`${process.env.BACKEND_HOST}/healthz`)).data;
  } catch (e) {
    console.error((e as AxiosError).toString());
  }

  res.send({
    status: "ok",
    stage: process.env.STAGE,
    version: process.env.SENTRY_RELEASE || "dev",
    backend: backendRes,
  });
}
