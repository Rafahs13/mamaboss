import React from 'react';
import {
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useColorModeValue,
} from '@chakra-ui/react';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease';
  color?: string;
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  change,
  changeType,
  color = 'gray.500',
  icon,
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Card bg={bgColor} border="1px" borderColor={borderColor}>
      <CardBody>
        <Stat>
          <StatLabel color="gray.600">{label}</StatLabel>
          <StatNumber color={color}>{value}</StatNumber>
          {change !== undefined && changeType && (
            <StatHelpText>
              <StatArrow type={changeType} />
              {change}%
            </StatHelpText>
          )}
        </Stat>
      </CardBody>
    </Card>
  );
}; 