

import DATA from './dataTicket__11.js';



// Переменная пустой объект куда будем сохранять ответы на вопросы
let localResults = {};


//Получаем все id и помещаем в переменные
const rules = document.getElementById('rules')
const questions = document.getElementById('questions')
const indicator = document.getElementById('indicator')
const results = document.getElementById('result')
const btnNext = document.getElementById('btn-next')
const btnRestart = document.getElementById('btn-restart')

// Функция отвечает за рендер вопросов
const renderQuestions = (index) => {


  renderIndecators(index + 1);


  // Берём наши вопросы и через атрибут вызываем наш шаг, который равен index
  questions.dataset.currentStep = index;


  // функция отвечает за рендер ответов
  const renderAnswers = () =>

    // вернуть данные из массива через метод map() который позволяет трансформировать один массив в другой при помощи функций-колбэка. Переданная функция будет вызвана для каждого элемента массва по порядку. Из результатов вызовов функции будет собран новый массив.

    DATA[index].answer
      .map((answer) =>
        `
              <li class="rules-questions-item__answer-item">
                <label>
                  <input class="answer-input" type="radio" name=${index} value=${answer.id}>
                    ${answer.value}
                </label>
              </li>
          `
      )
      .join('');

  // Рендер вопросов будет отоброжать только один вопрос на странице
  questions.innerHTML = `
      <div class="rules-questions-item">
        <img src=${DATA[index].link}>
          <div class="rules-questions-item__question">${DATA[index].question}</div>
            <ul class="rules-questions-item__answer">
          ${renderAnswers()}
        </ul>
      </div>
  `;
};





// Функция отвечает за рендер ответов
const renderResults = () => {
  let content = '';

  const getClassname = (answer, questionIndex) => {
    let classname = '';

    if (!answer.correct && answer.id === localResults[questionIndex]) {
      classname = 'answer--invalid';
    } else if (answer.correct) {
      classname = 'answer--valid';
    }
    return classname;
  }

  const getAnswers = (questionIndex) =>
    DATA[questionIndex].answer
      .map((answer) => `<li class=${getClassname(answer, questionIndex)}>${answer.value}</li>`)
      .join('');


  DATA.forEach((question, index) => {
    content += `
        <div class="rules-results-item">
          <div class="rules-results-item__question">${question.question}</div>
          <ul class="rules-results-item__answer">${getAnswers(index)}</ul>
        </div>
    `
  })

  results.innerHTML = content;
};




// Функция отвечает за рендер индекаторов
const renderIndecators = (currentStep) => {
  indicator.innerHTML = `${currentStep}/${DATA.length}`;
};



// Добавляем слушатель события на изменение состояния ответа
rules.addEventListener('change', (e) => {
  if (e.target.classList.contains('answer-input')) {
    // Берём переменную в которой будем хранить результат отвтета
    localResults[e.target.name] = e.target.value;
    // после того как пользователь выбрал ответ мы делаем кнопку "Далее" активной
    btnNext.disabled = false;
  }
  //Логика ответа
});



// Добавляем слушатель события клик на кнопку
rules.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-next')) {
    const nextQuestionIndex = Number(questions.dataset.currentStep) + 1;
    // Рендер следущего вопроса текущий шаг + 1 и её надо превести к числу


    if (DATA.length === nextQuestionIndex) {
      questions.classList.add('questions--hidden');
      indicator.classList.add('indicator--hidden');
      results.classList.add('results--visible');
      btnNext.classList.add('btn-next--hidden');
      btnRestart.classList.add('btn-restart--visible');

      //Переход к результатам
      renderResults();
    } else {
      //Переход к следующему вопросу
      renderQuestions(nextQuestionIndex);
    }


    // Когда ответ не выбран и/или мы перешли к новому вопросу, кнопка "Далее" выключена.
    btnNext.disabled = true;
  }
  if (e.target.classList.contains('btn-restart')) {
    //Сбрасываем ответы
    localResults = {};
    //Очищаем результаты
    results.innerHTML = '';

    questions.classList.remove('questions--hidden');
    indicator.classList.remove('indicator--hidden');
    results.classList.remove('results--visible');
    btnNext.classList.remove('btn-next--hidden');
    btnRestart.classList.remove('btn-restart--visible');

    // Переходим к рендеру првого вопроса
    renderQuestions(0);
  }
  // Вперёд или рестарт

});

renderQuestions(0);