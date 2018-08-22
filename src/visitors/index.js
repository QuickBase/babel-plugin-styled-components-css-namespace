import parseCssNamespace from './cssNamespace';
import parseRawCssNamespace from './rawCssNamespace';

export default (path, state) => {
  const { cssNamespace, rawCssNamespace } = state.opts;
  console.log(
    '{ cssNamespace, rawCssNamespace }:',
    JSON.stringify({ cssNamespace, rawCssNamespace })
  );
  if (cssNamespace) {
    parseCssNamespace(path, state, cssNamespace);
  }

  if (rawCssNamespace) {
    parseRawCssNamespace(path, state, rawCssNamespace);
  }
};
