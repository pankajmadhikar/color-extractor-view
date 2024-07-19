import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import Navbar from "./components/Navabr";
import UploadFileUi from "./components/UploadFileUi";
import { Typography } from "@mui/material";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [colors, setColors] = useState([]);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setError("");
    setColors([]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/images/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setColors(response.data.colors);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error);
      } else {
        setError("An error occurred while uploading the file.");
      }
    }
  };

  return (
    <div className="App">
      <Navbar />
      <UploadFileUi handleFileChange={handleFileChange} />
      <h1>Upload Image and Extract Colors</h1>
      <Typography variant="h6" align="center" gutterBottom>
        Simple Upload File
      </Typography>
      <div className="input-container">
        <input type="file" onChange={handleFileChange} />
      </div>

      <button onClick={handleUpload}>Upload</button>
      {error && <div className="error">{error}</div>}
      <div>
        {colors.map((color, index) => (
          <div
            key={index}
            style={{ backgroundColor: color, padding: "10px", margin: "10px" }}>
            {color}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
