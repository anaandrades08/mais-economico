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
