import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChatStore } from "@/stores/useChatStore"

const ChatContainer = () => {
    const { user } = useUser();
   const { messages, selectedUser, fetchMessages } = useChatStore();

   useEffect(()=> {
    if(selectedUser) fetchMessages(selectedUser.clerkId);
   }, [selectedUser]);

   const formatTime = (date: string) => {
	return new Date(date).toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});
};

    return (
        <>
            {/* Messages */}
            <ScrollArea className="h-[calc(100vh-340px)]">
                {messages.map((message)=> (
                    <div key={message._id} className={`flex items-start gap-2 mt-2 ${message.senderId === user?.id ? "flex-row-reverse" : ""} `}>
                        <Avatar className="size-8">
                            <AvatarImage src={message.senderId === user?.id ? user?.imageUrl : selectedUser?.imageUrl}/>
                        </Avatar>
                        <div className={`rounded-md p-3 max-w-[70%] ${message.senderId === user?.id ? "bg-emerald-600" : "bg-zinc-700"}`}>
                            <p className="text-sm text-white">{message.content}</p>
                            <span className="text-xs text-zinc-300 mt-1 block">{formatTime(message.createdAt)}</span>
                        </div>
                    </div>
                ))}
            </ScrollArea>
        </>
    )
}

export default ChatContainer
