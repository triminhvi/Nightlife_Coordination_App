var express = require('express');
var router = express.Router();
var Place = require('../model/place.js');
var User = require('../model/user.js');

router.get('/*', isLoggedIn, function(req,res){
  Place.find({$or: [{reservedList: req.user.local.username}, {reservedList: req.user.facebook.email}]}, function(err, places){
    if(err){
      console.log(err);
      return;
    } 
    //console.log(places);
    res.render('profile', {title: "Profile",
                          message: req.flash('reserveMessage'),
                          places: places});
  });
});

router.get('/', isLoggedIn, function(req, res){
  Place.find({$or: [{reservedList: req.user.local.username}, {reservedList: req.user.facebook.email}]}, function(err, places){
    if(err){
      console.log(err);
      return;
    } 
    //console.log(places);
    res.render('profile', {title: "Profile",
                          message: req.flash('reserveMessage'),
                          places: places});
  });
  
});


//ADD RESERVATION
router.post('/addReservation/:zip_code/:name', isLoggedIn, function(req, res){
  var userEmail = req.user.local.username || req.user.facebook.email;
  var placeName = req.params.name;
  // -> Need to have zipcode 
  // -> Save to DB 
  // -> Redirect to search api place with zip code after make a reservation.
  var zipcode = req.params.zip_code;
  Place.findOne({"name": placeName}, function(err, place){
    if(err){
      console.log(err);
      return;
    }
    if(!place){// noplace for first time adding
      var newPlace = new Place();
      newPlace.name = placeName;
      newPlace.zip_code = zipcode;
      newPlace.reservedList.push(userEmail);
      newPlace.numgoing++;
      //Save place into place db
      newPlace.save(function(err){
        if(err){
          console.log(err);
        }
        //push user to reserved list
        console.log('New Place and New User added');
        req.flash('reserveMessage', userEmail + ' reserved');
        res.redirect('/search/api/?search=' + zipcode);
      })
    } else if(place){
      //Check if the user is already resersed
      if(place.reservedList.includes(userEmail)){ // User already reserved
        console.log('You already reversed');
        req.flash('reserveMessage', 'You already Reserved');
        res.redirect('/search/api/?search=' + zipcode);
      } else { // the current user has not reserved
        place.reservedList.push(userEmail);
        place.numgoing++;
        place.save(function(err){
          if(err){
            console.log(err);
          }
          req.flash('reserveMessage', userEmail + ' reserved');
          res.redirect('/search/api/?search=' + zipcode);
        })
      }
    }
  })
});

//REMOVE RESERVATION
router.post('/removeReservation/:zip_code/:name', isLoggedIn, function(req,res){
  var userEmail = req.user.local.username || req.user.facebook.email;
  var placeName = req.params.name;
  var zipcode = req.params.zip_code;
  Place.findOne({'name': placeName}, function(err, place){
    if(err){
      console.log(err);
      return;
    }
    // Case 1: This place is already in the reserved list
    if(place){
      //Check if the current user is already in the list
      // Case a: If user, remove the user from the list
      if(place.reservedList.includes(userEmail)){ //user is in the reservation list
        var index = place.reservedList.indexOf(userEmail);
        place.reservedList.splice(index, 1);
        place.numgoing--;
        console.log('User with ' + userEmail + ' has been removed from the list');
        place.save(function(err){
          if(err){
            console.log(err);
            return;
          }
          req.flash('reserveMessage', userEmail + ' has been removed from the list');
          res.redirect('/search/api/?search=' + zipcode);
        });
      } else { // user is not in the reservation list
        req.flash('reserveMessage', 'You have not reserved at this place!');
        res.redirect('/search/api/?search=' + zipcode);
      }
    } else { // Case 2: This place is not added in the reserved list
        req.flash('reserveMessage', 'You have not reserved at this Place. Click Reserve');
        res.redirect('/search/api/?search=' + zipcode);
    }
  })
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/auth/login');
}
module.exports = router;