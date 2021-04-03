import { LocationQuery } from '../../types';
import createForm, { FormInputType } from '../hoc/createForm';
import './LocationSearch.css';

export default createForm({
  order: ['location'],
  inputs: {
    'location': {
      type: FormInputType.SEARCH,
      defaultValue: 'Scottsdale, AZ, US',
      placeholder: 'City, State, US or City, Country',
    }
  },
  mapFormObject: (formObject): LocationQuery | undefined => {
    // @todo #6 Better mapping and error handling
    if (formObject.location) {
      const [city, state, country] = formObject.location.split(',').map(item => item.trim());
      return {
        city,
        state,
        country,
        zipcode: undefined,
      }
    }

    return undefined;
  },
});