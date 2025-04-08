import React from "react";
import {
  useMediaQuery,
  Theme,
  Box,
  Fade,
  CircularProgress,
} from "@mui/material";
import { useWeatherApp } from "./hooks/useWeatherApp";

import Header from "./layout/Header";
import Main from "./layout/Main";

const App: React.FC = () => {
  const isSm = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  const {
    userLocation,
    watchedCities,
    addCity,
    removeCity,
    status,
    error,
    handleManualRefresh,
    lastUpdated,
    handleSearch,
    isAppLoading,
  } = useWeatherApp();

  return (
    <>
      {/* Fullscreen Loading */}
      <Fade in={isAppLoading}>
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(0, 0, 0, 0.6)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress size={70} thickness={4} color="inherit" />
        </Box>
      </Fade>

      <Header
        isSm={isSm}
        onSearch={handleSearch}
        onAddCity={addCity}
        onRefresh={handleManualRefresh}
        lastUpdated={lastUpdated}
        showRefresh={!!userLocation}
      />

      <Main
        userLocation={userLocation}
        status={status}
        error={error}
        watchedCities={watchedCities}
        onRemoveCity={removeCity}
      />
    </>
  );
};

export default App;
