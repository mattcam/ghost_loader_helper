# ghost_loader_helper

> help with migrating data from early version of ghost to current

**IMPORTANT :- this is not production code! test before use in production.**

The reason that this repo is shared is to provide a starting point for migrating post and tag data from an early version of ghost to the current version of ghost.

It took me some time to find all the bits to batch load posts and tags. So I thought might be a good idea to share. Hopefully learnings and hints here will help save you some time.

Yes I know that this is this information is very sparse. Motivation for sharing is to help. Let me know questions on [issue](https://github.com/mattcam/ghost_loader_helper/issues).

Refer to `app.js` for all `process.env.`.

Note also that if have a number of posts to load and you are hosting on Heroku then you will need to have a paid Leopard JawsDB MySQL resource plan.
