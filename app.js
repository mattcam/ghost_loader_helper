require('dotenv').config()
const _ = require('underscore')
const async = require('async')
const jsonfile = require('jsonfile')
const axios = require('axios')
const converter = require('@tryghost/html-to-mobiledoc')

const file = process.env.SOURCE
jsonfile.readFile(file, function (err, obj) {
  if (err) console.error(err)


var sleep = require('system-sleep');

var tags=[];
var posts=[]

let access_token;

  async.series([

  	function(done_token) {
  	  axios({
        method: 'post',
        url: process.env.ENDPOINT+'authentication/token',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
  	      'grant_type': 'password',
  	      'username': process.env.USER_NAME,
  	      'password': process.env.PASSWORD,
  	      'client_id': process.env.CLIENT_ID,
  	      'client_secret': process.env.CLIENT_SECRET
        }
     })
	 .catch(function (error) {
       console.error(error);
	  }) 	  
     .then(function (response) {
        access_token = response.data.access_token;
  		done_token(null, 'got token - '+ access_token);
     });
  	},

    function(done_tags) {

      var i=0;

      async.each(obj.db[0].data.tags, function(item, callback) {

        tags.push({id:item.id,name:item.name})

  	    axios({
          method: 'post',
          url: process.env.ENDPOINT+'tags',
	      headers: {
	      	'Authorization': 'Bearer '+access_token,
	        'Content-Type': 'application/json'
	      },
          data: {
          	"tags":
          	  [
          	    item
              ]
            
          }
       })
	   .catch(function (error) {
         console.error(error);
	    }) 	  
       .then(function (response) {
         i++;
         callback();
       });

      }, function(err) {
        done_tags(null, 'tags - '+i);
      });
    },

    function(done_posts) {

      var i=0;

      async.each(obj.db[0].data.posts, function(item, callback) {

        var posttags=[];

      	i++;

      _.each(obj.db[0].data.posts_tags,function(post) {
        if ( post.post_id == item.id ) {

          posttags.push({name:tags.find(tag => tag.id === post.tag_id).name});
        }
      })

      	var article = {
      		title: item.title,
      		slug: item.slug,
      		mobiledoc: JSON.stringify(converter.toMobiledoc(item.html)),
      		feature_image: item.image,
      		featured: item.featured,
      		page: item.page,
      		status: item.status,
      		visibility: item.visibility,
      		meta_title: item.meta_title,
      		meta_description: item.meta_description,
      		author_id: process.env.AUTHOR_ID,
      		created_at: item.created_at,
      		created_by: process.env.CREATED_BY,
      		updated_at: item.updated_at,
      		updated_by: process.env.UPDATED_BY,
      		published_at: item.published_at,
      		published_by: process.env.PUBLISHED_BY,
      		"locale": null,
          tags:posttags
      	};

		if (i < 0) {

      sleep(2*1000);

	  	    axios({
	          method: 'post',
	          url: process.env.ENDPOINT+'posts',
		      headers: {
		      	'Authorization': 'Bearer '+access_token,
		        'Content-Type': 'application/json'
		      },
	          data: {
	          	"posts":
	          	  [
	          	    article
	              ]
	            
	          }
	       })
		   .catch(function (error) {
	         console.error(error);
		    }) 	  
	       .then(function (response) {
	         callback();
	       });
	   }
	   else {
	   	callback();
	   }

      }, function(err) {
        done_posts(null, 'posts - '+i);
      });
    },

  ],

  function(err, results) {
    console.log(results);
  });

})