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
  CardHeader,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  Calendar,
  Filter,
  Search,
} from 'lucide-react';
import { Task, TaskForm } from '../types';
import { formatDate, formatRelativeDate } from '../utils/formatters';
import { TaskItem } from '../components/dashboard/TaskItem';
import { useTasks } from '../contexts/TaskContext';

export const Tasks: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask, toggleTaskComplete } = useTasks();
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    filterTasks();
  }, [tasks, searchTerm, selectedCategory, selectedPriority]);

  const filterTasks = () => {
    let filtered = tasks;

    // Filtrar por busca
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por categoria
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(task => task.category === selectedCategory);
    }

    // Filtrar por prioridade
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === selectedPriority);
    }

    setFilteredTasks(filtered);
  };

  const handleSubmit = async (formData: TaskForm) => {
    setIsSubmitting(true);
    try {
      if (editingTask) {
        // Editar tarefa existente
        updateTask(editingTask.id, formData);
        toast({
          title: 'Tarefa atualizada!',
          description: 'Sua tarefa foi atualizada com sucesso.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Criar nova tarefa
        addTask(formData);
        toast({
          title: 'Tarefa criada!',
          description: 'Nova tarefa adicionada com sucesso.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      onClose();
      setEditingTask(null);
    } catch (error) {
      toast({
        title: 'Erro!',
        description: 'Ocorreu um erro ao salvar a tarefa.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (taskId: string) => {
    deleteTask(taskId);
    toast({
      title: 'Tarefa removida!',
      description: 'A tarefa foi removida com sucesso.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleToggleComplete = (taskId: string) => {
    toggleTaskComplete(taskId);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    onOpen();
  };

  const handleNewTask = () => {
    setEditingTask(null);
    onOpen();
  };

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

  const pendingTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);

  return (
    <Box p={6}>
      {/* Header */}
      <VStack align="stretch" mb={8} spacing={4}>
        <Flex justify="space-between" align="center">
          <Heading size="lg" color="gray.700">
            Gerenciar Tarefas
          </Heading>
          <Button
            colorScheme="pink"
            leftIcon={<Plus size={16} />}
            onClick={handleNewTask}
          >
            Nova Tarefa
          </Button>
        </Flex>
        <Text color="gray.600">
          Organize suas tarefas por categoria e prioridade
        </Text>
      </VStack>

      {/* Filtros e Busca */}
      <Card bg={bgColor} border="1px" borderColor={borderColor} mb={6}>
        <CardBody>
          <VStack spacing={4}>
            <HStack w="full" spacing={4}>
              <FormControl>
                <FormLabel fontSize="sm">Buscar</FormLabel>
                <Input
                  placeholder="Buscar por título ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm">Categoria</FormLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">Todas as categorias</option>
                  <option value="trabalho">Trabalho</option>
                  <option value="familia">Família</option>
                  <option value="pessoal">Pessoal</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm">Prioridade</FormLabel>
                <Select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                >
                  <option value="all">Todas as prioridades</option>
                  <option value="alta">Alta</option>
                  <option value="media">Média</option>
                  <option value="baixa">Baixa</option>
                </Select>
              </FormControl>
            </HStack>
          </VStack>
        </CardBody>
      </Card>

      {/* Estatísticas */}
      <HStack spacing={6} mb={6}>
        <Card bg={bgColor} border="1px" borderColor={borderColor} flex={1}>
          <CardBody>
            <VStack spacing={2}>
              <Text fontSize="sm" color="gray.600">Total de Tarefas</Text>
              <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                {filteredTasks.length}
              </Text>
            </VStack>
          </CardBody>
        </Card>
        <Card bg={bgColor} border="1px" borderColor={borderColor} flex={1}>
          <CardBody>
            <VStack spacing={2}>
              <Text fontSize="sm" color="gray.600">Pendentes</Text>
              <Text fontSize="2xl" fontWeight="bold" color="orange.500">
                {pendingTasks.length}
              </Text>
            </VStack>
          </CardBody>
        </Card>
        <Card bg={bgColor} border="1px" borderColor={borderColor} flex={1}>
          <CardBody>
            <VStack spacing={2}>
              <Text fontSize="sm" color="gray.600">Concluídas</Text>
              <Text fontSize="2xl" fontWeight="bold" color="green.500">
                {completedTasks.length}
              </Text>
            </VStack>
          </CardBody>
        </Card>
      </HStack>

      {/* Lista de Tarefas */}
      <Tabs variant="enclosed">
        <TabList>
          <Tab>
            <HStack spacing={2}>
              <Clock size={16} />
              <Text>Pendentes ({pendingTasks.length})</Text>
            </HStack>
          </Tab>
          <Tab>
            <HStack spacing={2}>
              <CheckCircle size={16} />
              <Text>Concluídas ({completedTasks.length})</Text>
            </HStack>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0} pt={6}>
            {pendingTasks.length > 0 ? (
              <VStack spacing={3} align="stretch">
                {pendingTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggleComplete={handleToggleComplete}
                    onEdit={handleEdit}
                  />
                ))}
              </VStack>
            ) : (
              <Alert status="info">
                <AlertIcon />
                Nenhuma tarefa pendente encontrada!
              </Alert>
            )}
          </TabPanel>

          <TabPanel p={0} pt={6}>
            {completedTasks.length > 0 ? (
              <VStack spacing={3} align="stretch">
                {completedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggleComplete={handleToggleComplete}
                    onEdit={handleEdit}
                  />
                ))}
              </VStack>
            ) : (
              <Alert status="info">
                <AlertIcon />
                Nenhuma tarefa concluída ainda!
              </Alert>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Modal de Tarefa */}
      <TaskModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleSubmit}
        task={editingTask}
        isSubmitting={isSubmitting}
      />
    </Box>
  );
};

// Componente Modal para Criar/Editar Tarefa
interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: TaskForm) => void;
  task: Task | null;
  isSubmitting: boolean;
}

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  task,
  isSubmitting,
}) => {
  const [form, setForm] = useState<TaskForm>({
    title: '',
    description: '',
    category: 'pessoal',
    priority: 'media',
    dueDate: undefined,
  });

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description || '',
        category: task.category,
        priority: task.priority,
        dueDate: task.dueDate,
      });
    } else {
      setForm({
        title: '',
        description: '',
        category: 'pessoal',
        priority: 'media',
        dueDate: undefined,
      });
    }
  }, [task]);

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
            {task ? 'Editar Tarefa' : 'Nova Tarefa'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Título</FormLabel>
                <Input
                  value={form.title}
                  onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Digite o título da tarefa"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Descrição</FormLabel>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Digite uma descrição (opcional)"
                  rows={3}
                />
              </FormControl>

              <HStack spacing={4} w="full">
                <FormControl isRequired>
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    value={form.category}
                    onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value as any }))}
                  >
                    <option value="trabalho">Trabalho</option>
                    <option value="familia">Família</option>
                    <option value="pessoal">Pessoal</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Prioridade</FormLabel>
                  <Select
                    value={form.priority}
                    onChange={(e) => setForm(prev => ({ ...prev, priority: e.target.value as any }))}
                  >
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                  </Select>
                </FormControl>
              </HStack>

              <FormControl>
                <FormLabel>Data de Vencimento</FormLabel>
                <Input
                  type="date"
                  value={form.dueDate ? form.dueDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => setForm(prev => ({ 
                    ...prev, 
                    dueDate: e.target.value ? new Date(e.target.value) : undefined 
                  }))}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button
              colorScheme="pink"
              type="submit"
              isLoading={isSubmitting}
              loadingText="Salvando..."
            >
              {task ? 'Atualizar' : 'Criar'} Tarefa
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}; 