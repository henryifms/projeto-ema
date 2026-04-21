import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsuarios = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(`${import.meta.env.VITE_BACK_URL}/usuarios`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setUsuarios(data);
    };

    fetchUsuarios();
  }, []);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!confirm("Tem certeza?")) return;

    await fetch(`${import.meta.env.VITE_BACK_URL}/usuarios/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setUsuarios((prev) => prev.filter((u) => u.id !== id));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    await fetch(`${import.meta.env.VITE_BACK_URL}/usuarios/${editingUser.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editingUser),
    });

    setUsuarios((prev) =>
      prev.map((u) => (u.id === editingUser.id ? editingUser : u)),
    );

    setEditingUser(null);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Usuários</h1>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {usuarios.map((u) => (
          <div
            key={u.id}
            onClick={() => navigate(`/usuarios/${u.id}`)}
            className="bg-white p-5 rounded-2xl border hover:shadow-md transition cursor-pointer"
          >
            {editingUser?.id === u.id ? (
              <>
                <input
                  className="border p-2 rounded w-full mb-2"
                  value={editingUser.nome}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, nome: e.target.value })
                  }
                />
                <input
                  className="border p-2 rounded w-full mb-2"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSave();
                  }}
                  className="text-green-600 text-sm"
                >
                  Salvar
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-600">
                    {u.nome.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-semibold">{u.nome}</h2>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </div>
                </div>

                <div className="flex justify-between mt-3 text-sm">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingUser(u);
                    }}
                    className="text-blue-500"
                  >
                    Editar
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(u.id);
                    }}
                    className="text-red-500"
                  >
                    Remover
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
