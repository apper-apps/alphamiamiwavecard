import { useEffect } from 'react';

const PromptPassword = () => {
    useEffect(() => {
        const { ApperUI } = window.ApperSDK;
        ApperUI.showPromptPassword('#authentication-prompt-password');
    }, []);

    return (
        <>
            <div className="flex-1 py-12 px-5 flex justify-center items-center min-h-screen bg-gradient-to-br from-miami-background via-miami-surface to-miami-background">
                <div id="authentication-prompt-password" className="bg-miami-surface/50 backdrop-blur-sm mx-auto w-[400px] max-w-full p-10 rounded-2xl border border-miami-pink/10"></div>
            </div>
        </>
    );
};

export default PromptPassword;