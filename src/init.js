/* eslint-disable no-param-reassign */
import onChange from 'on-change';
import i18next from 'i18next';
import { nanoid } from 'nanoid';
import Axios from 'axios';
import Parser from 'rss-parser';
import differenceBy from 'lodash/differenceBy';

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
      const newPosts = differenceBy(items, oldPosts, 'link')
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
  state.form = { state: 'loading', error: null };

  const formElem = e.target;
  const formData = new FormData(formElem);
  const rssLink = formData.get('rssLink');

  const isInFeed = state.feeds.find(({ url }) => url === rssLink);

  if (isInFeed) {
    state.form = { state: 'error', error: { type: 'duplicate' } };
    return;
  }

  fetchRssFeed(rssLink).then(({ title, description, items }) => {
    const feedId = nanoid();
    const posts = items.map((item) => ({ ...item, id: nanoid(), feedId }));
    state.feeds.unshift({
      url: rssLink, id: feedId, title, description,
    });
    state.posts.unshift(...posts);
    state.form = { state: 'success' };
  }).catch(({ response }) => {
    if (!response) {
      state.form = { state: 'error', error: { type: 'offline' } };
    }
    state.form = { state: 'error', error: { type: 'network', status: response.status } };
  });
};

const init = () => {
  i18next.init({
    resources: { en, ru },
    fallbackLng: 'en',
  }).then(() => {
    const elements = {
      rssLinkInput: document.querySelector('input[name="rssLink"]'),
      button: document.querySelector('button'),
      feedback: document.querySelector('.feedback'),
      rssFeeds: document.querySelector('.rss-feeds'),
      rssPosts: document.querySelector('.rss-posts'),
      form: document.querySelector('form'),
    };

    const state = onChange({
      form: { state: 'empty', error: null },
      feeds: [],
      posts: [],
    }, watcher(elements));


    fetchNewPosts(state);
    document.querySelector('form').addEventListener('submit', handleFormSubmit(state));
  });
};

export default init;
