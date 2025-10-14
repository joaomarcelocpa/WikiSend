interface FooterProps {
    darkMode: boolean;
}

const Footer = ({ darkMode }: FooterProps) => {
    return (
        <footer className={`border-t mt-20 font-sans ${
            darkMode ? 'bg-[#1a1a1a] border-gray-800' : 'bg-white border-gray-100'
        }`}>
            <div className="w-full px-8 py-8">
                <div className="text-center">
                    <p className="text-sm text-gray-500">
                        © 2025 M2C Digital - Wiki Send - Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;