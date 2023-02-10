# Du Fitness

Du Fitness is a calorie calculator and tracker web application built using Django.

## Video Demonstration
https://youtu.be/2---3t9ClXI

## Distinctiveness and Complexity

Du Fitness uses an external Nutrition Analysis API by EDAMAM to calculate calories, carbohydrate, fat and protein content from user input. The information is fetched using Javascript and displayed to the user without a page reload. 

Du Fitness features a set daily calories intake for every user. Users can calculate recommended daily calories intake using their gender, age, height, weight and activeness as inputs and calculated using the Harris-Benedict formula. Users can also choose to set a custom daily calorie intake. This calorie intake will be displayed on the index page as a progress bar. 

Du Fitness allows users to log their consumed calories by inputting the name and quantity of the food and using the EDAMAM API to calculate the respective calories. Users can also choose to log custom consumed calories by inputting the name, quantity and calories of the consumed food. This change will be reflected in the daily calories progress bar. The progress bar fills up as the user logs their consumed calories and displays a message if the user has exceeded their set daily calorie intake.

## Installation

```bash
pip install Django
```

## Usage
```bash
cd calorie
```

To migrate models
```python
python manage.py makemigrations calorie
```

```python
python manage.py migrate
```

To run server
```python
python manage.py runserver
```

## Files
- views.py
    - Contains backend functions and handles web requests such as "GET", "POST" and "PUT" from Javascript fetch requests

- models.py
    - Contains 3 Models: 
        - User: Contains username, password and set daily calorie intake for each user
        - Food: Contains name, quantity, calories and date which the food is logged for each user
        - Calories: Contains calories and date to track daily calorie intake for each user

- urls.py
    - "": Default page
    - "login": Login page
    - "logout": Logs out user
    - "register": Registers new users
    - "profile": Displays user's profile and allows users to set daily calorie intake
    - "custom_calories": Logs user's inputted calories
    - "calculated_calories": Calculates calories by sending fetch request to EDAMAM API    and logs calculated calories
    - "change_password": Allows users to change password with authentication of old password

- admin.py
    - Contains User, Food and Calories models to allow for changes on Django's admin site

- templates
    - layout.html: Contains navigation bar and allows other .html files to extend from it
    - index.html: Default page, contains daily calories progress bar, logging calculated calories or custom calories form and calories calculator
    - profile.html: Allows user's to set daily calorie intake
    - login.html: Allows users to log in
    - register.html: Allows new users to register
    - change_password.html: Allows users to change password

- static
    - calorie.js: Frontend Javascript to manipulate DOM without page reload by adding event listeners and sending fetch requests to backend and external API