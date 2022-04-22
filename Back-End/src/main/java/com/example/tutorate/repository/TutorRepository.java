package com.example.tutorate.repository;

import com.example.tutorate.model.Tutor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TutorRepository extends JpaRepository<Tutor, Integer> {
    Tutor findById(int id);

    @Query(value = "SELECT location FROM tutor", nativeQuery = true)
    List<String> getAllLocations();

    @Query(value = "SELECT subjects FROM tutor_subjects", nativeQuery = true)
    List<String> getAllSubjects();

    @Query(value = "SELECT grades FROM tutor_grades", nativeQuery = true)
    List<String> getAllGrades();

    List<Tutor> findAllByOrderByAverageRatingDesc();
}
