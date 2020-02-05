import React from 'react'
import { connectSearchBox } from 'react-instantsearch-dom'

export default connectSearchBox(({ currentRefinement, isSearchStalled, refine }) => (
  <form noValidate action="" role="search" className="w-full md:w-4/12 lg:w-4/12">
    <input
      type="search"
      value={currentRefinement}
      className="bg-gray-200 border-gray-200 rounded border-2 py-2 px-4 w-full focus:bg-white focus:outline-none focus:border-blue-700"
      onChange={event => refine(event.currentTarget.value)}
      placeholder="Search for questions here…"
    />
    {/* <button onClick={() => refine('')}>Reset query</button>
    {isSearchStalled ? 'My search is stalled' : ''} */}
  </form>
))
