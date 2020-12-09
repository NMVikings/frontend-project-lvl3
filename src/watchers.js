import i18next from "i18next";
import find from "lodash/find";
import onChange from "on-change";

const watch = (initState, elements) => {
  /* eslint-disable no-param-reassign */
  const resetFormState = () => {
    elements.button.classList.remove("disabled");
    elements.rssLinkInput.classList.remove("is-invalid");
    elements.rssLinkInput.readOnly = false;
    elements.feedback.classList.remove("text-success", "text-danger");
    elements.feedback.innerText = "\u00A0";
  };

  const formHandlers = {
    empty: resetFormState,
    success: () => {
      resetFormState(elements);
      elements.feedback.innerText = i18next.t("form.success");
      elements.feedback.classList.add("text-success");
      elements.form.reset();
    },
    loading: () => {
      resetFormState(elements);
      elements.rssLinkInput.readOnly = true;
      elements.button.classList.add("disabled");
    },
    error: ({ type, status }) => {
      resetFormState(elements);
      elements.rssLinkInput.classList.add("is-invalid");
      elements.feedback.innerText = i18next.t(`form.errors.${type}`, {
        status,
      });
      elements.feedback.classList.add("text-success", "text-danger");
    },
  };

  const createRssPostElement = ({ link, title, id }, wasSeen) => {
    const linkClass = wasSeen ? "font-weight-normal" : "font-weight-bold";

    return `
      <li class="list-group-item d-flex justify-content-between align-items-start">
        <a rel='noopener noreferrer' target="_blank" data-post-id=${id} href=${link} class="${linkClass}">${title}</a>
        <button
          type="button"
          class="btn btn-primary btn-sm"
          data-post-id=${id}
          data-toggle="modal"
          data-target="#modal"
        >
          ${i18next.t("preview")}
        </button>
      </li>
    `;
  };

  const createRssFeedElement = ({ title, description }) => `
    <li class="list-group-item">
      <h3>${title}</h3>
      <p>${description}</p>
    </li>
  `;

  const renderPosts = (posts, seenPosts) => {
    const postsHTML = posts
      .map((post) => {
        const wasSeen = seenPosts.has(post.id);
        return createRssPostElement(post, wasSeen);
      })
      .join("\n");

    elements.rssPosts.innerHTML = `<h2>Feeds</h2><ul class="list-group">${postsHTML}</ul>`;
  };

  const handlers = {
    form: ({ state: formState, error }) => formHandlers[formState](error),
    feeds: (feeds) => {
      const feedsHTML = feeds.map(createRssFeedElement).join("\n");

      elements.rssFeeds.innerHTML = `<h2>Feeds</h2><ul class="list-group mb-5">${feedsHTML}</ul>`;
    },
    posts: (posts) => {
      renderPosts(posts, initState.ui.seenPosts);
    },
    "ui.seenPosts": (seenPosts) => {
      renderPosts(initState.posts, seenPosts);
    },
    "modal.postId": (id) => {
      const { title, description, link } = find(initState.posts, { id });
      const submitButton = elements.modal.querySelector(".btn-primary");

      submitButton.href = link;
      submitButton.innerText = i18next.t("modal.buttons.submit");
      elements.modal.querySelector(".modal-title").innerText = title;
      elements.modal.querySelector(".modal-body").innerText = description;
      elements.modal.querySelector(".btn-secondary").innerText = i18next.t(
        "modal.buttons.close"
      );
    },
  };

  const watchedState = onChange(initState, (path, value) =>
    handlers[path](value)
  );

  return watchedState;
};

export default watch;
