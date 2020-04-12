const elements = {
  rssLinkInput: document.querySelector('input[name="rssLink"]'),
  jumbotron: document.querySelector('.jumbotron'),
};

const handlers = {
  'input.error': (error) => {
    if (!error) {
      elements.rssLinkInput.classList.remove('is-invalid');
      elements.jumbotron.querySelector('div.feedback').remove();
      return;
    }
    elements.rssLinkInput.classList.add('is-invalid');
    const errorElement = document.createElement('div');
    errorElement.classList.add('feedback', 'text-success', 'text-danger');
    errorElement.innerText = error;
    elements.jumbotron.appendChild(errorElement);
  },
  feedList: () => {},
};


const handleStateChange = (path, value) => handlers[path](value);

export default handleStateChange;
