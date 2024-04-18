"use client";

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useState, useEffect } from 'react';
import { Tables } from '../../utils/supabase';

const countries = ["USA", "EUR", "JPN", "AUS", "KOR", "CHN"];

interface Game {
    id: number;
    name: string;
}

export default function Fetch() {
    const [cheat, setCheat] = useState<Tables<"cheats"> | null>(null);
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
        <div className='rounded-md bg-white px-5 py-2 m-5 w'>
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
                // create an autocomplete for cheats here
                <div className='h-[80dvh] overflow-y-scroll'>
                    <div className='flex gap-5 py-3'>
                        {/* refresh page */}
                        <button onClick={() => window.location.reload()} className='bg-blue-200 hover:bg-blue-400 w-[15%] text-black font-bold py-2 px-4 rounded border border-slate-400'>Home</button>
                        <Autocomplete
                            sx={{ width: "30%" }}
                            options={cheats}
                            getOptionLabel={(option: Tables<"cheats">) => option.name}
                            value={cheat}
                            onChange={(event, newValue) => {
                                setCheat(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} label="Cheat" />}
                        />
                        {cheat && (
                            <div className='w-1/2 flex gap-5'>
                                <TextField
                                    sx={{ width: "80%" }}
                                    id="code"
                                    label="Code"
                                    variant="outlined"
                                    value={cheat.code}
                                    disabled
                                    // onclick copy to clipboard
                                    InputProps={{ readOnly: true }}
                                />
                                <button 
                                    onClick={() => {
                                        navigator.clipboard.writeText(cheat.code)
                                        alert('Copied to clipboard');
                                    }} 
                                    className='bg-blue-200 hover:bg-blue-400 w-[15%] text-black font-bold py-2 px-4 rounded border border-slate-400'
                                >
                                    Copy
                                </button>    
                            </div>
                        )}
                    </div>
                    <table className='text-black overflow-y-scroll'>
                        <thead>
                            <tr>
                                <th className='border-black border p-1'>Name</th>
                                <th className='border-black border p-1'>Code</th>
                            </tr>
                        </thead>
                        <tbody className=''>
                            {cheats.map((cheat) => (
                                <tr key={cheat.id}>
                                    <td className='break-words max-w-32 border border-black p-1'>{cheat.name}</td>
                                    <td className='max-w-[75dvw] border break-words border-black p-1'>{cheat.code}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}