import React from 'react';
import {
  Box,
  Grid,
  VStack,
  HStack,
  Text,
  Heading,
  Card,
  CardBody,
  CardHeader,
  Button,
  useColorModeValue,
  Flex,
  Divider,
} from '@chakra-ui/react';
import {
  CheckCircle,
  Plus,
  Heart,
  Briefcase,
  Users,
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { StatCard } from '../components/dashboard/StatCard';
import { TaskItem } from '../components/dashboard/TaskItem';
import { GoalCard } from '../components/dashboard/GoalCard';
import { EventCard } from '../components/calendar/EventCard';
import { SubscriptionStatus } from '../components/subscription/SubscriptionStatus';
import { PremiumButton } from '../components/subscription/PremiumButton';
import { PremiumBanner } from '../components/subscription/PremiumBanner';
import { useTasks } from '../contexts/TaskContext';
import { useGoals } from '../contexts/GoalContext';
import { useEvents } from '../contexts/EventContext';
import { useFinances } from '../contexts/FinanceContext';
import { useCourses } from '../contexts/CourseContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { tasks, toggleTaskComplete } = useTasks();
  const { goals } = useGoals();
  const { events } = useEvents();
  const { getMonthlyStats } = useFinances();
  const { getCourseStats } = useCourses();
  const navigate = useNavigate();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Obter estatísticas do mês atual
  const currentDate = new Date();
  const monthlyStats = getMonthlyStats(currentDate.getFullYear(), currentDate.getMonth());
  const courseStats = getCourseStats();

  // Cálculos das métricas
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const activeGoals = goals.length;
  const upcomingEvents = events.filter(event => new Date(event.date) > new Date()).length;

  // Usar estatísticas do contexto de finanças
  const { totalIncome: monthlyIncome, totalExpenses: monthlyExpenses, balance: monthlyBalance } = monthlyStats;

  // Usar estatísticas do contexto de cursos
  const { totalCourses, completedCourses, averageProgress } = courseStats;

  // Tarefas prioritárias (não concluídas, ordenadas por prioridade)
  const priorityTasks = tasks
    .filter(task => !task.completed)
    .sort((a, b) => {
      const priorityOrder: Record<string, number> = { alta: 3, media: 2, baixa: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    })
    .slice(0, 5);

  // Metas com progresso
  const activeGoalsWithProgress = goals.slice(0, 3);

  // Próximos eventos
  const upcomingEventsList = events
    .filter(event => new Date(event.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

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
      case 'trabalho': return <Briefcase size={16} />;
      case 'familia': return <Users size={16} />;
      case 'pessoal': return <Heart size={16} />;
      default: return <CheckCircle size={16} />;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'familia': return 'pink';
      case 'trabalho': return 'blue';
      case 'escola': return 'green';
      default: return 'gray';
    }
  };

  return (
    <Box p={6}>
      {/* Header do Dashboard */}
      <VStack align="stretch" mb={8} spacing={4}>
        <HStack justify="space-between" align="start">
          <VStack align="start" spacing={2}>
            <Heading size="lg" color="gray.700">
              Dashboard
            </Heading>
            <Text color="gray.600">
              Bem-vinda de volta! Aqui está um resumo do seu dia.
            </Text>
          </VStack>
          <PremiumButton size="sm" variant="outline" />
        </HStack>
      </VStack>

      {/* Banner Premium */}
      <Box mb={8}>
        <PremiumBanner />
      </Box>

      {/* Métricas Principais */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)', xl: 'repeat(5, 1fr)' }} gap={6} mb={8}>
        <StatCard
          label="Tarefas Pendentes"
          value={pendingTasks}
          change={totalTasks > 0 ? Math.round((pendingTasks / totalTasks) * 100) : 0}
          changeType="decrease"
          color="orange.500"
        />
        <StatCard
          label="Metas Ativas"
          value={activeGoals}
          changeType="increase"
          color="purple.500"
        />
        <StatCard
          label="Próximos Eventos"
          value={upcomingEvents}
          changeType="increase"
          color="blue.500"
        />
        <StatCard
          label="Saldo Mensal"
          value={formatCurrency(monthlyBalance)}
          changeType={monthlyBalance >= 0 ? 'increase' : 'decrease'}
          color={monthlyBalance >= 0 ? 'green.500' : 'red.500'}
        />
        <StatCard
          label="Cursos Concluídos"
          value={`${completedCourses}/${totalCourses}`}
          change={averageProgress}
          changeType="increase"
          color="teal.500"
        />
      </Grid>

      {/* Conteúdo Principal */}
      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
        {/* Coluna Principal */}
        <VStack spacing={6} align="stretch">
          {/* Tarefas Prioritárias */}
          <Card bg={bgColor} border="1px" borderColor={borderColor}>
            <CardHeader>
              <Flex justify="space-between" align="center">
                <Heading size="md">Tarefas Prioritárias</Heading>
                <Button 
                  size="sm" 
                  colorScheme="pink" 
                  leftIcon={<Plus size={16} />}
                  onClick={() => navigate('/tasks')}
                >
                  Nova Tarefa
                </Button>
              </Flex>
            </CardHeader>
            <CardBody>
              <VStack spacing={3} align="stretch">
                {priorityTasks.length > 0 ? (
                  priorityTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggleComplete={toggleTaskComplete}
                    />
                  ))
                ) : (
                  <Text color="gray.500" textAlign="center" py={4}>
                    Nenhuma tarefa pendente! 🎉
                  </Text>
                )}
              </VStack>
            </CardBody>
          </Card>

          {/* Metas em Progresso */}
          <Card bg={bgColor} border="1px" borderColor={borderColor}>
            <CardHeader>
              <Flex justify="space-between" align="center">
                <Heading size="md">Metas em Progresso</Heading>
                <Button 
                  size="sm" 
                  colorScheme="purple" 
                  leftIcon={<Plus size={16} />}
                  onClick={() => navigate('/goals')}
                >
                  Nova Meta
                </Button>
              </Flex>
            </CardHeader>
            <CardBody>
              <VStack spacing={3} align="stretch">
                {goals.filter(goal => goal.status === 'ativa').slice(0, 3).map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    compact={true}
                  />
                ))}
                {goals.filter(goal => goal.status === 'ativa').length === 0 && (
                  <Text color="gray.500" textAlign="center" py={4}>
                    Nenhuma meta ativa no momento
                  </Text>
                )}
              </VStack>
            </CardBody>
          </Card>
        </VStack>

        {/* Sidebar */}
        <VStack spacing={6} align="stretch">
          {/* Status da Assinatura */}
          <SubscriptionStatus />

          {/* Próximos Eventos */}
          <Card bg={bgColor} border="1px" borderColor={borderColor}>
            <CardHeader>
              <Flex justify="space-between" align="center">
                <Heading size="md">Próximos Eventos</Heading>
                <Button 
                  size="sm" 
                  colorScheme="blue" 
                  leftIcon={<Plus size={16} />}
                  onClick={() => navigate('/calendar')}
                >
                  Novo Evento
                </Button>
              </Flex>
            </CardHeader>
            <CardBody>
              <VStack spacing={3} align="stretch">
                {upcomingEventsList.length > 0 ? (
                  upcomingEventsList.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      compact={true}
                      showActions={false}
                    />
                  ))
                ) : (
                  <Text color="gray.500" textAlign="center" py={4}>
                    Nenhum evento próximo
                  </Text>
                )}
              </VStack>
            </CardBody>
          </Card>

          {/* Resumo Financeiro */}
          <Card bg={bgColor} border="1px" borderColor={borderColor}>
            <CardHeader>
              <Heading size="md">Resumo Financeiro</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Flex justify="space-between" align="center">
                  <Text color="gray.600">Receitas do mês</Text>
                  <Text color="green.500" fontWeight="semibold">
                    {formatCurrency(monthlyIncome)}
                  </Text>
                </Flex>
                <Flex justify="space-between" align="center">
                  <Text color="gray.600">Despesas do mês</Text>
                  <Text color="red.500" fontWeight="semibold">
                    {formatCurrency(monthlyExpenses)}
                  </Text>
                </Flex>
                <Divider />
                <Flex justify="space-between" align="center">
                  <Text fontWeight="semibold">Saldo</Text>
                  <Text
                    color={monthlyBalance >= 0 ? 'green.500' : 'red.500'}
                    fontWeight="bold"
                    fontSize="lg"
                  >
                    {formatCurrency(monthlyBalance)}
                  </Text>
                </Flex>
              </VStack>
            </CardBody>
          </Card>

          {/* Dica do Dia */}
          <Card bg="pink.50" border="1px" borderColor="pink.200">
            <CardBody>
              <VStack spacing={3} align="start">
                <HStack spacing={2}>
                  <Heart size={20} color="#ec4899" />
                  <Text fontWeight="semibold" color="pink.700">
                    Dica do Dia
                  </Text>
                </HStack>
                <Text fontSize="sm" color="pink.800">
                  "Lembre-se: você não precisa fazer tudo hoje. Foque nas 3 tarefas mais importantes e celebre cada pequena vitória! 💪"
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Grid>
    </Box>
  );
}; 