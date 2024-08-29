document.addEventListener('DOMContentLoaded', function () {
    const routineList = document.getElementById('routine-list');
    const addStepButton = document.getElementById('add-step');
    const form = document.getElementById('workout-modifier-form');

    // Function to add a workout step
    function addWorkoutStep(value = '') {
        const newStep = document.createElement('div');
        newStep.className = 'routine-step entering'; // Initial class for entry animation

        const stepInput = document.createElement('input');
        stepInput.type = 'text';
        stepInput.placeholder = 'Enter workout step...';
        stepInput.className = 'routine-input';
        stepInput.value = value; // Set value if provided

        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.textContent = '✖'; // Remove Step Button
        removeButton.className = 'remove-step';

        removeButton.addEventListener('click', function () {
            // Add exit animation before removing the element
            newStep.classList.add('exiting');
            newStep.addEventListener('transitionend', () => {
                routineList.removeChild(newStep);
                saveRoutine(); // Save the updated routine after removal
            });
        });

        newStep.appendChild(stepInput);
        newStep.appendChild(removeButton);
        routineList.appendChild(newStep);

        // Trigger the entry animation
        requestAnimationFrame(() => {
            newStep.classList.remove('entering');
        });

        // Save the routine whenever a new step is added
        stepInput.addEventListener('input', saveRoutine);
        saveRoutine();
    }

    // Function to save the current routine and muscle groups to localStorage
    function saveRoutine() {
        const routineSteps = Array.from(document.querySelectorAll('.routine-input')).map(input => input.value);
        const muscleGroups = Array.from(document.querySelectorAll('input[name="muscle-group"]:checked')).map(el => el.value);

        localStorage.setItem('workoutRoutine', JSON.stringify(routineSteps));
        localStorage.setItem('soreMuscles', JSON.stringify(muscleGroups));
    }

    // Function to load the saved routine and muscle groups from localStorage
    function loadRoutine() {
        const savedRoutine = JSON.parse(localStorage.getItem('workoutRoutine')) || [];
        const savedMuscles = JSON.parse(localStorage.getItem('soreMuscles')) || [];

        savedRoutine.forEach(step => addWorkoutStep(step));

        savedMuscles.forEach(muscle => {
            const checkbox = document.querySelector(`input[name="muscle-group"][value="${muscle}"]`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
    }

    // Load the routine and muscle groups when the page loads
    loadRoutine();

    addStepButton.addEventListener('click', function () {
        addWorkoutStep();
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();
    
        // Collect workout steps
        const routineSteps = Array.from(document.querySelectorAll('.routine-input')).map(input => input.value);
        
        // Collect muscle groups feeling sore
        const muscleGroups = Array.from(document.querySelectorAll('input[name="muscle-group"]:checked')).map(el => el.value);
    
        // Prepare the prompt
        const prompt = `Given the following workout routine: ${routineSteps.join(', ')} and these sore muscle groups: ${muscleGroups.join(', ')}, please suggest modifications or a new routine.`;
        
        // Send the request to your Node.js server, which forwards it to the OpenAI API
        fetch('http://localhost:3000/sendToChatGPT', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: prompt })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Response from GPT:', data);
            alert('Response from GPT: ' + data.choices[0].message.content);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while sending data to OpenAI.');
        });

        // Send the request to your test server
        fetch('http://localhost:3000/test', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "test-model",
                prompt: prompt
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Response from test server:', data);
            alert('Response from test server: ' + JSON.stringify(data));
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while sending data to the test server.');
        });
    });
    
});
