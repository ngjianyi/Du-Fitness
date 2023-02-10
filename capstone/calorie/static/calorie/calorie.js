// Hides daily calories form
document.addEventListener('DOMContentLoaded', () => {

    document.querySelector('#calories-form').style.display = 'none';

    document.querySelector('#calories-form-button').onclick = () => {
        
        // Hides button and displays form
        document.querySelector('#calories-form-button').style.display = 'none';
        document.querySelector('#calories-form').style.display = 'flex';
    }
})


// Recommended calories form
document.addEventListener('DOMContentLoaded', () => {

    document.querySelector('#recommended-calories-form').onclick = () => {

        const gender = document.querySelector('#gender').value;
        const age = document.querySelector('#age').value;
        const height = document.querySelector('#height').value;
        const weight = document.querySelector('#weight').value;
        const activeness = document.querySelector('#activeness').value;

        let BMR = 0;
        if (gender === 'male') {
            BMR = 66.47 + (13.75 * weight) + (5.003 * height) - (6.755 * age);
        } else if (gender === 'female') {
            BMR = 655.1 + (9.563 * weight) + (1.850 * height) - (4.676 * age);
        }

        let AMR = 0;
        if (activeness === 'sedentary') {
            AMR = BMR * 1.2;
        } else if (activeness === 'light') {
            AMR = BMR * 1.375;
        } else if (activeness === 'moderate') {
            AMR = BMR * 1.55;
        } else if (activeness === 'active') {
            AMR = BMR * 1.725;
        } else if (activeness === 'very-active') {
            AMR = BMR * 1.9;
        }

        // Updates user's daily calories
        fetch(`/profile`, {
            method: 'PUT',
                headers: {
                    "X-CSRFToken": getCookie("csrftoken")
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    daily_calories: AMR.toFixed()
                })
        })

        // Display updated daily calories
        document.querySelector('#daily-calories').innerHTML = `<p class="lead">Your daily calories are set to ${AMR.toFixed()}</p>`;

        // Hides form and displays button
        document.querySelector('#calories-form').style.display = 'none';
        document.querySelector('#calories-form-button').style.display = 'inline'
    }
})

// Custom daily calories form
document.addEventListener('DOMContentLoaded', () => {

    document.querySelector('#custom-calories-form').onclick = () => {

        const calories = parseInt(document.querySelector('#custom-daily-calories').value);

        // Check if imput is a number
        if (!isNaN(calories)) {

            // Updates user's daily calories
            fetch(`/profile`, {
                method: 'PUT',
                    headers: {
                        "X-CSRFToken": getCookie("csrftoken")
                    },
                    credentials: 'same-origin',
                    body: JSON.stringify({
                        daily_calories: calories
                    })
            })

            // Display updated daily calories
            document.querySelector('#daily-calories').innerHTML = `<p class="lead">Your daily calories are set to ${calories}</p>`;

            // Clears input field
            document.querySelector('#custom-daily-calories').value = '';

            // Hides form and displays button
            document.querySelector('#calories-form').style.display = 'none';
            document.querySelector('#calories-form-button').style.display = 'inline';

            // Clear message
            document.querySelector('#calories-form-message').innerHTML = '';
        } else {
            // Input is not a number
            document.querySelector('#calories-form-message').innerHTML = 'Please key in a valid input.';
        }

    }
})


document.addEventListener('DOMContentLoaded', () => {

    // Calorie Calculator
    document.querySelector('#calculator-calories').onclick = () => {
        calorie();
    }
})


// Calorie Calculator
function calorie() {
    
    const APP_ID = '3b285604'
    const APP_KEY = 'd6df9e13620924ab9ca623a319cd69e6'
    const nutrition_type = 'cooking';
    const name = document.querySelector('#calculator-food-name').value;
    const quantity = document.querySelector('#calculator-food-quantity').value;
    
    // Buffering text
    document.querySelector('#calculator-ans').innerHTML = 'Calculating...';
    
    fetch (`https://api.edamam.com/api/nutrition-data?app_id=${APP_ID}&app_key=${APP_KEY}&nutrition-type=${nutrition_type}&ingr=${quantity}%20${name}`, {
        method: 'GET',
        headers: {
            "X-CSRFToken": getCookie("csrftoken")
        },
        credentials: 'same-origin',
    })
    .then(response => {
        if (!response.ok) {
            return Promise.reject(response)
        }
        return response.json()
    })
    .then(data => {

        const calories = data.calories;
        const carbohydrate = data.totalNutrients.CHOCDF['quantity'].toFixed();
        const fat = data.totalNutrients.FAT['quantity'].toFixed();
        const protein = data.totalNutrients.PROCNT['quantity'].toFixed();
        
        // Displays nutrients
        document.querySelector('#calculator-ans').innerHTML =
        `<p class="lead">${quantity} ${name}(s)</p>
        <ul class="list-group list-group-flush">
        <li class="list-group-item">Calories: ${calories}kcal</li>
        <li class="list-group-item">Carbohydrate: ${carbohydrate}g</li>
        <li class="list-group-item">Protein: ${protein}g</li>
        <li class="list-group-item">Fat: ${fat}g</li>
        <ul>`;

        // Clear calorie calculator inputs
        document.querySelector('#calculator-food-name').value = '';
        document.querySelector('#calculator-food-quantity').value = '';
    })
    .catch(error => {
        console.log('Error:', error);
        document.querySelector('#calculator-ans').innerHTML = 'Please key in a valid input';
    });

    return false;
}


// Log custom calories
document.addEventListener('DOMContentLoaded', () => {

    document.querySelector('#custom-calories').onclick = () => {

        const name = document.querySelector('#custom-food-name').value;
        const quantity = document.querySelector('#custom-food-quantity').value;
        const calories = document.querySelector('#custom-food-calories').value;

        // Post custom calories
        fetch(`/custom_calories`, {
            method: 'POST',
                headers: {
                    "X-CSRFToken": getCookie("csrftoken")
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    name: name,
                    quantity: quantity,
                    calories: calories
                })
        })

        // Clear input field
        document.querySelector('#custom-food-name').value = '';
        document.querySelector('#custom-food-quantity').value = '';
        document.querySelector('#custom-food-calories').value = '';

        const daily_calories = parseInt(document.querySelector('#progress-bar').dataset.dailycalories);
        const today_calories = parseInt(document.querySelector('#progress-bar').dataset.todaycalories);
        const new_today_calories = today_calories + parseInt(calories);

        // Update progress bar today_calories dataset
        document.querySelector('#progress-bar').dataset.todaycalories = new_today_calories;

        // Update progress bar
        let width = 0;
        if (new_today_calories > daily_calories) {
            width = 100;
            document.querySelector('#progress-message').innerHTML = 'You have exceeded your daily calories!'
        } else if (new_today_calories > 0) {
            width = ((new_today_calories / daily_calories) * 100).toFixed();
        }

        document.querySelector('#progress-bar').style.width = `${width}%`;
        document.querySelector('#progress-bar').innerHTML = new_today_calories;
    }
})


// Log calculated calories
document.addEventListener('DOMContentLoaded', () => {

    document.querySelector('#calculated-calories').onclick = () => {

        const name = document.querySelector('#calculated-food-name').value;
        const quantity = document.querySelector('#calculated-food-quantity').value;

        const APP_ID = '3b285604'
        const APP_KEY = 'd6df9e13620924ab9ca623a319cd69e6'
        const nutrition_type = 'cooking';

        fetch (`https://api.edamam.com/api/nutrition-data?app_id=${APP_ID}&app_key=${APP_KEY}&nutrition-type=${nutrition_type}&ingr=${quantity}%20${name}`, {
            method: 'GET',
            headers: {
                "X-CSRFToken": getCookie("csrftoken")
            },
            credentials: 'same-origin',
        })
        .then(response => {
            if (!response.ok) {
                return Promise.reject(response)
            }
            return response.json()
        })
        .then(data => {
            const calories = data.calories;

            // Post calculated calories
            fetch(`/calculated_calories`, {
                method: 'POST',
                    headers: {
                        "X-CSRFToken": getCookie("csrftoken")
                    },
                    credentials: 'same-origin',
                    body: JSON.stringify({
                        name: name,
                        quantity: quantity,
                        calories: calories
                    })
            })

            // Clear input fields
            document.querySelector('#calculated-food-name').value = '';
            document.querySelector('#calculated-food-quantity').value = '';

            const daily_calories = parseInt(document.querySelector('#progress-bar').dataset.dailycalories);
            const today_calories = parseInt(document.querySelector('#progress-bar').dataset.todaycalories);
            const new_today_calories = today_calories + parseInt(calories);

            // Update progress bar today_calories dataset
            document.querySelector('#progress-bar').dataset.todaycalories = new_today_calories;

            // Update progress bar
            let width = 0;
            if (new_today_calories > daily_calories) {
                width = 100;
                document.querySelector('#progress-message').innerHTML = 'You have exceeded your daily calories!'
            } else if (new_today_calories > 0) {
                width = ((new_today_calories / daily_calories) * 100).toFixed();
            }

            document.querySelector('#progress-bar').style.width = `${width}%`;
            document.querySelector('#progress-bar').innerHTML = new_today_calories;
        })
        .catch(error => {
            console.log('Error:', error);
            document.querySelector('#calculated-food-message').innerHTML = 'Please key in a valid input';
        });
    }
})


// Displays progress bar on page load
document.addEventListener('DOMContentLoaded', () => {
    progress_bar();
})


function progress_bar() {

    const daily_calories = parseInt(document.querySelector('#progress-bar').dataset.dailycalories);
    const today_calories = parseInt(document.querySelector('#progress-bar').dataset.todaycalories);

    let width = 0;
    if (today_calories > daily_calories) {
        width = 100;
        document.querySelector('#progress-message').innerHTML = 'You have exceeded your daily calories!'
    } else if (today_calories > 0) {
        width = ((today_calories / daily_calories) * 100).toFixed();
    } else {
        width = 0;
    }

    document.querySelector('#progress-bar').style.width = `${width}%`;
    document.querySelector('#progress-bar').innerHTML = today_calories;
}


// CSRF Token
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}