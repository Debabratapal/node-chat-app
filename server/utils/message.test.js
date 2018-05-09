const expect = require('expect');

const {generateMessage} = require('./message');


describe('generateMessage', () => {
  it('should generate corrent message object', () =>{
    var from = 'Debabrata';
    var text ='some message';

    var message = generateMessage(from, text);

    expect(message.createAt).toBeA('number');
    expect(message).toInclude({from, text});

  });
});
