import React from 'react';
import { useState } from 'react';
import qs from 'qs';
import Axios from 'axios';
import styles from './Form.module.css';
import {useSpring, animated} from 'react-spring'
import { FaAt, FaSignature } from 'react-icons/fa';
import { FiUnlock } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

function validateinput(input) {
    var error = {status: true, name: '', email: '', password: ''}

    const nameRegex = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/;
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;

    if(!nameRegex.test(input.name)) {
        error.name = '*Please enter a valid name';
    }else if(!emailRegex.test(String(input.email).toLowerCase())){
        error.email = '*Please enter a valid email';
    }else if(!passwordRegex.test(input.password)){
        error.password = '*Invalid password requirements 8+ Characters, 1 Capital letter, 1 number';
    }else{
        error.status = false
    }

    return error;
}

function Form({url}) {
    const params = qs.parse(window.location.search, { ignoreQueryPrefix: true });
    console.log(params)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState({status: false, name: '', email: params.errEmail || '', password: ''})

    const [formType, setFormType] = useState(false)
    const aniNameInput = useSpring({opacity: formType ? 1 : 0, scale: formType ? 1 : 0, height: formType ? '74px' : '0px'})

    const aniParagraphIn = useSpring({opacity: formType ? 0 : 1, translateY: formType ? '100%' : '0%'})
    const aniParagraphUp = useSpring({opacity: formType ? 1 : 0, translateY: formType ? '-100%' : '0%'})

    const aniHeadlineIn = useSpring({opacity: formType ? 0 : 1, translateY: formType ? '100%' : '0%'})
    const aniHeadlineUp = useSpring({opacity: formType ? 1 : 0, translateY: formType ? '-100%' : '0%'})
    const aniHeadWidth = useSpring({config : {duration:200}, width: formType ? '43px' : '31px'})

    const submitForm = async () => {

        if(formType === false){
            Axios.post(url + "/auth/login", {
                username: email,
                password: password
            }, {withCredentials: true})
            .then((res) => {window.open("https://oauth-project.herokuapp.com", "_self");})
            .catch((err) => {
                setError({status: true, name: '', email: '*invalid email or password', password: ''})
            })
        }else{
            var newUser = {
                name: name,
                email: email,
                password: password
            }

            console.log(newUser)
            await setError(validateinput(newUser));

            if(!error) {
                Axios.post(url + "/auth/register", newUser)
                .then(() => {
                setName('');
                setPassword('');
                setFormType(!formType);
                })
                .catch((err) => setError(err.response.data))
            }      
        }
    }

    const googleLogin = () => {
        window.open(url + "/auth/google", "_self");
      }

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <div className={styles.header}>
                    <div className={styles.paragraphContainer}>
                        <animated.p style={aniParagraphIn}>WELCOME BACK</animated.p>
                        <animated.p style={aniParagraphUp}>START FOR FREE</animated.p>                        
                    </div>
                    <div className={styles.headerHeadline}>
                        <h1>Sign ‏‏‎ </h1>
                        <animated.div className={styles.headlineContainer} style={aniHeadWidth}>
                            <animated.h1 style={aniHeadlineIn}>in</animated.h1>
                            <animated.h1 style={aniHeadlineUp}>up</animated.h1>                        
                        </animated.div>
                        <h1> ‏‏‎ to Zoho.</h1>
                    </div>
                    <div className={styles.paragraphContainer}>
                        <animated.p style={aniParagraphIn}>Become a member? <a href="javascript:;" onClick={() => setFormType(!formType)}>Sign Up</a></animated.p>
                        <animated.p style={aniParagraphUp}>Already a member? <a href="javascript:;" onClick={() => setFormType(!formType)}>Sign in</a></animated.p>             
                    </div>             
                </div>
                <div className={styles.form}>
                    <animated.div style={aniNameInput}>
                        <label>Name</label><br/>
                        <div className={styles.input}>
                            <input type="text" name="name" placeholder="John Doe"
                            onChange={(e) => setName(e.target.value) } value={name}></input>
                            <FaSignature />
                        </div>
                    </animated.div>
                    <p className={styles.error} style={formType ? {display: 'block'} : {display:'none'}}>{error.name}</p>

                    <label>E-mail</label><br/>
                    <div className={styles.input}>
                        <input type="text" name="email" placeholder="name@mail.com"
                        onChange={(e) => setEmail(e.target.value) } value={email}></input>
                        <FaAt />
                    </div>
                    <p className={styles.error}>{error.email}</p>

                    <label>Password</label><br/>
                    <div className={styles.input}>
                        <input type="Password" name="password" placeholder="8+ Characters, 1 Capital letter, 1 number"
                        onChange={(e) => setPassword(e.target.value) } value={password}></input>
                        <FiUnlock />
                    </div>
                    <p className={styles.error}>{error.password}</p>

                    <button className={styles.button} onClick={submitForm}>
                        <div className={styles.paragraphContainerButton}>
                            <animated.p style={aniParagraphIn}>Sign in to account</animated.p>
                            <animated.p style={aniParagraphUp}>Create an account</animated.p>                        
                        </div>
                    </button>     
                    <button className={`${styles.button} ${styles.google}`} onClick={googleLogin}>
                        <FcGoogle /> 
                        <div className={styles.paragraphContainerButton}>
                                <animated.p style={aniParagraphIn}>Sign in with Google</animated.p>
                                <animated.p style={aniParagraphUp}>Sign up with Google</animated.p>                        
                        </div>
                    </button>        
                </div>
                <div className={styles.footer}>
                    <p><a href="#">Privacy Policy</a> and <a href="#">Terms of Service</a> apply</p>   
                    <p>Check the code out at <a href="https://github.com/Tomodo531/OAuth-Public">Github</a></p>               
                    
                </div>
            </div>    
        </div>
    )
}

export default Form
