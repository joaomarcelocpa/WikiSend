import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import RegisterInformation from './pages/RegisterInformation';
import EditInformation from './pages/EditInformation';
import RegisterCategory from './pages/RegisterCategory';
import EditCategory from './pages/EditCategory';
import { AuthProvider } from './shared/contexts/AuthContext';
import { ProtectedRoute } from './shared/contexts/ProtectedRoute';

function App() {
    const [darkMode, setDarkMode] = useState(false);

    return (
        <AuthProvider>
            <Routes>
                <Route
                    path="/login"
                    element={<Login darkMode={darkMode} setDarkMode={setDarkMode} />}
                />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Home darkMode={darkMode} setDarkMode={setDarkMode} />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/register"
                    element={
                        <ProtectedRoute>
                            <RegisterInformation
                                darkMode={darkMode}
                                setDarkMode={setDarkMode}
                            />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/edit"
                    element={
                        <ProtectedRoute>
                            <EditInformation
                                darkMode={darkMode}
                                setDarkMode={setDarkMode}
                            />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/register-category"
                    element={
                        <ProtectedRoute>
                            <RegisterCategory
                                darkMode={darkMode}
                                setDarkMode={setDarkMode}
                            />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/edit-category"
                    element={
                        <ProtectedRoute>
                            <EditCategory
                                darkMode={darkMode}
                                setDarkMode={setDarkMode}
                            />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;