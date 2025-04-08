import { Users } from "../data/UserData.js";
const userId = Users[0].id; 
const userName = Users[0].name; 

export default function AdminMain() {
  return (
    <div className="admin-container">
      <h1 className="admin-title">Bem vindo(a) {userName}!</h1>
      {/* Adicione o restante do conteúdo aqui */}
    </div>
  );
}