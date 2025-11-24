import { useEffect, useState } from 'react';
import {
	Box,
	Container,
	HStack,
	VStack,
	Text,
	Image,
	IconButton,
	Button,
	Divider,
	Spinner,
	Center,
} from '@chakra-ui/react';
import { ChevronLeft, Trash2, Minus, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../lib/utils';
import { api } from '../../lib/api';

import { getProducts } from '../../services/productsService';

interface ProductData {
	id: string;
	name: string;
	price: number;
	imageUrl: string;
}

export const Cart = () => {
	const navigate = useNavigate();
	const { items, updateQuantity, removeItem } = useCart();

	const [productsData, setProductsData] = useState<ProductData[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// Busca os detalhes dos produtos ao carregar a tela
	useEffect(() => {
		window.scrollTo(0, 0);

		const fetchCartDetails = async () => {
			if (items.length === 0) {
				setIsLoading(false);
				return;
			}

			try {
				const allProducts = await getProducts();
				const ids = items.map((item) => item.productId);

				const filteredProducts = allProducts.filter((product) =>
					ids.includes(product.id)
				);
				setProductsData(filteredProducts);
			} catch (error) {
				console.error('Erro ao carregar carrinho', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchCartDetails();
	}, [items]);

	const cartItemsCombined = productsData
		.map((product) => {
			const cartItem = items.find((i) => i.productId === product.id);
			return {
				...product,
				quantity: cartItem?.quantity || 0,
			};
		})
		.filter((item) => item.quantity > 0);

	const cartTotal = cartItemsCombined.reduce(
		(acc, item) => acc + item.price * item.quantity,
		0
	);

	const handleProceedToCheckout = async () => {
		try {
			await api.get('/users/me');
			navigate('/checkout', {
				state: {
					items: cartItemsCombined,
					total: cartTotal,
				},
			});
		} catch {
			sessionStorage.setItem('next_path', '/checkout');
			navigate('/login');
		}
	};

	if (isLoading) {
		return (
			<Center minH='100vh' bg='gray.50'>
				<Spinner color='orange.500' size='xl' />
			</Center>
		);
	}

	if (items.length === 0) {
		return (
			<Box
				w='100%'
				minH='100vh'
				bg='gray.50'
				display='flex'
				justifyContent='center'
			>
				<Container
					maxW='480px'
					bg='white'
					centerContent
					justifyContent='center'
					minH='100vh'
				>
					<VStack spacing={4}>
						<Box fontSize='60px'>🛒</Box>
						<Text fontSize='lg' fontWeight='bold' color='gray.600'>
							Seu carrinho está vazio
						</Text>
						<Button
							colorScheme='orange'
							variant='outline'
							onClick={() => navigate('/menu')}
						>
							Ver Cardápio
						</Button>
					</VStack>
				</Container>
			</Box>
		);
	}

	return (
		<Box
			w='100%'
			minH='100vh'
			bg='gray.100'
			display='flex'
			justifyContent='center'
			overflowX='hidden'
		>
			<Container maxW='480px' bg='white' p={0} minH='100vh' position='relative'>
				{/* --- Header --- */}
				<HStack
					px={4}
					py={3}
					bg='white'
					borderBottomWidth='1px'
					borderColor='gray.100'
					position='sticky'
					top={0}
					zIndex={10}
				>
					<IconButton
						aria-label='Voltar'
						icon={<ChevronLeft size={24} />}
						variant='ghost'
						size='sm'
						onClick={() => navigate(-1)}
					/>
					<Text fontSize='md' fontWeight='bold' color='gray.800'>
						Seu Pedido
					</Text>
				</HStack>

				{/* --- Lista de Itens --- */}
				<VStack spacing={0} align='stretch' pb='140px'>
					{cartItemsCombined.map((item) => (
						<Box key={item.id} p={4} bg='white'>
							<HStack spacing={4} align='start'>
								<Image
									src={item.imageUrl}
									alt={item.name}
									boxSize='60px'
									objectFit='contain'
									borderRadius='md'
									border='1px solid'
									borderColor='gray.100'
								/>

								<VStack flex={1} align='start' spacing={1}>
									<HStack justify='space-between' w='100%'>
										<Text
											fontSize='sm'
											fontWeight='600'
											noOfLines={2}
											lineHeight='shorter'
										>
											{item.name}
										</Text>
										<IconButton
											aria-label='Remover'
											icon={<Trash2 size={16} />}
											size='xs'
											variant='ghost'
											colorScheme='red'
											onClick={() => removeItem(item.id)}
										/>
									</HStack>

									<Text fontSize='sm' fontWeight='bold' color='green.600'>
										{formatPrice(item.price * item.quantity)}
									</Text>

									{/* Controle de Quantidade */}
									<HStack
										bg='gray.50'
										borderRadius='md'
										spacing={0}
										border='1px solid'
										borderColor='gray.200'
										mt={1}
									>
										<IconButton
											aria-label='Diminuir'
											icon={<Minus size={14} />}
											size='xs'
											variant='ghost'
											h='28px'
											w='28px'
											onClick={() => updateQuantity(item.id, 'decrease')}
										/>
										<Text
											fontSize='sm'
											fontWeight='600'
											w='30px'
											textAlign='center'
										>
											{item.quantity}
										</Text>
										<IconButton
											aria-label='Aumentar'
											icon={<Plus size={14} />}
											size='xs'
											variant='ghost'
											color='orange.500'
											h='28px'
											w='28px'
											onClick={() => updateQuantity(item.id, 'increase')}
										/>
									</HStack>
								</VStack>
							</HStack>
							<Divider mt={4} borderColor='gray.50' />
						</Box>
					))}
				</VStack>

				{/* --- Footer --- */}
				<Box
					position='fixed'
					bottom={0}
					w='100%'
					maxW='480px'
					bg='white'
					p={4}
					borderTopWidth='1px'
					borderColor='gray.100'
					boxShadow='0 -4px 10px rgba(0,0,0,0.05)'
				>
					<VStack spacing={3}>
						<HStack w='100%' justify='space-between'>
							<Text fontSize='sm' color='gray.500'>
								Total do pedido
							</Text>
							<Text fontSize='xl' fontWeight='800' color='gray.800'>
								{formatPrice(cartTotal)}
							</Text>
						</HStack>

						<Button
							w='100%'
							colorScheme='green'
							size='lg'
							fontSize='md'
							onClick={handleProceedToCheckout}
						>
							CONTINUAR
						</Button>
					</VStack>
				</Box>
			</Container>
		</Box>
	);
};
