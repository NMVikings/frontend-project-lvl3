/* eslint-disable no-param-reassign */
import "bootstrap";
import i18next from "i18next";
import { nanoid } from "nanoid";
import Axios from "axios";
import { string, ValidationError } from "yup";
import differenceBy from "lodash/differenceBy";

import watch from "./watchers";

import en from "./locales/en.json";
import ru from "./locales/ru.json";
import parseRss from "./rss";

const fetchingTimeout = 5000;

const fetchRssFeed = (rssLink) => {
  const corsFreeRssLink = `https://cors-anywhere.herokuapp.com/${rssLink}`;

  return Axios.get(corsFreeRssLink).then(({ data }) => parseRss(data));
};

const fetchNewPosts = (state) => {
  const promises = state.feeds.map(({ url, id: feedId }) =>
    fetchRssFeed(url)
      .then(({ items }) => {
        const oldPosts = state.posts.filter((post) => feedId === post.feedId);
        const newPosts = differenceBy(items, oldPosts, "link").map((post) => ({
          ...post,
          feedId,
          id: nanoid(),
        }));

        state.posts.unshift(...newPosts);
      })
      .catch(() => null)
  );

  Promise.allSettled(promises).then(() => {
    setTimeout(() => fetchNewPosts(state), fetchingTimeout);
  });
};

const validateUrl = (url, feeds) => {
  const rssLinks = feeds.map((feed) => feed.url);
  const rssLinkSchema = string()
    .required("url.required")
    .url("url.invalid")
    .notOneOf(rssLinks, "url.exists");

  rssLinkSchema.validateSync(url);
};

const handleFormSubmit = (state) => (e) => {
  e.preventDefault();
  state.form = { state: "loading", error: null };

  const formElem = e.target;
  const formData = new FormData(formElem);
  const rssLink = formData.get("rssLink");

  try {
    validateUrl(rssLink, state.feeds);
  } catch (err) {
    if (err instanceof ValidationError) {
      state.form = { state: "error", error: { type: err.message } };
      return;
    }

    throw err;
  }

  fetchRssFeed(rssLink)
    .then(({ title, description, items }) => {
      const feedId = nanoid();
      const posts = items.map((item) => ({ ...item, id: nanoid(), feedId }));
      state.feeds.unshift({
        url: rssLink,
        id: feedId,
        title,
        description,
      });
      state.posts.unshift(...posts);
      state.form = { state: "success" };
    })
    .catch(({ response }) => {
      if (!response) {
        state.form = { state: "error", error: { type: "offline" } };
        return;
      }
      state.form = {
        state: "error",
        error: { type: "network", status: response.status },
      };
    });
};

const init = () => {
  i18next
    .init({
      resources: { en, ru },
      fallbackLng: "en",
    })
    .then(() => {
      const elements = {
        rssLinkInput: document.querySelector('input[name="rssLink"]'),
        button: document.querySelector("button"),
        feedback: document.querySelector(".feedback"),
        rssFeeds: document.querySelector(".feeds"),
        rssPosts: document.querySelector(".posts"),
        form: document.querySelector("form"),
        modal: document.querySelector(".modal"),
      };

      const initState = {
        form: { state: "empty", error: null },
        feeds: [],
        posts: [],
        modal: { postId: null },
        ui: { seenPosts: new Set() },
      };

      const watchedState = watch(initState, elements);

      elements.rssPosts.addEventListener(
        "click",
        ({
          target: {
            dataset: { postId },
          },
        }) => {
          if (!postId) return;

          watchedState.modal.postId = postId;
          watchedState.ui.seenPosts.add(postId);
        }
      );

      fetchNewPosts(watchedState);
      document
        .querySelector("form")
        .addEventListener("submit", handleFormSubmit(watchedState));
    });
};

export default init;
