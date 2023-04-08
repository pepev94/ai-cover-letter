import { Recepie } from "@/models/Recepie";
import { Card, Divider, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useQuery } from "@tanstack/react-query";
import LoadingScreen from "../CreateCocktail/loadingScreen";
import { TypographyWithGradient } from "../shared/header";

const fetchRecepies = (id: string): Promise<{ data: Recepie[] }> =>
  fetch(`/api/recipe/${id}`).then((res) => res.json());

const RecipiePage = ({ id }: { id: string }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["recipe", id],
    queryFn: () => fetchRecepies(id),
    initialData: { data: [] },
  });

  console.log(id);

  if (data.data.length === 0 || isLoading) return <LoadingScreen />;
  const recepie = data.data[0];
  return (
    <Box sx={{ my: 6, mx: 3, display: "flex", justifyContent: "center" }}>
      <Card elevation={10} sx={{ maxWidth: "900px", p: 5, borderRadius: 4 }}>
        <Typography sx={{ mb: 1 }} variant="body1" color="text.secondary">
          {recepie.type}
        </Typography>
        <TypographyWithGradient variant="h3">
          {recepie.title}
        </TypographyWithGradient>
        <Divider sx={{ mt: 4 }} />
        <Typography variant="h5" sx={{ whiteSpace: "pre-line" }}>
          {recepie.ingredients}
        </Typography>

        <Typography variant="body1" sx={{ whiteSpace: "pre-line", mt: 3 }}>
          {recepie.steps}
        </Typography>
      </Card>
    </Box>
  );
};

export default RecipiePage;
