import React, { useState, useMemo } from 'react';
import {
    Box, Flex, Heading, Text, Input, Button,
    Card, CardBody, CardFooter, Image, Stack, Badge,
    HStack, VStack, SimpleGrid, Icon, useColorModeValue,
    InputGroup, InputLeftElement,
    Modal, ModalOverlay, ModalContent, ModalHeader,
    ModalBody, ModalFooter, ModalCloseButton,
    NumberInput, NumberInputField, NumberInputStepper,
    NumberIncrementStepper, NumberDecrementStepper,
    useDisclosure, useToast, Textarea, Divider,
    FormControl, FormLabel, Select,
} from '@chakra-ui/react';
import { Search, Plus, Package, Laptop } from 'lucide-react';

// ==================== MA'LUMOTLAR ====================
const formatPrice = (price) =>
    new Intl.NumberFormat('uz-UZ').format(price) + " so'm";

const INITIAL_PRODUCTS = [
    {
        id: 'nb1',
        nameUz: 'Lenovo IdeaPad 3 (15.6", i5, 8GB)',
        price: 6800000,
        minOrder: 1,
        stock: 24,
        image: 'https://images.uzum.uz/d50j9c0jsv1neacpdqg0/t_product_540_high.jpg',
        rating: 4.7,
        description: 'Intel Core i5, 8GB RAM, 512GB SSD, Windows 11',
    },
    {
        id: 'nb2',
        nameUz: 'HP Laptop 15s (i3, 4GB, 256GB)',
        price: 4500000,
        minOrder: 1,
        stock: 40,
        image: 'https://images.uzum.uz/d50j9c0jsv1neacpdqg0/t_product_540_high.jpg',
        rating: 4.4,
        description: 'Intel Core i3, 4GB RAM, 256GB SSD, Windows 11 Home',
    },
    {
        id: 'nb3',
        nameUz: 'Asus VivoBook 15 (Ryzen 5, 16GB)',
        price: 8200000,
        minOrder: 1,
        stock: 12,
        image: 'https://images.uzum.uz/d50j9c0jsv1neacpdqg0/t_product_540_high.jpg',
        rating: 4.8,
        description: 'AMD Ryzen 5, 16GB RAM, 512GB SSD, Full HD ekran',
    },
    {
        id: 'nb4',
        nameUz: 'Dell Inspiron 15 (i7, 16GB, 1TB)',
        price: 11500000,
        minOrder: 1,
        stock: 7,
        image: 'https://images.uzum.uz/d50j9c0jsv1neacpdqg0/t_product_540_high.jpg',
        rating: 4.9,
        description: 'Intel Core i7, 16GB RAM, 1TB SSD, IPS ekran',
    },
    {
        id: 'nb5',
        nameUz: 'Acer Aspire 5 (i5, 8GB, 512GB)',
        price: 7100000,
        minOrder: 1,
        stock: 0,
        image: 'https://images.uzum.uz/d50j9c0jsv1neacpdqg0/t_product_540_high.jpg',
        rating: 4.5,
        description: 'Intel Core i5, 8GB RAM, 512GB SSD, Backlit klaviatura',
    },
    {
        id: 'nb6',
        nameUz: 'MSI Modern 14 (i5, 16GB, 512GB)',
        price: 9300000,
        minOrder: 1,
        stock: 18,
        image: 'https://images.uzum.uz/d50j9c0jsv1neacpdqg0/t_product_540_high.jpg',
        rating: 4.6,
        description: 'Intel Core i5, 16GB RAM, 512GB NVMe SSD, ultrathin',
    },
];

// ==================== BUYURTMA MODALI ====================
function OrderModal({ product, isOpen, onClose }) {
    const [qty, setQty] = useState(1);
    const [note, setNote] = useState('');
    const toast = useToast();

    const handleOrder = () => {
        toast({
            title: 'Buyurtma yuborildi!',
            description: `${product.nameUz} — ${qty} ta buyurtma qabul qilindi.`,
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
        });
        onClose();
        setQty(1);
        setNote('');
    };

    if (!product) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
            <ModalOverlay backdropFilter="blur(4px)" />
            <ModalContent borderRadius="2xl">
                <ModalHeader borderBottom="1px solid" borderColor="gray.100" pb={3}>
                    Buyurtma berish
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody pt={4}>
                    <Stack spacing={4}>
                        <HStack spacing={3} align="start">
                            <Image
                                src={product.image}
                                alt={product.nameUz}
                                boxSize="72px"
                                objectFit="cover"
                                borderRadius="lg"
                                fallbackSrc="https://via.placeholder.com/72"
                            />
                            <Box>
                                <Text fontWeight="semibold" fontSize="sm" noOfLines={2}>
                                    {product.nameUz}
                                </Text>
                                <Text fontSize="xs" color="gray.500" mt={1}>{product.description}</Text>
                            </Box>
                        </HStack>
                        <Divider />
                        <Box>
                            <Text fontSize="sm" fontWeight="semibold" mb={1} color="gray.600">
                                Miqdor
                            </Text>
                            <NumberInput min={1} max={product.stock} value={qty} onChange={(_, val) => setQty(val)}>
                                <NumberInputField borderRadius="lg" />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </Box>
                        <Box>
                            <Text fontSize="sm" fontWeight="semibold" mb={1} color="gray.600">Izoh</Text>
                            <Textarea
                                placeholder="Qo'shimcha talablar..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                size="sm"
                                borderRadius="lg"
                                resize="none"
                                rows={3}
                            />
                        </Box>
                        <Box bg="blue.50" borderRadius="lg" p={3}>
                            <Flex justify="space-between">
                                <Text fontSize="sm" color="gray.600">Jami summa:</Text>
                                <Text fontSize="sm" fontWeight="bold" color="blue.600">
                                    {formatPrice(product.price * qty)}
                                </Text>
                            </Flex>
                            <Flex justify="space-between" mt={1}>
                                <Text fontSize="xs" color="gray.400">Mavjud zaxira:</Text>
                                <Text fontSize="xs" color="gray.500">{product.stock} ta</Text>
                            </Flex>
                        </Box>
                    </Stack>
                </ModalBody>
                <ModalFooter gap={2}>
                    <Button variant="outline" onClick={onClose} borderRadius="xl" size="sm">Bekor qilish</Button>
                    <Button colorScheme="blue" onClick={handleOrder} borderRadius="xl" size="sm" leftIcon={<Package size={15} />}>
                        Buyurtma berish
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

// ==================== MAHSULOT QO'SHISH MODALI ====================
function AddProductModal({ isOpen, onClose, onAdd }) {
    const [form, setForm] = useState({
        nameUz: '',
        price: '',
        stock: '',
        description: '',
        image: '',
    });
    const toast = useToast();

    const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

    const handleSubmit = () => {
        if (!form.nameUz || !form.price || !form.stock) {
            toast({ title: 'Majburiy maydonlarni to\'ldiring', status: 'warning', duration: 2500, position: 'top-right', isClosable: true });
            return;
        }
        const newProduct = {
            id: 'nb' + Date.now(),
            nameUz: form.nameUz,
            price: Number(form.price),
            minOrder: 1,
            stock: Number(form.stock),
            image: form.image || 'https://images.uzum.uz/d50j9c0jsv1neacpdqg0/t_product_540_high.jpg',
            rating: 5.0,
            description: form.description,
        };
        onAdd(newProduct);
        toast({ title: 'Mahsulot qo\'shildi!', status: 'success', duration: 2500, position: 'top-right', isClosable: true });
        setForm({ nameUz: '', price: '', stock: '', description: '', image: '' });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
            <ModalOverlay backdropFilter="blur(4px)" />
            <ModalContent borderRadius="2xl">
                <ModalHeader borderBottom="1px solid" borderColor="gray.100" pb={3}>
                    Yangi mahsulot qo'shish
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody pt={4}>
                    <Stack spacing={4}>
                        <FormControl isRequired>
                            <FormLabel fontSize="sm" color="gray.600">Mahsulot nomi</FormLabel>
                            <Input
                                placeholder="Masalan: Lenovo IdeaPad 3"
                                borderRadius="lg"
                                value={form.nameUz}
                                onChange={(e) => handleChange('nameUz', e.target.value)}
                            />
                        </FormControl>
                        <HStack spacing={3}>
                            <FormControl isRequired>
                                <FormLabel fontSize="sm" color="gray.600">Narxi (so'm)</FormLabel>
                                <NumberInput min={0} value={form.price} onChange={(val) => handleChange('price', val)}>
                                    <NumberInputField borderRadius="lg" placeholder="6800000" />
                                </NumberInput>
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel fontSize="sm" color="gray.600">Zaxira (dona)</FormLabel>
                                <NumberInput min={0} value={form.stock} onChange={(val) => handleChange('stock', val)}>
                                    <NumberInputField borderRadius="lg" placeholder="10" />
                                </NumberInput>
                            </FormControl>
                        </HStack>
                        <FormControl>
                            <FormLabel fontSize="sm" color="gray.600">Tavsif</FormLabel>
                            <Textarea
                                placeholder="Mahsulot haqida qisqacha..."
                                value={form.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                borderRadius="lg"
                                resize="none"
                                rows={3}
                                size="sm"
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel fontSize="sm" color="gray.600">Rasm URL (ixtiyoriy)</FormLabel>
                            <Input
                                placeholder="https://..."
                                borderRadius="lg"
                                value={form.image}
                                onChange={(e) => handleChange('image', e.target.value)}
                                size="sm"
                            />
                        </FormControl>
                    </Stack>
                </ModalBody>
                <ModalFooter gap={2}>
                    <Button variant="outline" onClick={onClose} borderRadius="xl" size="sm">Bekor qilish</Button>
                    <Button colorScheme="blue" onClick={handleSubmit} borderRadius="xl" size="sm" leftIcon={<Plus size={15} />}>
                        Qo'shish
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

// ==================== ASOSIY KOMPONENT ====================
export default function FactoryShop() {
    const [products, setProducts] = useState(INITIAL_PRODUCTS);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);

    const orderModal = useDisclosure();
    const addModal = useDisclosure();

    const cardBg = useColorModeValue('white', 'gray.700');
    const borderColor = useColorModeValue('gray.200', 'gray.600');

    const handleOrderClick = (product) => {
        setSelectedProduct(product);
        orderModal.onOpen();
    };

    const handleAddProduct = (newProduct) => {
        setProducts((prev) => [newProduct, ...prev]);
    };

    const filteredProducts = useMemo(() => {
        return products.filter((p) =>
            p.nameUz.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm]);

    return (
        <Box minH="100vh">
            <Box
                mx="auto"
                bg={useColorModeValue('white', 'gray.800')}
                borderRadius="3xl"
                borderWidth="1px"
                borderColor={borderColor}
                boxShadow="xl"
                p={6}
            >
                {/* Header */}
                <Flex
                    direction={{ base: 'column', md: 'row' }}
                    align={{ base: 'start', md: 'center' }}
                    justify="space-between"
                    mb={6}
                    gap={4}
                >
                    <Box>
                        <HStack spacing={2} mb={1}>
                            <Icon as={Laptop} color="blue.500" boxSize={5} />
                            <Heading size="md" fontWeight="bold" color={useColorModeValue('gray.700', 'white')}>
                                Noutbuklar
                            </Heading>
                            <Badge colorScheme="blue" borderRadius="full" px={2}>
                                {filteredProducts.length} ta
                            </Badge>
                        </HStack>
                        <Text fontSize="sm" color="gray.500">Fabrika mahsulotlari katalogi</Text>
                    </Box>

                    <HStack spacing={3}>
                        <InputGroup maxW="280px" size="sm">
                            <InputLeftElement pointerEvents="none">
                                <Search size={15} color="gray" />
                            </InputLeftElement>
                            <Input
                                placeholder="Qidirish..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                borderRadius="xl"
                                bg={useColorModeValue('gray.50', 'gray.700')}
                            />
                        </InputGroup>
                        <Button
                            colorScheme="blue"
                            size="sm"
                            leftIcon={<Plus size={16} />}
                            borderRadius="xl"
                            onClick={addModal.onOpen}
                            px={6}
                        >
                            Qo'shish
                        </Button>
                    </HStack>
                </Flex>

                {/* Mahsulotlar */}
                {filteredProducts.length === 0 ? (
                    <Box textAlign="center" py={16}>
                        <Icon as={Laptop} boxSize={10} color="gray.300" mb={3} />
                        <Text fontSize="lg" color="gray.400">Hech qanday mahsulot topilmadi</Text>
                    </Box>
                ) : (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={5}>
                        {filteredProducts.map((product) => (
                            <Card
                                key={product.id}
                                bg={cardBg}
                                borderWidth="1px"
                                borderColor={borderColor}
                                borderRadius="2xl"
                                overflow="hidden"
                                boxShadow="sm"
                                transition="all 0.2s"
                                _hover={{ transform: 'translateY(-3px)', boxShadow: 'md' }}
                            >
                                <Box position="relative">
                                    <Image
                                        src={product.image}
                                        alt={product.nameUz}
                                        h="160px"
                                        w="full"
                                        objectFit="cover"
                                        fallbackSrc="https://via.placeholder.com/300x160?text=Rasm+yo%27q"
                                    />
                                    {product.stock === 0 && (
                                        <Badge position="absolute" top={2} right={2} colorScheme="red" borderRadius="full" px={2} fontSize="xs">
                                            Tugagan
                                        </Badge>
                                    )}
                                    {product.stock > 0 && product.stock <= 10 && (
                                        <Badge position="absolute" top={2} right={2} colorScheme="orange" borderRadius="full" px={2} fontSize="xs">
                                            Kam qoldi
                                        </Badge>
                                    )}
                                </Box>

                                <CardBody pb={2}>
                                    <Stack spacing={2}>
                                        <Text fontWeight="semibold" fontSize="sm" noOfLines={2} color={useColorModeValue('gray.700', 'white')}>
                                            {product.nameUz}
                                        </Text>
                                        <Text fontSize="xs" color="gray.400" noOfLines={2}>
                                            {product.description}
                                        </Text>
                                        <HStack justify="space-between" align="center">
                                            <Text fontSize="md" fontWeight="bold" color="blue.500">
                                                {formatPrice(product.price)}
                                            </Text>
                                            <Badge colorScheme="yellow" borderRadius="full" px={2} fontSize="xs">
                                                ⭐ {product.rating}
                                            </Badge>
                                        </HStack>
                                        <Text
                                            fontSize="xs"
                                            fontWeight="semibold"
                                            color={product.stock > 10 ? 'green.500' : product.stock > 0 ? 'orange.500' : 'red.500'}
                                        >
                                            Zaxira: {product.stock} ta
                                        </Text>
                                    </Stack>
                                </CardBody>

                                <CardFooter pt={0} px={4} pb={4}>
                                    <Button
                                        w="full"
                                        size="sm"
                                        colorScheme="blue"
                                        variant={product.stock > 0 ? 'solid' : 'outline'}
                                        borderRadius="xl"
                                        isDisabled={product.stock === 0}
                                        leftIcon={<Package size={14} />}
                                        onClick={() => handleOrderClick(product)}
                                    >
                                        {product.stock > 0 ? 'Buyurtma berish' : 'Mavjud emas'}
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </SimpleGrid>
                )}
            </Box>

            {/* Modalar */}
            <OrderModal product={selectedProduct} isOpen={orderModal.isOpen} onClose={orderModal.onClose} />
            <AddProductModal isOpen={addModal.isOpen} onClose={addModal.onClose} onAdd={handleAddProduct} />
        </Box>
    );
}
