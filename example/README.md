# Running the example

Start the containers:

```
docker compose up
```

Then query the defined endpoint with curl:

```
curl -X POST 'http://localhost:3000/api/respond?userMessage="hello"'
```
