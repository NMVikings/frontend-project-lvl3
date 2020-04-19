import onChange from 'on-change';

import i18next from 'i18next';
import watcher from './watchers';
import handleFormSubmit from './handlers';

import en from './locales/en.json';
import ru from './locales/ru.json';

const init = () => {
  i18next.init({
    resources: { en, ru },
    fallbackLng: 'en',
    debug: true,
  }).then(() => {
    const state = onChange({
      form: { state: 'default', message: null },
      feeds: [],
      posts: [],
    }, watcher);

    document.querySelector('form').addEventListener('submit', handleFormSubmit(state));
  });
};

export default init;
