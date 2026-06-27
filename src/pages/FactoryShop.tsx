import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  FormControl, FormLabel, Spinner, AlertDialog,
  AlertDialogBody, AlertDialogFooter, AlertDialogHeader,
  AlertDialogContent, AlertDialogOverlay, IconButton,
} from '@chakra-ui/react';
import { Search, Plus, Package, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  getProducts, createProduct, updateProduct, deleteProduct,
  Product, ProductPayload,
} from '../api/products';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../api/axios';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('uz-UZ').format(price) + " so'm";

// ==================== MAHSULOT QO'SHISH / TAHRIRLASH MODALI ====================
interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  editProduct?: Product | null;
  sellerId: string;
}

function ProductModal({ isOpen, onClose, onSaved, editProduct, sellerId }: ProductModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  // Tahrirlash rejimida formani to'ldirish
  useEffect(() => {
    if (editProduct) {
      setName(editProduct.name);
      setDescription(editProduct.description);
      setPrice(String(editProduct.price));
      setStock(String(editProduct.stock));
      setImageFile(null);
    } else {
      setName(''); setDescription(''); setPrice(''); setStock(''); setImageFile(null);
    }
  }, [editProduct, isOpen]);

  const handleSubmit = async () => {
    if (!name || !price || !stock) {
      toast({ title: "Majburiy maydonlarni to'ldiring", status: 'warning', position: 'top-right', isClosable: true });
      return;
    }
    setIsLoading(true);
    try {
      const payload: ProductPayload = {
        name, description,
        price: Number(price),
        stock: Number(stock),
        image: imageFile,
        sellerId,
      };
      if (editProduct) {
        await updateProduct(editProduct.id, payload);
        toast({ title: 'Mahsulot yangilandi', status: 'success', position: 'top-right', isClosable: true });
      } else {
        await createProduct(payload);
        toast({ title: "Mahsulot qo'shildi", status: 'success', position: 'top-right', isClosable: true });
      }
      onSaved();
      onClose();
    } catch (err: any) {
      toast({
        title: 'Xatolik',
        description: err?.response?.data?.message || err.message,
        status: 'error', position: 'top-right', isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent borderRadius="2xl">
        <ModalHeader borderBottom="1px solid" borderColor="gray.100" pb={3}>
          {editProduct ? 'Mahsulotni tahrirlash' : "Yangi mahsulot qo'shish"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pt={4}>
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel fontSize="sm" color="gray.600">Nomi</FormLabel>
              <Input borderRadius="lg" value={name} onChange={e => setName(e.target.value)} placeholder="Mahsulot nomi" />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm" color="gray.600">Tavsif</FormLabel>
              <Textarea borderRadius="lg" value={description} onChange={e => setDescription(e.target.value)}
                placeholder="Tavsif..." resize="none" rows={3} size="sm" />
            </FormControl>
            <HStack spacing={3}>
              <FormControl isRequired>
                <FormLabel fontSize="sm" color="gray.600">Narxi (so'm)</FormLabel>
                <NumberInput min={0} value={price} onChange={val => setPrice(val)}>
                  <NumberInputField borderRadius="lg" placeholder="0" />
                </NumberInput>
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="sm" color="gray.600">Zaxira (dona)</FormLabel>
                <NumberInput min={0} value={stock} onChange={val => setStock(val)}>
                  <NumberInputField borderRadius="lg" placeholder="0" />
                </NumberInput>
              </FormControl>
            </HStack>
            <FormControl>
              <FormLabel fontSize="sm" color="gray.600">Rasm (fayl)</FormLabel>
              <Input type="file" accept="image/*" borderRadius="lg" size="sm" p={1}
                onChange={e => setImageFile(e.target.files?.[0] ?? null)} />
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter gap={2}>
          <Button variant="outline" onClick={onClose} borderRadius="xl" size="sm">Bekor qilish</Button>
          <Button colorScheme="blue" onClick={handleSubmit} borderRadius="xl" size="sm"
            isLoading={isLoading} leftIcon={<Plus size={15} />}>
            {editProduct ? 'Saqlash' : "Qo'shish"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

// ==================== O'CHIRISH TASDIQLASH ====================
interface DeleteAlertProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

function DeleteAlert({ isOpen, onClose, onConfirm, isLoading }: DeleteAlertProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
      <AlertDialogOverlay>
        <AlertDialogContent borderRadius="2xl">
          <AlertDialogHeader fontSize="lg" fontWeight="bold">Mahsulotni o'chirish</AlertDialogHeader>
          <AlertDialogBody>Ushbu mahsulotni o'chirishni tasdiqlaysizmi? Bu amalni qaytarib bo'lmaydi.</AlertDialogBody>
          <AlertDialogFooter gap={2}>
            <Button ref={cancelRef} onClick={onClose} borderRadius="xl" size="sm">Bekor qilish</Button>
            <Button colorScheme="red" onClick={onConfirm} borderRadius="xl" size="sm" isLoading={isLoading}>
              O'chirish
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

// ==================== ASOSIY KOMPONENT ====================
export default function FactoryShop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const productModal = useDisclosure();
  const deleteAlert = useDisclosure();
  const toast = useToast();
  const { user } = useAuth();
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

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    productModal.onOpen();
  };

  const handleAddClick = () => {
    setEditingProduct(null);
    productModal.onOpen();
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    deleteAlert.onOpen();
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await deleteProduct(deletingId);
      toast({ title: "Mahsulot o'chirildi", status: 'success', position: 'top-right', isClosable: true });
      loadProducts();
    } catch (err: any) {
      toast({
        title: 'Xatolik',
        description: err?.response?.data?.message || err.message,
        status: 'error', position: 'top-right', isClosable: true,
      });
    } finally {
      setIsDeleting(false);
      deleteAlert.onClose();
      setDeletingId(null);
    }
  };

  const filteredProducts = useMemo(
    () => products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [products, searchTerm]
  );

  if (isPageLoading) {
    return (
      <Flex minH="60vh" align="center" justify="center">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Box minH="100vh">
      <Box mx="auto" bg={useColorModeValue('white', 'gray.800')}
        borderRadius="3xl" borderWidth="1px" borderColor={borderColor}
        boxShadow="xl" p={6}>

        {/* Header */}
        <Flex direction={{ base: 'column', md: 'row' }} align={{ base: 'start', md: 'center' }}
          justify="space-between" mb={6} gap={4}>
          <Box>
            <HStack spacing={2} mb={1}>
              <Icon as={Package} color="blue.500" boxSize={5} />
              <Heading size="md" fontWeight="bold" color={useColorModeValue('gray.700', 'white')}>
                Mahsulotlar
              </Heading>
              <Badge colorScheme="blue" borderRadius="full" px={2}>{filteredProducts.length} ta</Badge>
            </HStack>
            <Text fontSize="sm" color="gray.500">Fabrika mahsulotlari katalogi</Text>
          </Box>

          <HStack spacing={3}>
            <InputGroup maxW="280px" size="sm">
              <InputLeftElement pointerEvents="none">
                <Search size={15} color="gray" />
              </InputLeftElement>
              <Input placeholder="Qidirish..." value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)} borderRadius="xl"
                bg={useColorModeValue('gray.50', 'gray.700')} />
            </InputGroup>
            <Button colorScheme="blue" size="sm" leftIcon={<Plus size={16} />}
              borderRadius="xl" onClick={handleAddClick} px={6}>
              Qo'shish
            </Button>
          </HStack>
        </Flex>

        {/* Mahsulotlar */}
        {filteredProducts.length === 0 ? (
          <Box textAlign="center" py={16}>
            <Icon as={Package} boxSize={10} color="gray.300" mb={3} />
            <Text fontSize="lg" color="gray.400">Hech qanday mahsulot topilmadi</Text>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={5}>
            {filteredProducts.map(product => (
              <Card key={product.id} bg={cardBg} borderWidth="1px" borderColor={borderColor}
                borderRadius="2xl" overflow="hidden" boxShadow="sm"
                transition="all 0.2s" cursor="pointer"
                _hover={{ transform: 'translateY(-3px)', boxShadow: 'md' }}
                onClick={() => navigate(`/facShop/${product.id}`)}>

                <Box position="relative">
                  <Image src={getImageUrl(product.image)} alt={product.name} h="160px" w="full"
                    objectFit="cover" fallbackSrc="https://via.placeholder.com/300x160?text=Rasm+yo%27q" />
                  {product.stock === 0 && (
                    <Badge position="absolute" top={2} right={2} colorScheme="red"
                      borderRadius="full" px={2} fontSize="xs">Tugagan</Badge>
                  )}
                  {product.stock > 0 && product.stock <= 10 && (
                    <Badge position="absolute" top={2} right={2} colorScheme="orange"
                      borderRadius="full" px={2} fontSize="xs">Kam qoldi</Badge>
                  )}
                  {/* Tahrirlash / O'chirish tugmalari */}
                  <HStack position="absolute" top={2} left={2} spacing={1}
                    onClick={e => e.stopPropagation()}>
                    <IconButton aria-label="Tahrirlash" icon={<Edit2 size={13} />}
                      size="xs" colorScheme="blue" borderRadius="lg"
                      onClick={() => handleEditClick(product)} />
                    <IconButton aria-label="O'chirish" icon={<Trash2 size={13} />}
                      size="xs" colorScheme="red" borderRadius="lg"
                      onClick={() => handleDeleteClick(product.id)} />
                  </HStack>
                </Box>

                <CardBody pb={2}>
                  <Stack spacing={2}>
                    <Text fontWeight="semibold" fontSize="sm" noOfLines={2}
                      color={useColorModeValue('gray.700', 'white')}>{product.name}</Text>
                    <Text fontSize="xs" color="gray.400" noOfLines={2}>{product.description}</Text>
                    <Text fontSize="md" fontWeight="bold" color="blue.500">
                      {formatPrice(product.price)}
                    </Text>
                    <Text fontSize="xs" fontWeight="semibold"
                      color={product.stock > 10 ? 'green.500' : product.stock > 0 ? 'orange.500' : 'red.500'}>
                      Zaxira: {product.stock} ta
                    </Text>
                  </Stack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Box>

      {/* Modalar */}
      <ProductModal
        isOpen={productModal.isOpen}
        onClose={productModal.onClose}
        onSaved={loadProducts}
        editProduct={editingProduct}
        sellerId={user?.id ?? ''}
      />
      <DeleteAlert
        isOpen={deleteAlert.isOpen}
        onClose={deleteAlert.onClose}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </Box>
  );
}
