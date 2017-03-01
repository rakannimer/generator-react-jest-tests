// Auto-generated do not edit

/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
import React from 'react';
import renderer from 'react-test-renderer';
import App from '../src/App';

describe('App test', () => {
  it('App should match snapshot', () => {
    const component = renderer.create(<App />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
