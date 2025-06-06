import {createTheme} from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#318ded",
      light: "#6bafff",
      dark: "#006eba",
      contrastText: "#ffffff",
    },
    customColor: {
      primaryColor: "#318ded", 
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