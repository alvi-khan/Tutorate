import React, {useEffect, useState} from 'react';
import ReactModal from 'react-modal';
import { Subjects } from './Subjects';
import { useStateContext } from '../../contexts/StateContextProvider';
import { WageRange } from './WageRange';
import '../../stylesheets/AdvancedSearch.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Ranking} from "./Ranking";
import {Grades} from "./Grades";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

export const AdvancedSearch = (props) => {
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [wages, setWages] = useState([200, 2000]);
  const [rank, setRank] = useState(0);
  const { searchParams, setSearchParams } = useStateContext();

  const updateParams = () => {
    const newParams = { subjects, wages, rank, grades };
    setSearchParams(newParams);
    props.onHide();
  };

  return (
    <ReactModal
      isOpen={props.show}
      onRequestClose={props.onHide}
      className="AdvancedSearch"
      overlayClassName="AdvancedSearchOverlay"
    >
      <h3 className="fs-4 text-center title">Search Filters</h3>
      <div className="optionsContainer">
        <Grid container spacing={4}>
          <Grid item xs={2} className="d-inline-flex">
            <p>Cost:</p>
          </Grid>
          <Grid item xs={4} className="d-inline-flex">
            <WageRange wages={searchParams.wages} onWageChange={(newWages) => setWages(newWages)} />
          </Grid>
          <Grid item xs={2} className="d-inline-flex">
            <p>Rating:</p>
          </Grid>
          <Grid item xs={4} className="d-inline-flex">
            <Ranking rank={searchParams.rank} onRankChange={(newRank) => setRank(newRank)} />
          </Grid>
          <Grid item xs={6} className="d-inline-flex">
            <Subjects allowNewValues={false} subjects={searchParams.subjects} onSubjectChange={(newSubjects) => setSubjects(newSubjects)} />
          </Grid>
          <Grid item xs={6} className="d-inline-flex">
            <Grades allowNewValues={false} grades={searchParams.grades} onGradeChange={(newGrades) => setGrades(newGrades)} />
          </Grid>
        </Grid>
        <div className="d-inline-flex mx-auto mt-4">
          <button className="button" type="button" onClick={updateParams}>Search</button>
          <button className="button" type="button" onClick={props.onHide}>Cancel</button>
        </div>
      </div>
    </ReactModal>
  );
};
