[Small Moves](http://smallmoves.club) ([@smallmovesclub](https://twitter.com/smallmovesclub/)) is a motivational Slack community to help people celebrate their litle victories.

It's a humble little experiment meant to get me ([Joost Schuur](http://twitter.com/joostschuur/)) back into the spirit of releasing things and to revitalize my web design and development skills.

Initially, I used [slackform](https://github.com/lucasjgordon/slackform) to invite people via a Typeform signup form with a Parse.com background job, but I wanted something more custom, where I invite people in real time and perform a number of signup related tasks.

Currenly, a Node.js app does the following:

* Logs the new member in a Google Docs spreadsheet
* Issues a Slack invite
* Adds them to a Mailchimp mailing list
* Announces the signup on a private admin group on Slack
* Sends an admin a further notification email

The site is based on [Twenty](http://html5up.net/twenty) from the awesome HTML5 Up.