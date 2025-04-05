- Configure CORS ?

```js
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
}
app.use(cors(corsOptions))
```

- fetch

Copy/client/main.js: copy code to clipboard

```js
fetch('http://localhost:3000/', {
    method: 'get',
    credentials: 'include',
})
```
