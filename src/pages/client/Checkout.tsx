import { useState, useEffect, useMemo } from 'react';
import {
	Box,
	Container,
	VStack,
	Text,
	Button,
	HStack,
	Radio,
	RadioGroup,
	Stack,
	Input,
	InputGroup,
	InputLeftElement,
	useToast,
	Divider,
	Icon,
} from '@chakra-ui/react';
import { ChevronLeft, Banknote, CreditCard, QrCode } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../lib/utils';
import { api } from '../../lib/api';

interface CartItemType {
	id: string;
	name: string;
	price: number;
	quantity: number;
}

interface LocationState {
	items: CartItemType[];
	total: number;
}

export const Checkout = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const toast = useToast();

	const { clearCart } = useCart();

	const [paymentMethod, setPaymentMethod] = useState('PIX');
	const [changeFor, setChangeFor] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const { cartItems, cartTotal } = useMemo(() => {
		const state = location.state as LocationState;
		return {
			cartItems: state?.items || [],
			cartTotal: state?.total || 0,
		};
	}, [location.state]);

	useEffect(() => {
		window.scrollTo(0, 0);

		if (cartItems.length === 0) {
			navigate('/cart', { replace: true });
		}
	}, [cartItems, navigate]);

	const handleFinishOrder = async () => {
		if (cartItems.length === 0) return;

		setIsLoading(true);

		try {
			const { data: client } = await api.get('/users/me');

			const orderPayload = {
				clientInfo: {
					name: client.name,
					phone: client.phone,
				},
				items: cartItems.map((item) => ({
					productId: item.id,
					quantity: item.quantity,
				})),
				payment_method: paymentMethod,
				change_for:
					paymentMethod === 'CASH' && changeFor
						? parseFloat(changeFor.replace(',', '.'))
						: null,
			};

			const { data } = await api.post('/orders', orderPayload);

			clearCart();
			navigate('/order-success', { state: { order: data } });
		} catch (error) {
			console.error(error);
			toast({
				title: 'Erro ao enviar pedido',
				description: 'Tente novamente ou verifique sua conexão.',
				status: 'error',
				position: 'top',
			});
		} finally {
			setIsLoading(false);
		}
	};

	if (cartItems.length === 0) return null;

	return (
		<Box
			w='100%'
			minH='100vh'
			bg='gray.50'
			display='flex'
			justifyContent='center'
		>
			<Container maxW='480px' bg='white' p={0} minH='100vh' position='relative'>
				{/* Header */}
				<HStack
					px={4}
					py={3}
					bg='white'
					borderBottomWidth='1px'
					borderColor='gray.100'
				>
					<Button variant='ghost' size='sm' onClick={() => navigate(-1)} p={0}>
						<ChevronLeft size={24} />
					</Button>
					<Text fontSize='md' fontWeight='bold'>
						Pagamento
					</Text>
				</HStack>

				<VStack spacing={6} p={6} align='stretch'>
					{/* Resumo */}
					<Box
						bg='gray.50'
						p={4}
						borderRadius='lg'
						border='1px solid'
						borderColor='gray.100'
					>
						<Text
							fontSize='xs'
							color='gray.500'
							mb={2}
							textTransform='uppercase'
							fontWeight='bold'
						>
							Resumo
						</Text>

						<VStack align='stretch' spacing={2} mb={4}>
							{cartItems.map((item) => (
								<HStack key={item.id} justify='space-between'>
									<Text fontSize='xs' color='gray.600'>
										{item.quantity}x {item.name}
									</Text>
									<Text fontSize='xs' fontWeight='bold'>
										{formatPrice(item.price * item.quantity)}
									</Text>
								</HStack>
							))}
						</VStack>
						<Divider borderColor='gray.200' mb={3} />

						<HStack justify='space-between'>
							<Text fontSize='sm' fontWeight='bold'>
								Total a pagar
							</Text>
							<Text fontSize='xl' fontWeight='800' color='green.600'>
								{formatPrice(cartTotal)}
							</Text>
						</HStack>
					</Box>

					<Box>
						<Text fontSize='sm' fontWeight='bold' mb={3}>
							Como deseja pagar?
						</Text>
						<RadioGroup onChange={setPaymentMethod} value={paymentMethod}>
							<Stack spacing={3}>
								{/* PIX */}
								<Box
									border='1px solid'
									borderColor={
										paymentMethod === 'PIX' ? 'orange.400' : 'gray.200'
									}
									bg={paymentMethod === 'PIX' ? 'orange.50' : 'white'}
									p={3}
									borderRadius='md'
									cursor='pointer'
									onClick={() => setPaymentMethod('PIX')}
								>
									<Radio value='PIX' colorScheme='orange'>
										<HStack spacing={3}>
											<Icon as={QrCode} color='gray.600' />
											<Text fontSize='sm' fontWeight='medium'>
												Pix
											</Text>
										</HStack>
									</Radio>
								</Box>

								{/* CARTÃO */}
								<Box
									border='1px solid'
									borderColor={
										paymentMethod === 'CREDIT_CARD' ? 'orange.400' : 'gray.200'
									}
									bg={paymentMethod === 'CREDIT_CARD' ? 'orange.50' : 'white'}
									p={3}
									borderRadius='md'
									cursor='pointer'
									onClick={() => setPaymentMethod('CREDIT_CARD')}
								>
									<Radio value='CREDIT_CARD' colorScheme='orange'>
										<HStack spacing={3}>
											<Icon as={CreditCard} color='gray.600' />
											<Text fontSize='sm' fontWeight='medium'>
												Cartão
											</Text>
										</HStack>
									</Radio>
								</Box>

								{/* DINHEIRO */}
								<Box
									border='1px solid'
									borderColor={
										paymentMethod === 'CASH' ? 'orange.400' : 'gray.200'
									}
									bg={paymentMethod === 'CASH' ? 'orange.50' : 'white'}
									p={3}
									borderRadius='md'
									cursor='pointer'
									onClick={() => setPaymentMethod('CASH')}
								>
									<Radio value='CASH' colorScheme='orange'>
										<HStack spacing={3}>
											<Icon as={Banknote} color='gray.600' />
											<Text fontSize='sm' fontWeight='medium'>
												Dinheiro
											</Text>
										</HStack>
									</Radio>
								</Box>
							</Stack>
						</RadioGroup>
					</Box>

					{/* Troco */}
					{paymentMethod === 'CASH' && (
						<Box>
							<Text fontSize='sm' fontWeight='bold' mb={2}>
								Troco para quanto?
							</Text>
							<InputGroup>
								<InputLeftElement
									pointerEvents='none'
									color='gray.400'
									fontSize='sm'
								>
									R$
								</InputLeftElement>
								<Input
									type='number'
									placeholder='Ex: 50,00'
									value={changeFor}
									onChange={(e) => setChangeFor(e.target.value)}
									focusBorderColor='orange.400'
								/>
							</InputGroup>
						</Box>
					)}

					<Button
						size='lg'
						colorScheme='green'
						w='100%'
						mt={4}
						onClick={handleFinishOrder}
						isLoading={isLoading}
						loadingText='Enviando...'
					>
						FINALIZAR PEDIDO
					</Button>
				</VStack>
			</Container>
		</Box>
	);
};
