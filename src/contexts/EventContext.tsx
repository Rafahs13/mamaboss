import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Event, EventForm } from '../types';
import { generateId } from '../utils/storage';

interface EventContextType {
  events: Event[];
  addEvent: (eventData: EventForm) => void;
  updateEvent: (id: string, eventData: EventForm) => void;
  deleteEvent: (id: string) => void;
  getEventsByDate: (date: Date) => Event[];
  getEventsByMonth: (year: number, month: number) => Event[];
  isLoading: boolean;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

interface EventProviderProps {
  children: ReactNode;
}

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar eventos do localStorage
  useEffect(() => {
    const loadEvents = () => {
      try {
        const storedEvents = localStorage.getItem('mamaboss_events');
        if (storedEvents) {
          const parsedEvents = JSON.parse(storedEvents).map((event: any) => ({
            ...event,
            date: new Date(event.date),
            createdAt: new Date(event.createdAt),
            updatedAt: new Date(event.updatedAt),
          }));
          setEvents(parsedEvents);
        }
      } catch (error) {
        console.error('Erro ao carregar eventos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Salvar eventos no localStorage
  const saveEvents = (newEvents: Event[]) => {
    try {
      localStorage.setItem('mamaboss_events', JSON.stringify(newEvents));
    } catch (error) {
      console.error('Erro ao salvar eventos:', error);
    }
  };

  // Adicionar novo evento
  const addEvent = (eventData: EventForm) => {
    const newEvent: Event = {
      id: generateId(),
      userId: '1', // TODO: Usar ID do usuário logado
      ...eventData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    saveEvents(updatedEvents);
  };

  // Atualizar evento
  const updateEvent = (id: string, eventData: EventForm) => {
    const updatedEvents = events.map(event =>
      event.id === id
        ? { ...event, ...eventData, updatedAt: new Date() }
        : event
    );
    setEvents(updatedEvents);
    saveEvents(updatedEvents);
  };

  // Excluir evento
  const deleteEvent = (id: string) => {
    const updatedEvents = events.filter(event => event.id !== id);
    setEvents(updatedEvents);
    saveEvents(updatedEvents);
  };

  // Obter eventos por data específica
  const getEventsByDate = (date: Date): Event[] => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Obter eventos por mês
  const getEventsByMonth = (year: number, month: number): Event[] => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() === year && eventDate.getMonth() === month;
    });
  };

  const value: EventContextType = {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsByDate,
    getEventsByMonth,
    isLoading,
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = (): EventContextType => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents deve ser usado dentro de um EventProvider');
  }
  return context;
}; 