import React from "react";
import ReactDOM from "react-dom";
import FileUploader from "./FileUploader/FileUploader.js";
import { ThemeProvider } from "@mui/system";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    success: {
      main: "#4CAF50",
    },
    error: {
      main: "#FF0000",
    },
  },
});

const App = () => {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <FileUploader />
      </ThemeProvider>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
