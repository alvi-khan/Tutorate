package com.example.tutorate.controller;

import com.example.tutorate.model.*;
import com.example.tutorate.repository.RatingRepository;
import com.example.tutorate.repository.TutorRepository;
import com.example.tutorate.repository.UserRepository;
import com.example.tutorate.service.RatingService;
import com.example.tutorate.service.TutorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600, allowCredentials = "true")
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
    @Autowired
    private RatingRepository ratingRepository;

    @RequestMapping(value = "/add", method = RequestMethod.POST, consumes = {"multipart/form-data"})
    public User add(@RequestPart("tutor") Tutor tutor, @RequestPart(value = "image", required = false) MultipartFile image, HttpServletRequest request) {
        String username = (String) request.getSession().getAttribute("User");
        User user = userRepository.findByUsername(username);
        user.setRole(Role.tutor);

        String imagePath = tutorService.saveImage(image, user.getId());
        tutor.setImage(imagePath);

        user.setTutor(tutor);
        userRepository.save(user);
        return user;
    }
  
    @PostMapping("/getTutors")
    public List<Tutor> getTutors(@RequestParam("searchTerm") String searchTerm, @RequestBody SearchParams searchParams, HttpServletRequest request) {
        return tutorService.getTutors(searchTerm, searchParams);
    }
    
    @PostMapping("/update")
    public Tutor updatetutor(@RequestBody Tutor tutor , HttpServletRequest request) {
        HttpSession session=request.getSession();

        User user=userRepository.findByUsername((String) session.getAttribute("User"));
        /*int id = (int) request.getSession().getAttribute("Session id");*/
        //System.out.println(user.getTutor().getId());
        /*System.out.println(id);*/
        Tutor updateTutor = tutorRepository.findByName(user.getTutor().getName());
        updateTutor.setName(tutor.getName());
        updateTutor.setLocation(tutor.getLocation());
        updateTutor.setPhone(tutor.getPhone());
        //tutorService.saveTutor(tutor);
        tutorRepository.save(updateTutor);
        return null;
    }
    
     @DeleteMapping("/delete")
    public ResponseEntity<String> deleteTutor(@RequestBody Tutor tutor , HttpServletRequest request){
        HttpSession session=request.getSession();

        User user=userRepository.findByUsername((String) session.getAttribute("User"));
        Tutor deleteTutor = tutorRepository.findByName(user.getTutor().getName());
        int id = deleteTutor.getId();

        System.out.println(id);
        tutorService.deleteById(id);
        return null;
        //TutorServiceImpl.deleteById(deleteTutor.getId());
    }

    /*Get homepage showing all the tutors available, from this information we choose which
    info to show in front end(clickable links)
    * */
    @GetMapping("/home")
    public List<Tutor>HomePage(HttpServletRequest request){
        return tutorRepository.findAll();
    }
    /*
    * Provides detail of user logged in
    * user type can be distinguished according to role of logged user
    * user can be student type or tutor type
    * I've used enum to identify role
    * */
    @GetMapping("/profile")
    public Tutor getProfileOfUser(HttpServletRequest request){
        if(tutorService.sessionCheck(request)==false)
            return null;
            HttpSession session=request.getSession();
            int userId= (int) session.getAttribute("Session id");
//            int role= (int) session.getAttribute("Session role");
//            if(role==Role.tutor.ordinal())
//            {
//                Tutor user=tutorRepository.findById(userId);
//                return user;
//            }
            return null;
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
}
