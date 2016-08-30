/*
 * MODEL: your application’s stored DATA. Collections of models are collections of data.
 * TASK: There should be at least 5 locations hard-coded in the model.
 * Model decides content of the application.
 */
var allStops = [{
    name: 'Kehillos Yaakov Synagogue',
    lat: 31.714564,
    lng: 34.990076,
    stopName: 'First Stop:',
    description: 'Just above the the corner of Kishon and Sorek.',
    eta: 'ETA is 8:40 AM.'
}, {
    name: 'Bar Col',
    lat: 31.714856,
    lng: 34.993992,
    stopName: 'Second Stop:',
    description: 'Just after the corner where the bottom of Lachish and Sorek meet.',
    eta: 'ETA is 8:41 AM.'
}, {
    name: 'Top of Ayalon Park',
    lat: 31.713816,
    lng: 34.996277,
    stopName: 'Third Stop:',
    description: 'Just after where the top of Lachish intersects with Sorek.',
    eta: 'ETA is 8:42 AM.'
}, {
    name: 'Top of Ayalon Street',
    lat: 31.712900,
    lng: 34.997843,
    stopName: 'Fourth Stop:',
    description: 'Where Ayalon and Dolev intersect, near Best Market/Park Center.',
    eta: 'ETA is 8:43 AM.'
}, {
    name: 'North Dolev',
    lat: 31.715687,
    lng: 34.998155,
    stopName: 'Fifth Stop:',
    description: 'Just before Dolev and Katlav meet.',
    eta: 'ETA is 8:44 AM.'
}, {
    name: 'Top of Dolev',
    lat: 31.712247,
    lng: 34.999441,
    stopName: 'Sixth Stop:',
    description: 'Just before the corner of Dolev and Shimshon.',
    eta: 'ETA is 8:45 AM.'
}, {
    name: 'Bottom of Shimshon',
    lat: 31.714460,
    lng: 35.000503,
    stopName: 'Seventh Stop:',
    description: 'Just before Shimshon intersects with HaYarden.',
    eta: 'ETA is 8:46 AM.'
}, {
    name: 'HaYarden',
    lat: 31.710867,
    lng: 35.001394,
    stopName: 'Eighth Stop:',
    description: 'Just after the corner of HaYarden and Refa\'im.',
    eta: 'ETA is 8:46 AM.'
}, {
    name: 'HaYarkon',
    lat: 31.707981,
    lng: 34.998087,
    stopName: 'Ninth Stop:',
    description: 'At the midpoint between HaYarden and Luz.',
    eta: 'ETA is 8:47 AM'
}, {
    name: 'Bottom of Ayalon Park',
    lat: 31.711840,
    lng: 34.990501,
    stopName: 'Tenth Stop:',
    description: 'After the corner of Ayalon and Kishon.',
    eta: 'ETA is 8:48 AM.'
}, {
    name: 'Grill Burger',
    lat: 31.712675,
    lng: 34.988595,
    stopName: 'Eleventh Stop:',
    description: 'On the corner of Kishon and Tse\'elim.',
    eta: 'ETA is 8:49 AM.'
}, {
    name: 'Hever',
    lat: 31.713287,
    lng: 34.982389,
    stopName: 'Final Stop:',
    description: 'After the roundabout where Tse\'elim and Hever intersect.',
    eta: 'ETA is 8:50 AM.'
}];

//GOOGLE MAPS API
var map, marker, infowindow;
//create an infowindow variable outside of the loop so only one window is open at a time
function initMap() {
    // Create a map object and specify the DOM element for display.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 31.713816,
            lng: 34.996277
        },
        zoom: 15,
        scrollwheel: false
    });

    infowindow = new google.maps.InfoWindow();
}

//PROTOTYPE CONSTRUCTOR
function Stop(data) {
    var stop = this;
    this.name = ko.observable(data.name);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
    this.showStop = ko.observable(true);
    this.selected = ko.observable(false);
    this.imgURL = ko.observable('');
    this.stopName = ko.observable(data.stopName);
    this.description = ko.observable(data.description);
    this.eta = ko.observable(data.eta);
    var marker = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(data.lat, data.lng),
        animation: google.maps.Animation.DROP
    });

    this.marker = marker; //recreate marker for each stop instance

    this.marker.addListener('click', function() {
        stop.flickrCall();
    });
}

/* Method on prototype: modifying prototype of stop class: more efficient, b/c will only create instance once;
 * Organize code better by moving every function that is a property of the prototype
 * TASK: Add functionality to animate a map marker when either the list item associated with it or the map marker itself is selected.
 * TASK: Add functionality to open an infoWindow with information
 */

Stop.prototype.flickrCall = function() {
    var stop = this; //referring to current instance

    this.marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
        stop.marker.setAnimation(null);
    }, 1400);

    map.setZoom(17);
    map.panTo(stop.marker.getPosition());

    var openWindow = function() {
        infowindow.setContent('<p><img class="img-thumbnail" src="' + stop.imgURL() + '"><span class="stop-name">' + stop.name() + '</span></p><p><strong>' + stop.stopName() + '</strong> ' + stop.description() + '<br><strong>' + stop.eta() + '</strong></p><p class="small">Picture source: <a href="https://www.flickr.com/">Flickr</a></p>');

        infowindow.open(map, stop.marker); //impt to pass marker also
    };

    /* You can construct the source URL to a photo once you know its ID, server ID,
     * farm ID and secret, as returned by many API methods. The URL takes the
     * following format: https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg
     * https://www.flickr.com/services/api/explore/flickr.photos.search
     * https://learn.jquery.com/ajax/working-with-jsonp/
     */
    $.ajax({
        url: 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=51e2ed3ddd2057e96dec88d2328a37fe&tags=flowers',
        jsonp: 'jsoncallback',
        dataType: 'jsonp',
        data: {
            format: 'json'
        },
        // Work with the response
        success: function(data) {
            console.log('in success');
            var randomNumber = Math.floor((Math.random() * 100) + 1);
            // console.log(data); // server response
            var photoURL = 'https://farm' + data.photos.photo[randomNumber].farm + '.static.flickr.com/' + data.photos.photo[randomNumber].server + '/' + data.photos.photo[randomNumber].id + '_' + data.photos.photo[randomNumber].secret + '_s.jpg';
            stop.imgURL(photoURL);
            // console.log(stop.imgURL());
            openWindow(data);
        },
        error: function(data, e) {
            console.log('in fail');
            stop.imgURL('img/error.jpg');
            openWindow(data);
        }//,
        // complete: function(e) {
        //     console.log('completed event');
        // }
    });
};

/*
 * VIEW MODEL/CONTROLLER: a pure-code representation of the data and operations on a UI.
 * TASK: Implement a list view of the set of locations defined above.
 * TASK: Provide a filter option that uses an input field to filter both the list view and the map markers displayed by default on load.
 * TASK: The list view and the markers should update accordingly.
 */
var ViewModel = function() {
    //DATA
    var self = this;
    self.googleMap = map;
    self.allStops = ko.observableArray([]);
    self.query = ko.observable(''); //placeholder to hold query

    //BEHAVIOURS
    //TASK: Implement a list view of the set of locations
    //Iterate through allStops to create observableArray
    allStops.forEach(function(stop) {
        var stopInstance = new Stop(stop); //create a new instance from JSON
        self.allStops().push(stopInstance);
    });

    self.selectStop = function(stop) {
        self.unselectAll();
        stop.selected(true);
        stop.flickrCall();
        $('.navbar-collapse').collapse('hide');
    };

    self.unselectAll = function() {
        for (var i = 0; i < self.allStops().length; i++) {
            self.allStops()[i].selected(false);
        }
    };

    //Trigger unselectAll when user closes infowindow
    google.maps.event.addListener(infowindow, 'closeclick', function() {
        self.unselectAll();
    });

    /* TASK: Provide a filter option that uses an input field to filter both the list view
     * and the map markers displayed by default on load.*/

    //Need a showAll function for the filteredStops function
    self.showAll = function() {
        for (var i = 0; i < self.allStops().length; i++) {
            self.allStops()[i].showStop(true);
            self.allStops()[i].marker.setVisible(true);
        }
    };

    self.filterStops = ko.computed(function() {
        var search = self.query().toLowerCase();
        if (search.length === 0) {
            self.showAll();
        } else {
            return ko.utils.arrayFilter(self.allStops(), function(stop) {
                self.unselectAll();
                infowindow.close();
                $('.navbar-collapse').collapse('show');
                var nameLC = stop.name().toLowerCase();
                if (nameLC.indexOf(search) > -1) {
                    stop.showStop(true);
                    stop.marker.setVisible(true);
                } else {
                    stop.showStop(false);
                    stop.marker.setVisible(false);
                }
            });
        }
    }, self);

}; //end of ViewModel

function loadMap() {
    initMap();
    ko.applyBindings(new ViewModel());
}

/* TASK: In case of error webpage does one of the following:
 * A message is displayed notifying the user that the data can't be loaded,
 * OR There are no negative repercussions to the UI.
 */
function googleError() {
    alert('The Google Maps application has encountered an error.  Please try again later.');
}
