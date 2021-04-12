import React from 'react';
import styles from './Profile.module.css';

function Profile({user, url}) {

    const logOut = () => {
        window.open(url + "/auth/logout", "_self");
      }

    return (
        <div className={styles.container}>
            <div className={styles.profileContainer}>
                <div className={styles.pictureContainer}>
                    <img src={user.picture ? user.picture : 'https://bit.ly/2Q7H8mr'} alt=""/>
                </div>                
                <p>Welcome</p>
                <h1>{user.name}</h1>
                <p>{user.googleId ? 'Signed in with google' : 'Signed in as local' }</p><br/>
                <button className={styles.button} onClick={logOut}>Sign out</button>  
            </div>    
        </div>
    )
}

export default Profile
