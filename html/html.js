document.addEventListener("DOMContentLoaded", function () {
  fetch("html.json?t=" + new Date().getTime())
      .then(response => response.json())
      .then(quizData => {
          const questionElement = document.getElementById("question");
          const optionsElement = document.getElementById("options");
          const nextButton = document.getElementById("next-btn");
          const resultContainer = document.createElement("div");
          resultContainer.id = "result-container";
          resultContainer.classList.add("container", "mt-4", "p-4", "border", "rounded", "shadow-sm", "bg-light");
          document.body.appendChild(resultContainer);
          
          let currentQuestionIndex = 0;
          let answersLog = [];
          
          function loadQuestion() {
              const currentQuestion = quizData[currentQuestionIndex];
              questionElement.textContent = currentQuestion.question;
              optionsElement.innerHTML = "";
              
              currentQuestion.options.forEach((option, index) => {
                  const button = document.createElement("button");
                  button.textContent = option;
                  button.classList.add("btn", "btn-outline-primary", "d-block", "w-100", "my-2");
                  button.addEventListener("click", () => selectAnswer(index));
                  optionsElement.appendChild(button);
              });
          }
          
          function selectAnswer(selectedIndex) {
              const correctIndex = quizData[currentQuestionIndex].correct;
              const buttons = document.querySelectorAll(".btn-outline-primary");
              let selectedAnswer = quizData[currentQuestionIndex].options[selectedIndex];
              let correctAnswerText = quizData[currentQuestionIndex].options[correctIndex];
              
              buttons.forEach((btn, idx) => {
                  if (idx === correctIndex) {
                      btn.classList.add("btn-success");
                  } else if (idx === selectedIndex) {
                      btn.classList.add("btn-danger");
                  }
                  btn.disabled = true;
              });
              
              let feedback = document.createElement("p");
              feedback.classList.add("fw-bold", "mt-2");
              if (selectedIndex === correctIndex) {
                  feedback.textContent = "Correct Answer ✅";
                  feedback.classList.add("text-success");
              } else {
                  feedback.textContent = "Wrong Answer ❌";
                  feedback.classList.add("text-danger");
              }
              optionsElement.appendChild(feedback);
              
              answersLog.push({
                  question: quizData[currentQuestionIndex].question,
                  selectedAnswer: selectedAnswer,
                  correctAnswer: correctAnswerText,
                  isCorrect: selectedIndex === correctIndex
              });
              
              currentQuestionIndex++;
              setTimeout(() => {
                  if (currentQuestionIndex < quizData.length) {
                      loadQuestion();
                  } else {
                      showResults();
                  }
              }, 1500);
          }
          
          function showResults() {
              questionElement.textContent = "Quiz Completed!";
              optionsElement.innerHTML = "";
              nextButton.style.display = "none";
              resultContainer.innerHTML = "<h2 class='text-center text-primary'>Quiz Summary</h2>";
              resultContainer.classList.add("border", "p-3", "rounded", "bg-white", "shadow");
              
              answersLog.forEach((entry, index) => {
                  let resultItem = document.createElement("div");
                  resultItem.innerHTML = `<strong class='text-dark'>Q${index + 1}: ${entry.question}</strong><br>
                                          Your Answer: <span class='${entry.isCorrect ? "text-success" : "text-danger"}'>${entry.selectedAnswer} ${entry.isCorrect ? "✅" : "❌"}</span><br>
                                          Correct Answer: <span class='text-success'>${entry.correctAnswer}</span><hr>`;
                  resultContainer.appendChild(resultItem);
              });
              
              let finalScore = document.createElement("h3");
              finalScore.textContent = `Final Score: ${answersLog.filter(a => a.isCorrect).length} / ${quizData.length}`;
              finalScore.classList.add("text-center", "fw-bold", "text-primary", "mt-3");
              resultContainer.appendChild(finalScore);
          }
          
          nextButton.style.display = "none";
          loadQuestion();
      })
      .catch(error => console.error("Error loading quiz data:", error));
});
