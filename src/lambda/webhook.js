
const request = require('request');

const HipChatNotify = require('hipchat-notify');
let hipchat = new HipChatNotify(4516663, 'tn8neyu93ei7x3jRnYrHuzNtq2RbXXGuIXwZTmwn');

exports.handler = function (event, context, callback) {
    let retval = 200;
    console.log("webhook");
    console.log("event", event);
    console.log("context", context);
    hipchat.notify({
        message: 'webhook, context.clientContext: ' + JSON.stringify(context.clientContext) +
        ' the token is ' + context.clientContext.identity.token + ' and the url is ' +
        context.clientContext.identity.url,
        color: 'green'
    });
    let body = JSON.parse(event.body);
    hipchat.notify({
        message: 'webhook, body.event: ' + JSON.stringify(body.event),
        color: 'yellow'
    });
    hipchat.notify({
        message: 'webhook, body.user: ' + JSON.stringify(body.user),
        color: 'yellow'
    });

    if (body.event === 'validate') {
        // only allow signups from ntti3.io domain
        let allow = false;
        if (body.user.email) {
            hipchat.notify({
                message: 'EXAMINE: email of new user ' + body.user.email,
                color: 'red'
            });

            if (body.user.email.match(/@ntti3.io$/i)) {
                allow = true;
            }
        }

        retval = allow ? 200 : 401;
    }
    else if (body.event === 'signup') {
        // figure out how to give the 'admin' role to the newly signed up user
        hipchat.notify({
            message: 'TODO: give admin role to new user ' + body.user.email,
            color: 'red'
        });

        // https://github.com/netlify/gotrue
        // use the PUT /user api endpoint

        // {"app_metadata": {"authorization": {"roles": ["admin"]}}}
    }
    else if (body.event === 'login') {
        hipchat.notify({
            message: 'TODO: do whatever for login of user ' + body.user.email,
            color: 'red'
        });

        // https://github.com/request/request
        let options = {
            url: context.clientContext.identity.url + '/user',
            method: 'GET',
            headers:{
                Authorization: 'Bearer ' + context.clientContext.identity.token
            }
        };

        request.get(options, function(error, response, body) {
            hipchat.notify({
                message: 'webhook, request returned error: ' + error +
                ' response: ' + response + ' body: ' + body,
                color: 'purple'
            });
        });
    }

    hipchat.notify({
        message: 'webhook, returning code : ' + retval,
        color: 'red'
    });

    callback(null, {
        statusCode: retval
    });
};
