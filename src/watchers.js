const elements = {
  rssLinkInput: document.querySelector('input[name="rssLink"]'),
  button: document.querySelector('button'),
  jumbotron: document.querySelector('.jumbotron'),
};

const createFeedbackElement = (message) => {
  const element = document.createElement('div');
  element.classList.add('feedback', 'text-success');
  element.innerText = message;

  return element;
};

const resetFormState = () => {
  elements.button.classList.remove('disabled');
  elements.rssLinkInput.classList.remove('is-invalid');
  elements.rssLinkInput.readOnly = false;
  const feedbackElement = elements.jumbotron.querySelector('div.feedback');
  if (feedbackElement) feedbackElement.remove();
};

const formHandlers = {
  default: resetFormState,
  success: (message) => {
    resetFormState();
    const successElement = createFeedbackElement(message);
    elements.jumbotron.appendChild(successElement);
  },
  loading: () => {
    resetFormState();
    elements.rssLinkInput.readOnly = true;
    elements.button.classList.add('disabled');
  },
  error: (errorMessage) => {
    resetFormState();
    elements.rssLinkInput.classList.add('is-invalid');
    const errorElement = createFeedbackElement(errorMessage, ['text-danger']);
    errorElement.classList.add('text-danger');
    elements.jumbotron.appendChild(errorElement);
  },
};

const handlers = {
  form: ({ state, message }) => formHandlers[state](message),
  feedList: (feedlist) => {
    console.warn(feedlist);
  },
};

const watcher = (path, value) => handlers[path](value);

export default watcher;
