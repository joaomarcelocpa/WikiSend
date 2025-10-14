import { ArrowLeft } from 'lucide-react';
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
        <div className="min-h-screen" style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            backgroundColor: darkMode ? '#0f0f0f' : '#f9fafb'
        }}>
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} showUserInfo={false} />

            <div className="max-w-[900px] mx-auto px-8 py-12">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={onBack}
                        className="flex items-center mb-6 text-mid-data hover:text-high-data transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        <span className="font-medium">Voltar</span>
                    </button>

                    <h1 className="text-4xl font-bold mb-3" style={{
                        fontFamily: 'Poppins, sans-serif',
                        color: darkMode ? '#fff' : '#155457'
                    }}>
                        Cadastrar Nova Informação
                    </h1>
                    <p className="text-lg" style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}>
                        Preencha os campos abaixo para adicionar conteúdo à Wiki
                    </p>
                </div>

                <RegistrationForm darkMode={darkMode} />
            </div>

            <Footer darkMode={darkMode} />
        </div>
    );
};

export default RegisterInformation;