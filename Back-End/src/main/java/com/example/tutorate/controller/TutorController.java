package com.example.tutorate.controller;

import com.example.tutorate.model.*;
import com.example.tutorate.repository.RatingRepository;
import com.example.tutorate.repository.TutorRepository;
import com.example.tutorate.repository.UserRepository;
import com.example.tutorate.service.RatingService;
import com.example.tutorate.service.TutorService;
import com.example.tutorate.service.TutorServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Query;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.Iterator;
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

    @PostMapping("/add")
    public User add(@RequestBody Tutor tutor, HttpServletRequest request) {
        String username = (String) request.getSession().getAttribute("User");
        User user = userRepository.findByUsername(username);
        user.setRole(Role.tutor);
        user.setTutor(tutor);
        //tutorService.saveTutor(tutor);
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
        public Tutor getTutorDetail(@PathVariable Tutor id){

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

    @GetMapping("/rate")
    public float rate(@RequestParam Tutor tutor_id, @RequestParam ArrayList<Integer>list, HttpServletRequest request) {
        HttpSession session=request.getSession();
        
        User user=userRepository.findByUsername((String) session.getAttribute("User"));
        
       if(session.getAttribute("User")!=null){
           if (!ratingService.findRated(user.getId(), tutor_id)) {
               Tutor selected_tutor = tutorRepository.findById(tutor_id);

               if(user.getRole()!=Role.tutor) {
                   TutorRatingKey tutorRatingKey = new TutorRatingKey(user, selected_tutor, list);
                    tutorRatingKey.setRate(tutorRatingKey.calculateRate());
                    ratingRepository.save(tutorRatingKey);
                    //selected_tutor = ratingService.addRatingRecordTutor(selected_tutor, tutorRatingKey);
                    selected_tutor.setAverage_rating(tutorService.calculateAverageRating(tutor_id));
                    tutorRepository.save(selected_tutor);
                    return selected_tutor.getAverage_rating();
                }
                else return -2;
            }
       }
       else return -1;
       return 0;
    }
}
