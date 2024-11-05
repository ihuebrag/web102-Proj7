import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { deletePop, editPop, getCharacterById } from "./database"; // You need to implement this function
import SideBar from "./side_bar";
import { useNavigate } from "react-router-dom";

function InfoPages() {
    const { id } = useParams(); // Get character ID from the URL
    const [character, setCharacter] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCharacter = async () => {
            const response = await getCharacterById(id); // Fetch character by ID
            const { data, error } = response;

            if (error) {
                console.error("Error fetching character:", error);
                setError("Failed to load character information.");
            } else {
                setCharacter(data);
                
            }
        };
        fetchCharacter();
    }, [id]);

    const handleEditClick = () => {
        // Redirect to Create Page with the character data
        navigate('/create', { state: { character } });
    };

    const handleDeleteClick = () => {
        if (window.confirm("Are you sure you want to delete this character?")) {
            deletePop(character.id);
        }
    };
    

    return (
        <div>
            <SideBar />
            <h1>Character Info</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {character ? (
                <div>
                    <img src={character.base_character_image} alt={character.name} style={{ width: "200px" }} />
                    <h2>{character.name}</h2>
                    <p>Power: {character.power}</p>
                    <button onClick={() => handleEditClick()}>Edit</button>
                    <button onClick={() => handleDeleteClick()}>Delete</button>
                    {/* Add more character details as needed */}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default InfoPages;
