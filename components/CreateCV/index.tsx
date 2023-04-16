import {
  BodyGetOpenAiResult,
  LanguagesEnum,
  SEPARATION_CHARACTERS,
} from "@/pages/api/open-ai/cv";
import { Alert, Dialog, Snackbar, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import LoadingButton from "@mui/lab/LoadingButton";
import { useEffect, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { User } from "../../models/User";
import LoginCta from "./loginCta";

import LoadingScreen from "./loadingScreen";
import PageHeader from "../shared/header";
import { AlertColor } from "@mui/material/Alert";
import { useRouter } from "next/router";
import { createRecepie } from "@/lib/api/recipe";
import { useDispatch } from "react-redux";
import { showBuyMore } from "@/redux/features/common";

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

const saveRecepie = (result: string, shortLocale: string) => {
  const separatedRecepie = result.split(SEPARATION_CHARACTERS);
  if (separatedRecepie[0] && separatedRecepie[1] && separatedRecepie[2]) {
    createRecepie({
      title: separatedRecepie[0],
      ingredients: separatedRecepie[1],
      steps: separatedRecepie[2],
      type: "food",
      language: shortLocale === "es" ? "es" : "en",
    });
  }
};

const fetchUser = (): Promise<{ data: User[] }> =>
  fetch("api/user").then((res) => res.json());

const CreateCV = () => {
  const router = useRouter();

  const { data: userData, refetch } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    initialData: { data: [] },
  });

  const session = useSession();

  const { currentCV: currentCVQuery, jobDescription: jobDescriptionQuery } =
    router.query;

  const isAuthenticated = session?.status === "authenticated";

  const hasProFeatures = Boolean(
    isAuthenticated && userData?.data[0]?.subscriptionId
  );

  useEffect(() => {
    if (currentCVQuery && jobDescriptionQuery) {
      setCurrentCV(currentCVQuery as string);
      setJobDescription(jobDescriptionQuery as string);
    }
  }, [router.query]);

  const intl = useIntl();
  const shortLocale = intl.locale;

  const myRef = useRef(null);

  const dispatch = useDispatch();

  const [currentCV, setCurrentCV] = useState<string>("");
  const [jobDescription, setJobDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState(
    "error" as AlertColor
  );

  const [openAuthModal, setOpenAuthModal] = useState(false);

  const showError = (message: string) => {
    setSnackbarSeverity("error" as AlertColor);
    setSnackbarMessage(message);
    setOpenSnackBar(true);
  };

  const showMessage = (message: string) => {
    setSnackbarSeverity("info" as AlertColor);
    setSnackbarMessage(message);
    setOpenSnackBar(true);
  };

  const validateInputs = (): boolean => {
    if (currentCV === "") {
      showError("Fill Current CV");
      return false;
    }

    if (jobDescription === "") {
      showError("Not valid Job description");
      return false;
    }
    return true;
  };

  const fetchData = async (body: BodyGetOpenAiResult) => {
    // if (!isAuthenticated) {
    //   setOpenAuthModal(true);
    //   return;
    // }

    if (!validateInputs()) return;

    setResult("");
    // if (!userData?.data.length) return null;

    refetch();
    // TODO: Refactor this
    //@ts-ignore
    myRef.current.scrollIntoView();
    const response = await fetch("/api/open-ai/cv", {
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
    // fetchImage(prompt);
    saveRecepie(prompt, shortLocale);

    // fetchImage();
    setLoading(false);
  };

  useEffect(() => {
    if (!loading && result !== "") {
    }
  }, [loading]);

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
          title={<FormattedMessage id="title" defaultMessage="Recipies AI" />}
          subTitle={<FormattedMessage id="subtitle" defaultMessage=" AI" />}
        />
        {session?.status === "loading" ? (
          <LoadingScreen />
        ) : (
          <>
            <Dialog
              open={openAuthModal}
              onClose={() => setOpenAuthModal(false)}
              aria-labelledby="modal-sign-in"
              aria-describedby="modal-sign-in"
            >
              <LoginCta
                callbackUrl={`/?jobDescription=${jobDescription}&currentCV=${currentCV}`}
              />
            </Dialog>
            <Box sx={{ my: 4, width: "100%" }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                <FormattedMessage id="step1" defaultMessage="Recipies AI" />
              </Typography>
              <TextField
                sx={{ width: "100%" }}
                onChange={(e) => setCurrentCV(e.target.value)}
                id="outlined-basic"
                rows={20}
                multiline
                label="CV"
                variant="outlined"
              />
            </Box>

            <Box sx={{ my: 4, width: "100%" }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                <FormattedMessage id="step2" defaultMessage="Recipies AI" />
              </Typography>
              <TextField
                sx={{ width: "100%" }}
                rows={20}
                multiline
                onChange={(e) => setJobDescription(e.target.value)}
                id="outlined-basic"
                label="Description"
                variant="outlined"
              />
            </Box>

            <Box>
              <LoadingButton
                sx={{ mt: 5, width: "100%" }}
                onClick={() =>
                  fetchData({
                    currentCV,
                    jobDescription,
                    selectedLanguage: getLanguage(shortLocale),
                  })
                }
                disabled={loading}
                loading={loading}
                size="large"
                fullWidth
                variant="contained"
              >
                <FormattedMessage id="generateCV" />
              </LoadingButton>

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
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default CreateCV;
