export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getUTCDate().toString().padStart(2, '0')}/${(
    date.getUTCMonth() + 1
  )
    .toString()
    .padStart(
      2,
      '0'
    )}/${date.getUTCFullYear()} ás ${date.getUTCHours().toString().padStart(2, '0')}:${date
    .getUTCMinutes()
    .toString()
    .padStart(2, '0')}h`;
};

export const getStatusName = (id: string): string => {
  const statusMap: Record<string, string> = {
    '0808344c-454b-4c36-89e8-d7687e692d57': 'Operando',
    'baff9783-84e8-4e01-874b-6fd743b875ad': 'Parado',
    '03b2d446-e3ba-4c82-8dc2-a5611fea6e1f': 'Manutenção',
  };

  return statusMap[id] ?? 'Status desconhecido';
};
