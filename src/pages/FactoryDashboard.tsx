import React, { useEffect, useState } from "react";
import {
    Box, Flex, Grid, Heading, Text, Stat, StatLabel, StatNumber,
    StatHelpText, StatArrow, Card, CardHeader, CardBody, Table,
    Thead, Tbody, Tr, Th, Td, Badge, Icon, SimpleGrid, Progress,
    useColorModeValue
} from "@chakra-ui/react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import {
    Factory, Truck, Clock, PackageX, Box as BoxIcon, DollarSign,
    AlertTriangle
} from "lucide-react";

const statsData = [
    { label: "Jami ishlab chiqarildi", value: "3,840", icon: Factory, color: "green.500", change: "+12%" },
    { label: "Yetkazilgan buyurtmalar", value: "127", icon: Truck, color: "blue.500", change: "+8%" },
    { label: "Kutilayotgan buyurtmalar", value: "14", icon: Clock, color: "orange.500", change: "+3%" },
    { label: "Rad / Qaytarilgan", value: "5", icon: PackageX, color: "red.500", change: "-2%" },
    { label: "Mahsulot turlari", value: "24", icon: BoxIcon, color: "purple.500", change: "+2 yangi" },
    { label: "Umumiy tushum", value: "₴ 218 mln", icon: DollarSign, color: "green.500", change: "+5%" },
];

const productionData = [
    { day: "1-dek", value: 310 },
    { day: "5-dek", value: 420 },
    { day: "10-dek", value: 270 },
    { day: "15-dek", value: 540 },
    { day: "18-dek", value: 460 },
    { day: "22-dek", value: 660 },
    { day: "25-dek", value: 580 },
    { day: "28-dek", value: 780 },
    { day: "30-dek", value: 700 },
];

const categoryData = [
    { name: "Mebel", value: 38 },
    { name: "Plastik", value: 25 },
    { name: "Metall", value: 20 },
    { name: "Boshqa", value: 17 },
];
const COLORS = ["#3182CE", "#38A169", "#D69E2E", "#805AD5"];

const productionLines = [
    { name: "Liniya A — Mebel", pct: 87, color: "green" },
    { name: "Liniya B — Plastik", pct: 64, color: "blue" },
    { name: "Liniya C — Metall", pct: 45, color: "orange" },
    { name: "Liniya D — Qo'shimcha", pct: 92, color: "green" },
];

const recentOrders = [
    { id: "#FC-0041", product: "Ofis stullari", qty: "50 dona", price: "18,000,000 so'm", date: "2025-12-28", status: "Ishlab chiqarilmoqda" },
    { id: "#FC-0040", product: "Yozuv stollari", qty: "30 dona", price: "24,000,000 so'm", date: "2025-12-26", status: "Yetkazilgan" },
    { id: "#FC-0039", product: "Plastik konteyner", qty: "200 dona", price: "6,000,000 so'm", date: "2025-12-25", status: "Yetkazilgan" },
    { id: "#FC-0038", product: "Metall shkaf", qty: "15 dona", price: "12,500,000 so'm", date: "2025-12-22", status: "Tekshirilmoqda" },
    { id: "#FC-0037", product: "Yotoq mebeli", qty: "10 dona", price: "35,000,000 so'm", date: "2025-12-20", status: "Qaytarilgan" },
];

const statusColor = (s: string) =>
    s === "Yetkazilgan" ? "green"
        : s === "Ishlab chiqarilmoqda" ? "yellow"
            : s === "Tekshirilmoqda" ? "blue"
                : "red";

export default function FactoryDashboard() {
    const cardBg = useColorModeValue("white", "gray.700");
    const borderColor = useColorModeValue("gray.200", "gray.600");

    return (
        <Box minH="100vh">
            {/* Header */}
            <Flex justify="space-between" align="center" mb={6}>
                <Box>
                    <Heading size="lg" fontWeight="bold" color="gray.700">
                        Fabrika boshqaruv paneli
                    </Heading>
                    <Text fontSize="sm" color="gray.500" mt={1}>
                        Ishlab chiqarish va yetkazib berish ko'rsatkichlari
                    </Text>
                </Box>
                <Badge colorScheme="blue" px={3} py={1} borderRadius="md">
                    Dekabr 2025
                </Badge>
            </Flex>

            {/* Stat cards */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mb={6}>
                {statsData.map((s, i) => (
                    <Card key={i} bg={cardBg} borderWidth="1px" borderColor={borderColor}
                        borderRadius="xl" boxShadow="sm">
                        <CardBody>
                            <Flex justify="space-between" align="center">
                                <Stat>
                                    <StatLabel fontSize="sm" color="gray.500">{s.label}</StatLabel>
                                    <StatNumber fontSize="2xl" fontWeight="bold" color="gray.700">
                                        {s.value}
                                    </StatNumber>
                                    <StatHelpText>
                                        <StatArrow type={s.change.startsWith("+") ? "increase" : "decrease"} />
                                        {s.change}
                                    </StatHelpText>
                                </Stat>
                                <Box p={2} bg={`${s.color}20`} borderRadius="lg" color={s.color}>
                                    <Icon as={s.icon} boxSize={6} />
                                </Box>
                            </Flex>
                        </CardBody>
                    </Card>
                ))}
            </SimpleGrid>

            {/* Charts */}
            <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6} mb={6}>
                {/* Bar chart */}
                <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}
                    borderRadius="xl" boxShadow="sm">
                    <CardHeader>
                        <Heading size="md" fontWeight="semibold">
                            📈 Ishlab chiqarish dinamikasi (oxirgi oy)
                        </Heading>
                    </CardHeader>
                    <CardBody>
                        <ResponsiveContainer width="100%" height={240}>
                            <BarChart data={productionData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="day" stroke="#a0aec0" fontSize={12} />
                                <YAxis stroke="#a0aec0" fontSize={12} />
                                <Tooltip
                                    contentStyle={{
                                        background: "white", borderRadius: "8px",
                                        border: "1px solid #e2e8f0"
                                    }}
                                    formatter={(v) => [`${v} dona`, "Ishlab chiqarildi"]}
                                />
                                <Bar dataKey="value" fill="#3182CE" radius={[4, 4, 0, 0]} barSize={28} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardBody>
                </Card>

                {/* Pie chart */}
                <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}
                    borderRadius="xl" boxShadow="sm">
                    <CardHeader>
                        <Heading size="md" fontWeight="semibold">📦 Mahsulot kategoriyalari</Heading>
                    </CardHeader>
                    <CardBody>
                        <ResponsiveContainer width="100%" height={240}>
                            <PieChart>
                                <Pie data={categoryData} cx="50%" cy="50%"
                                    innerRadius={55} outerRadius={75}
                                    paddingAngle={2} dataKey="value"
                                    label={({ name, percent }) =>
                                        `${name} ${(percent * 100).toFixed(0)}%`}
                                    labelLine={false}>
                                    {categoryData.map((_, idx) => (
                                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(v) => [`${v}%`, "Ulush"]} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardBody>
                </Card>
            </Grid>

            {/* Production lines */}
            <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}
                borderRadius="xl" boxShadow="sm" mb={6}>
                <CardHeader>
                    <Heading size="md" fontWeight="semibold">⚙️ Ishlab chiqarish liniyalari holati</Heading>
                </CardHeader>
                <CardBody>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                        {productionLines.map((l, i) => (
                            <Box key={i}>
                                <Flex justify="space-between" mb={1} fontSize="sm" color="gray.600">
                                    <Text>{l.name}</Text>
                                    <Text fontWeight="semibold">{l.pct}%</Text>
                                </Flex>
                                <Progress value={l.pct} colorScheme={l.color}
                                    borderRadius="full" size="sm" />
                            </Box>
                        ))}
                    </SimpleGrid>
                </CardBody>
            </Card>

            {/* Orders table */}
            <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}
                borderRadius="xl" boxShadow="sm" mb={4}>
                <CardHeader>
                    <Heading size="md" fontWeight="semibold">🕒 So'nggi buyurtmalar</Heading>
                </CardHeader>
                <CardBody overflowX="auto">
                    <Table variant="simple" size="md">
                        <Thead>
                            <Tr>
                                <Th>Buyurtma</Th><Th>Mahsulot</Th><Th>Miqdor</Th>
                                <Th>Narxi</Th><Th>Sana</Th><Th>Holat</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {recentOrders.map((o) => (
                                <Tr key={o.id}>
                                    <Td color="gray.400" fontSize="sm">{o.id}</Td>
                                    <Td fontWeight="medium">{o.product}</Td>
                                    <Td>{o.qty}</Td>
                                    <Td>{o.price}</Td>
                                    <Td>{o.date}</Td>
                                    <Td>
                                        <Badge colorScheme={statusColor(o.status)}
                                            rounded="full" px={3} py={1}>
                                            {o.status}
                                        </Badge>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </CardBody>
            </Card>

            {/* Alert box */}
            <Box p={4} bg="orange.50" borderRadius="lg"
                borderLeft="4px solid" borderColor="orange.400">
                <Heading size="sm" color="orange.700" mb={1}>
                    ⚠️ Diqqat talab qiladigan masalalar
                </Heading>
                <Text fontSize="sm" color="orange.600" lineHeight={1.8}>
                    • Liniya C (Metall) — samaradorlik 45%ga tushdi, texnik ko'rik tavsiya etiladi.
                    <br />
                    • #FC-0037 buyurtma qaytarilgan — mijoz bilan muammo hal qilinishi kerak.
                    <br />
                    • 14 ta kutilayotgan buyurtma — yetkazib berish muddatlarini tekshiring.
                </Text>
            </Box>
        </Box>
    );
}