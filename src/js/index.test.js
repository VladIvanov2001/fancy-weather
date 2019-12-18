const state = require('./index.js');

describe('getStatesAbbrList', () => {
    it('should return list of abbrevisations', () =>{
        expect(state.getStatesAbbrList()).toBeDefined();
    })
});
