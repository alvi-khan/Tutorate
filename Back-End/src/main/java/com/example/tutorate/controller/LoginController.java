package com.example.tutorate.controller;

import com.example.tutorate.repository.UserRepository;
import com.example.tutorate.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import com.example.tutorate.model.User;

@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/user")
public class LoginController {
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/checkUser")
    public boolean checkUser(@RequestBody User user) {
        return userService.userExists(user.getUsername());
    }

    @PostMapping("/login")
    public User login (@RequestBody User user, HttpServletRequest request) {
        HttpSession session = request.getSession();
        if(userService.authenticate(user.getUsername(), user.getPassword())) {
            session.setAttribute("User", user.getUsername());
            return userRepository.findByUsername(user.getUsername());
        }
        else  {
            User invalid = new User();
            invalid.setPassword("invalid");
            return invalid; }
    }

    @PostMapping("/register")
    public User register (@RequestBody User user, HttpServletRequest request) {
        HttpSession session = request.getSession();
        session.setAttribute("User", user.getUsername());
        return userService.addNewUser(user);
    }

 
    @GetMapping("/logout")
    public void logout (HttpServletRequest request) {
        HttpSession session = request.getSession();
        session.invalidate();
    }

    @GetMapping("/checkSession")
    public boolean checkSessionByUsername(String username, HttpServletRequest request){
        if(request.getSession().getAttribute("User").equals(username))
            return true;
        else    return false;
    }
    
    @PostMapping("/update")
    public User update(@RequestBody User user, HttpServletRequest request) {
        String username = (String) request.getSession().getAttribute("User");
        User update = userRepository.findByUsername(username);
        update.setUsername(user.getUsername());
        update.setPassword(user.getPassword());
        update.setRole(user.getRole());
        //tutorService.saveTutor(tutor);
        userRepository.save(update);
        return update;
    }
     /*@DeleteMapping("/delete")
        public ResponseEntity<String> deleteTutor(@RequestBody User user , HttpServletRequest request){
            HttpSession session=request.getSession();

            User user=userRepository.findByUsername((String) session.getAttribute("User"));
            Userr deleteUser = tutorRepository.findByName(user.getUserr().getName());
            int id = deleteUser.getId();

            System.out.println(id);
            UserService.deleteById(id);
            return null;
            //UserServiceImpl.deleteById(deleteUserr.getId());
       }
    }*/
}
 
