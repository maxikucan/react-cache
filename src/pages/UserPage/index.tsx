import { Link, useParams } from 'react-router';

import { useCache } from '../../hooks/useCache';
import { fetchUsers } from '../../service/users';
import type { User } from '../../types/user';
import { basePath } from '../../utils/constants';
import styles from './styles.module.css';

export function UserPage() {
	const { userId } = useParams();
	const { data } = useCache<User[]>({ key: 'users', fetcher: fetchUsers });

	const user = data?.find(user => user.id === Number(userId));

	if (!user)
		return (
			<div className={styles.page}>
				<p>User not found</p>
			</div>
		);

	return (
		<div className={styles.page}>
			<div className={styles.userCard}>
				<h2>{user.name}</h2>
				<dl className={styles.userDetails}>
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
			<Link to={`${basePath}`} className={styles.backLink}>
				Back to users
			</Link>
		</div>
	);
}
