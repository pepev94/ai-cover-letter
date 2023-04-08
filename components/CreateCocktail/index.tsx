import {
  Alert,
  Button,
  Dialog,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import LoadingButton from "@mui/lab/LoadingButton";
import { useEffect, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { User } from "../../models/User";
import { LanguagesEnum } from "@/utils/createRecepie";
import LoadingScreen from "./loadingScreen";
import ExtraActions from "./extraActions";
import BuyTokensCta from "../shared/BuyTokensCta";
import PageHeader from "../shared/header";
import CocktailDetails from "./cocktailDetails";
import {
  StyleOfCocktailButtonsEn,
  StyleOfCocktailButtonsEs,
  TypeOfCocktailButtonsEn,
  TypeOfCocktailButtonsEs,
} from "@/utils/createCocktail";
import { BodyGetOpenAiCocktailResult } from "@/pages/api/open-ai/cocktail";
import { AlertColor } from "@mui/material/Alert";
import LoginCta from "../CreateRecipie/loginCta";
import { useRouter } from "next/router";
import { SEPARATION_CHARACTERS } from "@/pages/api/open-ai/food";
import { createRecepie } from "@/lib/api/recipe";
import { fetchUser } from "@/utils/fetchers";
import { showBuyMore } from "@/redux/features/common";
import { useDispatch } from "react-redux";

const getButtonsLanguage = (shortLocale: string) => {
  switch (shortLocale) {
    case "es":
      return TypeOfCocktailButtonsEs;
    case "en":
      return TypeOfCocktailButtonsEn;
    default:
      return TypeOfCocktailButtonsEs;
  }
};

const getButtonsStyleLanguage = (shortLocale: string) => {
  switch (shortLocale) {
    case "es":
      return StyleOfCocktailButtonsEs;
    case "en":
      return StyleOfCocktailButtonsEn;
    default:
      return StyleOfCocktailButtonsEs;
  }
};

export const getLanguage = (shortLocale: string) => {
  switch (shortLocale) {
    case "es":
      return LanguagesEnum.es;
    case "en":
      return LanguagesEnum.en;
    default:
      return LanguagesEnum.es;
  }
};

const saveCocktail = (result: string, shortLocale: string) => {
  const separatedRecepie = result.split(SEPARATION_CHARACTERS);
  if (separatedRecepie[0] && separatedRecepie[1] && separatedRecepie[2]) {
    createRecepie({
      title: separatedRecepie[0],
      ingredients: separatedRecepie[1],
      steps: separatedRecepie[2],
      type: "cocktail",
      language: shortLocale === "es" ? "es" : "en",
    });
  }
};

const CreateCocktail = () => {
  const router = useRouter();

  const { data: userData, refetch } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    initialData: { data: [] },
  });

  const {
    cocktailType: cocktailTypeQuery,
    cocktailStyle: cocktailStyleQuery,
    cocktailMainIngredients: cocktailMainIngredientsQuery,
    cocktailSecondaryIngredients: cocktailSecondaryIngredientsQuery,
  } = router.query;

  useEffect(() => {
    if (
      cocktailTypeQuery &&
      cocktailStyleQuery &&
      cocktailMainIngredientsQuery &&
      cocktailSecondaryIngredientsQuery
    ) {
      setCocktailType(cocktailTypeQuery as string);
      setCocktailStyle(cocktailStyleQuery as string);
      setCocktailMainIngredients(cocktailMainIngredientsQuery as string);
      setCocktailSecondaryIngredients(
        cocktailSecondaryIngredientsQuery as string
      );
    }
  }, [router.query]);

  const session = useSession();

  const dispatch = useDispatch();

  const hasProFeatures = Boolean(
    session?.status === "authenticated" && userData?.data[0]?.subscriptionId
  );

  const isAuthenticated = session?.status === "authenticated";

  const intl = useIntl();

  const myRef = useRef(null);

  const shortLocale = intl.locale;
  const cocktailTypeButtons = getButtonsLanguage(shortLocale);
  const cocktailStyleButtons = getButtonsStyleLanguage(shortLocale);

  const [cocktailType, setCocktailType] = useState(
    TypeOfCocktailButtonsEn[0]?.value
  );
  const [cocktailStyle, setCocktailStyle] = useState(
    StyleOfCocktailButtonsEn[0]?.value
  );
  const [cocktailMainIngredients, setCocktailMainIngredients] =
    useState<string>("");
  const [cocktailSecondaryIngredients, setCocktailSecondaryIngredients] =
    useState<string>("");

  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [showBuyMoreCta, setShowBuyMoreCta] = useState(false);

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");
  const [result, setResult] = useState("");

  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState(
    "error" as AlertColor
  );

  const showError = (message: string) => {
    setSnackbarSeverity("error" as AlertColor);
    setSnackbarMessage(message);
    setOpenSnackBar(true);
  };

  const validateInputs = (body: BodyGetOpenAiCocktailResult): boolean => {
    if (body.cocktailMainIngredients.length === 0) {
      showError("Select 1 liquor");
      return false;
    }

    if (body.cocktailSecondaryIngredients.length === 0) {
      showError("Select 1 secondary ingredient");
      return false;
    }
    return true;
  };

  // const fetchImage = async (prompt: string) => {
  //   setImage("");
  //   if (userData?.data[0].availableTokens === 0) {
  //     setShowBuyMoreCta(true);
  //     return;
  //   }
  //   if (userData?.data.length) {
  //     const response = await getDalle2Image(prompt);
  //     setImage(response);
  //   }
  //   setLoading(false);
  // };

  const fetchData = async (body: BodyGetOpenAiCocktailResult) => {
    if (!isAuthenticated) {
      setOpenAuthModal(true);
      return;
    }
    if (!validateInputs(body)) return;
    // if (!userData?.data[0]?.subscriptionId) {
    //   setShowBuyMoreCta(true);
    //   return;
    // }
    if (userData?.data.length) {
      refetch();
      // TODO: Refactor this
      //@ts-ignore
      myRef.current.scrollIntoView();
      const response = await fetch("/api/open-ai/cocktail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...body }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = response.body;
      if (!data) {
        return;
      }
      const reader = data.getReader();
      const decoder = new TextDecoder();
      let done = false;

      let prompt = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        setResult((prev) => prev + chunkValue);
        prompt = prompt + chunkValue;
      }
      saveCocktail(prompt, shortLocale);
      // fetchImage(prompt);
    }
    // fetchImage();
    setLoading(false);
  };

  if (session?.status === "loading") return <LoadingScreen />;

  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Snackbar
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackBar(false)}
      >
        <Alert
          onClose={() => setOpenSnackBar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Box
        sx={{
          borderRadius: 4,
          p: 2,
          mx: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          mb: 4,
          maxWidth: "900px",
        }}
      >
        <PageHeader
          title={
            <FormattedMessage id="cocktailTitle" defaultMessage="Recipies AI" />
          }
          subTitle={
            <FormattedMessage id="cocktailSubtitle" defaultMessage="d AI" />
          }
        />

        <Dialog
          open={openAuthModal}
          onClose={() => setOpenAuthModal(false)}
          aria-labelledby="modal-sign-in"
          aria-describedby="modal-sign-in"
        >
          <LoginCta
            callbackUrl={`/cocktails?cocktailType=${cocktailType}&cocktailStyle=${cocktailStyle}&cocktailMainIngredients=${cocktailMainIngredients}&cocktailSecondaryIngredients=${cocktailSecondaryIngredients}`}
          />
        </Dialog>
        <Box>
          <CocktailDetails
            hasProFeatures={hasProFeatures}
            cocktailType={cocktailType}
            setCocktailType={setCocktailType}
            cocktailStyle={cocktailStyle}
            setCocktailStyle={setCocktailStyle}
            cocktailMainIngredients={cocktailMainIngredients}
            setCocktailMainIngredients={setCocktailMainIngredients}
            cocktailSecondaryIngredients={cocktailSecondaryIngredients}
            setCocktailSecondaryIngredients={setCocktailSecondaryIngredients}
            cocktailTypeButtons={cocktailTypeButtons}
            cocktailStyleButtons={cocktailStyleButtons}
          />

          <LoadingButton
            sx={{ mt: 5 }}
            onClick={() => {
              setResult("");
              setImage("");
              fetchData({
                cocktailType,
                cocktailStyle,
                cocktailMainIngredients,
                cocktailSecondaryIngredients,
                selectedLanguage: getLanguage(shortLocale),
              });
            }}
            disabled={loading}
            loading={loading}
            size="large"
            fullWidth
            variant="contained"
          >
            <FormattedMessage id="generateCocktail" />
          </LoadingButton>

          <ExtraActions result={result} setResult={setResult} />
          <Typography
            ref={myRef}
            sx={{
              whiteSpace: "pre-line",
              textAlign: "left",
              mt: 2,
              maxWidth: "600px",
            }}
          >
            {result}
          </Typography>

          <Button
            color="secondary"
            sx={{ my: 2 }}
            variant="contained"
            fullWidth
            onClick={() => {
              if (!hasProFeatures) {
                dispatch(showBuyMore());
                return;
              }
              router.push("/recepies");
            }}
          >
            <FormattedMessage id="seeAllRecipes" />
          </Button>
          {image !== "" && (
            <Box
              component="img"
              sx={{
                mt: 2,
                height: 300,
              }}
              alt="The house from the offer."
              src={image}
            />
          )}
          {userData?.data && !userData?.data[0]?.subscriptionId && (
            <BuyTokensCta />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CreateCocktail;
