import { Box } from "@mui/material";
import Link from "next/link";

const Contact = () => {
  return (
    <Box
      sx={{
        width: "100%",
        my: 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box>
        Contact: <Link href="mailto:inaki@aifoodie.co">inaki@aifoodie.co</Link>
      </Box>
    </Box>
  );
};

export default Contact;
