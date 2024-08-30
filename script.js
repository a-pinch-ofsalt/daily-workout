document.addEventListener('DOMContentLoaded', function () {
    const routineList = document.getElementById('routine-list');
    const addStepButton = document.getElementById('add-step');
    const form = document.getElementById('workout-modifier-form');
    const modifyButton = document.querySelector('.fancy-button[type="submit"]');

    // Add initial workout step after the DOM has loaded
    addWorkoutStep();

    // Toggle muscle group selection
    document.querySelectorAll('.muscle-group-button').forEach(button => {
        button.addEventListener('click', function () {
            button.classList.toggle('active');
            saveRoutine();
            updateButtonState(); // Check button state after each change
        });
    });

    function initializeSliderBackgrounds(stepElement) {
        const bodyweightOption = stepElement.querySelector('.slider-option[data-type="bodyweight"]');
        const weightOption = stepElement.querySelector('.slider-option[data-type="weights"]');
        const bodyweightSliderBackground = stepElement.querySelector('.slider-container[data-slider="bodyweight-weights"] .slider-background');
        
        const lbOption = stepElement.querySelector('.slider-option[data-unit="lb"]');
        const kgOption = stepElement.querySelector('.slider-option[data-unit="kg"]');
        const unitSliderBackground = stepElement.querySelector('.slider-container[data-slider="kg-lb"] .slider-background');
    
        // Initialize bodyweight/weight slider background
        requestAnimationFrame(() => {
            if (weightOption.classList.contains('active')) {
                bodyweightSliderBackground.style.left = `${bodyweightOption.offsetWidth}px`;
                bodyweightSliderBackground.style.width = `${weightOption.offsetWidth}px`;
            } else {
                bodyweightSliderBackground.style.left = '0';
                bodyweightSliderBackground.style.width = `${bodyweightOption.offsetWidth}px`;
            }
    
            // Initialize lb/kg slider background
            if (lbOption.classList.contains('active')) {
                unitSliderBackground.style.left = '0';
                unitSliderBackground.style.width = `${lbOption.offsetWidth}px`;
            } else {
                unitSliderBackground.style.left = `${lbOption.offsetWidth}px`;
                unitSliderBackground.style.width = `${kgOption.offsetWidth}px`;
            }
        });
    }
    
    

    function addWorkoutStep(value = '') {
        const template = document.getElementById('workout-step-template');
        const newStep = template.content.cloneNode(true).querySelector('.routine-step');
        
        // Assign value to the input field if provided
        newStep.querySelector('.routine-input').value = value;
        
        const removeButton = newStep.querySelector('.remove-step');
        const bodyweightSliderContainer = newStep.querySelector('.slider-container[data-slider="bodyweight-weights"]');
        const unitSliderContainer = newStep.querySelector('.slider-container[data-slider="kg-lb"]');
    
        // Event listener for input fields to update button state
        const inputs = newStep.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', updateButtonState);
        });
        
        removeButton.addEventListener('click', function () {
            routineList.removeChild(newStep);
            saveRoutine();
            updateButtonState();
        });
    
        // Event listener for the bodyweight-weights slider
        bodyweightSliderContainer.addEventListener('click', function () {
            const bodyweightOption = newStep.querySelector('.slider-option[data-type="bodyweight"]');
            const weightOption = newStep.querySelector('.slider-option[data-type="weights"]');
            const bodyweightSliderBackground = newStep.querySelector('.slider-container[data-slider="bodyweight-weights"] .slider-background');
            const weightInput = newStep.querySelector('.weight-input');
            const unitSliderContainer = newStep.querySelector('.slider-container[data-slider="kg-lb"]');
        
            // Toggle the active state
            if (weightOption.classList.contains('active')) {
                weightOption.classList.remove('active');
                bodyweightOption.classList.add('active');
                weightInput.style.display = 'none';
                unitSliderContainer.style.display = 'none';
                bodyweightSliderBackground.style.left = '0';
                bodyweightSliderBackground.style.width = `${bodyweightOption.offsetWidth}px`;
            } else {
                bodyweightOption.classList.remove('active');
                weightOption.classList.add('active');
                weightInput.style.display = 'inline-block';
                unitSliderContainer.style.display = 'flex';
                bodyweightSliderBackground.style.left = `${bodyweightOption.offsetWidth}px`;
                bodyweightSliderBackground.style.width = `${weightOption.offsetWidth}px`;
            }
        
            updateButtonState();
        });
        
        
    
        // Event listener for the kg-lb slider
        unitSliderContainer.addEventListener('click', function () {
            const lbOption = newStep.querySelector('.slider-option[data-unit="lb"]');
            const kgOption = newStep.querySelector('.slider-option[data-unit="kg"]');
            const unitSliderBackground = newStep.querySelector('.slider-container[data-slider="kg-lb"] .slider-background');
    
            lbOption.classList.toggle('active');
            kgOption.classList.toggle('active');
    
            if (lbOption.classList.contains('active')) {
                unitSliderBackground.style.left = '0';
                unitSliderBackground.style.width = `${lbOption.offsetWidth}px`;
            } else {
                unitSliderBackground.style.left = `${lbOption.offsetWidth}px`;
                unitSliderBackground.style.width = `${kgOption.offsetWidth}px`;
            }
        });
    
        routineList.appendChild(newStep);

        // Initialize slider backgrounds
        initializeSliderBackgrounds(newStep);

        updateButtonState(); // Initial check after adding a step
    }

    
    
    
       

    function updateButtonState() {
        const allFields = document.querySelectorAll('.routine-step input');
        let allValid = true;
    
        allFields.forEach(field => {
            if (field.name !== 'secondsPerRepInput' && !field.value.trim() && field.style.display != 'none') {
                allValid = false;
            }
        });
    
        console.log(`routineList.children.length = ${routineList.children.length}`);
    
        if (allValid && routineList.children.length >= 3) {
            modifyButton.disabled = false;
            modifyButton.classList.remove('disabled');
        } else {
            modifyButton.disabled = true;
            modifyButton.classList.add('disabled');
        }
    }
    

    function saveRoutine() {
        const routineSteps = Array.from(document.querySelectorAll('.routine-input')).map(input => input.value);
        const muscleGroups = Array.from(document.querySelectorAll('.muscle-group-button.active')).map(button => button.textContent);

        localStorage.setItem('workoutRoutine', JSON.stringify(routineSteps));
        localStorage.setItem('soreMuscles', JSON.stringify(muscleGroups));
    }

    function loadRoutine() {
        const savedRoutine = JSON.parse(localStorage.getItem('workoutRoutine')) || [];
        const savedMuscles = JSON.parse(localStorage.getItem('soreMuscles')) || [];

        savedRoutine.forEach(step => addWorkoutStep(step));

        savedMuscles.forEach(muscle => {
            const button = Array.from(document.querySelectorAll('.muscle-group-button')).find(btn => btn.textContent === muscle);
            if (button) {
                button.classList.add('active');
            }
        });

        updateButtonState(); // Check button state after loading the routine
    }

    loadRoutine();

    addStepButton.addEventListener('click', function () {
        addWorkoutStep();
        updateButtonState(); // Check button state after adding a step
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();
    
        const routineSteps = Array.from(document.querySelectorAll('.routine-step')).map(step => {
            const exercise = step.querySelector('.routine-input').value;
            const sets = step.querySelector('.sets-input').value;
            const reps = step.querySelector('.reps-per-set-input').value;
            const secondsPerRep = step.querySelector('.seconds-per-rep-input').value;
            const isBodyweight = step.querySelector('.slider-option.active').textContent === 'Bodyweight';
            const weight = step.querySelector('.weight-input').value;
            const unit = step.querySelector('.weight-section .slider-option.active').textContent;
    
            if (isBodyweight) {
                return `${exercise} (Bodyweight, ${sets} sets, ${reps} reps per set, ${secondsPerRep || 'N/A'} seconds per rep)`;
            } else {
                return `${exercise} (Weight: ${weight} ${unit}, ${sets} sets, ${reps} reps per set, ${secondsPerRep || 'N/A'} seconds per rep)`;
            }
        });
    
        const muscleGroups = Array.from(document.querySelectorAll('.muscle-group-button.active')).map(button => button.textContent);
    
        const prompt = `Based on the following workout routine: ${routineSteps.join(', then ')}. 
        My sore muscles are: ${muscleGroups.join(' and ')}. I want to do my usual workout today, but change only a few 
        exercisese (keep most of it intact). Can you replace the exercises that target my sore muscles with slightly easier exercises?
        Considering the sets, reps, weight, and duration of each exercise, determine how strong my muscles are and suggest exercises 
        that are appropriate for my current strength and soreness levels. Obviously, if I used weights for a particular exercise, then find an alternative using weights.
        If I used bodyweight for a particular exercise, then find an alterative using bodyweight.
        Please format it like this: ALOHA{exercise1name_10lb(or kg, whichever I used)_10 reps_3 sets_instructionsIn3Sentences+exercise2name_...+...}`;

        // Send data to /sendToChatGPT
        fetch('https://localhost:3000/sendToChatGPT', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: prompt })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Response from GPT:', data);
    
            // Extract the workout portion from the response
            const workoutText = data.message.match(/ALOHA\{([^}]+)\}/);
            if (workoutText && workoutText[1]) {
                const exercises = workoutText[1].split('+').map(item => item.trim());
    
                const workoutContainer = document.getElementById('suggested-workout-container');
                const workoutList = document.getElementById('suggested-workout-list');
    
                // Clear previous workout suggestions
                workoutList.innerHTML = '';
    
                // Display each exercise as a card
                exercises.forEach(exercise => {
                    const card = document.createElement('div');
                    card.className = 'suggested-workout-card';
                    card.textContent = exercise.split('_').join(', ');
                    workoutList.appendChild(card);
                });
    
                workoutContainer.style.display = 'block'; // Show the workout container
            } else {
                alert('Failed to extract workout from GPT response.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while sending data to ChatGPT.');
        });
    });
    
    
    
    
});
