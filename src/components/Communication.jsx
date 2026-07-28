import React, { useState } from 'react';

function Communication({ triggerToast }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeContactId, setActiveContactId] = useState(1);
  const [inputText, setInputText] = useState('');

  // Define contacts and message history in state
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: 'Sarah Jenkins',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOnnsIyGQRXtdKlMlRbEOvUF5XvANm32XMz-jtADr_BM1ygV0rZYMrasrKyye-6D8SZfwOgEAWfSLRLWqhJQdyNTQ6PVGKpE8gRW9rHlDPeDmKt56eA0ei6EVyactjcBja2l0JFTBqR8bvyGPIZH91qWJoGplBRoGyXmXH4bCZchybK_k4PPZVT4N1tJKWrzCaAKcX-BW_8cp3VEEALcSYH-B59d8J2B1OxVZoy8F2qW8lqVKUhSaN',
      initials: 'SJ',
      bg: 'bg-blue-100 text-blue-600',
      time: '11:15 AM',
      unread: true,
      online: true,
      messages: [
        { id: 101, sender: 'Sarah Jenkins', text: "Hi! I'm putting together the final numbers for the Q4 projections. I should have them ready for your review shortly.", time: '11:10 AM', isSent: false },
        { id: 102, sender: 'You', text: "Sounds good, Sarah. Please let me know if you need any additional data from my side.", time: '11:12 AM', isSent: true },
        { id: 103, sender: 'Sarah Jenkins', text: "Will do. I'll have those Q4 projections over to you soon!", time: '11:15 AM', isSent: false }
      ]
    },
    {
      id: 2,
      name: 'Michael Chen',
      avatar: '',
      initials: 'MC',
      bg: 'bg-amber-900 text-white',
      time: 'Yesterday',
      unread: false,
      online: false,
      messages: [
        { id: 201, sender: 'Michael Chen', text: "Thanks for the update on the new onboarding kits. They look great.", time: 'Yesterday', isSent: false }
      ]
    },
    {
      id: 3,
      name: 'David Ross',
      avatar: '',
      initials: 'DR',
      bg: 'bg-orange-500 text-white',
      time: 'Oct 12',
      unread: false,
      online: false,
      messages: [
        { id: 301, sender: 'David Ross', text: "Can we schedule a sync for next Tuesday?", time: 'Oct 12', isSent: false }
      ]
    }
  ]);

  const activeContact = contacts.find(c => c.id === activeContactId) || contacts[0];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Get current local time format (e.g. 11:20 AM)
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    const timeStr = `${hours}:${minutes} ${ampm}`;

    const newMsg = {
      id: Date.now(),
      sender: 'You',
      text: inputText,
      time: timeStr,
      isSent: true
    };

    // Update messages in state
    setContacts(prev => prev.map(c => {
      if (c.id === activeContactId) {
        return {
          ...c,
          time: timeStr,
          messages: [...c.messages, newMsg]
        };
      }
      return c;
    }));

    setInputText('');
    triggerToast('Message sent!');
  };

  const selectContact = (id) => {
    setActiveContactId(id);
    // Mark as read
    setContacts(prev => prev.map(c => c.id === id ? { ...c, unread: false } : c));
  };

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex bg-surface-container-lowest border border-outline-variant rounded-xl shadow-md overflow-hidden min-h-[600px] h-[calc(100vh-140px)] dark:bg-slate-900 dark:border-slate-800 animate-fade-in">
      
      {/* Left Column: Inbox List Panel */}
      <aside className="w-full md:w-[320px] shrink-0 border-r border-outline-variant flex flex-col dark:border-slate-800">
        
        {/* Inbox Header */}
        <div className="p-lg flex items-center justify-between border-b border-outline-variant/30 dark:border-slate-800">
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface dark:text-slate-100">Inbox</h2>
          <button 
            onClick={() => triggerToast("Start new conversation dialog coming soon!")}
            className="text-primary dark:text-blue-400 hover:opacity-85 flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">edit_square</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-lg py-sm">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] dark:text-slate-400">search</span>
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text" 
              placeholder="Search messages..." 
              className="w-full pl-xl pr-sm py-xs border border-outline-variant dark:border-slate-700 bg-surface-container-lowest dark:bg-slate-800 text-on-surface dark:text-slate-200 font-body-sm text-body-sm rounded focus:outline-none focus:ring-1 focus:ring-primary/40"
            />
          </div>
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto divide-y divide-outline-variant/30 dark:divide-slate-800/30">
          {filteredContacts.map(contact => {
            const isActive = contact.id === activeContactId;
            const lastMsg = contact.messages[contact.messages.length - 1];
            
            return (
              <div 
                key={contact.id}
                onClick={() => selectContact(contact.id)}
                className={`p-md flex items-start gap-md cursor-pointer transition-colors relative ${
                  isActive 
                    ? 'bg-primary/5 dark:bg-blue-600/10' 
                    : 'hover:bg-surface-container-low dark:hover:bg-slate-850'
                }`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  {contact.avatar ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant shadow-xs dark:border-slate-700">
                      <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${contact.bg}`}>
                      {contact.initials}
                    </div>
                  )}
                  {contact.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-surface-container-lowest dark:border-slate-900"></span>
                  )}
                </div>

                {/* Name & Snippet */}
                <div className="flex-1 min-w-0 pr-xs">
                  <div className="flex justify-between items-baseline gap-xs">
                    <h4 className={`text-body-sm truncate text-on-surface dark:text-slate-200 ${contact.unread ? 'font-bold' : ''}`}>
                      {contact.name}
                    </h4>
                    <span className="text-[10px] text-on-surface-variant dark:text-slate-500 shrink-0">
                      {contact.time}
                    </span>
                  </div>
                  <p className={`text-xs text-on-surface-variant truncate dark:text-slate-400 mt-xs ${contact.unread ? 'font-semibold text-on-surface dark:text-slate-100' : ''}`}>
                    {lastMsg ? lastMsg.text : ''}
                  </p>
                </div>

                {/* Unread indicator */}
                {contact.unread && (
                  <span className="absolute right-md top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full dark:bg-blue-500"></span>
                )}
              </div>
            );
          })}
          {filteredContacts.length === 0 && (
            <p className="text-center py-lg text-body-sm text-on-surface-variant dark:text-slate-500">No contacts found</p>
          )}
        </div>
      </aside>

      {/* Right Column: Chat View Area */}
      <main className="flex-1 flex flex-col bg-white dark:bg-slate-900">
        
        {/* Active Contact Header */}
        <header className="p-md flex items-center justify-between border-b border-outline-variant/30 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-md">
            {activeContact.avatar ? (
              <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant shadow-xs dark:border-slate-700">
                <img src={activeContact.avatar} alt={activeContact.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${activeContact.bg}`}>
                {activeContact.initials}
              </div>
            )}
            <div>
              <h3 className="font-bold text-body-sm text-on-surface dark:text-slate-200">{activeContact.name}</h3>
              <p className="text-xs text-on-surface-variant dark:text-slate-400 flex items-center gap-xs">
                <span className={`w-1.5 h-1.5 rounded-full ${activeContact.online ? 'bg-green-500' : 'bg-outline-variant dark:bg-slate-600'}`}></span>
                {activeContact.online ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => triggerToast("Chat options coming soon!")}
            className="text-on-surface-variant hover:text-primary dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
          >
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </header>

        {/* Messages Feed Area */}
        <div className="flex-1 overflow-y-auto p-lg space-y-lg bg-slate-50/50 dark:bg-slate-950/20">
          {/* Day divider */}
          <div className="flex justify-center select-none py-sm">
            <span className="bg-surface-container text-on-surface-variant dark:bg-slate-800 dark:text-slate-400 font-bold text-[10px] px-md py-1 rounded-full uppercase tracking-wider shadow-xs">
              Today
            </span>
          </div>

          {activeContact.messages.map((msg, index) => {
            const isSent = msg.isSent;
            
            return (
              <div key={msg.id || index} className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-sm items-end max-w-[70%] ${isSent ? 'flex-row-reverse' : ''}`}>
                  
                  {/* Bubble content */}
                  <div>
                    <div className={`p-md rounded-xl text-body-sm leading-relaxed ${
                      isSent 
                        ? 'bg-primary text-white rounded-br-none dark:bg-blue-600' 
                        : 'bg-surface-container-low border border-outline-variant/30 text-on-surface rounded-bl-none dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100'
                    }`}>
                      {msg.text}
                    </div>
                    <span className={`text-[10px] text-on-surface-variant dark:text-slate-500 mt-xs block ${isSent ? 'text-right pr-xs' : 'pl-xs'}`}>
                      {msg.time}
                    </span>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Input Control Bar */}
        <footer className="p-md border-t border-outline-variant/30 dark:border-slate-800 shrink-0">
          <form onSubmit={handleSendMessage} className="flex items-center gap-md">
            
            {/* Main Input Box wrapper */}
            <div className="flex-1 border border-outline-variant rounded-xl px-md py-xs bg-surface-container-lowest dark:bg-slate-800 dark:border-slate-700 flex items-center gap-sm">
              
              <button 
                type="button"
                onClick={() => triggerToast("Attachment dialog coming soon!")}
                className="text-on-surface-variant hover:text-primary dark:text-slate-400 dark:hover:text-blue-400 cursor-pointer flex items-center justify-center shrink-0"
              >
                <span className="material-symbols-outlined text-[20px]">attach_file</span>
              </button>

              <input 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                type="text" 
                placeholder="Type a message..."
                className="flex-1 min-w-0 bg-transparent text-on-surface dark:text-slate-100 font-body-sm text-body-sm focus:outline-none py-xs"
              />

              <button 
                type="button"
                onClick={() => triggerToast("Emojis panel coming soon!")}
                className="text-on-surface-variant hover:text-primary dark:text-slate-400 dark:hover:text-blue-400 cursor-pointer flex items-center justify-center shrink-0"
              >
                <span className="material-symbols-outlined text-[20px]">sentiment_satisfied</span>
              </button>

            </div>

            {/* Blue Square Send button */}
            <button 
              type="submit"
              className="w-10 h-10 bg-primary hover:bg-primary-container text-white rounded-xl flex items-center justify-center shrink-0 shadow transition-colors cursor-pointer dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              <span className="material-symbols-outlined text-[20px] transform -rotate-45 pl-[2px] pb-[2px]">send</span>
            </button>

          </form>
        </footer>

      </main>
      
    </div>
  );
}

export default Communication;
