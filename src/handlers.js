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

  const isInFeed = state.feedList.find(({ url }) => url === rssLink);

  if (isInFeed) {
    state.form = { state: 'error', message: 'This link is already in the feed!' };
    return;
  }

  Axios.get(rssLink).then(({ data }) => {
    const parser = new Parser();
    return parser.parseString(data);
  }).then(({ title, description, items }) => {
    const patchedItems = items.map((item) => ({ ...item, id: nanoid() }));
    state.feedList.push({
      url: rssLink, title, description, posts: patchedItems, id: nanoid(),
    });
    state.form = { state: 'success', message: 'RSS has been loaded' };
    formElem.reset();
  }).catch((err) => {
    state.form = { state: 'error', message: err.message };
  });
};

export default handleFormSubmit;
