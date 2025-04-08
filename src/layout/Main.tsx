import React from "react";
import { Box, Container, Grid, Grow, Button } from "@mui/material";

import WeatherCard from "../components/WeatherCard";
import TodaysForecast from "../components/TodaysForecast";
import WeeklyForecast from "../components/WeeklyForecast";
import WatchedCities from "../components/WatchedCities";

interface Props {
  userLocation: any;
  status: string;
  error: string | null;
  watchedCities: any[];
  onRemoveCity: (name: string) => void;
}

const Main: React.FC<Props> = ({
  userLocation,
  status,
  error,
  watchedCities,
  onRemoveCity,
}) => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {status === "failed" && (
        <Grow in>
          <Box
            sx={{
              bgcolor: "#fef2f2",
              border: "1px solid #fca5a5",
              borderRadius: 2,
              px: 3,
              py: 2,
              my: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box sx={{ color: "#b91c1c", fontWeight: 500 }}>
              ⚠️ Error loading weather data. Please try reloading the page.
            </Box>
            <Button
              onClick={() => window.location.reload()}
              variant="contained"
              size="small"
              sx={{
                backgroundColor: "#b91c1c",
                color: "white",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#991b1b",
                },
              }}
            >
              Reload
            </Button>
          </Box>
        </Grow>
      )}

      {userLocation && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <WeatherCard data={userLocation.current} />
            <WatchedCities cities={watchedCities} onRemoveCity={onRemoveCity} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TodaysForecast forecast={userLocation.forecast?.list || []} />
            <WeeklyForecast forecast={userLocation.forecast?.list || []} />
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Main;
