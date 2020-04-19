/* eslint-disable no-param-reassign */

import Axios from 'axios';
import Parser from 'rss-parser';
import { nanoid } from 'nanoid';
import i18next from 'i18next';

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

  const corsFreeRssLink = `https://cors-anywhere.herokuapp.com/${rssLink}`;

  Axios.get(corsFreeRssLink).then(({ data }) => {
    const parser = new Parser();
    return parser.parseString(data);
  }).then(({ title, description, items }) => {
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

export default handleFormSubmit;
