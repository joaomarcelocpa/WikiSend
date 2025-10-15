import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.tsx';
import Footer from '../components/layout/Footer.tsx';
import RegistrationForm from '../components/information/RegistrationForm.tsx';

interface RegisterInformationProps {
    darkMode: boolean;
    setDarkMode: (value: boolean) => void;
}

const RegisterInformation = ({ darkMode, setDarkMode }: RegisterInformationProps) => {
    const navigate = useNavigate();

    return (
        <div className={`min-h-screen font-sans ${
            darkMode ? 'bg-[#0f0f0f]' : 'bg-gray-50'
        }`}>
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} showUserInfo={true} />

            <div className="max-w-[1400px] mx-auto px-8 py-8">
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

                <RegistrationForm darkMode={darkMode} onBack={() => navigate('/')} />
            </div>

            <Footer darkMode={darkMode} />
        </div>
    );
};

export default RegisterInformation;