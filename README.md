# react-cache

See demo in Vercel: [https://react-cache.vercel.app/](https://react-cache.vercel.app/)

> ⚠️ Work in progress — learning experiment.

A small React app built to explore a custom in-memory caching hook.

## What it does

- Fetches a list of users from [JSONPlaceholder](https://jsonplaceholder.typicode.com/users)
- Caches the response in memory using a custom `useCache` hook
- Navigates to a detail page per user via React Router

## useCache

The core of the experiment lives in `src/hooks/useCache.ts`.

- Stores fetched data in a module-level `Map` keyed by a string
- Each entry has an expiry timestamp (default TTL: 5 minutes)
- On subsequent renders, serves cached data if still valid — skipping the network request
- Accepts an optional `ttl` (ms) to override the default

```ts
const { data, error, isLoading } = useCache<User[]>({
	key: 'users',
	fetcher: fetchUsers,
	options: { ttl: 60_000 } // optional, defaults to 5 min
});
```

## Stack

- React + TypeScript
- Vite
- React Router
