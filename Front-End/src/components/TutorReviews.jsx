import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {Chip, Rating} from "@mui/material";

export const Reviews = (props) => {
    const [reviews, setReviews] = useState([]);

    const getReviews = async () => {
        const res = await fetch(`http://localhost:8080/tutor/review?tutorId=${props.id}`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
        });

        const data = await res.json();
        setReviews(data);
    }

    useEffect(async () => {
        await getReviews();
    }, [])

    return (
        <div className="ml-5 p-0 col-xl-8 flex flex-wrap"
             style={{maxHeight: window.innerHeight * 0.75, overflowY: "scroll", overflowX: "hidden"}}>
            <React.Fragment>
                {reviews?.map((review, index) => (
                <div className="container w-100">
                    <div className="card mt-3 bg-transparent border-0">
                        <div className="card-body bg-white">
                            <p className="mb-2 fw-bold fs-4">Review# {review.user.id}</p>
                            <Rating value={review.rating} precision={0.2} key={index} readOnly/>
                            <br/>
                            <p className="mb-2">{review.review}</p>
                        </div>
                    </div>
                </div>
                    ))}
            </React.Fragment>
        </div>
    );
}