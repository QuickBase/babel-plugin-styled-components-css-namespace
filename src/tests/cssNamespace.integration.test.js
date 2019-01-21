import path from 'path';
import React from 'react';
import renderer from 'react-test-renderer';
import { transformFileSync } from 'babel-core';
import 'jest-styled-components';

const evalFixture = filename => {
  const { code } = transformFileSync(filename, {
    plugins: [
      [
        path.join(__dirname, '../index.js'),
        { rawCssNamespace: ['#different-wrapper'] }
      ]
    ]
  });

  if (code == null) throw new Error(`Fixture not found: ${filename}`);

  return eval(code);
};

describe('styled-components output', () => {
  test('for a style block with no selectors', () => {
    const Simple = evalFixture(
      path.join(__dirname, 'fixtures/integration/simple.js')
    );
    expect(
      renderer.create(<Simple backgroundColor="#333" />).toJSON()
    ).toMatchSnapshot();
  });

  test('for a style block with &&', () => {
    const Input = evalFixture(
      path.join(__dirname, 'fixtures/integration/double_ampersand.js')
    );
    expect(
      renderer
        .create(<Input borderWidth="1px" borderColor="fuchsia" />)
        .toJSON()
    ).toMatchSnapshot();
  });

  test('for a style block with a sibling selector', () => {
    const Button = evalFixture(
      path.join(__dirname, 'fixtures/integration/sibling_selector.js')
    );
    expect(
      renderer.create(<Button padding="4px" spaceBetween="8px" />).toJSON()
    ).toMatchSnapshot();
  });

  // ENDLESS LOOP
  // test('for a style block with interpolated selectors', () => {
  //   const Parent = evalFixture(
  //     path.join(__dirname, 'fixtures/interpolated_selector.js')
  //   );
  //   expect(
  //     renderer
  //       .create(
  //         <Parent childStyles="transform: scale(90%);" spaceBetween="12px" />
  //       )
  //       .toJSON()
  //   ).toMatchSnapshot();
  // });
});
