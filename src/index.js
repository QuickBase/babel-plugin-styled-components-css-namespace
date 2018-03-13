import cssNamespace from './visitors/cssNamespace';

export default function() {
  return {
    visitor: {
      TaggedTemplateExpression(path, state) {
        cssNamespace(path, state);
      }
    }
  };
}
