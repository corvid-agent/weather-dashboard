export interface ComfortAdvice {
  summary: string;
  clothing: string;
  icon: string;
  level: 'freezing' | 'cold' | 'cool' | 'mild' | 'warm' | 'hot' | 'extreme';
}

/**
 * Returns clothing/comfort advice based on feels-like temperature (Celsius).
 * If unit is °F, converts first.
 */
export function getComfortAdvice(feelsLike: number, unit: string, humidity: number, windSpeed: number, precipProbability: number): ComfortAdvice {
  const celsius = unit === '°F' ? (feelsLike - 32) * 5 / 9 : feelsLike;

  const rain = precipProbability > 40;
  const umbrella = rain ? ' Bring an umbrella.' : '';
  const windy = windSpeed > 30; // km/h rough threshold

  if (celsius <= -15) {
    return {
      summary: 'Dangerously cold',
      clothing: 'Heavy winter coat, insulated layers, thermal underwear, gloves, scarf, warm hat.' + umbrella,
      icon: 'bundle',
      level: 'freezing',
    };
  }
  if (celsius <= -5) {
    return {
      summary: 'Very cold',
      clothing: 'Heavy coat, layered sweaters, warm pants, boots, gloves, hat, scarf.' + umbrella,
      icon: 'bundle',
      level: 'freezing',
    };
  }
  if (celsius <= 2) {
    return {
      summary: 'Cold',
      clothing: 'Winter coat, warm layers, long pants, closed shoes. Gloves and hat recommended.' + umbrella,
      icon: 'coat',
      level: 'cold',
    };
  }
  if (celsius <= 10) {
    return {
      summary: 'Chilly',
      clothing: 'Jacket or heavy sweater, long pants, closed shoes.' + (windy ? ' Windbreaker layer helpful.' : '') + umbrella,
      icon: 'jacket',
      level: 'cool',
    };
  }
  if (celsius <= 16) {
    return {
      summary: 'Cool',
      clothing: 'Light jacket or sweater, long pants.' + (windy ? ' A windbreaker is a good idea.' : '') + umbrella,
      icon: 'jacket',
      level: 'cool',
    };
  }
  if (celsius <= 22) {
    return {
      summary: 'Comfortable',
      clothing: 'Long sleeves or t-shirt, light pants or jeans. Perfect weather.' + umbrella,
      icon: 'tshirt',
      level: 'mild',
    };
  }
  if (celsius <= 28) {
    return {
      summary: 'Warm',
      clothing: 'T-shirt, shorts or light pants.' + (humidity > 65 ? ' High humidity — wear breathable fabrics.' : '') + umbrella,
      icon: 'tshirt',
      level: 'warm',
    };
  }
  if (celsius <= 35) {
    return {
      summary: 'Hot',
      clothing: 'Light, loose clothing. Stay hydrated, wear sunscreen and sunglasses.' + (humidity > 70 ? ' Very humid — minimize outdoor exertion.' : ''),
      icon: 'sunglasses',
      level: 'hot',
    };
  }
  return {
    summary: 'Extreme heat',
    clothing: 'Minimal, light-colored clothing. Limit time outdoors. Drink plenty of water. Seek shade.',
    icon: 'sunglasses',
    level: 'extreme',
  };
}
