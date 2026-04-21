import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaGithub,
  FaLinkedin,
  FaUniversity,
  FaChartLine,
  FaUsers,
  FaExternalLinkAlt,
} from "react-icons/fa";
import logoIcon from "../assets/icone.png";
import PlanoPesquisa from "../components/PlanoPesquisa";

const integrantes = [
  {
    nome: "Henry Campos",
    funcao: "Desenvolvedor e Pesquisador Projeto",
    descricao:
      "Responsável pela arquitetura do sistema, integração de APIs e visualização de dados.",
    github: "https://github.com/henryifms",
    linkedin: "https://linkedin.com/in/henrycampos",
    lattes:
      "https://buscatextual.cnpq.br/buscatextual/visualizacv.do?id=K1285408E3&tokenCaptchar=0cAFcWeA67PoX-fu-MyzKpJzuHKZZvVjawBBFPm9soalSMZr4b37btxLV9XE5XkutcQ4oE1-drd6HaOoBBXI_d0EtfZ9u6aCw4fc794STk_UmixD1tucNGvQVMiGSjYEr0NkUp9c9cgVayEDcw_tiF6eHgkAtgeD5AFVAaGyIlnYM1uSAwC054eZGYmRUA_ytchukkBovVECghbAbPXKyUNfaYjLeQ0HtTE1w04LVY2Uv0kbAyKqGEQfjaidpkaVu14v4MQ8-dLGVjLH2UkoLxxP_KaPqdJYo736fMcFmSFTfVvCoGF0jL4l_oKPfEidhYjAw02rcvfffifqZbvVSl7FtCebE9vR8F5efzdZp655KzNdEYxpbsoBekOVO5T8RpTWFrJuV-Bs980oj9KzEWi_YMdmZi-TRfMo5AQQMqZ0wwsGeUZa4hFwbNxUloGgvCQ250lVbsGeo_CfvOcCV7HsAgM6yA0S5Nssb9qwVvYNMl7kNQ5n3RT0C6NnAd2jFqNaKufVIXq4Uh_vROjJtOIMFuyblCmOTchaFshkzNjKB3u889EjsEo8hrgR9EoKr9PdPUR8snTE0rw7y9vXvyJStPbCl09qAeJSaWM7Ir9F2VRC4VV_gDUJFGT0AaTNnScAjGauXMCHLrr4OUTYPm7lbs3BpUFKcXfx8yUz_nYkdBsC3cylXtHf9bDwpgd8pLWLMLQtp72ZS7hH-ZQ4J3AmXDD1gTjpCcAK0Qcug48hUWW5SlsGcbr6v6q7NKCfjSsTBGVaPlzH7VieeZvZ9i69SDsqNfVPEDMf13eMXhNwdMd1hR9urnPxFGoIKaaqOByJf5vos3p8YF-1Ud-yFLYDEYT5Vy_o91vtCp5u-_qtQ4skJfffbmldwHt1KcA1aFK3GSzWLqeRkA6GOq5fyC9H9JUFC32Ik5_NirVSfnN1_6bROVJKDiG--yAQh9a_dTSBMJoFMrotg-FESy7YfINFNOtITJmXmyGOJIGl9fh5_XrNnOvtyjvU01wvbsUWk9G_5tjTQ-aWnTz0BwdUse9ffuRbS3GUkr4uZaAamQt9tJTK3ElXIiLy5_D0F33yGDzDzyz7R1mZ1rZ_m-ZnAkucgVEyVMnBgVJqZSKJqFU9MdF20e0RVyTqbBpJ9yyYjE6QT3l8p4j8S-9BVbZ4d1jzpsRqjenuT6J4aw2Mo5cyz3Iofe8s7OxXVop638eBaqt5bvCAnGlaQicRdHDHQrBIRDOCaCdUojtJs151RWA-YgFMME0GKrdb0gHxKyNBnH1GAZ3B78-5CktboyQZwRL4J8cHNG1NZ3e_pV6VTttoI2HTB3pGW9VF176Yrd8JHZCJsEGciXHwoFBgwPI8s4J7fGVo-vzWzah7R7VpjDoecvoqAEFtfWmFwu3ToB_VS2X_exjBoOveKVs2BWJVm9uA7-StgI8yMxwb-sSfH0-avKQ3QUrvMhABgSLaOkXhype3FP2mpWvEmFaKsrgmy-qixe5EpRXQW34HgWXO12YJdReJKwKVnTnfQXyCnEcYD57bEDQBm_hc9el9wcdbEpe1ecGp_HyH5yiFLGUQflW9mYx411IRq8_ru7L-zasJVqrbSkUe9iBRwsov-2SKxMcVxyQbAg_tlGefFG05UCkR6LZrYdFEBrfXlU40O1FAe2Rpkuo_ioGuadgOutaGZdx1dG3iiySofD7jOoFcq3l6cqPAdFZ3XzqwbXhPnzqiUW_W5NzpUWoUBZcoluylOwp34anKSY0_YX1P3xCBQoaPTAOXZtddjwhVNcjPTX4A1txbUkJPz_v0ELC8OfHlKD77SpWF7LVxhvC4tpMcRR9aogDjLLFVL2rrJCuwnzFMshwnWr-unOgVzZg1tuBe1o0yKjh7V2_3OyCkSKFmMdfG_J8g60XiUxYtSrMC8MRseG6M631BSsRSI4w8vatMWsZTKNwY6w308JzwMSMuxkvrbcnu9EgM9mRBv01StWZ5C8Jj8lFbe0BLCRH4S8GBER04KNOju7qVizMceAuhIjhm7EO3UzBOJ3YZHimgG1EnW8R2AXc_-X9eia79fjMkh2Jp3n9UGfpLmuWTxJm8ljERCsZmBL1HLy0xl5EpPQy-pru-l7CNQI6j60g63AZK_jJKJcXCZTHTsBN6x2aB-vWLx2F1dzYYU9D9aGEyGxCYHoh1F9-HomAp9k_T29icrlbOnyQ_7yBbPao8YmxGRMONdiRBohPbYEednaAnrgpZsLeuqZG5ahDTvtVVRnytLY5beHGpe3cS5E3hKdT4S7NGwy8hEA3kkR1W78HcS5njRWDqFHlsETtFU1_lg6N9XJNWi1VZmT1hwil_kUEc8aqXvl-RnAeREWfCc",
  },
  {
    nome: "Kleber Penteado",
    funcao: "Desenvolvedor, Pesquisador e Coordenador do Projeto",
    descricao:
      "Gerencia a coleta de dados, manutenção das estações e infraestrutura de banco de dados.",
    github: "https://github.com/kleberifms",
    linkedin: "https://br.linkedin.com/in/kleber-rodrigo-penteado-05a58320b",
    lattes:
      "https://buscatextual.cnpq.br/buscatextual/visualizacv.do?id=K4258692H1&tokenCaptchar=0cAFcWeA4lnlcdq6cd55EGooS62ZS3USMlPUA8vhbmYbcLVCFkUvCvYMEOj9YFfFyAsrqJR5ipN5_1sFzvvF13e2rM0Llq9kx1gW_bYAC0Fb1tUENc_5nG2W3JqQSszyN2OOMrx5txkT0wcrqeee-PFJDXzZnAIwRI8azcCzsFjp8bxXlF5aYd9Wx7N8AX_DtY3f11bq9HyhNpQmVKMWZkJ-t9MwoX4PJSnobgrXBBMH92AwF2nSCWVCgFBVS4ju29rke4RMLV68P09BE7vP74avSXXFWNbuz5CIBrtXB9q9lRGMFLMC3IR4zl5AIE2PjauU7HVwQuz-8sLzSI_n3DuNP4ZPUXzmsqsovJtT9rr1O3Jr6hEOMTWwFe3DT4XF23mXIzcJdJ8QGx0XwNC8EYQzrS7eYjplBIaXpxuUf06y5Q7vMr4e1VAyFf9X9H-nkSGJ0AVkh8fIpaAu6JUtqetkBfZh1Jd3SUr6JSYgWn5Tn-xOUDfyybQR-N2cIwtsr_KFid4s-7vdTUABL0TgjfyuDgZ090keVRY-c12iZ7lhCjsZOFhx00XWGHgJCVbQcd2Rd_sA_0ZEnYxfaZsv7tM5DqXixafHe5aDk-tac7eDn0uObrqeOjQusEdiiyLWJQSWX-OebBJBQ7U1NOT8RvbffnlenBeFRKoSsh4RIQeU5PclrDSfAeHvUPziFCwb-t8yXS6bGZPswmhIXhRgEgwfy-RVLguJLJe_EZ8wqUrlvFgAGsS4-MNeo31TfxicIVPhNmpVS6mwX7s91iOkQzSl5wp27LJ7av23RNhWRy-xuDUMlDlm8kzY9CzwOVzLoh7kQ-XeKmOECdYmz8ece6wZWh6b6HEk2wX58mvxvzWjZezt0A-ADxgzjYs--JC8AzlytsTzLZPFH6gY7YO86jJSAHMYCTt8YbwjwTtayLbHHHyPJHcIZrP0gG8zZxvWdxVxi6uxzvyzxxeMIFhtg3PBltDJnuNVfqX0ghfIdNiRnfDbwl1W0l55RqiG10fEbSLmkUvhwB0HoJ8HnUigKAKJc_kdACBKEPmEkL78FRxtgVDnIpeSv86NzsAkY1bgTPldEKPuVjM_hfEz9wPqSuQWCF3b-YZbmdze3TIVBd2CInsE0VW5IATfmc9ecib0oCVLVXB9YlzgzAR8NKYhywwGcrRcjWNCeBLvAKcwWUbC5Hku-mDQgfHg082nOnchhJDGoqvV-NJ9Y_WgZykd51X0hJQXh3L-hQWAsEz8Ai93J2OVWJetjT_gXmMNAfhbHHkH6-hHFkzt3Q2IEPu_bZ6Ou_7CWXWjBhIAk97AwOpgP5A1AooiRIv5_zObmUsEMwqd2iYtiUzYwpKcpeCF2ax-RRupS0A3X9IsoJZWFvmyHSdSS45tVAnq_dIBK2W3Fg6MAyn29bAdV9DKv4DY8M2nCzQWW-RMHu48r6NcbVu7oxzRQLjNmnXd1MRZuslreJ-NACH8OZx5dl9Dm8YV-wvgN_bZpsjFPl-CYDUsetTdSU3Cdta83ApzMfTMg21M9aFEjjlZajkgoRY2TV418nIJPN-mNDZ4KjEyFHAXdhOxuiIjoEr22zkFFzPwPK4gUCI_8nTCTXXgMOckXHaRghn-FypLe4SZ4NDPGY927HvJlEez3Cg5ySWLCSsBEd91MW8xU-f2iIQWHXIqqvQu0lSHkDjZypjNq2jYKPvqTOW8f_XrPAlVMlr56s3OLZHsfV974n5CFOp1up8ObcGeqaWeBsBLZykuA2rnPiyO66PDUJRVYZbc__dPvNWFFc-AF1ds5Nw4vr61IbxVp-IShYgY7a7rT1lNk5UjX_BdF_xmqSDYF7FpZFk6HuiGoEO9vcJSVfak6sAWJH1WdS4h43detBTQZ5JvJfJOIditv4LEVthZH1Lr1BU4sLC8_J8VlL8GOeDo3GkRM2geGFG9BbYakdycnR8KFqnb8uWhoj5oYue_GTV97Oa_YCyN92x9MTik0hh_LILEID55xAzzMYUUJm3MhAYfkMVDSPgni5IEQlYB1wGCko3pGn3fg564KozhbutQdWbGxqcm5EWP6JoMrfLgBTU2Ob1GH3092u2-Axu9KMDGP7cfKxlt4-DMi_502psvAcVeZZ6Rwn9mvF8TY3_kq9KVyiOLR4T17C3a13jF1tbNvN1-aNux4lVRt_HIht3zAlGk8AFQ1HBNTf-qODrmw1Pp4xn3LECOcfynVFKehAkbFutGGkIrWbQq1z-mT5U4tzbF7nvht106lAV8QjO0pyl1Ax6T8nvW0QXbb0gDNxqa7Wf3m551CJj5iiea0c42sfLbyiXsMPTGxHbpwn8H5u3rHx9X9cRXXoEyV1oQ9m8T2HgkGeEO1eGEW3oaz-ncgdWdUNiCJmLW7TZ8RpnV9dSMibJoA-mEUUgjSGykqf7LiG1Wo",
  },
];

const Sobre = () => {
  const [openPlano, setOpenPlano] = useState(false);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-green-50 to-white text-gray-800">
      {/* CONTEÚDO PRINCIPAL COM ANIMAÇÃO */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className={`transition-all duration-500 ${
          openPlano ? "w-1/2" : "w-full"
        } p-8 md:p-12 overflow-y-auto`}
      >
        {/* Cabeçalho com ícone */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
            <img src={logoIcon} alt="Logo EMA" className="w-6 h-6" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-800">
            EMA
          </h1>
        </div>

        {/* Resumo do projeto em cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-green-100">
            <FaUniversity className="text-green-600 text-3xl mb-3" />
            <h3 className="text-xl font-bold mb-2">Contexto Acadêmico</h3>
            <p className="text-gray-600">
              Trabalho de Conclusão de Curso no IFMS – Campus Três Lagoas,
              integrando conhecimento em meteorologia e desenvolvimento de
              software.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-green-100">
            <FaChartLine className="text-green-600 text-3xl mb-3" />
            <h3 className="text-xl font-bold mb-2">Dados em Tempo Real</h3>
            <p className="text-gray-600">
              Coleta e visualização de temperatura, umidade, pressão,
              precipitação e velocidade do vento de estações distribuídas.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-green-100">
            <FaUsers className="text-green-600 text-3xl mb-3" />
            <h3 className="text-xl font-bold mb-2">Gestão Colaborativa</h3>
            <p className="text-gray-600">
              Sistema com níveis de acesso, convites e permissões para
              proprietários e membros de estações.
            </p>
          </div>
        </div>

        {/* Descrição detalhada */}
        <div className="bg-white rounded-2xl p-6 shadow-md mb-12 border-l-8 border-green-500">
          <h2 className="text-2xl font-semibold mb-3 text-green-700">
            Sobre o EMA
          </h2>
          <p className="text-gray-700 leading-relaxed">
            O EMA (Estações Meteorológicas Automatizadas) é um sistema completo
            para monitoramento climático, desenvolvido com foco em precisão,
            usabilidade e escalabilidade. Através de uma API robusta e um
            frontend moderno, o projeto permite que pesquisadores, agricultores
            e o público geral acompanhem condições meteorológicas em tempo real,
            além de previsões horárias. A plataforma suporta múltiplas estações,
            gestão de usuários e análise histórica de dados.
          </p>
        </div>

        <h2 className="text-2xl font-semibold mb-6 text-green-700 flex items-center gap-2">
          <FaUsers className="text-green-600" /> Equipe Executora
        </h2>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {integrantes.map((pessoa, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
            >
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  {pessoa.nome}
                </h3>
                <p className="text-green-600 font-medium mt-1">
                  {pessoa.funcao}
                </p>
                <p className="text-gray-500 text-sm mt-2 mb-4">
                  {pessoa.descricao}
                </p>
                <div className="flex gap-4 mt-4">
                  <a
                    href={pessoa.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-green-600 transition transform hover:scale-110"
                    aria-label="GitHub"
                  >
                    <FaGithub size={24} />
                  </a>
                  <a
                    href={pessoa.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-blue-600 transition transform hover:scale-110"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedin size={24} />
                  </a>
                  <a
                    href={pessoa.lattes}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-gray-900 transition transform hover:scale-110"
                    aria-label="Lattes"
                  >
                    <FaExternalLinkAlt size={22} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Botão para abrir plano de pesquisa */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setOpenPlano(true)}
            className="group relative bg-green-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
          >
            Plano de Pesquisa
          </button>
        </div>
      </motion.div>

      {/* PAINEL DO PDF COM ANIMAÇÃO */}
      <AnimatePresence>
        {openPlano && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 w-full md:w-1/2 h-full bg-white shadow-2xl z-50 border-l overflow-hidden"
          >
            {/* Botão fechar estilizado */}
            <button
              onClick={() => setOpenPlano(false)}
              className="absolute top-5 right-5 z-20 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Fechar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <PlanoPesquisa />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sobre;
