'use client';

import React, { useState, useEffect } from 'react';


export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([
    {
      "embedding": null,
      "name": "Notion",
      "latest_round": "Series C",
      "title": "Creative Lead, Web",
      "department": "Marketing",
      "listing_location": "New York, New York",
      //"listing_job_description": "(job description content for Notion)"
    },
    {
      "embedding": null,
      "name": "Candy",
      "latest_round": "",
      "title": "Staff Frontend Software Engineer",
      "department": "Technology",
      "listing_location": "New York, NY",
      //"listing_job_description": "(job description content for Candy)"
    },
    {
      "embedding": null,
      "name": "Cake",
      "latest_round": "Pre Seed",
      "title": "Senior Frontend Engineer / 資深前端工程師",
      "department": "Product",
      "listing_location": "Taipei",
      //"listing_job_description": "(job description content for Cake)"
    },
    {
      "embedding": null,
      "name": "10up",
      "latest_round": "",
      "title": "Associate Director of JavaScript Engineering",
      "department": "JavaScript Engineering",
      "listing_location": "Remote",
      //"listing_job_description": "(job description content for 10up)"
    },
    {
      "embedding": null,
      "name": "Privy",
      "latest_round": "Seed",
      "title": "Staff Fullstack Software Engineer",
      "department": "Engineering",
      "listing_location": "New York",
      //"listing_job_description": "(job description content for Privy)"
    },
    {
      "embedding": null,
      "name": "UpCodes",
      "latest_round": "Series A",
      "title": "Sr. Software Engineer",
      "department": "Engineering",
      "listing_location": "Remote",
      //"listing_job_description": "(job description content for UpCodes)"
    },
    {
      "embedding": null,
      "name": "Fruition",
      "latest_round": "",
      "title": "CI/CD - Site Reliability Engineer",
      "department": "",
      "listing_location": "Denver or Remote",
      //"listing_job_description": "(job description content for Fruition)"
    },
    {
      "embedding": null,
      "name": "Lattice",
      "latest_round": "",
      "title": "Software Engineer, Talent Suite",
      "department": "Engineering",
      "listing_location": "SF, NYC, Remote",
      //"listing_job_description": "(job description content for Lattice)"
    },
    {
      "embedding": null,
      "name": "Summer Health",
      "latest_round": "Series A",
      "title": "Staff Engineer, AI",
      "department": "Engineering",
      "listing_location": "New York Office",
      //"listing_job_description": "(job description content for Summer Health)"
    },
    {
      "embedding": null,
      "name": "Ketryx",
      "latest_round": "Series A",
      "title": "Senior Developer",
      "department": "Engineering",
      "listing_location": "Vienna, Austria",
      //"listing_job_description": "(job description content for Ketryx)"
    }
  ]);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Do Vector search in the frontend
    // Note: For a real application we would send an API call to perform
    // this search on the backend using Postgres Vector (PGVector) query
    function cosineSimilarity(vec1, vec2) {
      let dotProduct = 0;
      let mag1 = 0;
      let mag2 = 0;
      for (let i = 0; i < vec1.length; i++) {
        dotProduct += vec1[i] * vec2[i];
        mag1 += vec1[i] * vec1[i];
        mag2 += vec2[i] * vec2[i];
      }
      return dotProduct / (Math.sqrt(mag1) * Math.sqrt(mag2));
    }

    const searchVector = await fetch('/api/build-vector', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        searchTerm: searchTerm,
      }),
    });
    const data = await searchVector.json();



    console.log('SEARCH TERM: ', searchTerm)
    console.log('SEARCH VECTOR: ', data.result)


    const similarities = searchResults.map((result, index) => ({
      ...result,
      index,
      similarity: cosineSimilarity(data.result, result.embedding)
    }));

    similarities.sort((a, b) => b.similarity - a.similarity);

    setSearchResults(similarities);
  }

  const vectorizeAndStore = async () => {
    const res = await fetch('/api/build-vectors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobListings: searchResults,
      }),
    });
    const data = await res.json();

    setSearchResults(data.result)

    return data
  };

  return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">

        <button onClick={vectorizeAndStore} className="mb-8">Build Vectors</button>

        <div>
          <form
              onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleChange}
            />
            <button type="submit"> Search</button>
          </form>
          <div className="mt-8">
            {searchResults.map((jobListing, index) => (
                <div key={index} className="w-full h-64 object-cover">

                  <div>
                    <div>{jobListing.title}</div>
                    <div>{jobListing.name}</div>
                    <p>{`Latest Round: ${jobListing.latest_round}`}</p>
                    <p>{`Listing location: ${jobListing.listing_location}`}</p>
                    <p>{`Department: ${jobListing.department}`}</p>


                  </div>
                </div>
            ))}
          </div>
          <button>Setup</button>
        </div>


      </main>
  );
}
