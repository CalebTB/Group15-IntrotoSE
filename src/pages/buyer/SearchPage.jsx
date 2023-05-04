import React from 'react'
import { useLocation } from 'react-router-dom'

export function SearchResults() {
  const location = useLocation()
  const searchResults = location.state?.searchResults

  if (!searchResults) {
    return <div>No results found.</div>
  }

  return (
    <div>
      {searchResults.map((result) => (
        <div key={result.id}>
          <h2>{result.title}</h2>
          <p>{result.description}</p>
          <p>${result.price}</p>
        </div>
      ))}
    </div>
  )
}
