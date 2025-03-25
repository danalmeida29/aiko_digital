import React from 'react';
import styles from './statusIcon.module.scss';

export const getStatusColor = (statusId: string) => {
  switch (statusId) {
    case '0808344c-454b-4c36-89e8-d7687e692d57': // Operando
      return '#2ecc71';
    case 'baff9783-84e8-4e01-874b-6fd743b875ad': // Parado
      return '#f1c40f';
    case '03b2d446-e3ba-4c82-8dc2-a5611fea6e1f': // Manutenção
      return '#e74c3c';
    default:
      return '#bdc3c7'; // Cor padrão (Cinza) caso o estado não seja reconhecido
  }
};

interface StatusIconProps {
  statusId: string;
  width?: number; 
  height?: number; 
}

export const StatusIcon: React.FC<StatusIconProps> = ({ statusId, width = 25, height = 25 }) => {
  const statusColor = getStatusColor(statusId);

  return <div className={styles.statusIcon} style={{ backgroundColor: statusColor, width: `${width}px`, height: `${height}px`}} />;
};
