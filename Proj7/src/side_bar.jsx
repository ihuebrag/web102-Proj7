import React from "react";
import { Link } from "react-router-dom";

function SideBar() {
    return (
        <div>
            <a href="/home">
                <button>
                    <h1>Home</h1>
                </button>
            </a>
            <a href="/create">
                <button>
                    <h1>Create</h1>
                </button>
            </a>
            <a href="/characterCards">
                <button>
                    <h1>Collection</h1>
                </button>
            </a>
        </div>
    );
}


export default SideBar;