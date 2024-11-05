import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPopulationList } from "./database"; // Adjust the import path as necessa
import SideBar from "./side_bar";

function CharacterCards() {
    const [characters, setCharacters] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCharacters = async () => {
            const response = await getPopulationList();
            const { data, error } = response;

            if (error) {
                console.error("Error fetching characters:", error);
                setError("Failed to load characters.");
            } else {
                setCharacters(data);
            }
        };
        fetchCharacters();
    }, []);

    return (
        <div>
            <SideBar />
            <h1>Character Cards</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                {characters.map((character) => (
                    <div 
                        key={character.id} 
                        onClick={() => navigate(`/info/${character.id}`)} // Navigate to info page
                        style={{
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            padding: "16px",
                            cursor: "pointer",
                            width: "200px",
                            textAlign: "center",
                            transition: "transform 0.2s",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <img src={character.base_character_image} alt={character.name} style={{ width: "100%" }} />
                        <h3>{character.name}</h3>
                        <p>Power: {character.power}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CharacterCards;
