import {
	Box,
	Button,
	Container,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Text,
	VStack,
	Alert,
	AlertIcon,
} from '@chakra-ui/react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';

interface StaffUser {
	id: string;
	name: string;
	email: string;
	role: 'ADMIN' | 'CASHIER' | 'DISPATCHER';
}

export const StaffLogin = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();
		setError(null);
		setIsLoading(true);

		try {
			const { data } = await api.post<StaffUser>('/auth/login', {
				email,
				password,
			});

			if (data.role === 'ADMIN') {
				navigate('/admin');
			} else if (data.role === 'CASHIER') {
				navigate('/cashier');
			} else if (data.role === 'DISPATCHER') {
				navigate('/dispatcher');
			} else {
				navigate('/');
			}
		} catch (err) {
			console.error('Erro no login do staff', err);
			setError('Credenciais inválidas ou erro ao entrar.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Box
			w='100%'
			minH='100vh'
			bg='gray.900'
			display='flex'
			justifyContent='center'
			alignItems='center'
		>
			<Container
				maxW='400px'
				bg='gray.800'
				p={8}
				borderRadius='xl'
				boxShadow='lg'
			>
				<VStack spacing={6} align='stretch'>
					<Box textAlign='center'>
						<Heading size='lg' color='white' mb={1}>
							Sabor de Rondônia
						</Heading>
						<Text fontSize='sm' color='gray.400'>
							Acesso do staff (admin, caixa, despacho)
						</Text>
					</Box>

					{error && (
						<Alert status='error' borderRadius='md' fontSize='sm'>
							<AlertIcon />
							{error}
						</Alert>
					)}

					<Box as='form' onSubmit={handleSubmit}>
						<VStack spacing={4} align='stretch'>
							<FormControl isRequired>
								<FormLabel color='gray.200'>E-mail</FormLabel>
								<Input
									type='email'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder='seuemail@empresa.com'
									bg='gray.900'
									borderColor='gray.700'
									color='white'
								/>
							</FormControl>

							<FormControl isRequired>
								<FormLabel color='gray.200'>Senha</FormLabel>
								<Input
									type='password'
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder='Digite sua senha'
									bg='gray.900'
									borderColor='gray.700'
									color='white'
								/>
							</FormControl>

							<Button
								type='submit'
								colorScheme='green'
								w='100%'
								isLoading={isLoading}
							>
								Entrar
							</Button>
						</VStack>
					</Box>
				</VStack>
			</Container>
		</Box>
	);
};
