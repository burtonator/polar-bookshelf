import {Mailchimp} from './Mailchimp';

xdescribe('Mailchimp', function() {

    it("basic", async function() {

        this.timeout(5000);

        await Mailchimp.subscribe('burtonator+test101@gmail.com', 'Kevin Burton');

    });

});
