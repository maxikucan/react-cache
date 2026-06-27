import { createContext, useContext, useMemo, useState } from 'react';

import { CacheTtlPanel } from '../components/CacheTtlPanel';
import { DEFAULT_TTL } from '../utils/constants';

interface ICacheTtlContext {
	ttl: number;
	setTtl: (ttl: number) => void;
}

const CacheTtlContext = createContext<ICacheTtlContext | null>(null);

export function CacheTtlProvider({ children }: { children: React.ReactNode }) {
	const [ttl, setTtl] = useState(DEFAULT_TTL);
	const value = useMemo(() => ({ ttl, setTtl }), [ttl]);

	return (
		<CacheTtlContext.Provider value={value}>
			{children}
			<CacheTtlPanel ttl={ttl} onTtlChange={setTtl} />
		</CacheTtlContext.Provider>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCacheTtl() {
	const ctx = useContext(CacheTtlContext);

	if (!ctx) throw new Error('useCacheTtl must be used inside CacheTtlProvider');

	return ctx;
}
