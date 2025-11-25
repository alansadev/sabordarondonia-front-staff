import { useEffect, useState } from 'react';
import {
	Box,
	Heading,
	Spinner,
	Text,
	VStack,
	HStack,
	Button,
	Input,
	FormControl,
	FormLabel,
	Select,
	Badge,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { StaffLayout } from './StaffLayout';

interface User {
	id: string;
	name: string;
	email: string;
	roles: string[];
}

const allRoles = ['ADMIN', 'CASHIER', 'DISPATCHER', 'SELLER', 'CLIENT'];

export const AdminUsers = () => {
	const navigate = useNavigate();
	const [users, setUsers] = useState<User[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [phone, setPhone] = useState('');
	const [role, setRole] = useState<string>('ADMIN');

	const fetchUsers = async () => {
		setIsLoading(true);
		setError(null);
		try {
			const { data } = await api.get<User[]>('/users');
			setUsers(data || []);
		} catch (err) {
			console.error('Erro ao carregar usuários', err);
			setError('Não foi possível carregar os usuários.');
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const resetForm = () => {
		setName('');
		setEmail('');
		setPassword('');
		setRole('ADMIN');
	};

	const handleCreateUser = async () => {
		try {
			const numericPhone = phone.replace(/\D/g, '');

			if (!name || !email || !password || !numericPhone) {
				setError('Preencha nome, email, telefone e senha.');
				return;
			}

			await api.post('/users', {
				name,
				email,
				password,
				phone: numericPhone,
				roles: [role],
			});

			resetForm();
			fetchUsers();
		} catch (err) {
			console.error('Erro ao criar usuário', err);
			setError('Erro ao criar usuário.');
		}
	};

	const handleToggleRole = async (user: User, targetRole: string) => {
		try {
			const hasRole = user.roles.includes(targetRole);
			const newRoles = hasRole
				? user.roles.filter((r) => r !== targetRole)
				: [...user.roles, targetRole];

			await api.patch(`/users/${user.id}`, {
				roles: newRoles,
			});

			fetchUsers();
		} catch (err) {
			console.error('Erro ao atualizar roles', err);
			setError('Erro ao atualizar roles do usuário.');
		}
	};

	return (
		<StaffLayout title='Admin - usuários'>
			<HStack justify='space-between' mb={4} align='center'>
				<Heading color='white' size='md'>
					Usuários
				</Heading>
				<Button
					size='sm'
					colorScheme='blue'
					variant='solid'
					onClick={() => navigate('/admin')}
				>
					Voltar
				</Button>
			</HStack>

			{error && (
				<Text color='red.300' mb={4}>
					{error}
				</Text>
			)}

			<Box
				bg='gray.800'
				borderRadius='lg'
				p={4}
				mb={6}
				borderWidth='1px'
				borderColor='gray.700'
			>
				<VStack spacing={3} align='stretch'>
					<FormControl>
						<FormLabel color='gray.200'>Nome</FormLabel>
						<Input
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder='Nome do usuário'
							bg='gray.900'
							borderColor='gray.700'
							color='white'
							size='sm'
						/>
					</FormControl>

					<FormControl>
						<FormLabel color='gray.200'>Telefone</FormLabel>
						<Input
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
							placeholder='(69) 99999-9999'
							bg='gray.900'
							borderColor='gray.700'
							color='white'
							size='sm'
						/>
					</FormControl>

					<FormControl>
						<FormLabel color='gray.200'>E-mail</FormLabel>
						<Input
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder='email@exemplo.com'
							bg='gray.900'
							borderColor='gray.700'
							color='white'
							size='sm'
						/>
					</FormControl>

					<FormControl>
						<FormLabel color='gray.200'>Senha</FormLabel>
						<Input
							type='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder='Senha inicial'
							bg='gray.900'
							borderColor='gray.700'
							color='white'
							size='sm'
						/>
					</FormControl>

					<FormControl>
						<FormLabel color='gray.200'>Role principal</FormLabel>
						<Select
							size='sm'
							bg='gray.900'
							borderColor='gray.700'
							color='white'
							value={role}
							onChange={(e) => setRole(e.target.value)}
						>
							{allRoles.map((r) => (
								<option key={r} value={r}>
									{r}
								</option>
							))}
						</Select>
					</FormControl>

					<HStack justify='flex-end'>
						<Button size='sm' colorScheme='purple' onClick={handleCreateUser}>
							Criar usuário
						</Button>
					</HStack>
				</VStack>
			</Box>

			{isLoading ? (
				<HStack justify='center' mt={10}>
					<Spinner color='green.400' />
					<Text color='gray.300'>Carregando usuários...</Text>
				</HStack>
			) : users.length === 0 ? (
				<Text color='gray.400'>Nenhum usuário encontrado.</Text>
			) : (
				<VStack spacing={3} align='stretch'>
					{users.map((user) => (
						<Box
							key={user.id}
							bg='gray.800'
							borderRadius='lg'
							p={3}
							borderWidth='1px'
							borderColor='gray.700'
						>
							<Text color='white' fontWeight='bold' fontSize='sm' mb={1}>
								{user.name}
							</Text>
							<Text color='gray.300' fontSize='xs' mb={2}>
								{user.email}
							</Text>

							<HStack spacing={2} mb={2} wrap='wrap'>
								{user.roles.map((r) => (
									<Badge key={r} colorScheme='gray' fontSize='0.7rem'>
										{r}
									</Badge>
								))}
							</HStack>

							<HStack spacing={2} wrap='wrap'>
								{allRoles.map((r) => (
									<Button
										key={r}
										size='xs'
										variant={user.roles.includes(r) ? 'solid' : 'outline'}
										colorScheme={user.roles.includes(r) ? 'purple' : 'gray'}
										onClick={() => handleToggleRole(user, r)}
									>
										{r}
									</Button>
								))}
							</HStack>
						</Box>
					))}
				</VStack>
			)}
		</StaffLayout>
	);
};
