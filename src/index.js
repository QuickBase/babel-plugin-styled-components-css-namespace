import cssNamespace from './visitors/cssNamespace';

export default function({ types: t }) {
  return {
    visitor: {
      TaggedTemplateExpression(path, state) {
        cssNamespace(path, state);
      }
    }
  };
}
