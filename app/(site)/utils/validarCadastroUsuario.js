// utils/validarCadastroUsuario.js
export const validarCadastroUser = (formData) => {
    const errors = [];
    const { 
      nome, 
      email, 
      endereco, 
      numero, 
      cidade, 
      estado, 
      cep, 
      senha, 
      confirmarSenha, 
      termosAceito, 
    } = formData;
  
    // Validações básicas de campos obrigatórios
    if (!nome) errors.push('Você deve informar o nome');
    if (nome && nome.trim().length < 3) errors.push('O nome deve ter pelo menos 3 caracteres');
    if (!email) errors.push('Você deve informar o email');
    if (!endereco) errors.push('Você deve informar o endereço');
    if (!numero) errors.push('Você deve informar o número');
    if (!cidade) errors.push('Você deve informar a cidade');
    if (!estado) errors.push('Você deve informar o estado');
    if (!cep) errors.push('Você deve informar o CEP');
    if (!senha) errors.push('Você deve informar a senha');
    if (!confirmarSenha) errors.push('Você deve confirmar a senha');

    if (!cep || cep.replace(/\D/g, '').length !== 8) {
        errors.push('CEP inválido');
      }
    
    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      errors.push('Por favor, insira um email válido');
    }
  
    // Validação de senha
    if (senha) {
        if (senha !== confirmarSenha) {
            errors.push('As senhas não coincidem');
        }
    }
  
    const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (senha && !senhaRegex.test(senha)) {
      errors.push('A senha deve conter pelo menos 8 caracteres, uma maiúscula, uma minúscula, um número e um caractere especial');
    }
  
    // Validação de termos
    if (!termosAceito) {
      errors.push('Você deve aceitar os termos para se cadastrar');
    }
  
    return {
      isValid: errors.length === 0,
      errors
    };
  };
  
  
  export const validarEdicaoUser = (formData, alterarSenha) => {
    const errors = {};
    const { 
      nome, 
      email, 
      endereco, 
      numero, 
      cidade, 
      estado, 
      cep, 
      senha, 
      confirmarSenha 
    } = formData;
  
    // Validações básicas de campos obrigatórios
    if (!nome) errors.nome = 'Você deve informar o nome';
    else if (nome.trim().length < 3) errors.nome = 'O nome deve ter pelo menos 3 caracteres';
    
    if (!email) errors.email = 'Você deve informar o email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Por favor, insira um email válido';
    
    if (!endereco) errors.endereco = 'Você deve informar o endereço';
    if (!numero) errors.numero = 'Você deve informar o número';
    if (!cidade) errors.cidade = 'Você deve informar a cidade';
    if (!estado) errors.estado = 'Você deve informar o estado';
    
    if (!cep) errors.cep = 'Você deve informar o CEP';
    else if (cep.replace(/\D/g, '').length !== 8) errors.cep = 'CEP inválido';
  
    // Validação de senha apenas se optar por alterar
    if (alterarSenha) {
      if (!senha) errors.senha = 'Você deve informar a senha';
      else if (senha.length < 8) errors.senha = 'A senha deve ter pelo menos 8 caracteres';
      else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(senha)) {
        errors.senha = 'A senha deve conter uma maiúscula, uma minúscula, um número e um caractere especial';
      }
      
      if (senha !== confirmarSenha) errors.confirmarSenha = 'As senhas não coincidem';
    }
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
};
