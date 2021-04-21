import React, { ChangeEvent, InputHTMLAttributes, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useGetAttachmentQuery, useGetUploadUrlQuery } from "~frontend/gql";
import { MessageAttachment } from "~frontend/views/thread/Message/MessageAttachment";

interface FileUploadParameters extends InputHTMLAttributes<HTMLInputElement> {
  onFileAttached: ({ uuid, mimeType }: { uuid: string; mimeType: string }) => void;
}

function useUploadFile() {
  const [progress, setProgress] = useState<number>(0);
  const [file, setFile] = useState<File>();
  const [uuid, setUuid] = useState<string>();
  const [uploaded, setUploaded] = useState<boolean>(false);
  const { name: fileName, type: mimeType } = file || ({} as File);
  const { data } = useGetUploadUrlQuery({
    variables: {
      fileName,
      mimeType,
    },
  });

  useEffect(() => {
    // TODO: prettier prop name?
    const uploadUrl = data?.get_upload_url?.uploadUrl;
    const uuid = data?.get_upload_url?.uuid;

    setUuid(uuid);

    if (uploadUrl) {
      axios({
        method: "PUT",
        url: decodeURIComponent(uploadUrl),
        headers: {
          "Content-Type": mimeType,
        },
        data: file,
        onUploadProgress: (e) => setProgress(Math.round((e.loaded * 100) / e.total)),
      }).then(() => setUploaded(true));
    }
  }, [data]);

  return { setFile, progress, uuid, mimeType, uploaded };
}

const AttachmentPreview = ({ id }: { id: string }) => {
  const { data } = useGetAttachmentQuery({ variables: { id } });

  if (data?.attachment) {
    return <MessageAttachment attachment={data.attachment} />;
  }

  return null;
};

export const FileUpload = ({ onFileAttached, ...otherProps }: FileUploadParameters) => {
  const fileInputField = useRef(null);
  const [files, setFiles] = useState<FileList | []>([]); // should be an object when done properly
  const { setFile, progress, uuid, mimeType, uploaded } = useUploadFile();

  const handleNewFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (files) {
      setFiles(files);
    }
  };

  useEffect(() => {
    for (const file of files) {
      setFile(file);
    }
  }, [files]);

  useEffect(() => {
    if (uploaded && uuid && mimeType) {
      onFileAttached({ uuid, mimeType });
    }
  }, [uploaded, uuid, mimeType]);

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

  if (!uploaded) {
    return <span>Uploading: {progress}%</span>;
  }

  if (uploaded && uuid) {
    return <AttachmentPreview id={uuid} />;
  }

  return null;
};
