import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  reverseGeocode,
  fetchWeatherData,
  getCurrentWeather,
  getWeatherByCity,
} from "../../app/weatherAPI";

interface WeatherState {
  userLocation: any | null;
  cities: any[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: WeatherState = {
  userLocation: null,
  cities: [],
  status: "idle",
  error: null,
};

// Thunk to fetch user's weather using location
export const fetchUserLocationWeather = createAsyncThunk(
  "weather/fetchUserLocationWeather",
  async ({ lat, lon }: { lat: number; lon: number }, thunkAPI) => {
    try {
      const location = await reverseGeocode(lat, lon);
      const weather = await fetchWeatherData(lat, lon);
      return {
        city: location.name,
        country: location.country,
        lat,
        lon,
        current: weather.current,
        forecast: weather.forecast,
      };
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to fetch weather data");
    }
  }
);

export const fetchWeatherByCity = createAsyncThunk(
  "weather/fetchWeatherByCity",
  async (city: string, thunkAPI) => {
    try {
      const weather = await getWeatherByCity(city);
      console.log(weather);
      return weather;
    } catch (err) {
      return thunkAPI.rejectWithValue("City not found or API error");
    }
  }
);

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    // Optional: addCity, removeCity, etc.
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserLocationWeather.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserLocationWeather.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userLocation = action.payload;
      })
      .addCase(fetchUserLocationWeather.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchWeatherByCity.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchWeatherByCity.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userLocation = action.payload; // overwrite userLocation with searched city
      })
      .addCase(fetchWeatherByCity.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default weatherSlice.reducer;
