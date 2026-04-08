import { useCallback, useEffect, useRef, useState } from 'react';

import { useCacheLog } from '../context/CacheLogContext';

interface IUseCacheParams<T> {
	key: string;
	fetcher: () => Promise<T>;
	options?: Options;
}

interface IUseCacheReturn<T> {
	data: T | null;
	error: string | null;
	isLoading: boolean;
	refetch: () => Promise<void>;
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
	const isMountedRef = useRef<boolean>(false);
	const { addLog } = useCacheLog();

	const fetchData = useCallback(
		// Force ignores cache and fetches fresh data, otherwise it checks cache first
		async (force = false) => {
			const cachedEntry = cache.get(params.key) as CacheEntry<T> | undefined;

			if (!force && cachedEntry && cachedEntry.expiry > Date.now()) {
				if (isMountedRef.current) {
					setData(cachedEntry.data);
					setError(null);
					addLog(`[${params.key}] Using cached data.`, 'cache');
				}

				return;
			}

			if (isMountedRef.current) {
				setIsLoading(true);
				setError(null);
			}

			try {
				const result = await params.fetcher();

				cache.set(params.key, {
					data: result,
					expiry: Date.now() + (params.options?.ttl || DEFAULT_TTL)
				});

				if (isMountedRef.current) {
					addLog(`[${params.key}] ${force ? 'Re-fetched data.' : 'Using new fetched data.'}`, force ? 'refetch' : 'fetch');
					setData(result);
				}
			} catch (err: unknown) {
				if (!isMountedRef.current) {
					return;
				}

				if (err instanceof Error) {
					setError(err.message);
				} else {
					setError('An error occurred while fetching data.');
				}
			} finally {
				if (isMountedRef.current) {
					setIsLoading(false);
				}
			}
		},

		// eslint-disable-next-line react-hooks/exhaustive-deps
		[params.key, params.fetcher, params.options?.ttl]
	);

	const refetch = useCallback(async () => {
		await fetchData(true);
	}, [fetchData]);

	useEffect(() => {
		isMountedRef.current = true;
		fetchData();

		return () => {
			isMountedRef.current = false;
		};
	}, [fetchData]);

	return {
		data: data,
		error: error,
		isLoading: isLoading,
		refetch: refetch
	};
}
