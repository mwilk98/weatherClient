import React, {useState, useEffect} from 'react';
import './UserPanel.css';
import Axios from 'axios';
import UserWeatherItem from './UserWeatherItem';
import {Link} from 'react-router-dom';
import { useForm } from 'react-hook-form';

function UserPanel()
{

    const [Lid, setLid] = useState('');

    const { register, handleSubmit, formState: { errors }} = useForm();
  const onSubmit = (values) => {
    console.log(values)
    Axios.post('https://weather-mysql-deploy.herokuapp.com/api/insert',
        {
            cityName:values.cityName,
            date:values.date,
            time:values.time,
            weatherState:values.weatherState,
            temp:values.temp,
            clouds:values.clouds,
            humidity:values.humidity,
            pressure:values.pressure,
            wind:values.wind,
            aqi:values.aqi
        }).then((response) =>
        {
            console.log(response);
            if(!response.data.err){
                
                alert(`Dodano dane`)
                //window.location.reload(false);
            }else{

                alert(`Nie dodano danych!`)
            }
        })
        setcityWeatherList([...cityWeatherList,{
            cityName:values.cityName,
            date:values.date,
            time:values.time,
            weatherState:values.weatherState,
            temp:values.temp,
            clouds:values.clouds,
            humidity:values.humidity,
            pressure:values.pressure,
            wind:values.wind,
            aqi:values.aqi
        },]);
        window.location.reload(false);
  };


    const [cityWeatherList, setcityWeatherList] = useState([]);
    const [property, setProperty] = useState([]);

    Axios.defaults.withCredentials = true;

    const [loginStatus, setLoginStatus] = useState('');
    console.log(loginStatus);

   
    useEffect(()=>
    {
        Axios.get('https://weather-mysql-deploy.herokuapp.com/api/login').then((response)=>
        {
            if(response.data.loggedIn===true)
            {
                setLoginStatus(response.data.user[0].username);
                console.log(response);
            }else
            {
                console.log(response);
                setLoginStatus("unlogged");
            }
        });

        Axios.get('https://weather-mysql-deploy.herokuapp.com/api/get')
        .then((response)=>
        {
            
                setcityWeatherList(response.data);
                setProperty(response.data[0]);
                console.log(response);
                console.log("PropertyGet:",property);
            
            if(response.data==""){
                alert("Błąd servera - offline")
            }
            
        });
        
        setLid(0);
        setProperty(cityWeatherList[Lid]);
    },[])

    const deleteWeather = (id) =>
    {
        console.log(id);
        Axios.post('https://weather-mysql-deploy.herokuapp.com/api/delete',
        {
            id:id
        });
        
        window.location.reload(false);
        
        console.log("USUNIETO");
    }
    const logout = () =>
    {
        Axios.post('https://weather-mysql-deploy.herokuapp.com/api/logout')
            .then((response) =>
            {
            console.log(response);
            if(response.data.message)
            {
                setLoginStatus("logged");
            }else
            {
                setLoginStatus("unlogged");
            }
        })
        Axios.get('https://weather-mysql-deploy.herokuapp.com/api/logout').then((response)=>
        {
            if(response.data.loggedIn===false)
            {
                console.log(response);
                setLoginStatus("unlogged");
            }else
            {
                setLoginStatus("logged");
                console.log(response);
            }
        })
        window.location.reload(false);
    }
    const nextProperty = () => 
    {
        const newIndex = Lid+1;
        setLid(Lid+1);
        setProperty(cityWeatherList[newIndex]);

        console.log("New index:",newIndex);
        console.log("Property:",property);
    }
    
    const prevProperty = () => 
    {
        const newIndex = Lid-1;
        setLid(Lid-1);
        setProperty(cityWeatherList[newIndex]);
        console.log("New index:",newIndex);
        console.log("Property:",property);
    }
    if(loginStatus!=="unlogged")
    {
        return(
            <div className="hero2"  style={
                                    { 
                                        backgroundImage: `url("/images/bg_signUp.jpg")` 
                                    }
            }>
                <div className="form-box2">
                    <div className="login-input-group2">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input type="text" minlength="4" className="input-field" placeholder="Nazwa Użytkownika"
                        {...register("user", {
                            required: "Required",
                        })}/>   
                        <input type="password" minlength="8" className="input-field" placeholder="Hasło"
                        {...register("password", {
                            required: "Required",
                        })}/> 

                        <input type="submit" className="submit-btn2" value="Zarejestruj"/> 
                        {errors.message && errors.message.message}
                        </form>
                        <button type="submit" className="submit-btn2" onClick={logout}> Wyloguj </button>
                    </div>
                </div>   
                <div className="user-main">
                
                    <div className="user-cards">
                        <button className="left"    style={
                                                                { 
                                                                backgroundImage: `url("/images/arrow_left.png")` 
                                                                }}
                                                                onClick={() => nextProperty()} 
                                                                disabled={Lid === cityWeatherList.length-1}
                                    >
                                    </button>
                                    <button className="right"   style={
                                                                { 
                                                                    backgroundImage: `url("/images/arrow_right.png")` 
                                                                }}
                                                                onClick={() => prevProperty()} 
                                                                disabled={Lid === 0}
                                        >
                                    </button>
                        <div className="main-cards">
                            <div className="userCards-slider">
                            {property ?(
                                <div className="userCards-slider-wrapper"   style={
                                                                            {
                                                                                'transform':`translateX(-${Lid*(100/cityWeatherList.length)}%)`
                                                                            }
                                }>
                                    {cityWeatherList.map(fde => <UserWeatherItem element={fde} deleteW={deleteWeather}/>)}
                                </div>
                                ):null}
                            </div>
                        </div>
                    </div>
                
                </div> 
            </div>
        )
    }else{
        return(
            <div className="hero"   style={
                                    { 
                                        backgroundImage: `url("/images/bg_signUp.jpg")` 
                                    }
            }>
                <div className="form-box">
                    <div className="login-input-group" >
                        <h1>Musisz być zalogowanym aby korzystać z tej funkcji.</h1>
                        <Link to='/sign-up'><button type="submit" className="submit-btn"> Zaloguj </button></Link>
                    </div>
                </div>   
            </div>
        )
    }
}
export default UserPanel;