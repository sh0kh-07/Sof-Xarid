import React, { useState, useMemo, useEffect } from 'react';
import {
  Box, Flex, Heading, Text, Input, InputGroup, InputLeftElement,
  Table, Thead, Tbody, Tr, Th, Td, Badge, Button,
  Tabs, TabList, TabPanels, Tab, TabPanel,
  Card, CardBody, HStack, VStack, useColorModeValue,
  Menu, MenuButton, MenuList, MenuItem,
  useToast, Spinner,
} from '@chakra-ui/react';
import {
  Search, Truck, PackageCheck, PackageX,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  getOrders, updateOrderStatus, Order, OrderStatus,
} from '../api/orders';

// ==================== STATUS ====================
const STATUS_MAP: { label: string; value: OrderStatus | 'ALL' }[] = [
  { label: 'Yangi', value: 'PENDING' },
  { label: 'Tasdiqlangan', value: 'CONFIRMED' },
  { label: 'Jarayonda', value: 'PROCESSING' },
  { label: 'Yetkazilmoqda', value: 'SHIPPED' },
  { label: 'Yetkazilgan', value: 'DELIVERED' },
  { label: 'Bekor qilingan', value: 'CANCELLED' },
];

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

const statusLabel = (s: OrderStatus) =>
  STATUS_MAP.find(m => m.value === s)?.label ?? s;

// ==================== JADVAL ====================
interface TableProps {
  orders: Order[];
  onChangeStatus: (id: string, status: OrderStatus) => Promise<void>;
}

function OrdersTable({ orders, onChangeStatus }: TableProps) {
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const navigate = useNavigate();
  const toast = useToast();

  if (orders.length === 0) {
    return (
      <Box textAlign="center" py={12}>
        <Text color="gray.400" fontSize="md">Bu bo'limda buyurtma yo'q</Text>
      </Box>
    );
  }

  const handle = async (id: string, status: OrderStatus) => {
    try {
      await onChangeStatus(id, status);
    } catch (err: any) {
      toast({ title: 'Xatolik', description: err?.response?.data?.message || err.message,
        status: 'error', position: 'top-right', isClosable: true });
    }
  };

  return (
    <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} borderRadius="2xl" boxShadow="sm">
      <CardBody overflowX="auto">
        <Table variant="simple" size="md">
          <Thead>
            <Tr>
              <Th>Mahsulot</Th>
              <Th>Mijoz</Th>
              <Th>Miqdor</Th>
              <Th>Sana</Th>
              <Th>Holat</Th>
              <Th>Amallar</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.map(order => (
              <Tr key={order.id} _hover={{ bg: 'gray.50' }} cursor="pointer"
                onClick={() => navigate(`/facOrder/${order.id}`)}>
                <Td fontSize="sm" fontWeight="medium">{order.product?.name ?? order.productId}</Td>
                <Td fontSize="sm">{order.client?.full_name ?? order.clientId}</Td>
                <Td fontSize="sm">{order.quantity} ta</Td>
                <Td fontSize="sm" color="gray.500">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString('uz-UZ') : '—'}
                </Td>
                <Td>
                  <Badge colorScheme={statusColor(order.status)} rounded="full" px={3} py={1}>
                    {statusLabel(order.status)}
                  </Badge>
                </Td>
                <Td onClick={e => e.stopPropagation()}>
                  <Menu>
                    <MenuButton as={Button} variant="ghost" size="sm" borderRadius="lg">
                      <MoreVertical size={16} />
                    </MenuButton>
                    <MenuList fontSize="sm">
                      {order.status === 'PENDING' && (
                        <>
                          <MenuItem icon={<Truck size={15} />} color="blue.500"
                            onClick={() => handle(order.id, 'CONFIRMED')}>Tasdiqlash</MenuItem>
                          <MenuItem icon={<PackageX size={15} />} color="red.500"
                            onClick={() => handle(order.id, 'CANCELLED')}>Bekor qilish</MenuItem>
                        </>
                      )}
                      {order.status === 'CONFIRMED' && (
                        <MenuItem icon={<PackageCheck size={15} />} color="cyan.500"
                          onClick={() => handle(order.id, 'PROCESSING')}>Ishlab chiqarishga</MenuItem>
                      )}
                      {order.status === 'PROCESSING' && (
                        <MenuItem icon={<Truck size={15} />} color="yellow.600"
                          onClick={() => handle(order.id, 'SHIPPED')}>Yetkazilmoqda</MenuItem>
                      )}
                      {order.status === 'SHIPPED' && (
                        <MenuItem icon={<PackageCheck size={15} />} color="green.500"
                          onClick={() => handle(order.id, 'DELIVERED')}>Yetkazildi</MenuItem>
                      )}
                    </MenuList>
                  </Menu>
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
export default function FactoryOrder() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useToast();

  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const currentStatus = STATUS_MAP[activeTab].value as OrderStatus;

  const loadOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err: any) {
      toast({ title: 'Buyurtmalarni yuklashda xatolik',
        description: err?.response?.data?.message || err.message,
        status: 'error', position: 'top-right', isClosable: true });
    } finally {
      setIsPageLoading(false);
    }
  };

  useEffect(() => { loadOrders(); }, []);

  const handleChangeStatus = async (id: string, status: OrderStatus) => {
    await updateOrderStatus(id, status);
    toast({
      title: 'Holat yangilandi',
      status: status === 'CANCELLED' ? 'warning' : 'success',
      duration: 2500, isClosable: true, position: 'top-right',
    });
    loadOrders();
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchStatus = o.status === currentStatus;
      const q = searchTerm.toLowerCase();
      const matchSearch = !searchTerm ||
        o.id.toLowerCase().includes(q) ||
        (o.product?.name ?? '').toLowerCase().includes(q) ||
        (o.client?.full_name ?? '').toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [orders, currentStatus, searchTerm]);

  const countByStatus = (s: OrderStatus) => orders.filter(o => o.status === s).length;
  const tabColors = ['purple', 'blue', 'cyan', 'yellow', 'green', 'red'];

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
        <Heading size="lg" fontWeight="bold" color="gray.700">
          Qabul qilingan buyurtmalar
        </Heading>
      </Flex>

      {/* Qidiruv */}
      <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}
        borderRadius="2xl" boxShadow="sm" mb={6}>
        <CardBody>
          <Flex direction={{ base: 'column', md: 'row' }} gap={4} align="center">
            <InputGroup maxW="320px">
              <InputLeftElement pointerEvents="none">
                <Search size={18} color="gray" />
              </InputLeftElement>
              <Input placeholder="ID, mahsulot yoki mijoz..." value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)} borderRadius="lg"
                bg="gray.50" borderColor="gray.300" _focus={{ borderColor: 'blue.400' }} />
            </InputGroup>
            <Box flex="1" textAlign="right">
              <Text fontSize="sm" color="gray.500">{filteredOrders.length} ta buyurtma</Text>
            </Box>
          </Flex>
        </CardBody>
      </Card>

      {/* Tablar */}
      <Tabs variant="soft-rounded" colorScheme="blue" index={activeTab}
        onChange={i => { setActiveTab(i); setSearchTerm(''); }} mb={6}>
        <TabList flexWrap="wrap" gap={2}>
          {STATUS_MAP.map((s, i) => (
            <Tab key={s.value}>
              <HStack spacing={2}>
                <Text>{s.label}</Text>
                <Badge colorScheme={tabColors[i]} rounded="full" px={2}>
                  {countByStatus(s.value as OrderStatus)}
                </Badge>
              </HStack>
            </Tab>
          ))}
        </TabList>
        <TabPanels>
          {STATUS_MAP.map(s => (
            <TabPanel key={s.value} px={0}>
              <OrdersTable orders={filteredOrders} onChangeStatus={handleChangeStatus} />
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Box>
  );
}
