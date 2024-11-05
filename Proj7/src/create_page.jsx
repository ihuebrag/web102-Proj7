import React, { useEffect, useState } from "react";
import supabase from "./database";
import { getCharacterList } from "./database";
import SideBar from "./side_bar";
import { useLocation, useNavigate } from 'react-router-dom';


function CreatePage() {
    const [characterList, setCharacters] = useState([]); // Available characters from the database
    const [name, setName] = useState(""); // Name input
    const [selectedPower, setSelectedPower] = useState(""); // Selected power from dropdown
    const [selectedCharacter, setSelectedCharacter] = useState(null); // Chosen character
    const [filteredCharacters, setFilteredCharacters] = useState([]); // Filtered characters based on selected power
    // Attribute sliders for speed, strength, and endurance
    const [speed, setSpeed] = useState(50);
    const [strength, setStrength] = useState(50);
    const [endurance, setEndurance] = useState(50);

    const location = useLocation();
    const navigate = useNavigate();
    const [powers, setPowers] = useState('');
    const [id, setId] = useState(null); // To hold the character ID for editing


    const availablePowers = ["None", "Strength", "Speed", "Stealth", "Healing", "Fire"];


    // Check if there's a character being edited
    useEffect(() => {
        if (location.state && location.state.character) {
            const character = location.state.character;
            setName(character.name);
            setPowers(character.powers);
            setId(character.id); // Store the ID for updates
        }
    }, [location.state]);

    // Fetch characters from the database
    useEffect(() => {
        const fetchCharacters = async () => {
            //let {data: characters, error} = await supabase.from('characters').select('*');
            const {data, error} = await getCharacterList();
            console.log(data);
            //const { data, error } = await supabase.from("characters").select("*");
            if (error) {
                console.error("Error fetching characters:", error);
            } else {
                setCharacters(data);
                setFilteredCharacters(data);
                console.log(data);
            }
        };
        fetchCharacters();
    }, []);

    // Adjust sliders based on selected power
    useEffect(() => {
        if (selectedPower === "Strength") {
            setSpeed(30);
            setStrength(90);
            setEndurance(70);
            setFilteredCharacters(characterList.filter((character) => character.powers.includes("Strength")));
        } else if (selectedPower === "Speed") {
            setSpeed(90);
            setStrength(40);
            setEndurance(60);
            setFilteredCharacters(characterList.filter((character) => character.powers.includes("Speed")));
        } else if (selectedPower === "Stealth") {
            setSpeed(80);
            setStrength(50);
            setEndurance(65);
            setFilteredCharacters(characterList.filter((character) => character.powers.includes("Stealth")));
        } else if (selectedPower === "Healing") {
            setSpeed(60);
            setStrength(30);
            setEndurance(80);
            setFilteredCharacters(characterList.filter((character) => character.powers.includes("Healing")));
        } else if (selectedPower === "Fire") {
            setSpeed(60);
            setStrength(80);
            setEndurance(70);
            setFilteredCharacters(characterList.filter((character) => character.powers.includes("Fire")));
        } else {
            // Default values if no power is selected
            setSpeed(50);
            setStrength(50);
            setEndurance(50);
            setFilteredCharacters(characterList);
        }
    }, [selectedPower]);

    // Handle character creation
    const handleCreateCharacter = async () => {
        if (!name || !selectedPower || !selectedCharacter) {
            alert("Please complete all fields and select a character.");
            return;
        }

        if (id) {
            // Edit existing character
            const { error } = await supabase
                .from('population')
                .update({ name, powers })
                .eq('id', id);

            if (error) {
                console.error("Error updating character:", error);
            } else {
                console.log("Character updated successfully!");
                navigate('/'); // Redirect back to the character list after editing
            }
        } else {

            console.log("selected power: ", selectedPower);

            const { error } = await supabase.from("population").insert([
                {
                    name,
                    power: selectedPower,
                    speed,
                    strength,
                    endurance,
                    base_character_id: selectedCharacter.id, // Reference to the base character
                    base_character_image: selectedCharacter.image // Reference to the base character
                }
            ]);

            if (error) {
                console.error("Error creating character:", error);
            } else {
                alert("Character created successfully!");
                setName("");
                setSelectedPower("");
                setSelectedCharacter(null);
                setSpeed(50);
                setStrength(50);
                setEndurance(50);
            }
        }
    };

    return (
        <div style={{ display: "flex" }}>
            <SideBar />
            {/* Left side: Character selection */}
            <div style={{ width: "40%", padding: "10px" }}>
                <h2>Available Characters</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {filteredCharacters.map((character) => (
                        <div
                            key={character.id}
                            onClick={() => setSelectedCharacter(character)}
                            style={{
                                cursor: "pointer",
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                padding: "10px",
                                backgroundColor: selectedCharacter?.id === character.id ? "#ddd" : "white",
                                display: "flex",
                                alignItems: "center",
                                transition: "background-color 0.2s, transform 0.2s",
                                boxShadow: selectedCharacter?.id === character.id ? "0 4px 10px rgba(0, 0, 0, 0.2)" : "none",
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <img 
                                src={character.image} // Ensure this is the correct property for your character's image
                                alt={character.name}
                                style={{
                                    width: "50px", // Set desired image size
                                    height: "50px",
                                    borderRadius: "50%", // Optional: Makes the image circular
                                    marginRight: "10px"
                                }}
                            />
                            <div>
                                <h4 style={{ margin: "0" }}>{character.name}</h4>
                                <p style={{ margin: "0", fontSize: "14px", color: "#666" }}>
                                    Powers: {character.powers}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            {/* Right side: Form to create a new character */}
            <div style={{ width: "60%", padding: "10px" }}>
                <h2>Create a New Character</h2>
                <form onSubmit={(e) => e.preventDefault()}>
                    <label>
                        Name:
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Power:
                        <select
                            value={selectedPower}
                            onChange={(e) => setSelectedPower(e.target.value)}
                            required
                        >
                            <option value="" disabled>Select a power</option>
                            {availablePowers.map((power) => (
                                <option key={power} value={power}>
                                    {power}
                                </option>
                            ))}
                        </select>
                    </label>
                    <br />
                    
                    {/* Sliders for Speed, Strength, Endurance */}
                    <div>
                        <label>
                            Speed:
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={speed}
                                onChange={(e) => setSpeed(e.target.value)}
                            />
                            <span>{speed}</span>
                        </label>
                        <br />
                        <label>
                            Strength:
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={strength}
                                onChange={(e) => setStrength(e.target.value)}
                            />
                            <span>{strength}</span>
                        </label>
                        <br />
                        <label>
                            Endurance:
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={endurance}
                                onChange={(e) => setEndurance(e.target.value)}
                            />
                            <span>{endurance}</span>
                        </label>
                    </div>
                    
                    <button onClick={handleCreateCharacter}>{id ? 'Update' : 'Create Character'}</button>
                </form>
            </div>
        </div>
    );
}

export default CreatePage;
