import React from 'react';
import { ApplicationConsumer } from '../application.tsx';

describe('Application Consumer', () => {

    it('should export the consumer component', () => {
        expect(ApplicationConsumer).toBeDefined();
        expect(typeof ApplicationConsumer).toEqual('object');
    });

});
