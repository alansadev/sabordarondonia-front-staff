import { useEffect, useState } from 'react';
import {
	Box,
	Button,
	Container,
	FormControl,
	FormLabel,
	Input,
	VStack,
	Text,
	InputGroup,
	InputLeftElement,
	useToast,
} from '@chakra-ui/react';
import { Phone, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { api } from '../../lib/api';

export const ClientLogin = () => {
	const [phone, setPhone] = useState('');
	const [name, setName] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const navigate = useNavigate();
	const toast = useToast();
	const { count } = useCart();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	// Máscara de Telefone
	const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let value = e.target.value.replace(/\D/g, '');
		if (value.length > 11) value = value.slice(0, 11);

		// Formato (11) 91234-5678
		value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
		value = value.replace(/(\d)(\d{4})$/, '$1-$2');

		setPhone(value);
	};

	const handleLogin = async () => {
		// Validação simples
		if (!name.trim()) {
			toast({
				title: 'Informe seu nome',
				status: 'warning',
				position: 'top',
			});
			return;
		}

		if (phone.replace(/\D/g, '').length < 10) {
			toast({ title: 'Telefone inválido', status: 'warning', position: 'top' });
			return;
		}

		setIsLoading(true);

		const payload = {
			phone: phone.replace(/\D/g, ''),
			name: name.trim(),
		};

		const redirectAfterLogin = () => {
			const nextPath = sessionStorage.getItem('next_path');
			if (nextPath) {
				sessionStorage.removeItem('next_path');
				navigate(nextPath);
				return;
			}

			if (count() > 0) {
				navigate('/checkout');
			} else {
				navigate('/menu');
			}
		};

		try {
			await api.post('/auth/client-login', payload);

			toast({ title: 'Bem vindo!', status: 'success', position: 'top' });
			redirectAfterLogin();
		} catch (err) {
			const anyError = err as { response?: { status?: number } };
			const status = anyError.response?.status;
			console.log('##@#@#', err, status);
			if (status === 401) {
				try {
					await api.post('/users/register', payload);

					await api.post('/auth/client-login', payload);

					toast({
						title: 'Cadastro realizado com sucesso',
						status: 'success',
						position: 'top',
					});
					redirectAfterLogin();
				} catch (registerError) {
					console.error('Erro ao registrar usuário', registerError);
					toast({
						title: 'Erro ao cadastrar',
						description: 'Não foi possível criar sua conta.',
						status: 'error',
						position: 'top',
					});
				}
				return;
			}

			console.error(err);
			toast({
				title: 'Erro ao entrar',
				description: 'Verifique os dados e tente novamente.',
				status: 'error',
				position: 'top',
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Box
			w='100%'
			minH='100vh'
			bg='white'
			display='flex'
			justifyContent='center'
			alignItems='center'
		>
			<Container maxW='480px' p={6}>
				<VStack spacing={8} align='stretch'>
					{/* Header / Logo */}
					<VStack spacing={2} mt={10}>
						<Box
							w='100px'
							h='100px'
							bg='green.100'
							borderRadius='full'
							display='flex'
							alignItems='center'
							justifyContent='center'
							fontSize='40px'
						>
							😋
						</Box>
						<Text fontSize='2xl' fontWeight='800' color='gray.800'>
							Sabor de Rondônia
						</Text>
						<Text fontSize='sm' color='gray.500' textAlign='center'>
							Identifique-se para finalizar seu pedido.
						</Text>
					</VStack>

					{/* Formulário */}
					<VStack spacing={4} mt={4}>
						<FormControl>
							<FormLabel fontSize='sm' color='gray.600'>
								Seu Nome
							</FormLabel>
							<InputGroup>
								<InputLeftElement pointerEvents='none'>
									<User size={18} color='gray' />
								</InputLeftElement>
								<Input
									placeholder='Como podemos te chamar?'
									size='lg'
									fontSize='md'
									value={name}
									onChange={(e) => setName(e.target.value)}
									bg='gray.50'
									border='none'
									focusBorderColor='green.500'
								/>
							</InputGroup>
						</FormControl>

						<FormControl isRequired>
							<FormLabel fontSize='sm' color='gray.600'>
								Seu WhatsApp / Telefone
							</FormLabel>
							<InputGroup>
								<InputLeftElement pointerEvents='none'>
									<Phone size={18} color='gray' />
								</InputLeftElement>
								<Input
									placeholder='(69) 99999-9999'
									size='lg'
									fontSize='md'
									value={phone}
									onChange={handlePhoneChange}
									type='tel'
									bg='gray.50'
									border='none'
									focusBorderColor='green.500'
								/>
							</InputGroup>
						</FormControl>

						<Button
							w='100%'
							colorScheme='green'
							size='lg'
							fontSize='md'
							onClick={handleLogin}
							isLoading={isLoading}
							loadingText='Entrando...'
							mt={4}
							borderRadius='full'
							shadow='md'
						>
							ACESSAR
						</Button>
					</VStack>

					<Text fontSize='xs' textAlign='center' color='gray.400' mt={10}>
						Ao continuar, você concorda com nossos termos.
					</Text>
				</VStack>
			</Container>
		</Box>
	);
};
