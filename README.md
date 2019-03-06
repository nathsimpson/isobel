# JARVIS

## Ideal API

```
import JARVIS from (@jarvis/core)
import Twitter from (@jarvis/twitter)

const JRVS = new JARVIS({
    cacheStrategy: 's3',
})

JRVS.get("/welcome", (req, res) => {
  return res.send("Hello. My name is JARVIS");
});

JRVS.addService(Twitter, {
    time,
    username,
    apikeys
})

JRVS.addService(

)
```
