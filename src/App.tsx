import { useEffect } from 'react';
import {
	BrowserRouter,
	Routes,
	Route,
	Navigate,
	useLocation,
} from 'react-router-dom';
import { StaffLogin } from './pages/staff/Login';
import { CashierDashboard } from './pages/staff/CashierDashboard';
import { DispatcherDashboard } from './pages/staff/DispatcherDashboard';
import { AdminDashboard } from './pages/staff/AdminDashboard';

const ScrollToTop = () => {
	const { pathname } = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	return null;
};

function App() {
	return (
		<BrowserRouter>
			<ScrollToTop />
			<Routes>
				{/* Home e login do staff */}
				<Route path='/' element={<StaffLogin />} />
				<Route path='/staff/login' element={<StaffLogin />} />
				<Route path='/admin' element={<AdminDashboard />} />
				<Route path='/cashier' element={<CashierDashboard />} />
				<Route path='/dispatcher' element={<DispatcherDashboard />} />

				{/* Fallback sempre para login staff */}
				<Route path='*' element={<Navigate to='/staff/login' />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
