const nQuestions = 1;
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
    localStorage.setItem("userName", userName);
    localStorage.setItem("userEmail", userEmail);
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
  const isCorrect = selectedOption === questions[currentQuestionIndex].correct;
  showOverlay(isCorrect);
  if (isCorrect) {
    score++;
  }
  currentQuestionIndex++;
  setTimeout(() => {
    displayQuestion(currentQuestionIndex);
  }, 2200); // Wait for animation to finish before displaying next question
}
function displayResult() {
  const resultDiv = document.getElementById("result");
  const restartButton = document.getElementById("restart");
  const redirectButton = document.getElementById("redirect-button");
  const disclaimer = document.getElementById("disclaimer");

  const totalQuestions = questions.length;
  const scorePercentage = (score / totalQuestions) * 100;

  const discounts = {
    top: { threshold: 100, discount: 40, couponCode: "DESAFI4" },
    medium: { threshold: 80, discount: 30, couponCode: "DESAFIA3" },
    lower: { threshold: 50, discount: 10, couponCode: "DESAF10" },
    none: { threshold: 30, discount: 0, couponCode: "" },
  };

  let appliedDiscount = discounts.none;
  if (scorePercentage >= discounts.top.threshold) {
    appliedDiscount = discounts.top;
  } else if (scorePercentage >= discounts.medium.threshold) {
    appliedDiscount = discounts.medium;
  } else if (scorePercentage >= discounts.lower.threshold) {
    appliedDiscount = discounts.lower;
  }
  const successMessage = `<b>¡Felicitaciones!</b></br></br>Tu puntaje fue de <b>${score}/${totalQuestions}</b> (${scorePercentage.toFixed(
    2
  )}%).</br></br><b>Ganaste el cupón 
  <div class='coupon'>
  ${appliedDiscount.couponCode}
  </div>
  </b></br><br>`;
  const failureMessage = `Tu puntaje fue de ${score} sobre ${totalQuestions} correctas. Intentalo nuevamente.`;

  const additionalMessage = `<p>¡Aprendé a hacer prototipos de aplicaciones basadas en IA rápidamente!</p>`;

  if (scorePercentage >= discounts.none.threshold) {
    resultDiv.innerHTML = `<div class="winner-message">
                             ${successMessage}
                             <p style='text-align:center; margin-top:0px'>¡Podés usarlo para tener un <b>${appliedDiscount.discount}% de descuento en con todos nuestros Cursos y Carreras!</b></p>                             
                             ${additionalMessage}
                             </div>`;
    redirectButton.href = `https://humai.com.ar/sumate?coupon=${appliedDiscount.couponCode}`;
    redirectButton.style.display = "block";
    restartButton.style.display = "none";
    disclaimer.style.display = "block";
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
  if (localStorage.getItem("userName")) {
    document.getElementById("name").value = localStorage.getItem("userName");
  }
  if (localStorage.getItem("userEmail")) {
    document.getElementById("email").value = localStorage.getItem("userEmail");
  }
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

function showOverlay(isCorrect) {
  const overlay = document.getElementById("overlay");
  const tick = document.getElementById("tick");
  const cross = document.getElementById("cross");

  tick.style.display = isCorrect ? "block" : "none";
  cross.style.display = isCorrect ? "none" : "block";

  overlay.classList.add("active");
  setTimeout(() => {
    overlay.classList.remove("active");
  }, 2000); // Overlay visible for 2 seconds
}
