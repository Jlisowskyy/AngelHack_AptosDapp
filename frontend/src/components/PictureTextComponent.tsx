import RoundedCardComponent from "@/components/RoundedCardComponent";

export interface PictureTextData {
    picture: string;
    text: string;
    title: string;

}

export function PictureTextComponent({data}: { data: PictureTextData }) {
    return (
        <div className={"w-[100vw] h-[calc(100vh)] bg-cover bg-center p-[10%]"}
             style={{backgroundImage: `url(${data.picture})`}}>
            <RoundedCardComponent title={data.title} text={data.text} className={"w-[25vw]"}/>
        </div>
    );
}