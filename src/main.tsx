import './index.css';

import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import { CacheLogProvider } from './context/CacheLogContext.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { UserPage } from './pages/UserPage.tsx';

const basePath = import.meta.env.BASE_URL;

const router = createBrowserRouter([
	{
		path: `${basePath}`,
		element: <HomePage />
	},
	{
		path: `${basePath}users/:userId`,
		element: <UserPage />
	}
]);

createRoot(document.getElementById('root')!).render(
	<CacheLogProvider>
		<RouterProvider router={router} />
	</CacheLogProvider>
);
