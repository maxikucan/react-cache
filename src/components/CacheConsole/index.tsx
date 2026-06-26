import { useEffect, useRef, useState } from 'react';

import type { LogEntry } from '../../context/CacheLogContext';
import styles from './styles.module.css';

export function CacheConsole({ logs }: { logs: LogEntry[] }) {
	const [isOpen, setIsOpen] = useState(true);
	const scrollRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [logs]);

	return (
		<div className={styles.root}>
			<button onClick={() => setIsOpen(v => !v)} className={`${styles.toggle} ${isOpen ? styles.toggleOpen : ''}`} aria-expanded={isOpen}>
				<span>cache log</span>
				<span>{isOpen ? 'v' : '>'}</span>
			</button>

			{isOpen && (
				<div ref={scrollRef} className={styles.entries}>
					{logs.length === 0 && <div className={styles.empty}>no logs yet</div>}

					{logs.map(entry => (
						<div key={entry.id} className={styles.entry}>
							<span className={styles.time}>{entry.timestamp.toLocaleTimeString([], { hour12: false })}</span>
							<span className={`${styles.message} ${styles[entry.level]}`}>{entry.message}</span>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
