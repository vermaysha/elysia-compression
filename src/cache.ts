class MemCache {
    private cache: Map<number | bigint, any>

    constructor() {
        this.cache = new Map()
    }

    set(key: number | bigint, value: any, TTL: number = Number.MAX_SAFE_INTEGER) {
        this.cache.set(key, value)
        setTimeout(() => this.cache.delete(key), TTL * 1000)
    }

    get(key: number | bigint) {
        return this.cache.get(key)
    }

    has(key: number | bigint) {
        return this.cache.has(key)
    }

    clear() {
        this.cache.clear()
    }
}

const memCache = new MemCache()

export default memCache
