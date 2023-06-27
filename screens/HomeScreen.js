import React, {useState, useCallback,useEffect,  } from 'react';
import { ScrollView, TextInput, View, Text, Image, SafeAreaView, TouchableOpacity, } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { debounce } from 'lodash';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';

import { theme } from './../theme';
import { fetchLocations, fetchWeatherForecast, } from './../api/weather';
import { weatherImages } from './../constants/index';
import { getData, storeData } from '../utils/asyncStorage';

const HomeScreen = () => {
  const [ showSearch, toggleSearch ] = useState(false);
  const [ locations, setLocations ] = useState([]);
  const [ weather, setWeather ] = useState({});  
  const [ dc, setDc ] = useState(true);
  const [loading, setLoading] = useState(true);


  const handleLocation = loc=>{
      setLoading(true);
      toggleSearch(false);
      setLocations([]);
      fetchWeatherForecast({
        cityName: loc.name,
        days: '7'
      }).then(data=>{
        setLoading(false);
        setWeather(data);
        storeData('city',loc.name);
      })
    }


  
  const handleSearch = (value) =>{
    // Fetch locations
  	if(value.length>2){
  		fetchLocations({cityName: value}).then(data => {
  			setLocations(data);
  		})
  	}
  }

  useEffect(()=>{
      fetchMyWeatherData();
    },[]);

    const fetchMyWeatherData = async ()=>{
        let myCity = await getData('city');
        let cityName = 'Kirtipur';
        if(myCity){
          cityName = myCity;
        }
        fetchWeatherForecast({
          cityName,
          days: '7'
        }).then(data=>{
          // console.log('got data: ',data.forecast.forecastday);
          setWeather(data);
          setLoading(false);
        })
        
      }
  
  const handleTextDebounce = useCallback(debounce(handleSearch, 1000), [])

  const { current, location } = weather;

  
	return(
	  <View className={`flex-1 relative`}>
	    <StatusBar style="light" />
	    <Image blurRadius={708}
	    	source={require('./../assets/images/bg.png')}
	    	className={`absolute h-full w-full`}/>
	{
	  loading?(
	  <View className="flex-1 flex-row justify-center items-center">
	     <Progress.CircleSnail thickness={10} size={140} color="#0bb3b2" />
	   </View>
	  ):(
	    <SafeAreaView className={`flex flex-1 pt-10`}>
	      {/* Search Section */}
	      <View 
	      	style={{height: '7%'}}
	      	className={`mx-4 relative z-50`}>
	        <View
	        	style={{backgroundColor: showSearch? theme.bgWhite(0.2): 'rgba(255,255,255,0.0)'}}
	        	className={`flex-row justify-end items-center rounded-full`}>
	        	{
	        	  showSearch? (
	        	  	<TextInput
	        	  		onChangeText={handleTextDebounce}
	      	             placeholder="Search city"
	                     placeholderTextColor={'lightgray'}
	        	  		 className={`flex-1 h-10 pl-6 text-base text-white`}
	        	  	/>
	        	  ): null
	        	}
	      	   <TouchableOpacity
	      	   		onPress={() => toggleSearch(!showSearch)}
	      	   		style={{backgroundColor: theme.bgWhite(0.3)}}
	      	   		className={`rounded-full p-3 m-1`}>
	      	     <Ionicons name="ios-search" size={20} color="white" />
	      	   </TouchableOpacity>
	        </View>

	     {
	     locations.length>0 && showSearch?(
	      <View className={`absolute w-full bg-gray-300 top-16 rounded-3xl`}>
	     {
	      locations.map((loc, index) =>{
			let showBorder = index+1 != locations.length;
			let borderClass = showBorder? 'border-b-2 border-b-gray-400' : ''
	      	return(
	      	  <TouchableOpacity
	      	  	  key={index}
	      	  	  onPress={() => handleLocation(loc)}
	      	  	  className={`flex-row items-center border-0 p-3 px-4 mb-1 `+borderClass}>
	      	    <FontAwesome5 name="map-marker-alt" size={20} color="gray" />
	      		<Text> {loc?.name}, {loc?.country} </Text>	
	      	  </TouchableOpacity>
	      	);
	      })
	     }
	        
	      </View>
	    ):(
	     null
	    )
	   }
	      </View>
	      {/* Forecast Section */}
	      <View className={`flex flex-1 justify-around mx-4 mb-2`}>
	        <Text className={`text-white text-2xl text-center font-bold`}>
	          {location?.name}{location?.name?',': ''}
	           <Text className={`text-lg font-semibold text-gray-300`}> {location?.country} </Text>
   </Text >
	        {/* Weather Image */}
	        <View className={`flex-row justify-center`}>
	          <Image
	          	className={`w-52 h-52`}
	          	// source={{uri: `https:${current?.condition?.icon}`}}
	          	source={weatherImages[current?.condition?.text]}
	          	/>
	        </View>
	        {/* Degree celcius  */}
	        <View className={`space-y-2`}>
	         {
	          dc?
	          <Text onPress={()=>setDc(!dc) } className={`text-center font-bold text-white text-6xl ml-5`}>{current?.temp_c}&#176;C </Text>
	          :
	          <Text onPress={()=>setDc(!dc) } className={`text-center font-bold text-white text-6xl ml-5`}>{current?.temp_f}&#176;F </Text>
	         }
	          <Text className={`text-center text-white text-xl tracking-widest`}>{current?.condition?.text} </Text>
	        </View>
	        {/* Other states */}
	        <View className={`flex-row justify-between mx-4`}>
	          <View className={`flex-row space-x-2 items-center`}>
	            <Image
	            	className={`h-6 w-6`}
	            	source={require('./../assets/icons/wind.png')}/>
	            <Text className={`text-white text-base font-semibold`}>{current?.wind_kph} km/h </Text>
	          </View>
			  <View className={`flex-row space-x-2 items-center`}>
	            <Image
	            	className={`h-6 w-6`}
	            	source={require('./../assets/icons/drop.png')}/>
	            <Text className={`text-white text-base font-semibold`}>{current?.humidity}% </Text>
	          </View>
			  <View className={`flex-row space-x-2 items-center`}>
	            <Image
	            	className={`h-6 w-6`}
	            	source={require('./../assets/icons/sun.png')}/>
	            <Text className={`text-white text-base font-semibold`}>
	            { weather?.forecast?.forecastday[0]?.astro?.sunrise }
	            </Text>
	          </View>
	        </View>
	      </View>
	      {/* Forecast for nex day */}
	      <View className={`mb-2 space-y-3`}>
	      	<View className={`flex-row items-center mx-5 space-x-2`}>
	      	  <Ionicons name="ios-calendar-sharp" size={22} color="white" />
	      	  <Text className={`text-white text-bold`}>Daily forecast </Text>
	      	</View>
	      	<ScrollView
	      		horizontal
	      		contentContainerStyle={{paddingHorizontal: 15}}
	      		showsHorizontalScrollIndicator={false}>
	      		{
	      		 weather?.forecast?.forecastday?.map((item,index)=>{
	      		   const date = new Date(item.date);
	      		   const options = { weekday: 'long' };
	      		   let dayName = date.toLocaleDateString('en-US', options);
	      		   dayName = dayName.split(',')[0];

	      		   
	      		 	return(	      		 		
		      		<View key={index}
		      			style={{backgroundColor: theme.bgWhite(0.15)}}
		      			className={`flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4`}>
		      		  <Image
		      		    className={`h-11 w-11`}
		      		    source={weatherImages[item?.day?.condition?.text || 'other']}
		      		  	// source={require('./../assets/images/heavyrain.png')}
		      		   />
		      		  <Text className={`text-white`}> {dayName}</Text>
		      		  <Text className={`text-white text-xl font-semibold`}>
		      		  {item?.day?.avgtemp_c}&#176;
		      		  </Text>
		      		</View>
	      		 	);
	      		 })
	      		}
	      	</ScrollView>
	      </View>
	    </SafeAreaView>
	   )
	 }
	  </View>
	);
}


export default HomeScreen;
