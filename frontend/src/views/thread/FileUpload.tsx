import React, { ChangeEvent, InputHTMLAttributes, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Attachment } from "~frontend/gql";

interface FileUploadParameters extends InputHTMLAttributes<HTMLInputElement> {
  onFileAttached: (attachment: Attachment) => void;
}

function useUploadFile() {
  const [progress, setProgress] = useState<number>(0);
  const [publicUrl, setPublicUrl] = useState<string | null>(null);
  const [attachment, setAttachment] = useState<Attachment>();

  async function doUpload(file: File) {
    const { name, type } = file;

    const {
      data: { uploadUrl, uuid },
    } = await axios({
      method: "POST",
      url: "/api/backend/v1/attachments",
      headers: {
        // Authentication: `Bearer ${process.env.HASURA_API_SECRET}`
      },
      data: { name, type },
    });

    await axios({
      method: "PUT",
      url: decodeURIComponent(uploadUrl),
      headers: {
        "Content-Type": type,
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
    return (
      <img
        src={publicUrl}
        height={100}
        alt={attachment.original_name || "Attachment"}
        style={{
          display: "inline-block",
          maxWidth: "none",
          height: "100px",
        }}
      />
    );
  }

  return null;
};
