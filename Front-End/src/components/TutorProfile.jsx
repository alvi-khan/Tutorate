import React, {useState, useEffect} from 'react';
import { useParams, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {RateForm} from "./RateForm";
import "../stylesheets/TutorProfile.css";
import {useStateContext} from "../contexts/StateContextProvider";
import {ProfileDialog} from "./ProfileDialog";
import {Chip, Rating} from "@mui/material";
import {Reviews} from "./TutorReviews";

export const TutorProfile = () => {
    let { id } = useParams();
    const {user, setSearchTerm, setSearchParams, defaultParams} = useStateContext();
    const [tutor, setTutor] = useState({});
    const [image, setImage] = useState('/profile.png')
    const [formShown, setFormShown] = useState(false);
    const [profileDialogShow, setProfileDialogShow] = useState(false);
    const [refetch, setRefetch] = useState(false);

    const getTutor = async () => {
        const res = await fetch(`http://localhost:8080/tutor/${id}`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
        });
        setTutor(await res.json());
    }

    const handleRateFormClose = () => {
        setFormShown(false);
        setRefetch(!refetch);
    }

    useEffect(async () => {
        await getTutor();
    }, [id])

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
        else if (tutor.user) {
            return (
                <React.Fragment>
                    <button className="button mx-auto mt-4" type="submit"
                            onClick={() => {setFormShown(true)}}>
                        <i className="icon bi bi-pencil-square" />
                        &nbsp;Write a Review
                    </button>
                    <Link to={{pathname: "/chats", state: {receiver: tutor.user.username}}}>
                        <button className="button mx-auto mt-4" type="submit">
                            <i className="icon bi bi-pencil-square" />
                            &nbsp;Send Message
                        </button>
                    </Link>
                    <RateForm show={formShown} onHide={handleRateFormClose} tutor_id={id}/>
                </React.Fragment>
            );
        }
    }

    return (
        <div key={id} className="mt-10 container TutorProfile">
            <div className="row">
                <div className="card ml-10 col-xl-3 bg-transparent border-0">
                    <div className="card-body bg-white">
                        <img src={tutor.image === null ? "./profile.png" : "http://localhost:8080" + tutor.image}
                             className="mx-auto img-fluid rounded-circle mb-2" width="128" height="128" alt=""/>
                        <h4 className="mb-3 fw-bold fs-4 text-center">{tutor.name}</h4>
                        <Rating key={tutor.id} value={tutor.averageRating} readOnly precision={0.2}/>
                        <Link to="/">
                            <p className="mb-2" onClick={() => {
                                setSearchTerm(tutor.location);
                                setSearchParams({...defaultParams});
                            }}><i className="bi bi-geo-alt"/>&nbsp;{tutor.location}</p>
                        </Link>
                        <p className="mb-2"><i className="bi bi-telephone"/>&nbsp;{tutor.phone}</p>
                        {tutor.grades?.map((grade) => {
                            return <Link to="/">
                                <Chip className="m-1" label={grade} onClick={() => {
                                    setSearchParams({...defaultParams, grades: [grade]});
                                }}/>
                            </Link>
                        })}
                        {tutor.subjects?.map((subject) => {
                            return <Link to="/">
                                <Chip className="m-1" label={subject} onClick={() => {
                                    setSearchParams({...defaultParams, subjects: [subject]})
                                }}/>
                            </Link>
                        })}
                        <p className="mb-2"><i className="bi bi-cash-stack"/>&nbsp;BDT {tutor.min_wage}</p>
                    </div>
                    <div className="d-inline-flex">
                        {getButton()}
                    </div>
                </div>
                <Reviews refetch={refetch} id={id}/>
            </div>
        </div>
    );
}