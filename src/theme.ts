import {createTheme} from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#000000",
    },
    customColor: {
      primaryColor: "#0A8DEE",
      secondaryColor: "#ff4081",
      dangerColor: "#ff6666",
      borderRadius: "8px",
    },
  },
  typography: {
    fontFamily: " 'Be Vietnam Pro', sans-serif",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
    },
  },
} as any);

export default theme;
