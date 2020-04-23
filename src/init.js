/* eslint-disable no-param-reassign */
import onChange from 'on-change';
import i18next from 'i18next';
import { nanoid } from 'nanoid';
import Axios from 'axios';
import Parser from 'rss-parser';

import watcher from './watchers';

import en from './locales/en.json';
import ru from './locales/ru.json';

const fetchingTimeout = 5000;

const fetchRssFeed = (rssLink) => {
  const corsFreeRssLink = `https://cors-anywhere.herokuapp.com/${rssLink}`;

  return Axios.get(corsFreeRssLink).then(({ data }) => {
    const parser = new Parser();
    return parser.parseString(data);
  });
};

const fetchNewPosts = (state) => {
  const promises = state.feeds.map(({ url, id: feedId }) => fetchRssFeed(url)
    .then(({ items }) => {
      const oldPosts = state.posts.filter((post) => feedId === post.feedId);
      const newPosts = items
        .filter((item) => oldPosts.every((post) => item.link !== post.link))
        .map((post) => ({ ...post, feedId, id: nanoid() }));

      state.posts.unshift(...newPosts);
    })
    .catch(() => null));

  Promise.all(promises).finally(() => {
    setTimeout(() => fetchNewPosts(state), fetchingTimeout);
  });
};


const handleFormSubmit = (state) => (e) => {
  e.preventDefault();
  state.form = { state: 'loading', message: null };

  const formElem = e.target;
  const formData = new FormData(formElem);
  const rssLink = formData.get('rssLink');

  const isInFeed = state.feeds.find(({ url }) => url === rssLink);

  if (isInFeed) {
    state.form = { state: 'error', message: i18next.t('form.errors.duplicate') };
    return;
  }

  fetchRssFeed(rssLink).then(({ title, description, items }) => {
    const feedId = nanoid();
    const posts = items.map((item) => ({ ...item, id: nanoid(), feedId }));
    state.feeds.unshift({
      url: rssLink, id: feedId, title, description,
    });
    state.posts.unshift(...posts);
    state.form = { state: 'success', message: i18next.t('form.success') };
    formElem.reset();
  }).catch(({ response: { status } }) => {
    state.form = { state: 'error', message: i18next.t('form.errors.network', { status }) };
  });
};

const init = () => {
  i18next.init({
    resources: { en, ru },
    fallbackLng: 'en',
  }).then(() => {
    const state = onChange({
      form: { state: 'default', message: null },
      feeds: [],
      posts: [],
    }, watcher);

    fetchNewPosts(state);
    document.querySelector('form').addEventListener('submit', handleFormSubmit(state));
  });
};

export default init;
