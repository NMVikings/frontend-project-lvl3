const getNodeText = (node, nodeName) =>
  node.querySelector(nodeName).textContent;

const getRssItemData = (itemNode) => {
  const fields = ["title", "description", "link"].map((name) => [
    name,
    getNodeText(itemNode, name),
  ]);

  return Object.fromEntries(fields);
};

const parseRss = (data) => {
  const parser = new DOMParser();
  const rss = parser.parseFromString(data, "text/xml");

  const title = getNodeText(rss, "channel > title");
  const description = getNodeText(rss, "channel > description");
  const items = Array.from(rss.querySelectorAll("item")).map(getRssItemData);

  return { title, description, items };
};

export default parseRss;
