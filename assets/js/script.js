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
            alert('Test');
        }, false);
      });
    }, false);
  })();
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
    /*checkCssLoadedDark();
    buttonsToggleDark[0].onclick = function()
    {
        toggleDarkLight();
    };
    buttonsToggleDark[1].onclick = function()
    {
        toggleDarkLight();
    };*/
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
                                                '<span class="align-middle">Setting</span>'+
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
        })
    });
});
