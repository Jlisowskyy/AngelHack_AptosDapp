export default function BlankPage({name} : {name: string}){
    return (
        <div className={"flex justify-center items-center w-[100vw] h-[100vh] font-bold text-9xl"}>
            {name}
        </div>
    );
}