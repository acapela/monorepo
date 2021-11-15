import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const backendRes = await axios.get(`${process.env.BACKEND_HOST}/healthz`);
  res.send({
    status: "ok",
    stage: process.env.STAGE,
    version: process.env.SENTRY_RELEASE || "dev",
    backend: backendRes.data,
  });
}
