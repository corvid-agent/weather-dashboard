# Weather Dashboard

Real-time weather, air quality, and astronomy dashboard with location search, hourly/daily forecasts, and responsive dark/light themes.

**Live:** [corvid-agent.github.io/weather-dashboard](https://corvid-agent.github.io/weather-dashboard/)

## Features

- Current conditions with temperature, humidity, wind, pressure, cloud cover, dew point, and visibility
- 48-hour hourly forecast with interactive temperature chart
- 7-day daily forecast with high/low temps, precipitation, wind, UV, sunrise/sunset
- Precipitation probability chart
- Wind compass with Beaufort scale
- UV index meter with safety recommendations
- Humidity gauge with comfort level
- Air quality index (AQI) with pollutant breakdown (US & EU scales)
- Sun & Moon card — sunrise/sunset arc, daylight duration, moon phase
- "What to Wear" comfort card based on feels-like temperature
- Historical comparison vs. seasonal averages
- Location search with autocomplete and geolocation
- Favorite and recent locations
- Unit preferences — °C/°F, km/h/mph/m·s/kn, mm/in
- Dark and light themes
- Responsive layout with mobile bottom navigation

## Tech Stack

- Angular 21 (standalone components, signals, OnPush)
- Open-Meteo API (weather, air quality, historical — no API key required)
- Open-Meteo Geocoding API
- TypeScript strict mode
- CSS custom properties with gold-accent theme
- Playfair Display + Source Sans 3 typography

## Development

```bash
npm install
npm start        # dev server on http://localhost:4200
npm test         # run unit tests
npm run build    # production build to dist/
```

## License

MIT
