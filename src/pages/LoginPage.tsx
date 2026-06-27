import React, { useState } from 'react';
import {
  Box, Flex, VStack, Heading, Text, Input, Button,
  InputGroup, InputLeftElement, InputRightElement,
  FormControl, FormLabel, useToast, Image, Link
} from '@chakra-ui/react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '../Logo/photo_2026-06-26_14.06.30-removebg-preview.png'; // ваш логотип

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify({ name: 'Shoxrux T.', role: 'Administrator' }));
        toast({
          title: 'Muvaffaqiyatli kirish',
          description: 'Hush kelibsiz, Shoxrux T.',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
        navigate('/');
      } else {
        toast({
          title: 'Xatolik',
          description: 'Login yoki parol notoʻgʻri',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bgGradient="linear(to-br, blue.50, purple.50)"
      p={4}
    >
      <Box
        maxW="420px"
        w="full"
        bg="white"
        p={8}
        borderRadius="3xl"
        boxShadow="2xl"
        border="1px solid"
        borderColor="gray.100"
      >
        <VStack spacing={6} align="stretch">
          {/* Логотип – крупно и по центру */}
          <Flex justify="center">
            <Image
              src={Logo}
              alt="Logo"
              h="200px"
              w="auto"
              objectFit="contain"
              fallbackSrc="https://via.placeholder.com/90x90?text=Logo" // если файла нет
            />
          </Flex>
          <form onSubmit={handleLogin}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="medium" color="gray.600">
                  Foydalanuvchi nomi
                </FormLabel>
                <InputGroup size="md">
                  <InputLeftElement pointerEvents="none">
                    <User size={18} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    type="text"
                    placeholder="Loginingizni kiriting"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    bg="gray.50"
                    borderColor="gray.200"
                    _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce' }}
                    borderRadius="lg"
                  />
                </InputGroup>
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="medium" color="gray.600">
                  Parol
                </FormLabel>
                <InputGroup size="md">
                  <InputLeftElement pointerEvents="none">
                    <Lock size={18} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Parolingizni kiriting"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    bg="gray.50"
                    borderColor="gray.200"
                    _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce' }}
                    borderRadius="lg"
                  />
                  <InputRightElement>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      color="gray.400"
                      _hover={{ color: 'blue.500' }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                w="full"
                isLoading={isLoading}
                loadingText="Kirish..."
                mt={2}
                borderRadius="lg"
                fontWeight="semibold"
                boxShadow="md"
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                transition="all 0.2s"
              >
                Kirish
              </Button>

              <Text fontSize="sm" color="blue.500" textAlign="right" w="full">
                <Link href="#" onClick={(e) => e.preventDefault()}>
                  Parolingizni unutdingizmi?
                </Link>
              </Text>
            </VStack>
          </form>

          {/* Дополнительный текст внизу – можно убрать или оставить */}
          <Text fontSize="xs" color="gray.400" textAlign="center">
            © 2025 Barcha huquqlar himoyalangan
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
};

export default LoginPage;