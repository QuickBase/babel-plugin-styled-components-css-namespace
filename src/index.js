import updatedCssNamespace from './visitors/updatedCssNamespace';

export default function() {
  return {
    visitor: {
      TaggedTemplateExpression(path, state) {
        updatedCssNamespace(path, state);
      }
    }
  };
}
