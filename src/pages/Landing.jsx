import { useNavigate } from "react-router-dom";
import { useViewportHeight } from "../hooks/useViewportHeight";
import { useState } from "react";
import skull from '../assets/images/skull.svg'
import enter from '../assets/images/enter.svg'
import scream from '../assets/sounds/scream.mp3'

function Landing() {
    useViewportHeight();
    const nav = useNavigate()
    const [animating, setAnimating] = useState(false)
    const [fadingOut, setFadingOut] = useState(false)
    const [seedInputVisible, setSeedInputVisible] = useState(false)
    const [seed, setSeed] = useState('');

    const handleClick = () => {
        setAnimating(true)
        const audio = new Audio(scream)
        audio.play()
        setTimeout(() => {
            setFadingOut(true)
            setTimeout(() => {
                nav('/bingo')
            }, 500)
        }, 600)
    }

    let pressTimer = null;
    const pressTime = 1000;

    const startPress = () => {
        pressTimer = setTimeout(showSeedInput, pressTime)
    }

    const cancelPress = () => {
        clearTimeout(pressTimer)
    }

    const showSeedInput = () => {
        setSeedInputVisible(!seedInputVisible)
    }

    const navWithSeed = () => {
        nav(`/bingo/${seed}`)
    }

    return (
        <div className={`landing-page ${fadingOut ? 'fade-out' : ''}`}>
            <div className="landing-inner-content">
                <div className="title-div">
                    <button className="skull-button"
                            onMouseDown={startPress}
                            onMouseUp={cancelPress}
                            onMouseLeave={cancelPress}
                            onTouchStart={startPress}
                            onTouchEnd={cancelPress}
                    >
                        <img className="skull-image" src={skull}/>
                    </button>
                    <h2 className="title-top">BAD MOVIE</h2>
                    <h1 className="title-bottom">BINGO</h1>
                </div>
                {seedInputVisible && 
                    <div className="seed-input-div">
                        <h2 className="seed-label">Seed</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            navWithSeed();
                        }}>
                            <input  type="number" 
                                    inputMode="numeric" 
                                    maxLength="4"
                                    pattern="[0-9]*"
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (/^\d*$/.test(val)) {
                                            setSeed(val);
                                        }
                                    }}
                                    className="seed-input"/>
                            {false && 
                                <button type="submit" className="submit-button"/>
                            }
                        </form>
                    </div>
                }
                {!seedInputVisible && 
                    <div className="button-div">
                        <button className={`play-button ${animating ? 'animating' : ''}`} 
                                onClick={handleClick}>
                            <img className="sign-image" src={enter}/>
                        </button>
                    </div>
                }
            </div>
        </div>
    );
}

export default Landing;