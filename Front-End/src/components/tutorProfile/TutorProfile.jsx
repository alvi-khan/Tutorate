import React, {useState, useEffect} from 'react';
import { useParams, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {RateForm} from "./RateForm";
import "../../stylesheets/TutorProfile.css";
import {useStateContext} from "../../contexts/StateContextProvider";
import {ProfileDialog} from "../ProfileDialog";
import {Chip, Grid, Rating} from "@mui/material";
import {Reviews} from "./TutorReviews";
import { useChatContext } from '../../contexts/ChatContextProvider';

export const TutorProfile = () => {
    let { id } = useParams();
    const {user, setSearchTerm, setSearchParams, defaultParams} = useStateContext();
    const [tutor, setTutor] = useState({});
    const [formShown, setFormShown] = useState(false);
    const [profileDialogShow, setProfileDialogShow] = useState(false);
    const [refetch, setRefetch] = useState(false);
    const {setReceiver} = useChatContext();

    const getTutor = async () => {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/tutor/${id}`, {
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
    }, [id, user, refetch])

    const getButton = () => {
        if (user.tutor !== undefined && user.tutor !== null && user.tutor.id == id)  return;
        if (user.username === undefined) {
            return (
                <React.Fragment>
                    <button className="button mx-auto mt-4" type="submit"
                            onClick={() => {setProfileDialogShow(true)}}>
                        <i className="icon bi bi-person-fill mr-1" />
                        &nbsp;Login to Review
                    </button>
                    <ProfileDialog show={profileDialogShow} onHide={() => {setProfileDialogShow(false)}}/>
                </React.Fragment>
            );
        }
        else if (tutor.username) {
            return (
                <React.Fragment>
                    <button className="button mt-4" type="submit"
                            onClick={() => {setFormShown(true)}}>
                        <i className="icon bi bi-pencil mr-1" />
                        &nbsp;Write a Review
                    </button>
                    <Link to={{pathname: "/chats"}}>
                        <button className="button mt-4" type="submit" onClick={() => setReceiver(tutor)}>
                            <i className="icon bi bi-chat-dots mr-1" />
                            &nbsp;Send Message
                        </button>
                    </Link>
                    <RateForm show={formShown} onHide={handleRateFormClose} tutor_id={id}/>
                </React.Fragment>
            );
        }
    }

    return (
        <Grid container className="mt-10 container TutorProfile">
            <Grid item xs={5} className="card ml-10 bg-transparent border-0">
                <Grid container className="ml-5">
                    <Grid item xs={12} className="card-body bg-white">
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Grid container>
                                    <Grid item xs={4} className="p-3">
                                        <img src={tutor.image === null ? "./profile.png" : `${process.env.REACT_APP_BASE_URL}${tutor.image}`}
                                             className="img-fluid rounded-circle" alt=""/>
                                    </Grid>
                                    <Grid item xs={8} className="pl-5">
                                        <Grid container>
                                            <Grid item xs={12}>
                                                <h4 className="mb-1 fw-bold fs-3">{tutor.name}</h4>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Grid container alignItems="center" justifyContent="center">
                                                    <Grid item xs={8}>
                                                        <Rating className="mt-2" key={tutor.id} value={tutor.averageRating} readOnly precision={0.2} style={{fontSize: 30}}/>
                                                    </Grid>
                                                    <Grid item xs={4}>
                                                        <h6 className="ratingCount">{tutor.ratingCount} ratings</h6>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <p className="mb-2 mt-2" onClick={() => {
                                                    setSearchTerm(tutor.location);
                                                    setSearchParams({...defaultParams});
                                                }}><i className="bi bi-geo-alt"/>&nbsp;{tutor.location}</p>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <p className="mb-2"><i className="bi bi-telephone"/>&nbsp;{tutor.phone}</p>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <p className="mb-2"><i className="bi bi-cash-stack"/>&nbsp;BDT {tutor.min_wage}</p>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                {tutor.subjects?.map((subject) => {
                                    return <Link to="/">
                                        <Chip className="m-1" label={subject} onClick={() => {
                                            setSearchParams({...defaultParams, subjects: [subject]})
                                        }}/>
                                    </Link>
                                })}
                            </Grid>
                            <Grid item xs={12}>
                                {tutor.grades?.map((grade) => {
                                    return <Link to="/">
                                        <Chip className="m-1" label={grade} onClick={() => {
                                            setSearchParams({...defaultParams, grades: [grade]});
                                        }}/>
                                    </Link>
                                })}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} className="d-flex justify-content-center">
                        {getButton()}
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={7}>
                <Reviews refetch={refetch} id={id}/>
            </Grid>
        </Grid>
    );
}