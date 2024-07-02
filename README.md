# elysia-compress

[![CI Test](https://github.com/vermaysha/elysia-compress/actions/workflows/ci.yml/badge.svg)](https://github.com/vermaysha/elysia-compress/actions/workflows/ci.yml)
[![NPM version](https://img.shields.io/npm/v/elysia-compress.svg?style=flat)](https://www.npmjs.com/package/elysia-compress)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://standardjs.com/)
![GitHub License](https://img.shields.io/github/license/vermaysha/elysia-compress?style=flat)
![NPM Downloads](https://img.shields.io/npm/dy/elysia-compress?style=flat)


Add compression to [Elysia Server](https://elysiajs.com/essential/handler.html#response). Supports `gzip`, `deflate`, and `brotli`.

**Note** Brotli Compression is only available and supported by Bun v1.1.8 or higher

## Install

```
bun add elysia-compress
```

## Usage

This plugin provides a function to automatically compress every Response sent by Elysia Response.
Especially on responses in the form of JSON Objects, Text and Stream (Server Sent Events).

Currently, the following encoding tokens are supported, using the first acceptable token in this order:

1. `br`
2. `gzip`
3. `deflate`

If an unsupported encoding is received or if the `'accept-encoding'` header is missing, it will not compress the payload.

The plugin automatically decides if a payload should be compressed based on its `content-type`; if no content type is present, it will assume `text/plain`. But if you send a response in the form of an Object then it will be detected automatically as `application/json`

To improve performance, and given data compression is a resource-intensive operation, caching compressed responses can significantly reduce the load on your server. By setting an appropriate `TTL` (time to live, or how long you want your responses cached), you can ensure that frequently accessed data is served quickly without repeatedly compressing the same content. elysia-compress saves the data in-memory, so it's probably best if you set some sensible defaults (maybe even per-route or group) so as to not increase unnecessarily your memory usage

### Global Hook

The global compression hook is enabled by default. To disable it, pass the option `{ as: 'scoped' }` or `{ as: 'scoped' }` You can read in-depth about [Elysia Scope on this page](https://elysiajs.com/essential/scope.html)

```typescript
import { Elysia } from 'elysia'
import { compression } from 'elysia-compress'

const app = new Elysia()
  .use(
    compression({
      as: 'scoped',
    }),
  )
  .get('/', () => ({ hello: 'world' }))
```

## Compress Options

### threshold

The minimum byte size for a response to be compressed. Defaults to `1024`.

```typescript
const app = new Elysia().use(
  compression({
    threshold: 2048,
  }),
)
```

### Disable compression by header

You can selectively disable response compression by using the `x-no-compression` header in the request.
You can still disable this option by adding `disableByHeader: true` to options. Default to `false`

```typescript
const app = new Elysia().use(
  compression({
    disableByHeader: true,
  }),
)
```

### brotliOptions and zlibOptions

You can tune compression by setting the `brotliOptions` and `zlibOptions` properties. These properties are passed directly to native node `zlib` methods, so they should match the corresponding [class](https://nodejs.org/api/zlib.html#zlib_class_brotlioptions) [definitions](https://nodejs.org/api/zlib.html#zlib_class_options).

```typescript
const app = new Elysia().use(
  compression({
    brotliOptions: {
      params: {
        [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT, // useful for APIs that primarily return text
        [zlib.constants.BROTLI_PARAM_QUALITY]: 4, // default is 4, max is 11, min is 0
      },
    },
    zlibOptions: {
      level: 6, // default is typically 6, max is 9, min is 0
    },
  }),
)
```

### Customize encoding priority

By default, `elysia-compress` prioritizes compression as described [Usage](#usage). You can change that by passing an array of compression tokens to the `encodings` option:

```typescript
const app = new Elysia().use(
  compression({
    // Only support gzip and deflate, and prefer deflate to gzip
    encodings: ['deflate', 'gzip'],
  }),
)
```

### Cache TTL

You can specify a time-to-live (TTL) for the cache entries to define how long the compressed responses should be cached. The TTL is specified in seconds and defaults to `86400` (24 hours)

```typescript
const app = new Elysia().use(
  compression({
    TTL: 3600, // Cache TTL of 1 hour
  }),
)
```

This allows you to control how long the cached compressed responses are stored, helping to balance between performance and memory usage
