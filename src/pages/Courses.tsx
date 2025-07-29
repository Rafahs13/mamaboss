import React, { useState } from 'react';
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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Progress,
  Divider,
  Image,
  Tooltip,
  Switch,
  FormHelperText,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import {
  Plus,
  Edit,
  Trash2,
  BookOpen,
  Play,
  Pause,
  CheckCircle,
  Clock,
  Star,
  Filter,
  Search,
  Award,
  TrendingUp,
  Users,
  Target,
  DollarSign,
  ShoppingCart,
  Briefcase,
  Zap,
} from 'lucide-react';
import { Course, CourseForm } from '../types';
import { formatDuration } from '../utils/formatters';
import { useCourses } from '../contexts/CourseContext';

// Categorias de cursos
const COURSE_CATEGORIES = [
  { value: 'empreendedorismo', label: 'Empreendedorismo', icon: <Briefcase size={16} /> },
  { value: 'produtividade', label: 'Produtividade', icon: <Zap size={16} /> },
  { value: 'marketing', label: 'Marketing', icon: <TrendingUp size={16} /> },
  { value: 'financas', label: 'Finanças', icon: <DollarSign size={16} /> },
  { value: 'vendas', label: 'Vendas', icon: <ShoppingCart size={16} /> },
  { value: 'outros', label: 'Outros', icon: <BookOpen size={16} /> },
];

// Funções auxiliares
const getCategoryIcon = (category: string) => {
  const found = COURSE_CATEGORIES.find(cat => cat.value === category);
  return found ? found.icon : <BookOpen size={16} />;
};

const getCategoryLabel = (category: string) => {
  const found = COURSE_CATEGORIES.find(cat => cat.value === category);
  return found ? found.label : category;
};

const getProgressColor = (progress: number) => {
  if (progress === 100) return 'green';
  if (progress >= 50) return 'blue';
  if (progress > 0) return 'orange';
  return 'gray';
};

const getProgressIcon = (progress: number) => {
  if (progress === 100) return <CheckCircle size={16} />;
  if (progress > 0) return <Play size={16} />;
  return <Pause size={16} />;
};

// Componente de estatísticas
const CourseStats: React.FC<{
  stats: {
    totalCourses: number;
    completedCourses: number;
    inProgressCourses: number;
    notStartedCourses: number;
    averageProgress: number;
  };
}> = ({ stats }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(5, 1fr)' }} gap={4}>
      <Card bg={bgColor} border="1px" borderColor={borderColor}>
        <CardBody>
          <Stat>
            <StatLabel color="gray.600">Total de Cursos</StatLabel>
            <StatNumber color="blue.500">
              {stats.totalCourses}
            </StatNumber>
            <StatHelpText>
              <BookOpen size={12} /> Cursos disponíveis
            </StatHelpText>
          </Stat>
        </CardBody>
      </Card>

      <Card bg={bgColor} border="1px" borderColor={borderColor}>
        <CardBody>
          <Stat>
            <StatLabel color="gray.600">Concluídos</StatLabel>
            <StatNumber color="green.500">
              {stats.completedCourses}
            </StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              {stats.completedCourses > 0 ? 'Cursos finalizados' : 'Nenhum concluído'}
            </StatHelpText>
          </Stat>
        </CardBody>
      </Card>

      <Card bg={bgColor} border="1px" borderColor={borderColor}>
        <CardBody>
          <Stat>
            <StatLabel color="gray.600">Em Progresso</StatLabel>
            <StatNumber color="orange.500">
              {stats.inProgressCourses}
            </StatNumber>
            <StatHelpText>
              <Play size={12} /> Cursos em andamento
            </StatHelpText>
          </Stat>
        </CardBody>
      </Card>

      <Card bg={bgColor} border="1px" borderColor={borderColor}>
        <CardBody>
          <Stat>
            <StatLabel color="gray.600">Não Iniciados</StatLabel>
            <StatNumber color="gray.500">
              {stats.notStartedCourses}
            </StatNumber>
            <StatHelpText>
              <Pause size={12} /> Cursos pendentes
            </StatHelpText>
          </Stat>
        </CardBody>
      </Card>

      <Card bg={bgColor} border="1px" borderColor={borderColor}>
        <CardBody>
          <Stat>
            <StatLabel color="gray.600">Progresso Médio</StatLabel>
            <StatNumber color="purple.500">
              {stats.averageProgress}%
            </StatNumber>
            <StatHelpText>
              <TrendingUp size={12} /> Média geral
            </StatHelpText>
          </Stat>
        </CardBody>
      </Card>
    </Grid>
  );
};

// Componente de card de curso
const CourseCard: React.FC<{
  course: Course;
  onEdit?: (course: Course) => void;
  onDelete?: (id: string) => void;
  onProgressChange?: (id: string, progress: number) => void;
}> = ({ course, onEdit, onDelete, onProgressChange }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  const completedLessons = course.lessons.filter(lesson => lesson.completed).length;
  const totalLessons = course.lessons.length;

  return (
    <Card bg={bgColor} border="1px" borderColor={borderColor} _hover={{ bg: hoverBg }}>
      <CardBody>
        <VStack align="stretch" spacing={4}>
          {/* Header */}
          <Flex justify="space-between" align="start">
            <VStack align="start" spacing={2} flex={1}>
              <HStack spacing={2}>
                <Text fontSize="lg" fontWeight="bold">
                  {course.title}
                </Text>
                {course.isPremium && (
                  <Badge colorScheme="purple" size="sm">
                    <Star size={10} /> Premium
                  </Badge>
                )}
                <Badge colorScheme={getProgressColor(course.progress)} size="sm">
                  {getProgressIcon(course.progress)} {course.progress}%
                </Badge>
              </HStack>
              
              <Text color="gray.600" fontSize="sm" noOfLines={2}>
                {course.description}
              </Text>
              
              <HStack spacing={3} color="gray.500">
                <Text fontSize="sm">
                  {getCategoryIcon(course.category)} {getCategoryLabel(course.category)}
                </Text>
                <Text fontSize="sm">
                  <Clock size={12} /> {formatDuration(course.duration)}
                </Text>
                <Text fontSize="sm">
                  <Users size={12} /> {totalLessons} aulas
                </Text>
              </HStack>
            </VStack>

            {(onEdit || onDelete) && (
              <HStack spacing={1}>
                {onEdit && (
                  <Tooltip label="Editar curso">
                    <IconButton
                      aria-label="Editar curso"
                      icon={<Edit size={16} />}
                      size="sm"
                      variant="ghost"
                      onClick={() => onEdit(course)}
                    />
                  </Tooltip>
                )}
                {onDelete && (
                  <Tooltip label="Excluir curso">
                    <IconButton
                      aria-label="Excluir curso"
                      icon={<Trash2 size={16} />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => onDelete(course.id)}
                    />
                  </Tooltip>
                )}
              </HStack>
            )}
          </Flex>

          {/* Thumbnail */}
          {course.thumbnail && (
            <Image
              src={course.thumbnail}
              alt={course.title}
              borderRadius="md"
              objectFit="cover"
              h="120px"
              w="full"
            />
          )}

          {/* Progress */}
          <VStack align="stretch" spacing={2}>
            <Flex justify="space-between" align="center">
              <Text fontSize="sm" fontWeight="medium">
                Progresso
              </Text>
              <Text fontSize="sm" color="gray.600">
                {completedLessons}/{totalLessons} aulas
              </Text>
            </Flex>
            <Progress
              value={course.progress}
              colorScheme={getProgressColor(course.progress)}
              size="lg"
              borderRadius="full"
            />
          </VStack>

          {/* Lessons Preview */}
          <VStack align="stretch" spacing={2}>
            <Text fontSize="sm" fontWeight="medium">
              Aulas ({completedLessons}/{totalLessons})
            </Text>
            <List spacing={1}>
              {course.lessons.slice(0, 3).map((lesson, index) => (
                <ListItem key={index} fontSize="xs">
                  <ListIcon
                    as={lesson.completed ? CheckCircle : Play}
                    color={lesson.completed ? 'green.500' : 'gray.400'}
                  />
                  {lesson.title} ({formatDuration(lesson.duration)})
                </ListItem>
              ))}
              {course.lessons.length > 3 && (
                <ListItem fontSize="xs" color="gray.500">
                  +{course.lessons.length - 3} mais aulas
                </ListItem>
              )}
            </List>
          </VStack>

          {/* Actions */}
          {onProgressChange && (
            <HStack spacing={2}>
              <Button
                size="sm"
                colorScheme="blue"
                leftIcon={<Play size={14} />}
                onClick={() => onProgressChange(course.id, Math.min(100, course.progress + 20))}
                isDisabled={course.progress === 100}
              >
                Continuar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onProgressChange(course.id, 0)}
                isDisabled={course.progress === 0}
              >
                Reiniciar
              </Button>
            </HStack>
          )}
        </VStack>
      </CardBody>
    </Card>
  );
};

// Modal de curso
interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course?: Course | null;
  onSubmit: (courseData: CourseForm) => void;
  isSubmitting: boolean;
}

const CourseModal: React.FC<CourseModalProps> = ({
  isOpen,
  onClose,
  course,
  onSubmit,
  isSubmitting,
}) => {
  const [form, setForm] = useState<CourseForm>({
    title: '',
    description: '',
    duration: 0,
    isPremium: false,
    category: 'empreendedorismo',
    thumbnail: '',
    lessons: [],
  });

  React.useEffect(() => {
    if (course) {
      setForm({
        title: course.title,
        description: course.description,
        duration: course.duration,
        isPremium: course.isPremium,
        category: course.category,
        thumbnail: course.thumbnail || '',
        lessons: course.lessons,
      });
    } else {
      setForm({
        title: '',
        description: '',
        duration: 0,
        isPremium: false,
        category: 'empreendedorismo',
        thumbnail: '',
        lessons: [],
      });
    }
  }, [course, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>
            {course ? 'Editar Curso' : 'Novo Curso'}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Título</FormLabel>
                <Input
                  value={form.title}
                  onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Digite o título do curso"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Descrição</FormLabel>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Digite a descrição do curso"
                  rows={3}
                />
              </FormControl>

              <HStack spacing={4} w="full">
                <FormControl isRequired>
                  <FormLabel>Duração (minutos)</FormLabel>
                  <Input
                    type="number"
                    value={form.duration}
                    onChange={(e) => setForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                    placeholder="120"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    value={form.category}
                    onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value as any }))}
                  >
                    {COURSE_CATEGORIES.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </HStack>

              <FormControl>
                <FormLabel>URL da Thumbnail</FormLabel>
                <Input
                  value={form.thumbnail}
                  onChange={(e) => setForm(prev => ({ ...prev, thumbnail: e.target.value }))}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Curso Premium</FormLabel>
                <Switch
                  isChecked={form.isPremium}
                  onChange={(e) => setForm(prev => ({ ...prev, isPremium: e.target.checked }))}
                />
                <FormHelperText>
                  Marque se este curso é exclusivo para usuários premium
                </FormHelperText>
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
              {course ? 'Atualizar' : 'Criar'} Curso
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

// Página principal de cursos
export const Courses: React.FC = () => {
  const { 
    courses, 
    addCourse, 
    updateCourse, 
    deleteCourse, 
    updateProgress,
    getCoursesByCategory,
    getPremiumCourses,
    getFreeCourses,
    getCourseStats,
    isLoading 
  } = useCourses();
  
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPremium, setFilterPremium] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Obter estatísticas
  const courseStats = getCourseStats();

  // Filtros
  const filteredCourses = courses.filter(course => {
    const matchesCategory = filterCategory === 'all' || course.category === filterCategory;
    const matchesPremium = filterPremium === 'all' || 
      (filterPremium === 'premium' && course.isPremium) ||
      (filterPremium === 'free' && !course.isPremium);
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesPremium && matchesSearch;
  });

  // Manipulação de cursos
  const handleCreateCourse = () => {
    setEditingCourse(null);
    onOpen();
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    onOpen();
  };

  const handleDeleteCourse = async (id: string) => {
    try {
      deleteCourse(id);
      toast({
        title: 'Curso excluído',
        description: 'O curso foi removido com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o curso.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleProgressChange = async (id: string, progress: number) => {
    try {
      updateProgress(id, progress);
      toast({
        title: 'Progresso atualizado',
        description: `Progresso atualizado para ${progress}%`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o progresso.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSubmitCourse = async (courseData: CourseForm) => {
    setIsSubmitting(true);
    try {
      if (editingCourse) {
        updateCourse(editingCourse.id, courseData);
        toast({
          title: 'Curso atualizado',
          description: 'O curso foi atualizado com sucesso.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        addCourse(courseData);
        toast({
          title: 'Curso criado',
          description: 'O curso foi criado com sucesso.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o curso.',
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
          <Text>Carregando cursos...</Text>
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
            <Heading size="lg">Cursos</Heading>
            <Text color="gray.600">
              Desenvolva suas habilidades empreendedoras
            </Text>
          </VStack>
          <Button
            colorScheme="purple"
            leftIcon={<Plus size={16} />}
            onClick={handleCreateCourse}
          >
            Novo Curso
          </Button>
        </Flex>

        {/* Estatísticas */}
        <CourseStats stats={courseStats} />

        {/* Filtros */}
        <Card bg={bgColor} border="1px" borderColor={borderColor}>
          <CardBody>
            <VStack spacing={4}>
              <Flex 
                direction={{ base: 'column', md: 'row' }} 
                gap={4} 
                w="full" 
                justify="space-between"
              >
                <HStack spacing={4}>
                  <FormControl maxW="200px">
                    <Select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      size="sm"
                    >
                      <option value="all">Todas as categorias</option>
                      {COURSE_CATEGORIES.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl maxW="150px">
                    <Select
                      value={filterPremium}
                      onChange={(e) => setFilterPremium(e.target.value)}
                      size="sm"
                    >
                      <option value="all">Todos</option>
                      <option value="premium">Premium</option>
                      <option value="free">Gratuitos</option>
                    </Select>
                  </FormControl>
                </HStack>

                <FormControl maxW="300px">
                  <Input
                    placeholder="Buscar cursos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    size="sm"
                  />
                </FormControl>
              </Flex>
            </VStack>
          </CardBody>
        </Card>

        {/* Lista de Cursos */}
        <Card bg={bgColor} border="1px" borderColor={borderColor}>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Flex justify="space-between" align="center">
                <Heading size="md">Cursos Disponíveis</Heading>
                <Text color="gray.600" fontSize="sm">
                  {filteredCourses.length} curso{filteredCourses.length !== 1 ? 's' : ''}
                </Text>
              </Flex>

              {filteredCourses.length === 0 ? (
                <VStack spacing={4} py={8}>
                  <BookOpen size={48} color="gray.400" />
                  <Text color="gray.500" textAlign="center">
                    Nenhum curso encontrado
                  </Text>
                </VStack>
              ) : (
                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
                  {filteredCourses.map((course) => (
                    <GridItem key={course.id}>
                      <CourseCard
                        course={course}
                        onEdit={handleEditCourse}
                        onDelete={handleDeleteCourse}
                        onProgressChange={handleProgressChange}
                      />
                    </GridItem>
                  ))}
                </Grid>
              )}
            </VStack>
          </CardBody>
        </Card>

        {/* Modal de curso */}
        <CourseModal
          isOpen={isOpen}
          onClose={onClose}
          course={editingCourse}
          onSubmit={handleSubmitCourse}
          isSubmitting={isSubmitting}
        />
      </VStack>
    </Box>
  );
}; 