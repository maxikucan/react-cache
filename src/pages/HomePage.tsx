import { Link } from 'react-router';

import { useCache } from '../hooks/useCache';
import { fetchUsers } from '../service/users';
import type { User } from '../types/user';

export function HomePage() {
	const { data, error, isLoading } = useCache<User[]>({ key: 'users', fetcher: fetchUsers });

	return (
		<div className="page">
			<h1>Users</h1>

			{isLoading && <div className="status loading">Loading...</div>}
			{error && <div className="status error">{error}</div>}

			<ul className="user-list">
				{data &&
					data.map(user => (
						<li key={user.id}>
							<Link to={`/users/${user.id}`}>{user.name}</Link>
						</li>
					))}
			</ul>
		</div>
	);
}
