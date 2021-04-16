import React, { ChangeEvent, InputHTMLAttributes, useEffect, useRef, useState } from "react";
import axios from "axios";

interface FileUploadParameters extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  updateFilesCb?: () => void;
  maxFileSizeInBytes?: number;
}

function useUploadFile() {
  const [progress, setProgress] = useState<number>(0);
  const [publicUrl, setPublicUrl] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);

  async function doUpload(file: File) {
    const { name, type } = file;

    setName(name);

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
      data: { publicUrl },
    } = await axios({
      method: "GET",
      url: `/api/backend/v1/attachments/${uuid}`,
    });

    setPublicUrl(publicUrl);
  }

  return { doUpload, progress, publicUrl, name };
}

export const FileUpload = ({ ...otherProps }: FileUploadParameters) => {
  const fileInputField = useRef(null);
  const [files, setFiles] = useState<FileList | []>([]); // should be an object when done properly
  const { doUpload, progress, publicUrl, name } = useUploadFile();

  const handleNewFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    console.log(files);

    if (files) {
      setFiles(files);
    }
  };

  useEffect(() => {
    for (const file of files) {
      doUpload(file);
    }
  }, [files]);

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

  if (!publicUrl) {
    return <span>Uploading: {progress}%</span>;
  }

  if (publicUrl) {
    return (
      <img
        src={publicUrl}
        height={100}
        alt={name || "Attachment"}
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
