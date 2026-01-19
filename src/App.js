import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Historique from "./pages/Historique"
import SeminairesPage from "./pages/SeminairePage";
import RestaurantsAndMenusPage from "./pages/RestaurantsAndMenusPage";
import BoissonsPage from "./pages/BoissonsPage";
import SpasPage from "./pages/SpasPage";
import LoisirsPage from "./pages/LoisirsPage";
import OffresPage from "./pages/OffresPage";
import EvenementsPage from "./pages/EvenementsPage";
import RoomServicePage from "./pages/RoomServicePage";
import TerrassePiscinePage from "./pages/TerrassePiscinePage";
import Statistiques from "./pages/Statistiques";
import PageContents from "./pages/page-contents";
import CommitmentPage from "./pages/CommitmentPage";
import QuestionnaireClient from "./pages/QuestionnaireClient";
import QuestionnairesPage from "./pages/QuestionnairePage"; 
import SkipCleansPage from "./pages/SkipcleanPage";

// Client pages

import Home from "./pages/Home";

import SeminairesClient from "./pages/SeminaireClient";
import RestaurantsMenusClient from "./pages/RestaurantsMenusClient";
import BoissonsClient from "./pages/BoissonsClient";
import SpasClient from "./pages/SpasClient";
import LoisirsClient from "./pages/LoisirsClient";
import OffresClient from "./pages/OffresClient";
import EvenementsClient from "./pages/EvenementsClient";
import RoomServiceClient from "./pages/RoomServiceClient";
import TerrassePiscineClient from "./pages/TerrassePiscineClient";
import ChambresClient from "./pages/ChambresClient";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import ReservationsPage from "./pages/ReservationsPage";
import NettoyagePage from "./pages/NettoyagePage";
import RoomServiceOrders from "./pages/RoomServiceOrders";
import PrivacyClient from "./pages/PrivacyClient"
import SkipCleanClient from "./pages/SkipcleanClient";


function App() {
  return (
    <BrowserRouter basename="">
      <Routes>
        {/* 🔐 Admin / Authenticated Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/reservations" element={<ReservationsPage />} />
        <Route path="/nettoyage" element={<NettoyagePage />} />
        <Route path="/roomserviceorders" element={<RoomServiceOrders />} />
        <Route path="/historique" element={<Historique />} />
        <Route path="/statistiques" element={<Statistiques />} />

        <Route path="/page-contents" element={<PageContents />} />
        <Route path="/seminaires" element={<SeminairesPage />} />
        <Route path="/restaurants" element={<RestaurantsAndMenusPage />} />
        <Route path="/boissons" element={<BoissonsPage />} />
        <Route path="/loisirs" element={<LoisirsPage />} />
        <Route path="/spas" element={<SpasPage />} />
        <Route path="/evenements" element={<EvenementsPage />} />
        <Route path="/offres" element={<OffresPage />} />
        <Route path="/roomservices" element={<RoomServicePage />} />
        <Route path="/terrasse-piscine" element={<TerrassePiscinePage />} />
        <Route path="/questionnaire-client" element={<QuestionnaireClient />} />
        <Route path="/skipclean-client" element={<SkipCleanClient />} />
        <Route path="/questionnaires" element={<QuestionnairesPage />} />
        <Route path="/skipcleans" element={<SkipCleansPage />} />


        {/* 🌍 Public / Client Routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/commitment" element={<CommitmentPage />} />
        <Route path="/seminaires-client" element={<SeminairesClient />} />
        <Route path="/RestaurantsMenus-client" element={<RestaurantsMenusClient />} />
        <Route path="/boissons-client" element={<BoissonsClient />} />
        <Route path="/spas-client" element={<SpasClient />} />
        <Route path="/loisirs-client" element={<LoisirsClient />} />
        <Route path="/evenements-client" element={<EvenementsClient />} />
        <Route path="/offres-client" element={<OffresClient />} />
        <Route path="/roomservices-client" element={<RoomServiceClient />} />
        <Route path="/terrasse-piscine-client" element={<TerrassePiscineClient />} />
        <Route path="/chambres-client" element={<ChambresClient />} />
        <Route path="/policy-client" element={<PrivacyClient />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
