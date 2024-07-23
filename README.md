# Vector Search with Next.js

This is a proof of concept project showing how to use Vectors in [Next.js](https://nextjs.org/). 

It's primarily a frontend repo with two endpoints for generating embeddings using the [OpenAI API](https://openai.com/api/).

For a real life application we'd want to connect to a Postgres database with the [PGVector](https://github.com/pgvector/pgvector) extension to store and query these vectors.

Alternatively we could connect to a purpose built "vector database" like [Pinecone](https://www.pinecone.io/) or [Weaviate](https://weaviate.io/).


## Getting Started

You'll need an OpenAI API key added to an `.env` file. You'll also need to fund your account so you can make requests. I spent $0.14 developing this application 💰

```bash
cp .env.example .env
```

Once complete run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Application Structure

<img width="511" alt="Screenshot 2024-07-23 at 4 03 52 PM" src="https://github.com/user-attachments/assets/7cb58782-6870-44ec-a8a6-a59d7e8d37e6">

There is a "Build Vectors" button. First click that. It will send a request to `/api/build-vectors`, defined in **app/api/build-vectors/route.ts**.

This will create a vectors for the ten static data items. You can then type a search term and click "Search".

Performing a search will send an API request to the backend at `/api/build-vector` (defined in **app/api/build-vector/route.ts**) to create an embedding for the search term. 

Once the embedding for the search term is complete we're doing a poor man's vector search in the browser.

For a real application we'd likely want to do SQL or vector queries to return the results.


## PGVector for storing vector embeddings

In order to store vectors you can add a column and index to an existing table:

```sql
ALTER TABLE your_table
ADD COLUMN embedding vector(1536);

CREATE INDEX ON your_table USING hnsw (embedding vector_cosine_ops) 
WITH (m = 16, ef_construction = 64);
```
To understand why this is vector length of `1536` and `hnsw` please ask AI. You may want to use a different index for your use case. `1536` corresponds to the `text-embedding-ada-002` embeddings OpenAI creates for us.

To create an embedding using the OpenAI API. This is in the code like:

```ts
async function generateOpenAIEmbeddings(someObject) {
        // convert the object to a string
        const textToEmbed = Object.values(someObject).join(' ');

        // create an embedding from the string using the OpenAI API
        const response = await openai.embeddings.create({
            model: 'text-embedding-ada-002',
            input: textToEmbed,
        });

        return response.data[0].embedding;
    }
```
Creating the embeddings can be done using Node.js, Python, PHP or your language of choice.

To store a vector embedding in the database using SQL we could do:

```sql
UPDATE <some_table> SET embedding = (ARRAY[
                -0.0029228285,
                -0.030264609,
                /* ... rest of the embedding */
    ]::vector(1536))
WHERE id = <some_id_to_update>;
```

Then to query for a search term you'd want to create an embedding for the search term then run a query like:

```sql
SELECT some_table.*, embedding <=> (ARRAY[
                -0.0066249488,
                -0.008707857,
                /* ... rest of the embedding */
    ]::vector(1536)) AS distance
FROM <some_table>
ORDER BY distance asc nulls last
LIMIT 100
```
