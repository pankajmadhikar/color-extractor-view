import React, { useState, useCallback } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useDropzone } from "react-dropzone";
import { styled } from "@mui/material/styles";

const DropzoneContainer = styled("div")({
  border: "2px dashed #ccc",
  borderRadius: 4,
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
  "&:hover": {
    borderColor: "#999",
  },
});

const ImagePreview = styled("img")({
  maxWidth: "100%",
  maxHeight: "200px",
});

const FileList = styled("ul")({
  listStyle: "none",
  padding: 0,
  margin: 0,
});

const FileListItem = styled("li")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 10,
});

const FileProgress = styled(LinearProgress)({
  width: "100%",
});

const UploadButton = styled(Button)({
  marginTop: 20,
});

function UploadFileUi({ handleFileChange }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    setSelectedFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({ onDrop });

  const handleRemoveImage = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  const handleUpload = () => {
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          // Assuming successful upload, move files to uploadedFiles
          setUploadedFiles(selectedFiles);
          setSelectedFiles([]);
          return 100;
        }
        return prevProgress + 10;
      });
    }, 100);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}>
      <Box sx={{ width: "100%", maxWidth: 400 }}>
        <Typography variant="h6" align="center" gutterBottom>
          Simple Upload File
        </Typography>
        <DropzoneContainer {...getRootProps()}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : isDragReject ? (
            <p>You can't drop these files here ...</p>
          ) : (
            <p>Drag 'n' drop some files here, or click to select files</p>
          )}
        </DropzoneContainer>
        <FileList>
          {selectedFiles.map((file, index) => (
            <FileListItem key={index}>
              {file.name}
              {/* Optional: Progress bar */}
              <FileProgress variant="determinate" value={uploadProgress} />
              <Button
                size="small"
                color="error"
                onClick={() => handleRemoveImage(index)}>
                Remove
              </Button>
            </FileListItem>
          ))}
        </FileList>
        <LinearProgress variant="determinate" value={uploadProgress} />
        <UploadButton
          variant="contained"
          onClick={handleFileChange}
          disabled={selectedFiles.length === 0}>
          Upload Files
        </UploadButton>
        <Typography variant="h6" align="center" gutterBottom>
          Uploaded Files
        </Typography>
        <FileList>
          {uploadedFiles.map((file, index) => (
            <FileListItem key={index}>{file.name}</FileListItem>
          ))}
        </FileList>
      </Box>
    </Box>
  );
}

export default UploadFileUi;
