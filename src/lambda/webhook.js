
const HipChatNotify = require('hipchat-notify');
let hipchat = new HipChatNotify(4516663, 'tn8neyu93ei7x3jRnYrHuzNtq2RbXXGuIXwZTmwn');

exports.handler = function (event, context, callback) {
    let retval = 200;
    console.log("webhook");
    console.log("event", event);
    console.log("context", context);
    hipchat.notify({
        message: 'webhook, context.clientContext: ' + JSON.stringify(context.clientContext),
        color: 'green'
    });
    hipchat.notify({
        message: 'webhook, event.body: ' + JSON.stringify(event.body),
        color: 'yellow'
    });

    let body = JSON.parse(event.body);
    hipchat.notify({
        message: 'webhook, body.event: ' + JSON.stringify(body.event),
        color: 'red'
    });
    hipchat.notify({
        message: 'webhook, body.user: ' + JSON.stringify(body.user),
        color: 'red'
    });

    hipchat.notify({
        message: 'webhook, returning code : ' + retval,
        color: 'gray'
    });

    if (body.event === 'validate') {
        // only allow signups from ntti3.io domain
        let allow = false;
        if (body.user.email) {
            if (body.user.email.match(/@ntti3.io$/i)) {
                allow = true;
            }
        }

        retval = allow ? 200 : 401;
    }

    callback(null, {
        statusCode: retval
    });
};
