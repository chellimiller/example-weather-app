# lerna-app-template

Template for a more advanced project that includes a React app and PWA managed by Lerna.

## Why use Lerna?

Beyond a simple app, some projects require a backend and complex service worker.

Using Lerna allows us to keep our project's code neatly separated.
Lerna also allows us to still manage these separate projects together.

## Usage Instructions

1. Clone the project.
1. Run `npm run setup`.
1. Get an API key from https://openweathermap.org/.
1. Create a file `./config/weather-api.json`. The file should look like the example below.
1. Run `npm start` to start the server.
1. Open http://localhost:3000/ in a browser window.

### Example `./config/weather-api.json`

```json
{
  "key": "YOUR_KEY_HERE",
  "type": "openweathermap.org"
}
```