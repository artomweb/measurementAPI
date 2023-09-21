# Measurement API

An API which returns approximate, wordy measurements.

## Use it like this:

> https://measure.artomweb.com/api?measure=1200

Response:

```JSON
{
  "measureName": "length of La Rambla, Barcelona",
  "actualValue": 1200
}
```

This can be used in the following sentence:

> Today I ran 1.2Km, that's roughly the `length of La Rambla, Barcelona`

The meaurement is in meters.

# TODO:

- Is there a way to hold the database of items in memory? With Vercel, no variables can be stored between requests...
- Separate heights from distances?
- Return multiples of entries, for example the `length of two cats` or `the length of 5 cars`. The item with the smallest remainder (not rounding to zero) should be chosen. Is this easy/fast to compute?
- Add more entries to database
