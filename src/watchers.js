import i18next from "i18next";

/* eslint-disable no-param-reassign */
const resetFormState = (elements) => {
  elements.button.classList.remove("disabled");
  elements.rssLinkInput.classList.remove("is-invalid");
  elements.rssLinkInput.readOnly = false;
  elements.feedback.classList.remove("text-success", "text-danger");
  elements.feedback.innerText = "\u00A0";
};

const formHandlers = {
  empty: resetFormState,
  success: (elements) => {
    resetFormState(elements);
    elements.feedback.innerText = i18next.t("form.success");
    elements.feedback.classList.add("text-success");
    elements.form.reset();
  },
  loading: (elements) => {
    resetFormState(elements);
    elements.rssLinkInput.readOnly = true;
    elements.button.classList.add("disabled");
  },
  error: (elements, { type, status }) => {
    resetFormState(elements);
    elements.rssLinkInput.classList.add("is-invalid");
    elements.feedback.innerText = i18next.t(`form.errors.${type}`, { status });
    elements.feedback.classList.add("text-success", "text-danger");
  },
};

const createRssPostElement = ({ link, title }) => `
  <div>
    <a rel='noopener noreferrer' target="_blank" href=${link}>${title}</a>
  </div>
`;

const createRssFeedElement = ({ title, description }) => `
  <div class="mb-3">
    <p class="lead mb-1">${title}</p>
    <p class="small mb-0">${description}</p>
  </div>
`;

const handlers = {
  form: ({ state, error }, elements) => formHandlers[state](elements, error),
  feeds: (feeds, elements) => {
    elements.rssFeeds.innerHTML = feeds.map(createRssFeedElement).join("\n");
  },
  posts: (posts, elements) => {
    elements.rssPosts.innerHTML = posts.map(createRssPostElement).join("\n");
  },
};

const watch = (elements) => (path, value) => handlers[path](value, elements);

export default watch;
