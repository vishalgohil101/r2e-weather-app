
export const getWeatherIcon = (description: string): string => {
  const desc = description.toLowerCase();

  if (desc.includes("clear")) return "🌞";
  if (desc.includes("cloud")) return "☁️";
  if (desc.includes("rain")) return "🌧️";
  if (desc.includes("thunderstorm")) return "⛈️";
  if (desc.includes("snow")) return "❄️";
  if (desc.includes("fog") || desc.includes("mist")) return "🌫️";
  if (desc.includes("night")) return "🌙";

  return "🌤️";
};
