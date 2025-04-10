export function validarLogin1(email, senha) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const senhaRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
  
    if (!email || !senha) {
      return 'E-mail ou senha incorretos';
    }
  
    if (!emailRegex.test(email)) {
      return 'E-mail ou senha incorretos';
    }
  
    if (!senhaRegex.test(senha)) {
      return 'E-mail ou senha incorretos';
    }
  
    return null;
  }


  export function validarEmail(email) {
    if (!email || !email.includes('@')) return 'E-mail inválido';
    return '';
  }
  
  export function validarSenha(senha) {
    const senhaRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!senhaRegex.test(senha)) {
      return 'A senha deve ter no mínimo 8 caracteres, uma letra e um número';
    }
    return '';
  }
  
  export function validarLogin(email, senha) {
    const erroEmail = validarEmail(email);
    const erroSenha = validarSenha(senha);
    if (erroEmail || erroSenha) return erroEmail || erroSenha;
    return '';
  }
  