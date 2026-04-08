import type { User } from '../types/user';

export async function fetchUsers(): Promise<User[]> {
	const response = await fetch('https://jsonplaceholder.typicode.com/users');
	return (await response.json()) as User[];
}
