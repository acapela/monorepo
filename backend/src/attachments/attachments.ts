import path from "path";
import { Request, Response, Router } from "express";
import { v4 as uuid } from "uuid";
import { GetSignedUrlConfig, Storage } from "@google-cloud/storage";

import { db } from "~db";
import logger from "~shared/logger";

import { extractToken } from "../authentication";
import { AuthenticationError } from "../errors";

export const router = Router();

const bucketName = `meetnomoreapp.appspot.com`;
const directory = "acapela/attachments/";

// Creates signed link and writes attachment to the DB
router.post("/v1/attachments", async (req: Request, res: Response) => {
  const { name, type } = req.body;
  const id = uuid();

  if (!type) {
    return res.status(400).send("File type is not provided");
  }

  try {
    const storage = new Storage();

    const filePath = `${directory}${id}`;
    // TODO: make as small as possible
    const mins = 0.5; // 30 seconds should be enough

    const options: GetSignedUrlConfig = {
      version: "v4",
      action: "write",
      expires: Date.now() + 60 * 1000 * mins,
      contentType: type,
      virtualHostedStyle: true,
    };

    const [uploadUrl] = await storage.bucket(bucketName).file(filePath).getSignedUrl(options);

    await db.attachment.create({
      data: {
        id: id,
        original_name: name,
      },
    });

    res.status(200).json({ uploadUrl, uuid: id });
  } catch (err) {
    logger.error("Failed to create signed link for attachment write", {
      message: err.message,
      stack: err.stack,
    });
    return res.status(500).send(err.message);
  }
});

// Gets read link
router.get("/v1/attachments/:uuid", async (req: Request, res: Response) => {
  const { uuid } = req.params;

  if (!uuid) {
    return res.status(400).send("UUID is not provided");
  }

  try {
    const storage = new Storage({
      keyFilename: path.resolve(__dirname, "..", "..", "meetnomoreapp-26b862628558.json"),
    });

    const filePath = `${directory}${uuid}`;
    const mins = 0.5; // 30 seconds should be enough

    const options: GetSignedUrlConfig = {
      version: "v4",
      action: "read",
      expires: Date.now() + 60 * 1000 * mins,
      virtualHostedStyle: true,
    };

    const [publicUrl] = await storage.bucket(bucketName).file(filePath).getSignedUrl(options);

    const attachment = await db.attachment.findUnique({
      where: {
        id: uuid,
      },
    });

    res.status(200).json({ publicUrl, attachment });
  } catch (err) {
    logger.error("Failed to create signed link for attachment read", {
      message: err.message,
      stack: err.stack,
    });
    return res.status(500).send(err.message);
  }
});

// TODO: enable
function middlewareAuthenticateHasura(req: Request, _: Response, next: () => unknown) {
  const token = extractToken(req.get("Authorization") || "");

  if (!token) {
    throw new AuthenticationError("Hasura action call done with invalid secret");
  }

  if (token !== process.env.HASURA_ACTION_SECRET) {
    throw new AuthenticationError("Hasura action call done with invalid secret");
  }
  next();
}
