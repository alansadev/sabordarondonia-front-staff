import { useEffect } from 'react';
import {
	Box,
	Container,
	Heading,
	Text,
	Button,
	VStack,
	Center,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../../hooks/useCurrentUser';

export const LandingStaff = () => {
	const navigate = useNavigate();
	const { data: user } = useCurrentUser();

	useEffect(() => {
		if (!user) return;

		if (user.role === 'ADMIN') {
			navigate('/admin', { replace: true });
		} else if (user.role === 'CASHIER') {
			navigate('/cashier', { replace: true });
		} else if (user.role === 'DISPATCHER') {
			navigate('/dispatcher', { replace: true });
		}
	}, [user, navigate]);

	return (
		<Box
			w='100%'
			minH='100vh'
			bg='gray.900'
			display='flex'
			flexDirection='column'
		>
			<Container maxW='480px' px={4} py={8}>
				<VStack spacing={8} align='stretch'>
					<VStack spacing={3} align='center'>
						<Heading color='white' textAlign='center' size='lg'>
							Sabor de Rondônia · Staff
						</Heading>
						<Text color='gray.400' fontSize='sm' textAlign='center'>
							Painel interno para equipe de atendimento, caixa e despacho.
						</Text>
					</VStack>

					<VStack spacing={4} align='stretch'>
						<Box bg='gray.800' borderRadius='lg' p={4}>
							<Heading as='h3' size='sm' color='white' mb={1}>
								Fluxos disponíveis
							</Heading>
							<Text fontSize='sm' color='gray.300'>
								· Caixa: acompanhar pedidos aguardando pagamento.
								<br />
								· Despacho: concluir pedidos prontos para entrega.
								<br />· Admin: visão geral dos fluxos.
							</Text>
						</Box>

						<Button
							colorScheme='green'
							size='lg'
							w='100%'
							onClick={() => navigate('/login')}
						>
							Acessar painel do staff
						</Button>
					</VStack>
				</VStack>
			</Container>

			<Center mt='auto' mb={4}>
				<Text fontSize='xs' color='gray.600'>
					Uso exclusivo da equipe · {new Date().getFullYear()}
				</Text>
			</Center>
		</Box>
	);
};
