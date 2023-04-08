import { Button } from "@mui/material";
import { Box } from "@mui/system";
type Props = {
  setSelectedLanguage: any;
};
const LanguageMenu = ({ setSelectedLanguage }: Props) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 2,
        color: "white",
      }}
    >
      <Button
        sx={{ color: "white", border: "1px solid white" }}
        onClick={() => setSelectedLanguage("en")}
        variant="outlined"
      >
        🇺🇸 English
      </Button>
      <Button
        sx={{ color: "white", border: "1px solid white" }}
        onClick={() => setSelectedLanguage("es")}
        variant="outlined"
      >
        🇪🇸 Español
      </Button>
    </Box>
  );
};

export default LanguageMenu;
