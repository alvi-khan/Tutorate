import ReactModal from "react-modal";
import React, {useEffect, useState} from "react";
import {useStateContext} from "../contexts/StateContextProvider";
import {useHistory} from "react-router-dom";
import Grid from "@mui/material/Grid";
import {ImageUpload} from "./ImageUpload";
import TextField from "@mui/material/TextField";
import {Location} from "./Location";
import {Subjects} from "./searchBar/Subjects";
import {Grades} from "./searchBar/Grades";

export const EditTutorProfileForm = (props) => {
    const {user, setUser} = useStateContext();
    const [name, setName] = useState(user.tutor.name);
    const [phone, setPhone] = useState(user.tutor.phone);
    const [location, setLocation] = useState(user.tutor.location);
    const [subjects, setSubjects] = useState(user.tutor.subjects);
    const [grades, setGrades] = useState(user.tutor.grades);
    const [wage, setWage] = useState(user.tutor.min_wage);
    const [image, setImage] = useState(null);
    const history = useHistory();

    const handleClose = () => {
        setImage(null);
        props.onHide();
    }

    const editProfile = async (event) => {
        event.preventDefault();

        const jsonData = JSON.stringify({name, location, phone, grades, subjects, "min_wage": wage});
        const formData = new FormData();
        formData.append("image", image);
        formData.append("updatedTutor", new Blob([jsonData], {type: 'application/json'}));

        handleClose();
        const res = await fetch(`http://localhost:8080/tutor/edit`, {
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
            <h3 className="fs-2 heading text-center">Edit Your Tutor Profile</h3>
            <form onSubmit={editProfile} className="optionsContainer">
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={6}>
                        <ImageUpload image={user.tutor.image === null ? image : undefined} setImage={setImage} imageLink={user.tutor.image === null ? "" : "http://localhost:8080" + user.tutor.image}/>
                    </Grid>
                    <Grid item xs={6}>
                        <Grid container spacing={4}>
                            <Grid item xs={12}>
                                <TextField fullWidth required name="name" label="Name" defaultValue={name}
                                           onChange={(event) => setName(event.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth name="phone" label="Phone" type="number" defaultValue={phone}
                                           onChange={(event) => setPhone(event.target.value)}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6} className="d-inline-flex">
                        <Location allowNewValues={true} onLocationChange={setLocation} defaultLocation={location}/>
                    </Grid>
                    <Grid item xs={6} className="d-inline-flex">
                        <TextField
                            fullWidth name="wage" label="Wages" type="number" defaultValue={wage}
                            onChange={(event) => setWage(event.target.value)}
                        />
                    </Grid>
                    <Grid item xs={6} className="d-inline-flex">
                        <Subjects required allowNewValues={true} onSubjectChange={setSubjects} subjects={subjects}/>
                    </Grid>
                    <Grid item xs={6} className="d-inline-flex">
                        <Grades required allowNewValues={true} grades={grades} onGradeChange={setGrades} />
                    </Grid>
                </Grid>
                <div className="d-inline-flex mx-auto mt-3">
                    <button className="button" type="submit">Save</button>
                    <button className="button" type="button" onClick={handleClose}>Cancel</button>
                </div>
            </form>
        </ReactModal>
    );
}