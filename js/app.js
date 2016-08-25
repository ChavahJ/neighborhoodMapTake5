/*
 * MODEL: your application’s stored DATA. Collections of models are collections of data.
 * TASK: There should be at least 5 locations hard-coded in the model.
 * Model decides content of the application.
 */
var allStops = [{
    name: "Kehillos Yaakov Synagogue",
    lat: 31.714564,
    lng: 34.990076,
    description: "<strong>First Stop:</strong> Just above the the corner of Kishon and Sorek. ETA is 8:40 AM."
}, {
    name: "Bar Col",
    lat: 31.714856,
    lng: 34.993992,
    description: "<strong>Second Stop:</strong> Just after the corner where the bottom of Lachish and Sorek meet. ETA is 8:41 AM."
}, {
    name: "Top of Ayalon Park",
    lat: 31.713816,
    lng: 34.996277,
    description: "<strong>Third Stop:</strong> Just after where the top of Lachish intersects with Sorek. ETA is 8:42 AM."
}, {
    name: "Top of Ayalon Street",
    lat: 31.712900,
    lng: 34.997843,
    description: "<strong>Fourth Stop:</strong> Where Ayalon and Dolev intersect, near Best Market. ETA is 8:43 AM."
}, {
    name: "North Dolev",
    lat: 31.715687,
    lng: 34.998155,
    description: "<strong>Fifth Stop:</strong> Just before Dolev and Katlav meet. ETA is 8:44 AM."
}, {
    name: "Top of Dolev",
    lat: 31.712247,
    lng: 34.999441,
    description: "<strong>Sixth Stop:</strong> Just before the corner of Dolev and Shimshon. ETA is 8:45 AM."
}, {
    name: "Bottom of Shimshon",
    lat: 31.714460,
    lng: 35.000503,
    description: "<strong>Seventh Stop:</strong> Just before Shimshon intersects with HaYarden. ETA is 8:46 AM."
}, {
    name: "HaYarden",
    lat: 31.710867,
    lng: 35.001394,
    description: "<strong>Eighth Stop:</strong> Just after the corner of HaYarden and Refa'im. ETA is 8:46 AM."
}, {
    name: "HaYarkon",
    lat: 31.707981,
    lng: 34.998087,
    description: "<strong>Ninth Stop:</strong> At the midpoint between HaYarden and Luz. ETA is 8:47 AM."
}, {
    name: "Bottom of Ayalon Park",
    lat: 31.711840,
    lng: 34.990501,
    description: "<strong>Tenth Stop:</strong> After the corner of Ayalon and Kishon. ETA is 8:48 AM."
}, {
    name: "Grill Burger",
    lat: 31.712675,
    lng: 34.988595,
    description: "<strong>Eleventh Stop:</strong> On the corner of Kishon and Tse'elim. ETA is 8:49 AM."
}, {
    name: "Hever",
    lat: 31.713287,
    lng: 34.982389,
    description: "<strong>Final Stop:</strong> After the roundabout where Tse'elim and Hever intersect. ETA is 8:50 AM."
}];

//GOOGLE MAPS API
var map, marker, infowindow;
//create an infowindow variable outside of the loop so only one window is open at a time
function initMap() {
    // Create a map object and specify the DOM element for display.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 31.714564,
            lng: 34.990076
        },
        zoom: 16,
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
    this.description = ko.observable(data.description);
    this.infowindow = infowindow;
    var marker = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(data.lat, data.lng),
        animation: google.maps.Animation.DROP
    });

    this.marker = marker; //recreate marker for each stop instance

    this.marker.addListener('click', function(e) {
        this.openWindow();
    });
}

/* Method on prototype: modifying prototype of stop class: more efficient, b/c will only create instance once;
 * Organize code better by moving every function that is a property of the prototype
 * TASK: Add functionality to animate a map marker when either the list item associated with it or the map marker itself is selected.
 * TASK: Add functionality to open an infoWindow with information
 */
Stop.prototype.openWindow = function() {
    var stop = this; //referring to current instance
    this.callFlickr();
    infowindow.setContent('<h3>' + stop.name() + '</h3>' + '<img src="' + stop.imgURL + '"><p>' + stop.description() + '</p>');
    infowindow.setOptions({
        position: new google.maps.LatLng(stop.lat, stop.lng),
    });

    infowindow.open(map, stop.marker); //impt to pass marker also

    stop.marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
        stop.marker.setAnimation(null);
    }, 1400);
};

/* You can construct the source URL to a photo once you know its ID, server ID,
 * farm ID and secret, as returned by many API methods. The URL takes the
 * following format: https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg
 * https://www.flickr.com/services/api/explore/flickr.photos.getRecent
 */

//flickr need to make a new request with each img
Stop.prototype.callFlickr = function() {
    var stop = this;
    $.ajax({
        url: "https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=6d5c5a20d108f8f56f324394d3e2381f&per_page=1",
        jsonp: "jsoncallback",
        dataType: "jsonp",
        data: {
            format: "json"
        },
        // Work with the response
        success: function(data) {
            console.log(data); // server response
            var photoURL = 'https://farm' + data.photos.photo["0"].farm + '.static.flickr.com/' + data.photos.photo["0"].server + '/' + data.photos.photo["0"].id + '_' + data.photos.photo["0"].secret + '_q.jpg';
            console.log(photoURL);
            stop.imgURL(photoURL);
        }
    });
    // $.getJSON(url)
    // .success(function(data) {
    //     $.each(data.photos.photo, function( i, item ) {
    //         var photoURL = 'https://farm' + data.farm + '.static.flickr.com/' + data.server + '/' + data.id + '_' + data.secret + '_m.jpg';
    //         stop.imgURL(photoURL);
    //     });
    // })
    // .fail(function(e) {
    //         console.log("The Flickr API has encountered an error.  Please try again later.", e);
    //         stop.imgURL("http://placehold.it/240x180?text=ERROR!");
    //     });
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
        var stopInstance = new Stop(stop) //create a new instance from JSON
        self.allStops().push(stopInstance);
    });

    self.selectStop = function(stop) {
        self.unselectAll();
        stop.selected(true);
        stop.openWindow();
    };

    self.unselectAll = function() {
        for (var i = 0; i < self.allStops().length; i++) {
            self.allStops()[i].selected(false);
        }
    };

    //Trigger unselectAll when user closes infowindow
    google.maps.event.addListener(infowindow, "closeclick", function() {
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
                var nameLC = stop.name().toLowerCase();
                if (nameLC.indexOf(search) > -1) {
                    stop.showStop(true);
                    stop.marker.setVisible(true);
                } else {
                    stop.showStop(false);
                    stop.marker.setVisible(false);
                }
            })
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
    alert("The Google Maps application has encountered an error.  Please try again later.");
};
