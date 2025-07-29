import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
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
  FormControl,
  FormLabel,
  Switch,
  Select,
  Input,
  Textarea,
  Divider,
  Alert,
  AlertIcon,
  IconButton,
  Tooltip,
  Badge,
  Flex,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import {
  Settings as SettingsIcon,
  Bell,
  Eye,
  EyeOff,
  Shield,
  Palette,
  Globe,
  Building,
  User,
  Save,
  RotateCcw,
  Download,
  Upload,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

// Componente de seção de configurações
interface SettingsSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, description, icon, children }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Card bg={bgColor} border="1px" borderColor={borderColor}>
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <HStack spacing={3}>
            <Box
              p={2}
              bg="purple.100"
              color="purple.600"
              borderRadius="md"
            >
              {icon}
            </Box>
            <VStack align="start" spacing={1}>
              <Heading size="md">{title}</Heading>
              <Text color="gray.600" fontSize="sm">{description}</Text>
            </VStack>
          </HStack>
          <Divider />
          {children}
        </VStack>
      </CardBody>
    </Card>
  );
};

// Componente de configuração de switch
interface SettingSwitchProps {
  label: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

const SettingSwitch: React.FC<SettingSwitchProps> = ({ label, description, value, onChange }) => {
  return (
    <FormControl display="flex" alignItems="center" justifyContent="space-between">
      <Box>
        <FormLabel htmlFor={label} mb="0" fontWeight="medium">
          {label}
        </FormLabel>
        <Text fontSize="sm" color="gray.600">
          {description}
        </Text>
      </Box>
      <Switch
        id={label}
        isChecked={value}
        onChange={(e) => onChange(e.target.checked)}
        colorScheme="purple"
      />
    </FormControl>
  );
};

// Componente de configuração de select
interface SettingSelectProps {
  label: string;
  description: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

const SettingSelect: React.FC<SettingSelectProps> = ({ label, description, value, options, onChange }) => {
  return (
    <FormControl>
      <FormLabel fontWeight="medium">{label}</FormLabel>
      <Text fontSize="sm" color="gray.600" mb={2}>
        {description}
      </Text>
      <Select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};

// Modal de confirmação
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  isDestructive?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  isDestructive = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>{message}</Text>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            {cancelText}
          </Button>
          <Button
            colorScheme={isDestructive ? 'red' : 'purple'}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// Página principal de configurações
export const Settings: React.FC = () => {
  const { settings, updateSettings, resetSettings, isLoading } = useSettings();
  const [localSettings, setLocalSettings] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  
  const { isOpen: isResetOpen, onOpen: onResetOpen, onClose: onResetClose } = useDisclosure();
  const { isOpen: isExportOpen, onOpen: onExportOpen, onClose: onExportClose } = useDisclosure();
  
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Atualizar configurações locais
  const updateLocalSettings = (updates: Partial<typeof settings>) => {
    const newSettings = { ...localSettings, ...updates };
    setLocalSettings(newSettings);
    setHasChanges(true);
  };

  // Salvar configurações
  const handleSave = () => {
    updateSettings(localSettings);
    setHasChanges(false);
    toast({
      title: 'Configurações salvas',
      description: 'Suas configurações foram atualizadas com sucesso.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  // Resetar configurações
  const handleReset = () => {
    resetSettings();
    setLocalSettings(settings);
    setHasChanges(false);
    toast({
      title: 'Configurações resetadas',
      description: 'Todas as configurações foram restauradas para os valores padrão.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  // Exportar configurações
  const handleExport = () => {
    const dataStr = JSON.stringify(localSettings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mamaboss-settings.json';
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Configurações exportadas',
      description: 'Arquivo de configurações baixado com sucesso.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  if (isLoading) {
    return (
      <Box p={6}>
        <VStack spacing={4} py={8}>
          <Text>Carregando configurações...</Text>
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
            <Heading size="lg">Configurações</Heading>
            <Text color="gray.600">
              Personalize sua experiência no MamaBoss
            </Text>
          </VStack>
          
          <HStack spacing={3}>
            {hasChanges && (
              <Badge colorScheme="orange" variant="subtle">
                Alterações não salvas
              </Badge>
            )}
            <Button
              colorScheme="purple"
              leftIcon={<Save size={16} />}
              onClick={handleSave}
              isDisabled={!hasChanges}
            >
              Salvar Alterações
            </Button>
          </HStack>
        </Flex>

        {/* Alertas */}
        {hasChanges && (
          <Alert status="info">
            <AlertIcon />
            <Text>Você tem alterações não salvas. Clique em "Salvar Alterações" para aplicá-las.</Text>
          </Alert>
        )}

        {/* Tabs de configurações */}
        <Card bg={bgColor} border="1px" borderColor={borderColor}>
          <CardBody>
            <Tabs index={activeTab} onChange={setActiveTab}>
              <TabList>
                <Tab>
                  <HStack spacing={2}>
                    <Palette size={16} />
                    <Text>Aparência</Text>
                  </HStack>
                </Tab>
                <Tab>
                  <HStack spacing={2}>
                    <Bell size={16} />
                    <Text>Notificações</Text>
                  </HStack>
                </Tab>
                <Tab>
                  <HStack spacing={2}>
                    <Shield size={16} />
                    <Text>Privacidade</Text>
                  </HStack>
                </Tab>
                <Tab>
                  <HStack spacing={2}>
                    <Building size={16} />
                    <Text>Negócio</Text>
                  </HStack>
                </Tab>
                <Tab>
                  <HStack spacing={2}>
                    <Globe size={16} />
                    <Text>Preferências</Text>
                  </HStack>
                </Tab>
                <Tab>
                  <HStack spacing={2}>
                    <SettingsIcon size={16} />
                    <Text>Avançado</Text>
                  </HStack>
                </Tab>
              </TabList>

              <TabPanels>
                {/* Aparência */}
                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    <SettingsSection
                      title="Tema e Visual"
                      description="Personalize a aparência da aplicação"
                      icon={<Palette size={20} />}
                    >
                      <VStack spacing={4} align="stretch">
                        <SettingSelect
                          label="Tema"
                          description="Escolha entre tema claro, escuro ou automático"
                          value={localSettings.theme}
                          options={[
                            { value: 'light', label: 'Claro' },
                            { value: 'dark', label: 'Escuro' },
                            { value: 'auto', label: 'Automático' },
                          ]}
                          onChange={(value) => updateLocalSettings({ theme: value as any })}
                        />

                        <SettingSelect
                          label="Layout do Dashboard"
                          description="Escolha como o dashboard será exibido"
                          value={localSettings.display.dashboardLayout}
                          options={[
                            { value: 'default', label: 'Padrão' },
                            { value: 'compact', label: 'Compacto' },
                            { value: 'detailed', label: 'Detalhado' },
                          ]}
                          onChange={(value) => updateLocalSettings({
                            display: { ...localSettings.display, dashboardLayout: value as any }
                          })}
                        />

                        <SettingSwitch
                          label="Modo Compacto"
                          description="Reduz o espaçamento entre elementos"
                          value={localSettings.display.compactMode}
                          onChange={(value) => updateLocalSettings({
                            display: { ...localSettings.display, compactMode: value }
                          })}
                        />
                      </VStack>
                    </SettingsSection>
                  </VStack>
                </TabPanel>

                {/* Notificações */}
                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    <SettingsSection
                      title="Notificações"
                      description="Configure quais notificações você deseja receber"
                      icon={<Bell size={20} />}
                    >
                      <VStack spacing={4} align="stretch">
                        <Text fontSize="sm" fontWeight="medium" color="gray.700">
                          Notificações por Módulo
                        </Text>
                        
                        <SettingSwitch
                          label="Tarefas"
                          description="Receber notificações sobre tarefas pendentes"
                          value={localSettings.notifications.tasks}
                          onChange={(value) => updateLocalSettings({
                            notifications: { ...localSettings.notifications, tasks: value }
                          })}
                        />

                        <SettingSwitch
                          label="Metas"
                          description="Receber notificações sobre progresso das metas"
                          value={localSettings.notifications.goals}
                          onChange={(value) => updateLocalSettings({
                            notifications: { ...localSettings.notifications, goals: value }
                          })}
                        />

                        <SettingSwitch
                          label="Eventos"
                          description="Receber lembretes de eventos"
                          value={localSettings.notifications.events}
                          onChange={(value) => updateLocalSettings({
                            notifications: { ...localSettings.notifications, events: value }
                          })}
                        />

                        <SettingSwitch
                          label="Finanças"
                          description="Receber alertas financeiros"
                          value={localSettings.notifications.finances}
                          onChange={(value) => updateLocalSettings({
                            notifications: { ...localSettings.notifications, finances: value }
                          })}
                        />

                        <SettingSwitch
                          label="Cursos"
                          description="Receber notificações sobre cursos"
                          value={localSettings.notifications.courses}
                          onChange={(value) => updateLocalSettings({
                            notifications: { ...localSettings.notifications, courses: value }
                          })}
                        />

                        <Divider />

                        <Text fontSize="sm" fontWeight="medium" color="gray.700">
                          Métodos de Notificação
                        </Text>

                        <SettingSwitch
                          label="Email"
                          description="Receber notificações por email"
                          value={localSettings.notifications.email}
                          onChange={(value) => updateLocalSettings({
                            notifications: { ...localSettings.notifications, email: value }
                          })}
                        />

                        <SettingSwitch
                          label="Push"
                          description="Receber notificações push no navegador"
                          value={localSettings.notifications.push}
                          onChange={(value) => updateLocalSettings({
                            notifications: { ...localSettings.notifications, push: value }
                          })}
                        />
                      </VStack>
                    </SettingsSection>
                  </VStack>
                </TabPanel>

                {/* Privacidade */}
                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    <SettingsSection
                      title="Privacidade"
                      description="Controle o que é compartilhado e visível"
                      icon={<Shield size={20} />}
                    >
                      <VStack spacing={4} align="stretch">
                        <SettingSwitch
                          label="Compartilhar Progresso"
                          description="Permitir que outros vejam seu progresso nos cursos"
                          value={localSettings.privacy.shareProgress}
                          onChange={(value) => updateLocalSettings({
                            privacy: { ...localSettings.privacy, shareProgress: value }
                          })}
                        />

                        <SettingSwitch
                          label="Compartilhar Estatísticas"
                          description="Permitir que outros vejam suas estatísticas gerais"
                          value={localSettings.privacy.shareStats}
                          onChange={(value) => updateLocalSettings({
                            privacy: { ...localSettings.privacy, shareStats: value }
                          })}
                        />

                        <SettingSwitch
                          label="Perfil Público"
                          description="Tornar seu perfil visível para outros usuários"
                          value={localSettings.privacy.publicProfile}
                          onChange={(value) => updateLocalSettings({
                            privacy: { ...localSettings.privacy, publicProfile: value }
                          })}
                        />
                      </VStack>
                    </SettingsSection>
                  </VStack>
                </TabPanel>

                {/* Negócio */}
                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    <SettingsSection
                      title="Informações do Negócio"
                      description="Configure as informações do seu negócio"
                      icon={<Building size={20} />}
                    >
                      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                        <FormControl>
                          <FormLabel fontWeight="medium">Nome do Negócio</FormLabel>
                          <Input
                            value={localSettings.business.businessName}
                            onChange={(e) => updateLocalSettings({
                              business: { ...localSettings.business, businessName: e.target.value }
                            })}
                            placeholder="Digite o nome do seu negócio"
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel fontWeight="medium">Tipo de Negócio</FormLabel>
                          <Select
                            value={localSettings.business.businessType}
                            onChange={(e) => updateLocalSettings({
                              business: { ...localSettings.business, businessType: e.target.value }
                            })}
                          >
                            <option value="">Selecione o tipo</option>
                            <option value="consultoria">Consultoria</option>
                            <option value="produtos">Produtos</option>
                            <option value="servicos">Serviços</option>
                            <option value="digital">Digital</option>
                            <option value="outros">Outros</option>
                          </Select>
                        </FormControl>

                        <FormControl>
                          <FormLabel fontWeight="medium">Email do Negócio</FormLabel>
                          <Input
                            type="email"
                            value={localSettings.business.businessEmail}
                            onChange={(e) => updateLocalSettings({
                              business: { ...localSettings.business, businessEmail: e.target.value }
                            })}
                            placeholder="contato@seunegocio.com"
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel fontWeight="medium">Telefone</FormLabel>
                          <Input
                            value={localSettings.business.businessPhone}
                            onChange={(e) => updateLocalSettings({
                              business: { ...localSettings.business, businessPhone: e.target.value }
                            })}
                            placeholder="(11) 99999-9999"
                          />
                        </FormControl>

                        <FormControl gridColumn={{ md: 'span 2' }}>
                          <FormLabel fontWeight="medium">Endereço</FormLabel>
                          <Textarea
                            value={localSettings.business.businessAddress}
                            onChange={(e) => updateLocalSettings({
                              business: { ...localSettings.business, businessAddress: e.target.value }
                            })}
                            placeholder="Digite o endereço completo"
                            rows={3}
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel fontWeight="medium">CNPJ/CPF</FormLabel>
                          <Input
                            value={localSettings.business.taxId}
                            onChange={(e) => updateLocalSettings({
                              business: { ...localSettings.business, taxId: e.target.value }
                            })}
                            placeholder="00.000.000/0000-00"
                          />
                        </FormControl>
                      </Grid>
                    </SettingsSection>
                  </VStack>
                </TabPanel>

                {/* Preferências */}
                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    <SettingsSection
                      title="Preferências Gerais"
                      description="Configure suas preferências de formato e idioma"
                      icon={<Globe size={20} />}
                    >
                      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                        <SettingSelect
                          label="Idioma"
                          description="Escolha o idioma da aplicação"
                          value={localSettings.language}
                          options={[
                            { value: 'pt-BR', label: 'Português (Brasil)' },
                            { value: 'en-US', label: 'English (US)' },
                            { value: 'es-ES', label: 'Español' },
                          ]}
                          onChange={(value) => updateLocalSettings({ language: value as any })}
                        />

                        <SettingSelect
                          label="Moeda"
                          description="Escolha a moeda para valores monetários"
                          value={localSettings.preferences.currency}
                          options={[
                            { value: 'BRL', label: 'Real (R$)' },
                            { value: 'USD', label: 'Dólar ($)' },
                            { value: 'EUR', label: 'Euro (€)' },
                          ]}
                          onChange={(value) => updateLocalSettings({
                            preferences: { ...localSettings.preferences, currency: value as any }
                          })}
                        />

                        <SettingSelect
                          label="Formato de Data"
                          description="Escolha como as datas serão exibidas"
                          value={localSettings.preferences.dateFormat}
                          options={[
                            { value: 'DD/MM/YYYY', label: 'DD/MM/AAAA' },
                            { value: 'MM/DD/YYYY', label: 'MM/DD/AAAA' },
                            { value: 'YYYY-MM-DD', label: 'AAAA-MM-DD' },
                          ]}
                          onChange={(value) => updateLocalSettings({
                            preferences: { ...localSettings.preferences, dateFormat: value as any }
                          })}
                        />

                        <SettingSelect
                          label="Formato de Hora"
                          description="Escolha o formato de exibição das horas"
                          value={localSettings.preferences.timeFormat}
                          options={[
                            { value: '24h', label: '24 horas' },
                            { value: '12h', label: '12 horas' },
                          ]}
                          onChange={(value) => updateLocalSettings({
                            preferences: { ...localSettings.preferences, timeFormat: value as any }
                          })}
                        />

                        <SettingSelect
                          label="Início da Semana"
                          description="Escolha qual dia inicia a semana"
                          value={localSettings.preferences.weekStart}
                          options={[
                            { value: 'monday', label: 'Segunda-feira' },
                            { value: 'sunday', label: 'Domingo' },
                          ]}
                          onChange={(value) => updateLocalSettings({
                            preferences: { ...localSettings.preferences, weekStart: value as any }
                          })}
                        />
                      </Grid>
                    </SettingsSection>
                  </VStack>
                </TabPanel>

                {/* Avançado */}
                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    <SettingsSection
                      title="Configurações Avançadas"
                      description="Gerenciar dados e configurações do sistema"
                      icon={<SettingsIcon size={20} />}
                    >
                      <VStack spacing={4} align="stretch">
                        <Text fontSize="sm" fontWeight="medium" color="gray.700">
                          Gerenciamento de Dados
                        </Text>

                        <HStack spacing={3}>
                          <Button
                            leftIcon={<Download size={16} />}
                            onClick={onExportOpen}
                            variant="outline"
                          >
                            Exportar Configurações
                          </Button>
                          <Button
                            leftIcon={<Upload size={16} />}
                            variant="outline"
                            isDisabled
                          >
                            Importar Configurações
                          </Button>
                        </HStack>

                        <Divider />

                        <Text fontSize="sm" fontWeight="medium" color="gray.700">
                          Ações Destrutivas
                        </Text>

                        <HStack spacing={3}>
                          <Button
                            leftIcon={<RotateCcw size={16} />}
                            onClick={onResetOpen}
                            colorScheme="orange"
                            variant="outline"
                          >
                            Resetar Configurações
                          </Button>
                          <Button
                            leftIcon={<Trash2 size={16} />}
                            colorScheme="red"
                            variant="outline"
                            isDisabled
                          >
                            Excluir Todos os Dados
                          </Button>
                        </HStack>

                        <Alert status="warning">
                          <AlertIcon />
                          <Text fontSize="sm">
                            <strong>Atenção:</strong> Ações destrutivas não podem ser desfeitas.
                          </Text>
                        </Alert>
                      </VStack>
                    </SettingsSection>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>

        {/* Modais */}
        <ConfirmModal
          isOpen={isResetOpen}
          onClose={onResetClose}
          onConfirm={handleReset}
          title="Resetar Configurações"
          message="Tem certeza que deseja resetar todas as configurações para os valores padrão? Esta ação não pode ser desfeita."
          confirmText="Resetar"
          cancelText="Cancelar"
          isDestructive
        />

        <ConfirmModal
          isOpen={isExportOpen}
          onClose={onExportClose}
          onConfirm={handleExport}
          title="Exportar Configurações"
          message="Suas configurações serão baixadas como um arquivo JSON. Você pode usar este arquivo para fazer backup ou transferir suas configurações."
          confirmText="Exportar"
          cancelText="Cancelar"
        />
      </VStack>
    </Box>
  );
}; 