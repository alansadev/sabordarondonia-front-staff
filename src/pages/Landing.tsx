import {
	Box,
	Container,
	Heading,
	Text,
	Button,
	VStack,
	Center,
	HStack,
} from '@chakra-ui/react';
import { ArrowRight, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Landing = () => {
	const navigate = useNavigate();

	return (
		<Box
			w='100%'
			minH='100vh'
			bg='green.600'
			display='flex'
			justifyContent='center'
		>
			<Container maxW='480px' p={0} bg='white' minH='100vh' position='relative'>
				{/* Hero Section com Fundo Verde */}
				<Box
					bg='green.600'
					h='40vh'
					borderBottomRadius='50px'
					position='relative'
					px={6}
					pt={10}
					display='flex'
					flexDirection='column'
					alignItems='center'
				>
					<Center bg='white' p={4} borderRadius='full' shadow='lg' mb={6}>
						<Utensils size={40} color='#2F855A' /> {/* Icone Verde */}
					</Center>

					<Heading color='white' textAlign='center' fontSize='3xl' mb={2}>
						Sabor de Rondônia
					</Heading>
					<Text color='green.100' textAlign='center' fontSize='md'>
						O verdadeiro sabor da nossa terra, agora na palma da sua mão.
					</Text>
				</Box>

				{/* Conteúdo / Explicação */}
				<VStack spacing={8} px={8} mt={4}>
					{/* Card Flutuante */}
					<Box
						bg='white'
						p={6}
						borderRadius='xl'
						shadow='xl'
						w='100%'
						textAlign='center'
					>
						<Text fontSize='lg' fontWeight='bold' color='gray.700' mb={2}>
							Projeto Acadêmico
						</Text>
						<Text fontSize='sm' color='gray.500' lineHeight='tall'>
							Este é um sistema de autoatendimento desenvolvido para a Feira de
							empreendedorismo 2025.
						</Text>
					</Box>

					<VStack spacing={4} w='100%'>
						<Text
							fontSize='sm'
							fontWeight='bold'
							color='gray.400'
							textTransform='uppercase'
						>
							Como funciona?
						</Text>

						<HStack w='100%' bg='gray.50' p={3} borderRadius='lg'>
							<Center
								bg='orange.100'
								w='40px'
								h='40px'
								borderRadius='full'
								mr={3}
							>
								<Text fontSize='lg'>🍔</Text>
							</Center>
							<Text fontSize='sm' color='gray.600'>
								Escolha seus produtos
							</Text>
						</HStack>

						<HStack w='100%' bg='gray.50' p={3} borderRadius='lg'>
							<Center
								bg='orange.100'
								w='40px'
								h='40px'
								borderRadius='full'
								mr={3}
							>
								<Text fontSize='lg'>📱</Text>
							</Center>
							<Text fontSize='sm' color='gray.600'>
								Identifique-se com seu celular
							</Text>
						</HStack>

						<HStack w='100%' bg='gray.50' p={3} borderRadius='lg'>
							<Center
								bg='orange.100'
								w='40px'
								h='40px'
								borderRadius='full'
								mr={3}
							>
								<Text fontSize='lg'>💸</Text>
							</Center>
							<Text fontSize='sm' color='gray.600'>
								Pague no caixa e retire
							</Text>
						</HStack>
					</VStack>

					{/* Botão de Ação */}
					<Button
						w='100%'
						size='lg'
						colorScheme='orange'
						rightIcon={<ArrowRight size={20} />}
						onClick={() => navigate('/menu')}
						borderRadius='full'
						shadow='md'
						mt={4}
					>
						VER CARDÁPIO
					</Button>
				</VStack>

				<Center py={8}>
					<Text fontSize='xs' color='gray.400'>
						© 2025 Sabor de Rondônia
					</Text>
				</Center>
			</Container>
		</Box>
	);
};
