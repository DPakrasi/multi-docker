import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Fib: React.FC = () => {
  const [fibState, setFibState] = useState<{seenIndexes: {number: number}[], values: {[key: number]: number | string}, index: string}>({
    seenIndexes: [],
    values: {},
    index: ''
  });

  const fetchAppData = async () => {
    try {
      const [{ data: values }, { data: seenIndexes }] = await Promise.all([axios.get('/api/values/current'), axios.get('/api/values/all')]);
      const newFibState = {
        ...fibState,
        values,
        seenIndexes
      };
      setFibState(newFibState);
    } catch(ex) {
      console.log('fetchAppData failed');
    }
  }

  useEffect(() => {
    fetchAppData();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderValues = () => {
    const entries = [];
    for(let key in fibState.values) {
      const castedKey = parseInt(key);
      entries.push(
        <div key={castedKey}>
          For index {castedKey} I calculated {fibState.values[castedKey]}
        </div>
      )
    }

    return entries;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await axios.post('/api/values', {
      index: fibState.index
    });

    setFibState({
      ...fibState,
      index: ''
    });
  }

  return (
    <div>
      <form onSubmit={(event) => handleSubmit(event)}>
        <label>Enter your index: </label>
        <input 
          value={fibState.index} 
          onChange={(event) => setFibState({...fibState, index: event.target.value || ''})}
        />
        <button>Submit</button>
      </form>

      <h3>Indexes I have seen:</h3>
      {
        fibState.seenIndexes.map((eachIndex) => {
          return (<div key={eachIndex.number}>{eachIndex.number}</div>)
        })
      }

      <h3>Calculated Values:</h3>
      { renderValues() }
    </div>
  )
}

export default Fib;
