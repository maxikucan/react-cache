import { useEffect, useState } from 'react';

interface IUseCacheParams<T> {
	key: string;
	fetcher: () => Promise<T>;
	options?: Options;
}

interface IUseCacheReturn<T> {
	data: T | null;
	error: string | null;
	isLoading: boolean;
}

type Options = {
	ttl?: number;
};

type CacheEntry<T> = {
	data: T;
	expiry: number;
};

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, CacheEntry<unknown>>();

export function useCache<T>(params: IUseCacheParams<T>): IUseCacheReturn<T> {
	const [data, setData] = useState<T | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		let isMounted = true;

		async function fetchData() {
			const cachedEntry = cache.get(params.key) as CacheEntry<T> | undefined;

			if (cachedEntry && cachedEntry.expiry > Date.now()) {
				console.log('Using cached data.');
				setData(cachedEntry.data);
				setError(null);

				return;
			}

			setIsLoading(true);
			setError(null);

			try {
				const result = await params.fetcher();

				if (!isMounted) {
					return;
				}

				cache.set(params.key, {
					data: result,
					expiry: Date.now() + (params.options?.ttl || DEFAULT_TTL)
				});

				console.log('Using new fetched data.');
				setData(result);
			} catch (err: unknown) {
				if (!isMounted) {
					return;
				}

				if (err instanceof Error) {
					setError(err.message);
				} else {
					setError('An error occurred while fetching data.');
				}
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		}

		fetchData();

		return () => {
			isMounted = false;
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [params.key, params.options?.ttl]);

	return {
		data: data,
		error: error,
		isLoading: isLoading
	};
}
