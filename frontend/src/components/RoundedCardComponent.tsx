export default function RoundedCardComponent({title, text, className = ""}: {
    title: string,
    text: string,
    className?: string
}) {
    return (
        <div className={`rounded-3xl bg-white shadow-lg p-8 ${className}`}>
            <h1 className={"text-4xl font-bold pb-4"}>{title}</h1>
            <p className={"text-2xl text-justify"}>{text}</p>
        </div>
    );
}