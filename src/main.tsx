import './index.css';

import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import { CacheLogProvider } from './context/CacheLogContext.tsx';
import { CacheTtlProvider } from './context/CacheTtlContext.tsx';
import { HomePage } from './pages/HomePage';
import { UserPage } from './pages/UserPage';
import { BASE_PATH } from './utils/constants.ts';

const router = createBrowserRouter([
	{
		path: `${BASE_PATH}`,
		element: <HomePage />
	},
	{
		path: `${BASE_PATH}users/:userId`,
		element: <UserPage />
	}
]);

createRoot(document.getElementById('root')!).render(
	<CacheTtlProvider>
		<CacheLogProvider>
			<RouterProvider router={router} />
		</CacheLogProvider>
	</CacheTtlProvider>
);
