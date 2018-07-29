import pluginTester from 'babel-plugin-tester';
import plugin from '../index';
import path from 'path';

pluginTester({
  plugin,
  pluginName: 'styled-components-css-namespace',
  filename: __filename,
  // fixtures: path.join(__dirname, './fixtures'),
  snapshot: true,
  tests: [
    {
      title: 'adds namespace to simple styled-component',
      fixture: path.join(__dirname, './fixtures/simple_styled_component.js')
    },

    {
      title: 'adds namespace to complex styled-component',
      fixture: path.join(__dirname, './fixtures/complex_styled_component.js')
    },
    {
      title: 'uses a namespace specified in the options',
      pluginOptions: {
        cssNamespace: 'moreSpecific'
      },
      fixture: path.join(__dirname, './fixtures/complex_styled_component.js')
    },
    {
      title: 'uses an array of namespaces specified in the options',
      pluginOptions: {
        cssNamespace: ['specific', 'verySpecific', 'extraSpecific']
      },
      fixture: path.join(__dirname, './fixtures/complex_styled_component.js')
    },
    {
      title:
        'does not transform a template string that is not a styled component',
      snapshot: false, // snapshot should be false because code should be unmodified
      fixture: path.join(__dirname, './fixtures/not_styled_component.js')
    },
    {
      title: 'does not add extra selectors to child helper styles',
      fixture: path.join(
        __dirname,
        './fixtures/nested_helper_styled_component.js'
      )
    },
    {
      title: 'does not add namespace to keyframes',
      pluginOptions: {
        cssNamespace: 'specific'
      },
      fixture: path.join(__dirname, './fixtures/keyframes_styled_component.js')
    },
    {
      title: 'adds namespace to extended styled-components',
      fixture: path.join(__dirname, './fixtures/extended_styled_component.js')
    },

    {
      title:
        'uses a namespace specified in the options as simple wrapper raw wrapper',
      pluginOptions: {
        rawCssNamespace: 'body .specific .rule'
      },
      fixture: path.join(__dirname, './fixtures/complex_styled_component.js')
    },
    {
      title:
        'uses an array of namespaces specified in the options as simple wrapper raw wrapper',
      pluginOptions: {
        rawCssNamespace: ['body .specific .rule', 'body.roots .rules']
      },
      fixture: path.join(__dirname, './fixtures/complex_styled_component.js')
    },
    {
      title:
        'does not add namespace to keyframes as part of the simple raw wrapper',
      pluginOptions: {
        rawCssNamespace: 'body .specific .rule'
      },
      fixture: path.join(__dirname, './fixtures/keyframes_styled_component.js')
    },
    {
      title:
        'creates wrappers as part of the simple raw wrapper not affecting css rules applied in the styled components',
      pluginOptions: {
        rawCssNamespace: ['body .specific .rule', '#different-wrapper']
      },
      fixture: path.join(__dirname, './fixtures/compost_styled_component.js')
    },
    {
      title:
        'creates wrappers as part of the simple raw wrapper not affecting css rules applied in the styled components',
      pluginOptions: {
        rawCssNamespace: ['body .specific .rule', '#different-wrapper']
      },
      fixture: path.join(
        __dirname,
        './fixtures/double_self_refs_styled_component.js'
      )
    }
  ]
});
