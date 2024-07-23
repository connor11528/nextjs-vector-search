import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { jobListings } = body;

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_SECRET_KEY,
    });

    // Function to generate OpenAI embeddings for a given query
    async function generateOpenAIEmbeddings(jobListing) {
        const textToEmbed = Object.values(jobListing).join(' ');
        const response = await openai.embeddings.create({
            model: 'text-embedding-ada-002',
            input: textToEmbed,
        });
        return response.data[0].embedding;
    }

    try {
        const updatedJobListings = [];

        await Promise.all(
            jobListings.map(async (jobListing) => {
                const embedding = await generateOpenAIEmbeddings(jobListing);
                console.log('embedding: ', embedding)

                console.log({ ...jobListing, embedding })

                updatedJobListings.push({ ...jobListing, embedding });
            })
        );

        return NextResponse.json({
            success: true,
            status: 200,
            result: updatedJobListings,
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
