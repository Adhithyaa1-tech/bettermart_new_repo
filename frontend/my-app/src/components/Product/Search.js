import React, { useState } from 'react';
import './Search.css'
import { useNavigate } from 'react-router-dom';

const Search = () => {
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();

    const searchsubmitHandler = (e) => {
        e.preventDefault();
        if(keyword.trim()) {
            navigate(`/products/${keyword}`)
        }else{
            navigate(`/products`)
        }
    }
  return (
    <>
    <form className='searchBox' onSubmit={searchsubmitHandler}> 
    <input type= 'text' placeholder='search a product...' onChange={e => setKeyword(e.target.value)}/>

    <input type='submit' value= 'search'/>
    
    </form>
      
    </>
  )
}

export default Search
