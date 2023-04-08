import { Button, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { signIn } from "next-auth/react";
import InfoModalCard from "../shared/InfoModalCard";

type Props = {
  callbackUrl?: string;
};

const LoginCta = ({ callbackUrl }: Props) => {
  return (
    <InfoModalCard>
      <Typography color="white" sx={{ mt: 2 }} variant="h4" component="h1">
        <FormattedMessage id="title" defaultMessage="Recipies AI" />
      </Typography>
      {/* <Typography sx={{ mt: 2 }} color="white" variant="h5" component="h2">
        <FormattedMessage
          id="subtitle"
          defaultMessage="Create you own recipies powered by AI"
        />
      </Typography> */}
      <Typography sx={{ mt: 3 }} color="white" variant="h5" component="h2">
        <FormattedMessage id="signInCTA" />
      </Typography>
      <Button
        fullWidth
        sx={{ mt: 2, color: "black", backgroundColor: "white" }}
        variant="contained"
        onClick={() =>
          signIn(undefined, { callbackUrl: callbackUrl ? callbackUrl : "/" })
        }
      >
        <FormattedMessage id="signIn" />
      </Button>
    </InfoModalCard>
  );
};

export default LoginCta;
