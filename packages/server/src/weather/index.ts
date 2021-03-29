import { Request, Response } from 'express';
import readWeatherApiConfig from './readWeatherApiConfig';

export default function weatherApi(request: Request<any, any>, response: Response<any, any>): void {
  readWeatherApiConfig().then(
    (config) => {
      console.log('Weather API Config', config);
      response.send('Weather API!!!');
    },
    // readWeatherApi should never throw/reject, so this implies that some unknown error occurred.
    () => response.status(500).send('Internal Server Error'),
  )
}