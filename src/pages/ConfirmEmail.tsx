import { useNavigate } from "react-router-dom";

const ConfirmEmail = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-green-50 to-blue-50 font-sans">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-4 text-5xl">📧</div>

        <h2 className="text-2xl font-bold text-green-600 mb-2 tracking-tight">
          Confirme seu e-mail
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          Enviamos um link de confirmação para seu e-mail. Verifique sua caixa
          de entrada para ativar sua conta.
        </p>

        <div className="bg-green-100 text-green-700 p-3 rounded-lg text-sm font-medium mb-4">
          Conta criada com sucesso!
        </div>

        <div className="flex flex-col gap-3">
          <button className="bg-blue-500 hover:bg-blue-400 text-white p-2 rounded-lg font-medium">
            Reenviar e-mail
          </button>

          <button
            onClick={() => navigate("/login")}
            className="border border-gray-200 p-2 rounded-lg text-gray-600 font-medium hover:bg-gray-50"
          >
            Voltar para login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmail;
