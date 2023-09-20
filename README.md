# Measurement API

You give the API a measurement in meters and it replies with a thing which is roughly the same size.

## Use it like this:

> https://measure.artomweb.com/api?measure=2

Response:

```
{
"measureName": "height of the average door",
"actualValue": 2.03
}
```

This can be used in the following sentence:

> Today I ran 1.2Km, that's roughly the `length of La Rambla, Barcelona`

The meaurement is in meters.

# TODO:

- Separate heights from distances?
- Add more entries to database
