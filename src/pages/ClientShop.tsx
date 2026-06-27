import React, { useState, useMemo } from 'react';
import {
  Box, Flex, Heading, Text, Input, Select, Button,
  Card, CardBody, CardFooter, Image, Stack, Badge,
  RangeSlider, RangeSliderTrack, RangeSliderFilledTrack,
  RangeSliderThumb, HStack, VStack, SimpleGrid, Divider,
  Icon, useColorModeValue, Checkbox, CheckboxGroup,
  InputGroup, InputLeftElement, Accordion, AccordionItem,
  AccordionButton, AccordionPanel, AccordionIcon
} from '@chakra-ui/react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

// ==================== ДАННЫЕ ====================
const MANUFACTURERS = [
  {
    id: 'm1',
    name: 'Tashkent Furniture Factory',
    nameUz: 'Toshkent Mebel Fabrikasi',
    location: 'Tashkent, Sergeli district',
    locationUz: 'Toshkent, Sergeli tumani',
    rating: 4.8,
  },
  {
    id: 'm2',
    name: 'Uzbek Tech Assembling',
    nameUz: 'O‘zbek Tech Assembling',
    location: 'Tashkent, Yakkasaray district',
    locationUz: 'Toshkent, Yakkasaroy tumani',
    rating: 4.9,
  },
  {
    id: 'm3',
    name: 'Fergana Paper Mill',
    nameUz: 'Farg‘ona Qog‘oz Zavodi',
    location: 'Fergana, Fergana region',
    locationUz: 'Farg‘ona, Farg‘ona viloyati',
    rating: 4.7,
  }
];

const PRODUCTS = [
  {
    id: 'p1',
    nameUz: 'Ergonomic ofis stoli (160x80 sm)',
    category: 'furniture',
    manufacturerId: 'm1',
    price: 320,
    minOrderUz: '1 ta',
    locationUz: 'Toshkent, Sergeli tumani',
    image: 'https://cervany.com/cdn/shop/files/Standing_desk_oak_veneer_3_600x.jpg',
    rating: 4.8,
  },
  {
    id: 'p2',
    nameUz: 'Kompyuter (Intel Core i5, 16GB RAM, 512GB SSD)',
    category: 'electronics',
    manufacturerId: 'm2',
    price: 850,
    minOrderUz: '1 ta',
    locationUz: 'Toshkent, Yakkasaroy tumani',
    image: 'https://cdn.mediapark.uz/imgs/800aacab-93f2-48d4-a119-1c0de1127cba_%D0%9C%D0%BE%D0%BD%D1%82%D0%B0%D0%B6%D0%BD%D0%B0%D1%8F-%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C-1_1300.webp',
    rating: 4.9,
  },
  {
    id: 'p3',
    nameUz: 'Premium A4 qog‘oz (80 g/m², 500 varag)',
    category: 'office_supplies',
    manufacturerId: 'm3',
    price: 8,
    minOrderUz: '10 quti (5 000 varaq)',
    locationUz: 'Farg‘ona, Farg‘ona viloyati',
    image: 'https://images.uzum.uz/d50j9c0jsv1neacpdqg0/t_product_540_high.jpg',
    rating: 4.7,
  }
];

// ==================== КОМПОНЕНТ ====================
export default function ProcurementMarketplace() {
  // --- Уникальные значения для фильтров ---
  const allRegions = [...new Set(PRODUCTS.map(p => p.locationUz))];
  const allCategories = [...new Set(PRODUCTS.map(p => p.category))];
  const allManufacturers = MANUFACTURERS.map(m => ({ id: m.id, name: m.nameUz }));

  const categoryLabels = {
    furniture: 'Mebel',
    electronics: 'Elektronika',
    office_supplies: 'Kantselyariya',
  };

  // --- Состояния фильтров ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedManufacturers, setSelectedManufacturers] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('price_asc');

  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // --- Фильтрация и сортировка ---
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      const matchesSearch = product.nameUz.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRegion = selectedRegions.length === 0 || selectedRegions.includes(product.locationUz);
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const matchesManufacturer = selectedManufacturers.length === 0 || selectedManufacturers.includes(product.manufacturerId);
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesSearch && matchesRegion && matchesCategory && matchesManufacturer && matchesPrice;
    });
  }, [searchTerm, selectedRegions, selectedCategories, selectedManufacturers, priceRange]);

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    switch (sortBy) {
      case 'price_asc': sorted.sort((a, b) => a.price - b.price); break;
      case 'price_desc': sorted.sort((a, b) => b.price - a.price); break;
      case 'rating': sorted.sort((a, b) => b.rating - a.rating); break;
      default: break;
    }
    return sorted;
  }, [filteredProducts, sortBy]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedRegions([]);
    setSelectedCategories([]);
    setSelectedManufacturers([]);
    setPriceRange([0, 1000]);
    setSortBy('price_asc');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price * 1000);
  };

  return (
    <Box minH="100vh">
      {/* Основная карточка с увеличенным радиусом и бордером */}
      <Box
        maxW="1400px"
        mx="auto"
        bg="white"
        borderRadius="3xl"
        borderWidth="2px"
        borderColor="gray.200"
        boxShadow="xl"
        p={6}
        transition="all 0.2s"
      >
        {/* Поиск и заголовок */}
        <Flex direction={{ base: 'column', md: 'row' }} align="center" justify="space-between" mb={4} gap={4}>
          <Heading size="md" fontWeight="bold" color="blue.600" display="flex" alignItems="center">
            Xaridlari
          </Heading>
          <InputGroup maxW="400px" size="md">
            <InputLeftElement pointerEvents="none">
              <Search size={18} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Mahsulot izlash..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              borderRadius="xl"
              bg="gray.50"
              borderColor="gray.300"
              _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce' }}
            />
          </InputGroup>
        </Flex>

        {/* Фильтры (аккордеон) */}
        <Accordion allowToggle defaultIndex={[0]} mb={6}>
          <AccordionItem border="1px solid" borderColor={borderColor} borderRadius="2xl" overflow="hidden">
            <AccordionButton _hover={{ bg: 'gray.50' }} px={4} py={3}>
              <HStack flex="1" spacing={2}>
                <Icon as={SlidersHorizontal} boxSize={5} color="blue.500" />
                <Heading size="sm" fontWeight="semibold">Filtrlar</Heading>
                <Badge colorScheme="blue" rounded="full" px={2}>
                  {selectedRegions.length + selectedCategories.length + selectedManufacturers.length > 0 ? '🟢' : '⚪'}
                </Badge>
              </HStack>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} pt={2}>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={6}>
                {/* Регион */}
                <Box>
                  <Text fontWeight="semibold" fontSize="sm" mb={2}>Viloyat</Text>
                  <CheckboxGroup value={selectedRegions} onChange={setSelectedRegions}>
                    <VStack align="start" spacing={1} maxH="120px" overflowY="auto">
                      {allRegions.map(region => (
                        <Checkbox key={region} value={region} size="sm" colorScheme="blue">{region}</Checkbox>
                      ))}
                    </VStack>
                  </CheckboxGroup>
                </Box>

                {/* Категория */}
                <Box>
                  <Text fontWeight="semibold" fontSize="sm" mb={2}>Kategoriya</Text>
                  <CheckboxGroup value={selectedCategories} onChange={setSelectedCategories}>
                    <VStack align="start" spacing={1}>
                      {allCategories.map(cat => (
                        <Checkbox key={cat} value={cat} size="sm" colorScheme="blue">{categoryLabels[cat] || cat}</Checkbox>
                      ))}
                    </VStack>
                  </CheckboxGroup>
                </Box>

                {/* Производитель */}
                <Box>
                  <Text fontWeight="semibold" fontSize="sm" mb={2}>Ishlab chiqaruvchi</Text>
                  <CheckboxGroup value={selectedManufacturers} onChange={setSelectedManufacturers}>
                    <VStack align="start" spacing={1} maxH="120px" overflowY="auto">
                      {allManufacturers.map(m => (
                        <Checkbox key={m.id} value={m.id} size="sm" colorScheme="blue">{m.name}</Checkbox>
                      ))}
                    </VStack>
                  </CheckboxGroup>
                </Box>

                {/* Цена */}
                <Box>
                  <Text fontWeight="semibold" fontSize="sm" mb={2}>Narx oralig‘i (ming so‘m)</Text>
                  <RangeSlider
                    min={0} max={1000} step={10}
                    value={priceRange} onChange={setPriceRange}
                    colorScheme="blue"
                  >
                    <RangeSliderTrack><RangeSliderFilledTrack /></RangeSliderTrack>
                    <RangeSliderThumb index={0} />
                    <RangeSliderThumb index={1} />
                  </RangeSlider>
                  <HStack justify="space-between" fontSize="xs" color="gray.500">
                    <Text>{priceRange[0]} ming</Text>
                    <Text>{priceRange[1]} ming</Text>
                  </HStack>
                </Box>

                {/* Сортировка + сброс */}
                <Box>
                  <Text fontWeight="semibold" fontSize="sm" mb={2}>Saralash</Text>
                  <Select size="sm" value={sortBy} onChange={(e) => setSortBy(e.target.value)} borderRadius="lg" borderColor="gray.300">
                    <option value="price_asc">Narx: arzon → qimmat</option>
                    <option value="price_desc">Narx: qimmat → arzon</option>
                    <option value="rating">Reyting bo‘yicha</option>
                  </Select>
                  <Button size="sm" variant="outline" colorScheme="red" mt={3} w="full" onClick={resetFilters} borderRadius="xl">
                    <Icon as={X} mr={1} boxSize={4} /> Filtrlarni tozalash
                  </Button>
                </Box>
              </SimpleGrid>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        {/* Количество найденных товаров */}
        <Flex justify="space-between" align="center" mb={4}>
          <Text fontSize="sm" color="gray.500">
            {sortedProducts.length} ta mahsulot topildi
          </Text>
        </Flex>

        {/* Список товаров */}
        {sortedProducts.length === 0 ? (
          <Box textAlign="center" py={10}>
            <Text fontSize="lg" color="gray.500">Hech qanday mahsulot topilmadi</Text>
            <Button mt={4} onClick={resetFilters} size="md" borderRadius="xl">Filtrni tozalash</Button>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
            {sortedProducts.map(product => (
              <Card
                key={product.id}
                bg={cardBg}
                borderWidth="2px"
                borderColor={borderColor}
                borderRadius="2xl"
                overflow="hidden"
                boxShadow="md"
                transition="all 0.2s"
                _hover={{ transform: 'translateY(-4px)', boxShadow: 'lg' }}
              >
                <Image
                  src={product.image}
                  alt={product.nameUz}
                  h="200px"
                  w="full"
                  objectFit="cover"
                  fallbackSrc="https://via.placeholder.com/300x200?text=Rasm+mavjud+emas"
                />
                <CardBody>
                  <Stack spacing={2}>
                    <Heading size="sm" noOfLines={2}>{product.nameUz}</Heading>
                    <Text fontSize="sm" color="gray.500">{product.locationUz}</Text>
                    <HStack>
                      <Badge colorScheme="blue" borderRadius="full" px={3} py={1}>{categoryLabels[product.category] || product.category}</Badge>
                      <Badge colorScheme="green" borderRadius="full" px={3} py={1}>⭐ {product.rating}</Badge>
                    </HStack>
                    <Text fontSize="lg" fontWeight="bold" color="blue.600">
                      {formatPrice(product.price)}
                    </Text>
                    <Text fontSize="xs" color="gray.400">Min. buyurtma: {product.minOrderUz}</Text>
                  </Stack>
                </CardBody>
                <CardFooter>
                  <Button w="full" size="md" colorScheme="blue" variant="outline" borderRadius="xl">
                    Ko‘rish
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Box>
    </Box>
  );
}