package com.example.tutorate.service;

import com.example.tutorate.model.TutorRating;
import javax.servlet.http.HttpServletRequest;
import java.util.List;

public interface RatingService {
     void storeRating(int tutorId, TutorRating tutorRating, HttpServletRequest request);
     float calculateAverageRating(int id);
     List<TutorRating> getReviews(int tutorId);
}
