import React from "react";
import { Card, CardContent, Typography, IconButton, Grid } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { getWeatherByCity } from "../app/weatherAPI";

interface WatchedCity {
  name: string;
  country: string;
  temp?: number;
  condition?: string;
  airQuality?: string;
}

interface Props {
  cities: WatchedCity[];
  onRemoveCity: (name: string) => void;
}

const WatchedCities: React.FC<Props> = ({ cities, onRemoveCity }) => {
  return (
    <Grid container spacing={2}>
      {cities.map((city) => {
        const weather = getWeatherByCity(city.name);
        console.log('city', city, weather)
        return (
          <Grid size={{ xs: 12 }} key={city.name}>
            <Card
              sx={{
                borderRadius: 3,
                backgroundColor: "#2a2a2a",
                color: "#fff",
              }}
            >
              <CardContent>
                <Typography variant="h6">
                  {city.name}, {city.country}
                </Typography>
                <Typography variant="body2">
                  Temp: {city.temp ?? "--"}°C
                </Typography>
                <Typography variant="body2">
                  Condition: {city.condition ?? "--"}
                </Typography>
                <Typography variant="body2">
                  Air Quality: {city.airQuality ?? "--"}
                </Typography>
                <IconButton
                  onClick={() => onRemoveCity(city.name)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default WatchedCities;
