import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Course, CourseForm } from '../types';
import { generateId } from '../utils/storage';

interface CourseContextType {
  courses: Course[];
  addCourse: (courseData: CourseForm) => void;
  updateCourse: (id: string, courseData: CourseForm) => void;
  deleteCourse: (id: string) => void;
  updateProgress: (id: string, progress: number) => void;
  getCoursesByCategory: (category: string) => Course[];
  getCoursesByProgress: (progress: number) => Course[];
  getPremiumCourses: () => Course[];
  getFreeCourses: () => Course[];
  getCourseStats: () => {
    totalCourses: number;
    completedCourses: number;
    inProgressCourses: number;
    notStartedCourses: number;
    averageProgress: number;
  };
  isLoading: boolean;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

interface CourseProviderProps {
  children: ReactNode;
}

export const CourseProvider: React.FC<CourseProviderProps> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar cursos do localStorage
  useEffect(() => {
    const loadCourses = () => {
      try {
        const storedCourses = localStorage.getItem('mamaboss_courses');
        if (storedCourses) {
          const parsedCourses = JSON.parse(storedCourses).map((course: any) => ({
            ...course,
            createdAt: new Date(course.createdAt),
            updatedAt: new Date(course.updatedAt),
          }));
          setCourses(parsedCourses);
        } else {
          // Carregar cursos padrão se não existirem
          const defaultCourses: Course[] = [
            {
              id: '1',
              title: 'Empreendedorismo para Mães',
              description: 'Aprenda os fundamentos do empreendedorismo adaptado para mães',
              duration: 120,
              progress: 0,
              isPremium: false,
              category: 'empreendedorismo',
              thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400',
              lessons: [
                { title: 'Introdução ao Empreendedorismo', duration: 15, completed: false },
                { title: 'Identificando Oportunidades', duration: 20, completed: false },
                { title: 'Planejamento de Negócio', duration: 25, completed: false },
                { title: 'Marketing Digital', duration: 30, completed: false },
                { title: 'Gestão Financeira', duration: 30, completed: false },
              ],
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: '2',
              title: 'Gestão de Tempo para Mães',
              description: 'Técnicas eficientes para conciliar maternidade e trabalho',
              duration: 90,
              progress: 0,
              isPremium: true,
              category: 'produtividade',
              thumbnail: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=400',
              lessons: [
                { title: 'Priorização de Tarefas', duration: 15, completed: false },
                { title: 'Delegação Eficiente', duration: 20, completed: false },
                { title: 'Rotinas Matinais', duration: 15, completed: false },
                { title: 'Planejamento Semanal', duration: 20, completed: false },
                { title: 'Equilíbrio Vida-Trabalho', duration: 20, completed: false },
              ],
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: '3',
              title: 'Marketing Digital para Pequenos Negócios',
              description: 'Estratégias de marketing digital para alavancar seu negócio',
              duration: 150,
              progress: 0,
              isPremium: true,
              category: 'marketing',
              thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
              lessons: [
                { title: 'Redes Sociais', duration: 25, completed: false },
                { title: 'Email Marketing', duration: 20, completed: false },
                { title: 'SEO Básico', duration: 30, completed: false },
                { title: 'Google Ads', duration: 35, completed: false },
                { title: 'Analytics e Métricas', duration: 40, completed: false },
              ],
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: '4',
              title: 'Finanças Pessoais para Empreendedoras',
              description: 'Controle financeiro pessoal e do negócio',
              duration: 100,
              progress: 0,
              isPremium: false,
              category: 'financas',
              thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400',
              lessons: [
                { title: 'Orçamento Pessoal', duration: 20, completed: false },
                { title: 'Investimentos Básicos', duration: 25, completed: false },
                { title: 'Separação Finanças Pessoais/Negócio', duration: 20, completed: false },
                { title: 'Planejamento de Aposentadoria', duration: 20, completed: false },
                { title: 'Proteção Financeira', duration: 15, completed: false },
              ],
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: '5',
              title: 'Vendas e Atendimento ao Cliente',
              description: 'Técnicas de vendas e relacionamento com clientes',
              duration: 80,
              progress: 0,
              isPremium: true,
              category: 'vendas',
              thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
              lessons: [
                { title: 'Psicologia das Vendas', duration: 20, completed: false },
                { title: 'Técnicas de Persuasão', duration: 15, completed: false },
                { title: 'Atendimento ao Cliente', duration: 20, completed: false },
                { title: 'Gestão de Objeções', duration: 15, completed: false },
                { title: 'Fidelização de Clientes', duration: 10, completed: false },
              ],
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ];
          setCourses(defaultCourses);
          saveCourses(defaultCourses);
        }
      } catch (error) {
        console.error('Erro ao carregar cursos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, []);

  // Salvar cursos no localStorage
  const saveCourses = (newCourses: Course[]) => {
    try {
      localStorage.setItem('mamaboss_courses', JSON.stringify(newCourses));
    } catch (error) {
      console.error('Erro ao salvar cursos:', error);
    }
  };

  // Adicionar novo curso
  const addCourse = (courseData: CourseForm) => {
    const newCourse: Course = {
      id: generateId(),
      ...courseData,
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedCourses = [...courses, newCourse];
    setCourses(updatedCourses);
    saveCourses(updatedCourses);
  };

  // Atualizar curso
  const updateCourse = (id: string, courseData: CourseForm) => {
    const updatedCourses = courses.map(course =>
      course.id === id
        ? { ...course, ...courseData, updatedAt: new Date() }
        : course
    );
    setCourses(updatedCourses);
    saveCourses(updatedCourses);
  };

  // Excluir curso
  const deleteCourse = (id: string) => {
    const updatedCourses = courses.filter(course => course.id !== id);
    setCourses(updatedCourses);
    saveCourses(updatedCourses);
  };

  // Atualizar progresso do curso
  const updateProgress = (id: string, progress: number) => {
    const updatedCourses = courses.map(course =>
      course.id === id
        ? { ...course, progress: Math.min(100, Math.max(0, progress)), updatedAt: new Date() }
        : course
    );
    setCourses(updatedCourses);
    saveCourses(updatedCourses);
  };

  // Obter cursos por categoria
  const getCoursesByCategory = (category: string): Course[] => {
    return courses.filter(course => course.category === category);
  };

  // Obter cursos por progresso
  const getCoursesByProgress = (progress: number): Course[] => {
    return courses.filter(course => course.progress === progress);
  };

  // Obter cursos premium
  const getPremiumCourses = (): Course[] => {
    return courses.filter(course => course.isPremium);
  };

  // Obter cursos gratuitos
  const getFreeCourses = (): Course[] => {
    return courses.filter(course => !course.isPremium);
  };

  // Obter estatísticas dos cursos
  const getCourseStats = () => {
    const totalCourses = courses.length;
    const completedCourses = courses.filter(course => course.progress === 100).length;
    const inProgressCourses = courses.filter(course => course.progress > 0 && course.progress < 100).length;
    const notStartedCourses = courses.filter(course => course.progress === 0).length;
    const averageProgress = totalCourses > 0 
      ? courses.reduce((sum, course) => sum + course.progress, 0) / totalCourses 
      : 0;

    return {
      totalCourses,
      completedCourses,
      inProgressCourses,
      notStartedCourses,
      averageProgress: Math.round(averageProgress),
    };
  };

  const value: CourseContextType = {
    courses,
    addCourse,
    updateCourse,
    deleteCourse,
    updateProgress,
    getCoursesByCategory,
    getCoursesByProgress,
    getPremiumCourses,
    getFreeCourses,
    getCourseStats,
    isLoading,
  };

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourses = (): CourseContextType => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourses deve ser usado dentro de um CourseProvider');
  }
  return context;
}; 