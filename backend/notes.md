# backend

## server.ts
the server setup generally looks very good. functionally it should work just fine, and is roughly how i would expect to see an express app.
There is a lot of middleware, and as i can gather i think multiple are doing the same thing (cors config). it may be worth slimming it down if possible.
the lines below are notes to supplement the changes i have done

i would make the startup a function you call, that way you can have the methods needed to start the server rapped up nicely, as well as any requirements directly needed

its normally common to put the imported middlewares, before the user made ones as express evaluated based on the order in the code, and later lines will overwrite the earlier ones

