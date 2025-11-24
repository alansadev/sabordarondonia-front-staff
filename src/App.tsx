import { useEffect } from 'react';
import {
	BrowserRouter,
	Routes,
	Route,
	Navigate,
	Outlet,
	useLocation,
} from 'react-router-dom';
import { Menu } from './pages/client/Menu';
import { ClientLogin } from './pages/client/Login';
import { Cart } from './pages/client/Cart';
import { Checkout } from './pages/client/Checkout';
import { OrderSuccess } from './pages/client/OrderSuccess';
import { Landing } from './pages/Landing';
import { Profile } from './pages/client/profile/Profile';
import { Orders } from './pages/client/orders/Orders';
import { StaffLogin } from './pages/staff/Login';
import { CashierDashboard } from './pages/staff/CashierDashboard';
import { DispatcherDashboard } from './pages/staff/DispatcherDashboard';

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
				{/* --- ROTAS PÚBLICAS CLIENTE --- */}
				<Route path='/' element={<Landing />} />
				<Route path='/menu' element={<Menu />} />
				<Route path='/cart' element={<Cart />} />
				<Route path='/login' element={<ClientLogin />} />
				<Route path='/profile' element={<Profile />} />
				<Route path='/orders' element={<Orders />} />

				{/* --- LOGIN STAFF --- */}
				<Route path='/staff/login' element={<StaffLogin />} />
				<Route path='/cashier' element={<CashierDashboard />} />
				<Route path='/dispatcher' element={<DispatcherDashboard />} />

				{/* --- ROTAS PROTEGIDAS (Exigem que tenha passado pelo Login) --- */}
				<Route element={<Outlet />}>
					<Route path='/checkout' element={<Checkout />} />
					<Route path='/order-success' element={<OrderSuccess />} />
				</Route>

				{/* Fallback */}
				<Route path='*' element={<Navigate to='/' />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
