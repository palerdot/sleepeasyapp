(function($){
  
  // document ready
  $(function(){

    // init subscription form
    initSubscriptionForm()

    // render help stuff
    renderHelpGuide()

    // init materialize stuffs
    $('.scrollspy').scrollSpy();
    $('.button-collapse').sideNav();
    $('.slider').slider({
      height: 475
    });

  }); // end of document ready

  // helper function to render help guide
  function renderHelpGuide() {
    $.getJSON( "/data/help-q-a.json", function( h_data ) {
      // get a handle on template
      var template = $.templates("#help-template")
      $.each(h_data, function (key, value) {
        // console.log('data is ', data)
        var data = {
          question: _renderHelpText(value.question),
          answer: _renderHelpText(value.answer)
        }
        // var $help_html = template(value)
        var $help_html = template(data)
        // render the help html
        $("#help-guide-holder").append($help_html)
      })
    });
  }

  // helper function to split text into pieces
  // each piece will be fed to _parseHelpText
  function _renderHelpText(text, styles) {
    var pieces = _.split(text, " ")
    // return pieces.map((p, index) => _parseHelpText(p, styles, index))
    var mapped = _.map(pieces, function (p, index) {
      return _parseHelpText(p)
    })
    return mapped
  }

  // we will then parse for special syntax '#{type:meta}' => '#{icon:super icon}'
  // for normal string we will just display as it is
  // MIRROR of our app logic
  function _parseHelpText(word, style, index) {
    var special_format = /#{(.*)?}/.exec(word)
    if (!special_format) {
      return {
        type: 'span',
        content: word
      }
    }
    // we have a special format
    var info = special_format[1].split(":")
    var type = info[0]
    var meta = info[1].split("--").join(" ")

    switch (type) {
      case 'icon':
        return {
          type: type,
          content: _getWebIconName(meta)
        }

      case 'color_icon': 
        // we need to map the icons from 'app' to material icons
        var icon_meta = meta.split("||"),
            icon_name = icon_meta[0].split("-").join(" "),
            icon_color = icon_meta[1]
        return {
          type: type,
          content: _getWebIconName(icon_name),
          color: icon_color
        }
      

      case 'bold':
        return {
          type: type,
          content: meta
        }

      case 'beta_text':
        return {
          type: type,
          content: meta
        }

      default:
        return {
          type: 'span',
          content: word
        }
    }
  }

  // small helper function to transform app icon names to web icon names
  function _getWebIconName(name) {
    switch (name) {
      case 'emoticon':
        return 'sentiment_very_satisfied'
      case 'emoticon sad':
        return 'sentiment_dissatisfied'
      case 'emoticon neutral':
        return 'sentiment_neutral'
      case 'bell-sleep':
        return 'notifications_paused'
      default:
        return name
    }
  }

  // helper function to init subscription form and hook ajax functionality
  function initSubscriptionForm() {
    $('#sleep-easy-subscription-form').submit( function (e) {
      // check for empty email
      var email = $("#sleep-easy-subscription-form").find("#subscription-email").val()
      if (email.length === 0) {
        // empty email
        new Noty({
          theme: 'sunset',
          type: 'error',
          text: "Please enter a valid email ...",
          timeout: 3000
        }).show()
        // do not proceed
        return false
      }

      var $this = $(this);
      $.ajax({
          type: "GET", // GET & url for json slightly different
          url: "https://sleepeasyapp.us12.list-manage.com/subscribe/post-json?c=?",
          data: $this.serialize(),
          dataType    : 'json',
          contentType: "application/json; charset=utf-8",
          error       : function(err) { alert("Could not connect to the registration server."); },
          success     : function(data) {
              if (data.result != "success") {
                  // Something went wrong, parse data.msg string and display message
                  console.log('subscription did not work')
                  new Noty({
                    theme: 'sunset',
                    type: 'error',
                    text: "There was an processing your request. Please try again after some time ...",
                    timeout: 3000
                  }).show()
              } else {
                  // It worked, so hide form and display thank-you message.
                  console.log('porumai! subscription worked')
                  new Noty({
                    theme: 'sunset',
                    type: 'success',
                    text: "Thank you for your subscription ...",
                    timeout: 1500
                  }).show()
                  // clear the input field
                  $("#sleep-easy-subscription-form").find("#subscription-email").val('')
              }
          }
      });
      return false;
    });
  }



})(jQuery); // end of jQuery name space