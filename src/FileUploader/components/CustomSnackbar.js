import React from "react";
import { Snackbar, SnackbarContent } from "@mui/material";
import { styled } from "@mui/system";

const StyledSnackbarContent = styled(SnackbarContent)(
  ({ theme, severity }) => ({
    backgroundColor:
      severity === "success"
        ? theme.palette.success.main
        : theme.palette.error.main,
  })
);

const CustomSnackbar = ({ open, message, severity }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <StyledSnackbarContent message={message} severity={severity} />
    </Snackbar>
  );
};

export default CustomSnackbar;
