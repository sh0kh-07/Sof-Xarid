import React, { useEffect, useState } from 'react';
import {
  Box, Flex, Heading, Text, Badge, Button, Spinner,
  Card, CardBody, HStack, VStack, Divider, Image,
  useColorModeValue, useToast, Select, Icon,
} from '@chakra-ui/react';
import { ArrowLeft, Package, User, Clock } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById, updateOrderStatus, deleteOrder, Order, OrderStatus } from '../api/orders';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../api/axios';

const statusLabel = (s: OrderStatus) => {
  switch (s) {
    case 'PENDING': return 'Kutilmoqda';
    case 'CONFIRMED': return 'Tasdiqlangan';
    case 'PROCESSING': return 'Jarayonda';
    case 'SHIPPED': return 'Yetkazilmoqda';
    case 'DELIVERED': return 'Yetkazilgan';
    case 'CANCELLED': return 'Bekor qilingan';
    default: return s;
  }
};

const statusColor = (s: OrderStatus) => {
  switch (s) {
    case 'PENDING': return 'purple';
    case 'CONFIRMED': return 'blue';
    case 'PROCESSING': return 'cyan';
    case 'SHIPPED': return 'yellow';
    case 'DELIVERED': return 'green';
    case 'CANCELLED': return 'red';
    default: return 'gray';
  }
};

const ALL_STATUSES: OrderStatus[] = [
  'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED',
];

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusValue, setStatusValue] = useState<OrderStatus>('PENDING');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const isSeller = user?.role === 'SELLER' || user?.role === 'SUPER_ADMIN';
  const backPath = isSeller ? '/facOrder' : '/order';

  useEffect(() => {
    if (!id) return;
    getOrderById(id)
      .then(data => {
        setOrder(data);
        setStatusValue(data.status);
      })
      .catch(err => {
        toast({ title: 'Buyurtmani yuklashda xatolik',
          description: err?.response?.data?.message || err.message,
          status: 'error', position: 'top-right', isClosable: true });
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleStatusSave = async () => {
    if (!order) return;
    setIsSaving(true);
    try {
      const updated = await updateOrderStatus(order.id, statusValue);
      setOrder(updated);
      toast({ title: 'Holat yangilandi', status: 'success', position: 'top-right', isClosable: true });
    } catch (err: any) {
      toast({ title: 'Xatolik', description: err?.response?.data?.message || err.message,
        status: 'error', position: 'top-right', isClosable: true });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!order) return;
    setIsDeleting(true);
    try {
      await deleteOrder(order.id);
      toast({ title: "Buyurtma o'chirildi", status: 'success', position: 'top-right', isClosable: true });
      navigate(backPath);
    } catch (err: any) {
      toast({ title: 'Xatolik', description: err?.response?.data?.message || err.message,
        status: 'error', position: 'top-right', isClosable: true });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <Flex minH="60vh" align="center" justify="center">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  if (!order) {
    return (
      <Box textAlign="center" py={20}>
        <Text fontSize="xl" color="gray.400">Buyurtma topilmadi</Text>
        <Button mt={4} onClick={() => navigate(-1)} leftIcon={<ArrowLeft size={16} />}>
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
          Buyurtma tafsiloti
        </Heading>
      </Flex>

      <Flex direction={{ base: 'column', lg: 'row' }} gap={6}>
        {/* Asosiy ma'lumot */}
        <Card flex="2" bg={cardBg} borderWidth="1px" borderColor={borderColor}
          borderRadius="2xl" boxShadow="sm">
          <CardBody>
            <VStack align="stretch" spacing={5}>
              {/* Mahsulot */}
              <Box>
                <Text fontSize="xs" color="gray.400" fontWeight="semibold" mb={3} textTransform="uppercase">
                  Mahsulot
                </Text>
                <HStack spacing={4} align="start">
                  {order.product?.image && (
                    <Image src={getImageUrl(order.product.image)} alt={order.product.name}
                      boxSize="80px" borderRadius="xl" objectFit="cover"
                      fallbackSrc="https://via.placeholder.com/80" />
                  )}
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold" fontSize="lg">{order.product?.name ?? order.productId}</Text>
                    {order.product && (
                      <Text color="blue.500" fontWeight="semibold">
                        {new Intl.NumberFormat('uz-UZ').format(order.product.price)} so'm / dona
                      </Text>
                    )}
                  </VStack>
                </HStack>
              </Box>

              <Divider />

              {/* Miqdor va summa */}
              <Box>
                <Text fontSize="xs" color="gray.400" fontWeight="semibold" mb={3} textTransform="uppercase">
                  Buyurtma
                </Text>
                <HStack spacing={8}>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="xs" color="gray.500">Miqdor</Text>
                    <Text fontWeight="bold" fontSize="xl">{order.quantity} ta</Text>
                  </VStack>
                  {order.product && (
                    <VStack align="start" spacing={0}>
                      <Text fontSize="xs" color="gray.500">Jami summa</Text>
                      <Text fontWeight="bold" fontSize="xl" color="blue.600">
                        {new Intl.NumberFormat('uz-UZ').format(order.product.price * order.quantity)} so'm
                      </Text>
                    </VStack>
                  )}
                </HStack>
              </Box>

              <Divider />

              {/* Foydalanuvchilar */}
              <Box>
                <Text fontSize="xs" color="gray.400" fontWeight="semibold" mb={3} textTransform="uppercase">
                  Ishtirokchilar
                </Text>
                <HStack spacing={8}>
                  <VStack align="start" spacing={1}>
                    <HStack spacing={2}>
                      <Icon as={User} boxSize={4} color="blue.400" />
                      <Text fontSize="xs" color="gray.500">Mijoz</Text>
                    </HStack>
                    <Text fontWeight="medium">{order.client?.full_name ?? order.clientId}</Text>
                    {order.client && (
                      <Text fontSize="xs" color="gray.400">@{order.client.username}</Text>
                    )}
                  </VStack>
                  <VStack align="start" spacing={1}>
                    <HStack spacing={2}>
                      <Icon as={Package} boxSize={4} color="green.400" />
                      <Text fontSize="xs" color="gray.500">Sotuvchi</Text>
                    </HStack>
                    <Text fontWeight="medium">{order.seller?.full_name ?? order.sellerId}</Text>
                    {order.seller && (
                      <Text fontSize="xs" color="gray.400">@{order.seller.username}</Text>
                    )}
                  </VStack>
                </HStack>
              </Box>

              <Divider />

              {/* Vaqt */}
              <HStack spacing={8}>
                {order.createdAt && (
                  <VStack align="start" spacing={0}>
                    <HStack spacing={1}>
                      <Icon as={Clock} boxSize={4} color="gray.400" />
                      <Text fontSize="xs" color="gray.500">Yaratilgan</Text>
                    </HStack>
                    <Text fontSize="sm">
                      {new Date(order.createdAt).toLocaleString('uz-UZ')}
                    </Text>
                  </VStack>
                )}
                {order.updatedAt && (
                  <VStack align="start" spacing={0}>
                    <Text fontSize="xs" color="gray.500">Yangilangan</Text>
                    <Text fontSize="sm">
                      {new Date(order.updatedAt).toLocaleString('uz-UZ')}
                    </Text>
                  </VStack>
                )}
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Status va amallar */}
        <Card flex="1" bg={cardBg} borderWidth="1px" borderColor={borderColor}
          borderRadius="2xl" boxShadow="sm" alignSelf="start">
          <CardBody>
            <VStack align="stretch" spacing={5}>
              {/* Joriy holat */}
              <Box>
                <Text fontSize="xs" color="gray.400" fontWeight="semibold" mb={2} textTransform="uppercase">
                  Joriy holat
                </Text>
                <Badge colorScheme={statusColor(order.status)} rounded="full"
                  px={4} py={2} fontSize="sm">
                  {statusLabel(order.status)}
                </Badge>
              </Box>

              <Divider />

              {/* Status o'zgartirish — faqat seller / admin */}
              {isSeller && (
                <Box>
                  <Text fontSize="xs" color="gray.400" fontWeight="semibold" mb={2} textTransform="uppercase">
                    Holat o'zgartirish
                  </Text>
                  <Select size="sm" value={statusValue}
                    onChange={e => setStatusValue(e.target.value as OrderStatus)}
                    borderRadius="lg" mb={3}>
                    {ALL_STATUSES.map(s => (
                      <option key={s} value={s}>{statusLabel(s)}</option>
                    ))}
                  </Select>
                  <Button colorScheme="blue" size="sm" w="full" borderRadius="xl"
                    isLoading={isSaving} onClick={handleStatusSave}
                    isDisabled={statusValue === order.status}>
                    Saqlash
                  </Button>
                </Box>
              )}

              <Divider />

              {/* O'chirish */}
              <Button colorScheme="red" variant="outline" size="sm" w="full"
                borderRadius="xl" isLoading={isDeleting} onClick={handleDelete}>
                Buyurtmani o'chirish
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </Flex>
    </Box>
  );
}
