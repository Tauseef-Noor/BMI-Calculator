// DOM Elements
const metricBtn = document.getElementById('metricBtn');
const imperialBtn = document.getElementById('imperialBtn');
const weightInput = document.getElementById('weight');
const heightInput = document.getElementById('height');
const ageInput = document.getElementById('age');
const genderSelect = document.getElementById('gender');
const calculateBtn = document.getElementById('calculate');
const resultContainer = document.getElementById('resultContainer');
const resultCard = document.getElementById('resultCard');
const emojiContainer = document.getElementById('emojiContainer');
const emoji = document.getElementById('emoji');
const bmiValue = document.getElementById('bmiValue');
const bmiCategory = document.getElementById('bmiCategory');
const bmiMessage = document.getElementById('bmiMessage');
const tipsContainer = document.getElementById('tipsContainer');
const weightUnit = document.getElementById('weightUnit');
const heightUnit = document.getElementById('heightUnit');
const recommendedWeight = document.createElement('div');
recommendedWeight.className = 'recommended-weight';
resultCard.appendChild(recommendedWeight);

let isMetric = true;

// Health tips data
const healthTips = {
    underweight: [
        {
            icon: '🍽️',
            title: 'Nutrition',
            text: 'Aim for 5-6 smaller meals per day with balanced macros. Include healthy fats like avocados and nuts.'
        },
        {
            icon: '💪',
            title: 'Exercise',
            text: 'Strength training 3-4 times per week to build muscle mass. Include compound movements like squats and deadlifts.'
        },
        {
            icon: '💧',
            title: 'Hydration',
            text: 'Drink 2-3L of water daily. Consider adding electrolytes if you\'re active.'
        },
        {
            icon: '😴',
            title: 'Sleep',
            text: 'Aim for 7-9 hours of quality sleep to support muscle recovery and growth.'
        },
        {
            icon: '🧠',
            title: 'Lifestyle',
            text: 'Manage stress through meditation or yoga. Consider consulting a dietitian for personalized advice.'
        }
    ],
    normal: [
        {
            icon: '🍎',
            title: 'Nutrition',
            text: 'Maintain a balanced diet with plenty of fruits, vegetables, lean proteins, and whole grains.'
        },
        {
            icon: '🏃',
            title: 'Exercise',
            text: 'At least 150 minutes of moderate aerobic activity or 75 minutes of vigorous activity per week.'
        },
        {
            icon: '💧',
            title: 'Hydration',
            text: 'Drink 2-3L of water daily. More if you exercise or live in a hot climate.'
        },
        {
            icon: '😴',
            title: 'Sleep',
            text: 'Aim for 7-9 hours of quality sleep each night.'
        },
        {
            icon: '🧘',
            title: 'Lifestyle',
            text: 'Manage stress, avoid smoking, and limit alcohol consumption.'
        }
    ],
    overweight: [
        {
            icon: '🥗',
            title: 'Nutrition',
            text: 'Focus on whole foods, reduce processed foods and added sugars. Control portion sizes.'
        },
        {
            icon: '🚶',
            title: 'Exercise',
            text: 'Aim for 30 minutes of moderate exercise most days. Walking is a great start.'
        },
        {
            icon: '💧',
            title: 'Hydration',
            text: 'Drink 2-3L of water daily. Sometimes thirst is mistaken for hunger.'
        },
        {
            icon: '😴',
            title: 'Sleep',
            text: 'Aim for 7-9 hours of quality sleep. Poor sleep can affect weight management.'
        },
        {
            icon: '🧘',
            title: 'Lifestyle',
            text: 'Reduce stress and make gradual, sustainable changes to your daily habits.'
        }
    ],
    obese: [
        {
            icon: '🥦',
            title: 'Nutrition',
            text: 'Focus on whole, unprocessed foods. Consider consulting a dietitian for a personalized plan.'
        },
        {
            icon: '🏃',
            title: 'Exercise',
            text: 'Start with low-impact activities like walking or swimming. Aim for 30 minutes daily.'
        },
        {
            icon: '💧',
            title: 'Hydration',
            text: 'Drink 2-3L of water daily. Stay hydrated to support metabolism.'
        },
        {
            icon: '😴',
            title: 'Sleep',
            text: 'Aim for 7-9 hours of quality sleep. Poor sleep can affect weight management.'
        },
        {
            icon: '👨‍⚕️',
            title: 'Lifestyle',
            text: 'Consult with healthcare professionals for a comprehensive weight management plan.'
        }
    ]
};

// Event Listeners
metricBtn.addEventListener('click', () => switchUnitSystem(true));
imperialBtn.addEventListener('click', () => switchUnitSystem(false));
calculateBtn.addEventListener('click', calculateBMI);

// Allow pressing Enter key to calculate
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        calculateBMI();
    }
});

// Switch between metric and imperial units
function switchUnitSystem(useMetric) {
    isMetric = useMetric;
    metricBtn.classList.toggle('active', useMetric);
    imperialBtn.classList.toggle('active', !useMetric);
    
    if (useMetric) {
        weightUnit.textContent = '(kg)';
        heightUnit.textContent = '(cm)';
        weightInput.placeholder = 'Enter your weight in kg';
        heightInput.placeholder = 'Enter your height in cm';
        weightInput.step = '0.1';
        heightInput.step = '0.1';
    } else {
        weightUnit.textContent = '(lbs)';
        heightUnit.textContent = '(in)';
        weightInput.placeholder = 'Enter your weight in lbs';
        heightInput.placeholder = 'Enter your height in in';
        weightInput.step = '1';
        heightInput.step = '1';
    }
    
    // Clear inputs and results
    weightInput.value = '';
    heightInput.value = '';
    resultContainer.style.display = 'none';
}

// Calculate recommended weight range based on height
function calculateRecommendedWeight(heightInCm, isMetric) {
    // Convert height to meters
    const heightInMeters = isMetric ? heightInCm / 100 : heightInCm * 0.0254;
    
    // Calculate weight range for normal BMI (18.5 - 24.9)
    const minWeight = (18.5 * heightInMeters * heightInMeters).toFixed(1);
    const maxWeight = (24.9 * heightInMeters * heightInMeters).toFixed(1);
    
    // Convert back to imperial if needed
    if (!isMetric) {
        const minLbs = (minWeight * 2.20462).toFixed(1);
        const maxLbs = (maxWeight * 2.20462).toFixed(1);
        return { min: minLbs, max: maxLbs, unit: 'lbs' };
    }
    
    return { min: minWeight, max: maxWeight, unit: 'kg' };
}

// Calculate BMI
function calculateBMI() {
    let weight = parseFloat(weightInput.value);
    let height = parseFloat(heightInput.value);
    const age = parseInt(ageInput.value) || 25; // Default to 25 if not specified
    const gender = genderSelect.value;
    
    // Validate inputs
    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
        alert('Please enter valid height and weight values');
        return;
    }
    
    // Store original values for display
    const originalHeight = height;
    const originalWeight = weight;
    
    // Convert imperial to metric if needed
    if (!isMetric) {
        // Convert lbs to kg (1 kg = 2.20462 lbs)
        weight = weight / 2.20462;
        // Convert inches to meters (1 m = 39.3701 in)
        height = height / 39.3701;
    } else {
        // Convert cm to m
        height = height / 100;
    }
    
    const bmi = (weight / (height * height)).toFixed(1);
    
    // Display results
    showResults(bmi, age, gender, originalHeight, originalWeight);
}

// Show results with animations and health tips
function showResults(bmi, age, gender, originalHeight, originalWeight) {
    // Reset classes
    resultCard.className = 'result-card';
    emoji.className = 'emoji';
    
    // Set BMI value
    bmiValue.textContent = bmi;
    
    // Calculate recommended weight range
    const weightRange = calculateRecommendedWeight(originalHeight, isMetric);
    const currentWeight = parseFloat(weightInput.value);
    
    // Determine BMI category and set appropriate styles
    let category, categoryClass, emojiChar, animationClass, message, tips, weightAdvice = '';
    
    if (bmi < 18.5) {
        category = 'Underweight';
        categoryClass = 'underweight';
        emojiChar = '🤕';
        animationClass = 'head-shake';
        message = 'Consider consulting a healthcare provider';
        tips = healthTips.underweight;
        weightAdvice = `Aim for a healthy weight between ${weightRange.min}-${weightRange.max} ${weightRange.unit} for your height.`;
    } else if (bmi >= 18.5 && bmi < 25) {
        category = 'Normal';
        categoryClass = 'normal';
        emojiChar = '😃';
        animationClass = 'bounce';
        message = 'Great job! Maintain your healthy lifestyle!';
        tips = healthTips.normal;
        weightAdvice = `Your weight is in the healthy range (${weightRange.min}-${weightRange.max} ${weightRange.unit}). Keep it up!`;
    } else if (bmi >= 25 && bmi < 30) {
        category = 'Overweight';
        categoryClass = 'overweight';
        emojiChar = '🙂';
        animationClass = 'float';
        message = 'Consider more physical activity and healthy eating';
        tips = healthTips.overweight;
        const targetWeight = (weightRange.max * 0.9).toFixed(1); // 10% below max normal weight
        weightAdvice = `Aim to reach ${targetWeight} ${weightRange.unit} (healthy range: ${weightRange.min}-${weightRange.max} ${weightRange.unit}).`;
    } else {
        category = 'Obese';
        categoryClass = 'obese';
        emojiChar = '😟';
        animationClass = 'pulse';
        message = 'Please consult a healthcare provider';
        tips = healthTips.obese;
        const targetWeight = (weightRange.max * 0.85).toFixed(1); // 15% below max normal weight
        weightAdvice = `Consult a healthcare provider about reaching a healthy weight (recommended: ${weightRange.min}-${weightRange.max} ${weightRange.unit}).`;
    }
    
    // Update UI
    bmiCategory.textContent = category;
    bmiMessage.textContent = message;
    emoji.textContent = emojiChar;
    emoji.classList.add(animationClass);
    resultCard.classList.add(categoryClass);
    
    // Display weight advice
    recommendedWeight.innerHTML = `
        <div class="weight-advice">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-info">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span>${weightAdvice}</span>
        </div>
    `;
    
    // Display health tips
    displayHealthTips(tips);
    
    // Show result container with animation
    resultContainer.style.display = 'block';
    
    // Scroll to result
    resultContainer.scrollIntoView({ behavior: 'smooth' });
}

// Display health tips
function displayHealthTips(tips) {
    // Clear previous tips
    tipsContainer.innerHTML = '';
    
    // Add new tips
    tips.forEach(tip => {
        const tipElement = document.createElement('div');
        tipElement.className = 'tip';
        tipElement.innerHTML = `
            <div class="tip-icon">${tip.icon}</div>
            <div class="tip-content">
                <h4>${tip.title}</h4>
                <p>${tip.text}</p>
            </div>
        `;
        tipsContainer.appendChild(tipElement);
    });
}

// Initialize the calculator
function init() {
    // Set default values
    ageInput.value = '25';
    
    // Show metric system by default
    switchUnitSystem(true);
}

// Initialize the calculator when the page loads
window.addEventListener('DOMContentLoaded', init);
