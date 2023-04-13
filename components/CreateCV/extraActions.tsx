import { Button } from "@mui/material";
import { Box } from "@mui/system";
import { FormattedMessage } from "react-intl";
import ClearIcon from "@mui/icons-material/Clear";
import ShareIcon from "@mui/icons-material/Share";

type Props = {
  result: string;
  setResult: any;
  showMessage: any;
};

const ExtraActions = ({ result, setResult, showMessage }: Props) => {
  return (
    <Box sx={{ display: "flex", my: 2, width: "100%", gap: 2 }}>
      <Button
        startIcon={<ClearIcon />}
        color="secondary"
        fullWidth
        variant="outlined"
        onClick={() => setResult("")}
      >
        <FormattedMessage id="erase" />
      </Button>
      <Button
        fullWidth
        color="secondary"
        onClick={() => {
          showMessage();
          navigator.clipboard.writeText(
            `${result} ${(<FormattedMessage id="shareCTA" />)}`
          );
        }}
        variant="outlined"
        startIcon={<ShareIcon />}
      >
        <FormattedMessage id="share" />
      </Button>
    </Box>
  );
};

export default ExtraActions;
