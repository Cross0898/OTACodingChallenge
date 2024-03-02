import React, { useState, useEffect } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Box, Typography, Grid } from "@mui/material";
import { styled } from "@mui/system";

import ProcessedFilesModal from "./components/ProcessedFilesModal";
import CustomSnackbar from "./components/CustomSnackbar";
import UploadAndUnzipModal from "./components/UploadAndUnzipModal";

import dashboardArt from "../static/dashboardArt.PNG";

const CenteredBox = styled(Box)({
  width: "100%",
  margin: "auto",
  textAlign: "center",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
});

const FileUploader = () => {
  const [zipFile, setZipFile] = useState(null);
  const [processedFiles, setProcessedFiles] = useState([]);
  const [isPaused, setPaused] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [showProcessedFilesModal, setShowProcessedFilesModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastSeverity, setToastSeverity] = useState("");
  const [currentProcessedFile, setCurrentProcessedFile] = useState("");
  const [pauseButtonDisabled, setPauseButtonDisabled] = useState(true);
  const [continueButtonDisabled, setContinueButtonDisabled] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const day = currentDate.toLocaleDateString(undefined, { weekday: "long" });
  const date = currentDate.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setZipFile(file);
    resetProgress();
    setProcessedFiles([]);
  };

  const handleToggleUploadModal = () => {
    setShowUploadModal(!showUploadModal);
    resetProgress();
  };

  const resetProgress = () => {
    setShowProgressBar(false);
    setProgress(0);
  };

  const handleUnzip = async () => {
    if (!zipFile) {
      handleOpenToast(true, "Please select a file first.", "error");
      return;
    }

    if (!zipFile.name.toLowerCase().endsWith(".zip")) {
      handleOpenToast(true, "Please select a valid zip file.", "error");
      return;
    }

    try {
      setPauseButtonDisabled(false);
      setContinueButtonDisabled(true);
      setShowProcessedFilesModal(true);
      setShowProgressBar(true);
      const zip = new JSZip();
      const fileData = await zipFile.arrayBuffer();
      const zipInstance = await zip.loadAsync(fileData);
      const files = Object.keys(zipInstance.files);
      const totalFiles = files.length;

      setProgress(0);

      for (let index = 0; index < totalFiles; index++) {
        if (isPaused) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          continue;
        }

        const filename = files[index];
        setCurrentProcessedFile(filename);

        const file = zipInstance.file(filename);

        if (file) {
          try {
            const fileData = await file.async("blob");
            const newFileName = `${filename}`;
            const fileSize = fileData.size;
            setProcessedFiles((prevFiles) => [
              ...prevFiles,
              { name: newFileName, size: fileSize },
            ]);

            const currentProgress = ((index + 1) / totalFiles) * 100;
            setProgress(currentProgress);

            if (index === totalFiles - 1) {
              setCurrentProcessedFile("");
              handleOpenToast(true, "Extract Successful", "success");
            }
          } catch (err) {
            console.error("Error unzipping the file:", err);
            setError(err.message);
            setCurrentProcessedFile("");
            handleOpenToast(true, error, "error");
          }
        }
      }
    } catch (err) {
      console.error("Error during the unzip process:", err);
      setError(err.message);
      setCurrentProcessedFile("");
      handleOpenToast(true, error, "error");
    }
  };

  const handleDownload = (fileName) => {
    if (fileName) {
      const fileData = "Content of the specific file";
      const blob = new Blob([fileData]);
      saveAs(blob, fileName);
    }
  };

  const handlePause = () => {
    setPaused(true);
    setPauseButtonDisabled(true);
    setContinueButtonDisabled(false);
  };

  const handleContinue = () => {
    setPaused(false);
    setPauseButtonDisabled(false);
    setContinueButtonDisabled(true);
  };

  const handleShowProcessedFiles = () => {
    setShowProcessedFilesModal(true);
  };

  const handleOpenToast = (status, message, severity) => {
    setShowToast(status);
    setToastMessage(message);
    setToastSeverity(severity);
    setTimeout(() => {
      setShowToast(false);
      setToastMessage("");
      setToastSeverity("");
    }, 3000);
  };

  return (
    <React.Fragment>
      <UploadAndUnzipModal
        open={showUploadModal}
        onClose={handleToggleUploadModal}
        onFileChange={handleFileChange}
        onUnzip={handleUnzip}
        onPause={handlePause}
        onContinue={handleContinue}
        onShowProcessedFiles={handleShowProcessedFiles}
        pauseButtonDisabled={pauseButtonDisabled}
        continueButtonDisabled={continueButtonDisabled}
      />

      <ProcessedFilesModal
        open={showProcessedFilesModal}
        onClose={() => setShowProcessedFilesModal(false)}
        processedFiles={processedFiles}
        currentProcessedFile={currentProcessedFile}
        handleDownload={handleDownload}
        showProgressBar={showProgressBar}
        progress={progress}
      />

      <CustomSnackbar
        open={showToast}
        message={toastMessage}
        severity={toastSeverity}
      />
      <CenteredBox>
        <Typography
          variant="h1"
          fontWeight="bold"
          color={"#284B63"}
          sx={{ marginBottom: 5 }}
        >
          UNZIP!
        </Typography>
        <Grid
          container
          spacing={55}
          sx={{ justifyContent: "center", marginBottom: 5 }}
        >
          <Grid item>
            <Typography variant="body2" fontWeight="bolder">
              Extract files swiftly
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{ cursor: "pointer" }}
              onClick={handleToggleUploadModal}
            >
              CLICK HERE TO START UNNZIPPING!
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" fontWeight="bold">
              {`${day} ${date}`}
            </Typography>
          </Grid>
        </Grid>
        <Box>
          <img src={dashboardArt} alt="dashboardArt" />
        </Box>
      </CenteredBox>
    </React.Fragment>
  );
};

export default FileUploader;
