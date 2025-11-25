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
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { StaffLayout } from './StaffLayout';

interface Product {
	id: string;
	name: string;
	price: number;
	category?: string;
	stock?: number;
	is_active?: boolean;
}

const formatPrice = (value: number) => {
	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
	}).format(value);
};

export const AdminProducts = () => {
	const navigate = useNavigate();
	const [products, setProducts] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [name, setName] = useState('');
	const [price, setPrice] = useState('');
	const [stock, setStock] = useState('');
	const [category, setCategory] = useState('');
	const [editingId, setEditingId] = useState<string | null>(null);
	const [activeFilter, setActiveFilter] = useState<string>('all');

	const fetchProducts = async () => {
		setIsLoading(true);
		setError(null);
		try {
			const { data } = await api.get<Product[]>('/products');
			setProducts(data || []);
		} catch (err) {
			console.error('Erro ao carregar produtos', err);
			setError('Não foi possível carregar os produtos.');
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchProducts();
	}, []);

	const resetForm = () => {
		setName('');
		setPrice('');
		setStock('');
		setCategory('');
		setEditingId(null);
	};

	const handleSubmit = async () => {
		try {
			const normalized = price.replace(/\D/g, '');
			const priceNumber = Number(normalized) / 100;
			const stockNumber = stock ? Number(stock) : undefined;
			if (!name || !category || Number.isNaN(priceNumber)) {
				setError('Preencha nome, categoria e um preço válido.');
				return;
			}

			const formData = new FormData();
			formData.append('name', name);
			formData.append('category', category);
			formData.append('price', String(priceNumber));
			if (stockNumber !== undefined && !Number.isNaN(stockNumber)) {
				formData.append('stock', String(stockNumber));
			}

			// TODO: adicionar suporte a imagem quando o fluxo estiver definido
			// formData.append('image', file)

			if (editingId) {
				await api.patch(`/products/${editingId}`, formData, {
					headers: { 'Content-Type': 'multipart/form-data' },
				});
			} else {
				await api.post('/products', formData, {
					headers: { 'Content-Type': 'multipart/form-data' },
				});
			}

			resetForm();
			fetchProducts();
		} catch (err) {
			console.error('Erro ao salvar produto', err);
			setError('Erro ao salvar produto.');
		}
	};

	const handleEdit = (product: Product) => {
		setEditingId(product.id);
		setName(product.name);
		// product.price vem em centavos; convertemos para formato "0,00"
		setPrice((product.price / 100).toFixed(2).replace('.', ','));
		setStock(product.stock ? String(product.stock) : '');
		setCategory(product.category ?? '');
	};

	const handleToggleActive = async (product: Product) => {
		try {
			await api.patch(`/products/${product.id}`, {
				is_active: !product.is_active,
			});
			fetchProducts();
		} catch (err) {
			console.error('Erro ao atualizar produto', err);
			setError('Erro ao atualizar produto.');
		}
	};

	const filteredProducts = products.filter((p) => {
		if (activeFilter === 'active') return p.is_active;
		if (activeFilter === 'inactive') return !p.is_active;
		return true;
	});

	return (
		<StaffLayout title='Admin - produtos'>
			<HStack justify='space-between' mb={4} align='center'>
				<Heading color='white' size='md'>
					Produtos
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
							placeholder='Nome do produto'
							bg='gray.900'
							borderColor='gray.700'
							color='white'
							size='sm'
						/>
					</FormControl>

					<FormControl>
						<FormLabel color='gray.200'>Categoria</FormLabel>
						<Input
							value={category}
							onChange={(e) => setCategory(e.target.value)}
							placeholder='Ex: Lanche, Bebida...'
							bg='gray.900'
							borderColor='gray.700'
							color='white'
							size='sm'
						/>
					</FormControl>

					<FormControl>
						<FormLabel color='gray.200'>Preço (R$)</FormLabel>
						<Input
							value={price}
							onChange={(e) => {
								const digits = e.target.value.replace(/\D/g, '');
								if (!digits) {
									setPrice('');
									return;
								}
								const numberValue = Number(digits) / 100;
								setPrice(numberValue.toFixed(2).replace('.', ','));
							}}
							placeholder='0,00'
							bg='gray.900'
							borderColor='gray.700'
							color='white'
							size='sm'
						/>
					</FormControl>

					<FormControl>
						<FormLabel color='gray.200'>Estoque (opcional)</FormLabel>
						<Input
							value={stock}
							onChange={(e) => setStock(e.target.value)}
							placeholder='0'
							bg='gray.900'
							borderColor='gray.700'
							color='white'
							size='sm'
						/>
					</FormControl>

					<HStack justify='flex-end' spacing={2}>
						{editingId && (
							<Button size='sm' variant='ghost' onClick={resetForm}>
								Cancelar
							</Button>
						)}
						<Button size='sm' colorScheme='yellow' onClick={handleSubmit}>
							{editingId ? 'Salvar alterações' : 'Criar produto'}
						</Button>
					</HStack>
				</VStack>
			</Box>

			<HStack justify='space-between' mb={3}>
				<Text color='gray.300' fontSize='sm'>
					Lista de produtos
				</Text>
				<Select
					size='xs'
					maxW='160px'
					bg='gray.800'
					borderColor='gray.700'
					color='white'
					value={activeFilter}
					onChange={(e) => setActiveFilter(e.target.value)}
				>
					<option value='all'>Todos</option>
					<option value='active'>Ativos</option>
					<option value='inactive'>Inativos</option>
				</Select>
			</HStack>

			{isLoading ? (
				<HStack justify='center' mt={10}>
					<Spinner color='green.400' />
					<Text color='gray.300'>Carregando produtos...</Text>
				</HStack>
			) : filteredProducts.length === 0 ? (
				<Text color='gray.400'>Nenhum produto encontrado.</Text>
			) : (
				<VStack spacing={3} align='stretch'>
					{filteredProducts.map((product) => (
						<Box
							key={product.id}
							bg='gray.800'
							borderRadius='lg'
							p={3}
							borderWidth='1px'
							borderColor='gray.700'
						>
							<HStack justify='space-between' mb={1}>
								<Text color='white' fontWeight='bold' fontSize='sm'>
									{product.name}
								</Text>
								<Button
									size='xs'
									variant='outline'
									colorScheme={product.is_active ? 'red' : 'green'}
									onClick={() => handleToggleActive(product)}
								>
									{product.is_active ? 'Inativar' : 'Ativar'}
								</Button>
							</HStack>
							<HStack justify='space-between'>
								<Text color='green.300' fontSize='sm'>
									{formatPrice((product.price ?? 0) / 100)}
								</Text>
								<Button
									size='xs'
									variant='ghost'
									onClick={() => handleEdit(product)}
								>
									Editar
								</Button>
							</HStack>
						</Box>
					))}
				</VStack>
			)}
		</StaffLayout>
	);
};
