import * as t from 'babel-types';
import { isStyled } from 'babel-plugin-styled-components/lib/utils/detectors';

const containsInitialSelfReference = css =>
  /^(([^\{]([\w-_,:+\s]+))*\&\s*([^\{]([\w-_,:+\s]+))*)+[\{]/g.test(css.trim());

const getCssNamespace = state => {
  const { cssNamespace, postProcessCssNamespace } = state.opts;
  if (!cssNamespace && !postProcessCssNamespace) {
    return { cssNamespace: '&&', hasNamespaceSelfReference: true };
  }

  if (cssNamespace) {
    const wrapperClass = `.${[].concat(cssNamespace).join(' .')} &`;
    const hasNamespaceSelfReference = containsInitialSelfReference(
      `${wrapperClass} {`
    );
    return { cssNamespace: wrapperClass, hasNamespaceSelfReference };
  }

  if (postProcessCssNamespace) {
    const wrapperClass = `${[].concat(postProcessCssNamespace).join(', ')}`;
    const hasNamespaceSelfReference = containsInitialSelfReference(
      `${wrapperClass} {`
    );

    return { cssNamespace: wrapperClass, hasNamespaceSelfReference };
  }
};

const wrapCssDefinition = (
  cssNamespace,
  css,
  isSelfReferenced,
  shouldLeaveScopeOpen
) =>
  isSelfReferenced
    ? `${cssNamespace} {${css}${shouldLeaveScopeOpen ? '' : '}'}`
    : `${cssNamespace} {&{${css}${shouldLeaveScopeOpen ? '' : '}}'}`;

const NO_STRIP = false;
const STRIP_END_CURLY_BRACKETS = true;

export default (path, state) => {
  const { cssNamespace, hasNamespaceSelfReference } = getCssNamespace(state);

  if (
    isStyled(path.node.tag, state) &&
    path.node.quasi.quasis[0].value.cooked &&
    !path.node.quasi.quasis[0].value.cooked.startsWith(`\n${cssNamespace} {`) &&
    (path.node.tag.property
      ? path.node.tag.property.name !== 'keyframes'
      : true)
  ) {
    const { tag: callee, quasi: { quasis, expressions } } = path.node;

    let values;
    if (quasis.length === 1) {
      values = [
        t.templateElement(
          {
            cooked: `\n${wrapCssDefinition(
              cssNamespace,
              quasis[0].value.cooked,
              hasNamespaceSelfReference ||
                containsInitialSelfReference(quasis[0].value.cooked),
              NO_STRIP
            )}\n`,
            raw: `\n${wrapCssDefinition(
              cssNamespace,
              quasis[0].value.raw,
              hasNamespaceSelfReference ||
                containsInitialSelfReference(quasis[0].value.raw),
              NO_STRIP
            )}\n`
          },
          quasis[0].tail
        )
      ];
    } else {
      const isCookedSelfReferenced =
        hasNamespaceSelfReference ||
        containsInitialSelfReference(quasis[0].value.cooked);
      const isRawSelfReferenced =
        hasNamespaceSelfReference ||
        containsInitialSelfReference(quasis[0].value.raw);

      const first = t.templateElement(
        {
          cooked: `\n${wrapCssDefinition(
            cssNamespace,
            quasis[0].value.cooked,
            isCookedSelfReferenced,
            STRIP_END_CURLY_BRACKETS
          )}`,
          raw: `\n${wrapCssDefinition(
            cssNamespace,
            quasis[0].value.raw,
            isRawSelfReferenced,
            STRIP_END_CURLY_BRACKETS
          )}`
        },
        quasis[0].tail
      );

      const last = t.templateElement(
        {
          cooked: `${quasis[quasis.length - 1].value
            .cooked}${isCookedSelfReferenced ? '}' : '}}'}\n`,
          raw: `${quasis[quasis.length - 1].value.raw}${isRawSelfReferenced
            ? '}'
            : '}}'}\n`
        },
        quasis[quasis.length - 1].tail
      );
      values = [first, ...quasis.slice(1, quasis.length - 1), last];
    }

    path.replaceWith(
      t.taggedTemplateExpression(callee, t.templateLiteral(values, expressions))
    );
  }
};
