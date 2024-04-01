import Image from "next/image";
import home_bird from '@/public/img/home_bird.png'

export default function Home() {
    return (
        <div className="container flex flex-col md:flex-row gap-5 h-[calc(100vh-4rem)]">
            <div className="basis-full flex flex-col justify-center md:basis-2/3">
                <p className="special-word text-xs">Protect All the Birds </p>
                <h1 className="pb-5">
                    The World's <span className="special-word">Rarest</span><br/>Birds
                </h1>
                <p>As bird-lovers, we know that these are the most beautiful creatures in the world  and also - the most vulnerable. Human activity, deforestation and other world-changing conditions have made a huge impact on our feathery friends and many are now on the brink of extinction.</p>
            </div>

            <div className="hidden md:block basis-1/3">
                <Image 
                    src={home_bird}
                    alt="Home Bird"
                    sizes="100vh"
                    className="w-full h-auto"
                />
            </div>
        </div>
    );
}
