import onChange from 'on-change';

import handleStateChange from './views';
import handleFormSubmit from './handlers';

const init = () => {
  const state = onChange({
    input: { error: null },
    feedList: [],
  }, handleStateChange);

  document.querySelector('form').addEventListener('submit', handleFormSubmit(state));
};

export default init;
