import { Heading, Text, VStack, HStack, Badge } from '@chakra-ui/react';
import { StaffLayout } from './StaffLayout';

export const AdminDashboard = () => {
	return (
		<StaffLayout title='Painel administrativo'>
			<Heading color='white' mb={4}>
				Painel administrativo
			</Heading>
			<Text color='gray.300' mb={8}>
				Visão geral dos fluxos de pedidos do caixa e despacho.
			</Text>

			<VStack spacing={4} align='stretch'>
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
							Caixa
						</Text>
						<Text color='gray.400' fontSize='sm'>
							Acompanhe pedidos aguardando pagamento e confirme quitações.
						</Text>
					</VStack>
					<Badge colorScheme='green'>/cashier</Badge>
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
							Despacho
						</Text>
						<Text color='gray.400' fontSize='sm'>
							Controle dos pedidos prontos para entrega e conclusão.
						</Text>
					</VStack>
					<Badge colorScheme='blue'>/dispatcher</Badge>
				</HStack>
			</VStack>
		</StaffLayout>
	);
};
