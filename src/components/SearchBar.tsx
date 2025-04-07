// SearchBar.tsx
import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  TextField,
  Box,
  CircularProgress,
  Typography,
  IconButton,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { searchCities } from "../app/weatherAPI";
import { useAppSelector } from "../app/hooks";

type CityOption = {
  name?: string;
  state?: string;
  country?: string;
  lat?: number;
  lon?: number;
  label?: string;
  disabled?: boolean;
  isRecent?: boolean;
};

interface Props {
  onSearch: (city: string) => void;
  onAddCity: (city: CityOption) => void;
}

const RECENT_KEY = "recentCities";

const SearchBar: React.FC<Props> = ({ onSearch, onAddCity }) => {
  const [input, setInput] = useState("");
  const [options, setOptions] = useState<CityOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState<CityOption[]>([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [selectedCity, setSelectedCity] = useState<CityOption | null>(null);
    const { status } = useAppSelector(
      (state) => state.weather
    );

  useEffect(() => {
    const saved = localStorage.getItem(RECENT_KEY);
    if (saved) setRecent(JSON.parse(saved));
  }, []);

  const updateRecent = (city: CityOption) => {
    const newRecent = [
      city,
      ...recent.filter(
        (c) => c.name !== city.name || c.country !== city.country
      ),
    ].slice(0, 5);
    setRecent(newRecent);
    localStorage.setItem(RECENT_KEY, JSON.stringify(newRecent));
  };

  useEffect(() => {
    if (!input) {
      setOptions([]);
      setSearchPerformed(false);
      return;
    }

    const debounce = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchCities(input);
        const results: CityOption[] = res.map((item: any) => ({
          name: item.name,
          state: item.state,
          country: item.country,
          lat: item.lat,
          lon: item.lon,
        }));
        setOptions(results.length ? results : [{ label: "No city found", disabled: true }]);
      } catch (err) {
        console.error("Autocomplete error:", err);
        setOptions([{ label: "No city found", disabled: true }]);
      } finally {
        setLoading(false);
        setSearchPerformed(true);
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [input]);

  const handleAdd = () => {
    if (selectedCity && selectedCity.name && selectedCity.country) {
      onAddCity(selectedCity);
      updateRecent(selectedCity);
      setInput("");
    }
  };

  return (
    <Box display="flex" alignItems="center" gap={2}>
      <Autocomplete
        freeSolo
        disableClearable
        sx={{ flex: 1 }}
        options={[
          ...recent.map((c) => ({ ...c, isRecent: true })),
          ...(searchPerformed && options.length === 0
            ? [{ label: "No city found", disabled: true }]
            : options),
        ]}
        getOptionDisabled={(option) => !!option.disabled}
        getOptionLabel={(option) =>
          typeof option === "string"
            ? option
            : option.label
            ? option.label
            : `${option.name}${option.state ? `, ${option.state}` : ""}, ${option.country}`
        }
        groupBy={(option) => option.isRecent ? "Recent Searches" : "Suggestions"}
        onInputChange={(_, value) => setInput(value)}
        onChange={(_, value) => {
          if (typeof value !== "string" && !value.disabled) {
            setSelectedCity(value);
            onSearch(value.name!);
          }
        }}
        loading={loading}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search for cities"
            variant="outlined"
            fullWidth
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading && <CircularProgress size={20} />}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        renderOption={(props, option) => (
          <li {...props} style={{ opacity: option.disabled ? 0.5 : 1 }}>
            <Box>
              <Typography>
                {option.label
                  ? option.label
                  : `${option.name}${option.state ? `, ${option.state}` : ""}, ${option.country}`}
              </Typography>
            </Box>
          </li>
        )}
      />
      <IconButton
        disabled={!selectedCity || status === "failed"}
        color="primary"
        onClick={handleAdd}
        title="Add city as favorite"
      >
        <AddCircleOutlineIcon sx={{height: 30, width: 30}}/>
      </IconButton>
    </Box>
  );
};

export default SearchBar;
