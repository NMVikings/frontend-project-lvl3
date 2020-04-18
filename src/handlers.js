/* eslint-disable no-param-reassign */

import Axios from 'axios';
import Parser from 'rss-parser';
import { nanoid } from 'nanoid';

const handleFormSubmit = (state) => (e) => {
  e.preventDefault();

  const formElem = e.target;
  const formData = new FormData(formElem);
  const rssLink = formData.get('rssLink');

  const isInFeed = state.feedList.find(({ url }) => url === rssLink);

  if (isInFeed) {
    state.input.error = 'This link is already in the feed!';
    return;
  }

  try {
    Axios.get(rssLink).then(({ data }) => {
      const parser = new Parser();
      return parser.parseString(data);
    }).then(({ title, description, items }) => {
      const patchedItems = items.map((item) => ({ ...item, id: nanoid() }));
      state.feedList.push({
        url: rssLink, title, description, posts: patchedItems, id: nanoid(),
      });
      state.input.error = null;
      formElem.reset();
    });
  } catch (err) {
    state.input.error = err.message;
  }
};

export default handleFormSubmit;
