export const Users = [
    {
      id: 1,
      name: "Mariana Silva",
      endereco: "Rua das Flores, 123",
      telefone: "(11) 99999-9999",
      email: "mariana.silva@example.com",
      senha: "senha123",
      tipo: "Administrador",
      receitas: [
        {
          id: 1,
          titulo: "Receita 1",
          ingredientes: ["Farinha", "Açucar", "Leite"],
          modoPreparo: "Cozinhe a farinha, adicione açucar e leite, misture e frite até ficar dura.",
          tempoPreparo: 30,
          porcoes: 4,
          calorias: 200,
          img: "/images/receitas/bolosetortas/bolosetortas1.png",
          data: "15/03/2025",
        },
      ],
      datanascimento: "12/12/1990",
      image: "/images/usuario/fotodoperfil.png",    
      datacadastro: "10/03/2025",
    },
];