import { useNavigate, useParams } from "react-router-dom";
import retrn from '../assets/images/return.svg';
import { useEffect ,useMemo, useState } from "react";
import bingoCells, { BingoCell } from "../objects/bingoCells";
import skull from '../assets/images/skull.svg'
import bingowav from '../assets/sounds/bingo.wav'

class BingoDob {
    constructor (idx, item) {
        this.idx = idx;
        this.cell = item;
    }
}

const bingos = [
    //row
    [0,1,2,3,4],
    [5,6,7,8,9],
    [10,11,12,13,14],
    [15,16,17,18,19],
    [20,21,22,23,24],
    //col
    [0,5,10,15,20],
    [1,6,11,16,21],
    [2,7,12,17,22],
    [3,8,13,18,23],
    [4,9,14,19,24],
    //diag
    [0,6,12,18,24],
    [4,8,12,16,20]
]

function Bingo() {
    const { seed } = useParams()
    const [animating, setAnimating] = useState(false)
    const [fadingOut, setFadingOut] = useState(false)
    const [animateOut, setAnimateOut] = useState(false);
    const [bingo, setBingo] = useState(false)
    const freeItem = new BingoCell(-1,'Free', '');
    const [dobbedItems, setDobbedItems] = useState([new BingoDob(12,freeItem)]);
    const genSeed = useMemo(() => parseInt(seed ?? getRandomInt(), 10), [seed]);

    const bingoOptions = useMemo(() => {
        const options = getSeededShuffledSubset(bingoCells, genSeed, 24);
        options.splice(12, 0, freeItem);
        return options;
        }, [genSeed]);
    const nav = useNavigate()

    const handleClick = () => {
        setAnimating(true)
        setTimeout(() => {
            setFadingOut(true)
            setTimeout(() => {
                nav('/')
            }, 500)
        }, 600)
    }
    
    const dobItem = (i,item) => {
        if(item.idx === -1) {
            return;
        }
        let dob = new BingoDob(i,item);
        setDobbedItems(prev => {
            const exists = prev.find(itm => itm.cell.idx === item.idx);
            if (exists) {
                return prev.filter(itm => itm.cell.idx !== item.idx);
            } else {
                return [...prev, dob];
            }
        });
    }

    useEffect(() => {
        console.log("Updated dobbedItems:", dobbedItems.map(it => it.idx));
        setBingo(checkBingo(dobbedItems));
    }, [dobbedItems]);

    useEffect(() => {
        if (bingo) {
            const audioTime = setTimeout(() => {
                const audio = new Audio(bingowav)
                audio.play()
            }, 500)
            const timeout = setTimeout(() => setAnimateOut(true), 4000);
            const cleanup = setTimeout(() => {
                setBingo(false);
                setAnimateOut(false);
            }, 4800); // match your slide-out duration

            return () => {
                clearTimeout(timeout);
                clearTimeout(cleanup);
            };
        }
    }, [bingo]);

    return (
        <div className={`bingo-page ${fadingOut ? 'bingo-fade-out' : ''}`}>
            <div className="bingo-inner-content">
                <div className="bingo-grid">
                    {bingoOptions.map((item, i) => (
                        <button key={i} 
                                className={`bingo-cell ${dobbedItems.find(d => d.cell.idx === item.idx) ? 'bingoed' : ''}`}
                                onClick={() => dobItem(i,item)}>
                            {item.text}
                        </button>
                    ))}
                </div>
                <div className="bottom-div">
                    <button className={`bingo-return-button ${animating ? 'animating' : ''}`} 
                            onClick={handleClick}>
                        <img className="bingo-return-image" src={retrn}/>
                    </button>
                    <div className="seed-text">
                        <div>
                            Seed: {genSeed}
                        </div>
                    </div>
                </div>
            </div>
            {bingo &&
                <div className="bingo-div">
                    <div className={`bingo-celebration-content ${animateOut ? 'slide-out' : 'slide-in'}`}>
                        <img className="skull-image-celebration" src={skull}/>
                        <div className="bingo-celebration-text">
                            Ya got a bingo, bub!
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}


function checkBingo(dobbedItems) {
    
    const idxs = dobbedItems.map(di => di.idx);
    
    for(let bingo of bingos) {
        if (bingo.every(bg => idxs.includes(bg))) {
            return true;
        }
    }

    return false;
}

//thanks geeksforgeeks
function getSeededShuffledSubset(list, seed, count) {
    const rng = mulberry32(seed);
    const copy = [...list];
    
    for(let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [copy[i],copy[j]] = [copy[j],copy[i]]
    }
    
    return copy.slice(0,count)
}

//thanks SO
function mulberry32(a) {
    return function() {
        let t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

//thanks me
function getRandomInt() {
    const randVal = Math.random() * 9999;
    return Math.floor(randVal);
}

export default Bingo;