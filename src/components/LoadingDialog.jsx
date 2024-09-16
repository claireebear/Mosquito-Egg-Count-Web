import React, { useState, useEffect } from 'react';

const LoadingDialog = () => {
    const [loadingDialog, setLoadingDialog] = useState(false);

    useEffect(() => {
        const handleLoadingDialog = () => {
            setLoadingDialog(true);
        };

        // Simulate event bus subscription (replace with actual event handler in your app)
        window.addEventListener('loadingDialog', handleLoadingDialog);

        return () => {
            window.removeEventListener('loadingDialog', handleLoadingDialog);
        };
    }, []);

    useEffect(() => {
        if (loadingDialog) {
            const timer = setTimeout(() => setLoadingDialog(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [loadingDialog]);

    if (!loadingDialog) return null;

    return (
        <div className="loading text-xs-center">
            <div className="v-dialog" style={{ width: '500px', margin: '0 auto' }}>
                <div className="v-card" style={{ backgroundColor: 'blue', color: 'white' }}>
                    <div className="v-card-text">
                        <div className="v-layout" style={{ display: 'flex', alignItems: 'center' }}>
                            <div id="bot" className="v-avatar" style={{ marginRight: '10px' }}>
                                <img src="/mecvision/img/bot.gif" alt="bot" style={{ width: '24px', height: '24px' }} />
                            </div>
                            <span>Analyzing Image...</span>
                        </div>
                        <div
                            className="v-progress-linear"
                            style={{
                                backgroundColor: 'white',
                                height: '15px',
                                marginTop: '10px'
                            }}
                        >
                            <div className="v-progress-linear-indeterminate" style={{ backgroundColor: 'white' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingDialog;
