import React, { ChangeEvent, InputHTMLAttributes, useEffect, useRef, useState } from "react";
import axios from "axios";
import { AttachmentDetailedInfoFragment } from "~frontend/gql";

interface FileUploadParameters extends InputHTMLAttributes<HTMLInputElement> {
  onFileAttached: (attachment: AttachmentDetailedInfoFragment) => void;
}

function useUploadFile() {
  const [progress, setProgress] = useState<number>(0);
  const [publicUrl, setPublicUrl] = useState<string | null>(null);
  const [attachment, setAttachment] = useState<AttachmentDetailedInfoFragment>();

  async function doUpload(file: File) {
    const { name, type: mimeType } = file;

    const {
      data: { uploadUrl, uuid },
    } = await axios({
      method: "POST",
      url: "/api/backend/v1/attachments",
      headers: {
        // Authentication: `Bearer ${process.env.HASURA_API_SECRET}`
      },
      data: { name, mimeType },
    });

    await axios({
      method: "PUT",
      url: decodeURIComponent(uploadUrl),
      headers: {
        "Content-Type": mimeType,
      },
      data: file,
      onUploadProgress: (e) => setProgress(Math.round((e.loaded * 100) / e.total)),
    });

    const {
      data: { publicUrl, attachment },
    } = await axios({
      method: "GET",
      url: `/api/backend/v1/attachments/${uuid}`,
    });

    // TODO: Merge?
    setPublicUrl(publicUrl);
    setAttachment(attachment);
  }

  return { doUpload, progress, publicUrl, attachment };
}

export const FileUpload = ({ onFileAttached, ...otherProps }: FileUploadParameters) => {
  const fileInputField = useRef(null);
  const [files, setFiles] = useState<FileList | []>([]); // should be an object when done properly
  const { doUpload, progress, publicUrl, attachment } = useUploadFile();

  const handleNewFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (files) {
      setFiles(files);
    }
  };

  useEffect(() => {
    for (const file of files) {
      doUpload(file);
    }
  }, [files]);

  useEffect(() => {
    if (attachment) {
      onFileAttached(attachment);
    }
  }, [attachment]);

  if (!files.length) {
    return (
      <input
        type="file"
        ref={fileInputField}
        onChange={handleNewFileUpload}
        title=""
        defaultValue=""
        multiple={false} /* simplified for the MVP */
        {...otherProps}
      />
    );
  }

  if (!attachment) {
    return <span>Uploading: {progress}%</span>;
  }

  if (attachment && publicUrl) {
    const type = attachment.mimeType.split("/")[0].toLowerCase();

    if (type === "image") {
      return (
        <img
          src={publicUrl}
          height={100}
          alt={attachment.originalName || "Attachment"}
          style={{
            display: "inline-block",
            maxWidth: "none",
            height: "100px",
          }}
        />
      );
    }

    return (
      <div>
        {type}:&nbsp;{attachment.originalName}
      </div>
    );
  }

  return null;
};
