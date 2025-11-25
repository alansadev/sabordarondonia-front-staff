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
import { AdminOrders } from './pages/staff/AdminOrders';
import { AdminProducts } from './pages/staff/AdminProducts';
import { AdminUsers } from './pages/staff/AdminUsers';
import { LandingStaff } from './pages/staff/LandingStaff';

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
				{/* Landing exclusiva para staff */}
				<Route path='/' element={<LandingStaff />} />
				{/* Login do staff */}
				<Route path='/login' element={<StaffLogin />} />
				<Route path='/admin' element={<AdminDashboard />} />
				<Route path='/admin/orders' element={<AdminOrders />} />
				<Route path='/admin/products' element={<AdminProducts />} />
				<Route path='/admin/users' element={<AdminUsers />} />
				<Route path='/cashier' element={<CashierDashboard />} />
				<Route path='/dispatcher' element={<DispatcherDashboard />} />

				{/* Fallback sempre para login staff */}
				<Route path='*' element={<Navigate to='/login' />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
