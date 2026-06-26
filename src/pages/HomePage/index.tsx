import { Link } from 'react-router';

import { useCache } from '../../hooks/useCache';
import { fetchUsers } from '../../service/users';
import type { User } from '../../types/user';
import { basePath } from '../../utils/constants';
import styles from './styles.module.css';

export function HomePage() {
	const { data, error, isLoading, refetch } = useCache<User[]>({ key: 'users', fetcher: fetchUsers });

	return (
		<div className={styles.page}>
			<h1>Users</h1>

			<button onClick={refetch} className={styles.refetchBtn}>
				Reload list
			</button>

			{isLoading && <div className={`${styles.status} ${styles.loading}`}>Loading...</div>}
			{error && <div className={`${styles.status} ${styles.error}`}>{error}</div>}

			<ul className={styles.userList}>
				{data &&
					data.map(user => (
						<li key={user.id}>
							<Link to={`${basePath}/users/${user.id}`}>{user.name}</Link>
						</li>
					))}
			</ul>
		</div>
	);
}
