import { useEffect, useState } from 'react';
import {
	Box,
	Badge,
	Container,
	Heading,
	Spinner,
	Text,
	VStack,
	HStack,
	Button,
} from '@chakra-ui/react';
import { api } from '../../lib/api';

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

const translatePaymentMethod = (method?: string) => {
	switch (method) {
		case 'PIX':
			return 'Pix';
		case 'CASH':
			return 'Dinheiro';
		case 'CREDIT_CARD':
		case 'CARD':
			return 'Cartão';
		default:
			return method || '-';
	}
};

const formatPrice = (value: number) => {
	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
	}).format(value);
};

export const DispatcherDashboard = () => {
	const [orders, setOrders] = useState<Order[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchOrders = async () => {
		setIsLoading(true);
		setError(null);
		try {
			const { data } = await api.get<Order[]>(
				'/orders?status=READY_FOR_DELIVERY'
			);
			setOrders(data || []);
		} catch (err) {
			console.error('Erro ao carregar pedidos para despacho', err);
			setError('Não foi possível carregar os pedidos.');
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchOrders();
	}, []);

	const handleDispatch = async (orderId: string) => {
		try {
			await api.patch(`/orders/${orderId}/status`, {
				status: 'DELIVERED',
			});
			await fetchOrders();
		} catch (err) {
			console.error('Erro ao concluir entrega', err);
			setError('Erro ao concluir entrega.');
		}
	};

	return (
		<Box w='100%' minH='100vh' bg='gray.900' py={8}>
			<Container maxW='800px'>
				<Heading color='white' mb={6}>
					Pedidos aguardando entrega
				</Heading>

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
					<Text color='gray.400'>Nenhum pedido aguardando entrega.</Text>
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
									<Badge colorScheme='blue'>Aguardando entrega</Badge>
								</HStack>

								<Text fontSize='sm' color='gray.300' mb={1}>
									Cliente: {order.client_name || '-'} (
									{order.client_phone || '-'})
								</Text>

								<Text fontSize='sm' color='gray.300' mb={1}>
									Itens:{' '}
									{order.items
										.map((i) => `${i.quantity}x ${i.product_name}`)
										.join(' · ')}
								</Text>

								<Text fontSize='sm' color='gray.300' mb={1}>
									Pagamento: {translatePaymentMethod(order.payment_method)}
								</Text>

								<HStack justify='space-between' mt={3}>
									<Text fontWeight='bold' color='green.300'>
										{formatPrice((order.total_amount ?? 0) / 100)}
									</Text>
									<Button
										size='sm'
										colorScheme='blue'
										onClick={() => handleDispatch(order.id)}
									>
										Concluir entrega
									</Button>
								</HStack>
							</Box>
						))}
					</VStack>
				)}
			</Container>
		</Box>
	);
};
