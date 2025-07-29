import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  IconButton,
  Flex,
  useColorModeValue,
  Tooltip,
} from '@chakra-ui/react';
import {
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  Calendar,
  Briefcase,
  Home,
  DollarSign,
  ShoppingCart,
  Car,
  Heart,
  BookOpen,
  Utensils,
  Wifi,
  Zap,
} from 'lucide-react';
import { Finance } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface FinanceCardProps {
  finance: Finance;
  onEdit?: (finance: Finance) => void;
  onDelete?: (id: string) => void;
  compact?: boolean;
  showActions?: boolean;
}

// Funções auxiliares
const getTypeColor = (type: string) => {
  return type === 'receita' ? 'green' : 'red';
};

const getTypeIcon = (type: string) => {
  return type === 'receita' ? <TrendingUp size={16} /> : <TrendingDown size={16} />;
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'alimentacao': return <Utensils size={16} />;
    case 'transporte': return <Car size={16} />;
    case 'moradia': return <Home size={16} />;
    case 'saude': return <Heart size={16} />;
    case 'educacao': return <BookOpen size={16} />;
    case 'lazer': return <Heart size={16} />;
    case 'servicos': return <Wifi size={16} />;
    case 'energia': return <Zap size={16} />;
    case 'salario': return <DollarSign size={16} />;
    case 'freelance': return <Briefcase size={16} />;
    case 'investimentos': return <TrendingUp size={16} />;
    case 'vendas': return <ShoppingCart size={16} />;
    case 'presentes': return <Heart size={16} />;
    default: return <DollarSign size={16} />;
  }
};

const getCategoryLabel = (category: string) => {
  const categories: Record<string, string> = {
    alimentacao: 'Alimentação',
    transporte: 'Transporte',
    moradia: 'Moradia',
    saude: 'Saúde',
    educacao: 'Educação',
    lazer: 'Lazer',
    servicos: 'Serviços',
    energia: 'Energia',
    salario: 'Salário',
    freelance: 'Freelance',
    investimentos: 'Investimentos',
    vendas: 'Vendas',
    presentes: 'Presentes',
    outros: 'Outros',
  };
  return categories[category] || category;
};

export const FinanceCard: React.FC<FinanceCardProps> = ({
  finance,
  onEdit,
  onDelete,
  compact = false,
  showActions = true,
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  if (compact) {
    return (
      <Box
        p={3}
        bg={bgColor}
        border="1px"
        borderColor={borderColor}
        borderRadius="md"
        _hover={{ bg: hoverBg }}
      >
        <Flex justify="space-between" align="center">
          <HStack spacing={2} flex={1}>
            <Box
              p={1}
              bg={`${getTypeColor(finance.type)}.100`}
              borderRadius="sm"
              color={`${getTypeColor(finance.type)}.600`}
            >
              {getTypeIcon(finance.type)}
            </Box>
            
            <VStack align="start" spacing={0} flex={1}>
              <Text fontWeight="medium" fontSize="sm" noOfLines={1}>
                {finance.description}
              </Text>
              <HStack spacing={2} color="gray.600">
                <Text fontSize="xs">
                  {getCategoryIcon(finance.category)} {getCategoryLabel(finance.category)}
                </Text>
                <Text fontSize="xs">
                  <Calendar size={10} /> {formatDate(finance.date)}
                </Text>
              </HStack>
            </VStack>
          </HStack>

          <VStack align="end" spacing={1}>
            <Text
              fontSize="sm"
              fontWeight="bold"
              color={getTypeColor(finance.type) + '.500'}
            >
              {finance.type === 'receita' ? '+' : '-'}{formatCurrency(finance.amount)}
            </Text>
            
            <Badge colorScheme={finance.isBusiness ? 'blue' : 'purple'} size="xs">
              {finance.isBusiness ? 'Negócio' : 'Pessoal'}
            </Badge>
          </VStack>
        </Flex>

        {showActions && (onEdit || onDelete) && (
          <Flex justify="end" mt={2} gap={1}>
            {onEdit && (
              <Tooltip label="Editar transação">
                <IconButton
                  aria-label="Editar transação"
                  icon={<Edit size={12} />}
                  size="xs"
                  variant="ghost"
                  onClick={() => onEdit(finance)}
                />
              </Tooltip>
            )}
            {onDelete && (
              <Tooltip label="Excluir transação">
                <IconButton
                  aria-label="Excluir transação"
                  icon={<Trash2 size={12} />}
                  size="xs"
                  variant="ghost"
                  colorScheme="red"
                  onClick={() => onDelete(finance.id)}
                />
              </Tooltip>
            )}
          </Flex>
        )}
      </Box>
    );
  }

  return (
    <Box
      p={4}
      bg={bgColor}
      border="1px"
      borderColor={borderColor}
      borderRadius="lg"
      _hover={{ bg: hoverBg }}
    >
      <VStack align="stretch" spacing={3}>
        <Flex justify="space-between" align="start">
          <HStack spacing={3} flex={1}>
            <Box
              p={2}
              bg={`${getTypeColor(finance.type)}.100`}
              borderRadius="md"
              color={`${getTypeColor(finance.type)}.600`}
            >
              {getTypeIcon(finance.type)}
            </Box>
            
            <VStack align="start" spacing={1} flex={1}>
              <HStack spacing={2}>
                <Text fontWeight="bold" fontSize="md">
                  {finance.description}
                </Text>
                <Badge colorScheme={getTypeColor(finance.type)} size="sm">
                  {finance.type === 'receita' ? 'Receita' : 'Despesa'}
                </Badge>
                <Badge colorScheme={finance.isBusiness ? 'blue' : 'purple'} size="sm">
                  {finance.isBusiness ? 'Negócio' : 'Pessoal'}
                </Badge>
              </HStack>
              
              <HStack spacing={3} color="gray.600">
                <Text fontSize="sm">
                  {getCategoryIcon(finance.category)} {getCategoryLabel(finance.category)}
                </Text>
                <Text fontSize="sm">
                  <Calendar size={12} /> {formatDate(finance.date)}
                </Text>
              </HStack>
            </VStack>
          </HStack>

          <VStack align="end" spacing={1}>
            <Text
              fontSize="lg"
              fontWeight="bold"
              color={getTypeColor(finance.type) + '.500'}
            >
              {finance.type === 'receita' ? '+' : '-'}{formatCurrency(finance.amount)}
            </Text>
            
            {showActions && (onEdit || onDelete) && (
              <HStack spacing={1}>
                {onEdit && (
                  <Tooltip label="Editar transação">
                    <IconButton
                      aria-label="Editar transação"
                      icon={<Edit size={16} />}
                      size="sm"
                      variant="ghost"
                      onClick={() => onEdit(finance)}
                    />
                  </Tooltip>
                )}
                {onDelete && (
                  <Tooltip label="Excluir transação">
                    <IconButton
                      aria-label="Excluir transação"
                      icon={<Trash2 size={16} />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => onDelete(finance.id)}
                    />
                  </Tooltip>
                )}
              </HStack>
            )}
          </VStack>
        </Flex>
      </VStack>
    </Box>
  );
}; 