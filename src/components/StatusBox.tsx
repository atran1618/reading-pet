type StatusBoxProps = {
    message: string;
}

export default function StatusBox({message}: StatusBoxProps){
    return(
        <div className="w-full min-h-[140px] rounded-3xl bg-gray-200 shadow-sm border border-gray-300  p-6 flex items-center justify-center text-center">
            <p className="text-lg font-semibold">
                {message}
            </p>
        </div>
    )
}