  import React from "react";
  import { Grid, Typography, Box } from "@mui/material";
  import { format } from "date-fns";

  interface ForecastItem {
    dt: number;
    main: { temp: number };
    weather: { icon: string }[];
  }

  interface Props {
    forecast: ForecastItem[];
  }

  const TodaysForecast: React.FC<Props> = ({ forecast }) => {
    console.log("forecast", forecast);
    return (
      <Box
        sx={{
          mb: 3,
          p: 3,
          borderRadius: 4,
          boxShadow: 6,
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Today's Forecast
        </Typography>
        <Grid
          container
          spacing={{xs:2, sm:2}}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          {forecast.slice(0, 6).map((item, index) => (
            <Grid
              size={{ xs: 4, sm: 1, md: 1, lg: 1, xl: 1 }}
              key={index}
              width={"70px !important"}
            >
              <Box textAlign="center">
                <Typography variant="subtitle2">
                  {format(new Date(item.dt * 1000), "p")}
                </Typography>
                <img
                  src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                  alt=""
                  width={48}
                />
                <Typography variant="body1">
                  {Math.round(item.main.temp)}°
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  export default TodaysForecast;
