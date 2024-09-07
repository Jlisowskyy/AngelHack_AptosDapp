import {PictureTextData, PictureTextComponent} from "@/components/PictureTextComponent";
import {StickySlidesComponent} from "@/components/StickySlidesComponent";

const data: PictureTextData[] = [
    {
        picture: "/home_pic1.jpg",
        text: "We are solving the problem of inefficiency and lack of trust in event ticket sales by" +
            " leveraging blockchain and NFTs. Traditional ticketing systems suffer from issues like fraud," +
            " overpriced secondary markets, and limited transferability. Our application simplifies the" +
            " process of creating events, selling tickets, and enabling secure, transparent ticket trading," +
            " all while ensuring authenticity and eliminating middlemen. With NFTs, users gain full ownership" +
            " of their tickets, making the experience seamless, secure, and efficient for both event organizers and attendees.",
        title: "Named tickets problem"
    },
    {
        picture: "/home_pic2.jpg",
        text: "We solve the problem by using blockchain and NFTs to create a transparent, secure platform " +
            "for event ticketing. Our application allows event organizers to easily issue and sell" +
            " festival flight tickets as NFTs, ensuring authenticity and eliminating fraud." +
            " Attendees can buy, sell, or trade their tickets freely on the blockchain, with no intermediaries" +
            " and full ownership of their assets. This creates a seamless, trustworthy experience for both organizers" +
            " and users, ensuring safe transactions and flexible ticket management.",
        title: "Our solution"
    },
    {
        picture: "/home_pic3.jpg",
        text: "Our application is versatile and can be applied wherever tickets are used, from music" +
            " festivals and sports events to flights and conferences. By using blockchain and NFTs," +
            " we streamline ticket creation, sales, and trading across various industries, ensuring " +
            "security and ease of use. Whether it's for a major festival, an international flight, or" +
            " a local seminar, our platform enhances ticket management and authenticity, making it ideal " +
            "for any event requiring secure and efficient ticketing solutions.",
        title: "Use cases"
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
