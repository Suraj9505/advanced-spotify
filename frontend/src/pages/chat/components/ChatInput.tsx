import { useState } from "react";
import { useChatStore } from "@/stores/useChatStore"
import { useUser } from "@clerk/clerk-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

const ChatInput = () => {
    const { user } = useUser();
   const { sendMessage, selectedUser } = useChatStore();
   const [newMessage, setNewMessage] = useState('');

   const handleSend = () => {
        if(!selectedUser || !user || !newMessage) return;
        sendMessage(selectedUser.clerkId, user.id, newMessage.trim());
        setNewMessage("");
   }

  return (
    <div className="p-4 mt-auto border-t border-zinc-800">
        <div className="flex gap-2">
            <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Message..."
            className="bg-zinc-800 border-none"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <Button size={"icon"} onClick={handleSend} disabled={!newMessage.trim()}>
                <Send className="text-zinc-300"/>
            </Button>
        </div>
    </div>
  )
}

export default ChatInput
