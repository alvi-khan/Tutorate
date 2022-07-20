import React, {useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import { Search } from './searchBar/Search';
import { ProfileBar } from './ProfileBar';
import '../stylesheets/EditProfileButton.css';
import {useStateContext} from "../contexts/StateContextProvider";
import {EditTutorProfileForm} from "./tutorProfile/EditTutorProfileForm";

export const Navbar = () => {
    const {user} = useStateContext();
    const location = useLocation();
    const [formShown, setFormShown] = useState(false);
    const { setSearchTerm, defaultParams, setSearchParams} = useStateContext();

    const getSearchBar = () => {
        if (location.pathname === "/")
            return <Search/>
        else    return <React.Fragment/>
    }

    const getEditProfileButton = () => {
        if(user.tutor !== null && user.tutor !== undefined && location.pathname === "/" + user.tutor.id) {
            return (
                <div>
                    <button
                        className="editProfileButton"
                        onClick={() => {setFormShown(true)}}>
                        <i className="icon bi bi-pencil-square"></i>
                        Edit Profile
                    </button>
                    <EditTutorProfileForm show={formShown} onHide={() => setFormShown(false)}/>
                </div>);
        }
    }

    const clearSearch = () => {
        setSearchTerm('');
        setSearchParams({...defaultParams});
    }

    return (
        <div className="py-4 pl-4 pr-5 mx-2 flex sm:justify-between border-b border-gray-200 ">
            <Link className="my-auto" to="/" onClick={() => clearSearch()}>
                <p className="text-2xl fs-4 font-bold text-gray-700 py-1 px-2 rounded">
                    TutoRate
                    <i className="bi bi-mortarboard-fill px-1"></i>
                </p>
            </Link>
            {getSearchBar()}
            <div className="d-inline-flex">
                {getEditProfileButton()}
                <ProfileBar/>
            </div>
        </div>
    );
}
