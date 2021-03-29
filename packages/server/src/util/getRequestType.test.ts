import getRequestType, { RequestType } from './getRequestType';

describe('getRequestType', () => {
  it(`returns RequestType.API for '/api/foo'`, () => {
    expect(getRequestType('/api/foo')).toBe(RequestType.API);
  });

  it(`returns RequestType.API for '/api'`, () => {
    expect(getRequestType('/api')).toBe(RequestType.API);
  });

  it(`returns RequestType.API for '/api/index.html'`, () => {
    expect(getRequestType('/api/index.html')).toBe(RequestType.API);
  });

  it(`returns RequestType.ASSET for '/index.html'`, () => {
    expect(getRequestType('/index.html')).toBe(RequestType.ASSET);
  });

  it(`returns RequestType.ASSET for '/static/something.js'`, () => {
    expect(getRequestType('/static/something.js')).toBe(RequestType.ASSET);
  });

  it(`returns RequestType.BANNED for '/config/something.json'`, () => {
    expect(getRequestType('/config/something.json')).toBe(RequestType.BANNED);
  });

  it(`returns RequestType.ROUTE for '/config/'`, () => {
    expect(getRequestType('/config/')).toBe(RequestType.ROUTE);
  });

  it(`returns RequestType.ROUTE for '/hello'`, () => {
    expect(getRequestType('/hello')).toBe(RequestType.ROUTE);
  });
});
