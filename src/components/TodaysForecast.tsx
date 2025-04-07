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
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          p: 3,
          mb: 3,
          borderRadius: 4,
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
          transition: "0.3s",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 12px 24px rgba(0,0,0,0.4)",
          },
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
