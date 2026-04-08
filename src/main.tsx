import './index.css';

import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import { CacheLogProvider } from './context/CacheLogContext.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { UserPage } from './pages/UserPage.tsx';

const router = createBrowserRouter([
	{
		path: '/',
		element: <HomePage />
	},
	{
		path: '/users/:userId',
		element: <UserPage />
	}
]);

createRoot(document.getElementById('root')!).render(
	<CacheLogProvider>
		<RouterProvider router={router} />
	</CacheLogProvider>
);
