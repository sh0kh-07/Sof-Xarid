import React, { useMemo } from 'react';
import {
    Box, Flex, Grid, Heading, Text, Stat, StatLabel, StatNumber,
    StatHelpText, StatArrow, Card, CardHeader, CardBody, Table,
    Thead, Tbody, Tr, Th, Td, Badge, Icon, useColorModeValue,
    SimpleGrid, HStack, Progress,
} from '@chakra-ui/react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts';
import {
    Factory, Truck, PackageX, DollarSign, TrendingUp, Zap, BarChart3,
} from 'lucide-react';

// ==================== MA'LUMOTLAR ====================

const monthlyProduction = [
    { month: 'Iyul', ishlab: 280, yetkazilgan: 260 },
    { month: 'Avgust', ishlab: 320, yetkazilgan: 310 },
    { month: 'Sentabr', ishlab: 295, yetkazilgan: 280 },
    { month: 'Oktabr', ishlab: 410, yetkazilgan: 395 },
    { month: 'Noyabr', ishlab: 480, yetkazilgan: 460 },
    { month: 'Dekabr', ishlab: 560, yetkazilgan: 530 },
];

const categoryData = [
    { name: 'Mebel', value: 40 },
    { name: 'Plastik', value: 28 },
    { name: 'Metall', value: 22 },
    { name: 'Boshqa', value: 10 },
];
const COLORS = ['#3182CE', '#38A169', '#D69E2E', '#805AD5'];

const recentOrders = [
    { id: '#FC-0041', product: 'Ofis stullari', category: 'Mebel', amount: '18,000,000 so\'m', date: '2025-12-28', status: 'Ishlab chiqarilmoqda' },
    { id: '#FC-0040', product: 'Yozuv stollari', category: 'Mebel', amount: '24,000,000 so\'m', date: '2025-12-26', status: 'Yetkazilgan' },
    { id: '#FC-0039', product: 'Plastik konteyner', category: 'Plastik', amount: '6,000,000 so\'m', date: '2025-12-25', status: 'Yetkazilgan' },
    { id: '#FC-0038', product: 'Metall shkaf', category: 'Metall', amount: '12,500,000 so\'m', date: '2025-12-22', status: 'Tekshirilmoqda' },
    { id: '#FC-0037', product: 'Yotoq mebeli', category: 'Mebel', amount: '35,000,000 so\'m', date: '2025-12-20', status: 'Qaytarilgan' },
];

const productionLines = [
    { name: 'Liniya A — Mebel', pct: 87, color: 'green' },
    { name: 'Liniya B — Plastik', pct: 64, color: 'blue' },
    { name: 'Liniya C — Metall', pct: 45, color: 'orange' },
    { name: 'Liniya D — Boshqa', pct: 92, color: 'green' },
];

const stats = [
    { label: 'Jami ishlab chiqarildi', value: '3,840', icon: Factory, color: 'green.500', change: '+12%' },
    { label: 'Yetkazilgan buyurtmalar', value: '127', icon: Truck, color: 'blue.500', change: '+8%' },
    { label: 'Umumiy daromad', value: '₴ 218 mln', icon: DollarSign, color: 'purple.500', change: '+5%' },
    { label: 'Rad / Qaytarilgan', value: '5', icon: PackageX, color: 'red.500', change: '-2%' },
];

const statusColor = (s) =>
    s === 'Yetkazilgan' ? 'green'
        : s === 'Ishlab chiqarilmoqda' ? 'yellow'
            : s === 'Tekshirilmoqda' ? 'blue'
                : 'red';

// ==================== KOMPONENT ====================
export default function FactoryChart() {
    const cardBg = useColorModeValue('white', 'gray.700');
    const borderColor = useColorModeValue('gray.200', 'gray.600');

    // AI-analitika hisoblash
    const aiInsights = useMemo(() => {
        const totalIshlab = monthlyProduction.reduce((s, m) => s + m.ishlab, 0);
        const totalYetkazilgan = monthlyProduction.reduce((s, m) => s + m.yetkazilgan, 0);
        const efficiency = ((totalYetkazilgan / totalIshlab) * 100).toFixed(1);
        const avgMonthly = (totalIshlab / monthlyProduction.length).toFixed(0);
        const lastM = monthlyProduction[monthlyProduction.length - 1];
        const prevM = monthlyProduction[monthlyProduction.length - 2];
        const growth = prevM ? (((lastM.ishlab - prevM.ishlab) / prevM.ishlab) * 100).toFixed(1) : 0;
        const topCategory = categoryData.reduce((a, b) => (a.value > b.value ? a : b));
        const lowCategory = categoryData.reduce((a, b) => (a.value < b.value ? a : b));
        const maxMonth = monthlyProduction.reduce((a, b) => (a.ishlab > b.ishlab ? a : b));
        const weakLine = productionLines.reduce((a, b) => (a.pct < b.pct ? a : b));

        return {
            totalIshlab, totalYetkazilgan, efficiency,
            avgMonthly, growth, topCategory: topCategory.name,
            lowCategory: lowCategory.name, maxMonth: maxMonth.month,
            maxValue: maxMonth.ishlab, weakLine: weakLine.name,
        };
    }, []);

    return (
        <Box minH="100vh">
            <Flex justify="space-between" align="center" mb={6}>
                <Heading size="lg" fontWeight="bold" color="gray.700">
                    📊 Statistika va AI-analitika
                </Heading>
            </Flex>

            {/* Statistika kartalar */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={6}>
                {stats.map((stat, i) => (
                    <Card key={i} bg={cardBg} borderWidth="1px" borderColor={borderColor}
                        borderRadius="xl" boxShadow="sm">
                        <CardBody>
                            <Flex justify="space-between" align="center">
                                <Stat>
                                    <StatLabel fontSize="sm" color="gray.500">{stat.label}</StatLabel>
                                    <StatNumber fontSize="2xl" fontWeight="bold" color="gray.700">
                                        {stat.value}
                                    </StatNumber>
                                    <StatHelpText>
                                        <StatArrow type={stat.change.startsWith('+') ? 'increase' : 'decrease'} />
                                        {stat.change}
                                    </StatHelpText>
                                </Stat>
                                <Box p={2} bg={`${stat.color}20`} borderRadius="lg" color={stat.color}>
                                    <Icon as={stat.icon} boxSize={6} />
                                </Box>
                            </Flex>
                        </CardBody>
                    </Card>
                ))}
            </SimpleGrid>

            {/* Grafiklar */}
            <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6} mb={6}>
                {/* Ustunli grafik — ishlab chiqarish vs yetkazilgan */}
                <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}
                    borderRadius="xl" boxShadow="sm">
                    <CardHeader>
                        <Heading size="md" fontWeight="semibold">
                            📈 Ishlab chiqarish va yetkazish (oxirgi 6 oy)
                        </Heading>
                    </CardHeader>
                    <CardBody>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={monthlyProduction} barGap={4}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="month" stroke="#a0aec0" fontSize={12} />
                                <YAxis stroke="#a0aec0" fontSize={12} />
                                <Tooltip
                                    contentStyle={{
                                        background: 'white', borderRadius: '8px',
                                        border: '1px solid #e2e8f0'
                                    }}
                                    labelStyle={{ fontWeight: 'bold' }}
                                    formatter={(value, name) => [
                                        `${value} dona`,
                                        name === 'ishlab' ? 'Ishlab chiqarildi' : 'Yetkazildi',
                                    ]}
                                />
                                <Legend
                                    formatter={(value) =>
                                        value === 'ishlab' ? 'Ishlab chiqarildi' : 'Yetkazildi'
                                    }
                                />
                                <Bar dataKey="ishlab" fill="#3182CE" radius={[4, 4, 0, 0]} barSize={18} />
                                <Bar dataKey="yetkazilgan" fill="#38A169" radius={[4, 4, 0, 0]} barSize={18} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardBody>
                </Card>

                {/* Donut grafik — kategoriya */}
                <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}
                    borderRadius="xl" boxShadow="sm">
                    <CardHeader>
                        <Heading size="md" fontWeight="semibold">📦 Kategoriyalar bo'yicha taqsimot</Heading>
                    </CardHeader>
                    <CardBody>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%" cy="50%"
                                    innerRadius={60} outerRadius={80}
                                    paddingAngle={2} dataKey="value"
                                    label={({ name, percent }) =>
                                        `${name} ${(percent * 100).toFixed(0)}%`}
                                    labelLine={false}
                                >
                                    {categoryData.map((_, idx) => (
                                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(v) => [`${v}%`, 'Ulush']} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardBody>
                </Card>
            </Grid>

            {/* Ishlab chiqarish liniyalari */}
            <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}
                borderRadius="xl" boxShadow="sm" mb={6}>
                <CardHeader>
                    <Heading size="md" fontWeight="semibold">⚙️ Liniyalar samaradorligi</Heading>
                </CardHeader>
                <CardBody>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                        {productionLines.map((l, i) => (
                            <Box key={i}>
                                <Flex justify="space-between" mb={1} fontSize="sm" color="gray.600">
                                    <Text>{l.name}</Text>
                                    <Text fontWeight="semibold"
                                        color={l.pct >= 80 ? 'green.500' : l.pct >= 60 ? 'blue.500' : 'orange.500'}>
                                        {l.pct}%
                                    </Text>
                                </Flex>
                                <Progress value={l.pct} colorScheme={l.color}
                                    borderRadius="full" size="sm" />
                            </Box>
                        ))}
                    </SimpleGrid>
                </CardBody>
            </Card>

            {/* AI-analitika */}
            <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}
                borderRadius="xl" boxShadow="sm" mb={6}>
                <CardHeader>
                    <HStack>
                        <Icon as={Zap} boxSize={6} color="yellow.500" />
                        <Heading size="md" fontWeight="semibold">🧠 AI-analitika — asosiy xulosalar</Heading>
                    </HStack>
                </CardHeader>
                <CardBody>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <Box p={4} bg="blue.50" borderRadius="lg">
                            <Text fontWeight="bold" color="blue.700">📊 Umumiy tahlil</Text>
                            <Text fontSize="sm" color="blue.600" mt={1}>
                                Oxirgi 6 oy ichida jami <strong>{aiInsights.totalIshlab}</strong> dona mahsulot
                                ishlab chiqarildi. Oylik o'rtacha — <strong>{aiInsights.avgMonthly}</strong> dona.
                                {Number(aiInsights.growth) >= 0
                                    ? ` O'tgan oyga nisbatan o'sish ${aiInsights.growth}% ni tashkil qildi.`
                                    : ` O'tgan oyga nisbatan ${Math.abs(aiInsights.growth)}% pasayish kuzatildi.`}
                            </Text>
                        </Box>

                        <Box p={4} bg="green.50" borderRadius="lg">
                            <Text fontWeight="bold" color="green.700">🚚 Yetkazish samaradorligi</Text>
                            <Text fontSize="sm" color="green.600" mt={1}>
                                Ishlab chiqarilgan mahsulotlarning <strong>{aiInsights.efficiency}%</strong> i
                                muvaffaqiyatli yetkazib berildi
                                ({aiInsights.totalYetkazilgan} ta). Bu ko'rsatkich sanoat me'yoridan{' '}
                                {Number(aiInsights.efficiency) >= 90 ? 'yuqori' : 'past'}.
                            </Text>
                        </Box>

                        <Box p={4} bg="purple.50" borderRadius="lg">
                            <Text fontWeight="bold" color="purple.700">📈 Mavsumiy tendensiya</Text>
                            <Text fontSize="sm" color="purple.600" mt={1}>
                                Eng yuqori ishlab chiqarish <strong>{aiInsights.maxMonth}</strong> oyida qayd etilgan
                                ({aiInsights.maxValue} dona). Eng faol kategoriya —{' '}
                                <strong>{aiInsights.topCategory}</strong> ({categoryData.find(
                                    (c) => c.name === aiInsights.topCategory)?.value}%).
                            </Text>
                        </Box>

                        <Box p={4} bg="orange.50" borderRadius="lg">
                            <Text fontWeight="bold" color="orange.700">💡 Tavsiyalar</Text>
                            <Text fontSize="sm" color="orange.600" mt={1}>
                                <strong>{aiInsights.weakLine}</strong> liniyasida samaradorlik past — texnik
                                ko'rik o'tkazish tavsiya etiladi. <strong>{aiInsights.lowCategory}</strong>{' '}
                                kategoriyasini kengaytirish orqali ishlab chiqarish portfelini
                                diversifikatsiya qilish mumkin.
                            </Text>
                        </Box>
                    </SimpleGrid>
                </CardBody>
            </Card>

            {/* So'nggi buyurtmalar jadvali */}
            <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}
                borderRadius="xl" boxShadow="sm">
                <CardHeader>
                    <Heading size="md" fontWeight="semibold">🕒 So'nggi buyurtmalar</Heading>
                </CardHeader>
                <CardBody overflowX="auto">
                    <Table variant="simple" size="md">
                        <Thead>
                            <Tr>
                                <Th>Buyurtma</Th>
                                <Th>Mahsulot</Th>
                                <Th>Kategoriya</Th>
                                <Th>Summa</Th>
                                <Th>Sana</Th>
                                <Th>Holat</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {recentOrders.map((item) => (
                                <Tr key={item.id}>
                                    <Td color="gray.400" fontSize="sm">{item.id}</Td>
                                    <Td fontWeight="medium">{item.product}</Td>
                                    <Td>{item.category}</Td>
                                    <Td>{item.amount}</Td>
                                    <Td>{item.date}</Td>
                                    <Td>
                                        <Badge
                                            colorScheme={statusColor(item.status)}
                                            rounded="full"
                                            px={3}
                                            py={1}
                                        >
                                            {item.status}
                                        </Badge>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </CardBody>
            </Card>
        </Box>
    );
}
