import React, { useEffect, useState, useCallback } from 'react';
import Label from '../components/Label';
import Input from '../components/Input';
import Button from '../components/Button';
import Select from '../components/Select';
import Chart from '../components/Chart';

function MainContainer({ coords }) {
  // recentSearch keeps tracks of last 3 searches
  const [recentSearch, setRecentSearch] = useState([
    'Nothing yet',
    'Nothing yet',
    'Nothing yet',
  ]);
  // State to control input
  const [inputValue, setInputValue] = useState('Enter city or Zip');
  // State to control input of select component
  const [selectValue, setSelectValue] = useState('');
  // State that keeps track of the current search
  const [city, setCity] = useState('Current location');
  // State value that keeps tracks of the type of Temp (C or F)
  const [tempType, setTempType] = useState('C');
  // state for button validation
  const [buttonStatus, setButtonStatus] = useState(false);
  // State used to display error messages
  const [validationError, setValidationError] = useState(false);
  // Chart data
  const [chartData, setChartData] = useState([
    { name: 'temp' },
    { name: 'hum' },
    { name: 'pre' },
  ]);
  const mainContainerStyle = {
    width: '200px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const kToC = temp => Math.round(temp - 273.15);

  const kToF = temp => Math.round((9 / 5) * (temp - 273.15) + 32);

  const hPaToPa = pressure => Math.round(pressure / 100);

  const getWeather = useCallback(
    (location, option) => {
      let url = '';
      if (option === 'city')
        url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=af7a365a9e19a4229a34c931402b7bc5`;
      else if (option === 'zip')
        url = `https://api.openweathermap.org/data/2.5/weather?zip=${location}&appid=af7a365a9e19a4229a34c931402b7bc5`;
      else if (option === 'coords')
        url = `https://api.openweathermap.org/data/2.5/weather?${location}&appid=af7a365a9e19a4229a34c931402b7bc5`;
      else return;
      fetch(url)
        .then(response => {
          return response.json();
        })
        .then(data => {
          if (data.cod === 200) {
            setChartData([
              {
                name: 'temp',
                temp:
                  tempType === 'C'
                    ? kToC(data.main.temp) // convert K to Celsius
                    : kToF(data.main.temp), // convert K to Farenheit
              },
              { name: 'hum', hum: data.main.humidity },
              { name: 'pre', pre: hPaToPa(data.main.pressure) }, // convert hPascal to Pascal
            ]);
            setCity(data.name);
            setValidationError([false, '']);
          } else {
            setValidationError([true, data.message]);
            setChartData([
              { name: 'temp', temp: 0 },
              { name: 'hum', hum: 0 },
              { name: 'pre', pre: 0 },
            ]);
          }
        })
        .catch(error => console.log(error));
    },
    [tempType],
  );

  useEffect(() => {
    // get location
    setValidationError([true, 'locating user...']);
    navigator.geolocation.getCurrentPosition(
      position => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        getWeather(`lat=${lat}&lon=${lon}`, 'coords');
      },
      () => {
        setValidationError([true, 'location error']);
      },
    );
  }, [getWeather]);

  const handleInputChange = event => {
    setInputValue(event.target.value);
    event.target.value !== '' && selectValue !== ''
      ? setButtonStatus(true)
      : setButtonStatus(false);
  };

  const handleSelectChange = event => {
    setSelectValue(event.target.value);
    inputValue !== 'Enter city or Zip' && inputValue !== ''
      ? setButtonStatus(true)
      : setButtonStatus(false);
  };

  const handleClick = value => {
    let select = value ? 'city' : selectValue;
    value = value ? value : inputValue;
    if (select === '' || value === '')
      setValidationError([true, 'missing fields']);
    else if (select === 'zip' && /[a-z]/gi.test(value.toLowerCase()))
      setValidationError([true, 'zip code should not have letters']);
    else if (select === 'city' && /[0-9]/gi.test(value))
      setValidationError([true, 'When looking by city do not use numbers...']);
    else if (value !== 'Nothing yet') {
      setValidationError([false, '']);
      getWeather(value, select);
      setRecentSearch([recentSearch[1], recentSearch[2], city]);
    }
  };

  const handleTempTypeChange = () => {
    tempType === 'C' ? setTempType('F') : setTempType('C');
  };

  return (
    <div className="MainContainer" style={mainContainerStyle}>
      <Label text={'Weather App'} size={'30px'} />
      <Label text={'Search by'} size={'12px'} />
      <Select
        text={selectValue ? selectValue : 'City or Zip'}
        options={['City or Zip', 'city', 'zip']}
        handleChange={handleSelectChange}
        size={'10px'}
        width={'195px'}
      />
      <Label text={'Search for your location'} size={'12px'} />
      <Input
        text={inputValue}
        type={'text'}
        handleChange={handleInputChange}
        size={'10px'}
      />
      {validationError[0] ? (
        <Label text={validationError[1]} color={'red'} size={'8px'} />
      ) : null}
      <Button
        text={"Let's go!"}
        enabled={buttonStatus}
        handleClick={handleClick}
      />
      <Label text={city} />
      <Select
        defaultText={tempType}
        text={tempType}
        options={['C', 'F']}
        handleChange={handleTempTypeChange}
        size={'10px'}
        width={'50px'}
      />
      <Chart data={chartData} />
      <Label text={'Recent Searches:'} />
      <Label text={recentSearch[2]} size={'8px'} onClick={handleClick} />
      <Label text={recentSearch[1]} size={'8px'} onClick={handleClick} />
      <Label text={recentSearch[0]} size={'8px'} onClick={handleClick} />
    </div>
  );
}

export default MainContainer;
