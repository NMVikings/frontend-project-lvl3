import onChange from 'on-change';

import watcher from './watchers';
import handleFormSubmit from './handlers';

const init = () => {
  const state = onChange({
    form: { state: 'default', message: null },
    feedList: [],
  }, watcher);

  document.querySelector('form').addEventListener('submit', handleFormSubmit(state));
};

export default init;
