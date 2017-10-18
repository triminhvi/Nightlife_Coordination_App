# Nightlife Coordination App

## Project Overview
This application is a full stack JavaScript nightlife coordination app that let the users view all bars in their area. The users can reserve a place and keep track if their friends are going to the same places. The application also ultilize the authenication by using PassportJS(Local & Facebook Strategy).

The logic of the appication is described below:

**As an authenticatied user**
- The user can view all bars in his/her area.
- The user can add himself/herselft to a bar to indicate he/she is going there tonight.
- The user can remove himself/herself from a bar if he/she no longer wants to go there.

**As an unauthenticated user**
- The user can view all bars in his/her area.

## How I built this application?
The application is divided into 3 parts:
  1. Backend:
      - **bcrypt** : hash user's password when sign up and compare hashed password when user login
      - **body-parser**: parse the input fields from forms
      - **connect-flash** : raise error messages when errors occur
      - **cookie-parser** : parse cookie
      - **ejs** : view engine
      - **express** : control routings
      - **express-session** : session
      - **helmet** : secure express app by setting various HTTP header
      - **mongoose** : database (User && Poll)
      - **morgan**: HTTP request logger middleware
      - **passport**: Authentication
      - **passport-local** Authentication for Local Strategy
      - **passport-facebook** Authentication for user with Facebook account.
      - **YELP API**: Bars Data.
  2. Frontend:
      - **Bootstrap**
  3. Map
      - **Google Map**







 



