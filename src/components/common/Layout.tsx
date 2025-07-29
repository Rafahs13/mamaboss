import React from 'react';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  IconButton,
  Button,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
} from '@chakra-ui/react';
import {
  Menu as MenuIcon,
  Home,
  CheckSquare,
  Target,
  Calendar,
  DollarSign,
  BookOpen,
  Settings,
  LogOut,
  Heart,
  Crown,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  label: string;
  icon: React.ReactElement;
  path: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: <Home size={20} />, path: '/dashboard' },
  { label: 'Tarefas', icon: <CheckSquare size={20} />, path: '/tasks' },
  { label: 'Metas', icon: <Target size={20} />, path: '/goals' },
  { label: 'Calendário', icon: <Calendar size={20} />, path: '/calendar' },
  { label: 'Finanças', icon: <DollarSign size={20} />, path: '/finances' },
  { label: 'Cursos', icon: <BookOpen size={20} />, path: '/courses' },
  { label: 'Assinatura', icon: <Crown size={20} />, path: '/subscription' },
  { label: 'Configurações', icon: <Settings size={20} />, path: '/settings' },
];

const Sidebar: React.FC<{ isMobile?: boolean }> = ({ isMobile = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <VStack
      bg="white"
      borderRight="1px"
      borderColor="gray.200"
      h="full"
      w={isMobile ? 'full' : '250px'}
      gap={0}
      align="stretch"
    >
      {/* Logo */}
      <Flex
        align="center"
        justify="center"
        p={6}
        borderBottom="1px"
        borderColor="gray.200"
      >
        <HStack gap={2}>
          <Heart size={24} color="#ec4899" />
          <Text
            fontSize="xl"
            fontWeight="bold"
            bgGradient="linear(to-r, brand.pink, brand.purple)"
            bgClip="text"
          >
            MamaBoss
          </Text>
        </HStack>
      </Flex>

      {/* Navigation */}
      <VStack flex={1} gap={1} p={4}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Button
              key={item.path}
              w="full"
              justifyContent="flex-start"
              variant={isActive ? 'solid' : 'ghost'}
              colorScheme={isActive ? 'pink' : 'gray'}
              onClick={() => navigate(item.path)}
              borderRadius="lg"
              h="48px"
            >
              <Box mr={2}>{item.icon}</Box>
              {item.label}
            </Button>
          );
        })}
      </VStack>

      {/* User Menu */}
      <Box p={4} borderTop="1px" borderColor="gray.200">
        <VStack gap={2}>
          <Text fontSize="sm" fontWeight="medium">
            {user?.name}
          </Text>
          <Text fontSize="xs" color="gray.500">
            {user?.email}
          </Text>
          <Button
            w="full"
            variant="ghost"
            leftIcon={<LogOut size={16} />}
            onClick={handleLogout}
            size="sm"
          >
            Sair
          </Button>
        </VStack>
      </Box>
    </VStack>
  );
};

const Header: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <Flex
      bg="white"
      borderBottom="1px"
      borderColor="gray.200"
      h="60px"
      align="center"
      px={4}
      justify="space-between"
    >
      <HStack gap={4}>
        <IconButton
          aria-label="Menu"
          icon={<MenuIcon size={20} />}
          variant="ghost"
          onClick={onMenuClick}
          display={{ base: 'flex', lg: 'none' }}
        />
        <Text fontSize="lg" fontWeight="semibold">
          Bem-vinda, {user?.name?.split(' ')[0]}! 💪
        </Text>
      </HStack>

      <HStack gap={4}>
        <Text fontSize="sm" color="gray.500">
          {new Date().toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </HStack>
    </Flex>
  );
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex h="100vh" bg="gray.50">
      {/* Sidebar Desktop */}
      <Box display={{ base: 'none', lg: 'block' }}>
        <Sidebar />
      </Box>

      {/* Main Content */}
      <Flex flex={1} direction="column">
        <Header onMenuClick={onOpen} />
        <Box flex={1} p={6} overflow="auto">
          {children}
        </Box>
      </Flex>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>
            <HStack gap={2}>
              <Heart size={24} color="#ec4899" />
              <Text
                fontSize="xl"
                fontWeight="bold"
                bgGradient="linear(to-r, brand.pink, brand.purple)"
                bgClip="text"
              >
                MamaBoss
              </Text>
            </HStack>
          </DrawerHeader>
          <DrawerBody p={0}>
            <Sidebar isMobile />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}; 