import { createClient } from '@/utils/supabase/server';
import { NextRequest } from 'next/server';

export const runtime = 'edge'

export async function POST(request: NextRequest) {
    const data: any = await request.json();
    if (!data["game_id"]) {
        console.log('game_id is required', data);
        return new Response('game_id is required', { status: 400 });
    }
    if (!data["category"]) {
        console.log('category is required', data);
        return new Response('category is required', { status: 400 });
    }

    const client = createClient();
    const { data: cheats, error } = await client
        .from('cheats')
        .select('id, name, code')
        .eq('game', data["game_id"])
        .eq('category', data["category"]);
    if (error) {
        console.error('Failed to fetch cheats:', error.message);
        return new Response('error', { status: 500 });
    }
    return new Response(JSON.stringify(cheats), { status: 200 });
}