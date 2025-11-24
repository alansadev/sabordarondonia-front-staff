import { Box, VStack, Text, Button, Circle } from '@chakra-ui/react';
import { Check, ShoppingBag } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export const OrderSuccess = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const order = location.state?.order; // Recebe os dados do pedido criado

	const formattedOrderNumber = (() => {
		const raw = order?.order_number;
		if (!raw && raw !== 0) return '#0000';

		const num = Number(raw);
		if (Number.isNaN(num)) return `#${String(raw)}`;

		return `#${num.toString().padStart(4, '0')}`;
	})();

	return (
		<Box
			position='fixed'
			top={0}
			left={0}
			w='100vw'
			h='100vh'
			bg='green.500'
			display='flex'
			justifyContent='center'
			alignItems='center'
			overflow='hidden'
		>
			<Box maxW='480px' w='100%' px={6}>
				<VStack
					spacing={8}
					bg='white'
					p={8}
					borderRadius='2xl'
					shadow='xl'
					textAlign='center'
				>
					<Circle size='80px' bg='green.100'>
						<Check size={40} color='green' />
					</Circle>

					<VStack spacing={1}>
						<Text fontSize='2xl' fontWeight='800' color='gray.800'>
							Pedido Recebido!
						</Text>
						<Text fontSize='sm' color='gray.500'>
							Agora é só ir até o caixa.
						</Text>
					</VStack>

					<Box
						bg='gray.50'
						w='100%'
						p={4}
						borderRadius='lg'
						border='2px dashed'
						borderColor='gray.300'
					>
						<Text
							fontSize='xs'
							textTransform='uppercase'
							fontWeight='bold'
							color='gray.400'
						>
							Número do Pedido
						</Text>
						{/* Mostra o número do pedido vindo do banco */}
						<Text
							fontSize='6xl'
							fontWeight='900'
							color='orange.500'
							lineHeight='1'
						>
							{formattedOrderNumber}
						</Text>
					</Box>

					<VStack spacing={1}>
						<Text fontSize='sm' fontWeight='bold'>
							Total a Pagar
						</Text>
						<Text fontSize='xl' color='green.600' fontWeight='bold'>
							{order?.total_amount
								? new Intl.NumberFormat('pt-BR', {
										style: 'currency',
										currency: 'BRL',
								  }).format(order.total_amount / 100)
								: 'R$ 0,00'}
						</Text>
					</VStack>

					<Button
						w='100%'
						variant='outline'
						colorScheme='gray'
						leftIcon={<ShoppingBag size={18} />}
						onClick={() => navigate('/menu')}
					>
						Voltar ao Cardápio
					</Button>
				</VStack>
			</Box>
		</Box>
	);
};
