package com.example.tutorate.repository;

import com.example.tutorate.model.TutorRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
    public interface RatingRepository extends JpaRepository<TutorRating, Integer> {
        public TutorRating findById(int id);

        @Query(value = "SELECT AVG (rating) from tutor_rating where fk_tutor= :id", nativeQuery = true)
        float  getAverageRating(int id);

        @Query(value = "SELECT * from tutor_rating where fk_tutor = :id AND review != ''", nativeQuery = true)
        List<TutorRating> getReviewsById(int id);

        @Query(value = "SELECT count(fk_user) from tutor_rating where fk_tutor = :id", nativeQuery = true)
        int getRatingCount(int id);

    }

