/* eslint-disable no-param-reassign */

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

  state.feedList.push({ url: rssLink });
  state.input.error = null;
  formElem.reset();
};

export default handleFormSubmit;
