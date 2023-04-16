import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

type Props = {
  title: any;
  subTitle: any;
};

export const TypographyWithGradient = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  backgroundImage: "-webkit-linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}));

const PageHeader = ({ title, subTitle }: Props) => {
  return (
    <>
      <TypographyWithGradient
        sx={{
          mt: 2,
        }}
        variant="h3"
        //@ts-ignore
        component="h1"
      >
        {title}
      </TypographyWithGradient>
      <Typography component="h2" variant="h5" sx={{ mt: 4, fontWeight: 700 }}>
        {subTitle}
      </Typography>
    </>
  );
};

export default PageHeader;
