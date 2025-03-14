import React, { useCallback, useEffect, useState } from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import MarkerItem from '@/components/MarkerItem';
const containerStyle = {
    width: '90%',
    height: '80vh',
    borderRadius:10
  };

const mapStyles = [
  {
    "featureType": "all",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "weight": "2.00"
      }
    ]
  },
  {
    "featureType": "all",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#9c9c9c"
      }
    ]
  },
  {
    "featureType": "all",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "landscape",
    "elementType": "all",
    "stylers": [
      {
        "color": "#f2f2f2"
      }
    ]
  },
  {
    "featureType": "landscape",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "landscape.man_made",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "all",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "all",
    "stylers": [
      {
        "saturation": -100
      },
      {
        "lightness": 45
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#7b7b7b"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "all",
    "stylers": [
      {
        "visibility": "simplified"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "all",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "all",
    "stylers": [
      {
        "color": "#46bcec"
      },
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#c8d7d4"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#070707"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  }
];

function GoogleMapSection({coordinates,listing}) {
   
    const [center,setCenter]=useState({
        lat: 14.6212423,
        lng: 120.5770039
      })
      const [map, setMap] = useState(null)
    //   const { isLoaded } = useJsApiLoader({
    //     id: 'google-map-script',
    //     googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY
    //   })
      useEffect(()=>{
        coordinates&&setCenter(coordinates)
      },[coordinates])
     
      useEffect(() => {
        if (map) {
          
            map.setZoom(15);
        }
    }, [map]);
      const onLoad = useCallback(function callback(map) {
        // This is just an example of getting and using the map instance!!! don't just blindly copy!
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);
        setMap(map)
       
      }, [])
      const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
      }, [])
  return (
    <div>
        <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={map=>setMap(map)}
        
        onUnmount={onUnmount}
        gestureHandling="greedy"
        options={{ styles: mapStyles }}
      >
        { /* Child components, such as markers, info windows, etc. */ }
        {listing.map((item,index)=>(
            <MarkerItem
                key={index}
                item={item}
            />
        ))}
      </GoogleMap>
    </div>
  )
}

export default GoogleMapSection