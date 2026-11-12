// import {
//   Send,
// } from "lucide-react";

// const messages = [
//   "Hi Admin, I’ve completed the initial verification.",
//   "Thanks for the update.",
//   "Please prioritize pending applications.",
//   "Candidate uploaded updated ID proof.",
// ];

// function MessagePanel() {

//   return (
//     <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 h-full flex flex-col">

//       <h2 className="text-2xl font-semibold mb-5">
//         Message
//       </h2>

//       {/* MESSAGES */}
//       <div className="space-y-5 flex-1 overflow-auto">

//         {messages.map((msg, index) => (

//           <div
//             key={index}
//             className="flex gap-3"
//           >

//             <img
//               src={`https://i.pravatar.cc/150?img=${index + 30}`}
//               alt=""
//               className="w-10 h-10 rounded-full"
//             />

//             <p className="text-sm text-gray-700 leading-6">
//               {msg}
//             </p>

//           </div>
//         ))}

//       </div>

//       {/* INPUT */}
//       <div className="mt-5 border rounded-full px-4 py-2 flex items-center">

//         <input
//           type="text"
//           placeholder="Keep me updated..."
//           className="flex-1 outline-none text-sm"
//         />

//         <button>

//           <Send
//             size={18}
//             className="text-indigo-700"
//           />

//         </button>

//       </div>

//     </div>
//   );
// }

// export default MessagePanel;


import { Send } from "lucide-react";
import { useState } from "react";

const initialMessages = [
  { id: 1, text: "Hi Admin, I've completed the initial verification for Candidate 587412. Please review the submitted documents.", self: false, img: 10 },
  { id: 2, text: "Thanks for the update. I'll review the profile and update the status shortly.", self: true, img: 5 },
  { id: 3, text: "I noticed a few verification requests are delayed. Please prioritize the pending applications.", self: false, img: 11 },
  { id: 4, text: "Understood. I'll coordinate with the HR team and speed up the process.", self: true, img: 5 },
  { id: 5, text: "The candidate's address verification is still pending. Could you follow up with the candidate?", self: false, img: 12 },
  { id: 6, text: "Sure, I'll contact the candidate and request the remaining documents.", self: true, img: 5 },
  { id: 7, text: "The candidate uploaded updated ID proof.", self: false, img: 13 },
  { id: 8, text: "I've received it. Verification is now in progress.", self: true, img: 5 },
];

function MessagePanel() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), text: input, self: true, img: 5 }]);
    setInput("");
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 h-full flex flex-col">

      {/* TITLE */}
      <h2 className="text-base font-semibold text-gray-900 mb-4">message</h2>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 mb-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-2 ${msg.self ? "flex-row-reverse" : ""}`}>

            <img
              src={`https://i.pravatar.cc/150?img=${msg.img}`}
              alt=""
              className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
            />

            <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-[11px] leading-4 text-gray-700 ${
              msg.self ? "bg-indigo-50 rounded-tr-none" : "bg-gray-100 rounded-tl-none"
            }`}>
              {msg.text}
            </div>

          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Keep me updated once the verification is completed."
          className="flex-1 text-[11px] text-gray-600 outline-none placeholder:text-gray-400 bg-transparent"
        />
        <button
          onClick={handleSend}
          className="text-indigo-600 hover:text-indigo-800 transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}

export default MessagePanel;