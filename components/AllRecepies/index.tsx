import { Recepie } from "@/models/Recepie";
import { Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useQuery } from "@tanstack/react-query";
import { FormattedMessage } from "react-intl";
import { TypographyWithGradient } from "../shared/header";
import SmallCardRecepie from "../SmallCardRecepie";

const fetchRecepies = (): Promise<{ data: Recepie[] }> =>
  fetch(`/api/recipe`).then((res) => res.json());

const AllRecepies = () => {
  const { data } = useQuery({
    queryKey: ["recipe"],
    queryFn: () => fetchRecepies(),
    initialData: { data: [] },
  });

  if (!data.data) return null;

  return (
    <Box sx={{ my: 6 }}>
      <TypographyWithGradient align="center" variant="h3">
        <FormattedMessage id="yourRecepiesPage" />
      </TypographyWithGradient>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Box
          sx={{
            maxWidth: "900px",
            px: 2,
            py: 4,
          }}
        >
          <Grid
            spacing={2}
            container
            direction="row"
            justifyContent={{ xs: "center", md: "flex-start" }}
            alignItems="flex-start"
          >
            {data.data.map((recipe) => (
              <Grid
                key={recipe._id}
                sx={{ width: { md: 285, xs: "100%" } }}
                item
              >
                <SmallCardRecepie recipe={recipe} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default AllRecepies;
