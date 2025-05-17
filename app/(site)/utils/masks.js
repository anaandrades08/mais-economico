// utils/masks.js
export const formatCEP = (cep) => {
  if (!cep) return '';
  
  // Remove tudo que não é dígito
  const numerosCEP = cep.replace(/\D/g, '');
  
  // Aplica a formatação (00000-000)
  return numerosCEP.replace(/(\d{5})(\d{3})/, '$1-$2');
};
  
  export const buscarEnderecoPorCEP = async (cep) => {
    try {
      const cepNumerico = cep.replace(/\D/g, '');
      
      // Primeiro tenta a API ViaCEP
      let response = await fetch(`https://viacep.com.br/ws/${cepNumerico}/json/`);
      
      if (!response.ok) {
        // Se ViaCEP falhar, tenta a API do BrasilAPI
        response = await fetch(`https://brasilapi.com.br/api/cep/v2/${cepNumerico}`);
        
        if (!response.ok) {
          throw new Error("Serviço de CEP indisponível no momento. Por favor, preencha manualmente.");
        }
      }
  
      const data = await response.json();
      
      if (data.erro) {
        throw new Error("CEP não encontrado. Verifique o número e tente novamente.");
      }
  
      return {
        endereco: data.logradouro || data.endereco || '',
        bairro: data.bairro || '',
        cidade: data.localidade || data.cidade || '',
        estado: data.uf || data.estado || ''
      };
      
    } catch (error) {
      console.error('Erro na consulta de CEP:', error);
      throw new Error("Serviço de CEP indisponível no momento. Por favor, preencha manualmente.");
    }
  };

  export const formatPhone = (value) => {
    const digits = value.replace(/\D/g, '');
    
    if (digits.length <= 10) {
      return digits
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .substring(0, 14);
    } else {
      return digits
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .substring(0, 15);
    }
  };