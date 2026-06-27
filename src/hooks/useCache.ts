import { useCallback, useEffect, useRef, useState } from 'react';

import { useCacheLog } from '../context/CacheLogContext';
import { useCacheTtl } from '../context/CacheTtlContext';
import { DEFAULT_TTL } from '../utils/constants';

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
	createdAt: number;
};

const cache = new Map<string, CacheEntry<unknown>>();

export function useCache<T>(params: IUseCacheParams<T>): IUseCacheReturn<T> {
	const [data, setData] = useState<T | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const isMountedRef = useRef<boolean>(false);
	const { addLog } = useCacheLog();
	const { ttl } = useCacheTtl();
	const effectiveTtl = params.options?.ttl ?? ttl ?? DEFAULT_TTL;

	const fetchData = useCallback(
		// Force ignores cache and fetches fresh data, otherwise it checks cache first
		async (force = false) => {
			const cachedEntry = cache.get(params.key) as CacheEntry<T> | undefined;
			const expiry = cachedEntry ? cachedEntry.createdAt + effectiveTtl : 0;

			if (!force && cachedEntry && expiry > Date.now()) {
				if (isMountedRef.current) {
					setData(cachedEntry.data);
					setError(null);
					addLog(`[${params.key}] Using cached data - Valid until ${new Date(expiry).toLocaleTimeString([], { hour12: false })}.`, 'cache');
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
					createdAt: Date.now()
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
		[params.key, params.fetcher, effectiveTtl]
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
