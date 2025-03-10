import React, { useState } from "react";
import PageLayout from "./PageLayout";
import { Button } from "../components";
import userController from "../controllers/user.controller";

const ProfilePage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUploadClick = async () => {
    if (selectedFile) {
      await userController.uploadImage(selectedFile);
      // Optionally, handle the response or update the state
    } else {
      console.error("No file selected");
    }
  };

  return (
    <PageLayout>
      <div>Profile</div>
      <input type="file" onChange={handleFileChange} />
      <Button label="Upload" onClick={handleUploadClick} />
    </PageLayout>
  );
};

export default ProfilePage;
