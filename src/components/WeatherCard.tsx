import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  useTheme,
} from "@mui/material";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import OpacityIcon from "@mui/icons-material/Opacity";
import CompressIcon from "@mui/icons-material/Compress";
import AirIcon from "@mui/icons-material/Air";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloudIcon from "@mui/icons-material/Cloud";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import { mt } from './../../node_modules/date-fns/locale/mt';

interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface WeatherData {
  name: string;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    temp_min: number;
    temp_max: number;
  };
  weather: Weather[];
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  clouds: {
    all: number;
  };
}

interface WeatherCardProps {
  data: WeatherData;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data }) => {
  const {
    name,
    sys: { country, sunrise, sunset },
    main: { temp, feels_like, humidity, pressure, temp_min, temp_max },
    weather,
    wind,
    visibility,
    clouds,
  } = data;

  const theme = useTheme();

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 4,
        boxShadow: 6,
        background: "rgba(30, 30, 30, 0.45)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        color: "#fff",
      }}
    >
      <CardContent>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Weather in {name}, {country}
        </Typography>

        {/* <Typography variant="subtitle1" gutterBottom>
          {weather[0].main} — {weather[0].description}
        </Typography> */}

        <Grid container spacing={3}  mt={2}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Box display="flex" alignItems="center" mb={1}>
              <ThermostatIcon sx={{ mr: 1 }} />
              <Typography>Temp: {temp}°C</Typography>
            </Box>
            {/* <Typography variant="body2">Feels Like: {feels_like}°C</Typography> */}
            <Box display="flex" alignItems="center" mb={1}>
              <ThermostatIcon sx={{ mr: 1 }} />
              <Typography variant="body2">
                Min/Max: {temp_min}°C / {temp_max}°C
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <VisibilityIcon sx={{ mr: 1 }} />
              <Typography>
                Visibility: {(visibility / 1000).toFixed(1)} km
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Box display="flex" alignItems="center" mb={1}>
              <OpacityIcon sx={{ mr: 1 }} />
              <Typography>Humidity: {humidity}%</Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <CompressIcon sx={{ mr: 1 }} />
              <Typography>Pressure: {pressure} hPa</Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <AirIcon sx={{ mr: 1 }} />
              <Typography>Wind: {wind.speed} m/s</Typography>
            </Box>
            {/* <Box display="flex" alignItems="center">
              <VisibilityIcon sx={{ mr: 1 }} />
              <Typography>
                Visibility: {(visibility / 1000).toFixed(1)} km
              </Typography>
            </Box> */}
          </Grid>

          {/* <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box display="flex" alignItems="center" mb={1}>
              <AirIcon sx={{ mr: 1 }} />
              <Typography>Wind: {wind.speed} m/s</Typography>
            </Box>
            <Typography variant="body2">Direction: {wind.deg}°</Typography>
            {wind.gust && (
              <Typography variant="body2">Gust: {wind.gust} m/s</Typography>
            )} 
          </Grid> */}

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Box display="flex" alignItems="center" mb={1}>
              <CloudIcon sx={{ mr: 1 }} />
              <Typography>Cloudiness: {clouds.all}%</Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <WbSunnyIcon sx={{ mr: 1 }} />
              <Typography>
                Sunrise: {new Date(sunrise * 1000).toLocaleTimeString()}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <NightsStayIcon sx={{ mr: 1 }} />
              <Typography>
                Sunset: {new Date(sunset * 1000).toLocaleTimeString()}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
