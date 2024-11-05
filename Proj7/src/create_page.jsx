import React, { useEffect, useState } from "react";
import supabase from "./database";
import { getCharacterList } from "./database";
import SideBar from "./side_bar";

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

    const availablePowers = ["None", "Strength", "Speed", "Stealth", "Healing", "Fire"];

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

        const { error } = await supabase.from("population").insert([
            {
                name,
                power: selectedPower,
                speed,
                strength,
                endurance,
                base_character_id: selectedCharacter.id // Reference to the base character
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
    };

    return (
        <div style={{ display: "flex" }}>
            <SideBar />
            {/* Left side: Character selection */}
            <div style={{ width: "40%", padding: "10px" }}>
                <h2>Available Characters</h2>
                <ul>
                    {filteredCharacters.map((character) => (
                        <li
                            key={character.id}
                            onClick={() => setSelectedCharacter(character)}
                            style={{
                                cursor: "pointer",
                                backgroundColor: selectedCharacter?.id === character.id ? "#ddd" : "white"
                            }}
                        >
                            {character.name} - {character.powers}
                        </li>
                    ))}
                </ul>
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
                    
                    <button onClick={handleCreateCharacter}>Create Character</button>
                </form>
            </div>
        </div>
    );
}

export default CreatePage;
