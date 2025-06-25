export function formatarDataeHora(data) {
    if (!data) return '';
  
    const date = new Date(data);
  
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const ano = date.getFullYear();
    const hora = String(date.getHours()).padStart(2, '0');
    const minuto = String(date.getMinutes()).padStart(2, '0');
  
    const temHora = date.getHours() !== 0 || date.getMinutes() !== 0;
  
    return temHora
      ? `${dia}/${mes}/${ano} às ${hora}:${minuto}`
      : `${dia}/${mes}/${ano}`;
  }

export function formatarData(data) {
    if (!data) return '';
    const date = new Date(data);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const ano = date.getFullYear();
  
    return `${dia}/${mes}/${ano}`;
  }


  export function Status(data) {
    if (data === null) {
        return 'Novo (aguardando aprovação)';
    }
    else if (data === 1) {
        return 'Aprovado';
    } else if (data === 2) {
        return 'Reprovado';
    } else if (data === 0) {
        return 'Inativo';
    } else {
        return 'Desconhecido';
    }
  }


 export const formatTime = (minutes) => {
  if (!minutes || isNaN(minutes)) return '0min';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  return hours > 0 
    ? `${hours}h ${mins > 0 ? `${mins}min` : ''}`.trim()
    : `${mins}min`;
};

export const getTimesText = (count) => {
  return Math.abs(count || 0) === 1 ? 'vez' : 'vezes';
};
