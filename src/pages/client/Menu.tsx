import {
	Box,
	Image,
	Text,
	VStack,
	HStack,
	Badge,
	useToast,
	IconButton,
	Container,
	Divider,
	Skeleton,
	SkeletonCircle,
	SkeletonText,
	Center,
	Button,
} from '@chakra-ui/react';
import { ShoppingCart, Plus, Home, ClipboardList, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../lib/utils';
import { getProducts } from '../../services/productsService';
import { api } from '../../lib/api';
import type { Product } from '../../services/productsService';

export const Menu = () => {
	const toast = useToast();
	const navigate = useNavigate();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	const { addItem, count } = useCart();
	const itemCount = count();

	const handleGoToProfile = async () => {
		try {
			await api.get('/users/me');
			navigate('/profile');
		} catch {
			sessionStorage.setItem('next_path', '/profile');
			navigate('/login');
		}
	};

	const {
		data: products,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ['products'],
		queryFn: getProducts,
		staleTime: 1000 * 60 * 5,
	});

	const handleAddToCart = (product: Product) => {
		addItem(product.id);

		toast({
			title: 'Item adicionado',
			description: product.name,
			status: 'success',
			duration: 1000,
			position: 'bottom',
			variant: 'solid',
			containerStyle: { marginBottom: '20px', fontSize: '12px' },
		});
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
				{/* --- Header --- */}
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
					<VStack align='start' spacing={0}>
						<Text
							fontSize='10px'
							color='green.100'
							fontWeight='bold'
							letterSpacing='wide'
						>
							CARDÁPIO
						</Text>
						<Text fontWeight='800' color='white' fontSize='lg'>
							Sabor de Rondônia
						</Text>
					</VStack>

					<Box position='relative'>
						<IconButton
							aria-label='Carrinho'
							icon={<ShoppingCart size={20} />}
							size='sm'
							variant='ghost'
							color='white'
							_hover={{ bg: 'green.500' }}
							_active={{ bg: 'green.700' }}
							onClick={() => navigate('/cart')}
						/>
						{itemCount > 0 && (
							<Badge
								position='absolute'
								top='0'
								right='0'
								bg='orange.500'
								color='white'
								borderRadius='full'
								boxSize='16px'
								fontSize='9px'
								display='flex'
								alignItems='center'
								justifyContent='center'
								border='2px solid'
								borderColor='green.600'
							>
								{itemCount}
							</Badge>
						)}
					</Box>
				</HStack>

				{/* --- Loading Skeleton --- */}
				{isLoading && (
					<VStack spacing={0} align='stretch' p={0} mt={2}>
						{[1, 2, 3, 4].map((i) => (
							<Box key={i} p={4}>
								<HStack spacing={4}>
									<SkeletonCircle size='65px' />
									<VStack flex={1} align='start' spacing={2}>
										<Skeleton height='15px' width='60%' />
										<SkeletonText
											noOfLines={2}
											spacing='2'
											skeletonHeight='8px'
											width='100%'
										/>
									</VStack>
								</HStack>
								<Divider mt={4} />
							</Box>
						))}
					</VStack>
				)}

				{/* --- Erro --- */}
				{isError && (
					<Center minH='50vh' flexDirection='column' p={6}>
						<Text color='red.500' mb={4}>
							Erro ao carregar cardápio
						</Text>
						<Button size='sm' onClick={() => window.location.reload()}>
							Tentar Novamente
						</Button>
					</Center>
				)}

				{/* --- Lista de Produtos --- */}
				{!isLoading && !isError && (
					<VStack spacing={0} align='stretch' pb='100px'>
						{products?.map((product, index) => (
							<Box key={product.id}>
								<HStack
									p={3}
									spacing={3}
									align='start'
									_active={{ bg: 'orange.50' }}
									transition='background 0.1s'
								>
									<Image
										src={product.imageUrl}
										alt={product.name}
										borderRadius='lg'
										boxSize='80px'
										objectFit='contain'
										bg='white'
										border='1px solid'
										borderColor='gray.100'
										fallbackSrc='https://placehold.co/100?text=Sabor'
									/>

									<VStack
										align='start'
										spacing={0}
										flex={1}
										h='100%'
										justify='start'
									>
										<HStack
											justify='space-between'
											w='100%'
											align='start'
											mb={1}
										>
											<Text
												fontWeight='600'
												fontSize='sm'
												color='gray.800'
												lineHeight='1.2'
												noOfLines={1}
											>
												{product.name}
											</Text>
											<Text fontWeight='700' fontSize='sm' color='green.600'>
												{formatPrice(product.price)}
											</Text>
										</HStack>

										<Text
											fontSize='xs'
											color='gray.500'
											lineHeight='1.4'
											noOfLines={2}
											minH='32px'
										>
											{product.description}
										</Text>

										<HStack
											w='100%'
											justify='space-between'
											align='center'
											pt={1}
										>
											<Badge
												colorScheme='gray'
												fontSize='9px'
												px={1.5}
												borderRadius='sm'
											>
												{product.category}
											</Badge>

											<IconButton
												aria-label='Adicionar'
												icon={<Plus size={18} />}
												size='xs'
												w='28px'
												h='28px'
												isRound
												colorScheme='orange'
												variant='outline'
												borderColor='orange.300'
												color='orange.500'
												_active={{ bg: 'orange.500', color: 'white' }}
												onClick={() => handleAddToCart(product)}
											/>
										</HStack>
									</VStack>
								</HStack>
								{index < products.length - 1 && (
									<Divider borderColor='gray.100' ml='100px' />
								)}
							</Box>
						))}
					</VStack>
				)}

				{/* Footer */}
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
						<VStack
							spacing={0}
							as='button'
							color='green.600'
							opacity={0.6}
							onClick={() => navigate('/orders')}
						>
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
							onClick={handleGoToProfile}
						>
							<User size={22} />
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
