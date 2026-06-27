import React, { useEffect, useState } from 'react';
import {
  Box, Flex, Heading, Text, Badge, Button, Spinner,
  Card, CardBody, HStack, VStack, Divider, Image,
  useColorModeValue, useToast, Icon, SimpleGrid,
} from '@chakra-ui/react';
import { ArrowLeft, Package, Tag, Layers } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, Product } from '../api/products';
import { getImageUrl } from '../api/axios';
import { useAuth } from '../context/AuthContext';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('uz-UZ').format(price) + " so'm";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Rolga qarab orqaga yo'l
  const isSeller = user?.role === 'SELLER' || user?.role === 'SUPER_ADMIN';
  const backPath = isSeller ? '/facShop' : '/shop';

  useEffect(() => {
    if (!id) return;
    getProductById(id)
      .then(setProduct)
      .catch(err => {
        toast({
          title: 'Mahsulotni yuklashda xatolik',
          description: err?.response?.data?.message || err.message,
          status: 'error', position: 'top-right', isClosable: true,
        });
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <Flex minH="60vh" align="center" justify="center">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  if (!product) {
    return (
      <Box textAlign="center" py={20}>
        <Text fontSize="xl" color="gray.400">Mahsulot topilmadi</Text>
        <Button mt={4} onClick={() => navigate(backPath)} leftIcon={<ArrowLeft size={16} />} borderRadius="xl">
          Orqaga
        </Button>
      </Box>
    );
  }

  return (
    <Box minH="100vh">
      {/* Header */}
      <Flex align="center" gap={4} mb={6}>
        <Button variant="ghost" leftIcon={<ArrowLeft size={18} />}
          onClick={() => navigate(backPath)} borderRadius="xl" size="sm">
          Orqaga
        </Button>
        <Heading size="lg" fontWeight="bold" color="gray.700">
          Mahsulot tafsiloti
        </Heading>
      </Flex>

      <Flex direction={{ base: 'column', lg: 'row' }} gap={6}>
        {/* Rasm */}
        <Box flex="1">
          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}
            borderRadius="2xl" overflow="hidden" boxShadow="sm">
            <Image
              src={getImageUrl(product.image)}
              alt={product.name}
              w="full"
              h={{ base: '280px', lg: '380px' }}
              objectFit="cover"
              fallbackSrc="https://via.placeholder.com/600x380?text=Rasm+yo%27q"
            />
          </Card>
        </Box>

        {/* Ma'lumotlar */}
        <Card flex="1.4" bg={cardBg} borderWidth="1px" borderColor={borderColor}
          borderRadius="2xl" boxShadow="sm" alignSelf="start">
          <CardBody>
            <VStack align="stretch" spacing={5}>
              {/* Nomi */}
              <Box>
                <Heading size="lg" color="gray.800" mb={2}>{product.name}</Heading>
                {product.description && (
                  <Text color="gray.500" fontSize="sm" lineHeight={1.7}>{product.description}</Text>
                )}
              </Box>

              <Divider />

              {/* Asosiy ko'rsatkichlar */}
              <SimpleGrid columns={2} spacing={4}>
                <Card bg="blue.50" borderRadius="xl" p={4} boxShadow="none">
                  <HStack spacing={3}>
                    <Icon as={Tag} color="blue.500" boxSize={5} />
                    <VStack align="start" spacing={0}>
                      <Text fontSize="xs" color="gray.500">Narxi</Text>
                      <Text fontWeight="bold" fontSize="lg" color="blue.600">
                        {formatPrice(product.price)}
                      </Text>
                    </VStack>
                  </HStack>
                </Card>

                <Card
                  bg={product.stock > 10 ? 'green.50' : product.stock > 0 ? 'orange.50' : 'red.50'}
                  borderRadius="xl" p={4} boxShadow="none">
                  <HStack spacing={3}>
                    <Icon as={Layers} color={product.stock > 10 ? 'green.500' : product.stock > 0 ? 'orange.500' : 'red.500'} boxSize={5} />
                    <VStack align="start" spacing={0}>
                      <Text fontSize="xs" color="gray.500">Zaxira</Text>
                      <Text fontWeight="bold" fontSize="lg"
                        color={product.stock > 10 ? 'green.600' : product.stock > 0 ? 'orange.600' : 'red.600'}>
                        {product.stock} ta
                      </Text>
                    </VStack>
                  </HStack>
                </Card>
              </SimpleGrid>

              {/* Holat badge */}
              <HStack>
                <Badge
                  colorScheme={product.stock > 0 ? 'green' : 'red'}
                  rounded="full" px={4} py={2} fontSize="sm">
                  {product.stock > 0 ? '✅ Mavjud' : '❌ Tugagan'}
                </Badge>
                {product.stock > 0 && product.stock <= 10 && (
                  <Badge colorScheme="orange" rounded="full" px={4} py={2} fontSize="sm">
                    ⚠️ Kam qoldi
                  </Badge>
                )}
              </HStack>

              <Divider />

              {/* Sana */}
              {(product.createdAt || product.updatedAt) && (
                <VStack align="stretch" spacing={1} fontSize="sm" color="gray.500">
                  {product.createdAt && (
                    <HStack justify="space-between">
                      <Text>Qo'shilgan:</Text>
                      <Text>{new Date(product.createdAt).toLocaleString('uz-UZ')}</Text>
                    </HStack>
                  )}
                  {product.updatedAt && (
                    <HStack justify="space-between">
                      <Text>Yangilangan:</Text>
                      <Text>{new Date(product.updatedAt).toLocaleString('uz-UZ')}</Text>
                    </HStack>
                  )}
                </VStack>
              )}

              {/* Tahrirlash tugmasi — faqat seller uchun */}
              {isSeller && (
                <Button colorScheme="blue" borderRadius="xl" leftIcon={<Package size={16} />}
                  onClick={() => navigate(backPath)}>
                  Katalogga qaytish
                </Button>
              )}
            </VStack>
          </CardBody>
        </Card>
      </Flex>
    </Box>
  );
}
