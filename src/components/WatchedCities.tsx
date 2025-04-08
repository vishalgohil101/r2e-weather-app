import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { getWeatherByCity } from "../app/weatherAPI";

interface WatchedCity {
  name: string;
  country: string;
}

interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  pressure: number;
  visibility: number;
  windSpeed: number;
}

interface Props {
  cities: WatchedCity[];
  onRemoveCity: (name: string) => void;
}
const backgroundImages = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  "https://plus.unsplash.com/premium_photo-1669809948017-518b5d800d73?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1592210454359-9043f067919b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1580193769210-b8d1c049a7d9?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

const WatchedCities: React.FC<Props> = ({ cities, onRemoveCity }) => {
  const [weatherData, setWeatherData] = useState<Record<string, WeatherData>>(
    {}
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      const data: Record<string, WeatherData> = {};
      setLoading(true);
      for (const city of cities) {
        try {
          const res = await getWeatherByCity(city.name);
          const {
            main: { temp, humidity, pressure },
            wind,
            visibility,
          } = res.current;

          const description = res.current.weather[0].description;

          data[city.name] = {
            temp,
            condition: description,
            humidity,
            pressure,
            visibility,
            windSpeed: wind.speed,
          };
        } catch (error) {
          console.error("Error fetching weather for", city.name);
        }
      }
      setWeatherData(data);
      setLoading(false);
    };

    if (cities.length) {
      fetchWeather();
    } else {
      setWeatherData({});
    }
  }, [cities]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="120px"
        my={2}
      >
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  return (
    <Grid
      container
      spacing={3}
      my={3}
      maxHeight={"480px"}
      overflow={"auto"}
      sx={{
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        background:'transparent',
      }}
    >
      {cities.map((city, index) => {
        const data = weatherData[city.name];
        return (
          <Grid size={{ xs: 12 }} key={city.name}>
            <Card
              sx={{
                borderRadius: 4,
                position: "relative",
                overflow: "hidden",
                color: "#fff",
                backgroundImage: `url(${
                  backgroundImages[index % backgroundImages.length]
                })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "186px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(to right top, rgba(0,0,0,0.5), rgba(0,0,0,0.2))",
                  zIndex: 1,
                },
              }}
            >
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                  position="relative"
                  zIndex={2}
                >
                  <Typography variant="h6" fontWeight={600}>
                    {city.name}, {city.country}
                  </Typography>
                  <IconButton
                    onClick={() => onRemoveCity(city.name)}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>

                <Box
                  display="flex"
                  alignItems="center"
                  gap={2}
                  mb={1}
                  position="relative"
                  zIndex={2}
                >
                  <Typography variant="h5" fontWeight={700} color="#fff">
                    {data?.temp ?? "--"}°C
                  </Typography>
                </Box>

                <Typography variant="subtitle1" zIndex={2} position="relative">
                  {data?.condition ?? "--"}
                </Typography>
                <Box display={"flex"} gap={2} position="relative" zIndex={2}>
                  <Typography variant="body2" mt={1}>
                    Humidity: <strong>{data?.humidity ?? "--"} %</strong>
                  </Typography>
                  <Typography variant="body2" mt={1}>
                    | Pressure: <strong>{data?.pressure ?? "--"} hPa</strong>
                  </Typography>
                  <Typography variant="body2" mt={1}>
                    | Visibility :{" "}
                    <strong>{`${
                      (data?.visibility / 1000).toFixed(1) ?? "--"
                    } km`}</strong>
                  </Typography>
                  <Typography variant="body2" mt={1}>
                    | Wind speed: <strong>{data?.windSpeed ?? "--"} m/s</strong>
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default WatchedCities;
