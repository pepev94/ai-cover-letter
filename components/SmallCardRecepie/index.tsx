import { Recepie } from "@/models/Recepie";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";

const SmallCardRecepie = ({ recipe }: { recipe: Recepie }) => {
  const router = useRouter();

  return (
    <Card
      elevation={10}
      sx={{
        borderRadius: 2,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
      }}
    >
      <CardActionArea
        onClick={() => router.push(`/recipe/${recipe._id}`)}
        sx={{ minHeight: 150 }}
      >
        <CardContent>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {recipe.type}
          </Typography>
          <Typography variant="h5" component="div">
            {recipe.title}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {recipe.createdAt?.toString()}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default SmallCardRecepie;
