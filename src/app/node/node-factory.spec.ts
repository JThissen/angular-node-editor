import { NodeFactory } from './node-factory';

describe('Nodes', () => {
  it('should create an instance', () => {
    expect(new NodeFactory()).toBeTruthy();
  });
});
