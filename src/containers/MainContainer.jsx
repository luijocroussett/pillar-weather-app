import React, { useEffect, useState } from 'react';
import Label from '../components/Label';
import Input from '../components/Input';
import Button from '../components/Button';
import Select from '../components/Select';
import Chart from '../components/Chart';

function MainContainer({ coords }) {
  const [options] = useState(['City or Zip', 'city', 'zip']);
  // recentSearch keeps tracks of last 3 searches
  const [recentSearch, setRecentSearch] = useState([
    'Nothing yet',
    'Nothing yet',
    'Nothing yet',
  ]);
  // State to control input
  const [inputValue, setInputValue] = useState('');
  // State to control input of select component
  const [selectValue, setSelectValue] = useState('');
  // State that keeps track of the current search
  const [city, setCity] = useState('Current Location');
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

  const getWeather = (location, option) => {
    let url = '';
    if (option === 'city')
      url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=af7a365a9e19a4229a34c931402b7bc5`;
    else if (option === 'zip')
      url = `https://api.openweathermap.org/data/2.5/weather?zip=${location}&appid=af7a365a9e19a4229a34c931402b7bc5`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.hasOwnProperty('message')) {
          setValidationError([true, data.message]);
          setChartData([
            { name: 'temp', temp: 0 },
            { name: 'hum', hum: 0 },
            { name: 'pre', pre: 0 },
          ]);
        } else {
          setChartData([
            {
              name: 'temp',
              temp:
                tempType === 'C'
                  ? data.main.temp - 273.15
                  : (9 / 5) * (data.main.temp - 273) + 32,
            },
            { name: 'hum', hum: data.main.humidity },
            { name: 'pre', pre: data.main.pressure },
          ]);
          setCity(data.name);
          setValidationError([false, '']);
        }
      });
  };

  useEffect(() => {
    // get location
    navigator.geolocation.getCurrentPosition(
      position => {
        setValidationError([true, 'locating user...']);
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=af7a365a9e19a4229a34c931402b7bc5`;
        fetch(url)
          .then(response => response.json())
          .then(data => {
            console.log(data);
            setValidationError([false, '']);
            setChartData([
              {
                name: 'temp',
                temp:
                  tempType === 'C'
                    ? data.main.temp - 273.15
                    : (9 / 5) * (data.main.temp - 273) + 32,
              },
              { name: 'hum', hum: data.main.humidity },
              { name: 'pre', pre: data.main.pressure },
            ]);
          })
          .catch(() => console.log('error'));
      },
      () => {
        setValidationError([true, 'location error']);
      },
    );
  }, [tempType]);

  const handleInputChange = event => {
    setInputValue(event.target.value);
    event.target.value !== '' && selectValue !== 'city or zip'
      ? setButtonStatus(true)
      : setButtonStatus(false);
  };

  const handleSelectChange = event => {
    setSelectValue(event.target.value);
    event.target.value !== 'city or zip' && inputValue !== ''
      ? setButtonStatus(true)
      : setButtonStatus(false);
  };

  const handleClick = () => {
    if (selectValue === '' || inputValue === '')
      setValidationError([true, 'missing fields']);
    else {
      const recentSearchClone = recentSearch;
      setValidationError([false, '']);
      getWeather(inputValue, selectValue);
      setRecentSearch([recentSearchClone[1], recentSearchClone[2], city]);
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
        defaultText={selectValue ? selectValue : 'City or Zip'}
        text={selectValue ? selectValue : 'City or Zip'}
        options={options}
        handleChange={handleSelectChange}
        size={'10px'}
        width={'195px'}
      />
      <Label text={'Search for your location'} size={'12px'} />
      <Input
        text={inputValue ? inputValue : 'Enter city or Zip'}
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
      <Label text={recentSearch[2]} />
      <Label text={recentSearch[1]} />
      <Label text={recentSearch[0]} />
    </div>
  );
}

export default MainContainer;
