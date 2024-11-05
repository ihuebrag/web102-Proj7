import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCharacterById } from "./database"; // You need to implement this function
import SideBar from "./side_bar";

function InfoPages() {
    const { id } = useParams(); // Get character ID from the URL
    const [character, setCharacter] = useState(null);
    const [error, setError] = useState(null);

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

    return (
        <div>
            <SideBar />
            <h1>Character Info</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {character ? (
                <div>
                    <h2>{character.name}</h2>
                    <p>Powers: {character.powers ? character.powers.split(", ").join(" | ") : "None"}</p>
                    {/* Add more character details as needed */}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default InfoPages;
