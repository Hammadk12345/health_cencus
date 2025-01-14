const addPatientButton = document.getElementById('addPatient');
const report = document.getElementById('report');
const btnSearch = document.getElementById('btnSearch');
const patients = [];

function addPatient() {
    const name = document.getElementById('name').value.trim();
    const genderInput = document.querySelector('input[name="gender"]:checked');
    const age = document.getElementById('age').value.trim();
    const condition = document.getElementById('condition').value;

    if (name && genderInput && age && condition) {
        patients.push({ name, gender: genderInput.value, age: parseInt(age), condition });
        resetForm();
        generateReport();
    } else {
        alert('Please fill out all fields.');
    }
}

function resetForm() {
    document.getElementById('name').value = "";
    const genderInput = document.querySelector('input[name="gender"]:checked');
    if (genderInput) genderInput.checked = false;
    document.getElementById('age').value = "";
    document.getElementById('condition').value = "";
}

function generateReport() {
    const numPatients = patients.length;
    const conditionsCount = {
        Diabetes: 0,
        Thyroid: 0,
        "High Blood Pressure": 0,
    };

    const genderConditionsCount = {
        Male: { Diabetes: 0, Thyroid: 0, "High Blood Pressure": 0 },
        Female: { Diabetes: 0, Thyroid: 0, "High Blood Pressure": 0 },
    };

    for (const patient of patients) {
        if (conditionsCount[patient.condition] !== undefined) {
            conditionsCount[patient.condition]++;
        }
        if (genderConditionsCount[patient.gender][patient.condition] !== undefined) {
            genderConditionsCount[patient.gender][patient.condition]++;
        }
    }

    report.innerHTML = `<h3>Number of Patients: ${numPatients}</h3>`;
    report.innerHTML += `<h4>Conditions Breakdown:</h4>`;
    for (const condition in conditionsCount) {
        report.innerHTML += `${condition}: ${conditionsCount[condition]}<br>`;
    }

    report.innerHTML += `<h4>Gender-Based Condition Breakdown:</h4>`;
    for (const gender in genderConditionsCount) {
        report.innerHTML += `<strong>${gender}:</strong><br>`;
        for (const condition in genderConditionsCount[gender]) {
            report.innerHTML += `&nbsp;&nbsp;${condition}: ${genderConditionsCount[gender][condition]}<br>`;
        }
    }
}

function searchCondition() {
    const input = document.getElementById('conditionInput').value.toLowerCase();
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    fetch('health_analysis.json')
        .then(response => response.json())
        .then(data => {
        const condition = data.conditions.find(item => item.name.toLowerCase() === input);

        if (condition) {
            const symptoms = condition.symptoms.join(', ');
            const prevention = condition.prevention.join(', ');
            const treatment = condition.treatment;

            resultDiv.innerHTML += `<h2>${condition.name}</h2>`;
            resultDiv.innerHTML += `<img src="${condition.imagesrc}" alt="hjh">`;

            resultDiv.innerHTML += `<p><strong>Symptoms:</strong> ${symptoms}</p>`;
            resultDiv.innerHTML += `<p><strong>Prevention:</strong> ${prevention}</p>`;
            resultDiv.innerHTML += `<p><strong>Treatment:</strong> ${treatment}</p>`;
        } else {
            resultDiv.innerHTML = 'Condition not found.';
        }
        })
        .catch(error => {
        console.error('Error:', error);
        resultDiv.innerHTML = 'An error occurred while fetching data.';
        })
}
btnSearch.addEventListener('click', searchCondition);


addPatientButton.addEventListener("click", addPatient);
