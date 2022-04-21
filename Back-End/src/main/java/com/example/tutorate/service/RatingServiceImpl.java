package com.example.tutorate.service;


import com.example.tutorate.model.Tutor;
import com.example.tutorate.model.TutorRating;
import com.example.tutorate.model.User;
import com.example.tutorate.repository.RatingRepository;
import com.example.tutorate.repository.TutorRepository;
import com.example.tutorate.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;

@Service
public class RatingServiceImpl implements RatingService{

@Autowired
    RatingRepository ratingRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TutorRepository tutorRepository;

    @Override
    public boolean findRated(int userId, int TutorId) {

        for(TutorRating ratingKey:ratingRepository.findAll()){
            User user = ratingKey.getUser();
            Tutor tutor = ratingKey.getTutor();
            if(user.getId() == userId && tutor.getId() == TutorId)
                return true;
        }
        return false;
    }

    public void storeRating(int tutorId, TutorRating tutorRating, HttpServletRequest request) {
        HttpSession session = request.getSession();
        User user = userRepository.findByUsername((String) session.getAttribute("User"));

        if(session.getAttribute("User") != null){
            Tutor tutor = tutorRepository.findById(tutorId);
            tutorRating.setUser(user);
            tutorRating.setTutor(tutor);
            tutorRating.calculateRate();
            ratingRepository.save(tutorRating);

            tutor.setAverageRating(calculateAverageRating(tutorId));
            tutor.setRatingCount(tutor.getRatingCount() + 1);
            tutorRepository.save(tutor);
        }
    }

    public float calculateAverageRating(int id) {
        return   ratingRepository.getAverageRating(id);
    }

    public List<TutorRating> getReviews(int tutorId) {

        return ratingRepository.getReviewsById(tutorId);
    }

}
