import React from 'react';
import {
  Card,
  CardBody,
  VStack,
  HStack,
  Text,
  Badge,
  Progress,
  IconButton,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import { Target, Calendar, Edit } from 'lucide-react';
import { Goal } from '../../types';
import { formatRelativeDate } from '../../utils/formatters';

interface GoalCardProps {
  goal: Goal;
  onEdit?: (goal: Goal) => void;
  compact?: boolean;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onEdit, compact = false }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'blue';
      case 'concluida': return 'green';
      case 'pausada': return 'orange';
      default: return 'gray';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'trabalho': return '💼';
      case 'familia': return '👨‍👩‍👧‍👦';
      case 'pessoal': return '❤️';
      case 'financeiro': return '💰';
      case 'saude': return '🏃‍♀️';
      default: return '🎯';
    }
  };

  if (compact) {
    return (
      <Card bg={bgColor} border="1px" borderColor={borderColor} size="sm">
        <CardBody p={3}>
          <VStack align="stretch" spacing={2}>
            <Flex justify="space-between" align="center">
              <HStack spacing={2} flex={1}>
                <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                  {goal.title}
                </Text>
                <Badge size="sm" colorScheme={getStatusColor(goal.status)}>
                  {goal.status}
                </Badge>
              </HStack>
              {onEdit && (
                <IconButton
                  aria-label="Editar meta"
                  icon={<Edit size={12} />}
                  size="xs"
                  variant="ghost"
                  onClick={() => onEdit(goal)}
                />
              )}
            </Flex>
            
            <HStack spacing={2} color="gray.600">
              <Text fontSize="xs">{getCategoryIcon(goal.category)}</Text>
              {goal.dueDate && (
                <Text fontSize="xs">
                  <Calendar size={10} /> {formatRelativeDate(goal.dueDate)}
                </Text>
              )}
            </HStack>

            <VStack align="stretch" spacing={1}>
              <Flex justify="space-between" align="center">
                <Text fontSize="xs" color="gray.600">
                  Progresso
                </Text>
                <Text fontSize="xs" fontWeight="medium">
                  {goal.progress}%
                </Text>
              </Flex>
              <Progress
                value={goal.progress}
                colorScheme={goal.progress >= 100 ? 'green' : 'blue'}
                size="sm"
                borderRadius="full"
              />
            </VStack>
          </VStack>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card bg={bgColor} border="1px" borderColor={borderColor}>
      <CardBody>
        <VStack align="stretch" spacing={3}>
          <Flex justify="space-between" align="start">
            <VStack align="start" spacing={1} flex={1}>
              <HStack spacing={2}>
                <Text fontSize="md" fontWeight="bold">
                  {goal.title}
                </Text>
                <Badge colorScheme={getStatusColor(goal.status)}>
                  {goal.status}
                </Badge>
              </HStack>
              <HStack spacing={2} color="gray.600">
                <Text fontSize="sm">{getCategoryIcon(goal.category)} {goal.category}</Text>
                {goal.dueDate && (
                  <Text fontSize="sm">
                    <Calendar size={12} /> {formatRelativeDate(goal.dueDate)}
                  </Text>
                )}
              </HStack>
            </VStack>
            {onEdit && (
              <IconButton
                aria-label="Editar meta"
                icon={<Edit size={16} />}
                size="sm"
                variant="ghost"
                onClick={() => onEdit(goal)}
              />
            )}
          </Flex>

          {goal.description && (
            <Text color="gray.600" fontSize="sm" noOfLines={2}>
              {goal.description}
            </Text>
          )}

          <VStack align="stretch" spacing={2}>
            <Flex justify="space-between" align="center">
              <Text fontSize="sm" fontWeight="medium">
                Progresso
              </Text>
              <Text fontSize="sm" color="gray.600">
                {goal.progress}%
              </Text>
            </Flex>
            <Progress
              value={goal.progress}
              colorScheme={goal.progress >= 100 ? 'green' : 'blue'}
              size="lg"
              borderRadius="full"
            />
          </VStack>
        </VStack>
      </CardBody>
    </Card>
  );
}; 