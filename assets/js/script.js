document.addEventListener('DOMContentLoaded', function () {

    // References to all the element we will need.
    var video = document.querySelector('#camera-stream'),
        image = document.querySelector('#snap'),
        start_camera = document.querySelector('#start-camera'),
        controls = document.querySelector('.controls'),
        take_photo_btn = document.querySelector('#take-photo'),
        delete_photo_btn = document.querySelector('#delete-photo'),
        download_photo_btn = document.querySelector('#download-photo'),
        scatta = document.querySelector('#scatta'),
        error_message = document.querySelector('#error-message');

    // The getUserMedia interface is used for handling camera input.
    // Some browsers need a prefix so here we're covering all the options
    navigator.getMedia = ( navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);


    if (!navigator.getMedia) {
        displayErrorMessage("Your browser doesn't have support for the navigator.getUserMedia interface.");
    }
    else {

    }


    // Mobile browsers cannot play video without user input,
    // so here we're using a button to start it manually.
    start_camera.addEventListener("click", function (e) {

        e.preventDefault();

        // Start video playback manually.
        video.play();
        showVideo();

    });
    scatta.addEventListener("click", function (e) {
        $("#scatta").hide();
        e.preventDefault();

        // Request the camera.
        if(!video.src) {
            navigator.getMedia(
                {
                    video: true
                },
                // Success Callback
                function (stream) {
                    // Create an object URL for the video stream and
                    // set it as src of our HTLM video element.
                    video.src = window.URL.createObjectURL(stream);
                    // Play the video element to start the stream.
                    video.play();
                    video.onplay = function () {
                        showVideo();
                    };
                },
                // Error Callback
                function (err) {
                    displayErrorMessage("There was an error with accessing the camera stream: " + err.name, err);
                }
            );
        }else{
            jQuery('#camera-stream').show();
            jQuery('#snap').show();
            jQuery('.controls').show();
            jQuery('.products').hide();
            $("#imgsc").show();
            $(".count").hide();
            video.play();
            showVideo();
        }
    });


    take_photo_btn.addEventListener("click", function (e) {

        e.preventDefault();
        take_photo_btn.classList.add("disabledSpecial");
        $("#imgsc").hide();
        $(".count").show();
        $(".count").html('looks_5');

        take_photo_btn.classList.add("cc");
        var myCounter = new Countdown({
            seconds:4,  // number of seconds to count down
            onUpdateStatus: function(sec){
                if(sec==4)
                    $(".count").html('looks_4');
                else if(sec==3)
                    $(".count").html('looks_3');
                else if(sec==2)
                    $(".count").html('looks_two');
                else if(sec==1)
                    $(".count").html('looks_one');
                else
                    $(".count").html('done');
                }, // callback for each second
            onCounterEnd: function(){
                var snap = takeSnapshot();

                // Show image.
                image.setAttribute('src', snap);
                image.classList.add("visible");

                // Enable delete and save buttons
                delete_photo_btn.classList.remove("disabled");
                download_photo_btn.classList.remove("disabled");

                // Set the href attribute of the download button to the snap url.
                download_photo_btn.pers = snap;
                take_photo_btn.classList.remove("disabledSpecial");
                take_photo_btn.classList.remove("cc");
                take_photo_btn.classList.add("disabled");
                // Pause video playback of stream.
                //video.pause();
            }
        });

        myCounter.start();


    });
    delete_photo_btn.addEventListener("click", function (e) {

        e.preventDefault();

        // Hide image.
        image.setAttribute('src', "");
        image.classList.remove("visible");

        // Disable delete and save buttons
        $("#imgsc").show();
        $(".count").hide();
        delete_photo_btn.classList.add("disabled");
        download_photo_btn.classList.add("disabled");
        take_photo_btn.classList.remove("disabled");
        $(".count").html('camera_alt');
        // Resume playback of stream.
        video.play();

    });

    download_photo_btn.addEventListener("click", function (e) {

        e.preventDefault();

        var formData = {
            'image': download_photo_btn.pers
        };

        jQuery('.send').hide();
        download_photo_btn.classList.add("gira");
		download_photo_btn.classList.add("prevent");
        //jQuery('#spinner').show();
        $.ajax({
            type: 'POST',
            url: "uploadPhoto.php",
            data: formData,
            success: function (data) {
                jQuery('.send').show();
                jQuery('.products').show();
               // jQuery('#spinner').hide();
                download_photo_btn.classList.remove("gira");
download_photo_btn.classList.remove("prevent");

                video.play();
                dd = "<img style='width:15%;margin-top:20px;margin-right:10px;border-radius: 10px' src='" + data + "'/>";
                i++;
                var liData = '<span class="new-rows' + i + '" style="display:none"></span>';
                $(liData).prependTo('.products').fadeIn('slow');
                jQuery('.new-rows' + i).html(dd, 500);
                jQuery('.new-rows' + (i - 5)).remove();
                delete_photo_btn.classList.add("disabled");
                download_photo_btn.classList.add("disabled");
                take_photo_btn.classList.remove("disabled");
                $(".count").html('camera_alt');
                jQuery('#camera-stream').hide();
                jQuery('#snap').hide();
                jQuery('.controls').hide();
                $("#scatta").show();
            },
            error: function (richiesta, stato, errori) {
                alert("E' evvenuto un errore. Il stato della chiamata: " + stato);
            }
        });

    });


    function showVideo() {
        // Display the video stream and the controls.

        hideUI();
        video.classList.add("visible");
        controls.classList.add("visible");
    }


    function takeSnapshot() {
        // Here we're using a trick that involves a hidden canvas element.  

        var hidden_canvas = document.querySelector('canvas'),
            context = hidden_canvas.getContext('2d');

        if (video.videoWidth / video.videoHeight < 0.8) {
            var width = video.videoWidth,
                height = video.videoWidth / 0.8;
        }
        else if(video.videoWidth / video.videoHeight > 1.9) {
            var width = video.videoWidth,
                height = video.videoWidth / 1.9
        }
        else {
            var width = video.videoWidth,
                height = video.videoHeight;
        }

        if (width && height) {

            // Setup a canvas with the same dimensions as the video.
            hidden_canvas.width = width;
            hidden_canvas.height = height;


            // Make a copy of the current frame in the video on the canvas.
            context.translate(width,0 );
            context.scale(-1, 1);
            context.drawImage(video, 0, 0, width, video.videoHeight, 0, 0, width, video.videoHeight);
            var imgas=document.getElementById("messaggio");
            context.drawImage(imgas,10,10);
            // Turn the canvas image into a dataURL that can be used as a src for our photo.
            return hidden_canvas.toDataURL('image/jpeg');
        }
    }


    function displayErrorMessage(error_msg, error) {
        error = error || "";
        if (error) {
            console.error(error);
        }

        error_message.innerText = error_msg;

        hideUI();
        error_message.classList.add("visible");
    }

    function hideUI() {
        // Helper function for clearing the app UI.

        controls.classList.remove("visible");
        start_camera.classList.remove("visible");
        video.classList.remove("visible");
        snap.classList.remove("visible");
        error_message.classList.remove("visible");
        scatta.classList.remove("visible");
    }
    function Countdown(options) {
        var timer,
            instance = this,
            seconds = options.seconds || 10,
            updateStatus = options.onUpdateStatus || function () {},
            counterEnd = options.onCounterEnd || function () {};

        function decrementCounter() {
            updateStatus(seconds);
            if (seconds === 0) {
                counterEnd();
                instance.stop();
            }
            seconds--;
        }

        this.start = function () {
            clearInterval(timer);
            timer = 0;
            seconds = options.seconds;
            timer = setInterval(decrementCounter, 1000);
        };

        this.stop = function () {
            clearInterval(timer);
        };
    }
});
