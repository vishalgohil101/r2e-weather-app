import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import { format } from "date-fns";

interface ForecastItem {
  dt: number;
  dt_txt: string;
  main: { temp_min: number; temp_max: number };
  weather: { icon: string; description: string }[];
}

interface Props {
  forecast: ForecastItem[];
}

// Group forecast data into 7 days
const groupForecastByDay = (list: ForecastItem[]) => {
  const days: Record<string, ForecastItem[]> = {};

  list.forEach((entry) => {
    const date = entry.dt_txt.split(" ")[0]; // e.g., "2025-04-09"
    if (!days[date]) days[date] = [];
    days[date].push(entry);
  });

  return Object.values(days)
    .slice(0, 7)
    .map((entries) => {
      return entries.find((e) => e.dt_txt.includes("12:00:00")) || entries[0];
    });
};

const WeeklyForecast: React.FC<Props> = ({ forecast }) => {
  const daily = groupForecastByDay(forecast);

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
        {daily.map((day, index) => (
          <Grid size={{ xs: 12 }} key={index}>
            <Box
              textAlign="center"
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: 4,
                p: 1,
                backdropFilter: "blur(6px)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "rgba(30, 30, 30, 0.45)",
                color: "#fff",
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold" ml={2}>
                {format(new Date(day.dt * 1000), "EEE")}
              </Typography>
              <Box
                minWidth={"100px"}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <img
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                  alt={day.weather[0].description}
                  width={50}
                />
              </Box>
              <Box display={"flex"} mr={2}>
                <Typography variant="body2" fontWeight="bold">
                  {day.main.temp_max}° /{" "}
                </Typography>
                <Typography variant="body2" color="lightgray" ml={1}>
                  {day.main.temp_min}°
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
