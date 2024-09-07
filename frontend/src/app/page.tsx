import {PictureTextData, PictureTextComponent} from "@/components/PictureTextComponent";
import {StickySlidesComponent} from "@/components/StickySlidesComponent";

const data: PictureTextData[] = [
    {
        picture: "/home_pic1.jpg",
        text: "ELO",
        title: "ELO TITLE"
    },
    {
        picture: "/home_pic2.jpg",
        text: "ELO2",
        title: "ELO TITLE2"
    },
    {
        picture: "/home_pic3.jpg",
        text: "ELO3",
        title: "ELO TITLE3"
    }
];

function Slides() {
    return (
        <div className={"flex flex-col"}>
            {data.map((data, index) => {
                return <PictureTextComponent key={index} data={data}/>
            })}
        </div>
    );
}

export default function Home() {
    return (
        <>
            <StickySlidesComponent slideCount={data.length} position={"vertical"}>
                <Slides/>
            </StickySlidesComponent>
        </>
    );
}
