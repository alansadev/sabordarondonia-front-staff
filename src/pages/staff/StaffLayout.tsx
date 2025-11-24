import type { ReactNode } from 'react';
import {
	Box,
	Container,
	Flex,
	Heading,
	Button,
	Text,
	HStack,
} from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { api } from '../../lib/api';

interface StaffLayoutProps {
	title: string;
	children: ReactNode;
}

export const StaffLayout = ({ title, children }: StaffLayoutProps) => {
	const navigate = useNavigate();
	const location = useLocation();
	const { data: user, isLoading } = useCurrentUser();

	const handleLogout = async () => {
		try {
			await api.post('/auth/logout');
		} catch {
			// ignora erro de logout
		} finally {
			navigate('/staff/login');
		}
	};

	const pathname = location.pathname;

	if (isLoading) {
		return (
			<Box w='100%' minH='100vh' bg='gray.900' py={4}>
				<Container maxW='960px'>
					<Text color='gray.300'>Carregando...</Text>
				</Container>
			</Box>
		);
	}

	return (
		<Box w='100%' minH='100vh' bg='gray.900' py={4}>
			<Container maxW='960px'>
				<Flex as='header' align='center' justify='space-between' mb={6}>
					<Box>
						<Heading size='md' color='white'>
							Sabor de Rondônia - Staff
						</Heading>
						<Text fontSize='sm' color='gray.400'>
							{title}
						</Text>
					</Box>
					<HStack spacing={3}>
						{user && (
							<Text fontSize='xs' color='gray.300'>
								{user.name}
								{user.role ? ` · ${user.role.toLowerCase()}` : ''}
							</Text>
						)}
						<Text fontSize='xs' color='gray.500'>
							Rota: {pathname}
						</Text>
						<Button
							size='sm'
							variant='outline'
							colorScheme='red'
							onClick={handleLogout}
						>
							Sair
						</Button>
					</HStack>
				</Flex>

				{children}
			</Container>
		</Box>
	);
};
