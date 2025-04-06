import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  TextField,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import { searchCities } from "../app/weatherAPI";

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
}

const RECENT_KEY = "recentCities";

const SearchBar: React.FC<Props> = ({ onSearch }) => {
  const [input, setInput] = useState("");
  const [options, setOptions] = useState<CityOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState<CityOption[]>([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Load recent searches
  useEffect(() => {
    const saved = localStorage.getItem(RECENT_KEY);
    if (saved) {
      setRecent(JSON.parse(saved));
    }
  }, []);

  // Save recent search
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

  // Debounced search logic
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

        if (results.length === 0) {
          setOptions([{ label: "No city found", disabled: true }]);
        } else {
          setOptions(results);
        }
      } catch (err) {
        console.error("Autocomplete error:", err);
        setOptions([{ label: "No city found", disabled: true }]);
      } finally {
        setLoading(false);
        setSearchPerformed(true);
      }
    }, 500); // debounce delay

    return () => clearTimeout(debounce);
  }, [input]);

  return (
    <Autocomplete
      freeSolo
      disableClearable
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
      groupBy={(option) =>
        option.isRecent ? "Recent Searches" : "Suggestions"
      }
      onInputChange={(_, value) => {
        setInput(value);
      }}
      onChange={(_, value) => {
        if (
          typeof value !== "string" &&
          !value.disabled &&
          value.name &&
          value.country
        ) {
          onSearch(value.name);
          updateRecent(value);
          setInput("");
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
                {loading ? <CircularProgress size={20} /> : null}
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
      sx={{width: "60%"}}
    />
  );
};

export default SearchBar;
