import ReactModal from "react-modal";
import React, {useState} from "react";
import {Subjects} from "../searchBar/Subjects";
import {Grades} from "../searchBar/Grades";
import {Location} from "./Location";
import "../../stylesheets/TutorProfileForm.css";
import {useStateContext} from "../../contexts/StateContextProvider";
import Grid from "@mui/material/Grid";
import TextField from '@mui/material/TextField';
import {useHistory} from "react-router-dom";
import {ImageUpload} from "./ImageUpload";

export const TutorProfileForm = (props) => {
    const {setUser} = useStateContext();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [grades, setGrades] = useState([]);
    const [wage, setWage] = useState(0);
    const [image, setImage] = useState(null);
    const history = useHistory();

    const handleClose = () => {
        setImage(null);
        props.onHide();
    }

    const createProfile = async (event) => {
        event.preventDefault();

        const jsonData = JSON.stringify({name, location, phone, grades, subjects, "min_wage": wage});
        const formData = new FormData();
        formData.append("image", image);
        formData.append("tutor", new Blob([jsonData], {type: 'application/json'}));

        handleClose();
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/tutor/add`, {
            method: 'POST',
            credentials: 'include',
            body: formData,
        });
        const modifiedUser = await(res.json());
        setUser(modifiedUser);
        localStorage.setItem('user', JSON.stringify(modifiedUser));
        if (modifiedUser.tutor != null) history.push("/" + modifiedUser.tutor.id);
    }

    return (
        <ReactModal
            isOpen={props.show}
            onRequestClose={handleClose}
            className="TutorProfileForm"
            overlayClassName="TutorProfileFormOverlay"
        >
            <h3 className="fs-2 heading text-center">Create a Tutor Profile</h3>
            <form onSubmit={createProfile} className="optionsContainer">
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={6}>
                        <ImageUpload image={image} setImage={setImage} imageLink={""}/>
                    </Grid>
                    <Grid item xs={6}>
                        <Grid container spacing={4}>
                            <Grid item xs={12}>
                                <TextField fullWidth required name="name" label="Name"
                                           onChange={(event) => setName(event.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth name="phone" label="Phone" type="number"
                                           onChange={(event) => setPhone(event.target.value)}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6} className="d-inline-flex">
                        <Location allowNewValues={true} onLocationChange={setLocation} defaultLocation={""}/>
                    </Grid>
                    <Grid item xs={6} className="d-inline-flex">
                        <TextField
                            fullWidth name="wage" label="Wages" type="number"
                            onChange={(event) => setWage(event.target.value)}
                        />
                    </Grid>
                    <Grid item xs={6} className="d-inline-flex">
                        <Subjects required allowNewValues={true} subjects={[]} onSubjectChange={setSubjects} />
                    </Grid>
                    <Grid item xs={6} className="d-inline-flex">
                        <Grades required allowNewValues={true} grades={[]} onGradeChange={setGrades} />
                    </Grid>
                </Grid>
                <div className="d-inline-flex mx-auto mt-3">
                    <button className="button" type="submit">Submit</button>
                    <button className="button" type="button" onClick={handleClose}>Cancel</button>
                </div>
            </form>
        </ReactModal>
    );
}