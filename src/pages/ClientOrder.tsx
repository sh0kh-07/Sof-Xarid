import React, { useState, useMemo } from 'react';
import {
  Box, Flex, Heading, Text, Input, InputGroup, InputLeftElement,
  Table, Thead, Tbody, Tr, Th, Td, Badge, Button,
  Tabs, TabList, TabPanels, Tab, TabPanel,
  Card, CardBody, HStack, VStack, Icon, useColorModeValue,
  Select, Menu, MenuButton, MenuList, MenuItem, Avatar,
  SimpleGrid
} from '@chakra-ui/react';
import { Search, Filter, Eye, MoreVertical, CheckCircle, Clock, XCircle } from 'lucide-react';

// ==================== МОКОВЫЕ ДАННЫЕ ====================
const ordersData = [
  {
    id: 'ORD-2025-001',
    product: 'Ofis stoli (160x80)',
    category: 'Mebel',
    amount: '12,000,000 so‘m',
    date: '2025-12-28',
    status: 'Faol', // 'Faol' или 'Tugallangan'
    statusDetail: 'Yetkazilmoqda',
    supplier: 'Toshkent Mebel Fabrikasi',
  },
  {
    id: 'ORD-2025-002',
    product: 'Kompyuter (15 dona)',
    category: 'Elektronika',
    amount: '85,000,000 so‘m',
    date: '2025-12-25',
    status: 'Tugallangan',
    statusDetail: 'Yetkazilgan',
    supplier: 'O‘zbek Tech Assembling',
  },
  {
    id: 'ORD-2025-003',
    product: 'A4 qog‘oz (50 paket)',
    category: 'Kantselyariya',
    amount: '5,000,000 so‘m',
    date: '2025-12-27',
    status: 'Faol',
    statusDetail: 'Jarayonda',
    supplier: 'Farg‘ona Qog‘oz Zavodi',
  },
  {
    id: 'ORD-2025-004',
    product: 'Printer kartridjlari',
    category: 'Boshqa',
    amount: '2,500,000 so‘m',
    date: '2025-12-20',
    status: 'Tugallangan',
    statusDetail: 'Yetkazilgan',
    supplier: 'Fergana Paper Mill',
  },
  {
    id: 'ORD-2025-005',
    product: 'Stollar (20 dona)',
    category: 'Mebel',
    amount: '18,000,000 so‘m',
    date: '2025-12-10',
    status: 'Tugallangan',
    statusDetail: 'Yetkazilgan',
    supplier: 'Toshkent Mebel Fabrikasi',
  },
  {
    id: 'ORD-2025-006',
    product: 'Monitor (10 dona)',
    category: 'Elektronika',
    amount: '15,000,000 so‘m',
    date: '2025-12-29',
    status: 'Faol',
    statusDetail: 'Buyurtma qabul qilingan',
    supplier: 'O‘zbek Tech Assembling',
  },
  {
    id: 'ORD-2025-007',
    product: 'Qalam va ruchkalar (1000 ta)',
    category: 'Kantselyariya',
    amount: '800,000 so‘m',
    date: '2025-12-15',
    status: 'Tugallangan',
    statusDetail: 'Yetkazilgan',
    supplier: 'Farg‘ona Qog‘oz Zavodi',
  },
];

// ==================== КОМПОНЕНТ ====================
export default function ClientOrder() {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');

  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Получение списка заказов в зависимости от активной вкладки
  const getOrdersByTab = () => {
    if (activeTab === 0) {
      return ordersData.filter(order => order.status === 'Faol');
    } else {
      return ordersData.filter(order => order.status === 'Tugallangan');
    }
  };

  // Фильтрация и сортировка
  const filteredOrders = useMemo(() => {
    let orders = getOrdersByTab();

    // Поиск
    if (searchTerm) {
      orders = orders.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.supplier.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Фильтр по статусу детальному (для активных - только если есть)
    if (statusFilter !== 'all') {
      orders = orders.filter(order => order.statusDetail === statusFilter);
    }

    // Сортировка
    switch (sortBy) {
      case 'date_asc':
        orders.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'date_desc':
        orders.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'amount_asc':
        orders.sort((a, b) => parseFloat(a.amount.replace(/[^0-9.-]+/g, '')) - parseFloat(b.amount.replace(/[^0-9.-]+/g, '')));
        break;
      case 'amount_desc':
        orders.sort((a, b) => parseFloat(b.amount.replace(/[^0-9.-]+/g, '')) - parseFloat(a.amount.replace(/[^0-9.-]+/g, '')));
        break;
      default:
        break;
    }
    return orders;
  }, [activeTab, searchTerm, statusFilter, sortBy]);

  // Цвет статуса
  const getStatusColor = (statusDetail) => {
    switch (statusDetail) {
      case 'Yetkazilgan': return 'green';
      case 'Yetkazilmoqda': return 'yellow';
      case 'Jarayonda': return 'blue';
      case 'Buyurtma qabul qilingan': return 'purple';
      default: return 'gray';
    }
  };

  // Иконка статуса
  const getStatusIcon = (statusDetail) => {
    switch (statusDetail) {
      case 'Yetkazilgan': return CheckCircle;
      case 'Yetkazilmoqda': return Clock;
      case 'Jarayonda': return Clock;
      case 'Buyurtma qabul qilingan': return Clock;
      default: return XCircle;
    }
  };

  // Подсчёт количества активных и завершённых заказов
  const activeCount = ordersData.filter(o => o.status === 'Faol').length;
  const completedCount = ordersData.filter(o => o.status === 'Tugallangan').length;

  return (
    <Box minH="100vh">
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg" fontWeight="bold" color="gray.700">
          Buyurtmalar
        </Heading>
      </Flex>

      {/* Карточка с фильтрами и поиском */}
      <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} borderRadius="2xl" boxShadow="sm" mb={6}>
        <CardBody>
          <Flex direction={{ base: 'column', md: 'row' }} gap={4} align="center">
            <InputGroup maxW="300px">
              <InputLeftElement pointerEvents="none">
                <Search size={18} color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Buyurtma raqami yoki mahsulot..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                borderRadius="lg"
                bg="gray.50"
                borderColor="gray.300"
              />
            </InputGroup>

            <Select
              maxW="200px"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              borderRadius="lg"
              bg="gray.50"
              borderColor="gray.300"
              size="sm"
            >
              <option value="all">Barcha holatlar</option>
              <option value="Yetkazilgan">Yetkazilgan</option>
              <option value="Yetkazilmoqda">Yetkazilmoqda</option>
              <option value="Jarayonda">Jarayonda</option>
              <option value="Buyurtma qabul qilingan">Qabul qilingan</option>
            </Select>

            <Select
              maxW="200px"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              borderRadius="lg"
              bg="gray.50"
              borderColor="gray.300"
              size="sm"
            >
              <option value="date_desc">Sana: yangi → eski</option>
              <option value="date_asc">Sana: eski → yangi</option>
              <option value="amount_desc">Summa: katta → kichik</option>
              <option value="amount_asc">Summa: kichik → katta</option>
            </Select>

            <Box flex="1" textAlign="right">
              <Text fontSize="sm" color="gray.500">
                {filteredOrders.length} ta buyurtma
              </Text>
            </Box>
          </Flex>
        </CardBody>
      </Card>

      {/* Вкладки */}
      <Tabs variant="soft-rounded" colorScheme="blue" index={activeTab} onChange={setActiveTab} mb={6}>
        <TabList>
          <Tab>
            <HStack spacing={2}>
              <Text>Faol buyurtmalar</Text>
              <Badge colorScheme="blue" rounded="full" px={2}>{activeCount}</Badge>
            </HStack>
          </Tab>
          <Tab>
            <HStack spacing={2}>
              <Text>Tugallangan buyurtmalar</Text>
              <Badge colorScheme="green" rounded="full" px={2}>{completedCount}</Badge>
            </HStack>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            <OrdersTable orders={filteredOrders} getStatusColor={getStatusColor} getStatusIcon={getStatusIcon} />
          </TabPanel>
          <TabPanel px={0}>
            <OrdersTable orders={filteredOrders} getStatusColor={getStatusColor} getStatusIcon={getStatusIcon} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

// ==================== КОМПОНЕНТ ТАБЛИЦЫ ====================
function OrdersTable({ orders, getStatusColor, getStatusIcon }) {
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  if (orders.length === 0) {
    return (
      <Box textAlign="center" py={10}>
        <Text fontSize="lg" color="gray.500">Hech qanday buyurtma topilmadi</Text>
      </Box>
    );
  }

  return (
    <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} borderRadius="2xl" boxShadow="sm">
      <CardBody overflowX="auto">
        <Table variant="simple" size="md">
          <Thead>
            <Tr>
              <Th>Buyurtma raqami</Th>
              <Th>Mahsulot</Th>
              <Th>Yetkazib beruvchi</Th>
              <Th>Summa</Th>
              <Th>Sana</Th>
              <Th>Holati</Th>
              <Th>Amallar</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.map((order) => (
              <Tr key={order.id} _hover={{ bg: 'gray.50' }}>
                <Td fontWeight="semibold">{order.id}</Td>
                <Td>
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="medium">{order.product}</Text>
                    <Text fontSize="xs" color="gray.500">{order.category}</Text>
                  </VStack>
                </Td>
                <Td>{order.supplier}</Td>
                <Td fontWeight="medium">{order.amount}</Td>
                <Td>{order.date}</Td>
                <Td>
                  <Badge
                    colorScheme={getStatusColor(order.statusDetail)}
                    rounded="full"
                    px={3}
                    py={1}
                    display="flex"
                    alignItems="center"
                    width="fit-content"
                    gap={1}
                  >
                    <Icon as={getStatusIcon(order.statusDetail)} boxSize={3} />
                    {order.statusDetail}
                  </Badge>
                </Td>
                <Td>
                  <Menu>
                    <MenuButton as={Button} variant="ghost" size="sm">
                      <MoreVertical size={16} />
                    </MenuButton>
                    <MenuList>
                      <MenuItem icon={<Eye size={16} />}>Batafsil</MenuItem>
                      {order.status === 'Faol' && (
                        <MenuItem icon={<CheckCircle size={16} />} color="green.500">
                          Yetkazilgan deb belgilash
                        </MenuItem>
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