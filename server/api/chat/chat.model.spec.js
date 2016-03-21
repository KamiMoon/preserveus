'use strict';

var should = require('should');
var Chat = require('./chat.model');

var chat = new Chat({
    users: [{
        user_id: '56524e5f5435d775906b7cb4'
    }, {
        user_id: '5674d7719fc3b57463129cf4'
    }],
    messages: [{
        user_id: '5674d7719fc3b57463129cf4',
        text: 'hi'
    }, {
        user_id: '5674d7719fc3b57463129cf4',
        text: 'hows it going?'
    }, {
        user_id: '56524e5f5435d775906b7cb4',
        text: 'great'
    }]
});

describe('Chat Model', function() {
    before(function(done) {
        // Clear chats before testing
        Chat.remove().exec().then(function() {
            done();
        });
    });

    afterEach(function(done) {
        Chat.remove().exec().then(function() {
            done();
        });
    });

    it('should begin with no chats', function(done) {
        Chat.find({}, function(err, chats) {
            chats.should.have.length(0);
            done();
        });
    });

    it('should fail when saving a duplicate chat', function(done) {
        chat.save(function() {
            var chatDup = new Chat(chat);
            chatDup.save(function(err) {
                should.exist(err);
                done();
            });
        });
    });

    it('should find chats for a specific user', function(done) {
        chat.save(function(err, chat) {

            console.log(chat);

            Chat.find({}, function(err, chats) {
                chats.should.have.length(1);
                done();
            });
        });



    });

});
