import styles from './styles.module.css';

const TTL_PRESETS = [5, 10, 30, 60];
const MIN_TTL = 5;
const MAX_TTL = 120;

interface ICacheTtlPanelProps {
	ttl: number;
	onTtlChange: (ttl: number) => void;
}

export function CacheTtlPanel({ ttl, onTtlChange }: ICacheTtlPanelProps) {
	const ttlSeconds = Math.round(ttl / 1000);

	return (
		<div className={styles.root} aria-label="Cache TTL controls">
			<div className={styles.header}>
				<span>Cache TTL</span>
				<strong>{ttlSeconds}s</strong>
			</div>

			<label className={styles.slider}>
				<input
					type="range"
					min={MIN_TTL}
					max={MAX_TTL}
					step={5}
					value={ttlSeconds}
					onChange={event => onTtlChange(Number(event.target.value) * 1000)}
				/>
			</label>

			<div className={styles.presets} aria-label="TTL presets">
				{TTL_PRESETS.map(seconds => (
					<button key={seconds} type="button" onClick={() => onTtlChange(seconds * 1000)}>
						{seconds}s
					</button>
				))}
			</div>
		</div>
	);
}
