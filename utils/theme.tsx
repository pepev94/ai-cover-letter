import { colord } from "colord";
import { createTheme } from "@mui/material/styles";

// this typography/color palette can be accessed directly
// by any mui component
export const MuiTheme = createTheme({
  palette: {
    primary: {
      main: colord("#EB1245").toHex(),
    },
    secondary: {
      main: colord("#EC6314").toHex(),
    },
  },
});
