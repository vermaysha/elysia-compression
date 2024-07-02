import type { LifeCycleType } from 'elysia'
import type { BrotliOptions, ZlibOptions } from 'node:zlib'
export type CompressionEncoding = 'br' | 'deflate' | 'gzip'

export type CompressionOptions = {
  /**
   * The options use for brotli compression.
   *
   * @see https://nodejs.org/api/zlib.html#compressor-options
   */
  brotliOptions?: BrotliOptions

  /**
   * The options use for gzip or deflate compression.
   *
   * @see https://nodejs.org/api/zlib.html#class-options
   */
  zlibOptions?: ZlibOptions

  /**
   * The encodings to use.
   *
   * By default, we prioritize compression using
   * 1. br
   * 2. gzip
   * 3. deflate
   * If an unsupported encoding is received or if the 'accept-encoding' header is missing,
   * it will not compress the payload.
   *
   * You can change that by passing an array of compression tokens to the encodings option
   * example: `encodings: ['gzip', 'deflate']`
   */
  encodings?: CompressionEncoding[]

  /**
   * You can disable the compression by using `x-no-compression` header in request
   *
   * By default, we will not compress the payload if the 'x-no-compression' header is present
   *
   * @default true
   */
  disableByHeader?: boolean

  /**
   * The minimum byte size for a response to be compressed.
   *
   * Defaults to 1024.
   * @default 1024
   */
  threshold?: number
}

export type LifeCycleOptions = {
  /**
   * By default, hook and schema is scope to current instance only not global.
   * Hook type is to specify the scope of hook whether is should be encapsulated or global.
   *
   * Elysia hook type are as the following:
   * local - apply to only current instance and descendant only
   * scoped - apply to parent, current instance and descendants
   * global - apply to all instance that apply the plugin (all parents, current, and descendants)
   *
   * @default 'scoped'
   * @see https://elysiajs.com/essential/scope.html#hook-type
   */
  as?: LifeCycleType
}

export type CacheOptions = {
  /**
   * The time-to-live in seconds.
   *
   * @default 86400 (24 hours)
   */
  TTL?: number
}

export type ElysiaCompressionOptions = CompressionOptions & LifeCycleOptions & CacheOptions
