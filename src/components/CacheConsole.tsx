import { useEffect, useRef, useState } from 'react';

import type { LogEntry, LogLevel } from '../context/CacheLogContext';

export function CacheConsole({ logs }: { logs: LogEntry[] }) {
	const [isOpen, setIsOpen] = useState(true);
	const scrollRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [logs]);

	const levelColors: Record<LogLevel, string> = {
		cache: '#4ade80', // green – served from cache
		fetch: '#60a5fa', // blue – fresh fetch
		refetch: '#f97316' // orange – forced refetch
	};

	return (
		<div
			style={{
				position: 'fixed',
				bottom: '16px',
				left: '16px',
				zIndex: 9999,
				fontFamily: 'monospace',
				fontSize: '12px',
				width: '440px',
				maxHeight: '560px'
			}}>
			{/* Header / toggle */}
			<button
				onClick={() => setIsOpen(v => !v)}
				style={{
					width: '100%',
					background: '#1e1e2e',
					color: '#cdd6f4',
					border: '1px solid #45475a',
					borderRadius: isOpen ? '6px 6px 0 0' : '6px',
					padding: '4px 10px',
					cursor: 'pointer',
					textAlign: 'left',
					display: 'flex',
					justifyContent: 'space-between'
				}}>
				<span>cache log</span>
				<span>{isOpen ? '▾' : '▸'}</span>
			</button>

			{/* Log entries */}
			{isOpen && (
				<div
					ref={scrollRef}
					style={{
						background: '#181825',
						border: '1px solid #45475a',
						borderTop: 'none',
						borderRadius: '0 0 6px 6px',
						maxHeight: '200px',
						overflowY: 'auto',
						padding: '6px 0'
					}}>
					{logs.length === 0 && <div style={{ color: '#6c7086', padding: '4px 10px' }}>no logs yet</div>}

					{logs.map(entry => (
						<div key={entry.id} style={{ padding: '2px 10px', display: 'flex', gap: '8px' }}>
							<span style={{ color: '#6c7086' }}>{entry.timestamp.toLocaleTimeString([], { hour12: false })}</span>
							<span style={{ color: levelColors[entry.level] }}>{entry.message}</span>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
