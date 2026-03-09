(function () {
  const body = document.body;
  const modeButtons = document.querySelectorAll('[data-set-mode]');
  const languageButtons = document.querySelectorAll('[data-set-language]');

  function updateActive(buttons, key, value) {
    buttons.forEach((button) => {
      const isActive = button.dataset[key] === value;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-selected', String(isActive));
    });
  }

  modeButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const mode = button.dataset.setMode;
      body.setAttribute('data-mode', mode);
      updateActive(modeButtons, 'setMode', mode);
    });
  });

  languageButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const language = button.dataset.setLanguage;
      body.setAttribute('data-language', language);
      updateActive(languageButtons, 'setLanguage', language);
      document.documentElement.lang = language === 'ko' ? 'ko' : 'en';
    });
  });
})();
