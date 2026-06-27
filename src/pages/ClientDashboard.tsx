import React from 'react';
import {
  Box, Flex, Grid, Heading, Text, Stat, StatLabel, StatNumber,
  StatHelpText, StatArrow, Card, CardHeader, CardBody, Table,
  Thead, Tbody, Tr, Th, Td, Badge, Icon, useColorModeValue,
  SimpleGrid
} from '@chakra-ui/react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { ShoppingBag, DollarSign, Package, TrendingUp, Calendar, Truck } from 'lucide-react';

// Статистика
const statsData = [
  { label: 'Jami xaridlar', value: '47', icon: ShoppingBag, color: 'blue.500', change: '+15%' },
  { label: 'Umumiy summa', value: '₴ 345.6 mln', icon: DollarSign, color: 'green.500', change: '+8%' }, // сумлар
  { label: 'Faol buyurtmalar', value: '6', icon: Package, color: 'orange.500', change: '-2%' },
//   { label: 'Yetkazib beruvchilar', value: '12', icon: Truck, color: 'purple.500', change: '+4%' },
];

// Данные закупок за последние 30 дней (для графика)
const purchaseData = [
  { day: '1-дек', value: 2 },
  { day: '5-дек', value: 1 },
  { day: '10-дек', value: 0 },
  { day: '15-дек', value: 3 },
  { day: '20-дек', value: 0 },
  { day: '25-дек', value: 8 },  // Компьютеры – прошлая неделя
  { day: '26-дек', value: 2 },
  { day: '27-дек', value: 5 },  // Листы – вчера
  { day: '28-дек', value: 1 },
  { day: '29-дек', value: 0 },
  { day: '30-дек', value: 15 }, // Мебель – прошлый месяц (30 дней назад)
];

// Категории закупок (для круговой диаграммы)
const categoryData = [
  { name: 'Mebel', value: 35 },
  { name: 'Kompyuterlar', value: 25 },
  { name: 'Qog\'oz va kantselyariya', value: 20 },
  { name: 'Boshqa', value: 20 },
];
const COLORS = ['#3182CE', '#38A169', '#D69E2E', '#805AD5'];

// Последние закупки (с датами и суммами)
const recentPurchases = [
  { id: 1, name: 'Ofis mebellari to\'plami', category: 'Mebel', price: '120,000,000 so\'m', date: '2025-11-30', status: 'Yetkazilgan' },
  { id: 2, name: 'Kompyuterlar (15 dona)', category: 'Kompyuterlar', price: '85,000,000 so\'m', date: '2025-12-25', status: 'Yetkazilgan' },
  { id: 3, name: 'A4 qog\'oz (50 paket)', category: 'Qog\'oz va kantselyariya', price: '5,000,000 so\'m', date: '2025-12-27', status: 'Yetkazilmoqda' },
  { id: 4, name: 'Printer kartridjlari', category: 'Boshqa', price: '2,500,000 so\'m', date: '2025-12-20', status: 'Yetkazilgan' },
  { id: 5, name: 'Stollar (20 dona)', category: 'Mebel', price: '18,000,000 so\'m', date: '2025-12-10', status: 'Yetkazilgan' },
];

export default function ClientDashboard() {
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box  minH="100vh">
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg" fontWeight="bold" color="gray.700">
          Boshqaruv paneli
        </Heading>
      </Flex>

      {/* Statistik kartalar */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mb={6}>
        {statsData.map((stat, index) => (
          <Card key={index} bg={cardBg} borderWidth="1px" borderColor={borderColor} borderRadius="xl" boxShadow="sm">
            <CardBody>
              <Flex justify="space-between" align="center">
                <Stat>
                  <StatLabel fontSize="sm" color="gray.500">{stat.label}</StatLabel>
                  <StatNumber fontSize="2xl" fontWeight="bold" color="gray.700">{stat.value}</StatNumber>
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
        {/* Sotib olish dinamikasi (oxirgi 30 kun) */}
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} borderRadius="xl" boxShadow="sm">
          <CardHeader>
            <Heading size="md" fontWeight="semibold">📈 Xaridlar dinamikasi (oxirgi oy)</Heading>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={purchaseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#a0aec0" fontSize={12} />
                <YAxis stroke="#a0aec0" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  labelStyle={{ fontWeight: 'bold' }}
                  formatter={(value, name, props) => [`${value} ta`, 'Xarid']}
                />
                <Bar dataKey="value" fill="#3182CE" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
            <Flex justify="center" mt={2} gap={4} fontSize="sm" color="gray.500">
              <Text><Badge colorScheme="blue" mr={1}>30-noy</Badge> Mebel (15 ta)</Text>
              <Text><Badge colorScheme="green" mr={1}>25-dek</Badge> Kompyuterlar (8 ta)</Text>
              <Text><Badge colorScheme="yellow" mr={1}>27-dek</Badge> Qog‘oz (5 ta)</Text>
            </Flex>
          </CardBody>
        </Card>

        {/* Kategoriyalar (doiraviy diagramma) */}
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} borderRadius="xl" boxShadow="sm">
          <CardHeader>
            <Heading size="md" fontWeight="semibold">📦 Kategoriyalar bo‘yicha</Heading>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Ulush']} />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </Grid>

      {/* So'nggi xaridlar jadvali */}
      <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} borderRadius="xl" boxShadow="sm">
        <CardHeader>
          <Heading size="md" fontWeight="semibold">🕒 So‘nggi xaridlar</Heading>
        </CardHeader>
        <CardBody overflowX="auto">
          <Table variant="simple" size="md">
            <Thead>
              <Tr>
                <Th>Mahsulot nomi</Th>
                <Th>Kategoriya</Th>
                <Th>Narxi (so‘m)</Th>
                <Th>Sana</Th>
                <Th>Holati</Th>
              </Tr>
            </Thead>
            <Tbody>
              {recentPurchases.map((item) => (
                <Tr key={item.id}>
                  <Td fontWeight="medium">{item.name}</Td>
                  <Td>{item.category}</Td>
                  <Td>{item.price}</Td>
                  <Td>{item.date}</Td>
                  <Td>
                    <Badge
                      colorScheme={
                        item.status === 'Yetkazilgan' ? 'green' :
                        item.status === 'Yetkazilmoqda' ? 'yellow' : 'red'
                      }
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

      {/* Qo'shimcha: eng muhim xaridlar haqida eslatma */}
      <Box mt={4} p={4} bg="blue.50" borderRadius="lg" borderLeft="4px solid" borderColor="blue.500">
        <Heading size="sm" color="blue.700">📌 Muhim xaridlar</Heading>
        <Text fontSize="sm" color="blue.600" mt={1}>
          • O‘tgan oy (30-noyabr) – 15 dona ofis mebellari xarid qilindi (120 mln so‘m).
          <br />
          • O‘tgan hafta (25-dekabr) – 8 ta kompyuter xarid qilindi (85 mln so‘m).
          <br />
          • Kecha (27-dekabr) – 50 paket A4 qog‘oz xarid qilindi (5 mln so‘m).
        </Text>
      </Box>
    </Box>
  );
}