function compare(a,b) {
    if (a.name < b.name)
        return -1;
    if (a.name > b.name)
        return 1;
    return 0;
}
function detectExtension(extensionId, file, callback) 
{ 
    var img; 
    img = new Image(); 
    img.src = "chrome-extension://" + extensionId + "/"+file+".png"; 
    img.onload = function() { 
      callback(true); 
    }; 
    img.onerror = function() { 
      callback(false); 
    };
}
// Function permettant de lancer un extension
function launchExtension(extensionId) 
{ 
    chrome.tabs.query({currentWindow: true, active: true}, function (tab) 
    {
        if (localStorage.getItem(extensionId) === null) 
        {
            chrome.tabs.update(tab.id, {url: 'chrome-extension://'+extensionId+'/index.html'});
        }
        else
        {
            chrome.tabs.update(tab.id, {url: 'chrome-extension://'+extensionId+localStorage[extensionId]});
        }
    });

}
// Function de validation du form dans la modal modalSetting de l'extension
// Enregistre dans le localStorage le nom du fichier pour lancer l'extension
(function() {
    'use strict';
    window.addEventListener('load', function() 
    {
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.getElementsByClassName('needs-validation');
      // Loop over them and prevent submission
      var validation = Array.prototype.filter.call(forms, function(form) 
      {
        form.addEventListener('submit', function(event) 
        {
            if (form.checkValidity() === false) 
            {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
            var idExtensionModal = document.querySelector("#submitModal").getAttribute('data-id');
            var fileNameExtension = document.querySelector("#fileNameExtension").value;
            if(idExtensionModal!=='' && fileNameExtension!=='')
            {
                localStorage[idExtensionModal] = fileNameExtension; 
            }
        }, false);
      });
    }, false);
  })();

// Toggle of the dark and du light mode
function toggleDarkLight() 
{
    //$('./assets/css/bootstrap-dark.min.css"]').prop('disabled', false);
    if($('link[href="./assets/css/bootstrap-dark.min.css"]').prop( "disabled" ))
    {
        $('link[href="./assets/css/bootstrap-dark.min.css"]').prop('disabled', false);
        $('link[href="./assets/css/bootstrap-light.min.css"]').prop('disabled', true);
        localStorage["darkMode"] = 'dark'; 
    }
    else if($('link[href="./assets/css/bootstrap-light.min.css"]').prop( "disabled" ))
    {
        $('link[href="./assets/css/bootstrap-dark.min.css"]').prop('disabled', true);
        $('link[href="./assets/css/bootstrap-light.min.css"]').prop('disabled', false);
        localStorage["darkMode"] = 'light'; 

    }
    checkCssLoadedDark();
}

// Check if DarkMode or LightMode is loaded to show the right button
function checkCssLoadedDark()
{
    if ($('link[href="./assets/css/bootstrap-dark.min.css"]').prop( "disabled" ))
    {
        $('#btn-dark').show();
        $('#btn-light').hide();
    }
    else if($('link[href="./assets/css/bootstrap-light.min.css"]').prop( "disabled" ))
    {
        $('#btn-light').show();
        $('#btn-dark').hide();
    }
    
}

document.addEventListener('DOMContentLoaded', function() 
{
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        65: 'a',
        66: 'b'
      };
      
      // the 'official' Konami Code sequence
      var konamiCode = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a'];
      
      // a variable to remember the 'position' the user has reached so far.
      var konamiCodePosition = 0;
      
      // add keydown event listener
      document.addEventListener('keydown', function(e) {
        // get the value of the key code from the key map
        var key = allowedKeys[e.keyCode];
        // get the value of the required key from the konami code
        var requiredKey = konamiCode[konamiCodePosition];
      
        // compare the key with the required key
        if (key == requiredKey) {
      
          // move to the next key in the konami code sequence
          konamiCodePosition++;
      
          // if the last key is reached, activate cheats
          if (konamiCodePosition == konamiCode.length) {
            activateCheats();
            konamiCodePosition = 0;
          }
        } else {
          konamiCodePosition = 0;
        }
      });
      
    function activateCheats() 
    {    
        $("#logoOTab").css('transform', " rotate(360deg)");
        $( "#container-body" ).prepend('<div class="alert alert-primary" role="alert">'+
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
            '<span aria-hidden="true">&times;</span>'+
        '</button>'+
        '<h4>Congratulations !</h4>'+
        '<p>You enabled a secret feature with the Konami Code!</p>'+
        '<p>Take a look in the Theme settings ;)</p>'+
        '</div>');
    }

    for(var i=1;i<30;i++)
    {
        if(i<23)
        {
            $('#backgroundPicker').append('<div class="col-lg-2 col-md-6">'+
            '<span class="d-block mb-4 h-100">'+
                '<div data-src="./assets/img/background/'+i+'.png" class="background-img" style="background: url(\'./assets/img/background/'+i+'.png\');'+
                'background-repeat: repeat;background-size: contain;"></div>'+
            '</span>'+
            '</div>');
        }
        else
        {
            $('#backgroundPicker').append('<div class="col-lg-2 col-md-6">'+
            '<span class="d-block mb-4 h-100">'+
                '<div data-src="./assets/img/background/'+i+'.png" class="background-img" style="background: url(\'./assets/img/background/'+i+'.png\');'+
                'background-repeat: no-repeat;background-size: cover;"></div>'+
            '</span>'+
            '</div>');
        }
    }
    if (localStorage.getItem('header-color') !== null) 
    {
        document.querySelector('#header-nav').setAttribute('style', 
        'background-color:'+localStorage['header-color']+' !important');
    }
    
    if (localStorage.getItem('backgroundImg') !== null) 
    {
        var filenameBackground = localStorage['backgroundImg'].split('/').pop();
        indexfileName = filenameBackground.substr(0, filenameBackground.lastIndexOf('.'));
        $('body').css('background-image', 'url('+localStorage['backgroundImg']+')');
        if(indexfileName<23)
        {
            $('body').css('background-repeat', 'repeat');
            $('body').css('background-size', 'auto');
        }
        else
        {
            $('body').css('background-repeat', 'no-repeat');
            $('body').css('background-size', 'cover');
        }
    }

    var buttonsToggleDark = document.getElementsByName('toggleDark');
    if(localStorage["darkMode"] === undefined)
    {
        $('link[href="./assets/css/bootstrap-light.min.css"]').prop('disabled', false);
        $('link[href="./assets/css/bootstrap-dark.min.css"]').prop('disabled', true);
    }
    else
    {
        if(localStorage["darkMode"]=="dark")
        {
            $('link[href="./assets/css/bootstrap-light.min.css"]').prop('disabled', true);
            $('link[href="./assets/css/bootstrap-dark.min.css"]').prop('disabled', false);
        }
        else if(localStorage["darkMode"]=="light")
        {
            $('link[href="./assets/css/bootstrap-light.min.css"]').prop('disabled', false);
            $('link[href="./assets/css/bootstrap-dark.min.css"]').prop('disabled', true);
        }
    }
    checkCssLoadedDark();
    buttonsToggleDark[0].onclick = function()
    {
        toggleDarkLight();
    };
    buttonsToggleDark[1].onclick = function()
    {
        toggleDarkLight();
    };

    if($('link[href="./assets/css/bootstrap-dark.min.css"]').prop( "disabled" )===false)
    {
        var defaultColorPicker = "#00bc8c";
    }
    else if($('link[href="./assets/css/bootstrap-light.min.css"]').prop( "disabled" )===false)
    {
        var defaultColorPicker = "#ffffff";
    }
    const pickr = new Pickr({

        // Selector or element which will be replaced with the actual color-picker.
        // Can be a HTMLElement.
        el: '#btn-color-picker',
    
        // Where the pickr-app should be added as child.
        container: 'body',
    
        // Which theme you want to use. Can be 'classic', 'monolith' or 'nano'
        theme: 'nano',
    
        // Nested scrolling is currently not supported and as this would be really sophisticated to add this
        // it's easier to set this to true which will hide pickr if the user scrolls the area behind it.
        closeOnScroll: false,
    
        // Custom class which gets added to the pcr-app. Can be used to apply custom styles.
        appClass: 'custom-class',
    
        // Don't replace 'el' Element with the pickr-button, instead use 'el' as a button.
        // If true, appendToBody will also be automatically true.
        useAsButton: false,
    
        // If true pickr won't be floating, and instead will append after the in el resolved element.
        // Setting this to true will also set showAlways to true. It's possible to hide it via .hide() anyway.
        inline: false,
    
        // If true, pickr will be repositioned automatically on page scroll or window resize.
        // Can be set to false to make custom positioning easier.
        autoReposition: true,
    
        // Defines the direction in which the knobs of hue and opacity can be moved.
        // 'v' => opacity- and hue-slider can both only moved vertically.
        // 'hv' => opacity-slider can be moved horizontally and hue-slider vertically.
        // Can be used to apply custom layouts
        sliders: 'h',
    
        // Start state. If true 'disabled' will be added to the button's classlist.
        disabled: false,
    
        // If true, the user won't be able to adjust any opacity.
        // Opacity will be locked at 1 and the opacity slider will be removed.
        // The HSVaColor object also doesn't contain an alpha, so the toString() methods just
        // print HSV, HSL, RGB, HEX, etc.
        lockOpacity: true,
    
        // Precision of output string (only effective if components.interaction.input is true)
        outputPrecision: 0,
    
        // If set to false it would directly apply the selected color on the button and preview.
        comparison: true,
        // Default color
        default: defaultColorPicker,
        swatches: null,
    
        // Default color representation of the input/output textbox.
        // Valid options are `HEX`, `RGBA`, `HSVA`, `HSLA` and `CMYK`.
        defaultRepresentation: 'HEX',
    
        // Option to keep the color picker always visible.
        // You can still hide / show it via 'pickr.hide()' and 'pickr.show()'.
        // The save button keeps its functionality, so still fires the onSave event when clicked.
        showAlways: false,
    
        // Defines the position of the color-picker.
        // Any combinations of top, left, bottom or right with one of these optional modifiers: start, middle, end
        // Examples: top-start / right-end
        // If clipping occurs, the color picker will automatically choose its position.
        position: 'top-middle',
    
        // Enables the ability to change numbers in an input field with the scroll-wheel.
        // To use it set the cursor on a position where a number is and scroll, use ctrl to make steps of five
        adjustableNumbers: true,
    
        // Show or hide specific components.
        // By default only the palette (and the save button) is visible.
        components: {
    
            // Defines if the palette itself should be visible.
            // Will be overwritten with true if preview, opacity or hue are true
            palette: true,
    
            preview: true, // Display comparison between previous state and new color
            opacity: false, // Display opacity slider
            hue: true,     // Display hue slider
    
            // show or hide components on the bottom interaction bar.
            interaction: {
                hex: false,  // Display 'input/output format as hex' button  (hexadecimal representation of the rgba value)
                rgba: false, // Display 'input/output format as rgba' button (red green blue and alpha)
                hsla: false, // Display 'input/output format as hsla' button (hue saturation lightness and alpha)
                hsva: false, // Display 'input/output format as hsva' button (hue saturation value and alpha)
                cmyk: false, // Display 'input/output format as cmyk' button (cyan mangenta yellow key )
    
                input: false, // Display input/output textbox which shows the selected color value.
                             // the format of the input is determined by defaultRepresentation,
                             // and can be changed by the user with the buttons set by hex, rgba, hsla, etc (above).
                cancel: true, // Display Cancel Button, resets the color to the previous state
                clear: false, // Display Clear Button; same as cancel, but keeps the window open
                save: true,  // Display Save Button,
            },
        },
    
        // Button strings, brings the possibility to use a language other than English.
        strings: {
           save: 'Save',  // Default for save button
           clear: 'Clear', // Default for clear button
           cancel: 'Cancel' // Default for cancel button
        }
    });
    pickr.on('init', instance => 
    {
        $('.pcr-button').css('border', '2px solid black');
    });
    pickr.on('save', (color, instance) => 
    {
        //console.log('save', color, instance);
        //console.log(color.toHEXA().toString());
        document.querySelector('#header-nav').setAttribute('style', 
        'background-color:'+color.toHEXA().toString()+' !important');
        localStorage['header-color'] = color.toHEXA().toString();
    });

    var index = 0;
    var array=[];
    var options = document.getElementById('list_extensions');
    chrome.management.getAll(function(response) {
        response.sort(compare)
        for(i=0; i<response.length; i++){
            for(j=0; j<response[i].permissions.length; j++){
                if(response[i].permissions[j]=='newTabPageOverride'){
                    array.push([response[i].name, response[i].description, response[i].id])
                }
            }

        }

        listLinks = []
        extensions = []

        chrome.storage.sync.get('extensions', function(data)
        {
            extensions = data.extensions

            for(i=0; i<array.length; i++)
            {
                var idChromeExtension = array[i][2];
                var titleChromeExtension = array[i][0];
                chrome.management.get(idChromeExtension, function(a)
                {
                    if(a.enabled==true && chrome.runtime.id!==a.id)
                    {
                        var cardLogo = '<div class="col-lg-4 col-md-6 col-sm6" style="margin-bottom:10px;">'+
                            '<div class="card" style="width:100%;">'+
                                '<div class="card-body">'+
                                    '<div class="row">'+
                                        '<div class="col-md-10">'+
                                            '<h5 class="card-title">'+a.name+'</h5>'+
                                        '</div>'+
                                        '<div class="col-md-2 float-right logoDiv" id="logo_'+a.id+'">'+
                                        '</div>'+
                                    '</div>'+
                                    '<div class="row">'+
                                        '<div class="col text-left" style="margin-top:15px;">'+
                                            '<button name="btn-setting" data-id="'+a.id+'" class="btn btn-secondary text-center" data-toggle="modal" data-target="#modalSetting">'+
                                                '<i class="material-icons align-middle" style="padding-right:10px" aria-hidden="true">settings</i>'+
                                                '<span class="align-middle">Settings</span>'+
                                            '</button>'+
                                        '</div>'+
                                        '<div class="col text-right" style="margin-top:15px;">'+
                                            '<button name="btn-choose-extension" data-id="'+a.id+'" class="btn btn-primary text-center">'+
                                                '<i class="material-icons align-middle" style="padding-right:10px" aria-hidden="true">launch</i>'+
                                                '<span class="align-middle">Start</span>'+
                                            '</button>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>';
                        $('#grid-logo-extension').append(cardLogo);
                        index++;
                        if(a.icons!==undefined)
                        {
                            var result = a.icons.filter(x => x.size === 48);
                            if(result.length==0)
                            {
                                var result = a.icons.filter(x => x.size === 32);
                            }
                            else if (result.length>0)
                            {
                                $('#logo_'+a.id).append('<img class="img-fluid" src="'+result[0].url+'" alt="logo_extension_'+a.name+'" />');
                            }
                        }
                        var elements = document.getElementsByName('btn-choose-extension');
                        elements[index-1].onclick = function()
                        {
                            launchExtension(a.id);
                        }
                    }
                });
            }
        });

        // Function pour afficher la modal et remplir le contenu
        $('#modalSetting').on('show.bs.modal', function (event) 
        {
            var button = $(event.relatedTarget); // Button that triggered the modal
            var idExtension = button.data('id'); // Extract info from data-* attributes
            // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
            // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
            if (localStorage.getItem(idExtension) !== null) 
            {
                $('#localStorageFileName').empty();
                var h6FileName = document.createElement("h6");
                h6FileName.textContent = "The current filename stored is : "+localStorage[idExtension];
                $('#localStorageFileName').append(h6FileName);
                $('#localStorageFileName').show();
            }
            else
            {
                $('#localStorageFileName').empty();
                $('#localStorageFileName').hide();
            }
            document.querySelector("#aLinkExtension").setAttribute('href', "chrome-extension://"+idExtension+"/manifest.json");
            document.querySelector("#submitModal").setAttribute('data-id', idExtension);
            $( "#aLinkExtension").unbind( "click" );
            $( "#aLinkExtension" ).bind( "click", function(e) 
            {
                e.preventDefault();
                chrome.tabs.create({url:  $(this).attr('href')});
            });
        });
        $( ".background-img" ).bind( "click", function(e) 
        {
                var filenameBackground = $(this).attr('data-src').split('/').pop();
                indexfileName = filenameBackground.substr(0, filenameBackground.lastIndexOf('.'));
                $('body').css('background-image', 'url('+$(this).attr('data-src')+')');
                if(indexfileName<23)
                {
                    $('body').css('background-repeat', 'repeat');
                    $('body').css('background-size', 'auto');
                }
                else
                {
                    $('body').css('background-repeat', 'no-repeat');
                    $('body').css('background-size', 'cover');
                }
                localStorage['backgroundImg'] = $(this).attr('data-src');
        });
    });
});
