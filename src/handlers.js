/* eslint-disable no-param-reassign */

import Axios from 'axios';
import Parser from 'rss-parser';
import { nanoid } from 'nanoid';

const handleFormSubmit = (state) => (e) => {
  e.preventDefault();
  state.form = { state: 'loading', message: null };

  const formElem = e.target;
  const formData = new FormData(formElem);
  const rssLink = formData.get('rssLink');

  const isInFeed = state.feeds.find(({ url }) => url === rssLink);

  if (isInFeed) {
    state.form = { state: 'error', message: 'This link is already in the feed!' };
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
    state.form = { state: 'success', message: 'RSS has been loaded' };
    formElem.reset();
  }).catch((err) => {
    state.form = { state: 'error', message: err.message };
  });
};

export default handleFormSubmit;
