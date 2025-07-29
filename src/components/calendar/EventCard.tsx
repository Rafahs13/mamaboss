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
  Users,
  Briefcase,
  BookOpen,
  Calendar,
  Clock,
} from 'lucide-react';
import { Event } from '../../types';
import { formatDate, formatTime } from '../../utils/formatters';

interface EventCardProps {
  event: Event;
  onEdit?: (event: Event) => void;
  onDelete?: (id: string) => void;
  compact?: boolean;
  showActions?: boolean;
}

// Funções auxiliares
const getEventTypeColor = (type: string) => {
  switch (type) {
    case 'familia': return 'pink';
    case 'trabalho': return 'blue';
    case 'escola': return 'green';
    default: return 'gray';
  }
};

const getEventTypeIcon = (type: string) => {
  switch (type) {
    case 'familia': return <Users size={14} />;
    case 'trabalho': return <Briefcase size={14} />;
    case 'escola': return <BookOpen size={14} />;
    default: return <Calendar size={14} />;
  }
};

const getEventTypeLabel = (type: string) => {
  switch (type) {
    case 'familia': return 'Família';
    case 'trabalho': return 'Trabalho';
    case 'escola': return 'Escola';
    default: return type;
  }
};

export const EventCard: React.FC<EventCardProps> = ({
  event,
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
        <Flex justify="space-between" align="start" mb={1}>
          <Text fontWeight="medium" fontSize="sm" noOfLines={1} flex={1}>
            {event.title}
          </Text>
          <Badge colorScheme={getEventTypeColor(event.type)} size="sm">
            {getEventTypeLabel(event.type)}
          </Badge>
        </Flex>
        
        {event.description && (
          <Text fontSize="xs" color="gray.600" mb={1} noOfLines={1}>
            {event.description}
          </Text>
        )}
        
        <HStack spacing={2} color="gray.500">
          <Text fontSize="xs">
            <Calendar size={10} /> {formatDate(event.date)}
          </Text>
          <Text fontSize="xs">
            <Clock size={10} /> {formatTime(event.date)}
          </Text>
        </HStack>

        {showActions && (onEdit || onDelete) && (
          <Flex justify="end" mt={2} gap={1}>
            {onEdit && (
              <Tooltip label="Editar evento">
                <IconButton
                  aria-label="Editar evento"
                  icon={<Edit size={12} />}
                  size="xs"
                  variant="ghost"
                  onClick={() => onEdit(event)}
                />
              </Tooltip>
            )}
            {onDelete && (
              <Tooltip label="Excluir evento">
                <IconButton
                  aria-label="Excluir evento"
                  icon={<Trash2 size={12} />}
                  size="xs"
                  variant="ghost"
                  colorScheme="red"
                  onClick={() => onDelete(event.id)}
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
          <VStack align="start" spacing={1} flex={1}>
            <HStack spacing={2}>
              <Text fontSize="md" fontWeight="bold">
                {event.title}
              </Text>
              <Badge colorScheme={getEventTypeColor(event.type)}>
                {getEventTypeLabel(event.type)}
              </Badge>
            </HStack>
            
            <HStack spacing={3} color="gray.600">
              <Text fontSize="sm">
                <Calendar size={12} /> {formatDate(event.date)}
              </Text>
              <Text fontSize="sm">
                <Clock size={12} /> {formatTime(event.date)}
              </Text>
            </HStack>
          </VStack>

          {showActions && (onEdit || onDelete) && (
            <HStack spacing={1}>
              {onEdit && (
                <Tooltip label="Editar evento">
                  <IconButton
                    aria-label="Editar evento"
                    icon={<Edit size={16} />}
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(event)}
                  />
                </Tooltip>
              )}
              {onDelete && (
                <Tooltip label="Excluir evento">
                  <IconButton
                    aria-label="Excluir evento"
                    icon={<Trash2 size={16} />}
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => onDelete(event.id)}
                  />
                </Tooltip>
              )}
            </HStack>
          )}
        </Flex>

        {event.description && (
          <Text color="gray.600" fontSize="sm">
            {event.description}
          </Text>
        )}
      </VStack>
    </Box>
  );
}; 