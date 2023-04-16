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
        Contact:{" "}
        <Link href="mailto:vdr.pepe94@gmail.com">vdr.pepe94@gmail.com</Link>
      </Box>
    </Box>
  );
};

export default Contact;
