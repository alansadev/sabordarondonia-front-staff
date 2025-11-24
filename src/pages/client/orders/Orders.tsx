import {
	Box,
	Container,
	VStack,
	HStack,
	Text,
	Badge,
	IconButton,
	Spinner,
	Center,
	Divider,
} from '@chakra-ui/react';
import { Home, ClipboardList, User as UserIcon, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../lib/api';
import { formatPrice } from '../../../lib/utils';

interface OrderItem {
	product: { id: string; name: string };
	quantity: number;
}

interface Order {
	id: string;
	order_number: number | string;
	status: string;
	total_amount: number; // em centavos
	created_at: string;
	payment_method?: string;
	items: OrderItem[];
}

export const Orders = () => {
	const [orders, setOrders] = useState<Order[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

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

	useEffect(() => {
		window.scrollTo(0, 0);

		const fetchOrders = async () => {
			setIsLoading(true);
			try {
				const { data } = await api.get<Order[]>('/orders/my-orders');
				setOrders(data);
			} catch (error) {
				console.error('Erro ao carregar pedidos', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchOrders();
	}, []);

	const renderStatus = (status: string) => {
		switch (status) {
			case 'PENDING':
				return <Badge colorScheme='yellow'>Pendente</Badge>;
			case 'IN_PROGRESS':
				return <Badge colorScheme='blue'>Em preparo</Badge>;
			case 'DONE':
				return <Badge colorScheme='green'>Concluído</Badge>;
			default:
				return <Badge colorScheme='gray'>{status}</Badge>;
		}
	};

	return (
		<Box
			w='100%'
			minH='100vh'
			bg='gray.100'
			display='flex'
			justifyContent='center'
			overflowX='hidden'
		>
			<Container
				maxW='480px'
				bg='white'
				p={0}
				minH='100vh'
				boxShadow='xl'
				position='relative'
			>
				{/* Header */}
				<HStack
					bg='green.600'
					px={3}
					py={2}
					justify='space-between'
					position='sticky'
					top={0}
					zIndex={20}
					shadow='md'
					h='60px'
				>
					<IconButton
						aria-label='Voltar'
						icon={<ArrowLeft size={20} />}
						variant='ghost'
						color='white'
						onClick={() => navigate(-1)}
					/>
					<VStack align='start' spacing={0}>
						<Text
							fontSize='10px'
							color='green.100'
							fontWeight='bold'
							letterSpacing='wide'
						>
							MEUS PEDIDOS
						</Text>
						<Text fontWeight='800' color='white' fontSize='lg'>
							Sabor de Rondônia
						</Text>
					</VStack>
				</HStack>

				{/* Lista de pedidos */}
				<VStack align='stretch' spacing={0} p={4} pb='90px'>
					{isLoading && (
						<Center py={10}>
							<Spinner color='green.500' />
						</Center>
					)}

					{!isLoading && orders.length === 0 && (
						<Center py={10} flexDirection='column'>
							<Text fontSize='sm' color='gray.500'>
								Você ainda não fez nenhum pedido.
							</Text>
						</Center>
					)}

					{orders.map((order) => (
						<Box key={order.id} py={3}>
							<HStack justify='space-between' align='flex-start'>
								<VStack align='flex-start' spacing={1}>
									<HStack spacing={2}>
										<Text fontWeight='bold' fontSize='sm' color='gray.800'>
											Pedido #{order.order_number}
										</Text>
										{renderStatus(order.status)}
									</HStack>
									<Text fontSize='xs' color='gray.500'>
										{order.created_at
											? new Date(order.created_at).toLocaleString('pt-BR')
											: '--'}
									</Text>
									{order.payment_method && (
										<Text fontSize='xs' color='gray.500'>
											Pagamento: {translatePaymentMethod(order.payment_method)}
										</Text>
									)}
									<Text
										fontSize='xs'
										color='gray.500'
										noOfLines={1}
										maxW='260px'
									>
										{order.items
											.map((i) => `${i.quantity}x ${i.product.name}`)
											.join(' · ')}
									</Text>
								</VStack>
								<Text fontWeight='bold' fontSize='sm' color='green.600'>
									{formatPrice(order.total_amount ?? 0)}
								</Text>
							</HStack>
							<Divider mt={3} />
						</Box>
					))}
				</VStack>

				{/* Footer navegação */}
				<Box
					position='fixed'
					bottom={0}
					w='100%'
					display='flex'
					justifyContent='center'
					zIndex={100}
					pointerEvents='none'
				>
					<HStack
						bg='yellow.50'
						borderTopWidth='1px'
						borderColor='yellow.200'
						p={2}
						justify='space-around'
						pb={6}
						pt={3}
						w='100%'
						maxW='480px'
						pointerEvents='auto'
						boxShadow='0 -4px 10px -1px rgba(0, 0, 0, 0.05)'
					>
						<VStack
							spacing={0}
							as='button'
							color='green.600'
							onClick={() => navigate('/menu')}
						>
							<Home size={22} strokeWidth={2.5} />
							<Text fontSize='9px' fontWeight='bold' mt={0.5}>
								Início
							</Text>
						</VStack>
						<VStack spacing={0} as='button' color='green.600' opacity={1}>
							<ClipboardList size={22} />
							<Text fontSize='9px' fontWeight='medium' mt={0.5}>
								Pedidos
							</Text>
						</VStack>
						<VStack
							spacing={0}
							as='button'
							color='green.600'
							opacity={0.6}
							onClick={() => navigate('/profile')}
						>
							<UserIcon size={22} />
							<Text fontSize='9px' fontWeight='medium' mt={0.5}>
								Perfil
							</Text>
						</VStack>
					</HStack>
				</Box>
			</Container>
		</Box>
	);
};
