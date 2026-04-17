window.addEventListener('load', () => {
  console.log('Страница загружена, ищу вопрос...');
  
  function findAndLogQuestion() {
    const question = document.querySelector('#trainer_question, .trainer_question, [data-id="trainer_question"]');
    
    if (question && question.textContent !== 'Здесь будет вопрос') {
      console.log('📝 ВОПРОС:', question.textContent.trim());
      return true;
    }
    return false;
  }
  
  if (!findAndLogQuestion()) {
    const observer = new MutationObserver(() => {
      if (findAndLogQuestion()) {
        observer.disconnect(); 
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    console.log('Ожидание появления вопроса...');
  }
});