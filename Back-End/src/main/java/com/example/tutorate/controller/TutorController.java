package com.example.tutorate.controller;

import com.example.tutorate.model.*;
import com.example.tutorate.repository.TutorRepository;
import com.example.tutorate.repository.UserRepository;
import com.example.tutorate.service.RatingService;
import com.example.tutorate.service.TutorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/tutor")
public class TutorController {
    @Autowired
    private TutorService tutorService;
    @Autowired
    private RatingService ratingService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TutorRepository tutorRepository;

    @RequestMapping(value = "/add", method = RequestMethod.POST, consumes = {"multipart/form-data"})
    public User add(@RequestPart("tutor") Tutor tutor, @RequestPart(value = "image", required = false) MultipartFile image, HttpServletRequest request) {
        String username = (String) request.getSession().getAttribute("User");
        User user = userRepository.findByUsernameIgnoreCase(username);
        user.setRole(Role.tutor);

        String imagePath = tutorService.saveImage(image, user.getId());
        tutor.setImage(imagePath);
        tutor.setUsername(user.getUsername());
        user.setTutor(tutor);
        userRepository.save(user);
        return user;
    }
  
    @PostMapping("/getTutors")
    public List<Tutor> getTutors(@RequestParam("searchTerm") String searchTerm, @RequestBody SearchParams searchParams, HttpServletRequest request) {
        return tutorService.getTutors(searchTerm, searchParams);
    }

    @GetMapping("/{id}")
        public Tutor getTutorDetail(@PathVariable int id){
        return tutorRepository.findById(id);
    }

    @GetMapping("/getAllSubjects")
    public List<String> getAllSubjects() {
        return tutorRepository.getAllSubjects().stream().distinct().collect(Collectors.toList());
    }

    @GetMapping("/getAllLocations")
    public List<String> getAllLocation() {
        return tutorRepository.getAllLocations().stream().distinct().collect(Collectors.toList());
    }

    @GetMapping("/getAllGrades")
    public List<String> getAllGrades() {
        return tutorRepository.getAllGrades().stream().distinct().collect(Collectors.toList());
    }

    @PostMapping("/rate")
    public float rate(@RequestParam int tutorId, @RequestBody TutorRating rateParams, HttpServletRequest request) {
        ratingService.storeRating(tutorId, rateParams, request);
        Tutor tutor = tutorRepository.findById(tutorId);
        return tutor.getAverageRating();
    }

    @GetMapping("/review")
    public List<TutorRating> reviews(@RequestParam int tutorId) {
        return ratingService.getReviews(tutorId);
    }

    @RequestMapping(value = "/edit", method = RequestMethod.POST, consumes = {"multipart/form-data"})
    public User editProfile(@RequestPart("updatedTutor") Tutor updatedTutor, @RequestPart(value = "image", required = false) MultipartFile image, HttpServletRequest request) {
        String username = (String) request.getSession().getAttribute("User");
        User user = userRepository.findByUsernameIgnoreCase(username);

        String imagePath = tutorService.saveImage(image, user.getId());

        Tutor tutor = user.getTutor();
        if (imagePath != null)  tutor.setImage(imagePath);
        tutor.setName(updatedTutor.getName());
        tutor.setLocation(updatedTutor.getLocation());
        tutor.setPhone(updatedTutor.getPhone());
        tutor.setMin_wage(updatedTutor.getMin_wage());
        tutor.setGrades(updatedTutor.getGrades());
        tutor.setSubjects(updatedTutor.getSubjects());
        tutorRepository.save(tutor);

        user.setTutor(tutor);
        userRepository.save(user);

        return user;
    }
}

