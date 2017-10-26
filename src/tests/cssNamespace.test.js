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
      title: 'Adds namespace to simple styled-component',
      fixture: path.join(__dirname, './fixtures/simple_styled_component.js')
    },
    {
      title: 'Adds namespace to complex styled-component',
      fixture: path.join(__dirname, './fixtures/complex_styled_component.js')
    },
    {
      title: 'Uses a namespace specified in the options',
      pluginOptions: {
        cssNamespace: 'moreSpecific'
      },
      fixture: path.join(__dirname, './fixtures/complex_styled_component.js')
    },
    {
      title:
        'Does not transform a template string that is not a styled component',
      snapshot: false, // snapshot should be false because code should be unmodified
      fixture: path.join(__dirname, './fixtures/not_styled_component.js')
    }
  ]
});
