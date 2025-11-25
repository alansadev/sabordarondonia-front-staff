import {
	Heading,
	Text,
	VStack,
	HStack,
	Badge,
	Button,
	SimpleGrid,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { StaffLayout } from './StaffLayout';

export const AdminDashboard = () => {
	const navigate = useNavigate();

	return (
		<StaffLayout title='Painel administrativo'>
			<Heading color='white' mb={2}>
				Painel administrativo
			</Heading>
			<Text color='gray.300' mb={6} fontSize='sm'>
				Acompanhe os fluxos de caixa, despacho, pedidos e cadastros.
			</Text>

			<VStack spacing={6} align='stretch'>
				<SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
					<HStack
						bg='gray.800'
						borderRadius='lg'
						p={4}
						borderWidth='1px'
						borderColor='gray.700'
						justify='space-between'
					>
						<VStack align='flex-start' spacing={1}>
							<Text color='gray.200' fontWeight='bold'>
								Fila do caixa
							</Text>
							<Text color='gray.400' fontSize='xs'>
								Pedidos aguardando pagamento.
							</Text>
						</VStack>
						<Button
							size='sm'
							colorScheme='green'
							onClick={() => navigate('/cashier')}
						>
							Abrir
						</Button>
					</HStack>

					<HStack
						bg='gray.800'
						borderRadius='lg'
						p={4}
						borderWidth='1px'
						borderColor='gray.700'
						justify='space-between'
					>
						<VStack align='flex-start' spacing={1}>
							<Text color='gray.200' fontWeight='bold'>
								Fila de despacho
							</Text>
							<Text color='gray.400' fontSize='xs'>
								Pedidos aguardando entrega.
							</Text>
						</VStack>
						<Button
							size='sm'
							colorScheme='blue'
							onClick={() => navigate('/dispatcher')}
						>
							Abrir
						</Button>
					</HStack>

					<HStack
						bg='gray.800'
						borderRadius='lg'
						p={4}
						borderWidth='1px'
						borderColor='gray.700'
						justify='space-between'
					>
						<VStack align='flex-start' spacing={1}>
							<Text color='gray.200' fontWeight='bold'>
								Pedidos (geral)
							</Text>
							<Text color='gray.400' fontSize='xs'>
								Lista completa de pedidos.
							</Text>
						</VStack>
						<Button
							size='sm'
							colorScheme='gray'
							onClick={() => navigate('/admin/orders')}
						>
							Ver
						</Button>
					</HStack>

					<HStack
						bg='gray.800'
						borderRadius='lg'
						p={4}
						borderWidth='1px'
						borderColor='gray.700'
						justify='space-between'
					>
						<VStack align='flex-start' spacing={1}>
							<Text color='gray.200' fontWeight='bold'>
								Produtos
							</Text>
							<Text color='gray.400' fontSize='xs'>
								Cadastro e edição de produtos.
							</Text>
						</VStack>
						<Button
							size='sm'
							variant='outline'
							colorScheme='yellow'
							onClick={() => navigate('/admin/products')}
						>
							Ver
						</Button>
					</HStack>

					<HStack
						bg='gray.800'
						borderRadius='lg'
						p={4}
						borderWidth='1px'
						borderColor='gray.700'
						justify='space-between'
					>
						<VStack align='flex-start' spacing={1}>
							<Text color='gray.200' fontWeight='bold'>
								Usuários
							</Text>
							<Text color='gray.400' fontSize='xs'>
								Gestão de contas e perfis de acesso.
							</Text>
						</VStack>
						<Button
							size='sm'
							variant='outline'
							colorScheme='purple'
							onClick={() => navigate('/admin/users')}
						>
							Ver
						</Button>
					</HStack>
				</SimpleGrid>

				<HStack
					bg='gray.900'
					borderRadius='lg'
					px={2}
					py={1}
					borderWidth='1px'
					borderColor='gray.800'
					justify='space-between'
				>
					<Text fontSize='xs' color='gray.500'>
						Rotas rápidas:
					</Text>
					<HStack spacing={2}>
						<Badge colorScheme='green'>/cashier</Badge>
						<Badge colorScheme='blue'>/dispatcher</Badge>
						<Badge colorScheme='gray'>/admin/orders</Badge>
					</HStack>
				</HStack>
			</VStack>
		</StaffLayout>
	);
};
