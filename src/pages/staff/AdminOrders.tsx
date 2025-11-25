import { useEffect, useState } from 'react';
import {
	Box,
	Heading,
	Spinner,
	Text,
	VStack,
	HStack,
	Badge,
	Select,
	Button,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { StaffLayout } from './StaffLayout';

interface OrderItem {
	product_name: string;
	quantity: number;
}

interface Order {
	id: string;
	order_number: number | string;
	status: string;
	total_amount: number;
	created_at: string;
	payment_method?: string;
	client_name?: string;
	client_phone?: string;
	items: OrderItem[];
}

const formatPrice = (value: number) => {
	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
	}).format(value);
};

const statusLabels: Record<string, string> = {
	AWAITING_PAYMENT: 'Aguardando pagamento',
	AWAITING_DISPATCH: 'Aguardando envio',
	DELIVERED: 'Entregue',
	CANCELLED: 'Cancelado',
};

const statusColors: Record<string, string> = {
	AWAITING_PAYMENT: 'yellow',
	AWAITING_DISPATCH: 'blue',
	DELIVERED: 'green',
	CANCELLED: 'red',
};

export const AdminOrders = () => {
	const navigate = useNavigate();
	const [orders, setOrders] = useState<Order[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [statusFilter, setStatusFilter] = useState<string>('');

	const fetchOrders = async (status?: string) => {
		setIsLoading(true);
		setError(null);
		try {
			const query = status ? `?status=${status}` : '';
			const { data } = await api.get<Order[]>(`/orders${query}`);
			setOrders(data || []);
		} catch (err) {
			console.error('Erro ao carregar pedidos para o admin', err);
			setError('Não foi possível carregar os pedidos.');
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchOrders();
	}, []);

	const handleStatusChange = (value: string) => {
		setStatusFilter(value);
		fetchOrders(value || undefined);
	};

	return (
		<StaffLayout title='Admin - pedidos gerais'>
			<HStack justify='space-between' mb={4} align='center'>
				<Heading color='white' size='md'>
					Pedidos gerais
				</Heading>
				<Button size='sm' variant='outline' onClick={() => navigate('/admin')}>
					Voltar
				</Button>
			</HStack>

			<HStack justify='flex-end' mb={3}>
				<Select
					size='sm'
					maxW='220px'
					bg='gray.800'
					borderColor='gray.700'
					color='white'
					value={statusFilter}
					onChange={(e) => handleStatusChange(e.target.value)}
				>
					<option value=''>Todos os status</option>
					<option value='AWAITING_PAYMENT'>Aguardando pagamento</option>
					<option value='AWAITING_DISPATCH'>Aguardando envio</option>
					<option value='DELIVERED'>Entregue</option>
					<option value='CANCELLED'>Cancelado</option>
				</Select>
			</HStack>

			{error && (
				<Text color='red.300' mb={4}>
					{error}
				</Text>
			)}

			{isLoading ? (
				<HStack justify='center' mt={10}>
					<Spinner color='green.400' />
					<Text color='gray.300'>Carregando pedidos...</Text>
				</HStack>
			) : orders.length === 0 ? (
				<Text color='gray.400'>Nenhum pedido encontrado.</Text>
			) : (
				<VStack spacing={4} align='stretch'>
					{orders.map((order) => (
						<Box
							key={order.id}
							bg='gray.800'
							borderRadius='lg'
							p={4}
							borderWidth='1px'
							borderColor='gray.700'
						>
							<HStack justify='space-between' mb={2}>
								<Text color='white' fontWeight='bold'>
									Pedido #{order.order_number}
								</Text>
								<Badge colorScheme={statusColors[order.status] || 'gray'}>
									{statusLabels[order.status] || order.status}
								</Badge>
							</HStack>

							<Text fontSize='sm' color='gray.300' mb={1}>
								Cliente: {order.client_name || '-'} ({order.client_phone || '-'}
								)
							</Text>

							<Text fontSize='sm' color='gray.300' mb={1}>
								Itens:{' '}
								{order.items
									.map((i) => `${i.quantity}x ${i.product_name}`)
									.join(' · ')}
							</Text>

							<Text fontSize='sm' color='gray.300' mb={1}>
								Criado em: {new Date(order.created_at).toLocaleString('pt-BR')}
							</Text>

							<HStack justify='space-between' mt={3}>
								<Text fontWeight='bold' color='green.300'>
									{formatPrice((order.total_amount ?? 0) / 100)}
								</Text>
							</HStack>
						</Box>
					))}
				</VStack>
			)}
		</StaffLayout>
	);
};
