import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {IoMdSunny, IoMdRainy, IoMdCloud, IoMdSnow, IoMdThunderstorm, IoMdSearch} from 'react-icons/io';
import {BsCloudHaze2Fill, BsCloudDrizzleFill, BsEye, BsWater, BsThermometer, BsWind} from 'react-icons/bs';
import {TbTemperatureCelsius} from 'react-icons/tb';
import {ImSpinner8} from 'react-icons/im';

const APIkey = '289733faa75d2fac42edc2511a284408';

const App = () => {
  const [data, setData] = useState(null);
  const [location, setLocation] = useState('India');
  const [inputValue, setInputValue] = useState('');
  const [animate, setAnimate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleInput = (e) => {
    setInputValue(e.target.value);
  }

  const handleSubmit = (e) => {
    // console.log(inputValue);

    //If input value is not empty then:
    if(inputValue !== ''){
      //then set location
      setLocation(inputValue);
    }

    // Select input
    const input = document.querySelector('input');

    //if input value is empty
    if(input.value === ''){
      setAnimate(true);
      //after 500 milli seconds set animate to false
      setTimeout(()=>{
        setAnimate(false);
      },500) 
    }

    //clear input
    input.value = '';

    //To Prevent Defaults
    e.preventDefault();
  };

  // console.log(inputValue);

  useEffect(()=>{
    // set loading to true
    setLoading(true);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${APIkey}`;

    axios.get(url).then(res => {
      // set data after 1500 ms
      setTimeout(()=>{
        setData(res.data);
      // set loading to false
        setLoading(false);
      }, 1500)
    }).catch(err => {
        setLoading(false);
        setErrorMsg(err);
    })
  }, [location]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMsg('')
    }, 2000)
    // clear timer
    return () => clearTimeout(timer);
  }, [errorMsg]);

//  console.log(data);
  if(!data){
    return(
      <div className='w-full h-screen bg-gradientBg bg-no-repeat bg-cover bg-center flex flex-col justify-center items-center'>
        <div>
          <ImSpinner8 className='text-5xl animate-spin text-white' />
        </div>
      </div>
    );
  }
//Setting icon according to weather
  let icon;
  // console.log(data.weather[0].main);

  switch(data.weather[0].main){
    case 'Clouds': icon = <IoMdCloud />;
      break
    case 'Haze': icon = <BsCloudHaze2Fill />;
      break
    case 'Rain': icon = <IoMdRainy className='text-[#31acfb]' />;
      break
    case 'Clear': icon = <IoMdSunny className='text-[#ffde33]' />;
      break
    case 'Drizzle': icon = <BsCloudDrizzleFill className='text-[#31acfb]' />;
      break
    case 'Snow': icon = <IoMdSnow className='text-[#31acfb]' />;
      break
    case 'Thunder': icon = <IoMdThunderstorm />;
      break
  }

  // Date Object
  const date = new Date();

  return( 
    <div className='w-full h-screen bg-gradientBg bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center px-4 lg:px-0'>
      {errorMsg && (
        <div className='w-full max-w-[90vw] lg:max-w-[450px] bg-[#ff208c] text-white absolute top-[2px] lg:top-10 p-3 capitalize rounded-full text-center '>
          {`${errorMsg.response.data.message}`}
        </div>
      )}
      {/* Form Component */}
      <form 
        className={`${
          animate ? 'animate-shake' : 'animate-none'
        } h-16 bg-black/30 w-full max-w-[450px] rounded-full backdrop-blur-[32px] mb-2`}
      >
        <div className='h-full relative flex items-center justify-between p-2'>
          <input onChange={(e)=>handleInput(e)}
            className='flex-1 bg-transparent outline-none placeholder:text-white text-white text-[15px] font-light pl-6 h-full' 
            type='text' 
            placeholder='Search By City or Country' 
          />
          <button 
            onClick={(e)=>handleSubmit(e)} 
            className='bg-[#1ab8ed] hover:bg-[#15abdd] w-20 h-12 rounded-full flex justify-center items-center transition '>
            <IoMdSearch className='text-2xl text-white' />
          </button>
        </div>
      </form>
      {/* Card Component */}
      <div className='w-full max-w-[450px] min-h-[484px] bg-black/20 text-white backdrop-blur-[32px] rounded-[32px] py-5 px-6'>
        {loading ? ( 
          <div className='w-full h-full flex justify-center items-center'>
            <ImSpinner8 className='text-white text-5xl animate-spin' />
          </div> 
        ) : (
          <div>
          {/* Card Top */}
          <div className='flex items-center gap-x-5'>
            {/* Icon */}
            <div className='text-[87px]'>{icon}</div>
            <div>
              {/* Country Name  */}
              <div className='text-2xl font-semibold'>{data.name}, {data.sys.country}
              </div>
              {/* Date */}       
              <div>
                {date.getUTCDate()}/{date.getUTCMonth()+1}/{date.getUTCFullYear()}
              </div>     
            </div>
          </div>
          {/* Card Body  */}
          <div className='my-16'>
            <div className='flex justify-center items-center'>
              {/* Temprature */}
              <div className='text-[144px] leading-none font-light'>
                {parseInt(data.main.temp)}
              </div>
              {/*Celsius Icon*/}
              <div className='text-4xl '>
                <TbTemperatureCelsius />
              </div>
            </div>
            {/* Weather Description */}
              <div className='capitalize text-center'>
                {data.weather[0].description}
              </div>
          </div>
          {/*  Card Bottom */}
          <div className='max-w-[378px] mx-auto flex flex-col gap-y-4'>
            <div className='flex justify-between'>
              <div className='flex items-center gap-x-2'>
                {/* Icon */}
                <div className='text-[20px]'>
                  <BsEye/>
                </div>
                <div>
                  Visibility 
                  <span className='ml-2'>{data.visibility/1000} km</span>
                </div>
              </div>
              {/**.............................................................. */}
              <div className='flex items-center gap-x-2'>
                {/* Icon */}
                <div className='text-[20px]'>
                  <BsThermometer/>
                </div>
                <div className='flex '>
                  Feels Like 
                  <div className='flex ml-2'>
                    {parseInt(data.main.feels_like)}
                    <TbTemperatureCelsius />
                  </div>
                </div>
              </div>
            </div>

            <div className='flex justify-between'>
              <div className='flex items-center gap-x-2'>
                {/* Icon */}
                <div className='text-[20px]'>
                  <BsWater/>
                </div>
                <div>
                  Humidity 
                  <span className='ml-2'>{data.main.humidity} %</span>
                </div>
              </div>
              {/**.............................................................. */}
              <div className='flex items-center gap-x-2'>
                {/* Icon */}
                <div className='text-[20px]'>
                  <BsWind/>
                </div>
                <div>
                  Wind <span className='ml-2'>{data.wind.speed} m/s</span>
                </div>
              </div>
            </div>

          </div>
        </div>
        )      
        }
        
      </div>
    </div>
  );
};

export default App;
