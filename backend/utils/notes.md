both files look great, very clean and mostly well organised

some items in helpers.ts could be grouped into an object, as then you can use TS to noth only lock changes, but also get visibility into the object by using the `as const` keyword. the TS docs have notes on what this does, and its very useful.
example;

``` typescript
const TOKEN_TIMES = {
	EXPIRATION_15_MINS = 1000 * 60 * 15,
	EXPIRATION_7_DAYS = 1000 * 60 * 60 * 24 * 7,
} as const

TOKEN_TIMES.EXPIRATION_15_MINS //1000 * 60 * 15
```