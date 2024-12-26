import { Card, CardContent } from "@/components/ui/card";
import { useMusicStore } from "@/stores/useMusicStore";
import { Loader } from "lucide-react";

interface StatsCardProps {
    icon: React.ElementType;
    label: string;
    value: string;
    bgColor: string;
    iconColor: string;
}

const StatsCard = ({icon:Icon, bgColor, label, value, iconColor}: StatsCardProps) => {

    const { isStatsLoading } = useMusicStore();

  return (
    <Card className="bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-800/80 transition-colors">
            <CardContent className="p-6">
        {isStatsLoading ? <div className="size-full flex items-center justify-center"> <Loader className="text-emerald-500 animate-spin" /> </div> :
            <div className="flex items-center gap-4 ">
                <div className={`${bgColor} w-12 h-12 rounded-lg flex items-center justify-center`}>
                    <Icon className={`size-6 ${iconColor}`}/>
                </div>
                <div>
                    <p className="text-sm text-zinc-400">{label}</p>
                    <p className="text-2xl font-bold">{value}</p>
                </div>
                <div></div>
            </div>
        }
        </CardContent>
    </Card>
  )
}

export default StatsCard
