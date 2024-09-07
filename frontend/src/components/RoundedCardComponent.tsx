export default function RoundedCardComponent({title, text, className = ""}: {
    title: string,
    text: string,
    className?: string
}) {
    return (
        <div className={`rounded-lg bg-white shadow-lg p-4 ${className}`}>
            <h1 className={"text-3xl font-bold pb-2"}>{title}</h1>
            <p>{text}</p>
        </div>
    );
}