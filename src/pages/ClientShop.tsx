import React, { useState, useMemo, useEffect } from 'react';
import {
  Box, Flex, Heading, Text, Input, Select, Button,
  Card, CardBody, CardFooter, Image, Stack, Badge,
  HStack, VStack, SimpleGrid, Divider, Icon,
  useColorModeValue, InputGroup, InputLeftElement,
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalFooter, ModalCloseButton,
  NumberInput, NumberInputField, NumberInputStepper,
  NumberIncrementStepper, NumberDecrementStepper,
  useDisclosure, useToast, Spinner,
  FormControl, FormLabel,
} from '@chakra-ui/react';
import { Search, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getProducts, Product } from '../api/products';
import { createOrder } from '../api/orders';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../api/axios';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('uz-UZ').format(price) + " so'm";

// ==================== BUYURTMA MODALI ====================
interface OrderModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onOrdered: () => void;
}

function OrderModal({ product, isOpen, onClose, onOrdered }: OrderModalProps) {
  const [qty, setQty] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const { user } = useAuth();

  useEffect(() => { if (isOpen) setQty(1); }, [isOpen]);

  const handleOrder = async () => {
    if (!product || !user) return;
    setIsLoading(true);
    try {
      await createOrder({
        productId: product.id,
        quantity: qty,
        clientId: user.id,
        sellerId: '', // backend o'zi aniqlab olishi mumkin yoki product.sellerId
      });
      toast({
        title: 'Buyurtma yuborildi!',
        description: `${product.name} — ${qty} ta`,
        status: 'success', duration: 3000, isClosable: true, position: 'top-right',
      });
      onOrdered();
      onClose();
    } catch (err: any) {
      toast({
        title: 'Xatolik',
        description: err?.response?.data?.message || err.message,
        status: 'error', duration: 3000, isClosable: true, position: 'top-right',
      });
    } finally {
      setIsLoading(false);
    }
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
              <Image src={getImageUrl(product.image)} alt={product.name} boxSize="72px"
                objectFit="cover" borderRadius="lg" fallbackSrc="https://via.placeholder.com/72" />
              <Box>
                <Text fontWeight="semibold" fontSize="sm" noOfLines={2}>{product.name}</Text>
                <Text fontSize="xs" color="gray.500" mt={1}>{product.description}</Text>
              </Box>
            </HStack>
            <Divider />
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="semibold" color="gray.600">Miqdor</FormLabel>
              <NumberInput min={1} max={product.stock} value={qty}
                onChange={(_, val) => setQty(val || 1)}>
                <NumberInputField borderRadius="lg" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
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
          <Button colorScheme="blue" onClick={handleOrder} borderRadius="xl" size="sm"
            isLoading={isLoading} leftIcon={<Package size={15} />}>
            Buyurtma berish
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// ==================== ASOSIY KOMPONENT ====================
export default function ClientShop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('price_asc');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const orderModal = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();

  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err: any) {
      toast({
        title: 'Mahsulotlarni yuklashda xatolik',
        description: err?.response?.data?.message || err.message,
        status: 'error', position: 'top-right', isClosable: true,
      });
    } finally {
      setIsPageLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  const handleOrderClick = (product: Product) => {
    setSelectedProduct(product);
    orderModal.onOpen();
  };

  const filteredAndSorted = useMemo(() => {
    let list = products.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    switch (sortBy) {
      case 'price_asc': list.sort((a, b) => a.price - b.price); break;
      case 'price_desc': list.sort((a, b) => b.price - a.price); break;
    }
    return list;
  }, [products, searchTerm, sortBy]);

  if (isPageLoading) {
    return (
      <Flex minH="60vh" align="center" justify="center">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Box minH="100vh">
      <Box w="full" bg="white" borderRadius="3xl"
        borderWidth="2px" borderColor="gray.200" boxShadow="xl" p={6}>

        {/* Header */}
        <Flex direction={{ base: 'column', md: 'row' }} align="center"
          justify="space-between" mb={6} gap={4}>
          <Heading size="md" fontWeight="bold" color="blue.600">Xaridlar</Heading>
          <HStack spacing={3}>
            <InputGroup maxW="300px" size="md">
              <InputLeftElement pointerEvents="none">
                <Search size={18} color="gray" />
              </InputLeftElement>
              <Input placeholder="Mahsulot izlash..." value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)} borderRadius="xl"
                bg="gray.50" borderColor="gray.300"
                _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce' }} />
            </InputGroup>
            <Select size="md" value={sortBy} onChange={e => setSortBy(e.target.value)}
              borderRadius="xl" bg="gray.50" borderColor="gray.300" maxW="200px">
              <option value="price_asc">Narx: arzon → qimmat</option>
              <option value="price_desc">Narx: qimmat → arzon</option>
            </Select>
          </HStack>
        </Flex>

        <Text fontSize="sm" color="gray.500" mb={4}>{filteredAndSorted.length} ta mahsulot</Text>

        {filteredAndSorted.length === 0 ? (
          <Box textAlign="center" py={16}>
            <Icon as={Package} boxSize={10} color="gray.300" mb={3} />
            <Text fontSize="lg" color="gray.400">Hech qanday mahsulot topilmadi</Text>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
            {filteredAndSorted.map(product => (
              <Card key={product.id} bg={cardBg} borderWidth="2px"
                borderColor={borderColor} borderRadius="2xl" overflow="hidden"
                boxShadow="md" transition="all 0.2s" cursor="pointer"
                _hover={{ transform: 'translateY(-4px)', boxShadow: 'lg' }}
                onClick={() => navigate(`/shop/${product.id}`)}>

                <Image src={getImageUrl(product.image)} alt={product.name} h="200px" w="full"
                  objectFit="cover"
                  fallbackSrc="https://via.placeholder.com/300x200?text=Rasm+mavjud+emas" />

                <CardBody>
                  <Stack spacing={2}>
                    <Heading size="sm" noOfLines={2}>{product.name}</Heading>
                    <Text fontSize="sm" color="gray.500" noOfLines={2}>{product.description}</Text>
                    <Text fontSize="lg" fontWeight="bold" color="blue.600">
                      {formatPrice(product.price)}
                    </Text>
                    <Text fontSize="xs" fontWeight="semibold"
                      color={product.stock > 10 ? 'green.500' : product.stock > 0 ? 'orange.500' : 'red.500'}>
                      Zaxira: {product.stock} ta
                    </Text>
                  </Stack>
                </CardBody>

                <CardFooter onClick={e => e.stopPropagation()}>
                  <Button w="full" size="md" colorScheme="blue"
                    variant={product.stock > 0 ? 'outline' : 'ghost'}
                    borderRadius="xl" isDisabled={product.stock === 0}
                    leftIcon={<Package size={15} />}
                    onClick={() => handleOrderClick(product)}>
                    {product.stock > 0 ? 'Buyurtma berish' : 'Mavjud emas'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Box>

      <OrderModal
        product={selectedProduct}
        isOpen={orderModal.isOpen}
        onClose={orderModal.onClose}
        onOrdered={loadProducts}
      />
    </Box>
  );
}
