// src/components/WeeklyForecast.tsx

import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import { format } from "date-fns";

interface ForecastItem {
  dt: number;
  main: { temp_min: number; temp_max: number };
  weather: { icon: string; description: string }[];
}

interface Props {
  forecast: ForecastItem[];
}

const WeeklyForecast: React.FC<Props> = ({ forecast }) => {
  const daily = forecast.filter((_, i) => i % 8 === 0); // Approx every 24h

  return (
    <Box
      sx={{
        mb: 3,
        p: 3,
        borderRadius: 4,
        boxShadow: 6,
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <Typography variant="h6" gutterBottom fontWeight="bold">
        7-Day Forecast
      </Typography>
      <Grid
        container
        spacing={1}
        display={"flex"}
        alignItems="center"
        flexDirection={"column"}
      >
        {daily.slice(0, 7).map((day, index) => (
          <Grid size={{ xs: 12 }} key={index}>
            <Box
              textAlign="center"
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: 4,
                p: 2,
                backdropFilter: "blur(6px)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "rgba(30, 30, 30, 0.45)",
                color: "#fff",
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                {format(new Date(day.dt * 1000), "EEE")}
              </Typography>
              <img
                src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                alt={day.weather[0].description}
                width={48}
              />
              <Box display={"flex"}>
                <Typography variant="body2" fontWeight={'bold'}>
                  {Math.round(day.main.temp_max)}° /{" "}
                </Typography>
                <Typography variant="body2" color="lightgray" ml={1}>
                  {Math.round(day.main.temp_min)}°
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default WeeklyForecast;
