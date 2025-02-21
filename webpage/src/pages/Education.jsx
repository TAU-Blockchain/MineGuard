import {
  FaSkull,
  FaFish,
  FaUserSecret,
  FaCoins,
  FaPiggyBank,
  FaUsers,
  FaRunning,
  FaShieldAlt,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";
import { MdCastForEducation } from "react-icons/md";
function Education() {
  const scamTypes = [
    {
      title: "Scammer",
      icon: FaSkull,
      description:
        "Malicious actors who create fake contracts to steal funds directly. They often impersonate legitimate projects and use social engineering tactics.",
      warning:
        "Always verify contract source code and check for official project links.",
      color: "from-red-500 to-red-600",
    },
    {
      title: "Phishing",
      icon: FaFish,
      description:
        "Deceptive contracts that trick users into approving malicious transactions or revealing private information.",
      warning:
        "Never share your private keys or approve suspicious token permissions.",
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "Honeypot",
      icon: FaPiggyBank,
      description:
        "Contracts that allow users to deposit tokens but prevent withdrawals through hidden code mechanisms.",
      warning:
        "Check token liquidity and verify withdrawal functions before investing.",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      title: "Hidden Owner Privileges",
      icon: FaUserSecret,
      description:
        "Contracts with concealed admin functions that allow owners to manipulate tokens or steal funds.",
      warning:
        "Review owner privileges and look for suspicious admin functions.",
      color: "from-green-500 to-green-600",
    },
    {
      title: "Approval Draining",
      icon: FaCoins,
      description:
        "Contracts that request excessive token approvals to drain user wallets over time.",
      warning:
        "Only approve necessary token amounts and regularly check your approvals.",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Ponzi",
      icon: FaPiggyBank,
      description:
        "Investment schemes that pay earlier investors using funds from new investors, eventually collapsing.",
      warning:
        "Be skeptical of promises of high returns with no clear value proposition.",
      color: "from-indigo-500 to-indigo-600",
    },
    {
      title: "Sybil",
      icon: FaUsers,
      description:
        "Attacks where a single entity creates multiple fake identities to manipulate system rewards or voting.",
      warning:
        "Look for unusual patterns in transaction history and user behavior.",
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Rugger",
      icon: FaRunning,
      description:
        "Project creators who abandon the project and withdraw all liquidity, leaving investors with worthless tokens.",
      warning:
        "Research team transparency and check liquidity lock mechanisms.",
      color: "from-pink-500 to-pink-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <section className="bg-gradient-to-b from-[#F4F1BB] to-[#5CA4A9] shadow-lg text-white py-32 relative overflow-hidden my-8">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <MdCastForEducation className="text-[125px] animate-pulse text-[#ED6A5A]" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-pixelify text-center">
              Blockchain Security Education
            </h1>
            <p className="text-xl mb-8 text-center leading-relaxed">
              Learn how to stay safe in the blockchain world. Identify common
              scam types and protect yourself.
            </p>
            <div className="flex justify-center gap-4">
              <div className="absolute -bottom-10 hidden md:block left-1/2 transform -translate-x-1/2">
                <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
                  <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-bounce"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {scamTypes.map((scam, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`h-2 bg-gradient-to-r ${scam.color}`} />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800 font-pixelify">
                      {scam.title}
                    </h3>
                    <scam.icon className="text-2xl text-[#ED6A5A]" />
                  </div>
                  <p className="text-gray-600 mb-4">{scam.description}</p>
                  <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <p className="text-sm text-red-700">
                      <strong>Warning:</strong> {scam.warning}
                    </p>
                  </div>
                </div>
                <div
                  className={`absolute inset-0 bg-gradient-to-b ${scam.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold mb-12 font-pixelify text-center text-[#ED6A5A]">
              Web3 Security Checklist
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-[#36C9C6] text-white rounded-lg p-8 shadow-lg transform hover:scale-105 transition-transform duration-300">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <FaCheckCircle className="mr-2" />
                  Essential Security Tips
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <FaShieldAlt className="mr-2" />
                    Always verify contract source code
                  </li>
                  <li className="flex items-center">
                    <FaShieldAlt className="mr-2" />
                    Use hardware wallets for significant holdings
                  </li>
                  <li className="flex items-center">
                    <FaShieldAlt className="mr-2" />
                    Never share your private keys
                  </li>
                  <li className="flex items-center">
                    <FaShieldAlt className="mr-2" />
                    Monitor your token approvals regularly
                  </li>
                </ul>
              </div>

              <div className="bg-[#ED6A5A] text-white rounded-lg p-8 shadow-lg transform hover:scale-105 transition-transform duration-300">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <FaExclamationTriangle className="mr-2" />
                  Important Precautions
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <FaShieldAlt className="mr-2" />
                    Be skeptical of unrealistic promises
                  </li>
                  <li className="flex items-center">
                    <FaShieldAlt className="mr-2" />
                    Research thoroughly before investing
                  </li>
                  <li className="flex items-center">
                    <FaShieldAlt className="mr-2" />
                    Stay alert for social engineering attacks
                  </li>
                  <li className="flex items-center">
                    <FaShieldAlt className="mr-2" />
                    Report suspicious transactions immediately
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Education;
