const questions = [
  {
    question:
      "¿Qué aspecto de la cognición es más análogo a la Unidad Central de Procesamiento (CPU) de una computadora?",
    options: [
      "Almacenamiento de memoria a largo plazo",
      "Procesamiento de entrada sensorial",
      "Memoria a corto plazo (de trabajo)",
      "Respuesta emocional",
    ],
    correct: "Memoria a corto plazo (de trabajo)",
  },
  /*
  {
    question:
      "En el contexto del aprendizaje y la memoria, ¿qué componente de la computadora se compara mejor con la memoria a largo plazo humana?",
    options: [
      "RAM (Memoria de Acceso Aleatorio)",
      "Almacenamiento en Disco Duro",
      "Unidad de Procesamiento Gráfico (GPU)",
      "Placa base",
    ],
    correct: "Almacenamiento en Disco Duro",
  },
  {
    question:
      "¿Qué proceso en la cognición humana es similar al algoritmo de una computadora en la resolución de problemas?",
    options: [
      "Soñar durante el sueño",
      "Experimentar emociones",
      "Aplicar heurísticas",
      "Percepción sensorial",
    ],
    correct: "Aplicar heurísticas",
  },
  {
    question:
      "En términos de adaptabilidad y aprendizaje, ¿cómo difiere significativamente la cognición humana de los modelos computacionales actuales?",
    options: [
      "Los humanos dependen únicamente de información preprogramada",
      "Los humanos no pueden procesar información tan rápido como las computadoras",
      "Los humanos pueden aprender de datos y experiencias no estructuradas",
      "Las computadoras pueden desarrollar emociones de manera independiente",
    ],
    correct:
      "Los humanos pueden aprender de datos y experiencias no estructuradas",
  },
  {
    question:
      "¿Cuál es el equivalente de la 'secuencia de arranque' de una computadora en la cognición humana?",
    options: [
      "El proceso de envejecimiento",
      "Despertar del sueño",
      "Recuerdo de memoria a largo plazo",
      "Adaptación sensorial",
    ],
    correct: "Despertar del sueño",
  },*/
];
let currentQuestionIndex = 0;
let score = 0;
let userName = "";
let userEmail = "";

function startQuiz() {
  userName = document.getElementById("name").value;
  userEmail = document.getElementById("email").value;
  document.getElementById("welcome-screen").style.display = "none";
  document.getElementById("quiz").style.display = "block";
  displayQuestion(currentQuestionIndex);
  document.getElementById("next-btn").style.display = "block";
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
  const redirectButton = document.getElementById("redirectButton");
  const totalQuestions = questions.length;
  const threshold = Math.ceil(totalQuestions * 0.8);
  const successMessage = `<b>¡Felicitaciones!</b></br>Tu puntaje fue de ${score}/${totalQuestions}</br>Tu cupón es </br><br>`;
  const failureMessage = `Tu puntaje fue de ${score} sobre ${totalQuestions} correctas.</br></br>Podés intentarlo de nuevo.`;
  const couponCode = "D-SAFIA-T"; // Example coupon code

  resultDiv.innerHTML =
    score >= threshold
      ? `<div class="winner-message">
           ${successMessage}
           <div class="coupon">${couponCode}</div>
         </div>`
      : `<div class="failure-message">${failureMessage}</div>`;

  // Show the redirect button
  redirectButton.style.display = "block";

  resultDiv.style.display = "block";
}
window.onload = () => {
  document.getElementById("next-btn").style.display = "none";
  document.getElementById("result").style.display = "none";
  document.getElementById("progress-bar").style.display = "block";
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

  fetch(BACKEND_URL, {
    method: "POST",
    contentType: "application/json",
    body: JSON.stringify({
      name,
      email,
      score,
    }),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error("Error:", error));
}
