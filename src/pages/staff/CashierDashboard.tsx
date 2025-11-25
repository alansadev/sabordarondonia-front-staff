import { useEffect, useState } from 'react';
import {
	Badge,
	Heading,
	Spinner,
	Text,
	VStack,
	HStack,
	Button,
	Box,
} from '@chakra-ui/react';
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
	changeFor?: number;
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

export const CashierDashboard = () => {
	const [orders, setOrders] = useState<Order[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchOrders = async () => {
		setIsLoading(true);
		setError(null);
		try {
			const { data } = await api.get<Order[]>(
				'/orders?status=AWAITING_PAYMENT'
			);
			setOrders(data || []);
		} catch (err) {
			console.error('Erro ao carregar pedidos para o caixa', err);
			setError('Não foi possível carregar os pedidos.');
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchOrders();

		// Conexão SSE para novos pedidos do caixa
		const eventSource = new EventSource('/api/orders/sse/cashier');

		eventSource.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);
				if (!data || typeof data !== 'object') return;

				// Para qualquer evento relevante, recarrega a lista
				if (data.type && data.type !== 'CONNECTED') {
					fetchOrders();
				}
			} catch {
				// se o payload não for JSON, apenas ignora
			}
		};

		eventSource.onerror = () => {
			// Em caso de erro, fecha a conexão; o usuário pode atualizar a página
			eventSource.close();
		};

		return () => {
			eventSource.close();
		};
	}, []);

	const handleConfirmPayment = async (orderId: string) => {
		try {
			await api.patch(`/orders/${orderId}/confirm-payment`);
			await fetchOrders();
		} catch (err) {
			console.error('Erro ao confirmar pagamento', err);
			setError('Erro ao confirmar pagamento.');
		}
	};

	return (
		<StaffLayout title='Caixa - pedidos aguardando pagamento'>
			<Heading color='white' size='md' mb={1}>
				Pedidos aguardando pagamento
			</Heading>
			<Text fontSize='xs' color='gray.400' mb={4}>
				Veja e confirme rapidamente os pagamentos recebidos no balcão.
			</Text>
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
				<Text color='gray.400'>Nenhum pedido aguardando pagamento.</Text>
			) : (
				<VStack spacing={4} align='stretch'>
					{orders.map((order) => (
						<Box
							key={order.id}
							bg='gray.900'
							borderRadius='lg'
							p={4}
							borderWidth='1px'
							borderColor='gray.700'
						>
							<HStack justify='space-between' mb={1}>
								<VStack spacing={0} align='flex-start'>
									<Text color='white' fontWeight='bold'>
										Pedido #{order.order_number}
									</Text>
									<Text fontSize='xs' color='gray.400'>
										Criado em:{' '}
										{new Date(order.created_at).toLocaleTimeString('pt-BR', {
											hour: '2-digit',
											minute: '2-digit',
										})}
									</Text>
								</VStack>
								<Badge colorScheme='yellow' variant='subtle'>
									Aguardando pagamento
								</Badge>
							</HStack>

							<Box mt={3} mb={3}>
								<Text fontSize='sm' color='gray.300' mb={1}>
									Cliente:{' '}
									<Text as='span' fontWeight='medium' color='white'>
										{order.client_name || '-'}
									</Text>{' '}
									<Text as='span' color='gray.400' fontSize='xs'>
										({order.client_phone || '-'})
									</Text>
								</Text>

								<Text fontSize='sm' color='gray.300' mb={1}>
									Itens:
								</Text>
								<Text fontSize='sm' color='gray.200'>
									{order.items
										.map((i) => `${i.quantity}x ${i.product_name}`)
										.join(' · ')}
								</Text>

								<Text fontSize='sm' color='gray.300' mt={2}>
									Pagamento:{' '}
									<Text as='span' fontWeight='medium' color='green.200'>
										{translatePaymentMethod(order.payment_method)}
									</Text>
								</Text>
							</Box>

							<Box mt={3} pt={2} borderTop='1px' borderColor='gray.700'>
								<HStack justify='space-between' mb={1}>
									<Text fontWeight='bold' color='green.300' fontSize='lg'>
										Total: {formatPrice((order.total_amount ?? 0) / 100)}
									</Text>
								</HStack>

								{order.payment_method === 'CASH' && order.changeFor != null && (
									<>
										<Text fontSize='sm' color='gray.300'>
											Troco para:{' '}
											<Text as='span' fontWeight='medium' color='yellow.200'>
												{formatPrice(order.changeFor / 100)}
											</Text>
										</Text>
										<Text fontSize='sm' color='gray.300'>
											Troco:{' '}
											<Text as='span' fontWeight='medium' color='green.300'>
												{formatPrice(
													Math.max(
														order.changeFor - (order.total_amount ?? 0),
														0
													) / 100
												)}
											</Text>
										</Text>
									</>
								)}

								<Button
									size='sm'
									colorScheme='green'
									w='full'
									mt={3}
									onClick={() => handleConfirmPayment(order.id)}
								>
									Confirmar pagamento
								</Button>
							</Box>
						</Box>
					))}
				</VStack>
			)}
		</StaffLayout>
	);
};
