import React from 'react';
import { Route } from 'react-router-dom';
import { BrowserRouter as Router, Routes } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import HomePage from './App';
import CreatePage from './create_page';
import InfoPages from './info_pages';
import SideBar from './side_bar';
import CharacterCards from './characterCards';

function Routing() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/sideBar" element={<SideBar />} />
                <Route path="/create" element={<CreatePage />} />
                <Route path="/characterCards" element={<CharacterCards />} />
                <Route path="/info/:id" element={<InfoPages />} />

            </Routes>
        </Router>
    );
}

export default Routing;