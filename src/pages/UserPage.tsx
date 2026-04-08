import { Link, useParams } from 'react-router';

import { useCache } from '../hooks/useCache';
import { fetchUsers } from '../service/users';
import type { User } from '../types/user';

export function UserPage() {
	const { userId } = useParams();
	const { data } = useCache<User[]>({ key: 'users', fetcher: fetchUsers });

	const user = data?.find(user => user.id === Number(userId));

	if (!user)
		return (
			<div className="page">
				<p>User not found</p>
			</div>
		);

	return (
		<div className="page">
			<div className="user-card">
				<h2>{user.name}</h2>
				<dl className="user-details">
					<dt>Username</dt>
					<dd>@{user.username}</dd>
					<dt>Email</dt>
					<dd>
						<a href={`mailto:${user.email}`}>{user.email}</a>
					</dd>
					<dt>Phone</dt>
					<dd>{user.phone}</dd>
					<dt>Website</dt>
					<dd>
						<a href={`https://${user.website}`} target="_blank" rel="noreferrer">
							{user.website}
						</a>
					</dd>
					<dt>Address</dt>
					<dd>
						{user.address.street}, {user.address.suite}, {user.address.city}
					</dd>
					<dt>Company</dt>
					<dd>{user.company.name}</dd>
				</dl>
			</div>
			<Link to="/" className="back-link">
				← Back to users
			</Link>
		</div>
	);
}
