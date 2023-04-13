import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { useSession, signOut } from "next-auth/react";
import { FormattedMessage } from "react-intl";
import { styled } from "@mui/material/styles";
import Link from "next/link";
import Image from "next/image";
import logo from "assets/logo2Blanco.png";
import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "@/utils/fetchers";
import { Menu, MenuItem, Typography } from "@mui/material";
import LanguageMenu from "../LanguageMenu";

const AppBarWithTheme = styled(AppBar)(({ theme }) => ({
  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
}));

export default function NavBar({
  setSelectedLanguage,
}: {
  setSelectedLanguage: any;
}) {
  const session = useSession();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { data: userData, refetch } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    initialData: { data: [] },
  });

  const cancelSubscription = async () => {
    const response = await fetch("/api/stripe/checkout_sessions", {
      method: "DELETE",
    });
    alert("Canceled");
    refetch();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBarWithTheme position="static">
        <Toolbar>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Box
              onClick={(e) =>
                handleClick(e as unknown as React.MouseEvent<HTMLButtonElement>)
              }
            >
              <Typography sx={{ fontWeight: 700 }}>Cover Letter AI</Typography>
              {/* <Image src={logo} alt="Logo" width={30} /> */}
            </Box>
            <Box>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem onClick={handleClose}>
                  <Link
                    style={{ textDecoration: "none", color: "black" }}
                    href="/"
                  >
                    <FormattedMessage id="Home" />
                  </Link>
                </MenuItem>

                {session?.status === "authenticated" && (
                  <>
                    <MenuItem
                      onClick={() => {
                        signOut();
                        handleClose();
                      }}
                    >
                      <FormattedMessage id="signOut" />
                    </MenuItem>
                  </>
                )}

                {session?.status === "authenticated" &&
                  userData.data[0]?.subscriptionId !== null && (
                    <>
                      <MenuItem
                        onClick={() => {
                          cancelSubscription();
                          handleClose();
                        }}
                        sx={{ color: "black" }}
                      >
                        <FormattedMessage id="cancelSubscription" />
                      </MenuItem>
                    </>
                  )}
              </Menu>
            </Box>
            <LanguageMenu setSelectedLanguage={setSelectedLanguage} />
          </Box>
        </Toolbar>
      </AppBarWithTheme>
    </Box>
  );
}
