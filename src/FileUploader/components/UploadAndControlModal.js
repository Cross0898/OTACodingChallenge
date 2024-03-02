import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, Input, Button } from "@mui/material";

const UploadAndControlModal = ({
  open,
  onClose,
  onFileChange,
  onUnzip,
  onPause,
  onContinue,
  onShowProcessedFiles,
  progress,
  pauseButtonDisabled,
  continueButtonDisabled,
}) => {
  const [unzipStarted, setUnzipStarted] = useState(false);

  useEffect(() => {
    setUnzipStarted(false);
  }, []);

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="upload-modal-title">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography id="upload-modal-title" variant="h6" component="h2">
          Upload and Control
        </Typography>
        <Input
          type="file"
          accept=".zip"
          onChange={onFileChange}
          sx={{ mb: 1 }}
        />
        <Box sx={{ "& button": { m: 1 } }}>
          <Button
            variant="contained"
            onClick={() => {
              onUnzip();
              setUnzipStarted(true);
            }}
          >
            Unzip
          </Button>
          {unzipStarted && progress < 100 && (
            <>
              <Button
                variant="outlined"
                onClick={pauseButtonDisabled ? onContinue : onPause}
                disabled={pauseButtonDisabled && continueButtonDisabled}
              >
                {pauseButtonDisabled ? "Continue" : "Pause"}
              </Button>
            </>
          )}
          <Button variant="outlined" onClick={onShowProcessedFiles}>
            Show Processed Files
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default UploadAndControlModal;
