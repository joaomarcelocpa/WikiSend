import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RegisterCategoryForm from '../components/RegisterCategoryForm';

interface RegisterCategoryProps {
    darkMode: boolean;
    setDarkMode: (value: boolean) => void;
}

const RegisterCategory = ({ darkMode, setDarkMode }: RegisterCategoryProps) => {
    // const navigate = useNavigate();

    return (
        <div className={`min-h-screen font-sans flex flex-col ${
            darkMode ? 'bg-[#0f0f0f]' : 'bg-gray-50'
        }`}>
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} showUserInfo={true} />

            <div className="max-w-[1400px] mx-auto px-8 py-8 flex-1">
                <div className="mb-6">
                    <h1 className={`text-3xl font-bold mb-3 font-heading ${
                        darkMode ? 'text-white' : 'text-max-data'
                    }`}>
                        Cadastrar Nova Categoria
                    </h1>
                    <p className={`text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Preencha os campos abaixo para adicionar uma nova categoria e suas subcategorias
                    </p>
                </div>

                <RegisterCategoryForm darkMode={darkMode} />
            </div>

            <Footer darkMode={darkMode} />
        </div>
    );
};

export default RegisterCategory;