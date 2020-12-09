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
  <li class="list-group-item d-flex justify-content-between align-items-start">
    <a rel='noopener noreferrer' target="_blank" href=${link} class="font-weight-normal">${title}</a>
  </li>
`;

const createRssFeedElement = ({ title, description }) => `
  <li class="list-group-item">
    <h3>${title}</h3>
    <p>${description}</p>
  </li>
`;

const handlers = {
  form: ({ state, error }, elements) => formHandlers[state](elements, error),
  feeds: (feeds, elements) => {
    const feedsHTML = feeds.map(createRssFeedElement).join("\n");

    elements.rssFeeds.innerHTML = `<h2>Feeds</h2><ul class="list-group mb-5">${feedsHTML}</ul>`;
  },
  posts: (posts, elements) => {
    const postsHTML = posts.map(createRssPostElement).join("\n");

    elements.rssPosts.innerHTML = `<h2>Feeds</h2><ul class="list-group">${postsHTML}</ul>`;
  },
};

const watch = (elements) => (path, value) => handlers[path](value, elements);

export default watch;
