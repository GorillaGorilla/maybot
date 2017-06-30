
# Botmaster orchestration application template

This is a template of an app that connects to Watson conversation services (WCS) and allows you to access it via a simple html web chat and through fb messenger.

It uses the botmaster framework which allows you to extend easily to other platforms like slack and telegram. It also allows you to use the fulfil framework for accessing oter services. More info on this can be found on the botmasterai website.

### Facebook messenger

follow the steps here: https://developers.facebook.com/docs/messenger-platform/guides/quick-start

The basic summary is you need to:

Make fb developer account (its just activating your normal fb).

Create a new application.

Create a page (this is the fb page people will search and for an access to begin a conversation with your bot). Here is an example of a page: https://www.facebook.com/ericclapton/

Take the app secret and enter it into messenger setting within chat.js file.

Host your application so that your endpoint for the webhook is created, otherwise you wont be able to do the setup webhook stage in the fb guide.