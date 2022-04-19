import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {RateForm} from "./RateForm";
import "../stylesheets/TutorProfile.css";
import {useStateContext} from "../contexts/StateContextProvider";
import {ProfileDialog} from "./ProfileDialog";
import {Chip, Rating} from "@mui/material";
import {Reviews} from "./TutorReviews";

export const TutorProfile = () => {
    let { id } = useParams();
    const {user, setUser} = useStateContext();
    const [tutor, setTutor] = useState({});
    const [image, setImage] = useState('/profile.png')
    const [formShown, setFormShown] = useState(false);
    const [profileDialogShow, setProfileDialogShow] = useState(false);

    const getTutor = async () => {
        const res = await fetch(`http://localhost:8080/tutor/${id}`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
        });
        setTutor(await res.json());
    }

    useEffect(async () => {
        await getTutor();
    }, [])

    const getButton = () => {
        if (user.tutor !== undefined && user.tutor !== null && user.tutor.id == id)  return;
        if (user.username === undefined) {
            return (
                <React.Fragment>
                    <button className="button mx-auto mt-4" type="submit"
                            onClick={() => {setProfileDialogShow(true)}}>
                        <i className="icon bi bi-person-circle" />
                        &nbsp;Login to Review
                    </button>
                    <ProfileDialog show={profileDialogShow} onHide={() => {setProfileDialogShow(false)}}/>
                </React.Fragment>
            );
        }
        else {
            return (
                <React.Fragment>
                    <button className="button mx-auto mt-4" type="submit"
                            onClick={() => {setFormShown(true)}}>
                        <i className="icon bi bi-pencil-square" />
                        &nbsp;Write a Review
                    </button>
                    <RateForm show={formShown} onHide={() => setFormShown(false)} tutor_id={id}/>
                </React.Fragment>
            );
        }
    }

    return (
        <div className="mt-10 container TutorProfile">
            <div className="row">
                <div className="card ml-10 col-xl-3 bg-transparent border-0">
                    <div className="card-body bg-white">
                        <img src={tutor.image === null ? "./profile.png" : "http://localhost:8080" + tutor.image}
                             className="mx-auto img-fluid rounded-circle mb-2" width="128" height="128" alt=""/>
                        <h4 className="mb-3 fw-bold fs-4 text-center">{tutor.name}</h4>
                        <Rating value={tutor.average_rating} readOnly/>
                        <p className="mb-2"><i className="bi bi-geo-alt"/>&nbsp;{tutor.location}</p>
                        <p className="mb-2"><i className="bi bi-telephone"/>&nbsp;{tutor.phone}</p>
                        {tutor.grades?.map((grade) => {
                            return <Chip className="m-1" label={grade}/>
                        })}
                        {tutor.subjects?.map((subject) => {
                            return <Chip className="m-1" label={subject}/>
                        })}
                        <p className="mb-2"><i className="bi bi-cash-stack"/>&nbsp;BDT {tutor.min_wage}</p>
                    </div>
                    {getButton()};
                </div>
                <Reviews />
            </div>
        </div>
    );
}