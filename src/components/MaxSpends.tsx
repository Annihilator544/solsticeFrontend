import { useMaxSpend } from "@/store/use-max-spend";
import { Input } from "./ui/input";

function MaxSpends(){
    const { spend, setUserMaxSpend, userMaxSpend } = useMaxSpend()
    return (
        <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">Max Spends</h1>
            <div className="flex flex-col gap-2">
                {Object.entries(spend).map(([key, value]) => (
                    <div key={key} className="flex justify-between p-2 border-b border-gray-300">
                        <span>{value.name}</span>
                        <Input 
                            type="number"
                            value={userMaxSpend.find((item) => item.name === value.name)?.total || 0}
                            onChange={(e) => {
                                const newValue = parseFloat(e.target.value);
                                setUserMaxSpend(value.name, newValue);
                            }}
                            className="w-24"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MaxSpends