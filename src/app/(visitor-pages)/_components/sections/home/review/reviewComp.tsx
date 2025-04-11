import Image from 'next/image';

interface reviewCompProps{
    userAvatar:string, 
    name:string, 
    title:string, 
    text:string
}
function ReviewComp({ userAvatar, name, title, text }: reviewCompProps) {
    return (
        <div className="rounded-lg w-full pt-5 md:pt-8" id="content">
            <div className="flex items-center w-full mb-4">
                <Image src={userAvatar} alt={name} width={100} height={100} className="w-24 h-24 rounded-full border-2 border-white mr-4" />
                <div>
                    <h4 className="font-bold">{name}</h4>
                    <p className="text-blue-500">{title}</p>
                </div>
            </div>
            <p>{text}</p>
        </div>
    )
}

export default ReviewComp
