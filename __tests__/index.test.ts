import { webperfscore } from '../lib/';

describe('greeter function', () => {
  // Act before assertions
  beforeAll(async () => {
    // ignore
  });

  afterAll(async () => {
    // ignore
  });

  it('perfect score', async () => {
    const result = webperfscore({
      'first-contentful-paint': 0,
      'first-meaningful-paint': 0,
      'speed-index': 0,
      'fully-loaded': 0,
    });
    expect(result.score).toBe(10);
  });

  it('half score', async () => {
    const result = webperfscore({
      'first-contentful-paint': 2000,
      'first-meaningful-paint': 2000,
      'speed-index': 3000,
      'fully-loaded': 4000,
    });
    expect(result.score).toBe(5);
  });
});
