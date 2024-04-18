"use client";

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useState, useEffect } from 'react';
import { Tables } from '../../utils/supabase';

const countries = ["USA", "EUR", "JPN", "AUS", "KOR", "CHN"];

export default function Fetch() {
    const [cheat, setCheat] = useState<Tables<"cheats"> | null>(null);
    const [cheats, setCheats] = useState<Tables<"cheats">[]>([]);
    const [game, setGame] = useState<Tables<"games"> | null>(null);
    const [games, setGames] = useState<Tables<"games">[]>([]);
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

    const getCheats = async (game: Tables<"games">) => {
        if (localStorage.getItem(game.id)) {
            setCheats(JSON.parse(localStorage.getItem(game.id)!));
            return;
        }
        const response = await fetch('/api/game/cheat', {
            method: 'POST',
            body: JSON.stringify({ game_id: game.id }),
        });
        if (response.status === 200) {
            const data:any = await response.json();
            // add results to local storage with game id as key
            localStorage.setItem(game.id, JSON.stringify(data));
            setCheats(data);
        } else {
            console.error('Failed to fetch cheats:', await response.text());
            setCheats([]);
        }
    }

    return (
        <div className='rounded-md bg-white px-5 py-2 m-5 w-fit'>
            {cheats.length == 0 && (
                <div className='flex gap-5 w-[80dvw]'>
                    {games.length > 0 && (
                        // home button
                        <button onClick={() => window.location.reload()} className='bg-blue-200 hover:bg-blue-400 text-black font-bold px-2 rounded border border-slate-400'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                            </svg>
                        </button>
                    )}
                    <Autocomplete
                        sx={{ width: "95%" }}
                        options={selectedCountry && games.length > 0 ? games : countries}
                        getOptionLabel={(option: string | Tables<"games">) => typeof option === 'string' ? option : option.name}
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
                </div>
            )}
            {cheats.length > 0 && (
                // create an autocomplete for cheats here
                <div className='h-[80dvh]'>
                    <div className='flex gap-5 py-3'>
                        {/* refresh page */}
                        <button onClick={() => window.location.reload()} className='bg-blue-200 hover:bg-blue-400 text-black font-bold px-2 rounded border border-slate-400'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                            </svg>
                        </button>
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
                                    className='bg-blue-200 hover:bg-blue-400 text-black font-bold px-2 rounded border border-slate-400'
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                                    </svg>
                                </button>    
                            </div>
                        )}
                    </div>
                    <div className='h-[70dvh] overflow-y-scroll'>
                        <table className='text-black overflow-y-scroll h-[80dvh]'>
                            <thead>
                                <tr>
                                    <th className='border-black border p-1'>Name</th>
                                    <th className='border-black border p-1'>Code</th>
                                </tr>
                            </thead>
                            <tbody className=''>
                                {cheats.map((cheat) => (
                                    <tr key={cheat.id}>
                                        <td className='break-words max-w-[23dvw] border border-black p-1'>{cheat.name}</td>
                                        <td className='max-w-[56dvw] border break-words border-black p-1'>{cheat.code}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}