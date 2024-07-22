'use client';

import React, { useState, useEffect } from 'react';
const jobListings = [
  {
    "name": "Notion",
    "latest_round": "Series C",
    "title": "Creative Lead, Web",
    "department": "Marketing",
    "listing_location": "New York, New York",
    //"listing_job_description": "(job description content for Notion)"
  },
  {
    "name": "Candy",
    "latest_round": "",
    "title": "Staff Frontend Software Engineer",
    "department": "Technology",
    "listing_location": "New York, NY",
    //"listing_job_description": "(job description content for Candy)"
  },
  {
    "name": "Cake",
    "latest_round": "Pre Seed",
    "title": "Senior Frontend Engineer / 資深前端工程師",
    "department": "Product",
    "listing_location": "Taipei",
    //"listing_job_description": "(job description content for Cake)"
  },
  {
    "name": "10up",
    "latest_round": "",
    "title": "Associate Director of JavaScript Engineering",
    "department": "JavaScript Engineering",
    "listing_location": "Remote",
    //"listing_job_description": "(job description content for 10up)"
  },
  {
    "name": "Privy",
    "latest_round": "Seed",
    "title": "Staff Fullstack Software Engineer",
    "department": "Engineering",
    "listing_location": "New York",
    //"listing_job_description": "(job description content for Privy)"
  },
  {
    "name": "UpCodes",
    "latest_round": "Series A",
    "title": "Sr. Software Engineer",
    "department": "Engineering",
    "listing_location": "Remote",
    //"listing_job_description": "(job description content for UpCodes)"
  },
  {
    "name": "Fruition",
    "latest_round": "",
    "title": "CI/CD - Site Reliability Engineer",
    "department": "",
    "listing_location": "Denver or Remote",
    //"listing_job_description": "(job description content for Fruition)"
  },
  {
    "name": "Lattice",
    "latest_round": "",
    "title": "Software Engineer, Talent Suite",
    "department": "Engineering",
    "listing_location": "SF, NYC, Remote",
    //"listing_job_description": "(job description content for Lattice)"
  },
  {
    "name": "Summer Health",
    "latest_round": "Series A",
    "title": "Staff Engineer, AI",
    "department": "Engineering",
    "listing_location": "New York Office",
    //"listing_job_description": "(job description content for Summer Health)"
  },
  {
    "name": "Ketryx",
    "latest_round": "Series A",
    "title": "Senior Developer",
    "department": "Engineering",
    "listing_location": "Vienna, Austria",
    //"listing_job_description": "(job description content for Ketryx)"
  }
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
  }

  const vectorizeAndStore = async () => {
    const res = await fetch('/api/build-vectors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobListings: jobListings,
      }),
    });
    const data = await res.json();
    return data
  };

  return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">

        <button onClick={vectorizeAndStore}>Build Vectors</button>


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
            {jobListings.map((jobListing, index) => (
                <div key={index} className="w-full h-64 object-cover">

                  <div>
                    <div>{jobListing.title}</div>
                    <div>{jobListing.name}</div>
                    <p>{`Latest Round: ${jobListing.latest_round}`}</p>
                    <p>{`Listing location: ${jobListing.latest_round}`}</p>
                    <p>{`Department: ${jobListing.latest_round}`}</p>


                  </div>
                </div>
            ))}
          </div>
          <button>Setup</button>
        </div>


      </main>
  );
}
