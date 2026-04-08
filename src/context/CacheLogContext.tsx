import { createContext, useCallback, useContext, useRef, useState } from 'react';

import { CacheConsole } from '../components/CacheConsole';

export type LogLevel = 'cache' | 'fetch' | 'refetch';

export interface LogEntry {
	id: number;
	message: string;
	level: LogLevel;
	timestamp: Date;
}

interface ICacheLogContext {
	addLog: (message: string, level: LogLevel) => void;
}

const CacheLogContext = createContext<ICacheLogContext | null>(null);

export function CacheLogProvider({ children }: { children: React.ReactNode }) {
	const [logs, setLogs] = useState<LogEntry[]>([]);
	const counterRef = useRef(0);

	const addLog = useCallback((message: string, level: LogLevel) => {
		const entry: LogEntry = {
			id: ++counterRef.current,
			message,
			level,
			timestamp: new Date()
		};

		setLogs(prev => [...prev.slice(-49), entry]); // keep last 50 entries
	}, []);

	return (
		<CacheLogContext.Provider value={{ addLog }}>
			{children}
			<CacheConsole logs={logs} />
		</CacheLogContext.Provider>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCacheLog() {
	const ctx = useContext(CacheLogContext);

	if (!ctx) throw new Error('useCacheLog must be used inside CacheLogProvider');

	return ctx;
}
