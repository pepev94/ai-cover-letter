import { showBuyMore } from "@/redux/features/common";
import { useAppDispatch } from "@/redux/hooks";
import { Typography, Grid, Box, TextField } from "@mui/material";
import { FormattedMessage } from "react-intl";

type Props = {
  cocktailType: string;
  setCocktailType: any;
  cocktailStyle: string;
  setCocktailStyle: any;
  cocktailMainIngredients: string;
  setCocktailMainIngredients: any;
  cocktailSecondaryIngredients: string;
  setCocktailSecondaryIngredients: any;
  cocktailTypeButtons: {
    icon: string;
    label: string;
    value: string;
    color: string;
    isProFeature?: boolean;
  }[];
  cocktailStyleButtons: {
    icon: string;
    label: string;
    value: string;
    color: string;
    isProFeature?: boolean;
  }[];
  hasProFeatures: boolean;
};

const CocktailDetails = ({
  cocktailType,
  setCocktailType,
  cocktailTypeButtons,
  cocktailStyleButtons,
  cocktailStyle,
  setCocktailStyle,
  cocktailMainIngredients,
  setCocktailMainIngredients,
  cocktailSecondaryIngredients,
  setCocktailSecondaryIngredients,
  hasProFeatures,
}: Props) => {
  const dispatch = useAppDispatch();

  const handleSelectedCocktailType = (
    value: string,
    isProFeature?: boolean
  ) => {
    if (isProFeature && !hasProFeatures) {
      dispatch(showBuyMore());
      return;
    }
    setCocktailType(value);
  };

  const handleSelectedCocktailStyle = (
    value: string,
    isProFeature?: boolean
  ) => {
    if (isProFeature && !hasProFeatures) {
      dispatch(showBuyMore());
      return;
    }
    setCocktailStyle(value);
  };
  return (
    <Box
      sx={{
        mt: 5,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
        maxWidth: "600px",
        px: 1,
      }}
    >
      <Grid
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        container
      >
        {cocktailTypeButtons.map((button) => {
          return (
            <Grid key={button.value} item>
              <Box
                sx={{
                  opacity: !hasProFeatures && button.isProFeature ? "0.4" : 1,
                }}
                onClick={() =>
                  handleSelectedCocktailType(button.value, button.isProFeature)
                }
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    sx={{
                      backgroundColor: button.color,
                      borderRadius: 4,
                      width: "100px",
                      height: "100px",
                      border:
                        cocktailType === button.value
                          ? "5px solid #EB1245"
                          : "none",
                      p: 2,
                      fontSize: 40,
                    }}
                  >
                    {button.icon}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    mt: 1,
                    color:
                      cocktailType === button.value ? "primary.main" : "none",
                  }}
                >
                  {button.label}
                </Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>

      <Typography sx={{ fontWeight: 700, mt: 4 }} variant="h5" component="h3">
        <FormattedMessage id="cocktailStyleHeader" />
      </Typography>
      <Grid
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        container
      >
        {cocktailStyleButtons.map((button) => {
          return (
            <Grid key={button.value} item>
              <Box
                sx={{
                  opacity: !hasProFeatures && button.isProFeature ? "0.4" : 1,
                }}
                onClick={() =>
                  handleSelectedCocktailStyle(button.value, button.isProFeature)
                }
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    sx={{
                      backgroundColor: button.color,
                      borderRadius: 4,
                      width: "100px",
                      height: "100px",
                      border:
                        cocktailStyle === button.value
                          ? "5px solid #EB1245"
                          : "none",
                      p: 2,
                      fontSize: 40,
                    }}
                  >
                    {button.icon}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    mt: 1,
                    color:
                      cocktailStyle === button.value ? "primary.main" : "none",
                  }}
                >
                  {button.label}
                </Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>

      <Typography variant="h5" component="h3">
        <FormattedMessage id="cocktailMainIngredientsHeader" />
      </Typography>
      <TextField
        value={cocktailMainIngredients}
        onChange={(e) => setCocktailMainIngredients(e.target.value)}
      />

      <Typography variant="h5" component="h3">
        <FormattedMessage id="cocktailSecondaryIngredientsHeader" />
      </Typography>
      <TextField
        value={cocktailSecondaryIngredients}
        onChange={(e) => setCocktailSecondaryIngredients(e.target.value)}
      />
    </Box>
  );
};

export default CocktailDetails;
