"use client";

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useState, useEffect } from 'react';
import { Tables } from '../supabase';

const countries = ["USA", "EUR", "JPN", "AUS", "KOR", "CHN"];

interface Game {
    id: number;
    name: string;
}

export default function Fetch() {
    const [cheats, setCheats] = useState<Tables<"cheats">[]>([]);
    const [game, setGame] = useState<Game | null>(null);
    const [games, setGames] = useState<Game[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

    useEffect(() => {
        if (selectedCountry) {
            getGame(selectedCountry);
        }
    }, [selectedCountry]);
    useEffect(() => {
        if (game) {
            getCheats(game);
        }
    }, [game]);
    const getGame = async (country: string) => {
        const response = await fetch('/api/game/name', {
            method: 'POST',
            body: JSON.stringify({ country }),
        });
        if (response.status === 200) {
            const data:any = await response.json();
            setGames(data);
        } else {
            console.error('Failed to fetch games:', await response.text());
            setGames([]);
        }
    };

    const getCheats = async (game: Game) => {
        const response = await fetch('/api/game/cheat', {
            method: 'POST',
            body: JSON.stringify({ game_id: game.id }),
        });
        if (response.status === 200) {
            const data:any = await response.json();
            setCheats(data);
        } else {
            console.error('Failed to fetch cheats:', await response.text());
            setCheats([]);
        }
    }

    return (
        <div className='rounded-md bg-white px-5 py-2 w'>
            {cheats.length == 0 && (
            <Autocomplete
                sx={{ width: 400 }}
                options={selectedCountry && games.length > 0 ? games : countries}
                getOptionLabel={(option: string | Game) => typeof option === 'string' ? option : option.name}
                value={selectedCountry && games.length > 0 ? game : selectedCountry}
                onChange={(event, newValue) => {
                    if (typeof newValue === 'string') {
                        setSelectedCountry(newValue);
                        setGame(null);
                    } else if (newValue && typeof newValue !== 'string') {
                        setGame(newValue);
                    }
                }}
                renderInput={(params) => <TextField {...params} label={selectedCountry && games.length > 0 ? "Game" : "Origin"} />}
            />
            )}
            {cheats.length > 0 && (
                <table className='text-black'>
                    <thead>
                        <tr>
                            {/* <th>Name</th> */}
                            <th>Code</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cheats.map((cheat) => (
                            <tr key={cheat.id}>
                                {/* <td className='break-words max-w-32'>{cheat.name}</td> */}
                                <td className='truncate max-w-36'>{cheat.code}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}