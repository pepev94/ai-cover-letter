import { Box } from "@mui/system";
import { Oval } from "react-loader-spinner";

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
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
  );
};

export default LoadingScreen;
