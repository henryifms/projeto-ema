import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import Alerta from "../components/Alerta";

const Cadastro = () => {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingRegister(true);

    if (!captchaToken) {
      setAlert({ message: "Confirme que você não é um robô", type: "error" });
      setLoadingRegister(false);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACK_URL}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          email,
          password,
          passwordConfirmation,
          captchaToken,
        }),
      });

      if (!res.ok) {
        if (res.status === 409) {
          setAlert({ message: "Email já cadastrado!", type: "error" });
          navigate("/login");
          return;
        }
        throw new Error();
      }

      navigate("/confirm-email");
    } catch {
      setAlert({ message: "Erro ao cadastrar usuário", type: "error" });
    } finally {
      setLoadingRegister(false);
      recaptchaRef.current?.reset();
      setCaptchaToken(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-green-50 to-blue-50 font-sans">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-green-600 tracking-tight">
            EMA
          </h1>
          <p className="text-sm text-gray-500">Monitoramento Meteorológico</p>
        </div>

        {alert && <Alerta message={alert.message} type={alert.type} />}

        <form onSubmit={handleRegister} className="space-y-4 pt-4 ">

          <input
            type="text"
            placeholder="Nome"
            className="w-full p-3 rounded-lg border bg-green-50 text-gray-700 placeholder-gray-400 focus:border-green-500 outline-none"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg border bg-green-50 text-gray-700 placeholder-gray-400 hover:border-green-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              className="w-full p-3 pr-10 rounded-lg border bg-blue-50 text-gray-700 placeholder-gray-400 outline-none focus:border-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500"
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirmar senha"
            className="w-full p-3 rounded-lg border bg-blue-50 text-gray-700 placeholder-gray-400 outline-none focus:border-blue-400"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
          />

          <div className="flex justify-center">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} // use variável de ambiente
            onChange={(token: string | null) => setCaptchaToken(token)}
            onExpired={() => setCaptchaToken(null)}
          />
          </div>

          <button
            type="submit"
            disabled={loadingRegister}
            className="w-full bg-green-600 hover:bg-green-500 text-white p-3 rounded-lg font-medium transition"
          >
            {loadingRegister ? "Criando..." : "Criar conta"}
          </button>

          <p className="text-sm text-gray-500 text-center">
            Já tem conta?{" "}
            <Link
              to="/login"
              className="text-blue-500 font-medium hover:underline"
            >
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Cadastro;
