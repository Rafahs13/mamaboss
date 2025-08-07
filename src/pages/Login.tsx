import React, { useState } from 'react';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
  Link,
  Heading,
  Divider,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { Heart, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { LoginForm } from '../types';
import { CredentialResponse } from '@react-oauth/google';
import { GoogleLoginButton } from '../components/common/GoogleLoginButton';

export const Login: React.FC = () => {
  const [form, setForm] = useState<LoginForm>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginForm>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginForm> = {};

    if (!form.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!form.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (form.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await login(form);
      toast({
        title: 'Login realizado com sucesso!',
        description: 'Bem-vinda de volta!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Erro no login',
        description: error instanceof Error ? error.message : 'Tente novamente',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof LoginForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    try {
      await loginWithGoogle(response);
      toast({
        title: 'Login realizado com sucesso!',
        description: 'Bem-vinda de volta!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Erro no login do Google',
        description: error instanceof Error ? error.message : 'Tente novamente',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleGoogleError = () => {
    toast({
      title: 'Erro no login do Google',
      description: 'Não foi possível fazer login com o Google. Tente novamente.',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Flex minH="100vh" bg="gray.50" align="center" justify="center" p={4}>
      <Box
        bg="white"
        p={8}
        borderRadius="xl"
        boxShadow="xl"
        w="full"
        maxW="400px"
      >
        {/* Logo */}
        <VStack mb={8} spacing={4}>
          <HStack spacing={2}>
            <Heart size={32} color="#ec4899" />
            <Heading
              size="lg"
              bgGradient="linear(to-r, brand.pink, brand.purple)"
              bgClip="text"
            >
              MamaBoss
            </Heading>
          </HStack>
          <Text color="gray.600" textAlign="center">
            Para mães empreendedoras
          </Text>
        </VStack>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <InputGroup>
                <InputLeftElement>
                  <Mail size={16} />
                </InputLeftElement>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={form.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </InputGroup>
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.password}>
              <FormLabel>Senha</FormLabel>
              <InputGroup>
                <InputLeftElement>
                  <Lock size={16} />
                </InputLeftElement>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Sua senha"
                  value={form.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                />
                <InputRightElement>
                  <IconButton
                    aria-label="Toggle password visibility"
                    icon={showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              colorScheme="pink"
              size="lg"
              w="full"
              isLoading={isLoading}
              loadingText="Entrando..."
            >
              Entrar
            </Button>
          </VStack>
        </form>

        <Divider my={6} />

        {/* Google Login */}
        <GoogleLoginButton
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
        />

        <Divider my={6} />

        {/* Links */}
        <VStack spacing={3}>
          <Link as={RouterLink} to="/forgot-password" color="brand.pink">
            Esqueceu sua senha?
          </Link>
          <HStack spacing={1}>
            <Text color="gray.600">Não tem uma conta?</Text>
            <Link as={RouterLink} to="/register" color="brand.pink" fontWeight="semibold">
              Cadastre-se
            </Link>
          </HStack>
        </VStack>
      </Box>
    </Flex>
  );
}; 