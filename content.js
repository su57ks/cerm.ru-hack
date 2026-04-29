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
      background: rgba(100, 255, 65, 0.2);
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(212, 76, 76, 0.2);
      z-index: 10000;
      padding: 15px;
      font-family: Arial, sans-serif;
    ">
      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
        <strong>WGHack</strong>
        <button id="black-theme" style="background: none; border: none; cursor: pointer;">Темный режим</button>
        <button id="close-widget" style="background: none; border: none; cursor: pointer;">✕</button>
      </div>
      <p>Правильный ответ: </p>
    </div>
  `;

  document.body.appendChild(modal);
  document.getElementById('close-widget').addEventListener('click', () => {
    modal.remove();
  });
  document.getElementById('black-theme').addEventListener('click', () => {
    const innerDiv = modal.querySelector('div');
    innerDiv.style.backgroundColor = "rgba(33, 29, 29, 0.2)";
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

  function findAndLogVariants() {
    const variants = document.querySelectorAll('.trainer_variant, [data-id="trainer_variants"] a');

    if (variants.length > 0) {
      const variantTexts = Array.from(variants).map(v => v.textContent);
      console.log('🔘 ВАРИАНТЫ ОТВЕТОВ:', variantTexts.join(', '));
      return variantTexts;
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
          answer = "(раздельно)"
        }
        else if (answer === undefined) {
          variants = findAndLogVariants()
          if (variants.includes("(слитно)")) {
            answer = "(слитно)"
          }
          else {
            answer = "мы не знаем ответ"
          }
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