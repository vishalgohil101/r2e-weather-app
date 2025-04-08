import React from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchBar from "../components/SearchBar";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useAppTheme } from "../context/ThemeContext";

interface Props {
  isSm: boolean;
  onSearch: (city: string) => void;
  onAddCity: (city: any) => void;
  lastUpdated: string | null;
  onRefresh: () => void;
  showRefresh: boolean;
}

const Header: React.FC<Props> = ({
  isSm,
  onSearch,
  onAddCity,
  lastUpdated,
  onRefresh,
  showRefresh,
}) => {
  const { toggleMode, mode } = useAppTheme();
  return (
    <Box
      display="flex"
      flexDirection={isSm ? "column" : "row"}
      width={isSm ? "100%" : "auto"}
      alignItems={isSm ? "" : "center"}
      gap={isSm ? 1 : 2}
      p={isSm ? 1 : 2}
      flexWrap="wrap"
      sx={{
        borderBottom:
          mode === "light" ? "1px solid #f5f5f5" : "1px solid #050505",
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(12px)",
      }}
    >
      {!isSm && <Typography variant="h4">Weather 🌦️</Typography>}
      <Box flex={1}>
        <SearchBar onSearch={onSearch} onAddCity={onAddCity} />
      </Box>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        {showRefresh && (
          <Box
            textAlign="center"
            pr={isSm ? 2 : 4}
            display={isSm ? "flex" : "block"}
            flexDirection={isSm ? "column" : "row"}
            alignItems={"center"}
            gap={isSm ? 0 : 1}
          >
            <Typography variant="caption" color="text.secondary">
              Last updated: {lastUpdated || "just now"}
            </Typography>
            <IconButton onClick={onRefresh} color="primary">
              <Tooltip title="Refresh now">
                <RefreshIcon />
              </Tooltip>
            </IconButton>
          </Box>
        )}
        <Tooltip
          title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
        >
          <IconButton onClick={toggleMode} color="inherit">
            {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default Header;
