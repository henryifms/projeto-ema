const SideBar = () => {
  return (
    <div className="sidebar">
      <div className="opicoes">
        <button>Dashboard</button>
        <button>Estações</button>
        <button>Usuários</button>
        <button>Configurações</button>
      </div>
      <div className="div-tema">
        <button className="btn-tema">Tema Claro</button>
      </div>
    </div>
  );
};

export default SideBar;
