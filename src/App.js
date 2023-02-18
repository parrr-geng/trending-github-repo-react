import './App.css';
import { useState, useEffect } from 'react';
import axios from "axios";
import starEmpty from "./assets/star_empty.png";
import starFull from "./assets/star_full.png";

function App() {
  const [allRepos, setAllRepos] = useState([]);
  const [displayedRepos, setDisplayedRepos] = useState([]);
  const [starredRepos, setStarredRepos] = useState([]);
  const [singleRepo, setSingleRepo] = useState({});


  useEffect(()=>{
    axios.get("https://api.github.com/search/repositories?q=created:%3E2017-01-10&sort=stars&order=desc")
    .then(response => {
      response.data.items.forEach(repo => repo._isStarred = false);
      setAllRepos(response.data.items);
      setDisplayedRepos(response.data.items);
    })
    .catch(error=>console.log(error))
  }, []);

  useEffect(()=>{  
    setStarredRepos(allRepos.filter(repo => repo._isStarred === true));
  }, [singleRepo, singleRepo._isStarred, allRepos, starredRepos]);


  const handleStar = (repoId) => {
    let foundRepo = allRepos.filter(repo => repo.id === repoId)[0];
    foundRepo._isStarred = foundRepo._isStarred === false ? true : false;
    setSingleRepo(foundRepo);
  }

  const handleLanguage = (language) => {
    let filteredRepos = [...allRepos].filter(repo=>repo.language === language);
    setDisplayedRepos(filteredRepos);
  }

  return (
    <body className='w-4/5 mx-auto'>

      <header className='mx-5 my-8 flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Trending GitHub Repositories</h1>
        <nav>
          <button 
            onClick={()=>setDisplayedRepos(allRepos)}
            className="inline-block mx-2 px-6 py-2 border-2 border-gray-800 text-gray-800 font-medium text-xs leading-tight uppercase rounded-full hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
          >
            All Repos
          </button>
          <button 
            onClick={()=>setDisplayedRepos(starredRepos)}
            className="inline-block mx-2 px-6 py-2 border-2 border-gray-800 text-gray-800 font-medium text-xs leading-tight uppercase rounded-full hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
          >
            Starred Repos
          </button>
          <a href="https://github.com/" target="_blank">
            <button
              className="inline-block mx-2 px-6 py-2 border-2 border-gray-800 text-gray-800 font-medium text-xs leading-tight uppercase rounded-full hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
            >
              GitHub
            </button>
          </a>
        </nav>
      </header>

      <main className='grid grid-cols-3 m-5 gap-5'>
        <section className='col-span-2 grid grid-cols-2 gap-5'>
          {displayedRepos
          .map(repo=>(
            <div key={repo.id} className="border border-gray-700 rounded-xl p-7 shadow-md flex flex-col content-between h-80 relative">
             
                <div className='flex justify-between items-center'>
                  <a href={repo["html_url"]} target="_blank"><h4 className='text-2xl font-bold'>{repo.name}</h4></a>
                  <button onClick={()=>handleStar(repo.id)}>
                    <img src={repo._isStarred ? starFull : starEmpty} alt="star icon" className="w-4"/>
                  </button>
                </div>

                <hr className='my-3'/>
                
                <p className='mb-4 overflow-auto'>{repo.description}</p>

                <div className='flex justify-between items-center absolute bottom-20 left-7'>
                  <div className='flex'>
                    <img src={repo.owner["avatar_url"]} className="w-6 rounded-full" />
                    <p className='px-2'>{repo.owner.login}</p>
                  </div>
                  <p> - {repo["stargazers_count"]} stars</p>       
                </div>

                {repo.language &&
                  <button 
                    className="bg-gray-200 text-black px-3 py-1 rounded-md inline-block mt-4 absolute bottom-6 left-7"
                    onClick={()=>handleLanguage(repo.language)}
                  >
                    {repo.language}
                  </button>
                }  
            </div>
          ))}
        </section>

        <section>
          {starredRepos.length === 0 ? 
           <p className='text-center mt-8 text-l'>-- Your starred repos will be displayed here --</p> :
           starredRepos
            .map(repo=>(
              <div key={repo.id} className="border bg-gray-700 text-white border-gray-700 rounded-xl p-7 shadow-md flex flex-col content-between h-80 relative mb-5">
              
                  <div className='flex justify-between items-center'>
                    <a href={repo["html_url"]} target="_blank"><h4 className='text-2xl font-bold'>{repo.name}</h4></a>
                    <button onClick={()=>handleStar(repo.id)}>
                      <img src={repo._isStarred ? starFull : starEmpty} alt="star icon" className="w-4"/>
                    </button>
                  </div>

                  <hr className='my-3'/>
                  
                  <p className='mb-4 overflow-auto'>{repo.description}</p>

                  <div className='flex flex-row items-center justify-between absolute bottom-20 left-7'>
                    <div className='flex'>
                      <img src={repo.owner["avatar_url"]} className="w-6 rounded-full" />
                      <p className='px-2'>{repo.owner.login}</p>
                    </div>

                    <p>{repo["stargazers_count"]} stars</p>       
                  </div>

                  {repo.language &&
                    <button 
                      className="bg-gray-100 text-black px-3 py-1 rounded-md inline-block mt-4 absolute bottom-6 left-7"
                      onClick={()=>handleLanguage(repo.language)}
                    >
                      {repo.language}
                    </button>
                  }  
              </div>
            ))}
        </section>
      </main>
    </body>
  );
}

export default App;
