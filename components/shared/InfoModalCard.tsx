import { Card } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ReactNode } from "react";

const CardWithGradient = styled(Card)(({ theme }) => ({
  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
}));

type Props = {
  children: ReactNode;
};

const InfoModalCard = ({ children }: Props) => {
  return (
    <CardWithGradient
      elevation={12}
      sx={{
        py: 5,
        px: 5,
        width: "100%",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
      }}
    >
      {children}
    </CardWithGradient>
  );
};

export default InfoModalCard;
