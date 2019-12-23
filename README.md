# nodejs-microservice-example

## Install

1. Create the credentials: http://travistidwell.com/jsencrypt/demo/
1. Put the private key to ./credentials/private.pem
1. Put the public key to ./credentials/public.pem

## Run

### Running a single process:

```
npm start
```

### Running in cluster mode:

```
npm run start:cluster
npm run stop:cluster
```

## Load Test

Check the package.json for the bench:\* scripts

### version endpoint:

```
npm run bench:v
```

### create-token endpoint

```
npm run bench:ct
```

### verify-token endpoint:

```
npm run bench:vt
```

TODO: You should get a token first, and change the `wrk/verify-token.lua` file to use the `bench:vt` script
