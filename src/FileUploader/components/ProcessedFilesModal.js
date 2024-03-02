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
import FileCopyIcon from "@mui/icons-material/FileCopy";
import CloseIcon from "@mui/icons-material/Close";

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
}) => {
  const modalContentRef = useRef(null);

  useEffect(() => {
    if (modalContentRef.current) {
      modalContentRef.current.scrollTop = modalContentRef.current.scrollHeight;
    }
  }, [currentProcessedFile]);

  return (
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
          height: 440,
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
                      <FileCopyIcon /> {file}
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => handleDownload(file)}>
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
            <LinearProgress variant="determinate" value={progress} />
          </Box>
        )}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={pauseButtonDisabled ? onContinue : onPause}
            disabled={pauseButtonDisabled && continueButtonDisabled}
            display={
              processedFiles.length === 0 || Math.trunc(progress) === 100
                ? "none"
                : ""
            }
          >
            {pauseButtonDisabled ? "Continue" : "Pause"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ProcessedFilesModal;
