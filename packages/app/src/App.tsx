import React, { useState } from 'react';
import { withWeatherApiConfig } from './context/WeatherApiConfigContext';
import { Location } from './types';
import CurrentWeatherDisplay from './ui/CurrentWeatherDisplay';
import LocationSearch from './ui/LocationSearch';

const App: React.FC = withWeatherApiConfig(() => {
  const [location, setLocation] = useState<Location>();

  const doUpdateLocation = (_e: unknown, value?: Location) => setLocation(value);

  return (
    <div>
      <LocationSearch onSubmit={doUpdateLocation} />
      {
        (location) && (<CurrentWeatherDisplay location={location} />)
      }
    </div>
  );
});

export default App;
