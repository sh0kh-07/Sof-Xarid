import React, { useState, useMemo, useEffect } from 'react';
import {
  Box, Flex, Heading, Text, Input, InputGroup, InputLeftElement,
  Table, Thead, Tbody, Tr, Th, Td, Badge, Button,
  Tabs, TabList, TabPanels, Tab, TabPanel,
  Card, CardBody, HStack, VStack, Icon, useColorModeValue,
  useToast, Spinner,
} from '@chakra-ui/react';
import { Search, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getOrders, Order, OrderStatus } from '../api/orders';
import { useAuth } from '../context/AuthContext';

// Mijozga tegishli statuslar
const ACTIVE_STATUSES: OrderStatus[] = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED'];
const DONE_STATUSES: OrderStatus[] = ['DELIVERED', 'CANCELLED'];

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

const statusIcon = (s: OrderStatus) => {
  if (s === 'DELIVERED') return CheckCircle;
  if (s === 'CANCELLED') return XCircle;
  return Clock;
};

// ==================== JADVAL ====================
interface TableProps { orders: Order[] }

function OrdersTable({ orders }: TableProps) {
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const navigate = useNavigate();

  if (orders.length === 0) {
    return (
      <Box textAlign="center" py={10}>
        <Text fontSize="lg" color="gray.500">Hech qanday buyurtma topilmadi</Text>
      </Box>
    );
  }

  return (
    <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}
      borderRadius="2xl" boxShadow="sm">
      <CardBody overflowX="auto">
        <Table variant="simple" size="md">
          <Thead>
            <Tr>
              <Th>Mahsulot</Th>
              <Th>Miqdor</Th>
              <Th>Narxi</Th>
              <Th>Sana</Th>
              <Th>Holati</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.map(order => (
              <Tr key={order.id} _hover={{ bg: 'gray.50' }} cursor="pointer"
                onClick={() => navigate(`/orders/${order.id}`)}>
                <Td fontSize="sm" fontWeight="medium">{order.product?.name ?? order.productId}</Td>
                <Td fontSize="sm">{order.quantity} ta</Td>
                <Td fontSize="sm" fontWeight="medium">
                  {order.product
                    ? new Intl.NumberFormat('uz-UZ').format(order.product.price * order.quantity) + " so'm"
                    : '—'}
                </Td>
                <Td fontSize="sm" color="gray.500">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString('uz-UZ') : '—'}
                </Td>
                <Td>
                  <Badge colorScheme={statusColor(order.status)} rounded="full" px={3} py={1}
                    display="flex" alignItems="center" width="fit-content" gap={1}>
                    <Icon as={statusIcon(order.status)} boxSize={3} mr={1} />
                    {statusLabel(order.status)}
                  </Badge>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  );
}

// ==================== ASOSIY KOMPONENT ====================
export default function ClientOrder() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useToast();
  const { user } = useAuth();

  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    getOrders()
      .then(data => {
        // Faqat o'z buyurtmalarini ko'rsatish
        const mine = user ? data.filter(o => o.clientId === user.id) : data;
        setOrders(mine);
      })
      .catch(err => {
        toast({ title: 'Buyurtmalarni yuklashda xatolik',
          description: err?.response?.data?.message || err.message,
          status: 'error', position: 'top-right', isClosable: true });
      })
      .finally(() => setIsPageLoading(false));
  }, [user]);

  const activeOrders = useMemo(() =>
    orders.filter(o => ACTIVE_STATUSES.includes(o.status) &&
      (!searchTerm || o.id.includes(searchTerm) || (o.product?.name ?? '').toLowerCase().includes(searchTerm.toLowerCase()))
    ), [orders, searchTerm]);

  const doneOrders = useMemo(() =>
    orders.filter(o => DONE_STATUSES.includes(o.status) &&
      (!searchTerm || o.id.includes(searchTerm) || (o.product?.name ?? '').toLowerCase().includes(searchTerm.toLowerCase()))
    ), [orders, searchTerm]);

  if (isPageLoading) {
    return (
      <Flex minH="60vh" align="center" justify="center">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  return (
    <Box minH="100vh">
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg" fontWeight="bold" color="gray.700">Buyurtmalar</Heading>
      </Flex>

      {/* Filter */}
      <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}
        borderRadius="2xl" boxShadow="sm" mb={6}>
        <CardBody>
          <Flex direction={{ base: 'column', md: 'row' }} gap={4} align="center">
            <InputGroup maxW="300px">
              <InputLeftElement pointerEvents="none">
                <Search size={18} color="gray.400" />
              </InputLeftElement>
              <Input placeholder="Buyurtma raqami yoki mahsulot..." value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)} borderRadius="lg"
                bg="gray.50" borderColor="gray.300" />
            </InputGroup>
            <Box flex="1" textAlign="right">
              <Text fontSize="sm" color="gray.500">
                {activeTab === 0 ? activeOrders.length : doneOrders.length} ta buyurtma
              </Text>
            </Box>
          </Flex>
        </CardBody>
      </Card>

      {/* Tablar */}
      <Tabs variant="soft-rounded" colorScheme="blue" index={activeTab}
        onChange={i => { setActiveTab(i); setSearchTerm(''); }} mb={6}>
        <TabList>
          <Tab>
            <HStack spacing={2}>
              <Text>Faol buyurtmalar</Text>
              <Badge colorScheme="blue" rounded="full" px={2}>{activeOrders.length}</Badge>
            </HStack>
          </Tab>
          <Tab>
            <HStack spacing={2}>
              <Text>Tugallangan / Bekor</Text>
              <Badge colorScheme="green" rounded="full" px={2}>{doneOrders.length}</Badge>
            </HStack>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel px={0}>
            <OrdersTable orders={activeOrders} />
          </TabPanel>
          <TabPanel px={0}>
            <OrdersTable orders={doneOrders} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
