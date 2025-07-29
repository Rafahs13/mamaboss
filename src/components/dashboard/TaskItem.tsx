import React from 'react';
import {
  Flex,
  HStack,
  VStack,
  Text,
  Badge,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { CheckCircle, MoreVertical } from 'lucide-react';
import { Task } from '../../types';
import { formatRelativeDate } from '../../utils/formatters';

interface TaskItemProps {
  task: Task;
  onToggleComplete?: (taskId: string) => void;
  onEdit?: (task: Task) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onEdit,
}) => {
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'red';
      case 'media': return 'orange';
      case 'baixa': return 'green';
      default: return 'gray';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'trabalho': return '💼';
      case 'familia': return '👨‍👩‍👧‍👦';
      case 'pessoal': return '❤️';
      default: return '📝';
    }
  };

  return (
    <Flex
      justify="space-between"
      align="center"
      p={3}
      bg={bgColor}
      borderRadius="md"
      border="1px"
      borderColor={borderColor}
      _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}
      transition="all 0.2s"
    >
      <HStack spacing={3} flex={1}>
        <IconButton
          aria-label="Toggle task completion"
          icon={<CheckCircle size={16} />}
          variant="ghost"
          size="sm"
          color={task.completed ? 'green.500' : 'gray.400'}
          onClick={() => onToggleComplete?.(task.id)}
        />
        <VStack align="start" spacing={0} flex={1}>
          <HStack spacing={2}>
            <Text fontSize="sm">{getCategoryIcon(task.category)}</Text>
            <Text
              fontWeight="medium"
              textDecoration={task.completed ? 'line-through' : 'none'}
              color={task.completed ? 'gray.500' : 'inherit'}
            >
              {task.title}
            </Text>
          </HStack>
          {task.description && (
            <Text fontSize="sm" color="gray.600" noOfLines={1}>
              {task.description}
            </Text>
          )}
        </VStack>
      </HStack>
      
      <HStack spacing={2}>
        <Badge colorScheme={getPriorityColor(task.priority)} size="sm">
          {task.priority}
        </Badge>
        {task.dueDate && (
          <Text fontSize="xs" color="gray.500" whiteSpace="nowrap">
            {formatRelativeDate(task.dueDate)}
          </Text>
        )}
        <IconButton
          aria-label="More options"
          icon={<MoreVertical size={14} />}
          variant="ghost"
          size="sm"
          onClick={() => onEdit?.(task)}
        />
      </HStack>
    </Flex>
  );
}; 