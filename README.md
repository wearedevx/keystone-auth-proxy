## Keystone Auth Proxy

A Serverless function to handle redirects in OAuth flows.

It allows redirection to the proper Cloud Run revision depending on the version
of the CLI that initiated the authentication process.
It also allows to support different authentication providers (e.g. GitHub or
Gitlab).

## Install

```sh
npm install
```

## Local development

```sh
npm run start
```

Default port is `8080`. To use a different one:

```sh
PORT=9002 npm run start
```
