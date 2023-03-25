import ReactModal from "react-modal";
import React, {useState} from "react";
import "../../stylesheets/RateForm.css";
import Grid from "@mui/material/Grid";
import {Ranking} from "../searchBar/Ranking";
import {TextField} from "@mui/material";


export const RateForm = (props) => {
    const [patience, setPatience] = useState(0);
    const [punctuality, setPunctuality] = useState(0);
    const [effectiveness, setEffectiveness] = useState(0);
    const [clarity, setClarity] = useState(0);
    const [review, setReview] = useState("");

    const handleClose = () => {
        setPatience(0);
        setPunctuality(0);
        setEffectiveness(0);
        setClarity(0);
        props.onHide();
    }

    const rateTutor = async (event) => {
        const rateParams = {effectiveness, clarity, patience, punctuality, review};
        event.preventDefault();
        handleClose();
        await fetch(`${process.env.REACT_APP_BASE_URL}/tutor/rate?tutorId=${props.tutor_id}`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rateParams),
        });
    }

    return (
        <ReactModal
            isOpen={props.show}
            onRequestClose={handleClose}
            className="RateForm"
            overlayClassName="RateFormOverlay"
        >
            <h3 className="fs-4 heading">Review</h3>
            <form onSubmit={rateTutor} className="optionsContainer">
                <Grid container spacing={4}>
                    <Grid item xs={2} className="d-inline-flex">
                        <p>Punctuality:</p>
                    </Grid>
                    <Grid item xs={4} className="d-inline-flex">
                        <Ranking rank={punctuality} onRankChange={(newValue) => setPunctuality(newValue)} />
                    </Grid>
                    <Grid item xs={2} className="d-inline-flex">
                        <p>Effectiveness:</p>
                    </Grid>
                    <Grid item xs={4} className="d-inline-flex">
                        <Ranking rank={effectiveness} onRankChange={(newValue) => setEffectiveness(newValue)} />
                    </Grid>
                    <Grid item xs={2} className="d-inline-flex">
                        <p>Clarity:</p>
                    </Grid>
                    <Grid item xs={4} className="d-inline-flex">
                        <Ranking rank={clarity} onRankChange={(newValue) => setClarity(newValue)} />
                    </Grid>
                    <Grid item xs={2} className="d-inline-flex">
                        <p>Patience:</p>
                    </Grid>
                    <Grid item xs={4} className="d-inline-flex">
                        <Ranking rank={patience} onRankChange={(newValue) => setPatience(newValue)} />
                    </Grid>
                    <Grid item xs={12}>
                        <p className="mb-2">Review:</p>
                        <TextField className="mb-4" variant="outlined" multiline rows={4} fullWidth
                                   onChange={(event) => setReview(event.target.value)}/>
                    </Grid>
                </Grid>
                <div className="d-inline-flex mx-auto my-0">
                    <button className="button" type="submit">Submit</button>
                    <button className="button" type="button" onClick={handleClose}>Cancel</button>
                </div>
            </form>
        </ReactModal>
    );
}