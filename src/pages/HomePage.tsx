import { Link } from 'react-router';

import { useCache } from '../hooks/useCache';
import { fetchUsers } from '../service/users';
import type { User } from '../types/user';

const basePath = import.meta.env.BASE_URL;

export function HomePage() {
	const { data, error, isLoading, refetch } = useCache<User[]>({ key: 'users', fetcher: fetchUsers });

	return (
		<div className="page">
			<h1>Users</h1>

			<button onClick={refetch} className="refetch-btn">
				Reload list 🔁
			</button>

			{isLoading && <div className="status loading">Loading...</div>}
			{error && <div className="status error">{error}</div>}

			<ul className="user-list">
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
