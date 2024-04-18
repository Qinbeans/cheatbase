import { createClient } from '@/utils/supabase/server';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    const data: any = await request.json();
    if (!data["country"]) {
        console.log('country is required', data);
        return new Response('country is required', { status: 400 });
    }

    const client = createClient();
    const { data: games, error } = await client
        .from('games')
        .select('id, name')
        .eq('country', data["country"])
        .limit(10);
    if (error) {
        return new Response('error', { status: 500 });
    }
    return new Response(JSON.stringify(games), { status: 200 });
}