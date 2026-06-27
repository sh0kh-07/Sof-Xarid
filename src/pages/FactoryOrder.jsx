import React, { useState, useMemo } from 'react';
import {
    Box, Flex, Heading, Text, Input, InputGroup, InputLeftElement,
    Table, Thead, Tbody, Tr, Th, Td, Badge, Button,
    Tabs, TabList, TabPanels, Tab, TabPanel,
    Card, CardBody, HStack, VStack, Icon, useColorModeValue,
    Select, Menu, MenuButton, MenuList, MenuItem,
    Modal, ModalOverlay, ModalContent, ModalHeader,
    ModalBody, ModalFooter, ModalCloseButton,
    useDisclosure, useToast, Text as ChText, Divider,
} from '@chakra-ui/react';
import {
    Search, CheckCircle, Clock, XCircle, Eye,
    MoreVertical, Truck, PackageCheck, PackageX,
} from 'lucide-react';

// ==================== MA'LUMOTLAR ====================
const initialOrders = [
    {
        id: 'FC-2025-041',
        client: 'Toshkent Shahar Hokimligi',
        product: 'Ofis stullari',
        category: 'Mebel',
        qty: '50 dona',
        amount: '18,000,000 so\'m',
        date: '2025-12-28',
        status: 'Yangi',          // Yangi | Jarayonda | Yetkazilgan | Rad etilgan
    },
    {
        id: 'FC-2025-040',
        client: 'Namangan Viloyat Hokimligi',
        product: 'Yozuv stollari',
        category: 'Mebel',
        qty: '30 dona',
        amount: '24,000,000 so\'m',
        date: '2025-12-26',
        status: 'Jarayonda',
    },
    {
        id: 'FC-2025-039',
        client: 'Farg\'ona Shahar Maktabi',
        product: 'Plastik konteyner',
        category: 'Plastik',
        qty: '200 dona',
        amount: '6,000,000 so\'m',
        date: '2025-12-25',
        status: 'Yetkazilgan',
    },
    {
        id: 'FC-2025-038',
        client: 'Samarqand Universiteti',
        product: 'Metall shkaf',
        category: 'Metall',
        qty: '15 dona',
        amount: '12,500,000 so\'m',
        date: '2025-12-22',
        status: 'Jarayonda',
    },
    {
        id: 'FC-2025-037',
        client: 'Andijon Tibbiyot Markazi',
        product: 'Yotoq garniturai',
        category: 'Mebel',
        qty: '10 dona',
        amount: '35,000,000 so\'m',
        date: '2025-12-20',
        status: 'Rad etilgan',
    },
    {
        id: 'FC-2025-036',
        client: 'Buxoro Shahri Maktabi',
        product: 'Metall regal',
        category: 'Metall',
        qty: '8 dona',
        amount: '7,600,000 so\'m',
        date: '2025-12-18',
        status: 'Yangi',
    },
    {
        id: 'FC-2025-035',
        client: 'Qashqadaryo Hokimligi',
        product: 'Plastik stul',
        category: 'Plastik',
        qty: '100 dona',
        amount: '12,000,000 so\'m',
        date: '2025-12-15',
        status: 'Yetkazilgan',
    },
];

const STATUS_TABS = ['Yangi', 'Jarayonda', 'Yetkazilgan', 'Rad etilgan'];

const statusColor = (s) => {
    if (s === 'Yetkazilgan') return 'green';
    if (s === 'Jarayonda') return 'blue';
    if (s === 'Yangi') return 'purple';
    if (s === 'Rad etilgan') return 'red';
    return 'gray';
};

const statusIcon = (s) => {
    if (s === 'Yetkazilgan') return PackageCheck;
    if (s === 'Jarayonda') return Truck;
    if (s === 'Yangi') return Clock;
    if (s === 'Rad etilgan') return PackageX;
    return XCircle;
};

// ==================== DETAIL MODAL ====================
function DetailModal({ order, isOpen, onClose, onChangeStatus }) {
    if (!order) return null;
    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
            <ModalOverlay />
            <ModalContent borderRadius="2xl">
                <ModalHeader borderBottom="1px solid" borderColor="gray.100" pb={3} fontSize="md">
                    Buyurtma tafsiloti — {order.id}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody pt={4}>
                    <VStack align="stretch" spacing={3} fontSize="sm">
                        <HStack justify="space-between">
                            <Text color="gray.500">Mijoz:</Text>
                            <Text fontWeight="semibold">{order.client}</Text>
                        </HStack>
                        <HStack justify="space-between">
                            <Text color="gray.500">Mahsulot:</Text>
                            <Text fontWeight="semibold">{order.product}</Text>
                        </HStack>
                        <HStack justify="space-between">
                            <Text color="gray.500">Kategoriya:</Text>
                            <Text>{order.category}</Text>
                        </HStack>
                        <HStack justify="space-between">
                            <Text color="gray.500">Miqdor:</Text>
                            <Text>{order.qty}</Text>
                        </HStack>
                        <HStack justify="space-between">
                            <Text color="gray.500">Summa:</Text>
                            <Text fontWeight="bold" color="blue.600">{order.amount}</Text>
                        </HStack>
                        <HStack justify="space-between">
                            <Text color="gray.500">Sana:</Text>
                            <Text>{order.date}</Text>
                        </HStack>
                        <Divider />
                        <HStack justify="space-between">
                            <Text color="gray.500">Holat:</Text>
                            <Badge colorScheme={statusColor(order.status)} rounded="full" px={3} py={1}>
                                {order.status}
                            </Badge>
                        </HStack>
                    </VStack>
                </ModalBody>

                {/* Faqat Yangi va Jarayonda buyurtmalar uchun amallar */}
                {(order.status === 'Yangi' || order.status === 'Jarayonda') && (
                    <ModalFooter gap={2} flexWrap="wrap">
                        {order.status === 'Yangi' && (
                            <>
                                <Button
                                    size="sm" colorScheme="blue" borderRadius="xl"
                                    leftIcon={<Truck size={14} />}
                                    onClick={() => { onChangeStatus(order.id, 'Jarayonda'); onClose(); }}
                                >
                                    Ishlab chiqarishga qabul
                                </Button>
                                <Button
                                    size="sm" colorScheme="red" variant="outline" borderRadius="xl"
                                    leftIcon={<PackageX size={14} />}
                                    onClick={() => { onChangeStatus(order.id, 'Rad etilgan'); onClose(); }}
                                >
                                    Rad etish
                                </Button>
                            </>
                        )}
                        {order.status === 'Jarayonda' && (
                            <Button
                                size="sm" colorScheme="green" borderRadius="xl"
                                leftIcon={<PackageCheck size={14} />}
                                onClick={() => { onChangeStatus(order.id, 'Yetkazilgan'); onClose(); }}
                            >
                                Yetkazildi deb belgilash
                            </Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={onClose} borderRadius="xl">
                            Yopish
                        </Button>
                    </ModalFooter>
                )}
                {(order.status === 'Yetkazilgan' || order.status === 'Rad etilgan') && (
                    <ModalFooter>
                        <Button size="sm" variant="outline" onClick={onClose} borderRadius="xl">
                            Yopish
                        </Button>
                    </ModalFooter>
                )}
            </ModalContent>
        </Modal>
    );
}

// ==================== JADVAL ====================
function OrdersTable({ orders, onView, onChangeStatus }) {
    const cardBg = useColorModeValue('white', 'gray.700');
    const borderColor = useColorModeValue('gray.200', 'gray.600');

    if (orders.length === 0) {
        return (
            <Box textAlign="center" py={12}>
                <Text color="gray.400" fontSize="md">Bu bo'limda buyurtma yo'q</Text>
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
                            <Th>Buyurtma ID</Th>
                            <Th>Mijoz</Th>
                            <Th>Mahsulot</Th>
                            <Th>Miqdor</Th>
                            <Th>Summa</Th>
                            <Th>Sana</Th>
                            <Th>Holat</Th>
                            <Th>Amallar</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {orders.map((order) => (
                            <Tr key={order.id} _hover={{ bg: 'gray.50' }}>
                                <Td fontWeight="semibold" color="gray.600" fontSize="sm">
                                    {order.id}
                                </Td>
                                <Td>
                                    <Text fontWeight="medium" fontSize="sm">{order.client}</Text>
                                </Td>
                                <Td>
                                    <VStack align="start" spacing={0}>
                                        <Text fontWeight="medium" fontSize="sm">{order.product}</Text>
                                        <Text fontSize="xs" color="gray.400">{order.category}</Text>
                                    </VStack>
                                </Td>
                                <Td fontSize="sm">{order.qty}</Td>
                                <Td fontWeight="medium" fontSize="sm">{order.amount}</Td>
                                <Td fontSize="sm" color="gray.500">{order.date}</Td>
                                <Td>
                                    <Badge
                                        colorScheme={statusColor(order.status)}
                                        rounded="full" px={3} py={1}
                                        display="flex" alignItems="center"
                                        width="fit-content" gap={1}
                                    >
                                        <Icon as={statusIcon(order.status)} boxSize={3} mr={1} />
                                        {order.status}
                                    </Badge>
                                </Td>
                                <Td>
                                    <Menu>
                                        <MenuButton as={Button} variant="ghost" size="sm" borderRadius="lg">
                                            <MoreVertical size={16} />
                                        </MenuButton>
                                        <MenuList fontSize="sm">
                                            <MenuItem icon={<Eye size={15} />} onClick={() => onView(order)}>
                                                Batafsil
                                            </MenuItem>
                                            {order.status === 'Yangi' && (
                                                <>
                                                    <MenuItem
                                                        icon={<Truck size={15} />} color="blue.500"
                                                        onClick={() => onChangeStatus(order.id, 'Jarayonda')}
                                                    >
                                                        Ishlab chiqarishga qabul
                                                    </MenuItem>
                                                    <MenuItem
                                                        icon={<PackageX size={15} />} color="red.500"
                                                        onClick={() => onChangeStatus(order.id, 'Rad etilgan')}
                                                    >
                                                        Rad etish
                                                    </MenuItem>
                                                </>
                                            )}
                                            {order.status === 'Jarayonda' && (
                                                <MenuItem
                                                    icon={<PackageCheck size={15} />} color="green.500"
                                                    onClick={() => onChangeStatus(order.id, 'Yetkazilgan')}
                                                >
                                                    Yetkazildi deb belgilash
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

// ==================== ASOSIY KOMPONENT ====================
export default function FactoryOrder() {
    const [orders, setOrders] = useState(initialOrders);
    const [activeTab, setActiveTab] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('date_desc');
    const [selected, setSelected] = useState(null);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const cardBg = useColorModeValue('white', 'gray.700');
    const borderColor = useColorModeValue('gray.200', 'gray.600');

    const currentStatus = STATUS_TABS[activeTab];

    // Holat o'zgartirish
    const handleChangeStatus = (id, newStatus) => {
        setOrders((prev) =>
            prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
        );
        const labels = {
            Jarayonda: 'Ishlab chiqarishga qabul qilindi',
            Yetkazilgan: 'Yetkazilgan deb belgilandi',
            'Rad etilgan': 'Buyurtma rad etildi',
        };
        toast({
            title: labels[newStatus] || 'Holat yangilandi',
            status: newStatus === 'Rad etilgan' ? 'error' : 'success',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
        });
    };

    const handleView = (order) => {
        setSelected(order);
        onOpen();
    };

    // Filterlash
    const filteredOrders = useMemo(() => {
        let list = orders.filter((o) => o.status === currentStatus);

        if (searchTerm) {
            const q = searchTerm.toLowerCase();
            list = list.filter(
                (o) =>
                    o.id.toLowerCase().includes(q) ||
                    o.product.toLowerCase().includes(q) ||
                    o.client.toLowerCase().includes(q)
            );
        }

        if (sortBy === 'date_asc')
            list.sort((a, b) => new Date(a.date) - new Date(b.date));
        else if (sortBy === 'date_desc')
            list.sort((a, b) => new Date(b.date) - new Date(a.date));
        else if (sortBy === 'amount_asc')
            list.sort(
                (a, b) =>
                    parseFloat(a.amount.replace(/[^0-9]/g, '')) -
                    parseFloat(b.amount.replace(/[^0-9]/g, ''))
            );
        else if (sortBy === 'amount_desc')
            list.sort(
                (a, b) =>
                    parseFloat(b.amount.replace(/[^0-9]/g, '')) -
                    parseFloat(a.amount.replace(/[^0-9]/g, ''))
            );

        return list;
    }, [orders, currentStatus, searchTerm, sortBy]);

    const countByStatus = (s) => orders.filter((o) => o.status === s).length;

    const tabColors = ['purple', 'blue', 'green', 'red'];

    return (
        <Box minH="100vh">
            <Flex justify="space-between" align="center" mb={6}>
                <Heading size="lg" fontWeight="bold" color="gray.700">
                    Qabul qilingan buyurtmalar
                </Heading>
            </Flex>

            {/* Qidiruv va saralash */}
            <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}
                borderRadius="2xl" boxShadow="sm" mb={6}>
                <CardBody>
                    <Flex direction={{ base: 'column', md: 'row' }} gap={4} align="center">
                        <InputGroup maxW="320px">
                            <InputLeftElement pointerEvents="none">
                                <Search size={18} color="gray" />
                            </InputLeftElement>
                            <Input
                                placeholder="Buyurtma ID, mahsulot yoki mijoz..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                borderRadius="lg"
                                bg="gray.50"
                                borderColor="gray.300"
                                _focus={{ borderColor: 'blue.400' }}
                            />
                        </InputGroup>

                        <Select
                            maxW="220px" size="sm"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            borderRadius="lg" bg="gray.50" borderColor="gray.300"
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

            {/* Tablar */}
            <Tabs
                variant="soft-rounded"
                colorScheme="blue"
                index={activeTab}
                onChange={(i) => { setActiveTab(i); setSearchTerm(''); }}
                mb={6}
            >
                <TabList flexWrap="wrap" gap={2}>
                    {STATUS_TABS.map((s, i) => (
                        <Tab key={s}>
                            <HStack spacing={2}>
                                <Text>{s}</Text>
                                <Badge colorScheme={tabColors[i]} rounded="full" px={2}>
                                    {countByStatus(s)}
                                </Badge>
                            </HStack>
                        </Tab>
                    ))}
                </TabList>

                <TabPanels>
                    {STATUS_TABS.map((s) => (
                        <TabPanel key={s} px={0}>
                            <OrdersTable
                                orders={filteredOrders}
                                onView={handleView}
                                onChangeStatus={handleChangeStatus}
                            />
                        </TabPanel>
                    ))}
                </TabPanels>
            </Tabs>

            {/* Detail modal */}
            <DetailModal
                order={selected}
                isOpen={isOpen}
                onClose={onClose}
                onChangeStatus={handleChangeStatus}
            />
        </Box>
    );
}