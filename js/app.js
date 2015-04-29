$(document).ready(function() {
   /* Initialization Oauth.io
    */
  var Oauth = (function(){
    //oauth.io authentication
    OAuth.initialize('69053b97f596075b8376', {cache: true});

    //if the user is already signed in, run the main scripts
    if (OAuth.create('github')) {
      doEverything();
    } else {
        //display sign in form
        console.log(OAuth.create('github'));
        $('#listRepos').hide();
        $('.signIn').on('click', doEverything);
    }  
  })();

  function doEverything() {
    OAuth.popup('github')
    .done(function (result) {

      //handle error with error
      //use result.access_token in your API request
      $('.signIn').hide();
      $('#listRepos').show();

        //urls used in API calls
        var apiUrl = "https://api.github.com";
        var access_token = result.access_token;
        var tokenUrl ='?access_token='+access_token;
        var userUrl = apiUrl+'/user'+tokenUrl;
        var authRepoUrl = apiUrl+'/user/repos'+tokenUrl;     


      var log = function(e) {
        console.log(e);
      }
      $('#languages').show();
      console.log('he');
      User = function(user, url) {
        var obj = {user: user}
        return obj;
      };

      // input: reposUrl
      // output: github repos object
      var getRepos = function (reposUrl){
        return new Promise(function(resolve, reject) {
          $.ajax({
            url: reposUrl,
            type: 'GET',
            data: {'sort': 'updated', 'per_page': 2},
            success: function(result) {
              resolve(result);
            }
          });
        }); 
      };

      //get the bytes of code of the languages in each repo.
      // input: repos object
      // output: repos object with languages property added
      var getReposLanguages = function(repos) {
        return Promise.all(repos.map(function(repo) {
          return $.ajax({
            url: repo.languages_url,
            type: 'GET'
          });
        })).then(function(languages) {
          for(var i = 0; i<repos.length; i++) {
            repos[i].languages = languages[i];
          };
          return repos;
        });
      };

      var processRepos = function(repos) {
        //turn object into array then sort array
        var sortObject = function(object) {
        var array = [];
        for(var j in object) {
          array.push([ j,object[j] ])
        }
        array.sort(function(a,b) {return b[1]-a[1] });
        return array;
        };

        //calculate the total bytes of code for the languages in all repos
        // input: repos object.  this function accesses language property on repos object
        // output: puts html with language histogram to DOM
        var ReposTotalSizes = function(repos){
          var sizes = function(repos) {
            var totals = {};
            repos.forEach(function(repo){
              var languages = repo.languages;
              Object.keys(languages).forEach(function(lang){
                totals[lang] = totals[lang]? totals[lang] + languages[lang] : languages[lang];
              });
            });
            return totals;
          };

        //display bytes of code for the languages in all repos
        var displaySizes = function(totals) {
          var reposLanguages = sortObject(totals);
          console.log(repos)
          var output = repos[0].owner.login;
          output+='<ul class="list-group totalLanguages"> ';
          for(var i in reposLanguages) {
            output += '<li class="list-group-item">'+reposLanguages[i][0]+':'+'<span class="badge">'+Math.round(reposLanguages[i][1]/1000)+'</span>'+'</li>';
          };
          output+='</ul>';
          $$('.reposLanguages').append(output);
        };

        var totals = sizes(repos);
        displaySizes(totals);
        }(repos); 
      };

      getRepos(authRepoUrl).then(log);

      // var UserData =function(){
      //   var users = ["aaravin", "albertyptang", "andrew-li", "ardsouza", "AustinWo", "bahiafayez", "baka101", "bdstein33", "brettkan", "BrianLoughnane", "bsliu17", "cstaton", "CubeSquared", "danielleknudson", "desgnl", "devonharvey", "dgdblank", "Dianna", "dlhom", "dxuehu", "edwinlin1987", "eihli", "ekong2", "ericskao", "fmp-fumoffu", "foob26uk", "futbalguy", "GoldAnna", "hksong", "jackmcd4", "JAFong", "jameskennethrobinson", "jammiemountz", "jasoncartermartin", "jasonmenayan", "jdstep", "jmai00", "jmrobancho", "joshtepei", "joshturn", "jseiden", "justinthareja", "kidmillions", "LaurenJanicki", "liamgallivan", "lyip1992", "m-arnold", "Mavmeister", "medhir", "mikemsrk", "mmartinez8020", "muratozgul", "myfancypants", "ning-github", "nokane", "onphenomenon", "paulinoj", "plespe", "richardstanley", "smkhalsa", "sokolikp", "soundswarm", "spacemixup", "stacyhuang", "stridentbean", "SYU88", "tchan247", "TCL735", "tmwoodson", "trexr", "ultralame", "vliang63", "wheredidjupark", "ZLester"];
      //   var processUser = function(e) {
      //     var user = e;
      //     var apiUrl =  'https://api.github.com';
      //     var reposUrl = apiUrl+'/users/'+user+'/repos';
      //     getRepos(reposUrl)
      //       .then(getReposLanguages)
      //       .then(processRepos);
      //   };

      //   for(var i=0; i<users.length; i++) {

      //     (function(cntr) {
      //       user = users[cntr];
      //       console.log(users[cntr]);
      //       processUser( users[cntr] );
      //     })(i);
      //   };
      // }();
    });
  };
});


 