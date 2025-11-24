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

export const LandingStaff = () => {
	const navigate = useNavigate();

	return (
		<Box
			w='100%'
			minH='100vh'
			bg='gray.900'
			display='flex'
			justifyContent='center'
		>
			<Container maxW='480px' p={8}>
				<VStack spacing={8} align='stretch'>
					<VStack spacing={3} align='center' mt={8}>
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
							onClick={() => navigate('/staff/login')}
						>
							Acessar painel do staff
						</Button>
					</VStack>

					<Center mt={8}>
						<Text fontSize='xs' color='gray.600'>
							Uso exclusivo da equipe · {new Date().getFullYear()}
						</Text>
					</Center>
				</VStack>
			</Container>
		</Box>
	);
};
