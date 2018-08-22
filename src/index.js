import cssNamespace from './visitors';

export default function() {
  return {
    visitor: {
      TaggedTemplateExpression(path, state) {
        cssNamespace(path, state);
      }
    }
  };
}
