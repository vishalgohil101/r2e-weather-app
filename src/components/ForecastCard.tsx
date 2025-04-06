import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
} from '@mui/material';
import {format} from 'date-fns/format';

interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
    deg: number;
  };
  dt_txt: string;
}

interface ForecastGridProps {
  forecast: ForecastItem[];
  city: string;
}

const ForecastCard: React.FC<ForecastGridProps> = ({ forecast, city }) => {
    console.log('forecast, city', forecast, city)
  return (
    <Card sx={{ p: 3, borderRadius: 4, boxShadow: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Hourly Forecast - {city}
        </Typography>

        <Grid container spacing={2}>
          {forecast.map((item, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 3,
                  bgcolor: 'background.paper',
                  textAlign: 'center',
                  boxShadow: 2,
                  height: '100%',
                }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  {format(new Date(item.dt * 1000), 'EEE, haaa')}
                </Typography>

                <Avatar
                  src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                  alt={item.weather[0].main}
                  sx={{ width: 56, height: 56, mx: 'auto', mb: 1 }}
                />

                <Typography variant="h6">{item.main.temp.toFixed(1)}°C</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.weather[0].description}
                </Typography>

                <Typography variant="caption" display="block">
                  Feels: {item.main.feels_like.toFixed(1)}°C
                </Typography>
                <Typography variant="caption" display="block">
                  Wind: {item.wind.speed} m/s
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ForecastCard;
