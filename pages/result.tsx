import { NextPage } from "next";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Box } from "@mui/system";
import { Button, Card, Typography } from "@mui/material";
import { Oval } from "react-loader-spinner";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

const fetchGetJSON = async (url: string) => {
  try {
    const data = await fetch(url).then((res) => res.json());
    return data;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    throw err;
  }
};

const ResultPage: NextPage = () => {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch CheckoutSession from static page via
  // https://nextjs.org/docs/basic-features/data-fetching#static-generation
  const { data, error } = useSWR(
    router.query.session_id
      ? `/api/stripe/checkout_sessions/${router.query.session_id}`
      : null,
    fetchGetJSON
  );

  const validateAndSaveTokens = async () => {
    const response = await fetch("/api/user/validate-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        stripeToken: data.subscriptionId,
      }),
    });
    if (response.status === 201) {
      setSuccess(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (data) {
      validateAndSaveTokens();
    }
  }, [data]);

  if (error) return <div>failed to load</div>;

  //data?.payment_intent?.status === "succeeded"

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100ch",
      }}
    >
      <Card sx={{ width: "90%", p: 5, textAlign: "center" }}>
        {!loading ? (
          <>
            <Typography sx={{ mb: 2 }} variant="h5">
              {success ? <FormattedMessage id="addedCredits" /> : "Error"}
            </Typography>
            <Button
              fullWidth
              variant="contained"
              onClick={() => router.push("/")}
            >
              <FormattedMessage id="backToHome" />
            </Button>
          </>
        ) : (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Oval
              height={80}
              width={80}
              color="#EB1245"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              ariaLabel="oval-loading"
              secondaryColor="#EC6314"
              strokeWidth={2}
              strokeWidthSecondary={2}
            />
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default ResultPage;
