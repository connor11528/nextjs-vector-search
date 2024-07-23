import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { searchTerm } = body;

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_SECRET_KEY,
    });

    try {
        const response = await openai.embeddings.create({
            model: 'text-embedding-ada-002',
            input: searchTerm,
        });

        return NextResponse.json({
            success: true,
            status: 200,
            result: response.data[0].embedding,
        });
    } catch (error) {
        return NextResponse.json({
            status: 500,
            success: false,
            results: error,
            message: 'Internal Server Error',
        });
    }
}