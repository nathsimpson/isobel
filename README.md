# ISOBEL 🐶

## Ideal API

```
import ISOBEL from (@isobel/core)
import Twitter from (@isobel/twitter)

const IZ = new ISOBEL({
    cacheStrategy: 's3',
})

IZ.get("/welcome", (req, res) => {
  return res.send("Hello. My name is ISOBEL");
});

IZ.addService(Twitter, {
    time,
    username,
    apikeys
})

IZ.addService(

)
```
