window.addEventListener('load', () => {
  console.log('Страница загружена, начинаю поиск...');

  const modal = document.createElement('div');
  modal.id = 'my-extension-widget';
  modal.innerHTML = `
    <div style="
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 200px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(212, 76, 76, 0.2);
      z-index: 10000;
      padding: 15px;
      font-family: Arial, sans-serif;
    ">
      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
        <strong>WGHack</strong>
        <button id="close-widget" style="background: none; border: none; cursor: pointer;">✕</button>
      </div>
      <p>Правильный ответ: </p>
    </div>
  `;

  document.body.appendChild(modal);
  document.getElementById('close-widget').addEventListener('click', () => {
    modal.remove();
  });

  var last = ""

  function findAndLogQuestion() {
    const question = document.querySelector('#trainer_question, .trainer_question, [data-id="trainer_question"]');

    if (question && question.textContent !== 'Здесь будет вопрос') {
      console.log('📝 ВОПРОС:', question.textContent.trim());
      return question.textContent.trim();
    }
    return false;
  }

  if (!findAndLogQuestion()) {
    const observer = new MutationObserver(() => {
      if (findAndLogQuestion()) {
        question = findAndLogQuestion()
        console.log('✅ Вопрос найден!');
        const xhr = new XMLHttpRequest();
        xhr.open('GET', chrome.runtime.getURL('answers.json'), false);
        xhr.send();
        console.log(xhr.status)
        const data = JSON.parse(xhr.responseText);
        answer = data[question]
        if (answer === " ") {
          answer = "пробел"
        }
        else if (answer === undefined) {
          answer = "либо слитно, либо мы не знаем ответ"
        }
        console.log("ПРАВИЛЬНЫЙ ОТВЕТ:", answer);
        if (last != question) {
          last = question
          modal.querySelector('p').textContent = "Правильный ответ: " + answer;
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributeFilter: ["trainer_question"]
    });

    console.log('⏳ Ожидание появления вопроса...');
  }

  setTimeout(() => {
    findAndLogVariants();
  }, 1000);
});