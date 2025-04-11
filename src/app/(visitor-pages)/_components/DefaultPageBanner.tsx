import { ReactNode } from "react";

interface DefaultPageBannerProps{
    props : ReactNode
}
const DefaultPageBanner = ({props}:DefaultPageBannerProps) => {
    const { backgroundImage, title, description, hasButton } = props;

    const jssStyles = {
        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'background-image 0.3s ease-in-out',
        willChange: 'background-image',
    }

    return (
        <div className='flex flex-col items-center justify-center mx-auto w-full px-4 md:px-12 pt-36 pb-16 md:pb-32 overflow-hidden' style={jssStyles}>
            <div className={`flex flex-col gap-6 items-center justify-center text-white w-full max-w-screen-xl`}>
                <h1 className="text-3xl md:text-5xl font-extrabold w-full md:w-2/3 text-center">{title}</h1>
                {description &&
                    <p className="text-lg md:text-xl text-center w-full sm:w-full md:w-2/3">
                        {description}
                    </p>
                }
                {hasButton && 
                    <button className="bg-[#317ACC] py-3 px-6 mt-6 text-white rounded-md hover:bg-[#296494]">
                        {hasButton.label}
                    </button>
                }
            </div>
        </div>
    )
}

export default DefaultPageBanner