import { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import io from 'socket.io-client';
import styles from '../styles/VideoPlayer.module.css';

let socket;

const VideoPlayer = ({ videoLink, roomId }) => { 
    const playerRef = useRef(null);
    const [playing, setPlaying] = useState(false);  
    const [playedSeconds, setPlayedSeconds] = useState(0); 
    const [muted, setMuted] = useState(false); 
    const [lastSyncTime, setLastSyncTime] = useState(0); 
    const [isAdmin, setIsAdmin] = useState(false); 

    useEffect(() => {
        socket = io('https://video-sync-app.onrender.com');

        socket.emit('joinRoom', { roomId, userId: 'some-unique-user-id' });  

        socket.on('video-control', ({ action, time }) => {
            console.log(`Received action: ${action}, time: ${time}, roomid:${roomId}`);

            if (action === 'play') {
                setPlaying(true);
                if (time !== undefined && Math.abs(time - playerRef.current.getCurrentTime()) > 1) {
                    
                    playerRef.current.seekTo(time, 'seconds');
                }
            }
            else if (action === 'pause') {
                setPlaying(false);
                if (time !== undefined && Math.abs(time - playerRef.current.getCurrentTime()) > 1) {
                    
                    playerRef.current.seekTo(time, 'seconds');
                }
            }
        });

        socket.on('new-video', (newVideoLink) => {
            if (newVideoLink === videoLink) {
                setPlaying(true);
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [videoLink, roomId]);  

    const handlePlay = () => {
        const currentTime = playerRef.current.getCurrentTime(); 
        setPlaying(true);
        setLastSyncTime(currentTime); 
        socket.emit('video-control', { roomId, action: 'play', time: currentTime });  
    };

    const handlePause = () => {
        const currentTime = playerRef.current.getCurrentTime();
        setPlaying(false);
        socket.emit('video-control', { roomId, action: 'pause', time: currentTime });  
    };

   

    const handleProgress = (state) => {
        setPlayedSeconds(state.playedSeconds);  

        if (isAdmin && state.playedSeconds - lastSyncTime > 5) {
            const currentTime = playerRef.current.getCurrentTime();
            setLastSyncTime(currentTime);
            socket.emit('video-control', { roomId, action: 'sync', time: currentTime });  
        }
    };

    return (
        <div className={styles.playercontainer}>
            <ReactPlayer
                ref={playerRef}
                url={videoLink}
                controls
                width="100%"
                height="100%"
                playing={playing}
                muted={muted}
                onPlay={handlePlay}
                onPause={handlePause}
                onProgress={handleProgress}
                onDuration={(duration) => console.log('Duration:', duration)}
                onSeek={handleProgress}
                config={{
                    youtube: {
                        playerVars: {
                            autoplay: 1, 
                        }
                    }
                }}
            />
        </div>
    );
};

export default VideoPlayer;
