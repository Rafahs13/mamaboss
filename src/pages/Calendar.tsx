import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Badge,
  IconButton,
  Flex,
  useToast,
  Card,
  CardBody,
  Grid,
  GridItem,
  useColorModeValue,
  Alert,
  AlertIcon,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverHeader,
  PopoverArrow,
  PopoverCloseButton,
} from '@chakra-ui/react';
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  Briefcase,
  BookOpen,
  Filter,
  Search,
} from 'lucide-react';
import { Event, EventForm } from '../types';
import { formatDate, formatTime, formatRelativeDate } from '../utils/formatters';
import { useEvents } from '../contexts/EventContext';

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

// Componente do calendário
const CalendarGrid: React.FC<{
  currentDate: Date;
  events: Event[];
  onDateClick: (date: Date) => void;
  selectedDate: Date | null;
}> = ({ currentDate, events, onDateClick, selectedDate }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const todayBg = useColorModeValue('blue.50', 'blue.900');
  const selectedBg = useColorModeValue('purple.50', 'purple.900');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const otherMonthBg = useColorModeValue('gray.50', 'gray.900');

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const firstDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Adicionar dias do mês anterior para completar a primeira semana
    for (let i = 0; i < firstDayOfWeek; i++) {
      const prevDate = new Date(year, month, -firstDayOfWeek + i + 1);
      days.push({ date: prevDate, isCurrentMonth: false });
    }

    // Adicionar dias do mês atual
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      days.push({ date: currentDate, isCurrentMonth: true });
    }

    // Adicionar dias do próximo mês para completar a última semana
    const remainingDays = 42 - days.length; // 6 semanas * 7 dias
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({ date: nextDate, isCurrentMonth: false });
    }

    return days;
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();
  const isToday = (date: Date) => {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date) => {
    return selectedDate && (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  return (
    <Grid templateColumns="repeat(7, 1fr)" gap={1}>
      {/* Cabeçalho dos dias da semana */}
      {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
        <GridItem key={day} p={2} textAlign="center">
          <Text fontSize="sm" fontWeight="bold" color="gray.600">
            {day}
          </Text>
        </GridItem>
      ))}

      {/* Dias do calendário */}
      {days.map(({ date, isCurrentMonth }, index) => {
        const dayEvents = getEventsForDate(date);
        const hasEvents = dayEvents.length > 0;

        return (
          <GridItem
            key={index}
            p={2}
            minH="80px"
            border="1px"
            borderColor={borderColor}
            cursor="pointer"
            position="relative"
            onClick={() => onDateClick(date)}
            _hover={{ bg: hoverBg }}
            bg={
              isToday(date)
                ? todayBg
                : isSelected(date)
                ? selectedBg
                : !isCurrentMonth
                ? otherMonthBg
                : bgColor
            }
            opacity={!isCurrentMonth ? 0.5 : 1}
          >
            <Text
              fontSize="sm"
              fontWeight={isToday(date) ? "bold" : "normal"}
              color={isToday(date) ? "blue.600" : "inherit"}
            >
              {date.getDate()}
            </Text>

            {/* Indicador de eventos */}
            {hasEvents && (
              <VStack spacing={1} mt={1} align="stretch">
                {dayEvents.slice(0, 2).map((event) => (
                  <Tooltip
                    key={event.id}
                    label={`${event.title} - ${formatTime(event.date)}`}
                    placement="top"
                  >
                    <Box
                      p={1}
                      bg={`${getEventTypeColor(event.type)}.100`}
                      borderRadius="sm"
                      fontSize="xs"
                      color={`${getEventTypeColor(event.type)}.800`}
                      noOfLines={1}
                    >
                      <HStack spacing={1}>
                        {getEventTypeIcon(event.type)}
                        <Text fontSize="xs" noOfLines={1}>
                          {event.title}
                        </Text>
                      </HStack>
                    </Box>
                  </Tooltip>
                ))}
                {dayEvents.length > 2 && (
                  <Text fontSize="xs" color="gray.500" textAlign="center">
                    +{dayEvents.length - 2} mais
                  </Text>
                )}
              </VStack>
            )}
          </GridItem>
        );
      })}
    </Grid>
  );
};

// Componente de lista de eventos
const EventList: React.FC<{
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
}> = ({ events, onEdit, onDelete }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  if (events.length === 0) {
    return (
      <Card bg={bgColor} border="1px" borderColor={borderColor}>
        <CardBody>
          <VStack spacing={4} py={8}>
            <Calendar size={48} color="gray.400" />
            <Text color="gray.500" textAlign="center">
              Nenhum evento encontrado
            </Text>
          </VStack>
        </CardBody>
      </Card>
    );
  }

  return (
    <VStack spacing={3} align="stretch">
      {events.map((event) => (
        <Card key={event.id} bg={bgColor} border="1px" borderColor={borderColor}>
          <CardBody>
            <VStack align="stretch" spacing={3}>
              <Flex justify="space-between" align="start">
                <VStack align="start" spacing={1} flex={1}>
                  <HStack spacing={2}>
                    <Text fontSize="md" fontWeight="bold">
                      {event.title}
                    </Text>
                    <Badge colorScheme={getEventTypeColor(event.type)} size="sm">
                      {getEventTypeLabel(event.type)}
                    </Badge>
                  </HStack>
                  <HStack spacing={2} color="gray.600">
                    <Text fontSize="sm">
                      <Clock size={12} /> {formatDate(event.date)} às {formatTime(event.date)}
                    </Text>
                  </HStack>
                </VStack>
                <HStack spacing={2}>
                  <IconButton
                    aria-label="Editar evento"
                    icon={<Edit size={16} />}
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(event)}
                  />
                  <IconButton
                    aria-label="Excluir evento"
                    icon={<Trash2 size={16} />}
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => onDelete(event.id)}
                  />
                </HStack>
              </Flex>

              {event.description && (
                <Text color="gray.600" fontSize="sm">
                  {event.description}
                </Text>
              )}
            </VStack>
          </CardBody>
        </Card>
      ))}
    </VStack>
  );
};

// Modal de evento
interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: Event | null;
  onSubmit: (eventData: EventForm) => void;
  isSubmitting: boolean;
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  event,
  onSubmit,
  isSubmitting,
}) => {
  const [form, setForm] = useState<EventForm>({
    title: '',
    description: '',
    date: new Date(),
    type: 'familia',
  });

  useEffect(() => {
    if (event) {
      setForm({
        title: event.title,
        description: event.description || '',
        date: new Date(event.date),
        type: event.type,
      });
    } else {
      setForm({
        title: '',
        description: '',
        date: new Date(),
        type: 'familia',
      });
    }
  }, [event, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>
            {event ? 'Editar Evento' : 'Novo Evento'}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Título</FormLabel>
                <Input
                  value={form.title}
                  onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Digite o título do evento"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Descrição</FormLabel>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Digite a descrição do evento (opcional)"
                  rows={3}
                />
              </FormControl>

              <HStack spacing={4} w="full">
                <FormControl isRequired>
                  <FormLabel>Data</FormLabel>
                  <Input
                    type="date"
                    value={form.date.toISOString().split('T')[0]}
                    onChange={(e) => setForm(prev => ({ 
                      ...prev, 
                      date: e.target.value ? new Date(e.target.value) : new Date()
                    }))}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Hora</FormLabel>
                  <Input
                    type="time"
                    value={form.date.toTimeString().slice(0, 5)}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(':');
                      const newDate = new Date(form.date);
                      newDate.setHours(parseInt(hours), parseInt(minutes));
                      setForm(prev => ({ ...prev, date: newDate }));
                    }}
                  />
                </FormControl>
              </HStack>

              <FormControl isRequired>
                <FormLabel>Tipo</FormLabel>
                <Select
                  value={form.type}
                  onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value as any }))}
                >
                  <option value="familia">Família</option>
                  <option value="trabalho">Trabalho</option>
                  <option value="escola">Escola</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button
              colorScheme="purple"
              type="submit"
              isLoading={isSubmitting}
              loadingText="Salvando..."
            >
              {event ? 'Atualizar' : 'Criar'} Evento
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

// Página principal do calendário
export const CalendarPage: React.FC = () => {
  const { events, addEvent, updateEvent, deleteEvent, getEventsByDate, isLoading } = useEvents();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Navegação do calendário
  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Filtros
  const filteredEvents = events.filter(event => {
    const matchesType = filterType === 'all' || event.type === filterType;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesSearch;
  });

  // Eventos da data selecionada
  const selectedDateEvents = selectedDate ? getEventsByDate(selectedDate) : [];

  // Manipulação de eventos
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleCreateEvent = () => {
    setEditingEvent(null);
    if (selectedDate) {
      // Pré-preencher a data selecionada
      const newEventForm: EventForm = {
        title: '',
        description: '',
        date: selectedDate,
        type: 'familia',
      };
      // TODO: Implementar pré-preenchimento no modal
    }
    onOpen();
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    onOpen();
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      deleteEvent(id);
      toast({
        title: 'Evento excluído',
        description: 'O evento foi removido com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o evento.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSubmitEvent = async (eventData: EventForm) => {
    setIsSubmitting(true);
    try {
      if (editingEvent) {
        updateEvent(editingEvent.id, eventData);
        toast({
          title: 'Evento atualizado',
          description: 'O evento foi atualizado com sucesso.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        addEvent(eventData);
        toast({
          title: 'Evento criado',
          description: 'O evento foi criado com sucesso.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o evento.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Box p={6}>
        <VStack spacing={4} py={8}>
          <Text>Carregando calendário...</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <VStack align="start" spacing={1}>
            <Heading size="lg">Calendário</Heading>
            <Text color="gray.600">
              Organize seus compromissos e eventos importantes
            </Text>
          </VStack>
          <Button
            colorScheme="purple"
            leftIcon={<Plus size={16} />}
            onClick={handleCreateEvent}
          >
            Novo Evento
          </Button>
        </Flex>

        {/* Controles do calendário */}
        <Card bg={bgColor} border="1px" borderColor={borderColor}>
          <CardBody>
            <VStack spacing={4}>
              {/* Navegação */}
              <Flex justify="space-between" align="center" w="full">
                <HStack spacing={4}>
                  <Button
                    variant="ghost"
                    leftIcon={<ChevronLeft size={16} />}
                    onClick={goToPreviousMonth}
                  >
                    Mês Anterior
                  </Button>
                  <Button
                    variant="ghost"
                    rightIcon={<ChevronRight size={16} />}
                    onClick={goToNextMonth}
                  >
                    Próximo Mês
                  </Button>
                </HStack>

                <VStack spacing={1}>
                  <Text fontSize="lg" fontWeight="bold">
                    {currentDate.toLocaleDateString('pt-BR', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </Text>
                  <Button size="sm" variant="outline" onClick={goToToday}>
                    Hoje
                  </Button>
                </VStack>

                <HStack spacing={2}>
                  <FormControl maxW="200px">
                    <Select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      size="sm"
                    >
                      <option value="all">Todos os tipos</option>
                      <option value="familia">Família</option>
                      <option value="trabalho">Trabalho</option>
                      <option value="escola">Escola</option>
                    </Select>
                  </FormControl>
                  <FormControl maxW="200px">
                    <Input
                      placeholder="Buscar eventos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      size="sm"
                    />
                  </FormControl>
                </HStack>
              </Flex>

              {/* Calendário */}
              <CalendarGrid
                currentDate={currentDate}
                events={filteredEvents}
                onDateClick={handleDateClick}
                selectedDate={selectedDate}
              />
            </VStack>
          </CardBody>
        </Card>

        {/* Eventos da data selecionada */}
        {selectedDate && (
          <Card bg={bgColor} border="1px" borderColor={borderColor}>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Flex justify="space-between" align="center">
                  <Heading size="md">
                    Eventos de {formatDate(selectedDate)}
                  </Heading>
                  <Button
                    size="sm"
                    colorScheme="purple"
                    leftIcon={<Plus size={14} />}
                    onClick={handleCreateEvent}
                  >
                    Adicionar Evento
                  </Button>
                </Flex>

                <EventList
                  events={selectedDateEvents}
                  onEdit={handleEditEvent}
                  onDelete={handleDeleteEvent}
                />
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* Modal de evento */}
        <EventModal
          isOpen={isOpen}
          onClose={onClose}
          event={editingEvent}
          onSubmit={handleSubmitEvent}
          isSubmitting={isSubmitting}
        />
      </VStack>
    </Box>
  );
}; 