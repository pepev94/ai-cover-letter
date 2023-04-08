import { Box, Dialog } from "@mui/material";
import BuySubscriptionCard from "./BuySubscriptionCard";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { hideBuyMore } from "@/redux/features/common";

const BuySubscription = () => {
  const openModal = useAppSelector((state) => state.common.showBuyMore);
  const dispatch = useAppDispatch();

  const handleCloseModal = () => {
    dispatch(hideBuyMore());
  };

  return (
    <Box>
      <Dialog
        open={openModal}
        onClose={() => handleCloseModal()}
        aria-labelledby="modal-buy-credits"
        aria-describedby="modal-bur-credits"
      >
        <BuySubscriptionCard />
      </Dialog>
    </Box>
  );
};

export default BuySubscription;
