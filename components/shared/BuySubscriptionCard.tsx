import {
  Button,
  Card,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { FormattedMessage } from "react-intl";
import InfoModalCard from "./InfoModalCard";
import getStripe from "@/utils/get-stripe";
import { useSession } from "next-auth/react";
import LoginCta from "../CreateCV/loginCta";
import { useState } from "react";
import { Box } from "@mui/system";
import CheckIcon from "@mui/icons-material/Check";
import { useDispatch } from "react-redux";
import { hideBuyMore } from "@/redux/features/common";
export const redirectToStripe = async () => {
  const response = await fetch("/api/stripe/checkout_sessions");
  if (response.status !== 200) {
    console.error(response.status);
    return;
  }
  const data = await response.json();

  const stripe = await getStripe();
  const { error } = await stripe!.redirectToCheckout({
    sessionId: data.data.id,
  });
};

const proFeatures = [
  <FormattedMessage
    key="proFeature1"
    id="proFeature1"
    defaultMessage="Recipies AI"
  />,
  <FormattedMessage
    key="proFeature1"
    id="proFeature2"
    defaultMessage="Recipies AI"
  />,
  <FormattedMessage
    key="proFeature1"
    id="proFeature3"
    defaultMessage="Recipies AI"
  />,
  <FormattedMessage
    key="proFeature1"
    id="proFeature5"
    defaultMessage="Recipies AI"
  />,
  <FormattedMessage
    key="proFeature1"
    id="proFeature4"
    defaultMessage="Recipies AI"
  />,
];

const freeFeatures = [
  <FormattedMessage
    key="freeFeature"
    id="freeFeature"
    defaultMessage="Recipies AI"
  />,
];
const FeaturesList = ({ list }: { list: JSX.Element[] }) => {
  return (
    <Box sx={{ p: 2, mt: 4 }}>
      <Box>
        {list.map((feature, i) => (
          <Box key={i} sx={{ display: "flex" }}>
            <CheckIcon sx={{ mr: 2, color: "#80ed9d" }} />
            <Typography variant="h6" sx={{ color: "white" }} textAlign="left">
              {feature}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const BuySubscriptionCard = () => {
  const session = useSession();
  const [alignment, setAlignment] = useState<string | null>("pro");
  const dispatch = useDispatch();

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null
  ) => {
    setAlignment(newAlignment);
  };

  if (session.status === "loading") return null;

  if (session.status === "unauthenticated") return <LoginCta />;

  const handleCloseModal = () => {
    dispatch(hideBuyMore());
  };

  return (
    <InfoModalCard>
      <Typography
        color="white"
        sx={{
          mt: 2,
          whiteSpace: "pre-line",
          textAlign: "left",
          fontWeight: 700,
        }}
        variant="h5"
        component="h1"
      >
        <FormattedMessage id="ranOutOfCredits" defaultMessage="Recipies AI" />
      </Typography>
      <ToggleButtonGroup
        sx={{ mt: 4, backgroundColor: "white" }}
        value={alignment}
        color="standard"
        exclusive
        onChange={handleAlignment}
        aria-label="text alignment"
      >
        <ToggleButton value="free" aria-label="centered">
          Free
        </ToggleButton>
        <ToggleButton value="pro" aria-label="centered">
          Pro
        </ToggleButton>
      </ToggleButtonGroup>

      <FeaturesList list={alignment === "pro" ? proFeatures : freeFeatures} />

      {alignment === "pro" ? (
        <Button
          fullWidth
          sx={{ mt: 6, color: "black", backgroundColor: "white" }}
          variant="contained"
          onClick={() => redirectToStripe()}
        >
          <FormattedMessage id="buyTokensCTA" />
        </Button>
      ) : (
        <Button
          fullWidth
          sx={{ mt: 6, color: "black", backgroundColor: "white" }}
          variant="contained"
          onClick={() => handleCloseModal()}
        >
          <FormattedMessage id="stayInFree" />
        </Button>
      )}
    </InfoModalCard>
  );
};

export default BuySubscriptionCard;
