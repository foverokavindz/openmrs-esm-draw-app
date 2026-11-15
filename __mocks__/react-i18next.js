const React = require('react');

const hasChildren = (node) => node && (node.children || (node.props && node.props.children));

const getChildren = (node) => (node && node.children ? node.children : node.props && node.props.children);

const renderNodes = (reactNodes) => {
  if (typeof reactNodes === 'string') {
    return reactNodes;
  }

  return Object.keys(reactNodes).map((key, i) => {
    const child = reactNodes[key];
    const isElement = React.isValidElement(child);

    if (typeof child === 'string') {
      return child;
    }
    if (hasChildren(child)) {
      const inner = renderNodes(getChildren(child));
      return React.cloneElement(child, { ...child.props, key: i }, inner);
    }
    if (typeof child === 'object' && !isElement) {
      return Object.keys(child).reduce((str, childKey) => `${str}${child[childKey]}`, '');
    }

    return child;
  });
};

const useMock = [(key) => key, {}];

useMock.t = (key, defaultValue, options = {}) => {
  let translatedString = defaultValue || key;
  Object.entries(options).forEach(([k, v]) => {
    if (key !== 'interpolation') {
      translatedString = translatedString.replace(new RegExp(`{{${k}}}`, 'g'), v);
    }
  });

  return translatedString;
};

useMock.i18n = { language: 'en_US' };

module.exports = {
  useTranslation: () => useMock,
  Trans: ({ children }) => React.createElement(React.Fragment, null, renderNodes(children)),
};
