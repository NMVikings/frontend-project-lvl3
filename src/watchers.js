const elements = {
  rssLinkInput: document.querySelector('input[name="rssLink"]'),
  button: document.querySelector('button'),
  feedback: document.querySelector('.feedback'),
  rssItems: document.querySelector('.rss-feeds'),
  rssPosts: document.querySelector('.rss-posts'),
};

const resetFormState = () => {
  elements.button.classList.remove('disabled');
  elements.rssLinkInput.classList.remove('is-invalid');
  elements.rssLinkInput.readOnly = false;
  elements.feedback.classList.remove('text-success', 'text-danger');
  elements.feedback.innerText = '\u00A0';
};

const formHandlers = {
  default: resetFormState,
  success: (message) => {
    resetFormState();
    elements.feedback.innerText = message;
    elements.feedback.classList.add('text-success');
  },
  loading: () => {
    resetFormState();
    elements.rssLinkInput.readOnly = true;
    elements.button.classList.add('disabled');
  },
  error: (errorMessage) => {
    resetFormState();
    elements.rssLinkInput.classList.add('is-invalid');
    elements.feedback.innerText = errorMessage;
    elements.feedback.classList.add('text-success', 'text-danger');
  },
};

const createRssPostElement = ({ link, title }) => `
  <div>
    <a rel='noopener noreferrer' target="_blank" href=${link}>${title}</a>
  </div>
`;

const handlers = {
  form: ({ state, message }) => formHandlers[state](message),
  feeds: () => {},
  posts: (posts) => {
    elements.rssPosts.innerHTML = posts.map(createRssPostElement).join('\n');
  },
};

const watcher = (path, value) => handlers[path](value);

export default watcher;