import React, { useEffect, useRef } from "react";
import SimpleBarReact from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import {
  Box,
  Modal,
  Typography,
  Button,
  IconButton,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloseIcon from "@mui/icons-material/Close";

const theme = createTheme({
  palette: {
    customColorLess: {
      main: "#FB923C",
    },
    customColorMore: {
      main: "#159D72",
    },
  },
});

const ProcessedFilesModal = ({
  open,
  onClose,
  processedFiles,
  currentProcessedFile,
  handleDownload,
  showProgressBar,
  progress,
  pauseButtonDisabled,
  continueButtonDisabled,
  onPause,
  onContinue,
  extractionComplete,
}) => {
  const modalContentRef = useRef(null);

  useEffect(() => {
    if (modalContentRef.current) {
      modalContentRef.current.scrollTop = modalContentRef.current.scrollHeight;
    }
    console.log(processedFiles);
  }, [currentProcessedFile, processedFiles]);

  const formatFileSize = (size) => {
    if (size === undefined) {
      return "N/A";
    }

    const units = ["B", "KB", "MB", "GB", "TB"];
    let i = 0;
    while (size >= 1024 && i < units.length - 1) {
      size /= 1024;
      i++;
    }
    return `${size.toFixed(2)}${units[i]}`;
  };
  console.log(Math.trunc(progress));
  return (
    <ThemeProvider theme={theme}>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            width: 800,
            height: 450,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 2,
              alignItems: "center",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Processed Files
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <SimpleBarReact style={{ maxHeight: 300 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>File</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {processedFiles.map((file, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <InsertDriveFileIcon /> {file.name} (
                        {formatFileSize(file.size)})
                      </TableCell>
                      <TableCell>
                        <Button onClick={() => handleDownload(file.name)}>
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </SimpleBarReact>
          {showProgressBar && (
            <Box sx={{ width: "100%", mt: 2 }}>
              <Typography id="upload-modal-title" variant="caption">
                Progress: {Math.trunc(progress)}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={progress}
                color={
                  Math.trunc(progress) === 100
                    ? "customColorMore"
                    : "customColorLess"
                }
              />

              <Typography id="upload-modal-title" variant="caption">
                {currentProcessedFile}
              </Typography>
            </Box>
          )}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            {!extractionComplete ? (
              <Button
                variant="contained"
                color="primary"
                onClick={pauseButtonDisabled ? onContinue : onPause}
                disabled={pauseButtonDisabled && continueButtonDisabled}
              >
                {pauseButtonDisabled ? "Continue" : "Pause"}
              </Button>
            ) : null}
          </Box>
        </Box>
      </Modal>
    </ThemeProvider>
  );
};

export default ProcessedFilesModal;
