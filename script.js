const nQuestions = 10;
let currentQuestionIndex = 0;
let score = 0;
let userName = "";
let userEmail = "";

function startQuiz() {
  userName = document.getElementById("name").value;
  userEmail = document.getElementById("email").value;
  validation = validateData(userName, userEmail);
  if (!validation.isNameValid || !validation.isEmailValid) {
    // Display error messages accordingly
    if (!validation.isNameValid) {
      alert("Ingrese su nombre.");
    } else if (!validation.isEmailValid) {
      alert("Dirección de correo inválida.");
    }
    return false;
  } else {
    document.getElementById("welcome-screen").style.display = "none";
    document.getElementById("welcome-message").style.display = "none";
    document.getElementById("quiz").style.display = "block";
    displayQuestion(currentQuestionIndex);
    document.getElementById("next-btn").style.display = "block";
    return true;
  }
}

function displayQuestion(index) {
  const quizContainer = document.getElementById("question-container");
  const progressBar = document.getElementById("progress");
  quizContainer.innerHTML = "";

  if (index < questions.length) {
    const q = questions[index];
    const questionDiv = document.createElement("div");
    questionDiv.className = "mycard question";
    questionDiv.innerHTML =
      `<p>${q.question}</p>` +
      q.options
        .map(
          (option) =>
            `<label>
                  <input type="radio" name="question" value="${option}"> ${option}
              </label>`
        )
        .join("<br>");
    quizContainer.appendChild(questionDiv);
    document.getElementById("next-btn").textContent =
      index === questions.length - 1 ? "ENVIAR" : "SIGUIENTE";
    const progressPercent = ((index + 1) / questions.length) * 100;
    progressBar.style.width = progressPercent + "%";
  } else {
    document.getElementById("next-btn").style.display = "none";
    progressBar.parentElement.style.display = "none";
    displayResult();
    sendData();
  }
}

function submitAnswer() {
  const selected = document.querySelector(`input[name="question"]:checked`);
  if (selected && selected.value === questions[currentQuestionIndex].correct) {
    score++;
  }
  currentQuestionIndex++;
  displayQuestion(currentQuestionIndex);
}
function displayResult() {
  const resultDiv = document.getElementById("result");
  const redirectButton = document.getElementById("redirect-button"); // Ensure you have the correct ID for your redirect button
  const totalQuestions = questions.length;
  const threshold = Math.ceil(totalQuestions * 0.6);
  const successMessage = `<b>¡Felicitaciones!</b></br>Tu puntaje fue de ${score}/${totalQuestions}</br>Tu cupón es </br><br>`;
  const failureMessage = `Tu puntaje fue de ${score} sobre ${totalQuestions} correctas.</br></br>Podés intentarlo de nuevo.`;
  const couponCode = "D-SAFIA-T"; // Example coupon code

  if (score >= threshold) {
    resultDiv.innerHTML = `<div class="winner-message">
                             ${successMessage}
                             <div class="coupon">${couponCode}</div>
                           </div>`;
    redirectButton.style.display = "block"; // Show the redirect button only if score is above threshold
  } else {
    resultDiv.innerHTML = `<div class="failure-message">${failureMessage}</div>`;
    redirectButton.style.display = "none"; // Hide the redirect button
  }

  resultDiv.style.display = "block";
}

window.onload = () => {
  document.getElementById("next-btn").style.display = "none";
  document.getElementById("result").style.display = "none";
  document.getElementById("progress-bar").style.display = "block";
  loadQuestions(nQuestions);
};

document.addEventListener("DOMContentLoaded", function () {
  var button = document.getElementById("next-btn");
  if (button) {
    button.addEventListener("click", function () {
      var logo = document.getElementById("logo");
      if (logo) {
        logo.classList.add("rotating");

        logo.addEventListener("animationend", function () {
          logo.classList.remove("rotating");
        });
      }
    });
  }
});

const BACKEND_URL =
  "https://script.google.com/macros/s/AKfycbyQT-6glmz951i4jGUH_IgyZSbS-uUt7nuXO5m5mlf3d6vDh-v-C_K3Nvp0bvWri5Xj/exec";

function sendData() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const timestamp = new Date().toISOString(); // Get current timestamp in ISO format

  fetch(BACKEND_URL, {
    method: "POST",
    contentType: "application/json",
    body: JSON.stringify({
      name,
      email,
      score,
      timestamp, // Include timestamp in the data sent
    }),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error("Error:", error));
}

function validateData(name, email) {
  const nameRegex = /^.{3,}$/;
  const isNameValid = name && nameRegex.test(name.trim());

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = email && emailRegex.test(email.trim());
  return {
    isNameValid: isNameValid,
    isEmailValid: isEmailValid,
  };
}
let questions = [];

function loadQuestions(N) {
  fetch("questions.json")
    .then((response) => response.json())
    .then((data) => {
      if (data.length > N) {
        // Shuffle the array and then slice it to get N random questions
        questions = data.sort(() => 0.5 - Math.random()).slice(0, N);
      } else {
        // If N is greater than the number of questions available, use all questions
        questions = data;
      }
      // Now you can start your quiz with the randomly selected questions
    })
    .catch((error) => console.error("Error loading questions:", error));
}
