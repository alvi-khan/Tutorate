import React, {useEffect, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import { useStateContext } from '../contexts/StateContextProvider';
import { Loading } from './Loading';
import {Chip, Rating} from "@mui/material";
import "../stylesheets/Results.css"

export const Results = () => {
  const { searchTerm, setSearchTerm, defaultParams, searchParams, setSearchParams} = useStateContext();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const getResults = async () => {
    setLoading(true);
    const res = await fetch(`${process.env.REACT_APP_BASE_URL}/tutor/getTutors?searchTerm=${searchTerm}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(searchParams),
    });
    setResults(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    getResults();
  }, [searchTerm, searchParams, location.pathname]);

  if (loading) return <Loading />;

  return (
      <React.Fragment>
        {results.length !== 0 &&
            <div className="sm:px-10 flex flex-wrap justify-content-center">
              {results?.map((result, index) => (
                  <React.Fragment>
                    <div key={index} className="container w-full" style={{margin: 5, width: 380}}>
                      <div className="card mt-3 mb-3 resultBorderRadius">
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-4 d-flex">
                              <img src={result.image === null ? "./profile.png" : `${process.env.REACT_APP_BASE_URL}${result.image}`}
                                   className="m-auto img-fluid rounded-circle" width="128" height="128" alt=""/>
                            </div>
                            <div className="col-md-8">
                              <Link to={"/" + result.id}>
                                <p className="mb-2 fw-bold fs-4">{result.name}</p>
                              </Link>
                              <Rating value={result.averageRating} readOnly precision={0.2}/>
                              <br/>
                              <p className="mb-2" style={{cursor: "pointer"}} onClick={() => {
                                setSearchTerm(result.location);
                                setSearchParams({...defaultParams});
                              }}><i className="bi bi-geo-alt"/>&nbsp;{result.location}</p>
                              {result.subjects?.map((subject) => {
                                return <Chip className="m-1" label={subject} onClick={() => {
                                  setSearchParams({...defaultParams, subjects: [subject]})
                                }}/>
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
              ))}
            </div>
        }
        {results.length === 0 &&
            <div className="flex justify-center items-center">
              <p className="m-10 text-gray-700" style={{fontSize: "20px"}}>No results found.</p>
            </div>
        }
      </React.Fragment>
  );
};
