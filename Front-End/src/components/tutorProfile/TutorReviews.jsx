import React, {useEffect, useState} from "react";
import {Rating} from "@mui/material";

export const Reviews = (props) => {
    const [reviews, setReviews] = useState([]);

    const getReviews = async () => {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/tutor/review?tutorId=${props.id}`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
        });

        const data = await res.json();
        setReviews(data);
    }

    useEffect(async () => {
        await getReviews();
    }, [props.refetch])

    const reviewList = () => {
        if (reviews.length == 0)
            return (
                <p className="fs-2 mx-auto align-self-center text-center text-gray-400" style={{maxWidth: 350}}>
                    This tutor does not have any reviews yet.
                </p>
            );
        else
            return (
                reviews?.map((review, index) => (
                    <div className="container w-100">
                        <div className="card mt-3 bg-transparent border-0">
                            <div className="card-body bg-white py-3 px-4">
                                <p className="mb-2 fs-5">{review.user.username}</p>
                                <Rating value={review.rating} precision={0.2} key={index} readOnly/>
                                <br/>
                                <p className="fs-7 mb-2" style={{fontSize: 15}}>{review.review}</p>
                            </div>
                        </div>
                    </div>
                ))
            );
    }

    return (
        <React.Fragment>
            {reviews.length != 0 ? <p className="px-5 py-2 fs-3" style={{fontWeight: 600}}>Reviews</p> : <React.Fragment/>}
            <div className="ml-5 p-0 flex flex-wrap"
                 style={{ height: window.innerHeight * 0.69, maxHeight: window.innerHeight * 0.69, overflowY: "scroll", overflowX: "hidden"}}>
                <React.Fragment>
                    {reviewList()}
                </React.Fragment>
            </div>
        </React.Fragment>
    );
}