import React, { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faArrowLeft, faDownload } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import '../camera.css';

const Camera = () => {
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [mediaStream, setMediaStream] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [isBlurred, setIsBlurred] = useState(false);
    const [cameraAccess, setCameraAccess] = useState(null);
    const [refreshNeeded, setRefreshNeeded] = useState(false);
    const [hasRequestedPermission, setHasRequestedPermission] = useState(false);

    useEffect(() => {
        getCameraPermission();
    }, []);

    const getCameraPermission = async () => {
        if (hasRequestedPermission) return;

        setHasRequestedPermission(true);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            setCameraAccess(true);
            stream.getTracks().forEach(track => track.stop());
            startCamera();
        } catch (error) {
            console.error("Camera access denied or unavailable:", error);
            setCameraAccess(false);
            setRefreshNeeded(true);
        }
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            setMediaStream(stream);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error('Error accessing camera:', err);
        }
    };

    const stopCamera = () => {
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
            setMediaStream(null);
        }
    };

    const captureImage = () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;

        if (video && video.videoWidth && video.videoHeight) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0);

            const imageData = canvas.toDataURL('image/jpeg');
            analyzeContent(imageData);
        } else {
            console.error("Video dimensions not available yet.");
        }
    };

    const analyzeContent = async (imageData) => {
        const isInappropriate = Math.random() > 0.7;

        if (isInappropriate) {
            setIsBlurred(true);
            const blurredImage = await applyBlur(imageData);
            setCapturedImage(blurredImage);
        } else {
            setIsBlurred(false);
            setCapturedImage(imageData);
            storeImage(imageData);
        }
    };

    const applyBlur = async (imageData) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;

                ctx.filter = 'blur(20px)';
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL('image/jpeg'));
            };
            img.src = imageData;
        });
    };

    const storeImage = (imageData) => {
        const storedImages = JSON.parse(localStorage.getItem('capturedImages') || '[]');
        const imageObject = {
            data: imageData,
            timestamp: new Date().toISOString()
        };
        storedImages.push(imageObject);
        localStorage.setItem('capturedImages', JSON.stringify(storedImages));
    };

    const downloadImage = () => {
        if (!isBlurred && capturedImage) {
            const link = document.createElement('a');
            link.href = capturedImage;
            link.download = `captured-image-${new Date().toISOString()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleTakeAnother = () => {
        setCapturedImage(null);
        setIsBlurred(false);

        if (cameraAccess === false && refreshNeeded) {
            alert("Please refresh the page to grant camera access.");
        } else if (cameraAccess === false) {
            getCameraPermission();
        } else if (!mediaStream) {
            startCamera();
        }
    };

    return (
        <div className="camera-container">
            <header className="camera-header">
                <FontAwesomeIcon
                    icon={faArrowLeft}
                    className="back-icon"
                    onClick={() => navigate('/')}
                />
                <h2>Camera</h2>
            </header>

            <main className="camera-content">
                {!capturedImage ? (
                    <div className="video-container">
                        {cameraAccess === true ? (
                            <video ref={videoRef} autoPlay playsInline />
                        ) : cameraAccess === false && !refreshNeeded ? (
                            <p>Camera access denied. Please grant permission to use the camera.</p>
                        ) : cameraAccess === false && refreshNeeded ? (
                            <p>Camera access denied. Please refresh the page to grant access.</p>
                        ) : (
                            <p>Checking camera access...</p>
                        )}
                        <div className="capture-controls">
                            <button onClick={captureImage} disabled={!mediaStream}>
                                <FontAwesomeIcon icon={faCamera} /> Capture
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="result-container">
                        <img src={capturedImage} alt="Captured content" className={isBlurred ? 'blurred-image' : ''} />
                        {isBlurred ? (
                            <p className="warning">Inappropriate content detected</p>
                        ) : (
                            <button onClick={downloadImage} className="download-button">
                                <FontAwesomeIcon icon={faDownload} /> Download
                            </button>
                        )}
                        <button onClick={handleTakeAnother}>
                            Take Another
                        </button>
                    </div>
                )}
            </main>

            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
    );
};

export default Camera;