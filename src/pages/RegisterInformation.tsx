import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RegistrationForm from '../components/RegistrationForm';

interface RegisterInformationProps {
    darkMode: boolean;
    setDarkMode: (value: boolean) => void;
    onBack: () => void;
}

const RegisterInformation = ({ darkMode, setDarkMode, onBack }: RegisterInformationProps) => {
    return (
        <div className={`min-h-screen font-sans ${
            darkMode ? 'bg-[#0f0f0f]' : 'bg-gray-50'
        }`}>
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} showUserInfo={false} />

            <div className="max-w-[1400px] mx-auto px-8 py-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className={`text-3xl font-bold mb-3 font-heading ${
                        darkMode ? 'text-white' : 'text-max-data'
                    }`}>
                        Cadastrar Nova Informação
                    </h1>
                    <p className={`text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Preencha os campos abaixo para adicionar conteúdo à Wiki
                    </p>
                </div>

                <RegistrationForm darkMode={darkMode} onBack={onBack} />
            </div>

            <Footer darkMode={darkMode} />
        </div>
    );
};

export default RegisterInformation;