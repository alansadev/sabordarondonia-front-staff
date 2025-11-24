import {
	Box,
	Container,
	VStack,
	HStack,
	Text,
	Center,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputLeftElement,
	Button,
	useToast,
} from '@chakra-ui/react';
import {
	Home,
	ClipboardList,
	User as UserIcon,
	Phone as PhoneIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../lib/api';
import { useCart } from '../../../hooks/useCart';

interface ClientProfile {
	name: string;
	phone: string;
}

export const Profile = () => {
	const [form, setForm] = useState<ClientProfile>({ name: '', phone: '' });
	const [originalForm, setOriginalForm] = useState<ClientProfile>({
		name: '',
		phone: '',
	});
	const [isLoading, setIsLoading] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const toast = useToast();
	const navigate = useNavigate();
	const { clearCart } = useCart();

	useEffect(() => {
		window.scrollTo(0, 0);

		const fetchProfile = async () => {
			setIsLoading(true);
			try {
				const { data } = await api.get<ClientProfile>('/users/me');
				const loaded = { name: data.name, phone: data.phone };
				setForm(loaded);
				setOriginalForm(loaded);
			} catch (error) {
				console.error('Erro ao carregar perfil', error);
				toast({
					title: 'Erro ao carregar perfil',
					status: 'error',
					position: 'top',
				});
			} finally {
				setIsLoading(false);
			}
		};

		fetchProfile();
	}, [toast]);

	const handleChange = (field: keyof ClientProfile, value: string) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	};

	const handleSave = async () => {
		const isDirty =
			form.name !== originalForm.name || form.phone !== originalForm.phone;

		if (!isDirty) {
			toast({
				title: 'Nada para salvar',
				status: 'info',
				position: 'top',
			});
			return;
		}
		if (!form.phone) {
			toast({
				title: 'Informe o telefone',
				status: 'warning',
				position: 'top',
			});
			return;
		}

		setIsSaving(true);
		try {
			await api.patch('/users/me', {
				name: form.name,
				phone: form.phone,
			});

			toast({
				title: 'Dados atualizados com sucesso',
				status: 'success',
				position: 'top',
			});
			setOriginalForm(form);
		} catch (error) {
			console.error('Erro ao atualizar perfil', error);
			toast({
				title: 'Erro ao salvar',
				description: 'Tente novamente em instantes.',
				status: 'error',
				position: 'top',
			});
		} finally {
			setIsSaving(false);
		}
	};

	const handleLogout = async () => {
		try {
			await api.post('/auth/logout');
		} catch (error) {
			console.error('Erro ao sair', error);
		} finally {
			clearCart();
			window.location.href = '/';
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
				{/* Header consistente com o Menu */}
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
							PERFIL
						</Text>
						<Text fontWeight='800' color='white' fontSize='lg'>
							Sabor de Rondônia
						</Text>
					</VStack>
				</HStack>

				<VStack align='stretch' spacing={6} p={4} pt={6} pb='90px'>
					<Center flexDirection='column' mb={2}>
						<Box
							bg='green.50'
							borderRadius='full'
							w='80px'
							h='80px'
							display='flex'
							alignItems='center'
							justifyContent='center'
							mb={3}
						>
							<UserIcon size={40} color='#2F855A' />
						</Box>
						<Text fontSize='lg' fontWeight='bold' color='gray.800'>
							{form.name || 'Cliente'}
						</Text>
						<Text fontSize='sm' color='gray.500'>
							{form.phone || 'Seu telefone ainda não foi informado.'}
						</Text>
					</Center>

					<VStack spacing={4} align='stretch'>
						<FormControl isDisabled={isLoading}>
							<FormLabel fontSize='sm' color='gray.700'>
								Nome completo
							</FormLabel>
							<Input
								value={form.name}
								onChange={(e) => handleChange('name', e.target.value)}
								placeholder='Como podemos te chamar?'
								bg='gray.50'
								border='none'
								focusBorderColor='green.500'
							/>
						</FormControl>

						<FormControl isRequired isDisabled={isLoading}>
							<FormLabel fontSize='sm' color='gray.700'>
								Telefone / WhatsApp
							</FormLabel>
							<InputGroup>
								<InputLeftElement pointerEvents='none'>
									<PhoneIcon size={18} color='gray' />
								</InputLeftElement>
								<Input
									value={form.phone}
									onChange={(e) => handleChange('phone', e.target.value)}
									placeholder='(69) 99999-9999'
									bg='gray.50'
									border='none'
									focusBorderColor='green.500'
								/>
							</InputGroup>
						</FormControl>

						<Button
							mt={2}
							colorScheme='green'
							borderRadius='full'
							isLoading={isSaving}
							isDisabled={
								isLoading ||
								isSaving ||
								(form.name === originalForm.name &&
									form.phone === originalForm.phone)
							}
							onClick={handleSave}
						>
							Salvar dados
						</Button>

						<Button
							mt={4}
							variant='outline'
							colorScheme='red'
							borderRadius='full'
							onClick={handleLogout}
						>
							Sair da conta
						</Button>
					</VStack>
				</VStack>

				{/* Footer com navegação, igual ao Menu */}
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
						<VStack spacing={0} as='button' color='green.600' opacity={1}>
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
