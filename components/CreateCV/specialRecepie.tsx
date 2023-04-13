import { SpecialRecepieObj } from "@/pages/api/open-ai/cv";
import { showBuyMore } from "@/redux/features/common";
import { useAppDispatch } from "@/redux/hooks";
import {
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { FormattedMessage } from "react-intl";

type Props = {
  hasProFeatures: boolean;
  setSpecialRecipe: any;
  value: string;
};

const SpecialRecipe = ({ setSpecialRecipe, hasProFeatures, value }: Props) => {
  const dispatch = useAppDispatch();

  const handleSelectedSpecialRecipe = (value: string) => {
    if (!hasProFeatures) {
      dispatch(showBuyMore());
      return;
    }
    setSpecialRecipe(value);
  };
  return (
    <Box
      sx={{
        mt: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
        p: 2,
      }}
    >
      <Typography sx={{ fontWeight: 700 }} variant="h5" component="h3">
        <FormattedMessage id="recipieFinalStep" />
      </Typography>

      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">
          Special Diet? (keto, paleo, etc...)
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          defaultValue={SpecialRecepieObj.none}
          label="Special Diet"
          onChange={(e) => handleSelectedSpecialRecipe(e.target.value)}
        >
          {Object.keys(SpecialRecepieObj).map((key) => (
            <MenuItem key={key} value={key}>
              {/* @ts-ignore */}
              {SpecialRecepieObj[key]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
export default SpecialRecipe;
