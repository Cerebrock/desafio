const nQuestions = 5;
let currentQuestionIndex = 0;
let score = 0;
let userName = "";
let userEmail = "";

document.getElementById("n-questions").innerHTML = nQuestions + " preguntas";

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
    questionDiv.innerHTML = `<p>${q.question}</p>`;

    q.options.forEach((option) => {
      const answerButton = document.createElement("button");
      answerButton.textContent = option;
      answerButton.onclick = () => answerQuestion(option);

      // Apply color based on button text
      if (option === "VERDADERO") {
        answerButton.style.backgroundColor = "green";
      } else if (option === "FALSO") {
        answerButton.style.backgroundColor = "red";
      }

      questionDiv.appendChild(answerButton);
    });

    quizContainer.appendChild(questionDiv);
    const progressPercent = (index / questions.length) * 100;
    progressBar.style.width = progressPercent + "%";
  } else {
    quizContainer.style.display = "none";
    progressBar.parentElement.style.display = "none";
    displayResult();
    sendData();
  }
  // Select all buttons
  var buttons = document.querySelectorAll("button");

  // Loop through each button
  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      var logo = document.getElementById("logo");
      if (logo) {
        logo.classList.add("rotating");

        // Attach animationend event listener to the logo
        logo.addEventListener("animationend", function () {
          logo.classList.remove("rotating");
        });
      }
    });
  });
}

function answerQuestion(selectedOption) {
  if (selectedOption === questions[currentQuestionIndex].correct) {
    score++;
  }
  currentQuestionIndex++;
  displayQuestion(currentQuestionIndex);
}

function displayResult() {
  const resultDiv = document.getElementById("result");
  const restartButton = document.getElementById("restart"); // Ensure you have the correct ID for your redirect button
  const redirectButton = document.getElementById("redirect-button"); // Ensure you have the correct ID for your redirect button
  const totalQuestions = questions.length;
  const threshold = Math.ceil(totalQuestions * 0.6);
  const successMessage = `<b>¡Felicitaciones!</b></br></br>Tu puntaje fue de <b>${score}/${totalQuestions}</b></br></br><b>Tu cupón es </b></br><br>`;
  const failureMessage = `Tu puntaje fue de ${score} sobre ${totalQuestions} correctas.</br></br>Intentalo nuevamente`;
  const couponCode = "D-SAFIA-T"; // Example coupon code

  if (score >= threshold) {
    resultDiv.innerHTML = `<div class="winner-message">
                             ${successMessage}
                             <div class="coupon">${couponCode}</div>
                             <p style='text-align:center;'>¡Podés usarlo para aplicar a la membresía o cualquiera de nuestros cursos con un <b>40% de descuento!</b></div>                             
                           </div>`;
    redirectButton.style.display = "block"; // Show the redirect button only if score is above threshold
    restartButton.style.display = "none";
  } else {
    resultDiv.innerHTML = `<div class="failure-message">${failureMessage}</div>`;
    restartButton.style.display = "block";
  }
  resultDiv.style.display = "block";
}

window.onload = () => {
  document.getElementById("result").style.display = "none";
  document.getElementById("progress-bar").style.display = "block";
  loadQuestions(nQuestions);
};

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
