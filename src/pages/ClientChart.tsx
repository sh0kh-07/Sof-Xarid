import React, { useMemo } from 'react';
import {
  Box, Flex, Grid, Heading, Text, Stat, StatLabel, StatNumber,
  StatHelpText, StatArrow, Card, CardHeader, CardBody, Table,
  Thead, Tbody, Tr, Th, Td, Badge, Icon, useColorModeValue,
  SimpleGrid, Divider, HStack, VStack, Alert, AlertIcon, AlertTitle, AlertDescription
} from '@chakra-ui/react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { ShoppingBag, DollarSign, Package, TrendingUp, Calendar, Truck, Zap, BarChart3 } from 'lucide-react';

// ==================== МОКОВЫЕ ДАННЫЕ ====================
// Статистика за последние 6 месяцев (для графика)
const monthlyData = [
  { month: 'Iyul', value: 12 },
  { month: 'Avgust', value: 18 },
  { month: 'Sentabr', value: 14 },
  { month: 'Oktabr', value: 22 },
  { month: 'Noyabr', value: 28 },
  { month: 'Dekabr', value: 35 },
];

// Данные по категориям для круговой диаграммы
const categoryData = [
  { name: 'Mebel', value: 40 },
  { name: 'Elektronika', value: 30 },
  { name: 'Kantselyariya', value: 20 },
  { name: 'Boshqa', value: 10 },
];
const COLORS = ['#3182CE', '#38A169', '#D69E2E', '#805AD5'];

// Последние закупки
const recentPurchases = [
  { id: 1, product: 'Ofis stoli', category: 'Mebel', amount: '120 mln so‘m', date: '2025-12-28', status: 'Yetkazilgan' },
  { id: 2, product: 'Kompyuter (15 dona)', category: 'Elektronika', amount: '85 mln so‘m', date: '2025-12-25', status: 'Yetkazilgan' },
  { id: 3, product: 'A4 qog‘oz (50 paket)', category: 'Kantselyariya', amount: '5 mln so‘m', date: '2025-12-27', status: 'Yetkazilmoqda' },
  { id: 4, product: 'Printer kartridjlari', category: 'Boshqa', amount: '2.5 mln so‘m', date: '2025-12-20', status: 'Yetkazilgan' },
  { id: 5, product: 'Stollar (20 dona)', category: 'Mebel', amount: '18 mln so‘m', date: '2025-12-10', status: 'Yetkazilgan' },
];

// Основные показатели
const stats = [
  { label: 'Jami xaridlar', value: '47', icon: ShoppingBag, color: 'blue.500', change: '+15%' },
  { label: 'Umumiy summa', value: '₴ 345.6 mln', icon: DollarSign, color: 'green.500', change: '+8%' },
  { label: 'O‘rtacha chek', value: '₴ 7.35 mln', icon: TrendingUp, color: 'purple.500', change: '+5%' },
  { label: 'Yetkazib beruvchilar', value: '12', icon: Truck, color: 'orange.500', change: '+4%' },
];

// ==================== КОМПОНЕНТ ====================
export default function ClientChart() {
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // "ИИ-аналитика" – вычисляем тренды и генерируем рекомендации на основе данных
  const aiInsights = useMemo(() => {
    const total = monthlyData.reduce((sum, item) => sum + item.value, 0);
    const avg = (total / monthlyData.length).toFixed(1);
    const lastMonth = monthlyData[monthlyData.length - 1].value;
    const prevMonth = monthlyData[monthlyData.length - 2]?.value || 0;
    const growth = prevMonth ? ((lastMonth - prevMonth) / prevMonth * 100).toFixed(1) : 0;

    // Определяем самую популярную категорию
    const topCategory = categoryData.reduce((a, b) => a.value > b.value ? a : b);
    // Определяем категорию с наименьшим значением
    const lowCategory = categoryData.reduce((a, b) => a.value < b.value ? a : b);

    // Ищем месяц с максимальным значением
    const maxMonth = monthlyData.reduce((a, b) => a.value > b.value ? a : b);

    return {
      total,
      avg,
      growth,
      topCategory: topCategory.name,
      lowCategory: lowCategory.name,
      maxMonth: maxMonth.month,
      maxValue: maxMonth.value,
    };
  }, []);

  return (
    <Box   minH="100vh">
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg" fontWeight="bold" color="gray.700">
          📊 Statistika va AI-analitika
        </Heading>
      </Flex>

      {/* Карточки статистики */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={6}>
        {stats.map((stat, index) => (
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

      {/* Графики */}
      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6} mb={6}>
        {/* Линейный/столбчатый график по месяцам */}
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} borderRadius="xl" boxShadow="sm">
          <CardHeader>
            <Heading size="md" fontWeight="semibold">📈 Xaridlar dinamikasi (oxirgi 6 oy)</Heading>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#a0aec0" fontSize={12} />
                <YAxis stroke="#a0aec0" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  labelStyle={{ fontWeight: 'bold' }}
                  formatter={(value) => [`${value} ta`, 'Xarid']}
                />
                <Bar dataKey="value" fill="#3182CE" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Круговая диаграмма категорий */}
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} borderRadius="xl" boxShadow="sm">
          <CardHeader>
            <Heading size="md" fontWeight="semibold">📦 Kategoriyalar bo‘yicha taqsimot</Heading>
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

      {/* AI-аналитика – интеллектуальные выводы */}
      <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} borderRadius="xl" boxShadow="sm" mb={6}>
        <CardHeader>
          <HStack>
            <Icon as={Zap} boxSize={6} color="yellow.500" />
            <Heading size="md" fontWeight="semibold">🧠 AI-analitika – asosiy xulosalar</Heading>
          </HStack>
        </CardHeader>
        <CardBody>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <Box p={4} bg="blue.50" borderRadius="lg">
              <Text fontWeight="bold" color="blue.700">📊 Umumiy tahlil</Text>
              <Text fontSize="sm" color="blue.600" mt={1}>
                Oxirgi 6 oy ichida <strong>{aiInsights.total}</strong> ta xarid amalga oshirilgan.
                O‘rtacha oylik xaridlar soni <strong>{aiInsights.avg}</strong> tani tashkil etadi.
                {aiInsights.growth > 0 ? ` O‘tgan oyga nisbatan o‘sish ${aiInsights.growth}% ni tashkil qildi.` : ` O‘tgan oyga nisbatan pasayish ${Math.abs(aiInsights.growth)}% kuzatildi.`}
              </Text>
            </Box>
            <Box p={4} bg="green.50" borderRadius="lg">
              <Text fontWeight="bold" color="green.700">🏆 Eng faol kategoriya</Text>
              <Text fontSize="sm" color="green.600" mt={1}>
                Eng ko‘p xarid qilingan kategoriya – <strong>{aiInsights.topCategory}</strong> ({categoryData.find(c => c.name === aiInsights.topCategory)?.value}%).
                Eng kam ulushga ega kategoriya – <strong>{aiInsights.lowCategory}</strong>.
              </Text>
            </Box>
            <Box p={4} bg="purple.50" borderRadius="lg">
              <Text fontWeight="bold" color="purple.700">📈 Mavsumiy tendensiya</Text>
              <Text fontSize="sm" color="purple.600" mt={1}>
                Eng yuqori xaridlar <strong>{aiInsights.maxMonth}</strong> oyida qayd etilgan ({aiInsights.maxValue} ta).
                Bu davrda xaridlarni rejalashtirish samarali bo‘lishi mumkin.
              </Text>
            </Box>
            <Box p={4} bg="orange.50" borderRadius="lg">
              <Text fontWeight="bold" color="orange.700">💡 Tavsiyalar</Text>
              <Text fontSize="sm" color="orange.600" mt={1}>
                <strong>{aiInsights.lowCategory}</strong> bo‘yicha xaridlarni oshirish orqali
                xaridlar portfelini diversifikatsiya qilish tavsiya etiladi.
                Shuningdek, <strong>{aiInsights.topCategory}</strong> yetkazib beruvchilar bilan
                uzoq muddatli shartnomalar tuzish foydali bo‘lishi mumkin.
              </Text>
            </Box>
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Таблица последних закупок */}
      <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} borderRadius="xl" boxShadow="sm">
        <CardHeader>
          <Heading size="md" fontWeight="semibold">🕒 So‘nggi xaridlar</Heading>
        </CardHeader>
        <CardBody overflowX="auto">
          <Table variant="simple" size="md">
            <Thead>
              <Tr>
                <Th>Mahsulot</Th>
                <Th>Kategoriya</Th>
                <Th>Summa</Th>
                <Th>Sana</Th>
                <Th>Holati</Th>
              </Tr>
            </Thead>
            <Tbody>
              {recentPurchases.map((item) => (
                <Tr key={item.id}>
                  <Td fontWeight="medium">{item.product}</Td>
                  <Td>{item.category}</Td>
                  <Td>{item.amount}</Td>
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
    </Box>
  );
}