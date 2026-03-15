import React from "react";
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import CreateAccount from "./pages/CreateAccount";
import AllTherapistsPage from "./pages/AllTherapistsPage";
import TherapistDetails from "./components/TherapistDetails";
import UserPage from "./pages/UserPage";
import FindTherapist from "./pages/FindTherapist";
import {NextUIProvider} from "@nextui-org/react";
import {ThemeProvider as NextThemesProvider} from "next-themes";
import TherapistResults from "./pages/TherapistResults";
import TherUserPage from "./pages/TherUserPage";
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfUsePage from './pages/TermsOfUsePage';

function App() {
    return (
        <BrowserRouter>
            <NextUIProvider>
                <NextThemesProvider attribute="class" defaultTheme="light">
                    <RoutesComponent/>
                </NextThemesProvider>
            </NextUIProvider>
        </BrowserRouter>
    );
}

function RoutesComponent() {
    return (
        <Routes>
            <Route path="/main" element={<MainPage/>}/>
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-use" element={<TermsOfUsePage />} />
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/forgot-password" element={<ResetPasswordPage/>}/>
            <Route path="/create-account" element={<CreateAccount/>}/>
            <Route path="/all-therapists" element={<AllTherapistsPage/>}/>
            <Route path="/all-therapists/:id" element={<TherapistDetails/>}/>
            <Route path="/my-account/:id" element={<UserPage/>}/>
            <Route path="/my-doc-account/:id" element={<TherUserPage/>}/>
            <Route path="/find-therapist" element={<FindTherapist/>}/>
            <Route path="/therapist-results" element={<TherapistResults/>}/>
            <Route path="/" element={<Navigate to="/login"/>}/>
        </Routes>
    );
}

export default App;
